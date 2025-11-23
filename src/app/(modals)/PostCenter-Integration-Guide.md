# 📋 PostCenter Complete Integration Guide

> **Comprehensive documentation for PostCenter system**  
> Everything you need to integrate backend, database, and complete the content creation flow.

---

## 🏗️ System Architecture Overview

### **Flow Diagram**
```
User Action → Modal Route → Category Selection → Category/Wizard Routes → Database → Success
     ↓            ↓             ↓                    ↓                 ↓         ↓
[+ Button]  [(modals)/     [Content Types]    [(post)/category/]   [API]  [Published]
           post-center-                        [(post)/wizard/]
           modal.tsx
```

### **Navigation Flow**
```
Main Layout CenterTabButton
├── Opens: /(modals)/post-center-modal.tsx
├── PostCenter.tsx (Category Selection)
│   ├── Navigates to: /(post)/category/{id}
│   └── Routes to specific category components
└── Category Forms → Wizard Steps
    ├── /(post)/wizard/step1 (Basic Info)
    ├── /(post)/wizard/step2 (Photos/Media)
    ├── /(post)/wizard/step3 (Dynamic Fields)
    ├── /(post)/wizard/step4 (Pricing)
    ├── /(post)/wizard/step5 (Location)
    └── /(post)/wizard/step6 (Review & Publish)
```

---

## 📁 File Structure & Responsibilities

### **Current Implementation Structure**
```
src/
├── app/                             # Route-based navigation
│   ├── (main)/
│   │   └── _layout.tsx             # Main tab layout with PostCenter trigger
│   ├── (modals)/
│   │   └── post-center-modal.tsx   # Modal route for PostCenter
│   └── (post)/                     # Post creation routes (NEW)
│       ├── _layout.tsx             # Stack navigation layout
│       ├── category/
│       │   ├── [id].tsx            # Dynamic category routing
│       │   ├── sell.tsx            # Individual category routes
│       │   ├── service.tsx         # Service category route
│       │   ├── job.tsx             # Job category route
│       │   ├── media.tsx           # Media category route
│       │   ├── realestate.tsx      # Real estate category route
│       │   ├── travel.tsx          # Travel category route
│       │   └── course.tsx          # Course category route
│       └── wizard/
│           ├── [step].tsx          # Dynamic step routing
│           ├── step1.tsx           # Individual step routes
│           ├── step2.tsx           # Step 2 route
│           ├── step3.tsx           # Step 3 route
│           ├── step4.tsx           # Step 4 route
│           ├── step5.tsx           # Step 5 route
│           └── step6.tsx           # Step 6 route
├── components/common/
│   └── CenterTabButton.tsx         # Reusable center tab button
├── components/post/
│   ├── PostCenter.tsx              # Category selection component
│   ├── PostCategoryCard.tsx        # Individual category card
│   ├── ReviewCard.tsx              # Final review component
│   ├── StepHeader.tsx              # Wizard navigation header
│   ├── FormTextInput.tsx           # Form input component
│   ├── FormSelect.tsx              # Form select component
│   ├── FormSwitch.tsx              # Form switch component
│   ├── MultiImagePicker.tsx        # Image upload component
│   ├── wizard/                     # Multi-step form components
│   │   ├── step1-basic.tsx         # Title, description, category
│   │   ├── step2-photos.tsx        # Image/media upload
│   │   ├── step3-dynamic-fields.tsx # Category-specific fields
│   │   ├── step4-pricing.tsx       # Price, currency, payment
│   │   ├── step5-location.tsx      # Address, coordinates, area
│   │   └── step6-review.tsx        # Final review & publish
│   └── category/                   # Category-specific forms
│       ├── sell.tsx                # Product listing fields
│       ├── service.tsx             # Service offering fields
│       ├── job.tsx                 # Job posting fields
│       ├── media.tsx               # Media upload fields
│       ├── realestate.tsx          # Property listing fields
│       ├── travel.tsx              # Travel booking fields
│       └── course.tsx              # Course creation fields
├── utils/
│   ├── wizardStore.ts              # Global form state management
│   ├── formSchemas.ts              # Validation schemas
│   ├── formatters.ts               # Data formatting utilities
│   └── constants.ts                # Form configurations
├── constants/                      # Theme system
│   ├── Colors.ts                   # Color palette & gradients
│   ├── Typography.ts               # Font sizes & styles
│   ├── Spacing.ts                  # Spacing system
│   ├── BorderRadius.ts             # Border radius values
│   ├── Shadows.ts                  # Shadow system
│   └── CommonStyles.ts             # Reusable component styles
└── types/
    └── post.ts                     # TypeScript definitions
```

