import { StyleSheet, Platform } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.18,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundColor: '#000',
    borderRadius: 18,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: 320,
    backgroundColor: '#e8f5f3',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 12,
  },
  rightSection: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    marginRight: 18,
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#2E8C83',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
})
