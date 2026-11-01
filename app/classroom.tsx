import {useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {useCircleStore} from "../stores/circleStore";
import {useClassroomStore} from "../stores/classroomStore";
import {getFreeAccess,localDayKey} from "../lib/classroomAccess";
import {useClassroomAcademyDashboard} from "../hooks/useClassroomAcademyDashboard";
import {academyCourseExists,academyCourseReview,listAcademyClassroomUnits} from "../lib/classroomAcademyBridge";
import type {AcademyCourseId} from "../lib/academyDashboard";
import {CLASSROOM_AGENTS,runClassroom,validateClassroomRoster,
 type ClassroomAgentId,type ClassroomMode,type ClassroomRun} from "../lib/openMaicClassroom";

export default function ClassroomScreen(){
 const params=useLocalSearchParams<{course?:string}>();
 const academy=useClassroomAcademyDashboard();
 const [courseId,setCourseId]=useState<AcademyCourseId>(
   academyCourseExists(params.course??"")?params.course as AcademyCourseId:"logic");
 const [unitId,setUnitId]=useState<number|null>(null);
 const [includeAcademyReview,setIncludeAcademyReview]=useState(false);
 const [today]=useState(localDayKey());
 const trialStartedOn=useClassroomStore(s=>s.trialStartedOn);
 const dailyUsage=useClassroomStore(s=>s.dailyUsage);
 const logs=useClassroomStore(s=>s.logs);
 const beginExplorer=useClassroomStore(s=>s.beginExplorer);
 const recordRun=useClassroomStore(s=>s.recordRun);
 const notes=useCircleStore(s=>s.materials);
 const [mode,setMode]=useState<ClassroomMode>("qa");
 const [topic,setTopic]=useState("");
 const [initiator,setInitiator]=useState<ClassroomAgentId>("of-physics-questioner");
 const [chosenNotes,setChosenNotes]=useState<string[]>([]);
 const [result,setResult]=useState<ClassroomRun|null>(null);
 const [error,setError]=useState("");
 const access=getFreeAccess({trialStartedOn,dailyUsage},today);
 const course=academy.courses.find(c=>c.id===courseId)??academy.courses[0];
 const review=academyCourseReview(course,unitId??undefined);
 const reviewUnits=listAcademyClassroomUnits(course.id);
 const roster=validateClassroomRoster();
 const selection=notes.filter(n=>chosenNotes.includes(n.id)).slice(0,3);
 const setSubject=(next:ClassroomMode)=>{setMode(next);setResult(null);};
 const toggleNote=(id:string)=>{
  setChosenNotes(prev=>prev.includes(id)?prev.filter(x=>x!==id):
   prev.length<(includeAcademyReview?2:3)?[...prev,id]:prev);
  setResult(null);
 };
 const run=()=>{
  setError("");
  if(!topic.trim()){setError("Enter a question or discussion topic.");return;}
  if(!access.remaining){setError("Today's local preview allowance is exhausted. Basic access renews tomorrow.");return;}
  try{
   const approvedSources=[...(includeAcademyReview?[review.source]:[]),...selection]
     .slice(0,3);
   const transcript=runClassroom({
    mode,topic,selectedAgentId:initiator,maxSpeakers:access.maxSpeakers,
    // Last 50 metadata-only traces, oldest first for least-recent rotation.
    recentAgentIds:logs.slice().reverse().flatMap(l=>l.agents).slice(-60),
   },approvedSources);
   if(!recordRun(transcript,today)){
    setError("No free local previews remain today.");return;
   }
   setResult(transcript);
  }catch(e){setError(e instanceof Error?e.message:"Unable to run this classroom.");}
 };
 return <ScrollView className="flex-1 bg-slate-900"
  contentContainerStyle={{padding:18,paddingBottom:90}} keyboardShouldPersistTaps="handled">
  <Text className="text-green-400 text-xs font-bold">OPENFORGE AFRICA • OPENMAIC-INSPIRED PREVIEW</Text>
  <Text className="text-white text-3xl font-extrabold mt-2">15-agent classroom</Text>
  <Text className="text-slate-300 leading-6 mt-3">
   The Director routes real on-device learning prompts to 15 distinct educational roles.
   Teacher-first question answering and rotating roundtables are testable without any provider charges.
  </Text>
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
   <Text className="text-amber-100 leading-5">
    This free version is a deterministic offline classroom, NOT 15 cloud-powered generative agents,
    an OpenMAIC deployment or an accredited university. Only selected local notes are inspected.
    The preview counter lives on this device and is not a secure public-account quota.
   </Text>
  </View>
  <View className="bg-slate-800 border border-green-700 p-5 rounded-2xl mt-5">
   <Text className="text-green-300 font-bold">FREE {access.plan==="explorer"?"EXPLORER TRIAL":"BASIC"}</Text>
   <Text className="text-white text-2xl font-bold mt-2">{access.remaining} / {access.maxRuns} classroom runs left today</Text>
   <Text className="text-slate-300 mt-2">
    {access.maxSpeakers} speaking agents per run · All {roster.total} roles registered · No payment or card needed
   </Text>
   {access.plan==="explorer"?<Text className="text-green-200 mt-2">Your 7-day Explorer preview ends on {access.expiresOn}.</Text>:
    access.canStartTrial?<TouchableOpacity accessibilityRole="button"
     accessibilityLabel="Start free seven day Explorer preview" onPress={()=>beginExplorer(today)}
     className="bg-indigo-700 p-4 rounded-xl mt-4">
     <Text className="text-white text-center font-bold">Activate free 7-day Explorer preview (8 runs/day) →</Text>
    </TouchableOpacity>:<Text className="text-slate-300 mt-2">Explorer preview has ended. Free Basic remains available each day.</Text>}
  </View>
  <Text className="text-white text-lg font-bold mt-7">1. Choose an Academy course</Text>
  <Text className="text-slate-300 mt-2 mb-3">
   The classroom reads the same ten course progress stores as Academy. Choose a short original public review to study.
   Private full-length textbooks are never loaded here.
  </Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
   {academy.courses.map(c=><TouchableOpacity key={c.id} accessibilityRole="button"
    accessibilityState={{selected:course.id===c.id}} accessibilityLabel={"Classroom course "+c.code}
    onPress={()=>{setCourseId(c.id);setUnitId(null);setIncludeAcademyReview(false);setResult(null);}}
    className={course.id===c.id?"bg-green-700 p-3 rounded-xl mr-2":"bg-slate-700 p-3 rounded-xl mr-2"}>
    <Text className="text-white font-bold">{c.code}</Text>
   </TouchableOpacity>)}
  </ScrollView>
  <View className="bg-slate-800 border border-slate-700 p-4 rounded-xl mt-3">
   <Text className="text-white font-bold">{course.title}</Text>
   <Text className="text-slate-300 mt-2">
    {course.percent}% self-reported milestones · Next: {course.next.action}
   </Text>
   <Text className="text-slate-300 mt-2">{course.next.title}</Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open corresponding Academy course"
    onPress={()=>router.push(course.route)} className="bg-indigo-800 p-3 rounded-xl mt-3">
    <Text className="text-white text-center font-bold">Open full Academy course →</Text>
   </TouchableOpacity>
  </View>
  <Text className="text-white font-bold mt-5 mb-3">Select a short public unit review</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
   {reviewUnits.map(u=><TouchableOpacity key={u.id} accessibilityRole="button"
    accessibilityLabel={"Choose classroom unit "+u.id}
    accessibilityState={{selected:review.unitId===u.id}}
    onPress={()=>{setUnitId(u.id);setIncludeAcademyReview(false);setResult(null);}}
    className={review.unitId===u.id?"bg-green-800 p-3 rounded-xl mr-2":"bg-slate-700 p-3 rounded-xl mr-2"}>
    <Text className="text-white">Unit {u.id}</Text>
   </TouchableOpacity>)}
  </ScrollView>
  <View className="bg-slate-800 p-4 rounded-xl mt-3">
   <Text className="text-white font-bold">{review.unitTitle}</Text>
   <Text selectable className="text-slate-300 mt-2">{review.source.content}</Text>
   <Text className="text-slate-400 text-xs mt-2">{review.attribution}</Text>
   {!includeAcademyReview&&chosenNotes.length>=3&&<Text className="text-amber-200 mt-3">
    Deselect one personal note before adding this Academy review. At most three sources are used.
   </Text>}
   <TouchableOpacity accessibilityRole="checkbox"
    disabled={!includeAcademyReview&&chosenNotes.length>=3}
    accessibilityState={{checked:includeAcademyReview}}
    accessibilityLabel="Include displayed Academy review as local classroom source"
    onPress={()=>{setIncludeAcademyReview(value=>!value);setResult(null);}}
    className="bg-slate-700 border border-slate-600 p-3 rounded-xl mt-4">
    <Text className="text-white font-bold">
     {includeAcademyReview?"☑":"☐"} Include this public review as a local classroom source
    </Text>
   </TouchableOpacity>
  </View>
  <Text className="text-white text-lg font-bold mt-7">2. Classroom mode</Text>
  <View className="flex-row mt-3">
   {(["qa","discussion"] as const).map(m=><TouchableOpacity key={m}
    accessibilityRole="button" accessibilityState={{selected:mode===m}}
    accessibilityLabel={m==="qa"?"Question and answer mode":"Discussion mode"}
    onPress={()=>setSubject(m)} style={{width:"48%",marginRight:"2%"}}
    className={mode===m?"bg-green-700 rounded-xl p-4":"bg-slate-700 rounded-xl p-4"}>
    <Text className="text-white text-center font-bold">{m==="qa"?"Teacher Q&A":"Roundtable discussion"}</Text>
   </TouchableOpacity>)}
  </View>
  <Text className="text-white text-lg font-bold mt-7">3. Question or topic</Text>
  <TextInput accessibilityLabel="Classroom question or topic" multiline maxLength={500}
   value={topic} onChangeText={value=>{setTopic(value);setResult(null);}}
   placeholder="e.g. What makes an argument logically valid?"
   placeholderTextColor="#94a3b8" className="bg-slate-800 text-white border border-slate-700 rounded-xl p-4 mt-3"
   style={{minHeight:90,textAlignVertical:"top"}}/>
  <Text className="text-white text-lg font-bold mt-7">4. Choose a classmate</Text>
  <Text className="text-slate-300 mt-2 leading-5">
   In discussions the chosen classmate can initiate when there is no unanswered direct question.
   A question always goes to the Teacher first. All 13 classmates are selectable.
  </Text>
  <View className="flex-row flex-wrap justify-between mt-3">
   {CLASSROOM_AGENTS.filter(a=>a.role==="student").map(a=><TouchableOpacity key={a.id}
    accessibilityRole="button" accessibilityState={{selected:initiator===a.id}}
    accessibilityLabel={"Choose "+a.name} onPress={()=>{setInitiator(a.id);setResult(null);}}
    style={{width:"48%"}}
    className={initiator===a.id?"bg-green-900 border border-green-500 p-3 rounded-xl mb-3":"bg-slate-800 border border-slate-700 p-3 rounded-xl mb-3"}>
    <Text className="text-white font-bold">{a.name}</Text>
    <Text className="text-slate-400 text-xs">Priority {a.priority}</Text>
   </TouchableOpacity>)}
  </View>
  <Text className="text-white text-lg font-bold mt-6">5. Additional personal notes (optional)</Text>
  <Text className="text-slate-300 mt-2 mb-3">
   You may select up to three sources in total, including the public review above. Personal saved notes are used only after you explicitly select them; no network requests occur.
  </Text>
  {!notes.length&&<Text className="text-amber-200 mb-3">No saved study-circle notes yet. You can still test the speaking schedule.</Text>}
  {notes.map(n=><TouchableOpacity key={n.id} accessibilityRole="checkbox"
   accessibilityState={{checked:chosenNotes.includes(n.id)}} accessibilityLabel={"Choose saved note "+n.title}
   onPress={()=>toggleNote(n.id)} className={chosenNotes.includes(n.id)?"bg-green-900 rounded-xl p-3 mb-2":"bg-slate-800 rounded-xl p-3 mb-2"}>
   <Text className="text-white">{chosenNotes.includes(n.id)?"☑ ":"☐ "}{n.title}</Text>
   {chosenNotes.includes(n.id)&&<Text selectable className="text-slate-300 text-xs mt-2">{n.content.slice(0,350)}{n.content.length>350?"…":""}</Text>}
  </TouchableOpacity>)}
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Run free local classroom"
   disabled={!topic.trim()||!access.remaining} onPress={run}
   className="bg-green-700 rounded-xl p-4 mt-5">
   <Text className="text-white text-center font-bold">
    {!access.remaining?"Today's free limit reached":"Run free local classroom →"}
   </Text>
  </TouchableOpacity>
  {!!error&&<Text className="text-amber-300 mt-3">{error}</Text>}
  {result&&<View className="bg-slate-800 border border-green-700 rounded-2xl p-5 mt-6">
   <Text className="text-green-300 font-bold">VERIFIABLE DIRECTOR DISPATCH TRACE</Text>
   {result.dispatched.map(d=><Text key={d.agentId} selectable className="text-slate-200 mt-2">
    Round {d.index}: {d.name} ({d.agentId}, priority {d.priority}) — {d.reason}
   </Text>)}
   {result.questionUnanswered&&<Text className="text-amber-200 mt-3">
    Source gap: a learner question remains unverified. The classroom was not automatically closed.
   </Text>}
   <Text className="text-white text-xl font-bold mt-5">Classroom transcript</Text>
   {result.turns.map(t=><View key={t.agentId} className="bg-slate-900 border border-slate-700 rounded-xl p-4 mt-3">
    <Text className="text-green-300 font-bold">{t.name.toUpperCase()}</Text>
    <Text selectable className="text-slate-100 leading-6 mt-2">{t.message}</Text>
    {!!t.evidence.length&&<Text className="text-indigo-200 text-xs mt-3">
     Local source: {t.evidence.map(e=>e.title).join("; ")}
    </Text>}
   </View>)}
   <Text className="text-slate-400 text-xs mt-4">
    These turns are role-specific offline learning scaffolds, not generative responses.
    No transcript was uploaded or published.
   </Text>
  </View>}
  <View className="bg-slate-800 p-4 rounded-xl mt-6">
   <Text className="text-white font-bold">Recent local dispatch history ({logs.length})</Text>
   {logs.slice(0,3).map(l=><Text key={l.id} selectable className="text-slate-300 text-xs mt-2">
    {l.day} · {l.mode} · {l.agents.join(" → ")} · source {l.sourceMatched?"matched":"absent"}
   </Text>)}
   <Text className="text-slate-400 text-xs mt-3">
    Only agent IDs, date, mode and evidence-match status are retained locally—not your questions or note text.
    Clearing browser storage can reset this demo quota. Public trials require server-side account enforcement.
   </Text>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open classroom verification dashboard"
   onPress={()=>router.push("/classroom-verify")} className="bg-slate-700 rounded-xl p-4 mt-5">
   <Text className="text-white text-center font-bold">View reproducible verification & agent roster →</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to Academy dashboard"
   onPress={()=>router.push("/academy")} className="bg-indigo-800 rounded-xl p-4 mt-5">
   <Text className="text-white text-center font-bold">Return to Academy →</Text>
  </TouchableOpacity>
 </ScrollView>;
}