---

## 🚦 Routing Configuration

### **Expo Router Setup**

#### **Main Layout Integration**
```typescript
// src/app/(main)/_layout.tsx
const router = useRouter()

<CenterTabButton
  onPress={() => router.push('/(modals)/post-center-modal')}
  iconName="plus"
  iconLibrary="FontAwesome"
  gradient={Colors.gradients.primary}
  size={32}
/>
```

#### **Modal Route**
```typescript
// src/app/(modals)/post-center-modal.tsx
export default function PostCenterModal() {
  const router = useRouter()
  
  return (
    <Modal animationType="fade" presentationStyle="pageSheet">
      <View style={styles.container}>
        <PostCenter onClose={() => router.back()} />
      </View>
    </Modal>
  )
}
```

#### **Dynamic Category Routing**
```typescript
// src/app/(post)/category/[id].tsx
const categoryComponents = {
  sell: SellCategory,
  service: ServiceCategory,
  job: JobCategory,
  media: MediaCategory,
  realestate: RealEstateCategory,
  travel: TravelCategory,
  course: CourseCategory,
}

export default function CategoryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const CategoryComponent = categoryComponents[id as keyof typeof categoryComponents]
  
  return <CategoryComponent />
}
```

#### **Dynamic Wizard Step Routing**
```typescript
// src/app/(post)/wizard/[step].tsx
const stepComponents = {
  '1': Step1Basic,
  '2': Step2Photos,
  '3': Step3DynamicFields,
  '4': Step4Pricing,
  '5': Step5Location,
  '6': Step6Review,
}

export default function WizardStepRoute() {
  const { step } = useLocalSearchParams<{ step: string }>()
  const StepComponent = stepComponents[step as keyof typeof stepComponents]
  
  return <StepComponent />
}
```

---

## 🗃️ Database Schema Design

### **Core Tables Structure**

#### **1. posts (Main Content Table)**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'sell', 'service', 'job', etc.
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  
  -- Basic Information
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Pricing Information  
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  price_type VARCHAR(20), -- 'fixed', 'negotiable', 'hourly', 'free'
  
  -- Location Information
  location_address TEXT,
  location_city VARCHAR(100),
  location_state VARCHAR(100), 
  location_country VARCHAR(100),
  location_coordinates POINT, -- PostGIS for lat/lng
  location_area VARCHAR(100), -- neighborhood, district
  
  -- Metadata
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_sponsored BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_location ON posts USING GIST(location_coordinates);
```

#### **2. post_images (Media Storage)**
```sql
CREATE TABLE post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  alt_text VARCHAR(255),
  width INTEGER,
  height INTEGER,
  file_size INTEGER, -- in bytes
  mime_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_images_post_id ON post_images(post_id);
CREATE INDEX idx_post_images_order ON post_images(post_id, image_order);
```

#### **3. post_fields (Dynamic Category Fields)**
```sql
CREATE TABLE post_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_value TEXT,
  field_type VARCHAR(50), -- 'text', 'number', 'boolean', 'array', 'json'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_fields_post_id ON post_fields(post_id);
