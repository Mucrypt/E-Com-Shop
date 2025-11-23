# 📱 NavigationHeader Integration Guide

## ✅ **Already Updated Screens**

### **1. Jobs Screen (`(jobs)/index.tsx`)**
- ✅ NavigationHeader added with "Jobs" title
- ✅ No back button (root screen)
- ✅ Right components: notifications + sidebar menu
- ✅ Search bar moved below header
- ✅ Status bar properly handled

### **2. Services Screen (`(services)/index.tsx`)**
- ✅ NavigationHeader added with "Services" title
- ✅ No back button (root screen)
- ✅ Right component: search icon
- ✅ Existing content preserved

### **3. Real Estate Screen (`(real-estate)/index.tsx`)**
- ✅ NavigationHeader added with "Real Estate" title
- ✅ No back button (root screen)
- ✅ Right components: map pin + filters
- ✅ Existing content preserved

## 📋 **Quick Integration Steps for Remaining Screens**

### **Template for Root Screens (no back button):**
```tsx
import { NavigationHeader } from '../../components/common'

export default function YourScreen() {
  return (
    <View style={styles.container}>
      <NavigationHeader 
        title="Screen Name"
        showBackButton={false}
        rightComponent={
          <TouchableOpacity>
            <FontAwesome name="icon-name" size={20} color="#fff" />
          </TouchableOpacity>
        }
      />
      {/* Your existing content */}
    </View>
  )
}
```

### **Template for Detail Screens (with back button):**
```tsx
import { NavigationHeader } from '../../components/common'

export default function YourDetailScreen() {
  return (
    <View style={styles.container}>
      <NavigationHeader 
        title="Detail Title"
        // Back button automatically shown
      />
      {/* Your existing content */}
    </View>
  )
}
```

## 🎯 **Screens That Need Integration**

### **Travel Route Group (`(travel)/`)**
- [ ] `index.tsx` - Main travel screen
- [ ] `destination-detail.tsx` - Detail screen (needs back button)
- [ ] `trips.tsx` - User's trips
- [ ] `post.tsx` - Create travel post
- [ ] `saved.tsx` - Saved travels
- [ ] `messages.tsx` - Travel messages

### **Crypto Hub Route Group (`(crypto-hub)/`)**
- [ ] `index.tsx` - Main crypto screen
- [ ] `markets.tsx` - Market data
- [ ] `trade.tsx` - Trading interface
- [ ] `assets.tsx` - User assets
- [ ] `discover.tsx` - Discover crypto

### **Sports Live Route Group (`(sports-live)/`)**
- [ ] `index.tsx` - Main sports screen
- [ ] `events.tsx` - Live events
- [ ] `favorites.tsx` - Favorite teams/games
- [ ] `for-you.tsx` - Personalized feed
- [ ] `league/[leagueId].tsx` - League details (needs back button)

### **Main Route Group (`(main)/`)**
- [ ] `index.tsx` - Main feed
- [ ] `messages.tsx` - Messages
- [ ] `profile.tsx` - User profile
- [ ] `saved.tsx` - Saved items
- [ ] `more.tsx` - More options

## 🛠️ **Implementation Instructions**

### **Step 1: Import NavigationHeader**
```tsx
import { NavigationHeader } from '../../components/common'
```

### **Step 2: Remove Old Header Code**
- Remove `StatusBar` imports and usage
- Remove custom header components
- Remove hardcoded back buttons

### **Step 3: Add NavigationHeader**
Place at the top of your main container:
```tsx
<NavigationHeader 
  title="Your Title"
  showBackButton={shouldShowBack}
  rightComponent={yourRightComponent}
/>
```

### **Step 4: Adjust Existing Content**
- Ensure your main container has `flex: 1`
- Remove any top padding that was compensating for missing status bar
- Keep existing ScrollView and content as is

## 🎨 **Customization Options**

### **Custom Colors (for themed screens):**
```tsx
<NavigationHeader 
  title="Crypto Hub"
  backgroundColor="#1a1a2e"
  textColor="#00d4ff"
  statusBarStyle="light-content"
/>
```

### **Multiple Right Components:**
```tsx
rightComponent={
  <View style={{ flexDirection: 'row', gap: 15 }}>
    <TouchableOpacity>
      <FontAwesome name="search" size={20} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity>
      <FontAwesome name="bell" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
}
```

### **Custom Back Action:**
```tsx
<NavigationHeader 
  title="Custom Back"
  onBackPress={() => {
    // Custom logic
    console.log('Going back')
    router.back()
  }}
/>
```

## ✨ **Benefits After Integration**

1. **Consistent Design** - Same header across all screens
2. **Proper Status Bar** - Always visible and styled correctly
3. **Smart Navigation** - Back button only when appropriate
4. **Theme Integration** - Uses your color system
5. **Easy Maintenance** - Single component to update
6. **Professional Look** - Clean, modern header design

## 🚀 **Next Steps**

1. **Start with high-priority screens** (main feeds, frequently used)
2. **Test on both iOS and Android** to ensure status bar works
3. **Customize colors** for themed sections (crypto, sports)
4. **Add appropriate right components** for each screen's functionality
5. **Remove old header code** to clean up components

This NavigationHeader component will give your app a professional, consistent look across all screens! 🎯