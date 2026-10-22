import { View, Text, ScrollView } from "react-native";
import { useCircleStore } from "../../stores/circleStore";

export default function ProgressScreen() {
  const { circles, tasks } = useCircleStore();

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;

  return (
    <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-bold text-white mb-1">Progress</Text>
      <Text className="text-slate-400 mb-6">Your learning activity at a glance</Text>

      <View className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-4">
        <Text className="text-slate-400 text-sm">Active Study Circles</Text>
        <Text className="text-white text-3xl font-bold mt-1">{circles.length}</Text>
      </View>

      <View className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-4">
        <Text className="text-slate-400 text-sm">Tasks Completed</Text>
        <Text className="text-white text-3xl font-bold mt-1">
          {completedTasks} / {totalTasks || 0}
        </Text>
      </View>

      <View className="bg-green-900/20 border border-green-800/40 rounded-2xl p-5">
        <Text className="text-green-300 font-medium mb-2">Why this matters</Text>
        <Text className="text-slate-300 text-sm leading-5">
          OpenForge measures real engagement: circle participation, task completion, and peer interaction. These metrics are designed to be useful for both students and for grant reporting on retention and learning quality.
        </Text>
      </View>
    </ScrollView>
  );
}
