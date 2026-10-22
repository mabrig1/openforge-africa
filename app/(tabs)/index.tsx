import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useCircleStore } from "../../stores/circleStore";

export default function CirclesScreen() {
  const { circles, tasks, materials } = useCircleStore();
  return (
    <View className="flex-1 bg-slate-900 px-4 pt-5">
      <View className="bg-slate-800 rounded-3xl p-5 mb-5 border border-slate-700">
        <Text className="text-green-400 font-bold text-xs tracking-widest">OPENFORGE AFRICA • OFFLINE FIRST</Text>
        <Text className="text-white text-3xl font-extrabold mt-2">Learn stronger, together.</Text>
        <Text className="text-slate-300 mt-2 leading-5">Turn course notes into study sessions, challenges and measurable progress — even without data.</Text>
        <View className="flex-row mt-5">
          <View className="mr-8"><Text className="text-white text-2xl font-bold">{circles.length}</Text><Text className="text-slate-400 text-xs">Circles</Text></View>
          <View className="mr-8"><Text className="text-white text-2xl font-bold">{tasks.length}</Text><Text className="text-slate-400 text-xs">Tasks</Text></View>
          <View><Text className="text-white text-2xl font-bold">{materials.length}</Text><Text className="text-slate-400 text-xs">Saved notes</Text></View>
        </View>
      </View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-xl font-bold">Your study circles</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create study circle"
          onPress={() => router.push("/create-circle")} className="bg-green-600 py-3 px-5 rounded-full">
          <Text className="text-white font-bold">+ Create</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={circles} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View className="bg-slate-800 rounded-3xl p-7 mt-4 border border-slate-700">
          <Text className="text-white text-xl font-bold mb-3">Your first circle starts here</Text>
          <Text className="text-slate-300 leading-6">Create a circle for a course, paste the relevant notes, then build offline discussion tasks or a three-answer quiz. Work is saved locally on this device.</Text>
        </View>}
        renderItem={({item}) => {
          const ownTasks = tasks.filter((task) => task.circleId === item.id);
          const completed = ownTasks.filter((task) => task.status === "completed").length;
          return <TouchableOpacity accessibilityRole="button" onPress={() => router.push({pathname:"/circle/[id]",params:{id:item.id}})}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-3">
            <Text className="text-green-400 text-xs font-semibold">{item.courseCode}</Text>
            <Text className="text-white text-xl font-bold mt-1">{item.name}</Text>
            <Text className="text-slate-300 mt-1">{item.courseTitle}</Text>
            <View className="flex-row justify-between mt-4">
              <Text className="text-slate-400 text-xs">{materials.filter((m) => m.circleId === item.id).length} saved sources</Text>
              <Text className="text-slate-400 text-xs">{completed}/{ownTasks.length} tasks completed →</Text>
            </View>
          </TouchableOpacity>;
        }}
      />
    </View>
  );
}
