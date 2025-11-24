import { useState, useEffect, useMemo } from 'react'

export interface SearchResult {
  id: string
  type: 'creator' | 'category' | 'trending' | 'opportunity' | 'location' | 'hashtag'
  title: string
  subtitle: string
  category: string
  verified?: boolean
  trending?: boolean
  icon: string
  color: string
  followers?: number
  engagement?: string
  metadata?: {
    views?: string
    likes?: string
    shares?: string
    timePosted?: string
    location?: string
    price?: string
    company?: string
    salary?: string
    remote?: boolean
    urgent?: boolean
  }
}

export interface SearchFilters {
  category: string
  sortBy: 'relevance' | 'recent' | 'popular' | 'verified'
  dateRange: 'all' | 'today' | 'week' | 'month'
  location?: string
  verified?: boolean
  trending?: boolean
}

const defaultFilters: SearchFilters = {
  category: 'All',
  sortBy: 'relevance',
  dateRange: 'all',
}

// Mock comprehensive search data
const mockSearchData: SearchResult[] = [
  // Crypto Category
  {
    id: 'creator_1',
    type: 'creator',
    title: 'Alex Chen',
    subtitle: 'Bitcoin Trading Expert',
    category: 'crypto',
    verified: true,
    trending: true,
    icon: '₿',
    color: '#F7931A',
    followers: 2100000,
    engagement: '8.2%',
    metadata: {
      views: '45M',
      likes: '3.2M',
      shares: '890K',
    },
  },
  {
    id: 'opportunity_1',
    type: 'opportunity',
    title: 'DeFi Yield Farming',
    subtitle: 'Up to 127% APY • Risk Level: Medium',
    category: 'crypto',
    trending: true,
    icon: '🌾',
    color: '#00D4AA',
    metadata: {
      timePosted: '2h ago',
      urgent: true,
    }
  },
  
  // Jobs Category
  {
    id: 'opportunity_2',
    type: 'opportunity',
    title: 'Google Remote Engineer',
    subtitle: 'Senior Full Stack • $180K-250K',
    category: 'jobs',
    trending: true,
    icon: '💻',
    color: '#0066CC',
    metadata: {
      company: 'Google',
      salary: '$180K-250K',
      remote: true,
      urgent: true,
      timePosted: '6h ago',
    }
  },
  {
    id: 'creator_2',
    type: 'creator',
    title: 'Sarah Johnson',
    subtitle: 'Tech Career Coach • Ex-FAANG',
    category: 'jobs',
    verified: true,
    icon: '👩‍💼',
    color: '#6B46C1',
    followers: 890000,
    engagement: '6.7%',
  },
  
  // Travel Category
  {
    id: 'location_1',
    type: 'location',
    title: 'Bali Digital Nomad Hub',
    subtitle: 'Canggu • $800/month avg cost',
    category: 'travel',
    trending: true,
    icon: '🏝️',
    color: '#00BCD4',
    metadata: {
      location: 'Canggu, Bali',
      price: '$800/month',
      views: '2.1M',
    }
  },
  {
    id: 'creator_3',
    type: 'creator',
    title: 'Travel with Maya',
    subtitle: 'Digital Nomad • 47 Countries',
    category: 'travel',
    verified: true,
    icon: '✈️',
    color: '#FF6B35',
    followers: 1300000,
    engagement: '9.1%',
  },
  
  // Real Estate Category
  {
    id: 'location_2',
    type: 'location',
    title: 'Miami Beach Condos',
    subtitle: 'Luxury Waterfront • $2.1M avg',
    category: 'real-estate',
    icon: '🏖️',
    color: '#FF6B6B',
    metadata: {
      location: 'Miami Beach, FL',
      price: '$2.1M avg',
      views: '892K',
    }
  },
  
  // Sports Category
  {
    id: 'trending_1',
    type: 'trending',
    title: 'Champions League Final',
    subtitle: 'Live in 2 hours • 2.3M watching',
    category: 'sports',
    trending: true,
    icon: '⚽',
    color: '#FF4081',
    metadata: {
      views: '2.3M watching',
      timePosted: 'Live soon',
    }
  },
  
  // Services Category
  {
    id: 'creator_4',
    type: 'creator',
    title: 'Design Studio Pro',
    subtitle: 'Premium UI/UX Services',
    category: 'services',
    verified: true,
    icon: '🎨',
    color: '#9C27B0',
    followers: 450000,
    engagement: '5.4%',
  },
  
  // Shopping Category
  {
    id: 'trending_2',
    type: 'trending',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Limited Stock • 20% off today',
    category: 'shop',
    trending: true,
    icon: '📱',
    color: '#000000',
    metadata: {
      price: '$999 (20% off)',
      urgent: true,
      timePosted: '1h ago',
    }
  },
  
  // Hashtags
  {
    id: 'hashtag_1',
    type: 'hashtag',
    title: '#CryptoTrading2025',
    subtitle: '12.5M posts • Trending now',
    category: 'crypto',
    trending: true,
    icon: '#️⃣',
    color: '#1DA1F2',
    metadata: {
      views: '12.5M posts',
    }
  },
  {
    id: 'hashtag_2',
    type: 'hashtag',
    title: '#RemoteWork',
    subtitle: '8.9M posts • Popular in Tech',
    category: 'jobs',
    trending: true,
    icon: '#️⃣',
    color: '#1DA1F2',
    metadata: {
      views: '8.9M posts',
    }
  },
]

