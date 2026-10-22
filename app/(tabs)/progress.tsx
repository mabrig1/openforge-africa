import { ScrollView, Text, View, Share, Alert, TouchableOpacity } from "react-native";
import { learningSummary, voluntaryLearningDigest } from "../../lib/focus";
import { useCircleStore } from "../../stores/circleStore";
import { getProgress } from "../../lib/study";

export default function ProgressScreen() {
  const { circles, tasks, materials, sessions, resetLocalData } = useCircleStore();
  const eraseData=()=>Alert.alert(
    "Remove all local learning data?",
    "All saved circles, course notes, tasks, quiz scores, focus sessions and imported-pack history will be removed from this app on this device. This cannot be undone. This is not a forensic secure erase.",
    [{text:"Cancel",style:"cancel"},
     {text:"Remove everything",style:"destructive",onPress:resetLocalData}]
  );
  const localSummary=learningSummary(tasks,sessions);
  const shareDigest=()=>{
    const digest=voluntaryLearningDigest(tasks,sessions);
    Alert.alert("Share only if you choose",
      "This report contains aggregate activity counts only, with no course names, notes, reflections or IDs. Small counts could still identify someone. Sharing through another app may use internet. Nothing is automatically sent.",
      [{text:"Keep private",style:"cancel"},
       {text:"Preview and share",onPress:()=>Alert.alert("Learning digest preview",digest,[
         {text:"Cancel",style:"cancel"},
         {text:"Send via another app",onPress:async()=>{try{await Share.share({title:"OpenForge optional learning digest",message:digest});}
           catch{Alert.alert("Could not share","No sharing option is available.");}}
       }])}]);
  };
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
    <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-4">
      <Text className="text-white text-xl font-bold">Recorded focus sessions</Text>
      <Text className="text-green-400 text-2xl font-semibold mt-3">{localSummary.focusSessions} sessions • {localSummary.focusMinutes} minutes</Text>
      <Text className="text-slate-400 mt-2">Self-recorded elapsed wall time, not verified concentration or attendance.</Text>
    </View>
    <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-4">
      <Text className="text-white text-lg font-bold">Optional tutor or mentor digest</Text>
      <Text className="text-slate-300 mt-2 leading-6">Preview a counts-only learning summary. No course name, task title, reflection or learner identity is included. You control whether to send it.</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Preview voluntary learning digest" className="bg-green-700 p-4 mt-4 rounded-xl items-center" onPress={shareDigest}>
        <Text className="text-white font-bold">Preview private report</Text>
      </TouchableOpacity>
    </View>
    <View className="bg-green-950 border border-green-800 rounded-2xl p-5 mt-6">
      <Text className="text-green-300 font-bold">Your privacy matters</Text>
      <Text className="text-slate-200 mt-2 leading-6">Nothing is automatically sent to tutors, institutions, or analytics servers. Only explicit use of the share feature sends a selected aggregate report through another app. Formal institutional reporting and sync are not yet enabled.</Text>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Remove all locally saved learning data"
      onPress={eraseData} className="border border-rose-700 rounded-xl p-4 items-center mt-6">
      <Text className="text-rose-300 font-bold">Remove all local learning data</Text>
    </TouchableOpacity>
    <Text className="text-slate-500 text-xs mt-2 leading-5">This clears this app's saved workspace. It is not a guaranteed forensic erase or a deletion of copies you previously shared.</Text>
  </ScrollView>;
}
