import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#2E8C83',
    backgroundColor: '#e8f5f3',
  },
  creatorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 6,
  },
  followers: {
    fontSize: 12,
    color: '#b2dfdb',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#2E8C83',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 10,
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  hashtag: {
    color: '#4ECDC4',
    fontSize: 13,
    marginRight: 8,
    fontWeight: '600',
  },
  soundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  soundName: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
    maxWidth: 120,
  },
  timestamp: {
    color: '#b2dfdb',
    fontSize: 12,
    marginLeft: 4,
  },
})