export const usePulseSearch = () => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Bitcoin trading tips',
    'Remote developer jobs', 
    'Bali digital nomad',
    'Miami real estate',
    'Champions League',
  ])

  // AI-powered search suggestions
  const searchSuggestions = useMemo(() => [
    '🔥 AI Trading Signals',
    '⚡ Remote Work 2025',
    '🌴 Digital Nomad Spots',
    '🏠 Property Investment',
    '⚽ Live Sports Today',
    '💼 Freelance Services',
    '🛍️ Tech Deals Flash',
    '🚀 Startup Opportunities',
  ], [])

  // Filter and search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return []

    let results = mockSearchData.filter(item => {
      const matchesQuery = 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = 
        filters.category === 'All' || 
        item.category === filters.category.toLowerCase() ||
        (filters.category === 'Creators' && item.type === 'creator')

      const matchesVerified = 
        !filters.verified || item.verified

      const matchesTrending = 
        !filters.trending || item.trending

      return matchesQuery && matchesCategory && matchesVerified && matchesTrending
    })

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        results.sort((a, b) => (b.followers || 0) - (a.followers || 0))
        break
      case 'recent':
        results.sort((a, b) => {
          const aTime = a.metadata?.timePosted || 'old'
          const bTime = b.metadata?.timePosted || 'old'
          if (aTime.includes('h') && bTime.includes('h')) {
            return parseInt(aTime) - parseInt(bTime)
          }
          return 0
        })
        break
      case 'verified':
        results.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
        break
      default: // relevance
        // Keep original order for relevance
        break
    }

    return results
  }, [query, filters])

  // Trending searches based on categories
  const trendingSearches = useMemo(() => {
    const trending: Record<string, string[]> = {
      'All': [
        'AI Trading 2025',
        'Remote Work Revolution',
        'Digital Nomad Paradise',
        'Crypto Bull Run',
        'Tech Job Market',
      ],
      'Crypto': [
        'Bitcoin ETF News',
        'DeFi Yield Farming',
        'Altcoin Season',
        'Web3 Jobs',
        'NFT Marketplace',
      ],
      'Jobs': [
        'Remote Engineer Jobs',
        'AI/ML Positions',
        'Startup Equity',
        'FAANG Interview',
        'Freelance Rates',
      ],
      'Travel': [
        'Digital Nomad Visa',
        'Cheap Flight Deals',
        'Coworking Spaces',
        'Travel Insurance',
        'Best WiFi Cities',
      ],
      'Real Estate': [
        'Investment Properties',
        'Market Crash 2025',
        'Rental Yields',
        'REITs Performance',
        'Mortgage Rates',
      ],
      'Sports': [
        'Live Match Today',
        'Transfer News',
        'Fantasy League',
        'Sports Betting',
        'Workout Plans',
      ],
      'Services': [
        'Freelance Design',
        'Marketing Agency',
        'Business Coaching',
        'Legal Services',
        'Tax Preparation',
      ],
      'Shop': [
        'Tech Deals Black Friday',
        'Fashion Trends 2025',
        'Gaming Setup',
        'Home Office Gear',
        'Fitness Equipment',
      ],
    }
    return trending[filters.category] || trending['All']
  }, [filters.category])

  const addToRecentSearches = (searchTerm: string) => {
    setRecentSearches(prev => [
      searchTerm,
      ...prev.filter(s => s !== searchTerm)
    ].slice(0, 10))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    addToRecentSearches(searchTerm)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return {
    query,
    setQuery,
    filters,
    updateFilters,
    searchResults,
    recentSearches,
    searchSuggestions,
    trendingSearches,
    isLoading,
    performSearch,
    clearRecentSearches,
    addToRecentSearches,
  }
}

export default usePulseSearch