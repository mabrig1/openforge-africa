import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, Share } from "react-native";
import { router } from "expo-router";
import { useCircleStore } from "../stores/circleStore";
import { localDay, optionalPilotDigest, pilotDay, pilotSummary,
  type StudyMode, type Barrier, type Helpfulness } from "../lib/pilot";

const modeOptions: {value: StudyMode; label: string}[] = [
 {value:"solo",label:"Studied alone"}, {value:"in-person",label:"With a peer in person"},
 {value:"messaging",label:"With a peer by message/call"}];
const barrierOptions: {value: Barrier; label: string}[] = [
 {value:"none",label:"None"}, {value:"data",label:"Mobile data"},
 {value:"device",label:"Device or battery"},{value:"time",label:"Time"},
 {value:"materials",label:"Course materials"},{value:"other",label:"Other"}];

export default function PilotScreen() {
  const { circles, pilots, startPilot, recordPilotCheckIn } = useCircleStore();
  const [pickedId,setPickedId]=useState<string|null>(null);
  const [mode,setMode]=useState<StudyMode>("solo");
  const [barrier,setBarrier]=useState<Barrier>("none");
  const [rating,setRating]=useState<Helpfulness>(3);
  const circleId=pickedId && circles.some(c=>c.id===pickedId)?pickedId:circles[0]?.id;
  const circle=circles.find(c=>c.id===circleId);
  const pilot=pilots.find(p=>p.circleId===circleId);
  const today=localDay(new Date());
  const day=pilot?pilotDay(pilot,today):null;
  const already=pilot?.checkIns.some(c=>c.day===today);
  const stats=pilot?pilotSummary([pilot]):null;

  const save=()=>{
    if(!circleId || !pilot) return;
    const saved=recordPilotCheckIn(circleId,{day:today,mode,barrier,helpfulness:rating});
    Alert.alert(saved?"Check-in saved locally":"Check-in not saved", saved?
      "Your self-report stays on this device. You can preview an optional aggregate report later.":
      "You may have already checked in today or your seven-day window has ended. Check the device date.");
  };
  const share=()=>{
    if(!pilot) return;
    const digest=optionalPilotDigest([pilot]);
    Alert.alert("Private by default",
      "This optional report is just aggregate counts; small numbers may still identify you to someone who knows your circumstances. A chosen sharing app may use the internet.",
      [{text:"Keep private",style:"cancel"},{text:"See report",onPress:()=>{
        Alert.alert("Report preview",digest,[
          {text:"Cancel",style:"cancel"},
          {text:"Choose recipient",onPress:async()=>{
            try { await Share.share({title:"OpenForge optional seven-day pilot report",message:digest}); }
            catch {Alert.alert("Share unavailable","Your report was not sent by OpenForge.");}
          }}
        ]);
      }}]);
  };
  return <ScrollView className="flex-1 bg-slate-900"
    contentContainerStyle={{padding:18,paddingBottom:70}}>
    <Text className="text-green-400 text-sm font-bold">OFFLINE • OPT IN • PRIVATE</Text>
    <Text className="text-white text-3xl font-extrabold mt-2">Seven-day study pilot</Text>
    <Text className="text-slate-300 mt-3 leading-6">Try one simple study routine for a week. Each day, record whether you studied alone or with peers, your biggest obstacle, and a usefulness score. All entries stay on this device unless you deliberately share a summary.</Text>
    <View className="bg-amber-950 border border-amber-800 rounded-xl p-4 mt-5">
      <Text className="text-amber-200 leading-5">Pilot entries are self-reported. This is not a proven attendance tracker, peer synchronization system, or institutional research study. Do not enter names or sensitive records.</Text>
    </View>
    {!circles.length ? <TouchableOpacity accessibilityRole="button"
      onPress={()=>router.push("/create-circle")} className="bg-green-700 p-4 rounded-xl mt-5">
      <Text className="text-white text-center font-bold">Create your first study circle</Text>
    </TouchableOpacity> : <>
      <Text className="text-white text-lg font-bold mt-6 mb-3">Choose course circle</Text>
      {circles.map(c=><TouchableOpacity key={c.id} accessibilityRole="button"
        accessibilityState={{selected:circleId===c.id}}
        accessibilityLabel={"Select circle for "+c.courseCode}
        onPress={()=>setPickedId(c.id)}
        className={circleId===c.id?"bg-green-900 border border-green-500 rounded-xl p-4 mb-2":"bg-slate-800 border border-slate-700 rounded-xl p-4 mb-2"}>
          <Text className="text-white font-semibold">{c.courseCode} — {c.name}</Text>
      </TouchableOpacity>)}
      {!pilot ? <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
        <Text className="text-white text-xl font-bold">Start a local seven-day pilot</Text>
        <Text className="text-slate-300 mt-2 leading-5">Starting sets day one to today's local date. You can submit at most one check-in per calendar day for seven days. The clock can be changed, so these dates are not verified evidence.</Text>
        <TouchableOpacity accessibilityRole="button" onPress={()=>{if(circleId&&startPilot(circleId)) Alert.alert("Pilot started","Your optional seven-day pilot is now stored locally.");}}
          className="bg-green-700 p-4 rounded-xl mt-5">
          <Text className="text-white text-center font-bold">Opt in and start</Text>
        </TouchableOpacity>
      </View> : <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
        <Text className="text-green-400 font-bold">{day===null?"Seven-day window closed":"Day "+day+" of 7"}</Text>
        <Text className="text-white font-bold text-2xl mt-2">{stats?.checkIns ?? 0} daily check-ins</Text>
        <Text className="text-slate-300 mt-2">Reported peer-study days: {stats?.peerSessions ?? 0} • obstacle days: {stats?.barrierDays ?? 0}</Text>
        {day===null?<Text className="text-amber-300 mt-4">The check-in window is closed. You can still preview your saved summary or remove it by deleting this circle/resetting local data.</Text>
        : already?<Text className="text-green-300 mt-4">Today's entry is saved. Return on another day.</Text>
        : <>
          <Text className="text-white text-lg font-bold mt-6">How did you study today?</Text>
          {modeOptions.map(o=><TouchableOpacity key={o.value} accessibilityRole="radio"
            accessibilityState={{checked:mode===o.value}}
            accessibilityLabel={o.label} onPress={()=>setMode(o.value)}
            className={mode===o.value?"bg-green-900 border border-green-600 rounded-xl p-3 mt-2":"bg-slate-700 rounded-xl p-3 mt-2"}>
            <Text className="text-white">{o.label}</Text>
          </TouchableOpacity>)}
          <Text className="text-white text-lg font-bold mt-6">Biggest obstacle</Text>
          {barrierOptions.map(o=><TouchableOpacity key={o.value} accessibilityRole="radio"
            accessibilityState={{checked:barrier===o.value}} accessibilityLabel={o.label}
            onPress={()=>setBarrier(o.value)}
            className={barrier===o.value?"bg-green-900 border border-green-600 rounded-xl p-3 mt-2":"bg-slate-700 rounded-xl p-3 mt-2"}>
            <Text className="text-white">{o.label}</Text>
          </TouchableOpacity>)}
          <Text className="text-white text-lg font-bold mt-6">How useful was today's study? (1–5)</Text>
          <View className="flex-row mt-3 justify-between">
            {([1,2,3,4,5] as Helpfulness[]).map(n=><TouchableOpacity key={n}
              accessibilityRole="radio" accessibilityState={{checked:rating===n}}
              accessibilityLabel={n+" out of 5"} onPress={()=>setRating(n)}
              className={rating===n?"bg-green-600 p-3 rounded-xl":"bg-slate-700 p-3 rounded-xl"}>
              <Text className="text-white font-bold">{n}</Text>
            </TouchableOpacity>)}
          </View>
          <TouchableOpacity accessibilityRole="button" onPress={save}
            className="bg-green-700 p-4 rounded-xl mt-6">
            <Text className="text-white text-center font-bold">Save today's self-report locally</Text>
          </TouchableOpacity>
        </>}
        <TouchableOpacity accessibilityRole="button" onPress={share}
          className="border border-green-600 p-4 rounded-xl mt-5">
          <Text className="text-green-300 text-center font-bold">Preview optional aggregate summary</Text>
        </TouchableOpacity>
      </View>}
    </>}
    <Text className="text-slate-400 text-xs mt-6 leading-5">This pilot does not contact OpenForge servers, verify peer participation, or measure dropout. Study material and personal data remain in unencrypted AsyncStorage. Avoid confidential information on shared devices.</Text>
  </ScrollView>;
}
