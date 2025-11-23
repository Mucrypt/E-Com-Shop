# NavigationHeader Usage Examples

## Quick Implementation Guide

### 1. **Jobs Screen Example**
```tsx
// src/app/(jobs)/index.tsx
import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { NavigationHeader } from '../../components/common'

export default function JobsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0B' }}>
      <NavigationHeader 
        title="Jobs"
        showBackButton={false} // Root screen, no back button
      />
      <ScrollView>
        {/* Your jobs content */}
      </ScrollView>
    </View>
  )
}
```

### 2. **Services Screen Example**
```tsx
// src/app/(services)/index.tsx
import React from 'react'
import { View, ScrollView } from 'react-native'
import { NavigationHeader } from '../../components/common'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

export default function ServicesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0B' }}>
      <NavigationHeader 
        title="Services"
        rightComponent={
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />
      <ScrollView>
        {/* Your services content */}
      </ScrollView>
    </View>
  )
}
```

### 3. **Detail Screen Example**
```tsx
// src/app/(travel)/destination-detail.tsx
import React from 'react'
import { View, ScrollView } from 'react-native'
import { NavigationHeader } from '../../components/common'

export default function DestinationDetailScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0B' }}>
      <NavigationHeader 
        title="Destination Details"
        // Back button automatically shown and working
      />
      <ScrollView>
        {/* Your destination details */}
      </ScrollView>
    </View>
  )
}
```

### 4. **Custom Theme Example**
```tsx
// src/app/(crypto-hub)/index.tsx
import React from 'react'
import { View, ScrollView } from 'react-native'
import { NavigationHeader } from '../../components/common'

export default function CryptoHubScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <NavigationHeader 
        title="Crypto Hub"
        backgroundColor="#1a1a2e"
        textColor="#00d4ff"
        statusBarStyle="light-content"
        showBackButton={false}
      />
      <ScrollView>
        {/* Your crypto content */}
      </ScrollView>
    </View>
  )
}
```

## Features ✨

### ✅ **Status Bar Handling**
- Automatically shows status bar
- Configurable status bar style (light/dark)
- Proper safe area handling on iOS

### ✅ **Back Navigation**
- Smart back button (only shows when can go back)
- Custom back press handling
- Circular back button with theme integration

### ✅ **Flexible Layout**
- Optional title display
- Custom right component support
- Responsive design

### ✅ **Theme Integration**
- Uses your Colors, Typography, Spacing constants
- Customizable colors and styles
- Consistent design across all screens

## Implementation Steps

### Step 1: Update Your Screen Files
Replace the current header logic with NavigationHeader component.

### Step 2: Remove Layout Headers
Update your `_layout.tsx` files to remove `headerShown: true` since NavigationHeader handles it.

### Step 3: Customize as Needed
Add titles, right components, or custom colors based on each screen's needs.

## Common Patterns

### **Root Screen (No Back Button)**
```tsx
<NavigationHeader 
  title="Screen Name"
  showBackButton={false}
/>
```

### **Detail Screen (With Back)**
```tsx
<NavigationHeader 
  title="Details"
  // Back button automatically shown
/>
```

### **Screen with Actions**
```tsx
<NavigationHeader 
  title="Messages"
  rightComponent={
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <TouchableOpacity>
        <Ionicons name="search" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  }
/>
```

This component solves all your header needs across all route groups! 🚀