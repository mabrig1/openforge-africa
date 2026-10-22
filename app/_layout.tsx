import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <PaperProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="circle/[id]" options={{ title: "Study Circle" }} />
        <Stack.Screen name="create-circle" options={{ title: "Create Circle", presentation: "modal" }} />
      </Stack>
    </PaperProvider>
  );
}
