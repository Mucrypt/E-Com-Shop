// components/services/ServiceFiltersModal.tsx
import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Spacing } from '../../constants'

export type ServiceFilters = {
  budget: 'any' | 'low' | 'mid' | 'high'
  delivery: 'any' | '24h' | '3d' | '7d'
  rating: 'any' | '4plus' | '4_5plus'
  proOnly: boolean
  onlineNow: boolean
}

type Props = {
  visible: boolean
  initialFilters: ServiceFilters
  onClose: () => void
  onApply: (filters: ServiceFilters) => void
}

const defaultFilters: ServiceFilters = {
  budget: 'any',
  delivery: 'any',
  rating: 'any',
  proOnly: false,
  onlineNow: false,
}

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}
  >
    <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
  </TouchableOpacity>
)

const ToggleRow = ({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) => (
  <TouchableOpacity onPress={onPress} style={styles.toggleRow}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <View style={[styles.toggleSwitch, active && styles.toggleSwitchOn]}>
      <View style={[styles.toggleThumb, active && styles.toggleThumbOn]} />
    </View>
  </TouchableOpacity>
)

const ServiceFiltersModal: React.FC<Props> = ({
  visible,
  initialFilters,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<ServiceFilters>(defaultFilters)

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters)
    }
  }, [visible, initialFilters])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleClear = () => {
    const cleared = defaultFilters
    setFilters(cleared)
    onApply(cleared)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Budget */}
            <Text style={styles.sectionTitle}>Budget (per project)</Text>
            <View style={styles.chipRow}>
              <FilterChip
                label="Any"
                active={filters.budget === 'any'}
                onPress={() => setFilters((f) => ({ ...f, budget: 'any' }))}
              />
              <FilterChip
                label="$ • Entry"
                active={filters.budget === 'low'}
                onPress={() => setFilters((f) => ({ ...f, budget: 'low' }))}
              />
              <FilterChip
                label="$$ • Standard"
                active={filters.budget === 'mid'}
                onPress={() => setFilters((f) => ({ ...f, budget: 'mid' }))}
              />
              <FilterChip
                label="$$$ • Premium"
                active={filters.budget === 'high'}
                onPress={() => setFilters((f) => ({ ...f, budget: 'high' }))}
              />
            </View>

            {/* Delivery */}
            <Text style={styles.sectionTitle}>Delivery time</Text>
            <View style={styles.chipRow}>
              <FilterChip
                label="Any"
                active={filters.delivery === 'any'}
                onPress={() => setFilters((f) => ({ ...f, delivery: 'any' }))}
              />
              <FilterChip
                label="24 hours"
                active={filters.delivery === '24h'}
                onPress={() => setFilters((f) => ({ ...f, delivery: '24h' }))}
              />
              <FilterChip
                label="Up to 3 days"
                active={filters.delivery === '3d'}
                onPress={() => setFilters((f) => ({ ...f, delivery: '3d' }))}
              />
              <FilterChip
                label="Up to 7 days"
                active={filters.delivery === '7d'}
                onPress={() => setFilters((f) => ({ ...f, delivery: '7d' }))}
              />
            </View>

            {/* Rating */}
            <Text style={styles.sectionTitle}>Seller rating</Text>
            <View style={styles.chipRow}>
              <FilterChip
                label="Any"
                active={filters.rating === 'any'}
                onPress={() => setFilters((f) => ({ ...f, rating: 'any' }))}
              />
              <FilterChip
                label="4★ and up"
                active={filters.rating === '4plus'}
                onPress={() => setFilters((f) => ({ ...f, rating: '4plus' }))}
              />
              <FilterChip
                label="4.5★ and up"
                active={filters.rating === '4_5plus'}
                onPress={() => setFilters((f) => ({ ...f, rating: '4_5plus' }))}
              />
            </View>

            {/* Toggles */}
            <View style={{ marginTop: 12 }}>
              <ToggleRow
                label="Pro / verified experts only"
                active={filters.proOnly}
                onPress={() =>
                  setFilters((f) => ({ ...f, proOnly: !f.proOnly }))
                }
              />
              <ToggleRow
                label="Online now"
                active={filters.onlineNow}
                onPress={() =>
                  setFilters((f) => ({ ...f, onlineNow: !f.onlineNow }))
                }
              />
            </View>
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Show results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ServiceFiltersModal

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay.backdrop,
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  sheetTitle: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  sheetContent: {
    maxHeight: 420,
  },
  sectionTitle: {
    color: Colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing[2],
    marginBottom: Spacing[1],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  chipActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  chipLabel: {
    fontSize: 11,
    color: Colors.text.tertiary,
  },
  chipLabelActive: {
    color: Colors.background.primary,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  toggleLabel: {
    color: Colors.text.secondary,
    fontSize: 13,
  },
  toggleSwitch: {
    width: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background.quaternary,
    justifyContent: 'center',
    padding: 3,
  },
  toggleSwitchOn: {
    backgroundColor: Colors.status.success,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.text.muted,
  },
  toggleThumbOn: {
    backgroundColor: Colors.text.primary,
    alignSelf: 'flex-end',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: Spacing[3],
    gap: Spacing[2],
  },
  clearButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.muted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2],
  },
  clearButtonText: {
    color: Colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    borderRadius: 999,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2],
  },
  applyButtonText: {
    color: Colors.background.primary,
    fontSize: 13,
    fontWeight: '700',
  },
})