CREATE INDEX idx_post_fields_name ON post_fields(field_name);
```

#### **4. post_analytics (Tracking & Analytics)**
```sql
CREATE TABLE post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50), -- 'view', 'like', 'share', 'contact', 'save'
  event_data JSONB, -- Additional event information
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX idx_post_analytics_event ON post_analytics(event_type);
CREATE INDEX idx_post_analytics_date ON post_analytics(created_at DESC);
```

### **Category-Specific Tables**

#### **Products (sell category)**
```sql
CREATE TABLE post_products (
  post_id UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  condition VARCHAR(20), -- 'new', 'like_new', 'good', 'fair', 'poor'
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  size VARCHAR(50),
  color VARCHAR(50),
  material VARCHAR(100),
  weight DECIMAL(8,2),
  dimensions VARCHAR(100), -- "L x W x H"
  warranty_info TEXT,
  return_policy TEXT,
  shipping_cost DECIMAL(8,2),
  shipping_time VARCHAR(50),
  quantity_available INTEGER DEFAULT 1
);
```

#### **Services (service category)**
```sql
CREATE TABLE post_services (
  post_id UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  service_type VARCHAR(100), -- 'consulting', 'repair', 'design', etc.
  duration VARCHAR(50), -- '1 hour', '2-3 days', 'ongoing'
  availability VARCHAR(200), -- 'Weekdays 9-5', 'Flexible', etc.
  experience_years INTEGER,
  certifications TEXT[],
  portfolio_links TEXT[],
  languages TEXT[],
  remote_available BOOLEAN DEFAULT false,
  travel_distance INTEGER, -- in kilometers
  minimum_order DECIMAL(8,2)
);
```

#### **Jobs (job category)**
```sql
CREATE TABLE post_jobs (
  post_id UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  job_type VARCHAR(50), -- 'full_time', 'part_time', 'contract', 'internship'
  work_arrangement VARCHAR(50), -- 'remote', 'on_site', 'hybrid'
  experience_level VARCHAR(50), -- 'entry', 'mid', 'senior', 'executive'
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  salary_type VARCHAR(20), -- 'hourly', 'monthly', 'yearly'
  company_name VARCHAR(200),
  company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '200+'
  industry VARCHAR(100),
  required_skills TEXT[],
  preferred_skills TEXT[],
  benefits TEXT[],
  application_deadline DATE,
  start_date DATE
);
```

#### **Real Estate (realestate category)**
```sql
CREATE TABLE post_properties (
  post_id UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  property_type VARCHAR(50), -- 'house', 'apartment', 'condo', 'land', etc.
  transaction_type VARCHAR(20), -- 'sale', 'rent', 'lease'
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1), -- 2.5 bathrooms
  square_feet INTEGER,
  square_meters INTEGER,
  lot_size_sqft INTEGER,
  year_built INTEGER,
  parking_spaces INTEGER,
  amenities TEXT[],
  hoa_fee DECIMAL(8,2),
  property_tax DECIMAL(10,2),
  utilities_included TEXT[],
  pet_policy VARCHAR(100),
  lease_term VARCHAR(50), -- '12 months', 'month-to-month'
  available_date DATE
);
```

#### **Travel (travel category)**
```sql
CREATE TABLE post_travels (
  post_id UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  travel_type VARCHAR(50), -- 'accommodation', 'experience', 'transport'
  accommodation_type VARCHAR(50), -- 'hotel', 'apartment', 'house', 'room'
  max_guests INTEGER,
  check_in_time TIME,
  check_out_time TIME,
  minimum_stay INTEGER, -- in nights
  amenities TEXT[],
  house_rules TEXT[],
  cancellation_policy VARCHAR(100),
  instant_book BOOLEAN DEFAULT false,
  host_languages TEXT[],
  response_rate INTEGER, -- percentage
  response_time VARCHAR(50) -- 'within an hour', 'within a day'
);
```

---

## 🔄 Data Flow & State Management

### **Zustand Store Structure (wizardStore.ts)**
```typescript
interface WizardState {
  // Form progression
  currentStep: number
  totalSteps: number
  isComplete: boolean
  
