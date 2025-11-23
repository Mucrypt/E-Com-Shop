import React from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Platform 
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Colors, Typography, Spacing } from '../../constants'

interface NavigationHeaderProps {
  title?: string
  showBackButton?: boolean
  onBackPress?: () => void
  backgroundColor?: string
  textColor?: string
  statusBarStyle?: 'light-content' | 'dark-content'
  rightComponent?: React.ReactNode
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  backgroundColor = Colors.background.primary,
  textColor = Colors.text.primary,
  statusBarStyle = 'light-content',
  rightComponent,
}) => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else if (router.canGoBack()) {
      router.back()
    }
  }

  return (
    <>
      <StatusBar 
        barStyle={statusBarStyle} 
        backgroundColor={backgroundColor}
        translucent={true}
      />
      <View 
        style={[
          styles.container, 
          { 
            backgroundColor,
            paddingTop: insets.top
          }
        ]}
      >
        <View style={styles.content}>
          {/* Left Section - Back Button */}
          <View style={styles.leftSection}>
            {showBackButton && router.canGoBack() && (
              <TouchableOpacity 
                onPress={handleBackPress}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color={textColor} 
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section - Title */}
          <View style={styles.centerSection}>
            {title && (
              <Text 
                style={[
                  styles.title, 
                  { color: textColor }
                ]} 
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
          </View>

          {/* Right Section - Custom Component */}
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    minHeight: 56,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
})

export default NavigationHeader