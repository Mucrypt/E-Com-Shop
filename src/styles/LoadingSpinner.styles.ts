import { StyleSheet, Platform } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spinner: {
    shadowColor: '#2E8C83',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 16,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#2E8C83',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
})
