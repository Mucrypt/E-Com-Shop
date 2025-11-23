// app/jobs/index.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { NavigationHeader } from '../../components/common'

const { width } = Dimensions.get('window')

type JobItem = {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: string
  image: string
  isSponsored?: boolean
}

const mockJobs: JobItem[] = [
  {
    id: '1',
    title: 'Senior React Native Engineer',
    company: 'Mukulah Labs',
    location: 'Remote · Europe',
    salary: '€60k – €90k',
    type: 'Full-time · Remote',
    image:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
    isSponsored: true,
  },
  {
    id: '2',
    title: 'Site Engineer – Smart Infrastructure',
    company: 'Amplia Infrastructures',
    location: 'Florence, Italy',
    salary: '€35k – €50k',
    type: 'Full-time · On-site',
    image:
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Product Designer (Mobile First)',
    company: 'Mukulah Studio',
    location: 'Milan, Italy',
    salary: '€45k – €70k',
    type: 'Hybrid · Design',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'AI Research Intern – Vision & 3D',
    company: 'Mukulah AI',
    location: 'Remote · Global',
    salary: 'Competitive',
    type: 'Internship · Remote',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Warehouse & Logistics Coordinator',
    company: 'Mukulah Build & Ship',
    location: 'Douala, Cameroon',
    salary: 'Negotiable',
    type: 'Full-time · On-site',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
  },
]

const filterChips = [
  'Filters',
  'Role',
  'Contract',
  'Salary',
  'Remote',
  'Experience',
  'Full-time',
]

const sortOptions = ['Best match', 'Newest', 'Salary (high)', 'Nearby']