  // Content data
  category: PostCategory | null
  basicInfo: {
    title: string
    description: string
    tags: string[]
  }
  
  // Media data
  images: ImageData[]
  videos: VideoData[]
  documents: DocumentData[]
  
  // Pricing data
  pricing: {
    price: number | null
    currency: string
    priceType: 'fixed' | 'negotiable' | 'hourly' | 'free'
    paymentMethods: string[]
  }
  
  // Location data
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: { lat: number; lng: number } | null
    area: string
  }
  
  // Dynamic fields (category-specific)
  dynamicFields: Record<string, any>
  
  // Validation
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  
  // Actions
  setStep: (step: number) => void
  setCategory: (category: PostCategory) => void
  updateBasicInfo: (info: Partial<BasicInfo>) => void
  addImage: (image: ImageData) => void
  removeImage: (index: number) => void
  updatePricing: (pricing: Partial<PricingData>) => void
  updateLocation: (location: Partial<LocationData>) => void
  updateDynamicField: (key: string, value: any) => void
  validateStep: (step: number) => boolean
  submitPost: () => Promise<void>
  resetForm: () => void
}
```

### **Form Validation Schemas (formSchemas.ts)**
```typescript
import { z } from 'zod'

// Base schema for all posts
export const basePostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['sell', 'service', 'job', 'media', 'realestate', 'travel', 'course']),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed')
})

// Category-specific schemas
export const productSchema = basePostSchema.extend({
  price: z.number().positive('Price must be positive'),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']),
  brand: z.string().optional(),
  model: z.string().optional()
})

export const serviceSchema = basePostSchema.extend({
  serviceType: z.string().min(2, 'Service type is required'),
  duration: z.string().min(1, 'Duration is required'),
  experience: z.number().min(0).max(50, 'Experience must be 0-50 years')
})

export const jobSchema = basePostSchema.extend({
  jobType: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  workArrangement: z.enum(['remote', 'on_site', 'hybrid']),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  companyName: z.string().min(2, 'Company name is required')
})

// Validation function
export const validateFormData = (category: string, data: any) => {
  const schemas = {
    sell: productSchema,
    service: serviceSchema,
    job: jobSchema,
    // ... other schemas
  }
  
  const schema = schemas[category] || basePostSchema
  return schema.safeParse(data)
}
```

---

## 🚀 API Endpoints Design

### **REST API Structure**

#### **Posts CRUD Operations**
```typescript
// POST /api/posts - Create new post
interface CreatePostRequest {
  category: string
  basicInfo: {
    title: string
    description: string
    tags: string[]
  }
  pricing?: {
    price: number
    currency: string
    priceType: string
  }
  location?: {
    address: string
    city: string
    coordinates: { lat: number; lng: number }
  }
  images?: string[] // Image upload URLs
  dynamicFields?: Record<string, any>
}

interface CreatePostResponse {
  success: boolean
  data: {
    id: string
    status: 'draft' | 'published'
    createdAt: string
  }
  errors?: ValidationError[]
}

// GET /api/posts/:id - Get single post
interface GetPostResponse {
  success: boolean
  data: {
    id: string
    category: string
    title: string
    description: string
    price?: number
    location?: LocationData
    images: ImageData[]
    user: {
      id: string
      name: string
      avatar: string
    }
    stats: {
      views: number
      likes: number
      shares: number
    }
    createdAt: string
    updatedAt: string
  }
}

// PUT /api/posts/:id - Update post
// DELETE /api/posts/:id - Delete post

