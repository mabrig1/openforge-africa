import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Share, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { buildStudyPack, parseStudyPack } from "../lib/studyPack";

export default function TransferPackScreen() {
  const {circleId}=useLocalSearchParams<{circleId:string}>();
  const {circles,tasks,materials,importPack,imports}=useCircleStore();
  const [raw,setRaw]=useState("");
  const circle=circles.find((c)=>c.id===circleId);
  const share=async()=>{
    if(!circle)return;
    try{
      const payload=buildStudyPack(circle,materials.filter((m)=>m.circleId===circle.id),
        tasks.filter((t)=>t.circleId===circle.id));
      await Share.share({title:"OpenForge Study Pack",message:payload});
    }catch(e){Alert.alert("Could not share",e instanceof Error?e.message:"Sharing is not available.");}
  };
  const preview=()=>{
    try{
      const pack=parseStudyPack(raw.trim());
      if(imports.includes(pack.dedupeKey)){
        Alert.alert("Already imported","This exact study pack was already imported on this device.");return;
      }
      Alert.alert("Import unverified study pack?",
        pack.name+" • "+pack.notes.length+" notes • "+pack.tasks.length+" tasks\n\nImported materials come from another person. Check their accuracy and copyright before use. Contents remain on this device.",[
          {text:"Cancel",style:"cancel"},{text:"Import local copy",onPress:()=>{
            const id=importPack(pack);
            if(id)router.replace({pathname:"/circle/[id]",params:{id}});
          }}
        ]);
    }catch(e){Alert.alert("Import failed",e instanceof Error?e.message:"Invalid study pack.");}
  };
  return <ScrollView className="bg-slate-900 flex-1" keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,paddingBottom:55}}>
    <Text className="text-white text-2xl font-bold">Study pack exchange</Text>
    <Text className="text-slate-300 mt-2 leading-6">Manually transfer notes and tasks through a sharing app, nearby device or copy-paste. This is not live sync, secure messaging or verified institutional material.</Text>
    <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-6">
      <Text className="text-green-400 font-bold text-lg">Send a study pack</Text>
      <Text className="text-slate-300 mt-2 mb-4 leading-5">You choose the destination. Sharing may use the internet or expose notes depending on the selected app. Do not include sensitive information.</Text>
      <TouchableOpacity accessibilityRole="button" disabled={!circle} onPress={share} className="bg-green-600 rounded-xl p-4 items-center">
        <Text className="text-white font-bold">{circle?"Share "+circle.courseCode:"Open a circle to share"}</Text>
      </TouchableOpacity>
    </View>
    <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
      <Text className="text-green-400 font-bold text-lg">Receive a study pack</Text>
      <Text className="text-slate-300 mt-2 mb-4">Paste the full OpenForge study pack text below. Import creates a new offline circle, never modifies your existing courses.</Text>
      <TextInput accessibilityLabel="Paste study pack JSON" multiline textAlignVertical="top"
        className="bg-slate-900 border border-slate-600 rounded-xl text-white p-3 mb-4" style={{minHeight:140}}
        value={raw} onChangeText={setRaw} maxLength={30000} placeholder="Paste study pack JSON..."
        placeholderTextColor="#94A3B8"/>
      <TouchableOpacity accessibilityRole="button" disabled={!raw.trim()} onPress={preview} className="bg-slate-700 rounded-xl p-4 items-center">
        <Text className="text-white font-bold">Review & import locally</Text>
      </TouchableOpacity>
    </View>
    <Text className="text-slate-400 text-sm mt-5 leading-5">Limits: 6 notes, 20 tasks and 30,000 characters per pack. Shared packs contain quiz answer keys. Do not use them for official examinations.</Text>
  </ScrollView>;
}
