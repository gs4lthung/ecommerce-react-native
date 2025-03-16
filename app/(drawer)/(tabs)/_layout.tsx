// app/(drawer)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      {/* Remove or repurpose other tabs as needed */}
    </Tabs>
  );
}