// GET /api/posts - List posts with filters
interface ListPostsQuery {
  category?: string
  location?: string
  priceMin?: number
  priceMax?: number
  sortBy?: 'created_at' | 'price' | 'views'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
```

#### **Image Upload Endpoints**
```typescript
// POST /api/uploads/images - Upload single image
interface UploadImageResponse {
  success: boolean
  data: {
    url: string
    thumbnailUrl: string
    width: number
    height: number
    fileSize: number
  }
}

// POST /api/uploads/images/multiple - Upload multiple images
interface UploadMultipleImagesResponse {
  success: boolean
  data: ImageData[]
  failed: { index: number; error: string }[]
}
```

#### **Analytics Endpoints**
```typescript
// POST /api/posts/:id/analytics - Track user interactions
interface TrackEventRequest {
  eventType: 'view' | 'like' | 'share' | 'contact' | 'save'
  eventData?: Record<string, any>
}

// GET /api/posts/:id/analytics - Get post analytics (owner only)
interface PostAnalyticsResponse {
  success: boolean
  data: {
    totalViews: number
    totalLikes: number
    totalShares: number
    dailyViews: { date: string; count: number }[]
    topLocations: { city: string; count: number }[]
    averageEngagement: number
  }
}
```

### **API Integration Functions**

#### **Post Service (services/postService.ts)**
```typescript
interface PostService {
  // Create operations
  createPost: (data: CreatePostRequest) => Promise<CreatePostResponse>
  saveDraft: (data: Partial<CreatePostRequest>) => Promise<{ draftId: string }>
  
  // Read operations
  getPost: (id: string) => Promise<GetPostResponse>
  listPosts: (query: ListPostsQuery) => Promise<ListPostsResponse>
  getUserPosts: (userId: string) => Promise<ListPostsResponse>
  
  // Update operations
  updatePost: (id: string, data: Partial<CreatePostRequest>) => Promise<UpdatePostResponse>
  publishPost: (id: string) => Promise<{ success: boolean }>
  
  // Delete operations
  deletePost: (id: string) => Promise<{ success: boolean }>
  
  // Analytics
  trackEvent: (postId: string, event: TrackEventRequest) => Promise<void>
  getAnalytics: (postId: string) => Promise<PostAnalyticsResponse>
}

// Implementation example
export const postService: PostService = {
  async createPost(data: CreatePostRequest) {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create post')
    }
    
    return response.json()
  }
  
  // ... other methods
}
```

---

## 🔧 Integration Steps

### **Phase 1: Database Setup**
1. **Create migration files** for all tables
2. **Set up indexes** for performance optimization
3. **Configure PostGIS** for location data
4. **Create seed data** for testing
5. **Set up database triggers** for updated_at timestamps

### **Phase 2: API Development**
1. **Implement CRUD endpoints** for posts
2. **Add file upload handling** (images, documents)
3. **Create validation middleware** using form schemas
4. **Implement authentication middleware** 
5. **Add rate limiting** for API endpoints
6. **Set up error handling** and logging

### **Phase 3: Frontend Integration**
1. **Update wizard store** to call API endpoints
2. **Implement form validation** using schemas
3. **Add image upload component** with progress
4. **Create error handling** for network failures
5. **Add loading states** throughout wizard
6. **Implement draft saving** functionality

### **Phase 4: Testing & Optimization**
1. **Unit tests** for all API endpoints
2. **Integration tests** for wizard flow
3. **Performance testing** for image uploads
4. **Database query optimization**
5. **Frontend performance optimization**

---

## 🔌 Implementation Checklist

### **Backend Tasks**
- [ ] Database schema creation and migration
- [ ] API endpoint implementation
- [ ] File upload service (AWS S3/Cloudinary)
- [ ] Authentication middleware
- [ ] Validation middleware
- [ ] Error handling and logging
- [ ] Rate limiting and security
- [ ] Analytics tracking system
- [ ] Email notifications
- [ ] Search functionality (Elasticsearch/PostgreSQL FTS)

### **Frontend Tasks**
- [x] Route structure setup (category and wizard routes)
- [x] Dynamic routing implementation ([id].tsx, [step].tsx)
- [x] Modal navigation integration
- [x] Theme system integration (Colors, Typography, Spacing)
- [x] Form components (FormTextInput, FormSelect, FormSwitch, MultiImagePicker)
- [x] ReviewCard component with comprehensive data display
- [x] StepHeader component with navigation
- [ ] Update wizard store with API calls
- [ ] Implement form validation using schemas
- [ ] Add loading states and error handling
- [ ] Implement draft saving functionality
- [ ] Add offline support (React Query)
- [ ] Create success/error notifications
- [ ] Add analytics tracking
- [ ] Implement form auto-save
- [ ] Add accessibility features
- [ ] Connect category forms to wizard flow
- [ ] Image upload progress indicators
- [ ] Form validation feedback UI

### **DevOps Tasks**
- [ ] Set up CI/CD pipeline
- [ ] Configure database backups
- [ ] Set up monitoring and alerts
- [ ] Configure CDN for images
- [ ] Set up staging environment
- [ ] Configure logging aggregation
- [ ] Set up performance monitoring
- [ ] Configure security scanning

---

## 🎯 Advanced Features to Implement

### **Real-time Features**
```typescript
// WebSocket integration for real-time updates
interface RealtimeEvents {
  'post:view': { postId: string; userId: string }
  'post:like': { postId: string; userId: string }
  'post:comment': { postId: string; comment: Comment }
  'post:statusChange': { postId: string; status: string }
}

