import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCircleStore } from "../../stores/circleStore";

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { circles } = useCircleStore();
  const circle = circles.find((c) => c.id === id);

  if (!circle) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <Text className="text-white">Circle not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-bold text-white">{circle.name}</Text>
      <Text className="text-slate-300 mt-1 mb-6">
        {circle.courseCode} • {circle.courseTitle}
      </Text>

      <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-3">
        <Text className="text-slate-400 text-sm">Members</Text>
        <Text className="text-white text-xl font-semibold">{circle.memberCount}</Text>
      </View>

      <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-3">
        <Text className="text-slate-400 text-sm">Active Tasks</Text>
        <Text className="text-white text-xl font-semibold">{circle.taskCount}</Text>
      </View>

      <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-6">
        <Text className="text-slate-400 text-sm">Last Activity</Text>
        <Text className="text-white">{circle.lastActivity}</Text>
      </View>

      <View className="bg-green-900/20 border border-green-800/40 rounded-2xl p-4">
        <Text className="text-green-300 font-medium mb-1">Offline Ready</Text>
        <Text className="text-slate-300 text-sm leading-5">
          All collaboration, tasks and AI facilitation for this circle can happen without internet. Progress will sync when any member comes online.
        </Text>
      </View>
    </ScrollView>
  );
}
