import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";

export default function CreateCircleScreen() {
  const { addCircle } = useCircleStore();
  const [name, setName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !courseCode.trim()) {
      Alert.alert("Missing information", "Please provide a circle name and course code.");
      return;
    }

    addCircle({
      id: `circle_${Date.now()}`,
      name: name.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseTitle.trim() || "Course",
      memberCount: 1,
      taskCount: 0,
      lastActivity: "Just now",
      createdAt: Date.now(),
    });

    Alert.alert("Circle created", "Your Study Circle is ready. Invite members offline or when you have connectivity.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-slate-400 mb-6">
        Create a small Study Circle (ideal size 3–8 students). You can invite members later.
      </Text>

      <Text className="text-slate-300 mb-1.5">Circle Name</Text>
      <TextInput
        className="bg-slate-800 text-white rounded-xl px-4 py-3 mb-4 border border-slate-700"
        placeholder="e.g. CIT 101 Morning Group"
        placeholderTextColor="#64748B"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-slate-300 mb-1.5">Course Code</Text>
      <TextInput
        className="bg-slate-800 text-white rounded-xl px-4 py-3 mb-4 border border-slate-700"
        placeholder="e.g. CIT 101"
        placeholderTextColor="#64748B"
        value={courseCode}
        onChangeText={setCourseCode}
        autoCapitalize="characters"
      />

      <Text className="text-slate-300 mb-1.5">Course Title (optional)</Text>
      <TextInput
        className="bg-slate-800 text-white rounded-xl px-4 py-3 mb-8 border border-slate-700"
        placeholder="e.g. Introduction to Computers"
        placeholderTextColor="#64748B"
        value={courseTitle}
        onChangeText={setCourseTitle}
      />

      <TouchableOpacity
        onPress={handleCreate}
        className="bg-green-600 py-4 rounded-xl items-center"
      >
        <Text className="text-white font-bold text-lg">Create Study Circle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
