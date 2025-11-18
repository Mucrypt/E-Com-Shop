import React from 'react'
import { View, ActivityIndicator, ViewProps } from 'react-native'
import { styles } from '../../../../src/styles/LoadingSpinner.styles'

interface LoadingSpinnerProps extends ViewProps {
  size?: 'small' | 'large' | number
  color?: string
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#2E8C83',
  fullScreen = false,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        fullScreen ? styles.fullScreenContainer : styles.container,
        style,
      ]}
      {...props}
    >
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default LoadingSpinner
