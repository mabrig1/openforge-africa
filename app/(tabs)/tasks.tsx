import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useCircleStore } from "../../stores/circleStore";
import { getProgress } from "../../lib/study";

export default function TasksScreen() {
  const { tasks } = useCircleStore();
  const stats = getProgress(tasks);
  return <View className="flex-1 bg-slate-900 p-4">
    <Text className="text-white text-2xl font-bold mt-2">Learning tasks</Text>
    <Text className="text-slate-400 mt-1 mb-4">Offline work that counts toward your progress</Text>
    <View className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-4">
      <Text className="text-green-400 text-xl font-bold">{stats.percent}% completed</Text>
      <Text className="text-slate-300 text-sm mt-1">{stats.completed} of {stats.total} tasks done</Text>
    </View>
    <FlatList data={tasks} keyExtractor={(t) => t.id}
      ListEmptyComponent={<Text className="text-slate-300 bg-slate-800 p-6 rounded-2xl">No learning tasks yet. Open a circle and add a discussion, peer explanation or quiz.</Text>}
      renderItem={({item}) => <TouchableOpacity accessibilityRole="button" onPress={() => router.push({pathname:"/task/[id]",params:{id:item.id}})}
        className="bg-slate-800 p-4 rounded-2xl mb-3 border border-slate-700">
        <View className="flex-row justify-between">
          <Text className="text-green-400 text-xs font-semibold">{item.type.replace("-", " ").toUpperCase()}</Text>
          <Text className={item.status === "completed" ? "text-green-400 text-xs" : "text-amber-400 text-xs"}>{item.status}</Text>
        </View>
        <Text className="text-white text-lg font-bold mt-2">{item.title}</Text>
        <Text className="text-slate-400 text-sm mt-1">{item.circleName}</Text>
      </TouchableOpacity>} />
  </View>;
}
