// app/(real-estate)/analytics.tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { FontAwesome, Feather } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

type StatCardProps = {
  title: string
  value: string
  change?: string
  positive?: boolean
  icon: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <FontAwesome name={icon as any} size={20} color="#F5C451" />
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    {change && (
      <View style={styles.changeContainer}>
        <FontAwesome 
          name={positive ? "arrow-up" : "arrow-down"} 
          size={12} 
          color={positive ? "#10B981" : "#EF4444"} 
        />
        <Text style={[styles.changeText, { color: positive ? "#10B981" : "#EF4444" }]}>
          {change}
        </Text>
      </View>
    )}
  </View>
)

type TrendItemProps = {
  area: string
  avgPrice: string
  change: string
  positive: boolean
}

const TrendItem: React.FC<TrendItemProps> = ({ area, avgPrice, change, positive }) => (
  <View style={styles.trendItem}>
    <View style={styles.trendLeft}>
      <Text style={styles.trendArea}>{area}</Text>
      <Text style={styles.trendPrice}>{avgPrice}</Text>
    </View>
    <View style={[styles.trendBadge, { backgroundColor: positive ? '#10B98120' : '#EF444420' }]}>
      <FontAwesome 
        name={positive ? "arrow-up" : "arrow-down"} 
        size={10} 
        color={positive ? "#10B981" : "#EF4444"} 
      />
      <Text style={[styles.trendChange, { color: positive ? "#10B981" : "#EF4444" }]}>
        {change}
      </Text>
    </View>
  </View>
)

export default function RealEstateAnalytics() {
  const marketStats = [
    { title: "Avg Property Price", value: "$450,000", change: "+5.2%", positive: true, icon: "home" },
    { title: "Properties Listed", value: "1,247", change: "+12%", positive: true, icon: "plus-square" },
    { title: "Properties Sold", value: "892", change: "-3.1%", positive: false, icon: "check-circle" },
    { title: "Days on Market", value: "28", change: "-8%", positive: true, icon: "clock-o" },
  ]

  const areasTrends = [
    { area: "Downtown Core", avgPrice: "$650,000", change: "+8.5%", positive: true },
    { area: "Riverside District", avgPrice: "$420,000", change: "+6.2%", positive: true },
    { area: "Tech Hub", avgPrice: "$580,000", change: "+4.1%", positive: true },
    { area: "Historic Quarter", avgPrice: "$380,000", change: "-2.3%", positive: false },
    { area: "Suburban Heights", avgPrice: "$320,000", change: "+3.7%", positive: true },
    { area: "Waterfront", avgPrice: "$890,000", change: "+12.1%", positive: true },
  ]

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Overview</Text>
          <Text style={styles.sectionSubtitle}>Real-time property market insights</Text>
        </View>

        {/* Market Stats Grid */}
        <View style={styles.statsGrid}>
          {marketStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="trending-up" size={20} color="#F5C451" />
              <Text style={styles.actionText}>Price Trends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="map-pin" size={20} color="#F5C451" />
              <Text style={styles.actionText}>Hot Areas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="bar-chart-2" size={20} color="#F5C451" />
              <Text style={styles.actionText}>Demand Index</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Area Trends */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Area Performance</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.trendsContainer}>
            {areasTrends.map((trend, index) => (
              <TrendItem key={index} {...trend} />
            ))}
          </View>
        </View>

        {/* Investment Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <FontAwesome name="lightbulb-o" size={18} color="#F5C451" />
              <Text style={styles.insightTitle}>Market Opportunity</Text>
            </View>
            <Text style={styles.insightText}>
              Properties in Riverside District are showing strong growth potential with a 6.2% 
              increase in average prices and lower competition.
            </Text>
            <TouchableOpacity style={styles.insightButton}>
              <Text style={styles.insightButtonText}>Explore Opportunities</Text>
              <FontAwesome name="arrow-right" size={12} color="#F5C451" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050509',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  viewAllText: {
    fontSize: 14,
    color: '#F5C451',
    fontWeight: '600',
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Quick Actions
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  actionText: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 8,
    fontWeight: '500',
  },
  
  // Trends
  trendsContainer: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F2937',
  },
  trendLeft: {
    flex: 1,
  },
  trendArea: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  trendPrice: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendChange: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Insights
  insightCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  insightButtonText: {
    fontSize: 14,
    color: '#F5C451',
    fontWeight: '600',
    marginRight: 8,
  },
  
  bottomSpacing: {
    height: 32,
  },
})