export default function JobsHomeScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSort] = useState(sortOptions[0])

  const renderJobItem = ({ item }: { item: JobItem }) => (
    <TouchableOpacity style={styles.jobCard} activeOpacity={0.85}>
      <View style={styles.jobImageWrapper}>
        <Image source={{ uri: item.image }} style={styles.jobImage} />
        {item.isSponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>Sponsored</Text>
          </View>
        )}
        <TouchableOpacity style={styles.saveJobButton}>
          <FontAwesome name='heart-o' size={16} color='#10B981' />
        </TouchableOpacity>
      </View>

      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.jobCompany}>{item.company}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
        <View style={styles.jobMetaRow}>
          <Text style={styles.jobType}>{item.type}</Text>
          {item.salary && <Text style={styles.jobSalary}>{item.salary}</Text>}
        </View>
        <View style={styles.jobActionsRow}>
          <TouchableOpacity style={styles.alertButton}>
            <FontAwesome name='bell-o' size={14} color='#050509' />
            <Text style={styles.alertButtonText}>Notify me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Quick apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.root}>
      <NavigationHeader 
        title="Jobs"
        showBackButton={false}
        rightComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                // TODO: navigate to notifications screen
              }}
            >
              <FontAwesome name='bell-o' size={18} color='#E5E7EB' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSidebarOpen(true)}
            >
              <FontAwesome name='bars' size={20} color='#E5E7EB' />
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <FontAwesome name='search' size={16} color='#6B7280' />
          <TextInput
            placeholder='Search jobs, companies, skills...'
            placeholderTextColor='#6B7280'
            style={styles.searchInput}
          />
        </View>
        
        {/* Tabs */}
        <View style={styles.headerTabs}>
          <TouchableOpacity style={styles.headerTabActive}>
            <Text style={styles.headerTabActiveText}>Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerTab}>
            <Text style={styles.headerTabText}>Candidates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerTab}>
            <Text style={styles.headerTabText}>Services</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST + FILTERS */}
      <FlatList
        data={mockJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Location & category row */}
            <View style={styles.locationRow}>
              <View>
                <Text style={styles.locationLabel}>Jobs & Services</Text>
                <View style={styles.locationInline}>
                  <FontAwesome name='map-marker' size={13} color='#9CA3AF' />
                  <Text style={styles.locationValue}>All locations</Text>
                  <TouchableOpacity>
                    <Text style={styles.locationChange}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {filterChips.map((chip) => (
                <TouchableOpacity key={chip} style={styles.filterChip}>
                  <Text style={styles.filterChipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Sort row */}
            <View style={styles.sortRow}>
              <TouchableOpacity style={styles.sortLeft}>
                <Text style={styles.sortLabel}>Sort</Text>
                <Text style={styles.sortValue}>{activeSort}</Text>
                <FontAwesome
                  name='chevron-down'
                  size={10}
                  color='#9CA3AF'
                />
              </TouchableOpacity>
              <Text style={styles.resultCount}>130,086 results</Text>
              <View style={styles.viewToggle}>
                <FontAwesome name='th-large' size={16} color='#6B7280' />
                <MaterialIcons
                  name='view-agenda'
                  size={18}
                  color='#F9FAFB'
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
          </>
        }
      />

      {/* JOBS SIDEBAR (ONLY FOR JOBS LAYOUT) */}
      <Modal
        visible={sidebarOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View style={styles.sidebarOverlay}>
          <TouchableOpacity
            style={styles.sidebarBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
          />
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Jobs & Services</Text>
              <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                <FontAwesome name='close' size={20} color='#9CA3AF' />
              </TouchableOpacity>
            </View>

            <Text style={styles.sidebarSectionLabel}>My space</Text>
            <SidebarItem icon='user-circle-o' label='My job profile' />
            <SidebarItem icon='file-text-o' label='Applications' />
            <SidebarItem icon='bookmark-o' label='Saved jobs & searches' />
            <SidebarItem icon='briefcase' label='Jobs I posted' />

            <Text style={styles.sidebarSectionLabel}>Discover</Text>
            <SidebarItem icon='map-marker' label='Jobs near me' />
            <SidebarItem icon='globe' label='Remote & global roles' />
            <SidebarItem icon='graduation-cap' label='Internships & juniors' />
            <SidebarItem icon='wrench' label='Skilled trades & services' />

            <Text style={styles.sidebarSectionLabel}>Settings</Text>
            <SidebarItem icon='bell-o' label='Alert preferences' />
            <SidebarItem icon='cog' label='Job center settings' />
          </View>
        </View>
      </Modal>
    </View>
  )
}

// Sidebar row
const SidebarItem: React.FC<{ icon: string; label: string }> = ({
  icon,
  label,
}) => (
  <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.75}>
    <FontAwesome name={icon as any} size={18} color='#E5E7EB' />
    <Text style={styles.sidebarItemText}>{label}</Text>
    <FontAwesome name='chevron-right' size={12} color='#4B5563' />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050509',
  },
  searchSection: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#050509',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#E5E7EB',
    fontSize: 14,
  },
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 999,
    padding: 2,
    alignSelf: 'center',
  },
  headerTab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  headerTabActive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F5C451',
  },
  headerTabText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  headerTabActiveText: {
    fontSize: 11,
    color: '#050509',
    fontWeight: '700',
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  locationRow: {
    marginTop: 6,
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  locationInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationValue: {
    fontSize: 13,
    color: '#F9FAFB',
    marginLeft: 4,
  },
  locationChange: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 8,
  },

  chipRow: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  filterChipText: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '500',
  },

  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 4,
  },
  sortValue: {
    fontSize: 12,
    color: '#F9FAFB',
    marginRight: 4,
  },
  resultCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#0B0F1A',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#111827',
  },
  jobImageWrapper: {
    width: 86,
    marginRight: 10,
  },
  jobImage: {
    width: 86,
    height: 86,
    borderRadius: 12,
  },
  sponsoredBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sponsoredText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#050509',
  },
  saveJobButton: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#050509AA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  jobCompany: {
    fontSize: 12,
    color: '#D1D5DB',
    marginBottom: 2,
  },
  jobLocation: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  jobMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobType: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  jobSalary: {
    fontSize: 11,
    color: '#F5C451',
    fontWeight: '600',
  },
  jobActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  alertButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#050509',
    marginLeft: 4,
  },
  applyButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#374151',
  },
  applyButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E5E7EB',
  },

  // sidebar
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
  },
  sidebar: {
    width: width * 0.78,
    backgroundColor: '#050509',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  sidebarSectionLabel: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  sidebarItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#E5E7EB',
  },
})
