import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#2E8C83',
    fontWeight: '600',
  },
  specialTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#2E8C83',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
})
