import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as ImageManipulator from 'expo-image-manipulator'
import { supabase } from '../lib/supabase'
import type { PickedImage, UploadedImageInfo, ImageClassificationResult, ImageEmbeddingResult, VisualSearchPipelineResult, VisualSearchMatch } from '../types/image-search'

// CONFIG
const STORAGE_BUCKET = 'visual-search'
const CLASSIFY_FUNCTION = 'image_classify'
const EMBED_FUNCTION = 'image_embed'
const SEARCH_FUNCTION = 'image_search'

export async function requestMediaPermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  return status === 'granted'
}

export async function pickImage(): Promise<PickedImage | null> {
  const hasPermission = await requestMediaPermissions()
  if (!hasPermission) return null
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: false,
  })
  if (result.canceled || !result.assets?.length) return null
  const asset = result.assets[0]
  return { localUri: asset.uri, width: asset.width, height: asset.height }
}

async function compressImage(localUri: string): Promise<string> {
  try {
    const manip = await ImageManipulator.manipulateAsync(localUri, [], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG })
    return manip.uri
  } catch {
    return localUri
  }
}

export async function uploadImage(localUri: string): Promise<UploadedImageInfo> {
  const compressedUri = await compressImage(localUri)
  const fileData = await FileSystem.readAsStringAsync(compressedUri, { encoding: FileSystem.EncodingType.Base64 })
  const fileName = `vs-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const filePath = `${fileName}`
  const arrayBuffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0))

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, arrayBuffer, {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) throw error
  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
  return { path: filePath, publicUrl: pub.publicUrl }
}

async function callFunction<T>(fn: string, payload: any): Promise<T> {
  const res = await fetch(`${supabase.functionsUrl}/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    throw new Error(`Function ${fn} failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function classifyImage(image: UploadedImageInfo): Promise<ImageClassificationResult> {
  return callFunction<ImageClassificationResult>(CLASSIFY_FUNCTION, { imageUrl: image.publicUrl })
}

export async function embedImage(image: UploadedImageInfo): Promise<ImageEmbeddingResult> {
  return callFunction<ImageEmbeddingResult>(EMBED_FUNCTION, { imageUrl: image.publicUrl })
}

export async function searchSimilar(embedding: ImageEmbeddingResult, topK = 12): Promise<VisualSearchMatch[]> {
  const result = await callFunction<{ matches: VisualSearchMatch[] }>(SEARCH_FUNCTION, { embedding: embedding.embedding, topK })
  return result.matches
}

async function fallbackTextSearch(classification: ImageClassificationResult): Promise<VisualSearchMatch[]> {
  const keyword = classification.topLabel?.label || 'product'
  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url, price')
    .ilike('name', `%${keyword}%`)
    .limit(12)
  if (error) return []
  return (data || []).map(p => ({ product_id: p.id, score: 0.5, name: p.name, image_url: p.image_url, price: p.price }))
}

export async function visualSearchPipeline(): Promise<VisualSearchPipelineResult | null> {
  const picked = await pickImage()
  if (!picked) return null
  const uploaded = await uploadImage(picked.localUri)
  const classification = await classifyImage(uploaded)
  let embedding: ImageEmbeddingResult | undefined
  let matches: VisualSearchMatch[] = []
  let usedFallbackTextSearch = false
  try {
    embedding = await embedImage(uploaded)
    matches = await searchSimilar(embedding)
  } catch (e) {
    usedFallbackTextSearch = true
    matches = await fallbackTextSearch(classification)
  }
  return { image: uploaded, classification, embedding, matches, usedFallbackTextSearch }
}
