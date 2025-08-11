# Header Component Usage Guide

The `Header` component is a reusable header component that provides consistent navigation and action buttons across different screens in your e-commerce app.

## Import

```tsx
import { Header } from '../../components'
// or
import Header from '../../components/header'
```

## Basic Usage

```tsx
<Header />
```

This will render a header with:

- Profile icon on the left
- Notification bell with red dot in the center-right
- Shopping cart with badge on the right

## Props

| Prop                  | Type         | Default     | Description                                    |
| --------------------- | ------------ | ----------- | ---------------------------------------------- |
| `showProfile`         | `boolean`    | `true`      | Whether to show the profile icon on the left   |
| `showNotifications`   | `boolean`    | `true`      | Whether to show the notification bell          |
| `showCart`            | `boolean`    | `true`      | Whether to show the shopping cart icon         |
| `onNotificationPress` | `() => void` | `undefined` | Custom handler for notification press          |
| `title`               | `string`     | `undefined` | Optional title to display next to profile icon |
| `backgroundColor`     | `string`     | `'#fff'`    | Background color of the header                 |

## Examples

### Default Header (Home Screen)

```tsx
<Header />
```

### Header with Title (Shop Screen)

```tsx
<Header
  title='Shop'
  showProfile={false}
  onNotificationPress={() => console.log('Shop notifications')}
/>
```

### Header without Profile (Product Details)

```tsx
<Header title='Product Details' showProfile={false} />
```

### Header without Notifications (Profile Screen)

```tsx
<Header title='My Profile' showNotifications={false} />
```

### Minimal Header (Cart Screen)

```tsx
<Header
  title='Shopping Cart'
  showProfile={false}
  showNotifications={false}
  showCart={false}
/>
```

### Custom Notification Handler

```tsx
<Header
  onNotificationPress={() => {
    // Navigate to notifications screen
    router.push('/notifications')
  }}
/>
```

### Custom Background Color

```tsx
<Header backgroundColor='#2E8C83' title='Special Section' />
```

## Features

### Shopping Cart Badge

- Automatically displays the current cart count
- Uses the `useCartStore` hook to get real-time cart data
- Shows "99+" for counts over 99
- Only visible when cart has items

### Notification Dot

- Always visible red dot on notification bell
- Can be customized by modifying the component logic
- Position: top-right corner of the notification icon

### Navigation

- Profile icon navigates to `/(shop)/profile`
- Cart icon navigates to `/(shop)/cart`
- Notification press can be customized via `onNotificationPress` prop

## Styling

The header comes with built-in responsive styling:

- Consistent padding and margins
- Shadow/elevation for depth
- Responsive icon sizing
- Proper touch targets (40x40px minimum)

## Integration Examples

### In Home Screen

```tsx
import { Header } from '../../components'

const Home = () => {
  return (
    <ScrollView>
      <Header />
      {/* Rest of your content */}
    </ScrollView>
  )
}
```

### In Shop Screen

```tsx
import { Header } from '../../components'

const Shop = () => {
  return (
    <View>
      <Header
        title='Shop'
        showProfile={false}
        onNotificationPress={() => handleNotifications()}
      />
      {/* Search and product content */}
    </View>
  )
}
```

### In Product Detail Screen

```tsx
import { Header } from '../../components'

const ProductDetail = () => {
  return (
    <ScrollView>
      <Header title='Product Details' showProfile={false} />
      {/* Product details content */}
    </ScrollView>
  )
}
```

## Customization

If you need to modify the header's appearance or behavior:

1. **Icons**: Change the FontAwesome icon names in the component
2. **Colors**: Modify the default colors in the stylesheet
3. **Sizes**: Adjust icon sizes and button dimensions
4. **Behavior**: Add new props or modify existing handlers

## Dependencies

The Header component requires:

- `react-native` components
- `@expo/vector-icons` for FontAwesome icons
- `expo-router` for navigation
- Your app's cart store (`useCartStore`)

Make sure these dependencies are properly installed and configured in your project.
