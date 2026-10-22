import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { LIMITS, newId, validateMaterial } from "../lib/study";

export default function AddMaterialScreen() {
  const {circleId}=useLocalSearchParams<{circleId:string}>();
  const circles=useCircleStore((s)=>s.circles);
  const addMaterial=useCircleStore((s)=>s.addMaterial);
  const [title,setTitle]=useState("");
  const [content,setContent]=useState("");
  const circle=circles.find((c)=>c.id===circleId);
  const save=()=>{
    if(!circle){Alert.alert("Not found","Choose a valid circle.");return;}
    const error=validateMaterial(title,content);
    if(error){Alert.alert("Check course notes",error);return;}
    addMaterial({id:newId("note"),circleId:circle.id,title:title.trim(),content:content.trim(),createdAt:Date.now()});
    router.back();
  };
  return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,paddingBottom:45}}>
    <Text className="text-white text-2xl font-bold">Save study material</Text>
    <Text className="text-slate-300 mt-2 mb-6 leading-6">Paste only materials you have a right to use. They stay on this device. The Study Coach will quote matching passages, not generate unsupported facts.</Text>
    <Text className="text-slate-300 mb-2">Source name</Text>
    <TextInput accessibilityLabel="Source name" className="bg-slate-800 border border-slate-600 rounded-xl p-4 text-white mb-5"
      placeholder="PAD 101 — Unit 2" placeholderTextColor="#94A3B8" value={title} onChangeText={setTitle} maxLength={LIMITS.materialTitle}/>
    <Text className="text-slate-300 mb-2">Course notes</Text>
    <TextInput accessibilityLabel="Course notes" multiline textAlignVertical="top" className="bg-slate-800 border border-slate-600 rounded-xl p-4 text-white mb-2"
      style={{minHeight:230}} placeholder="Paste a paragraph or section of your course notes..." placeholderTextColor="#94A3B8"
      value={content} onChangeText={setContent} maxLength={LIMITS.materialContent}/>
    <Text className="text-slate-400 text-right text-xs mb-6">{content.length}/{LIMITS.materialContent} characters</Text>
    <TouchableOpacity accessibilityRole="button" onPress={save} className="bg-green-600 rounded-xl p-4 items-center">
      <Text className="text-white font-bold text-lg">Save locally</Text>
    </TouchableOpacity>
  </ScrollView>;
}
