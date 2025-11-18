import { StyleSheet, Dimensions } from 'react-native'

const { height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    position: 'relative',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height,
    backgroundColor: '#181818',
  },
})
