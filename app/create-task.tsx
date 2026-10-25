import { Alert } from "../lib/platformDialogs";
import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { LIMITS, newId, validateTask, type TaskType } from "../lib/study";

const types: TaskType[]=["discussion","explanation","peer-review","micro-quiz"];
export default function CreateTaskScreen() {
  const {circleId}=useLocalSearchParams<{circleId:string}>();
  const {circles,addTask}=useCircleStore();
  const circle=circles.find((c)=>c.id===circleId);
  const [title,setTitle]=useState("");
  const [prompt,setPrompt]=useState("");
  const [type,setType]=useState<TaskType>("discussion");
  const [options,setOptions]=useState(["","",""]);
  const [answer,setAnswer]=useState(0);
  const save=()=>{
    if(!circle){Alert.alert("Not found","Choose a valid circle.");return;}
    const issue=validateTask(title,prompt,type,options,answer);
    if(issue){Alert.alert("Check task",issue);return;}
    addTask({id:newId("task"),circleId:circle.id,circleName:circle.name,title:title.trim(),prompt:prompt.trim(),
      type,status:"pending",createdAt:Date.now(),
      ...(type==="micro-quiz"?{options:options.map((o)=>o.trim()),correctIndex:answer}:{})});
    router.back();
  };
  return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,paddingBottom:60}}>
    <Text className="text-white text-2xl font-bold">Create a learning task</Text>
    <Text className="text-slate-300 mt-2 mb-5">Build discussion, peer learning or an offline graded micro-quiz.</Text>
    <Text className="text-slate-300 mb-2">Task type</Text>
    <View className="flex-row flex-wrap mb-4">{types.map((value)=><TouchableOpacity key={value} accessibilityRole="button" onPress={()=>setType(value)}
      className={type===value?"bg-green-700 py-3 px-4 rounded-full mr-2 mb-2":"bg-slate-700 py-3 px-4 rounded-full mr-2 mb-2"}>
      <Text className="text-white font-semibold">{value.replace("-"," ")}</Text>
    </TouchableOpacity>)}</View>
    <Text className="text-slate-300 mb-2">Title</Text>
    <TextInput accessibilityLabel="Task title" className="bg-slate-800 text-white p-4 rounded-xl border border-slate-600 mb-5"
      placeholder="Explain fiscal federalism" placeholderTextColor="#94A3B8" value={title} onChangeText={setTitle} maxLength={LIMITS.taskTitle}/>
    <Text className="text-slate-300 mb-2">{type==="micro-quiz"?"Quiz question":"Instructions"}</Text>
    <TextInput accessibilityLabel="Task instructions" className="bg-slate-800 text-white p-4 rounded-xl border border-slate-600 mb-5"
      multiline style={{minHeight:100}} placeholder="What should learners do?" placeholderTextColor="#94A3B8" value={prompt} onChangeText={setPrompt} maxLength={LIMITS.prompt}/>
    {type==="micro-quiz"&&<View className="mb-5"><Text className="text-white font-bold mb-2">Answer choices (select the correct one)</Text>
      {options.map((option,i)=><View key={i} className="flex-row items-center mb-2">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Mark choice "+(i+1)+" as correct"} onPress={()=>setAnswer(i)}
          className={answer===i?"bg-green-600 rounded-full w-10 h-10 items-center justify-center mr-2":"bg-slate-700 rounded-full w-10 h-10 items-center justify-center mr-2"}>
          <Text className="text-white font-bold">{i+1}</Text>
        </TouchableOpacity>
        <TextInput accessibilityLabel={"Answer choice "+(i+1)} className="bg-slate-800 text-white p-3 rounded-xl border border-slate-600 flex-1"
          placeholder={"Option "+(i+1)} placeholderTextColor="#94A3B8" maxLength={200} value={option}
          onChangeText={(v)=>setOptions((old)=>old.map((item,j)=>j===i?v:item))}/>
      </View>)}
      <Text className="text-slate-400 text-sm mt-1">The correct answer becomes visible after a student submits an attempt on this device.</Text>
    </View>}
    <TouchableOpacity accessibilityRole="button" className="bg-green-600 rounded-xl p-4 items-center" onPress={save}>
      <Text className="text-white text-lg font-bold">Save offline task</Text>
    </TouchableOpacity>
  </ScrollView>;
}
