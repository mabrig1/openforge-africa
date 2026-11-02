import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { getStudioDraft, setStudioDraft } from "../lib/studioDraft";
import { speakText, stopSpeech, getSpeechVoices } from "../lib/speech";
import {bestAvailableVoice,type SpeechVoiceChoice} from "../lib/voiceSelection";
import {useNarrationStore} from "../stores/narrationStore";

export default function ReaderScreen() {
  const [text,setText]=useState(()=>getStudioDraft().body);
  const rate=useNarrationStore(s=>s.rate);
  const setRate=useNarrationStore(s=>s.setRate);
  const voiceId=useNarrationStore(s=>s.voiceId);
  const setVoiceId=useNarrationStore(s=>s.setVoiceId);
  const [voices,setVoices]=useState<SpeechVoiceChoice[]>([]);
  const [voiceLoading,setVoiceLoading]=useState(true);
  const [showAllVoices,setShowAllVoices]=useState(false);
  const [issue,setIssue]=useState("");
  const materials=useCircleStore(s=>s.materials);
  useEffect(()=>{
    let active=true;
    getSpeechVoices().then(list=>{if(active){setVoices(list);setVoiceLoading(false);}})
      .catch(()=>{if(active)setVoiceLoading(false);});
    return ()=>{active=false;stopSpeech();};
  },[]);
  const selected=bestAvailableVoice(voices,voiceId);
  const regional=selected?.lang.toLowerCase()==="en-ng";
  const preview=()=>{
    try{setIssue("");speakText("Welcome to OpenForge Africa. I will guide you through each lesson at a clear, measured pace.",rate,selected?.id);}
    catch(e){setIssue(e instanceof Error?e.message:"Voice preview is unavailable.");}
  };
  const read=()=>{
    try { setIssue("");speakText(text,rate,selected?.id); }
    catch(e){setIssue(e instanceof Error?e.message:"Your device does not support speech.");}
  };
  return <ScrollView className="flex-1 bg-slate-900"
    contentContainerStyle={{padding:18,paddingBottom:65}} keyboardShouldPersistTaps="handled">
    <Text className="text-green-400 text-xs font-bold">OPENFORGE • ACCESSIBLE LEARNING</Text>
    <Text className="text-white text-3xl font-extrabold mt-2">Text Reader</Text>
    <Text className="text-slate-300 mt-2 leading-6">
      Choose your narrator, preview its sound and listen to your notes. Nigerian English voices
      are preferred when installed. No text is uploaded by this offline reader.
    </Text>
    <View className="bg-slate-800 border border-emerald-700 rounded-2xl p-4 mt-5">
      <Text className="text-emerald-300 font-bold">Narrator voice</Text>
      <Text className="text-white text-lg font-bold mt-2">
       {selected?selected.name+" · "+selected.lang:"Device default · English"}
      </Text>
      <Text className="text-slate-300 mt-2">
       {voiceLoading?"Checking voices installed on your device...":
        regional?"Nigerian English voice detected. Listen to confirm this matches your preferred tone.":
        "A Nigerian English voice was not detected on this device. The selected English fallback may sound synthetic."}
      </Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Preview narrator voice"
       onPress={preview} className="bg-emerald-700 rounded-xl p-3 mt-3">
       <Text className="text-white text-center font-bold">▶ Preview narrator</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose installed narrator voice"
       accessibilityState={{expanded:showAllVoices}}
       onPress={()=>setShowAllVoices(v=>!v)} className="bg-slate-700 rounded-xl p-3 mt-3">
       <Text className="text-white text-center font-bold">{showAllVoices?"Hide voices ↑":"Choose installed voice ↓"}</Text>
      </TouchableOpacity>
      {showAllVoices&&<View className="mt-3">
       {voices.length===0?<Text className="text-amber-200">No selectable English voices were reported. The system fallback may be used.</Text>:
        voices.map(v=><TouchableOpacity key={v.id} accessibilityRole="button"
         accessibilityLabel={"Use narrator "+v.name+" "+v.lang} accessibilityState={{selected:selected?.id===v.id}}
         onPress={()=>{stopSpeech();setVoiceId(v.id);}} className={selected?.id===v.id?
          "bg-emerald-900 border border-emerald-600 rounded-xl p-3 mb-2":"bg-slate-700 rounded-xl p-3 mb-2"}>
         <Text className="text-white font-bold">{v.name}</Text>
         <Text className="text-slate-200 text-xs">{v.lang} · {v.quality==="enhanced"?"Enhanced if supported":"System voice"}</Text>
        </TouchableOpacity>)}
      </View>}
      <Text className="text-slate-400 text-xs mt-3">
       A guaranteed natural African male voice requires a licensed neural TTS provider
       (for example Microsoft's en-NG-AbeoNeural) and secure server configuration.
       Installed device voices cannot guarantee gender, accent or human-like quality.
      </Text>
    </View>
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
      {[0.85,0.94,1.05,1.2].map(n=><TouchableOpacity key={n}
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
      Installed voices differ across Chrome, Android, iOS and desktop. Voice and speed choices
      remain on this device. This reader does not generate audio files or impersonate a person.
    </Text>
  </ScrollView>;
}