// Implementation with Socket.io
const socket = io('/posts')
socket.on('post:view', (data) => {
  // Update view count in real-time
  updatePostStats(data.postId, { views: +1 })
})
```

### **AI-Powered Features**
```typescript
// Auto-categorization using ML
interface AIServices {
  categorizePost: (title: string, description: string) => Promise<string>
  generateTags: (content: string) => Promise<string[]>
  optimizeTitle: (title: string, category: string) => Promise<string>
  detectLanguage: (text: string) => Promise<string>
  moderateContent: (content: string) => Promise<{ safe: boolean; issues: string[] }>
}
```

### **Advanced Search**
```typescript
// Elasticsearch integration
interface SearchService {
  searchPosts: (query: SearchQuery) => Promise<SearchResults>
  getSuggestions: (partial: string) => Promise<string[]>
  getRelatedPosts: (postId: string) => Promise<Post[]>
  getFacets: (query: SearchQuery) => Promise<Facets>
}

interface SearchQuery {
  q?: string // Text search
  category?: string[]
  location?: {
    center: { lat: number; lng: number }
    radius: number // in kilometers
  }
  priceRange?: { min: number; max: number }
  dateRange?: { from: Date; to: Date }
  filters?: Record<string, any>
  sort?: { field: string; order: 'asc' | 'desc' }
  pagination?: { page: number; size: number }
}
```

---

## 📊 Performance Considerations

### **Database Optimization**
- **Partition large tables** by date or category
- **Use read replicas** for analytics queries
- **Implement connection pooling**
- **Add proper indexes** for common queries
- **Use materialized views** for complex aggregations

### **API Performance**
- **Implement caching** (Redis) for frequently accessed data
- **Use pagination** for list endpoints
- **Optimize image sizes** with multiple variants
- **Implement rate limiting** to prevent abuse
- **Use CDN** for static assets

### **Frontend Performance**
- **Implement virtual scrolling** for long lists
- **Use React Query** for caching and background updates
- **Lazy load images** with intersection observer
- **Implement infinite scroll** for post listings
- **Use web workers** for heavy computations

---

## 🔒 Security Considerations

### **Authentication & Authorization**
```typescript
// JWT-based authentication
interface AuthMiddleware {
  authenticate: (req: Request) => Promise<User | null>
  authorize: (user: User, resource: string, action: string) => boolean
}

// Role-based access control
enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator', 
  ADMIN = 'admin'
}

interface Permission {
  resource: string // 'post', 'user', 'analytics'
  action: string   // 'create', 'read', 'update', 'delete'
  condition?: (user: User, resource: any) => boolean
}
```

### **Data Validation & Sanitization**
```typescript
// Input sanitization
import DOMPurify from 'dompurify'
import validator from 'validator'

