import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export type MainFeatureItem = {
  key: string
  label: string
  icon: React.ComponentProps<typeof FontAwesome>['name']
  onPress?: (event: GestureResponderEvent) => void
}

type Props = {
  items: MainFeatureItem[]
}

const MainFeatureGrid: React.FC<Props> = ({ items }) => {
  return (
    <View style={styles.gridSection}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.gridItem}
          activeOpacity={0.8}
          onPress={item.onPress}
        >
          <View style={styles.gridIconCircle}>
            <FontAwesome name={item.icon} size={20} color='#F5C451' />
          </View>
          <Text style={styles.gridLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  gridSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  gridItem: {
    width: '25%',
    paddingHorizontal: 4,
    marginBottom: 12,
    alignItems: 'center',
  },
  gridIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 11,
    color: '#E5E7EB',
    textAlign: 'center',
  },
})

export default MainFeatureGrid
