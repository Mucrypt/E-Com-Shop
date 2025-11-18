import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0',
  },
  loadingPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240,240,240,0.7)',
    zIndex: 2,
  },
  loadingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
})
