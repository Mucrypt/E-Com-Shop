import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

type Props = {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

const TrendingPillsRow: React.FC<Props> = ({ tabs, active, onChange }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {tabs.map((tab) => {
          const isActive = tab === active
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onChange(tab)}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  row: {
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginRight: 8,
    backgroundColor: '#050509',
  },
  chipActive: {
    backgroundColor: '#F5C451',
    borderColor: '#F5C451',
  },
  chipText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  chipTextActive: {
    color: '#050509',
    fontWeight: '700',
  },
})

export default TrendingPillsRow
