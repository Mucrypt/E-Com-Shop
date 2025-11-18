// app/media/_layout.tsx
import { ReactNode } from 'react'
import { Stack } from 'expo-router'

// This layout will inherit providers from the root layout
export default function MediaLayout({ children }: { children: ReactNode }) {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
          // Optional: Add custom header options if needed
        }}
      />
    </Stack>
  )
}
