// app/(services)/courses.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  FlatList,
  Dimensions,
} from 'react-native'
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

type Course = {
  id: string
  title: string
  instructor: string
  instructorAvatar: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  rating: number
  students: number
  price: number
  originalPrice?: number
  thumbnail: string
  category: string
  isLive: boolean
  hasCertificate: boolean
  hasAI: boolean
  progress?: number
  tags: string[]
}

type LearningPath = {
  id: string
  title: string
  description: string
  courses: number
  duration: string
  level: string
  thumbnail: string
  progress: number
  color: string
}

type Mentor = {
  id: string
  name: string
  title: string
  avatar: string
  rating: number
  students: number
  expertise: string[]
  isOnline: boolean
  hourlyRate: number
}

const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'AI-Powered Full Stack Development with Next.js & Python',
    instructor: 'Dr. Sarah Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b03c?w=150&h=150&fit=crop&crop=face',
    duration: '42h 30m',
    level: 'Advanced',
    rating: 4.9,
    students: 23847,
    price: 89.99,
    originalPrice: 199.99,
    thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
    category: 'Development',
    isLive: true,
    hasCertificate: true,
    hasAI: true,
    tags: ['AI', 'Full Stack', 'Next.js', 'Python']
  },
  {
    id: '2',
    title: 'Advanced UI/UX Design with Figma & Framer',
    instructor: 'Marcus Williams',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    duration: '28h 45m',
    level: 'Intermediate',
    rating: 4.8,
    students: 18934,
    price: 69.99,
    originalPrice: 149.99,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    category: 'Design',
    isLive: false,
    hasCertificate: true,
    hasAI: true,
    progress: 65,
    tags: ['UI/UX', 'Figma', 'Framer', 'Design System']
  },
  {
    id: '3',
    title: 'Blockchain Development & Smart Contracts Mastery',
    instructor: 'Alex Thompson',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    duration: '36h 20m',
    level: 'Expert',
    rating: 4.9,
    students: 12456,
    price: 129.99,
    originalPrice: 249.99,
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    category: 'Blockchain',
    isLive: true,
    hasCertificate: true,
    hasAI: false,
    tags: ['Blockchain', 'Smart Contracts', 'Solidity', 'Web3']
  }
]

const learningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'AI Engineer Career Path',
    description: 'Master AI/ML from fundamentals to deployment',
    courses: 12,
    duration: '6 months',
    level: 'Intermediate to Expert',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
    progress: 25,
    color: '#8B5CF6'
  },
  {
    id: '2',
    title: 'Full Stack Developer Pro',
    description: 'Complete web development mastery',
    courses: 8,
    duration: '4 months',
    level: 'Beginner to Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop',
    progress: 0,
    color: '#10B981'
  }
]

const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Senior AI Engineer at Google',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b03c?w=100&h=100&fit=crop&crop=face',
    rating: 4.9,
    students: 2847,
    expertise: ['AI/ML', 'Python', 'TensorFlow'],
    isOnline: true,
    hourlyRate: 150
  },
  {
    id: '2',
    name: 'Marcus Williams',
    title: 'Lead Designer at Figma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4.8,
    students: 1934,
    expertise: ['UI/UX', 'Figma', 'Design Systems'],
    isOnline: false,
    hourlyRate: 120
  }
]

const categories = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'ai', label: 'AI/ML', icon: 'cpu' },
  { id: 'development', label: 'Development', icon: 'code' },
  { id: 'design', label: 'Design', icon: 'palette' },
  { id: 'business', label: 'Business', icon: 'trending-up' },
  { id: 'blockchain', label: 'Blockchain', icon: 'link-2' },
]

