import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <PaperProvider theme={{ ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: "#4ADE80", background: "#0F172A" } }}>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: "#0F172A" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: "#0F172A" }
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="circle/[id]" options={{ title: "Study workspace" }} />
        <Stack.Screen name="task/[id]" options={{ title: "Learning task" }} />
        <Stack.Screen name="create-circle" options={{ title: "New study circle", presentation: "modal" }} />
        <Stack.Screen name="create-task" options={{ title: "New learning task", presentation: "modal" }} />
        <Stack.Screen name="add-material" options={{ title: "Save course notes", presentation: "modal" }} />
        <Stack.Screen name="transfer-pack" options={{ title: "Study pack exchange", presentation: "modal" }} />
        <Stack.Screen name="pilot" options={{ title: "Seven-day study pilot" }} />
        <Stack.Screen name="challenge" options={{ title: "Innovation Challenge Lab" }} />
        <Stack.Screen name="tutor" options={{ title: "AI Study Tutor" }} />
        <Stack.Screen name="reader" options={{ title: "Text Reader" }} />
        <Stack.Screen name="explainer" options={{ title: "Visual Learning Studio" }} />
        <Stack.Screen name="course" options={{ title: "Logic and Critical Thinking Course" }} />
        <Stack.Screen name="logic-lab" options={{ title: "Formal Logic Lab" }} />
        <Stack.Screen name="capstone" options={{ title: "Capstone Research Studio" }} />
        <Stack.Screen name="psychology-course" options={{ title: "PSY 210 Psychology and AI" }} />
        <Stack.Screen name="psychology-interview" options={{ title: "PSY 210 Interview Studio" }} />
      </Stack>
    </PaperProvider>
  );
}
