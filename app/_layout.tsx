import { Stack, Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="(tabs)" options={{ title: "Home" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="checkout" options={{ title: "Checkout" }} />
      <Tabs.Screen name="favorite" options={{ title: "Favorite" }} />
    </Stack>
  );
}
