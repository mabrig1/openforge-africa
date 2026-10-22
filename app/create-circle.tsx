import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { newId, validateCircle, LIMITS } from "../lib/study";

export default function CreateCircleScreen() {
  const addCircle = useCircleStore((s)=>s.addCircle);
  const [name,setName]=useState("");
  const [courseCode,setCode]=useState("");
  const [courseTitle,setTitle]=useState("");
  const create=()=>{
    const issue=validateCircle(name,courseCode,courseTitle);
    if(issue){Alert.alert("Check details",issue);return;}
    const id=newId("circle");
    addCircle({id,name:name.trim(),courseCode:courseCode.trim().toUpperCase(),courseTitle:courseTitle.trim()||"Course",
      memberCount:1,taskCount:0,lastActivity:"Just now",createdAt:Date.now()});
    router.replace({pathname:"/circle/[id]",params:{id}});
  };
  return <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{padding:20}}>
    <Text className="text-white text-2xl font-bold">Start a circle</Text>
    <Text className="text-slate-300 mt-2 mb-7 leading-6">Organise a course and study together. Groups of 3–8 are recommended; inviting members will require a future sharing release.</Text>
    <Text className="text-slate-300 mb-2">Circle name</Text>
    <TextInput accessibilityLabel="Circle name" className="bg-slate-800 border border-slate-600 p-4 text-white rounded-xl mb-5"
      placeholder="PAD 101 Study Crew" placeholderTextColor="#94A3B8" value={name} onChangeText={setName} maxLength={LIMITS.circleName}/>
    <Text className="text-slate-300 mb-2">Course code</Text>
    <TextInput accessibilityLabel="Course code" className="bg-slate-800 border border-slate-600 p-4 text-white rounded-xl mb-5"
      placeholder="PAD 101" placeholderTextColor="#94A3B8" value={courseCode} onChangeText={setCode} autoCapitalize="characters" maxLength={LIMITS.courseCode}/>
    <Text className="text-slate-300 mb-2">Course title</Text>
    <TextInput accessibilityLabel="Course title" className="bg-slate-800 border border-slate-600 p-4 text-white rounded-xl mb-7"
      placeholder="Introduction to Public Administration" placeholderTextColor="#94A3B8" value={courseTitle} onChangeText={setTitle} maxLength={LIMITS.courseTitle}/>
    <TouchableOpacity accessibilityRole="button" className="bg-green-600 p-4 rounded-xl items-center" onPress={create}>
      <Text className="text-white font-bold text-lg">Create local workspace</Text>
    </TouchableOpacity>
  </ScrollView>;
}
