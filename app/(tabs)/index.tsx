import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { useCircleStore } from "../../stores/circleStore";

export default function CirclesScreen() {
  const { circles } = useCircleStore();

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <View className="flex-row justify-between items-center mb-5">
        <View>
          <Text className="text-2xl font-bold text-white">Study Circles</Text>
          <Text className="text-slate-400 text-sm mt-0.5">
            Learn together, even offline
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/create-circle")}
          className="bg-green-600 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">+ New</Text>
        </TouchableOpacity>
      </View>

      {circles.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">👥</Text>
          <Text className="text-white text-xl font-semibold text-center mb-2">
            No Study Circles yet
          </Text>
          <Text className="text-slate-400 text-center leading-5">
            Create a small group (3–8 students) around a course. Collaborate offline. The AI Facilitator will guide your discussions using only your downloaded materials.
          </Text>
        </View>
      ) : (
        <FlatList
          data={circles}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Link href={`/circle/${item.id}`} asChild>
              <TouchableOpacity className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">{item.name}</Text>
                    <Text className="text-slate-300 mt-1">{item.courseCode} • {item.courseTitle}</Text>
                  </View>
                  <View className="bg-green-900/40 px-2.5 py-1 rounded-full">
                    <Text className="text-green-400 text-xs font-medium">
                      {item.memberCount} members
                    </Text>
                  </View>
                </View>
                <Text className="text-slate-500 text-xs mt-3">
                  {item.taskCount} active tasks • Last activity {item.lastActivity}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}
