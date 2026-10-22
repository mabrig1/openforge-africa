import { View, Text, FlatList } from "react-native";
import { useCircleStore } from "../../stores/circleStore";

export default function TasksScreen() {
  const { tasks } = useCircleStore();

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <Text className="text-2xl font-bold text-white mb-1">My Tasks</Text>
      <Text className="text-slate-400 mb-5">
        Offline collaborative tasks and micro-assessments
      </Text>

      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-3">✅</Text>
          <Text className="text-slate-400 text-center">
            No active tasks. Join or create a Study Circle to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700">
              <Text className="text-white font-semibold">{item.title}</Text>
              <Text className="text-slate-400 text-sm mt-1">{item.circleName}</Text>
              <View className="flex-row justify-between mt-3">
                <Text className="text-xs text-slate-500">{item.type}</Text>
                <Text
                  className={`text-xs font-medium ${
                    item.status === "completed" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
