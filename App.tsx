import 'react-native-gesture-handler';
import React from 'react';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep App.tsx minimal: wrap router Slot with GestureHandlerRootView only.
// Providers are applied in `src/app/_layout.tsx` to avoid early navigation before root mounts.
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
