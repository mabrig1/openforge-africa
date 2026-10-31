import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { getStudioDraft, setStudioDraft } from "../lib/studioDraft";
import { speakText, stopSpeech } from "../lib/speech";

export default function ReaderScreen() {
  const [text,setText]=useState(()=>getStudioDraft().body);
  const [rate,setRate]=useState(1);
  const [issue,setIssue]=useState("");
  const materials=useCircleStore(s=>s.materials);
  useEffect(()=>()=>stopSpeech(),[]);
  const read=()=>{
    try { setIssue("");speakText(text,rate); }
    catch(e){setIssue(e instanceof Error?e.message:"Your device does not support speech.");}
  };
  return <ScrollView className="flex-1 bg-slate-900"
    contentContainerStyle={{padding:18,paddingBottom:65}} keyboardShouldPersistTaps="handled">
    <Text className="text-green-400 text-xs font-bold">OPENFORGE • ACCESSIBLE LEARNING</Text>
    <Text className="text-white text-3xl font-extrabold mt-2">Text Reader</Text>
    <Text className="text-slate-300 mt-2 leading-6">
      Listen to an explanation, your own writing, or saved course notes using device speech.
      No OpenForge cloud upload is needed. Available voices depend on your device.
    </Text>
    {!!materials.length&&<View className="mt-5">
      <Text className="text-white font-semibold mb-2">Load a saved note</Text>
      {materials.slice(0,15).map(m=><TouchableOpacity key={m.id} accessibilityRole="button"
        onPress={()=>{stopSpeech();setText(m.content.slice(0,4000));}}
        className="bg-slate-800 rounded-xl p-3 mb-2 border border-slate-700">
        <Text className="text-white">{m.title} →</Text>
      </TouchableOpacity>)}
    </View>}
    <Text className="text-white font-bold mt-5 mb-2">Text to read (up to 4,000 characters)</Text>
    <TextInput multiline accessibilityLabel="Text for speech reader" value={text}
      onChangeText={setText} maxLength={4000} textAlignVertical="top"
      placeholder="Paste or type the lesson you want to hear..."
      placeholderTextColor="#94a3b8" className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4"
      style={{minHeight:210}}/>
    <Text className="text-white font-bold mt-5">Reading speed</Text>
    <View className="flex-row mt-3">
      {[0.8,1,1.2,1.5].map(n=><TouchableOpacity key={n}
        accessibilityRole="button" accessibilityLabel={"Speed "+n+" times"}
        onPress={()=>{stopSpeech();setRate(n);}}
        className={rate===n?"bg-green-700 rounded-xl p-3 mr-2":"bg-slate-700 rounded-xl p-3 mr-2"}>
        <Text className="text-white font-bold">{n}×</Text>
      </TouchableOpacity>)}
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Speak selected text"
      disabled={!text.trim()} onPress={read} className="bg-green-700 p-4 rounded-xl mt-5">
      <Text className="text-white text-center font-bold">▶ Play text aloud</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop speaking"
      onPress={stopSpeech} className="bg-slate-700 p-4 rounded-xl mt-3">
      <Text className="text-white text-center font-bold">■ Stop speaking</Text>
    </TouchableOpacity>
    {!!issue&&<Text className="text-amber-300 mt-4">{issue}</Text>}
    <TouchableOpacity accessibilityRole="button" onPress={()=>{setStudioDraft("Read-aloud lesson",text);router.push("/explainer");}}
      disabled={!text.trim()} className="bg-indigo-900 border border-indigo-600 p-4 rounded-xl mt-5">
      <Text className="text-white text-center font-semibold">Visualize this lesson as an infographic / video →</Text>
    </TouchableOpacity>
    <Text className="text-slate-400 mt-5 leading-5">
      The reader uses your installed browser or operating-system speech service. Native voice features depend on the Expo build and installed TTS voices. Audio is played on your device; this screen does not create an MP3 file.
    </Text>
  </ScrollView>;
}