interface ValidationService {
  sanitizeHtml: (html: string) => string
  validateEmail: (email: string) => boolean
  validateUrl: (url: string) => boolean
  checkProfanity: (text: string) => boolean
  validateFileType: (file: File, allowedTypes: string[]) => boolean
}
```

---

## 📈 Analytics & Monitoring

### **Application Metrics**
```typescript
interface AppMetrics {
  // Post metrics
  postsCreated: Counter
  postViews: Counter
  postLikes: Counter
  
  // User metrics
  activeUsers: Gauge
  registrations: Counter
  
  // Performance metrics
  apiResponseTime: Histogram
  databaseQueryTime: Histogram
  imageUploadTime: Histogram
  
  // Error metrics
  apiErrors: Counter
  validationErrors: Counter
  systemErrors: Counter
}
```

### **Business Intelligence**
```sql
-- Analytics queries for business insights

-- Most popular categories
SELECT category, COUNT(*) as post_count 
FROM posts 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY category 
ORDER BY post_count DESC;

-- User engagement by location
SELECT p.location_city, 
       COUNT(*) as posts,
       AVG(p.view_count) as avg_views,
       AVG(p.like_count) as avg_likes
FROM posts p 
WHERE p.location_city IS NOT NULL 
GROUP BY p.location_city 
ORDER BY posts DESC;

-- Revenue potential by category
SELECT category,
       COUNT(*) as total_posts,
       COUNT(CASE WHEN price > 0 THEN 1 END) as paid_posts,
       AVG(price) as avg_price,
       SUM(price) as total_value
FROM posts 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY category;
```

---

## 📊 Current Implementation Status

### **✅ Completed Features**
- **Route Structure**: Complete (post) route group with dynamic routing
- **Modal Navigation**: Working modal-based PostCenter access
- **Theme System**: Comprehensive design system with Colors, Typography, Spacing
- **Form Components**: FormTextInput, FormSelect, FormSwitch, MultiImagePicker
- **Category Components**: 7 category-specific form components
- **Wizard Components**: 6-step wizard with ReviewCard and StepHeader
- **Dynamic Routing**: [id].tsx for categories, [step].tsx for wizard steps
- **CenterTabButton**: Modern TikTok-style floating action button

### **🔄 In Progress**
- **Wizard Store Integration**: Zustand store for form state management
- **Form Validation**: Schema-based validation with Zod
- **Theme Integration**: Applying theme system to remaining components

### **📝 Pending Implementation**
- **API Integration**: Backend endpoints and data persistence
- **Image Upload**: Cloud storage integration (AWS S3/Cloudinary)
- **Form Validation UI**: Error states and validation feedback
- **Draft Saving**: Auto-save and draft management
- **Analytics**: User interaction tracking
- **Search & Filtering**: Advanced post discovery features

### **🛠️ Ready for Backend Integration**
The frontend structure is complete and ready for:
1. **Database Schema Implementation** (all tables defined)
2. **API Endpoint Development** (interfaces specified)
3. **File Upload Service** (MultiImagePicker ready)
4. **Authentication Integration** (route protection ready)
5. **Analytics Implementation** (tracking points identified)

---

## 🎯 Future Roadmap

### **Short Term (1-2 months)**
- [x] Complete wizard route structure
- [x] Category component routing
- [x] Theme system integration
- [ ] Wizard store API integration
- [ ] Form validation with error UI
- [ ] Image upload with cloud storage
- [ ] Draft saving with local/remote sync
- [ ] Category form → wizard flow connection

### **Medium Term (3-6 months)**
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Mobile app optimization
- [ ] AI-powered features

### **Long Term (6+ months)**
- [ ] Multi-language support
- [ ] Advanced moderation tools
- [ ] Marketplace features (payments, escrow)
- [ ] Social features (following, messaging)
- [ ] API for third-party integrations

---

**🚀 This documentation provides everything needed to successfully integrate your PostCenter system with backend services and databases!**

*Complete • Scalable • Production-Ready*