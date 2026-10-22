import { useEffect, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useCircleStore } from "../../stores/circleStore";
import { elapsedFocusSeconds, learningSummary, MAX_REFLECTION } from "../../lib/focus";

function clock(total:number) {
  const minutes=Math.floor(total/60);
  const seconds=total%60;
  return String(minutes).padStart(2,"0")+":"+String(seconds).padStart(2,"0");
}
export default function SessionsScreen() {
  const {circles,sessions,activeFocus,startFocus,finishFocus,discardFocus}=useCircleStore();
  const [circleId,setCircleId]=useState<string|null>(null);
  const [reflection,setReflection]=useState("");
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{
    const interval=setInterval(()=>setNow(Date.now()),1000);
    return ()=>clearInterval(interval);
  },[]);
  const chosen=circleId && circles.some(c=>c.id===circleId) ? circleId:circles[0]?.id;
  const activeCircle=circles.find(c=>c.id===activeFocus?.circleId);
  const seconds=activeFocus?elapsedFocusSeconds(activeFocus.startedAt,now):0;
  const completedSessions=sessions.filter(s=>s.circleId===chosen);
  const finish=()=>{
    const saved=finishFocus(reflection);
    if(!saved){Alert.alert("Not yet saved","A session needs at least 10 seconds of elapsed time. If you changed your device clock, discard and restart.");return;}
    setReflection("");
    Alert.alert("Focus session saved","Your elapsed time was recorded on this device. This is not independently verified attendance.");
  };
  return <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{padding:18,paddingBottom:60}}>
    <Text className="text-white text-3xl font-extrabold mt-2">Focus Studio</Text>
    <Text className="text-slate-300 leading-6 mt-2">Create a distraction-light study sprint, record progress and reflect on your learning. Works without data.</Text>
    {activeFocus ? <View className="bg-green-950 border border-green-700 rounded-3xl p-6 mt-6">
      <Text className="text-green-300 font-bold tracking-widest">CURRENT STUDY SPRINT</Text>
      <Text className="text-white text-xl font-bold mt-2">{activeCircle?.courseCode || "Study circle"}</Text>
      <Text className="text-white text-6xl font-extrabold mt-5 text-center" accessibilityLabel={seconds+" seconds elapsed"}>{clock(seconds)}</Text>
      <Text className="text-slate-300 text-center mt-3 mb-5">Elapsed device time • max recorded 4 hours</Text>
      <Text className="text-slate-300 mb-2">What did you understand or practise? (optional)</Text>
      <TextInput accessibilityLabel="Optional study reflection" className="bg-slate-800 border border-slate-600 p-4 rounded-xl text-white mb-4"
        placeholder="One thing I learned..." placeholderTextColor="#94A3B8" multiline maxLength={MAX_REFLECTION}
        value={reflection} onChangeText={setReflection} />
      <TouchableOpacity accessibilityRole="button" className="bg-green-600 rounded-xl p-4 items-center" onPress={finish}>
        <Text className="text-white font-bold text-lg">Finish and record sprint</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" className="rounded-xl border border-rose-700 p-4 items-center mt-3"
        onPress={()=>Alert.alert("Discard active session?","Elapsed time will not be saved.",[
          {text:"Continue studying",style:"cancel"},
          {text:"Discard",style:"destructive",onPress:()=>{discardFocus();setReflection("");}}
        ])}>
        <Text className="text-rose-300 font-bold">Discard without saving</Text>
      </TouchableOpacity>
    </View> : <View className="bg-slate-800 border border-slate-700 rounded-3xl p-5 mt-6">
      <Text className="text-green-400 font-bold tracking-widest">START A STUDY SPRINT</Text>
      <Text className="text-slate-300 mt-3 mb-4">Choose a course. One device records one active sprint at a time.</Text>
      {!circles.length && <Text className="text-amber-300 mb-4">Create a study circle in the Circles tab first.</Text>}
      {circles.map(c=><TouchableOpacity key={c.id} accessibilityRole="button" accessibilityLabel={"Select "+c.courseCode}
        onPress={()=>setCircleId(c.id)} className={chosen===c.id?"bg-green-800 border border-green-600 rounded-xl p-4 mb-2":"bg-slate-700 rounded-xl p-4 mb-2"}>
        <Text className="text-white font-bold">{c.courseCode} — {c.name}</Text>
      </TouchableOpacity>)}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Start offline study sprint"
        disabled={!chosen} onPress={()=>{
          if(chosen&&!startFocus(chosen)) Alert.alert("Could not start","Finish the current sprint first.");
        }} className="bg-green-600 rounded-xl p-4 mt-3 items-center">
        <Text className="text-white font-bold text-lg">Start studying</Text>
      </TouchableOpacity>
    </View>}
    <Text className="text-white text-xl font-bold mt-8">Saved focus history</Text>
    <Text className="text-slate-400 text-sm mt-1 mb-3">Local, self-recorded time — not proof of attendance or attention.</Text>
    <View className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
      <Text className="text-green-400 font-bold">{learningSummary([],completedSessions).focusSessions} sessions • {learningSummary([],completedSessions).focusMinutes} minutes for selected circle</Text>
      {completedSessions.length===0&&<Text className="text-slate-300 mt-3">No saved sessions for this circle yet.</Text>}
      {completedSessions.slice(0,20).map(s=><View key={s.id} className="border-t border-slate-700 pt-3 mt-3">
        <Text className="text-white font-bold">{Math.floor(s.seconds/60)} minutes {s.seconds%60} seconds</Text>
        <Text className="text-slate-400 text-xs mt-1">{new Date(s.endedAt).toLocaleString()}</Text>
        {!!s.reflection&&<Text className="text-slate-300 mt-2">{s.reflection}</Text>}
      </View>)}
      {completedSessions.length>20&&<Text className="text-slate-400 text-sm mt-4">Showing the latest 20 of {completedSessions.length} local sessions.</Text>}
    </View>
  </ScrollView>;
}
