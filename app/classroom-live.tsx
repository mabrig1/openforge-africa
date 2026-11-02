import {useState} from "react";
import {Linking,Platform,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {useLocalSearchParams,router} from "expo-router";
import {useClassroomAcademyDashboard} from "../hooks/useClassroomAcademyDashboard";
import {academyCourseExists,academyCourseReview,listAcademyClassroomUnits} from "../lib/classroomAcademyBridge";
import {CLASSROOM_AGENTS,type ClassroomAgentId} from "../lib/openMaicClassroom";
import type {AcademyCourseId} from "../lib/academyDashboard";

type Quota={
 plan:"basic"|"explorer";limit:number;used:number;remaining:number;
 canUse:boolean;canStartTrial:boolean;trialStarted:string|null;
 globalCapacityAvailable:boolean;
};
type Status={mode:string;dayUtc:string;quota:Quota;error?:string};
type ResponseContent={answer?:string;name?:string;warning?:string;error?:string;quota?:Quota};
const endpoint="/api/classroom-public";
const absolute=(path:string)=>Platform.OS==="web"?
 (typeof window==="undefined"?"":window.location.origin)+path:
 "https://openforge.mabrigkorie.org"+path;

export default function FreeClassroomAI(){
 const params=useLocalSearchParams<{course?:string}>();
 const academy=useClassroomAcademyDashboard();
 const [courseId,setCourseId]=useState<AcademyCourseId>(
  academyCourseExists(params.course??"")?params.course as AcademyCourseId:"logic");
 const [unitId,setUnitId]=useState<number|null>(null);
 const [agent,setAgent]=useState<ClassroomAgentId>("of-teacher");
 const [question,setQuestion]=useState("");
 const [consent,setConsent]=useState(false);
 const [status,setStatus]=useState<Status|null>(null);
 const [answer,setAnswer]=useState<ResponseContent|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [previewOpen,setPreviewOpen]=useState(false);
 const course=academy.courses.find(c=>c.id===courseId)??academy.courses[0];
 const review=academyCourseReview(course,unitId??undefined);
 const units=listAcademyClassroomUnits(course.id);
 const request=async(action:"status"|"trial"|"ask")=>{
  if(busy)return;
  setError("");
  setBusy(true);
  const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),24000);
  try{
   const path=endpoint+"/"+action;
   const isStatus=action==="status";
   const body=action==="ask"?JSON.stringify({
    agentId:agent,question:question.trim(),
    sources:[{id:"public_review_"+review.courseId+"_"+review.unitId,
     title:review.source.title,excerpt:review.source.content.slice(0,1500)}],
   }):"{}";
   const res=await fetch(absolute(path),{
    method:isStatus?"GET":"POST",signal:ctl.signal,
    credentials:"same-origin",
    ...(isStatus?{}:{headers:{"Content-Type":"application/json"},body}),
   });
   const type=res.headers.get("Content-Type")||"";
   if(!type.includes("application/json"))
    throw Error("Cloudflare Access sign-in may be required. Use the sign-in link and retry.");
   const parsed=await res.json() as Status&ResponseContent;
   if(!res.ok)throw Error(parsed.error||"Authenticated AI trial is unavailable.");
   if(parsed.quota)setStatus({mode:"authenticated-public-trial",dayUtc:new Date().toISOString().slice(0,10),
    quota:parsed.quota});
   if(action==="ask"){
    setAnswer(parsed);
    setConsent(false);
   }else{
    setAnswer(null);
   }
  }catch(e){
   setError(e instanceof Error?e.message:"Authenticated trial is unavailable.");
  }finally{clearTimeout(timeout);setBusy(false);}
 };
 return <ScrollView className="flex-1 bg-slate-900"
  contentContainerStyle={{padding:18,paddingBottom:90}} keyboardShouldPersistTaps="handled">
  <Text className="text-emerald-300 text-xs font-bold">OPENFORGE AFRICA · LEARNING OPTIONS</Text>
  <Text className="text-white text-3xl font-extrabold mt-2">Your classroom is ready</Text>
  <Text className="text-slate-300 mt-3 leading-6">
   You do not need an account or an AI subscription to study. The free classroom uses selected Academy reviews and runs on this device.
  </Text>
  <View className="bg-emerald-950 border border-emerald-600 rounded-2xl p-5 mt-5">
   <Text className="text-emerald-300 text-xs font-bold">AVAILABLE NOW · NO LOGIN</Text>
   <Text className="text-white text-xl font-bold mt-2">Start a guided lesson with the classroom roles</Text>
   <Text className="text-slate-200 mt-2 leading-5">
    Open a real course review, ask the teacher, and hear different viewpoints from the 15 local learning roles. This is source-guided offline learning, not generative model inference.
   </Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Start working free classroom now"
    onPress={()=>router.replace({pathname:"/classroom",params:{course:course.id}})}
    className="bg-emerald-500 rounded-xl p-4 mt-4">
    <Text className="text-slate-950 text-center font-extrabold">START FREE CLASSROOM →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Browse ten available courses"
    onPress={()=>router.push("/academy")} className="bg-slate-700 rounded-xl p-3 mt-3">
    <Text className="text-white text-center font-bold">Browse the course catalogue</Text>
   </TouchableOpacity>
  </View>
  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mt-5">
   <Text className="text-white text-lg font-bold">Optional live AI</Text>
   <Text className="text-slate-300 mt-2 leading-5">
    Online model replies need identity verification, a durable quota service and a funded provider. Availability is not confirmed; free lessons work independently.
   </Text>
   <TouchableOpacity accessibilityRole="button" accessibilityState={{expanded:previewOpen}}
    accessibilityLabel={previewOpen?"Hide optional AI trial settings":"Show optional AI trial settings"}
    onPress={()=>setPreviewOpen(x=>!x)} className="bg-indigo-700 rounded-xl p-4 mt-4">
    <Text className="text-white text-center font-bold">{previewOpen?"Hide live AI trial settings ↑":"Check optional live AI access ↓"}</Text>
   </TouchableOpacity>
  </View>
  {previewOpen&&<View>
  <View className="bg-slate-800 rounded-xl p-4 mt-4">
   <Text className="text-white font-bold">Account verification and quota</Text>
   <Text className="text-slate-300 mt-2">
    Server rules when enabled: Basic 1 model response per UTC day; one-time 7-day
    Explorer 2 model responses per UTC day, subject to a shared platform ceiling.
    Free offline Basic/Explorer allowances remain unchanged.
   </Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open authenticated classroom sign-in"
    onPress={()=>Linking.openURL(absolute(endpoint+"/status"))}
    className="bg-indigo-800 rounded-xl p-3 mt-4">
    <Text className="text-white text-center font-bold">Open account sign-in / Access status →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Check server-backed trial status"
    onPress={()=>request("status")} disabled={busy}
    className="bg-green-700 rounded-xl p-3 mt-3">
    <Text className="text-white text-center font-bold">{busy?"Checking server…":"Check secure trial status"}</Text>
   </TouchableOpacity>
   {status&&<View className="bg-slate-900 p-3 rounded-xl mt-3">
    <Text className="text-green-200 font-bold">{status.quota.plan.toUpperCase()} • {status.quota.remaining}/{status.quota.limit} server calls remaining today</Text>
    <Text className="text-slate-300 text-xs mt-2">UTC day: {status.dayUtc} • Shared capacity: {status.quota.globalCapacityAvailable?"available":"exhausted"}</Text>
    {status.quota.canStartTrial&&<TouchableOpacity accessibilityRole="button"
     accessibilityLabel="Start one time authenticated seven day Explorer trial"
     disabled={busy} onPress={()=>request("trial")}
     className="bg-indigo-700 rounded-xl p-3 mt-3">
     <Text className="text-white text-center font-bold">Activate my one-time free 7-day Explorer →</Text>
    </TouchableOpacity>}
   </View>}
  </View>
  <Text className="text-white text-xl font-bold mt-6">Choose a course and unit</Text>
  <ScrollView horizontal className="mt-3" showsHorizontalScrollIndicator={false}>
   {academy.courses.map(c=><TouchableOpacity key={c.id} accessibilityRole="button"
    accessibilityLabel={"Public AI course "+c.code}
    accessibilityState={{selected:courseId===c.id}}
    onPress={()=>{setCourseId(c.id);setUnitId(null);setConsent(false);setAnswer(null);}}
    className={courseId===c.id?"bg-green-700 p-3 rounded-xl mr-2":"bg-slate-700 p-3 rounded-xl mr-2"}>
    <Text className="text-white">{c.code}</Text>
   </TouchableOpacity>)}
  </ScrollView>
  <Text className="text-white font-bold mt-3">{course.title} • {course.percent}% local self-study milestones</Text>
  <ScrollView horizontal className="mt-3" showsHorizontalScrollIndicator={false}>
   {units.map(u=><TouchableOpacity key={u.id} accessibilityRole="button"
    accessibilityLabel={"Public AI unit "+u.id}
    accessibilityState={{selected:review.unitId===u.id}}
    onPress={()=>{setUnitId(u.id);setConsent(false);setAnswer(null);}}
    className={review.unitId===u.id?"bg-green-700 p-3 rounded-xl mr-2":"bg-slate-700 p-3 rounded-xl mr-2"}>
    <Text className="text-white">Unit {u.id}</Text>
   </TouchableOpacity>)}
  </ScrollView>
  <View className="bg-slate-800 rounded-xl p-4 mt-3">
   <Text className="text-white font-bold">{review.unitTitle}</Text>
   <Text selectable className="text-slate-300 mt-3">{review.source.content}</Text>
   <Text className="text-slate-400 text-xs mt-2">{review.attribution}</Text>
  </View>
  <Text className="text-white text-xl font-bold mt-6">Select an AI classroom role</Text>
  <ScrollView horizontal className="mt-3" showsHorizontalScrollIndicator={false}>
   {CLASSROOM_AGENTS.map(a=><TouchableOpacity key={a.id} accessibilityRole="button"
    accessibilityLabel={"Public AI role "+a.name} accessibilityState={{selected:agent===a.id}}
    onPress={()=>{setAgent(a.id);setConsent(false);setAnswer(null);}}
    className={agent===a.id?"bg-green-700 p-3 rounded-xl mr-2":"bg-slate-700 p-3 rounded-xl mr-2"}>
    <Text className="text-white">{a.name}</Text>
   </TouchableOpacity>)}
  </ScrollView>
  <Text className="text-white font-bold mt-5">Your learning question</Text>
  <TextInput accessibilityLabel="Public AI learning question" multiline maxLength={500}
   value={question} onChangeText={value=>{setQuestion(value);setConsent(false);setAnswer(null);}}
   placeholder="e.g. Explain the core argument in this review"
   placeholderTextColor="#94a3b8" className="bg-slate-800 text-white p-4 rounded-xl mt-3"
   style={{minHeight:80,textAlignVertical:"top"}}/>
  <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{checked:consent}}
   accessibilityLabel="Approve one authenticated AI model call using the displayed public excerpt"
   onPress={()=>setConsent(value=>!value)}
   className="bg-slate-800 rounded-xl p-4 mt-4">
   <Text className="text-white">
    {consent?"☑":"☐"} I approve sending my question and the displayed public course excerpt to
    the configured model provider for ONE response. This is educational assistance, not a verified answer.
   </Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ask one metered authenticated AI agent"
   disabled={!status?.quota.canUse||!question.trim()||!consent||busy}
   onPress={()=>request("ask")}
   className="bg-green-700 rounded-xl p-4 mt-4">
   <Text className="text-white text-center font-bold">
    {busy?"Submitting one bounded call…":"Ask one metered AI agent →"}
   </Text>
  </TouchableOpacity>
  {!status&&<Text className="text-slate-400 mt-3">Verify server quota and sign in before any request can be submitted.</Text>}
  {!!error&&<Text selectable className="text-amber-200 mt-4">{error}</Text>}
  {answer?.answer&&<View className="bg-slate-800 p-4 rounded-xl mt-5">
    <Text className="text-green-300 font-bold">{answer.name||"Selected AI Agent"}</Text>
    <Text selectable className="text-white mt-3">{answer.answer}</Text>
    <Text className="text-amber-200 text-xs mt-3">{answer.warning||"Model content is not verified. Recheck sources."}</Text>
   </View>}
  </View>}
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back to free offline classroom"
   onPress={()=>router.push("/classroom")} className="bg-indigo-800 p-4 rounded-xl mt-6">
    <Text className="text-white text-center font-bold">Return to free offline classroom →</Text>
  </TouchableOpacity>
 </ScrollView>;
}
