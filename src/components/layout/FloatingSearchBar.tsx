import React, { useState, useRef } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
  Text,
  Platform,
} from 'react-native'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'

interface Props {
  value: string
  onChange: (text: string) => void
  placeholder?: string
  suggestions?: string[]
  onSubmit?: () => void
  onAIPress?: () => void
  onVoicePress?: () => void
  onCartPress?: () => void // legacy (will trigger if onImagePress not provided)
  onImagePress?: () => void // new: trigger image upload / visual search
  loadingImageSearch?: boolean // show spinner while pipeline runs
  inline?: boolean // render in normal flow below header instead of floating absolute
}

export default function FloatingSearchBar({
  value,
  onChange,
  placeholder = 'Search products...',
  suggestions = [],
  onSubmit,
  onAIPress,
  onVoicePress,
  onCartPress,
  onImagePress,
  loadingImageSearch = false,
  inline = false,
}: Props) {
  const [focused, setFocused] = useState(false)

  const fadeAnim = useRef(new Animated.Value(1)).current
  const expandAnim = useRef(new Animated.Value(1)).current

  const handleFocus = () => {
    setFocused(true)
    Animated.timing(expandAnim, {
      toValue: 1.05,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
  }

  const handleBlur = () => {
    setFocused(false)
    Animated.timing(expandAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
  }

  return (
    <>
      {/* MAIN FLOATING SEARCH WRAPPER */}
      <Animated.View
        style={[
          inline ? styles.inlineContainer : styles.container,
          { transform: [{ scale: expandAnim }] },
        ]}
      >
        <View style={styles.inner}>
          {/* Search Icon */}
          <FontAwesome name="search" size={18} color="#555" />

          {/* SEARCH INPUT FIELD */}
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            onChangeText={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            onSubmitEditing={onSubmit}
          />

          {/* AI SEARCH BUTTON (FontAwesome5 robot icon) */}
          <TouchableOpacity
            onPress={onAIPress}
            accessibilityRole='button'
            accessibilityLabel='AI search'
          >
            <FontAwesome5
              name='robot'
              size={18}
              color='#555'
              style={{ marginHorizontal: 6 }}
            />
          </TouchableOpacity>

          {/* VOICE SEARCH BUTTON */}
          <TouchableOpacity onPress={onVoicePress}>
            <FontAwesome
              name="microphone"
              size={18}
              color="#555"
              style={{ marginHorizontal: 6 }}
            />
          </TouchableOpacity>

          {/* CLEAR / CLOSE BUTTON (only when focused or has text) */}
          {(focused || value.length > 0) && (
            <TouchableOpacity
              onPress={() => {
                if (value.length > 0) {
                  onChange('')
                }
                setFocused(false)
              }}
              style={{ marginHorizontal: 6 }}
            >
              <FontAwesome name="close" size={16} color="#666" />
            </TouchableOpacity>
          )}

          {/* IMAGE SEARCH BUTTON (replaces cart) */}
          <TouchableOpacity
            onPress={onImagePress || onCartPress}
            accessibilityRole='button'
            accessibilityLabel='Image search'
          >
            {loadingImageSearch ? (
              <FontAwesome
                name="spinner"
                size={18}
                color="#777"
                style={{ marginLeft: 4 }}
              />
            ) : (
              <FontAwesome
                name="camera"
                size={18}
                color="#555"
                style={{ marginLeft: 4 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* SUGGESTIONS DROPDOWN */}
      {focused && suggestions.length > 0 && (
        <View style={inline ? styles.inlineSuggestionBox : styles.suggestionBox}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => onChange(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 70,
    left: 16,
    right: 16,
    zIndex: 9999,
    padding: 8,

    borderRadius: 16,
  },
  inlineContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 4,
  },

  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  input: {
    flex: 1,
    color: '#111',
    fontSize: 15,
    marginLeft: 10,
  },

  suggestionBox: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 100 : 120,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  inlineSuggestionBox: {
    marginTop: 6,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  suggestionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
})
