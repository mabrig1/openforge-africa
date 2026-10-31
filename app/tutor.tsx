import { useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { groundedReply } from "../lib/study";
import { setStudioDraft } from "../lib/studioDraft";
import { speakText, stopSpeech } from "../lib/speech";

interface TutorResult {
  answer: string;
  sources?: {ref:string;title:string}[];
  notice?: string;
}
export default function TutorScreen() {
  const circles = useCircleStore(s=>s.circles);
  const materials = useCircleStore(s=>s.materials);
  const params=useLocalSearchParams<{circleId?:string}>();
  const [circleId,setCircleId]=useState(params.circleId??"");
  const current=circleId||circles[0]?.id||"";
  const notes=materials.filter(s=>s.circleId===current);
  const [noteIds,setNoteIds]=useState<string[]>([]);
  const active=noteIds.filter(id=>notes.some(n=>n.id===id)).slice(0,3);
  const excerpts=notes.filter(n=>active.includes(n.id));
  const [question,setQuestion]=useState("");
  const [access,setAccess]=useState("");
  const [consent,setConsent]=useState(false);
  const [pending,setPending]=useState(false);
  const [result,setResult]=useState<TutorResult|null>(null);
  const [error,setError]=useState("");
  const [offline,setOffline]=useState(false);
  const toggle=(id:string)=>{setResult(null);setError("");setConsent(false);
    setNoteIds(previous=>previous.includes(id)?previous.filter(x=>x!==id):
      [...previous,id].slice(-3));};
  const askOffline=()=>{
    stopSpeech();
    const reply=groundedReply(question,excerpts);
    setResult({answer:reply.content,sources:reply.matched&&reply.sourceTitle?[{ref:"local",title:reply.sourceTitle}]:[]});
    setOffline(true);setError("");
  };
  const askCloud=async()=>{
    if(pending||!consent||!question.trim()||!excerpts.length||!access.trim())return;
    stopSpeech();setPending(true);setResult(null);setError("");setOffline(false);
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),23000);
    try {
      const endpoint=Platform.OS==="web"?"/api/tutor":"https://openforge.mabrigkorie.org/api/tutor";
      const response=await fetch(endpoint,{
        method:"POST",signal:controller.signal,
        headers:{"Content-Type":"application/json","X-OpenForge-Access-Token":access},
        body:JSON.stringify({question:question.trim().slice(0,500),
          sources:excerpts.map((m,i)=>({id:"note_"+(i+1),
            title:m.title,excerpt:m.content.slice(0,1500)}))}),
      });
      const data=await response.json() as TutorResult&{error?:string};
      if(!response.ok||typeof data.answer!=="string")
        throw new Error(data.error||"Cloud tutor unavailable; use Offline Coach.");
      setResult(data);
    } catch(e) {
      setError(e instanceof Error?e.message:"Tutor unavailable; use Offline Coach.");
    } finally {clearTimeout(timeout);setPending(false);}
  };
  const makeDraft=()=>{
    if(!result)return;
    setStudioDraft(question||"Study explanation",result.answer);
    router.push("/explainer");
  };
  const toReader=()=>{
    if(!result)return;
    setStudioDraft(question||"Study explanation",result.answer);
    router.push("/reader");
  };
  return <ScrollView className="bg-slate-900 flex-1"
    contentContainerStyle={{padding:18,paddingBottom:70}} keyboardShouldPersistTaps="handled">
    <Text className="text-green-400 text-xs font-bold">OPENFORGE • SOURCE-GROUNDED TUTOR</Text>
    <Text className="text-white text-3xl font-extrabold mt-2">Ask your AI Tutor</Text>
    <Text className="text-slate-300 mt-2 leading-6">
      Offline Coach reads only your saved notes. Optional generative tutoring sends ONLY the short
      excerpts you select, after consent, through a protected Cloudflare API.
    </Text>
    <View className="bg-amber-950 border border-amber-800 rounded-xl p-4 mt-4">
      <Text className="text-amber-100 leading-5">
        Cloud AI requires an owner-configured gateway, an access code, and may incur provider charges.
        Notes may contain sensitive data: only select material you have permission to transmit.
        AI output can contain mistakes. Nothing is sent until you press Ask cloud AI.
      </Text>
    </View>
    <Text className="text-white font-bold mt-6 mb-2">Select course</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {circles.map(c=><TouchableOpacity key={c.id} accessibilityRole="button"
        accessibilityLabel={"Choose "+c.courseCode} onPress={()=>{setCircleId(c.id);setNoteIds([]);setResult(null);setConsent(false);}}
        className={current===c.id?"bg-green-700 p-3 rounded-xl mr-2":"bg-slate-700 p-3 rounded-xl mr-2"}>
        <Text className="text-white">{c.courseCode}</Text>
      </TouchableOpacity>)}
    </ScrollView>
    {!circles.length && <Text className="text-amber-300 mt-3">Create a course circle and save notes before using the tutor.</Text>}
    <Text className="text-white font-bold mt-5 mb-2">Select up to three note excerpts</Text>
    {!notes.length && <Text className="text-slate-300">No saved notes in this course.</Text>}
    {notes.map(m=><TouchableOpacity key={m.id} accessibilityRole="checkbox"
      accessibilityState={{checked:active.includes(m.id)}}
      accessibilityLabel={"Share preview of "+m.title}
      onPress={()=>toggle(m.id)}
      className={active.includes(m.id)?"bg-green-900 border border-green-500 p-4 rounded-xl mb-2":"bg-slate-800 border border-slate-700 p-4 rounded-xl mb-2"}>
      <Text className="text-white font-semibold">{active.includes(m.id)?"✓ ":"○ "}{m.title}</Text>
      <Text className="text-slate-400 text-xs mt-1">{Math.min(m.content.length,1500)} characters selected for preview if checked</Text>
    </TouchableOpacity>)}
    {!!excerpts.length && <View className="bg-slate-800 p-4 rounded-xl mt-2">
      <Text className="text-green-300 font-bold">Exact excerpt preview — sent only if authorized</Text>
      {excerpts.map(m=><View key={m.id} className="mt-3 border-t border-slate-700 pt-2">
        <Text className="text-white font-bold">{m.title}</Text>
        <Text selectable className="text-slate-300 text-xs mt-1">{m.content.slice(0,1500)}</Text>
      </View>)}
    </View>}
    <Text className="text-white font-bold mt-5 mb-2">Your question</Text>
    <TextInput accessibilityLabel="Tutor question" value={question} onChangeText={setQuestion}
      maxLength={500} multiline placeholder="Explain this topic in simple steps..."
      placeholderTextColor="#94a3b8" className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4"
      style={{minHeight:82,textAlignVertical:"top"}}/>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ask offline note coach"
      disabled={!question.trim()||!excerpts.length} onPress={askOffline}
      className="bg-green-700 rounded-xl p-4 mt-4">
      <Text className="text-white font-bold text-center">Ask offline note coach (no data)</Text>
    </TouchableOpacity>
    <Text className="text-white font-bold mt-6 mb-2">Private cloud AI (optional)</Text>
    <TextInput accessibilityLabel="Owner tutor access code, not OpenRouter key"
      secureTextEntry autoCapitalize="none" value={access} onChangeText={setAccess}
      placeholder="Owner access code (not your API key)"
      placeholderTextColor="#94a3b8" className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4"/>
    <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{checked:consent}}
      accessibilityLabel="Consent to send the displayed source excerpts to cloud AI"
      onPress={()=>setConsent(v=>!v)} className="bg-slate-800 border border-slate-700 p-4 rounded-xl mt-3">
      <Text className="text-white">{consent?"☑":"☐"} I approve sending the displayed excerpts and my question to the AI provider.</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ask cloud AI"
      onPress={askCloud} disabled={pending||!consent||!access.trim()||!question.trim()||!excerpts.length}
      className="bg-indigo-700 rounded-xl p-4 mt-3">
      <Text className="text-white font-bold text-center">Ask cloud AI (requires owner authorization)</Text>
    </TouchableOpacity>
    {pending&&<ActivityIndicator color="#4ade80" style={{marginTop:18}}/>}
    {!!error&&<Text className="text-amber-300 mt-3">{error}</Text>}
    {result&&<View className="bg-slate-800 border border-green-700 rounded-2xl p-5 mt-5">
      <Text className="text-green-300 font-bold">{offline?"OFFLINE NOTE LOOKUP":"CLOUD AI • UNVERIFIED ANSWER"}</Text>
      <Text selectable className="text-white mt-3 leading-6">{result.answer}</Text>
      <Text className="text-slate-400 mt-3">Sources: {result.sources?.map(s=>s.title).join(", ")||"No matching source"}. Confirm accuracy in the original notes.</Text>
      <TouchableOpacity accessibilityRole="button" onPress={()=>speakText(result.answer)}
        className="bg-green-700 p-3 rounded-xl mt-4"><Text className="text-white text-center">▶ Read this aloud</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" onPress={stopSpeech}
        className="bg-slate-700 p-3 rounded-xl mt-2"><Text className="text-white text-center">■ Stop reading</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" onPress={makeDraft}
        className="bg-indigo-800 p-3 rounded-xl mt-2"><Text className="text-white text-center">Create infographic / text video →</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" onPress={toReader}
        className="border border-slate-600 p-3 rounded-xl mt-2"><Text className="text-white text-center">Open full text reader →</Text></TouchableOpacity>
    </View>}
  </ScrollView>;
}
