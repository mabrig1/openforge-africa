import { ScrollView, Text, View } from "react-native";
import { useCircleStore } from "../../stores/circleStore";
import { getProgress } from "../../lib/study";

export default function ProgressScreen() {
  const { circles, tasks, materials } = useCircleStore();
  const progress = getProgress(tasks);
  return <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{padding:18,paddingBottom:36}}>
    <Text className="text-white text-3xl font-bold mt-2">Your learning impact</Text>
    <Text className="text-slate-300 mt-2">Only activities recorded on this device are counted.</Text>
    <View className="bg-slate-800 rounded-3xl p-6 mt-6 border border-slate-700">
      <Text className="text-green-400 text-sm font-semibold">TASK COMPLETION</Text>
      <Text className="text-white text-5xl font-extrabold mt-2">{progress.percent}%</Text>
      <View className="bg-slate-700 rounded-full h-3 mt-4 overflow-hidden">
        <View className="bg-green-500 h-3 rounded-full" style={{width: `${progress.percent}%` as `${number}%`}} />
      </View>
      <Text className="text-slate-300 mt-3">{progress.completed} of {progress.total} learning tasks completed</Text>
    </View>
    <View className="flex-row mt-4">
      <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mr-2 flex-1">
        <Text className="text-white text-3xl font-bold">{circles.length}</Text><Text className="text-slate-400 mt-1">Study circles</Text>
      </View>
      <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 ml-2 flex-1">
        <Text className="text-white text-3xl font-bold">{materials.length}</Text><Text className="text-slate-400 mt-1">Saved sources</Text>
      </View>
    </View>
    <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-4">
      <Text className="text-white text-xl font-bold">Micro-quiz performance</Text>
      <Text className="text-green-400 text-2xl font-semibold mt-3">{progress.correctQuizzes} / {progress.attemptedQuizzes} correct</Text>
      <Text className="text-slate-400 mt-2">First recorded attempts only. Correct answers are shown after submission.</Text>
    </View>
    <View className="bg-green-950 border border-green-800 rounded-2xl p-5 mt-6">
      <Text className="text-green-300 font-bold">Your privacy matters</Text>
      <Text className="text-slate-200 mt-2 leading-6">No personal activity has been sent to a tutor, institution, or analytics server. Cross-device sync and institutional reporting are not yet enabled.</Text>
    </View>
  </ScrollView>;
}
