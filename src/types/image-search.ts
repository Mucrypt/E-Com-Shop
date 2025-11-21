export interface PickedImage {
  localUri: string
  width?: number
  height?: number
  mimeType?: string
}

export interface UploadedImageInfo {
  path: string
  publicUrl: string
}

export interface ImageClassificationLabel {
  label: string
  confidence: number
  boundingBox?: { x: number; y: number; width: number; height: number }
}

export interface ImageClassificationResult {
  labels: ImageClassificationLabel[]
  topLabel?: ImageClassificationLabel
  raw?: any
}

export interface ImageEmbeddingResult {
  embedding: number[]
  provider: string
  model: string
  dims: number
  tookMs?: number
}

export interface VisualSearchMatch {
  product_id: string
  score: number
  name?: string
  image_url?: string | null
  price?: number
}

export interface VisualSearchPipelineResult {
  image: UploadedImageInfo
  classification: ImageClassificationResult
  embedding?: ImageEmbeddingResult
  matches: VisualSearchMatch[]
  usedFallbackTextSearch: boolean
}