export default function CoursesScreen() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const CourseCard = ({ course, isGrid = true }: { course: Course; isGrid?: boolean }) => (
    <TouchableOpacity
      style={[styles.courseCard, isGrid ? styles.courseCardGrid : styles.courseCardList]}
      activeOpacity={0.8}
    >
      <View style={[styles.courseImageContainer, isGrid ? styles.courseImageGrid : styles.courseImageList]}>
        <ImageBackground
          source={{ uri: course.thumbnail }}
          style={styles.courseImage}
          imageStyle={styles.courseImageInner}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.courseImageOverlay}
          />
          
          {/* Badges */}
          <View style={styles.courseBadges}>
            {course.isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
            {course.hasAI && (
              <View style={styles.aiBadge}>
                <MaterialCommunityIcons name="robot" size={12} color="#8B5CF6" />
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            )}
          </View>

          {/* Duration */}
          <View style={styles.durationBadge}>
            <Feather name="clock" size={10} color="#F9FAFB" />
            <Text style={styles.durationText}>{course.duration}</Text>
          </View>

          {/* Progress bar if in progress */}
          {course.progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{course.progress}%</Text>
            </View>
          )}
        </ImageBackground>
      </View>

      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseLevel}>{course.level}</Text>
          <View style={styles.courseRating}>
            <Feather name="star" size={12} color="#FBBF24" />
            <Text style={styles.ratingText}>{course.rating}</Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.courseTitle}>
          {course.title}
        </Text>

        <View style={styles.instructorRow}>
          <Image source={{ uri: course.instructorAvatar }} style={styles.instructorAvatar} />
          <Text style={styles.instructorName}>{course.instructor}</Text>
          {course.hasCertificate && (
            <MaterialCommunityIcons name="certificate" size={14} color="#F5C451" />
          )}
        </View>

        <View style={styles.courseFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${course.price}</Text>
            {course.originalPrice && (
              <Text style={styles.originalPrice}>${course.originalPrice}</Text>
            )}
          </View>
          <Text style={styles.studentsCount}>{course.students.toLocaleString()} students</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {course.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )

  const LearningPathCard = ({ path }: { path: LearningPath }) => (
    <TouchableOpacity style={styles.pathCard} activeOpacity={0.8}>
      <LinearGradient
        colors={[path.color + '20', path.color + '10']}
        style={styles.pathGradient}
      >
        <ImageBackground
          source={{ uri: path.thumbnail }}
          style={styles.pathImage}
          imageStyle={styles.pathImageInner}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.pathOverlay}
          />
        </ImageBackground>
        
        <View style={styles.pathContent}>
          <Text style={styles.pathTitle}>{path.title}</Text>
          <Text style={styles.pathDescription}>{path.description}</Text>
          
          <View style={styles.pathMeta}>
            <Text style={styles.pathMetaText}>{path.courses} courses</Text>
            <Text style={styles.pathMetaText}>•</Text>
            <Text style={styles.pathMetaText}>{path.duration}</Text>
          </View>

          {path.progress > 0 && (
            <View style={styles.pathProgressContainer}>
              <View style={styles.pathProgressBar}>
                <View style={[styles.pathProgressFill, { 
                  width: `${path.progress}%`,
                  backgroundColor: path.color
                }]} />
              </View>
              <Text style={styles.pathProgressText}>{path.progress}% complete</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  const MentorCard = ({ mentor }: { mentor: Mentor }) => (
    <TouchableOpacity style={styles.mentorCard} activeOpacity={0.8}>
      <View style={styles.mentorHeader}>
        <View style={styles.mentorAvatarContainer}>
          <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatar} />
          {mentor.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{mentor.name}</Text>
          <Text style={styles.mentorTitle}>{mentor.title}</Text>
          <View style={styles.mentorRating}>
            <Feather name="star" size={12} color="#FBBF24" />
            <Text style={styles.mentorRatingText}>{mentor.rating}</Text>
            <Text style={styles.mentorStudents}>({mentor.students} students)</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.mentorExpertise}>
        {mentor.expertise.map((skill, index) => (
          <View key={index} style={styles.expertiseTag}>
            <Text style={styles.expertiseText}>{skill}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.mentorFooter}>
        <Text style={styles.hourlyRate}>${mentor.hourlyRate}/hr</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Session</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Master Tomorrow's Skills Today</Text>
                <Text style={styles.heroSubtitle}>
                  AI-powered learning paths, live mentoring, and industry certifications
                </Text>
                <View style={styles.heroFeatures}>
                  <View style={styles.heroFeature}>
                    <MaterialCommunityIcons name="robot" size={16} color="#C4B5FD" />
                    <Text style={styles.heroFeatureText}>AI Tutoring</Text>
                  </View>
                  <View style={styles.heroFeature}>
                    <Feather name="video" size={16} color="#C4B5FD" />
                    <Text style={styles.heroFeatureText}>Live Sessions</Text>
                  </View>
                </View>
              </View>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop' }}
                style={styles.heroImage}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Search & Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={16} color="#9CA3AF" />
            <TextInput
              placeholder="Search courses, skills, instructors..."
              placeholderTextColor="#6B7280"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Feather name="sliders" size={16} color="#050509" />
            </TouchableOpacity>
          </View>

          <View style={styles.viewModeContainer}>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeActive]}
              onPress={() => setViewMode('grid')}
            >
              <Feather name="grid" size={16} color={viewMode === 'grid' ? '#050509' : '#9CA3AF'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeActive]}
              onPress={() => setViewMode('list')}
            >
              <Feather name="list" size={16} color={viewMode === 'list' ? '#050509' : '#9CA3AF'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                activeCategory === category.id && styles.categoryChipActive
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Feather
                name={category.icon as any}
                size={14}
                color={activeCategory === category.id ? '#050509' : '#9CA3AF'}
              />
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.categoryTextActive
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Learning Paths */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎯 Curated Learning Paths</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={learningPaths}
          renderItem={({ item }) => <LearningPathCard path={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.pathsList}
        />

        {/* Featured Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Featured Courses</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={viewMode === 'grid' ? styles.coursesGrid : styles.coursesList}>
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} isGrid={viewMode === 'grid'} />
          ))}
        </View>

        {/* Live Mentoring */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👨‍🏫 Live Mentoring</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View all mentors</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={mentors}
          renderItem={({ item }) => <MentorCard mentor={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.mentorsList}
        />

        {/* Achievement Section */}
        <View style={styles.achievementSection}>
          <LinearGradient
            colors={['#059669', '#047857']}
            style={styles.achievementGradient}
          >
            <View style={styles.achievementContent}>
              <MaterialCommunityIcons name="trophy" size={32} color="#FBBF24" />
              <Text style={styles.achievementTitle}>Earn Industry Certificates</Text>
              <Text style={styles.achievementSubtitle}>
                Get recognized by top companies with our verified certificates
              </Text>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
                <Feather name="arrow-right" size={14} color="#059669" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050509',
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Hero Section
  heroSection: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroText: {
    flex: 1,
    marginRight: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 16,
    lineHeight: 20,
  },
  heroFeatures: {
    flexDirection: 'row',
    gap: 16,
  },
  heroFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroFeatureText: {
    fontSize: 12,
    color: '#C4B5FD',
    fontWeight: '600',
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  // Search Section
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    color: '#E5E7EB',
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: '#F5C451',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewModeActive: {
    backgroundColor: '#F5C451',
  },

  // Categories
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#F5C451',
    borderColor: '#F5C451',
  },
  categoryText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#050509',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  sectionLink: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Learning Paths
  pathsList: {
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  pathCard: {
    width: width * 0.75,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pathGradient: {
    height: 180,
  },
  pathImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
  },
  pathImageInner: {
    borderRadius: 12,
  },
  pathOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pathContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  pathDescription: {
    fontSize: 12,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  pathMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pathMetaText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  pathProgressContainer: {
    gap: 4,
  },
  pathProgressBar: {
    height: 4,
    backgroundColor: '#1F2937',
    borderRadius: 2,
  },
  pathProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  pathProgressText: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  // Courses
  coursesGrid: {
    paddingHorizontal: 14,
    marginBottom: 24,
    gap: 12,
  },
  coursesList: {
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  courseCard: {
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
    overflow: 'hidden',
  },
  courseCardGrid: {
    marginBottom: 12,
  },
  courseCardList: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseImageContainer: {
    position: 'relative',
  },
  courseImageGrid: {
    height: 160,
  },
  courseImageList: {
    width: 120,
    height: 90,
  },
  courseImage: {
    flex: 1,
  },
  courseImageInner: {
    resizeMode: 'cover',
  },
  courseImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  courseBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FCA5A5',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C4B5FD',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  durationText: {
    fontSize: 10,
    color: '#F9FAFB',
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1F2937',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  courseContent: {
    padding: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseLevel: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
    lineHeight: 18,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  instructorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  instructorName: {
    flex: 1,
    fontSize: 11,
    color: '#9CA3AF',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F5C451',
  },
  originalPrice: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  studentsCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#1F2937',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 9,
    color: '#9CA3AF',
  },

  // Mentors
  mentorsList: {
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  mentorCard: {
    width: 240,
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 16,
    marginRight: 12,
  },
  mentorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mentorAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  mentorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0B0F1A',
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  mentorTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  mentorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mentorRatingText: {
    fontSize: 11,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  mentorStudents: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  mentorExpertise: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  expertiseTag: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expertiseText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  mentorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hourlyRate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F5C451',
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bookButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F9FAFB',
  },

  // Achievement Section
  achievementSection: {
    marginHorizontal: 14,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: 20,
  },
  achievementContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 8,
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 12,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 16,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
})