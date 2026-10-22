import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCircleStore } from "../../stores/circleStore";
import { gradeQuiz } from "../../lib/study";

export default function TaskDetailScreen() {
  const {id}=useLocalSearchParams<{id:string}>();
  const task=useCircleStore((s)=>s.tasks.find((t)=>t.id===id));
  const completeTask=useCircleStore((s)=>s.completeTask);
  const [selection,setSelection]=useState<number | null>(null);
  if(!task) return <View className="bg-slate-900 flex-1 justify-center p-8"><Text className="text-white">Task not found on this device.</Text></View>;
  const done=task.status==="completed";
  const outcome=done&&task.type==="micro-quiz"&&task.selectedIndex!==undefined?
    gradeQuiz(task,task.selectedIndex):null;
  const submit=()=>{
    if(task.type==="micro-quiz"&&selection===null){Alert.alert("Choose an answer","Select one of the three options.");return;}
    completeTask(task.id,selection===null?undefined:selection);
  };
  return <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{padding:20,paddingBottom:40}}>
    <Text className="text-green-400 uppercase font-bold">{task.type.replace("-"," ")}</Text>
    <Text className="text-white text-3xl font-bold mt-2">{task.title}</Text>
    <Text className="text-slate-400 mt-2 mb-6">{task.circleName}</Text>
    <View className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-5">
      <Text className="text-white text-lg leading-7">{task.prompt || "Complete this learning activity with your circle."}</Text>
    </View>
    {task.type==="micro-quiz"&&task.options?.map((choice,i)=><TouchableOpacity key={i}
      accessibilityRole="button" accessibilityLabel={"Answer "+(i+1)+": "+choice}
      disabled={done} onPress={()=>setSelection(i)}
      className={(done?task.selectedIndex===i:selection===i)?"bg-green-800 rounded-xl p-5 mb-3 border border-green-500":"bg-slate-800 rounded-xl p-5 mb-3 border border-slate-600"}>
      <Text className="text-white font-semibold">{i+1}. {choice}</Text>
    </TouchableOpacity>)}
    {done?<View className="bg-green-950 border border-green-800 p-5 rounded-2xl">
      <Text className="text-green-400 text-lg font-bold">{outcome===true?"Correct answer!":outcome===false?"Answer submitted":"Task completed"}</Text>
      {task.type==="micro-quiz"&&task.options&&task.correctIndex!==undefined&&
        <Text className="text-white mt-2">Correct answer: {task.options[task.correctIndex]}</Text>}
      <Text className="text-slate-300 mt-2">This result is saved on your device.</Text>
    </View>:<TouchableOpacity accessibilityRole="button" onPress={submit} className="bg-green-600 p-4 rounded-xl items-center">
      <Text className="text-white font-bold text-lg">{task.type==="micro-quiz"?"Submit answer":"Mark as completed"}</Text>
    </TouchableOpacity>}
    <TouchableOpacity accessibilityRole="button" className="mt-5 p-3 items-center" onPress={()=>router.back()}>
      <Text className="text-slate-300">Return to study</Text>
    </TouchableOpacity>
  </ScrollView>;
}
