// components/travel/TravelSidebar.tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

type Props = {
  visible: boolean
  onClose: () => void
}

const TravelSidebar: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sidebar}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Travel menu</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>Discover</Text>
            <SidebarItem icon="globe" label="Explore destinations" />
            <SidebarItem icon="hotel" label="Stays & hotels" />
            <SidebarItem icon="plane" label="Flights & airlines" />
            <SidebarItem icon="train" label="Trains & buses" />
            <SidebarItem icon="car" label="Car rentals & rides" />
            <SidebarItem icon="map" label="Road trips & routes" />
            <SidebarItem icon="compass" label="Experiences & tours" />

            <Text style={styles.sectionLabel}>For businesses</Text>
            <SidebarItem icon="building-o" label="List your hotel" />
            <SidebarItem icon="cutlery" label="Restaurants & bars" />
            <SidebarItem icon="taxi" label="Transport companies" />
            <SidebarItem icon="briefcase" label="Corporate travel" />

            <Text style={styles.sectionLabel}>Account & help</Text>
            <SidebarItem icon="user-circle-o" label="Profile" />
            <SidebarItem icon="bell-o" label="Alerts & price tracking" />
            <SidebarItem icon="question-circle-o" label="Support center" />
            <SidebarItem icon="info-circle" label="Travel safety & rules" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const SidebarItem = ({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name']
  label: string
}) => (
  <TouchableOpacity style={styles.itemRow} activeOpacity={0.8}>
    <View style={styles.itemIconCircle}>
      <FontAwesome name={icon} size={15} color="#F5C451" />
    </View>
    <Text style={styles.itemLabel}>{label}</Text>
    <FontAwesome name="angle-right" size={16} color="#4B5563" />
  </TouchableOpacity>
)

export default TravelSidebar

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sidebar: {
    width: '78%',
    backgroundColor: '#050509',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderLeftWidth: 1,
    borderColor: '#111827',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 14,
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  itemIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemLabel: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 13,
  },
})
