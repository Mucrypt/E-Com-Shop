// app/(tabs)/cart/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function CartLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f6f6fb' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
