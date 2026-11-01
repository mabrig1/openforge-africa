import {useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {Platform,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
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
 const [includeAcademyReview,setIncludeAcademyReview]=useState(true);
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
 const [showRolePicker,setShowRolePicker]=useState(false);
 const [chosenNotes,setChosenNotes]=useState<string[]>([]);
 const [result,setResult]=useState<ClassroomRun|null>(null);
 const [error,setError]=useState("");
 const [ownerOpen,setOwnerOpen]=useState(false);
 const [ownerAgent,setOwnerAgent]=useState<ClassroomAgentId>("of-teacher");
 const [ownerAccess,setOwnerAccess]=useState("");
 const [ownerConsent,setOwnerConsent]=useState(false);
 const [ownerBusy,setOwnerBusy]=useState(false);
 const [ownerError,setOwnerError]=useState("");
 const [ownerAnswer,setOwnerAnswer]=useState<{name:string;answer:string;warning:string}|null>(null);
 const access=getFreeAccess({trialStartedOn,dailyUsage},today);
 const course=academy.courses.find(c=>c.id===courseId)??academy.courses[0];
 const review=academyCourseReview(course,unitId??undefined);
 const reviewUnits=listAcademyClassroomUnits(course.id);
 const roster=validateClassroomRoster();
 const selection=notes.filter(n=>chosenNotes.includes(n.id)).slice(0,3);
 const setSubject=(next:ClassroomMode)=>{setMode(next);setResult(null);setOwnerConsent(false);setOwnerAnswer(null);};
 const askOwnerModel=async()=>{
  const sources=[...(includeAcademyReview?[review.source]:[]),...selection].slice(0,3);
  if(ownerBusy||!ownerConsent||!ownerAccess.trim()||!topic.trim()||!sources.length)return;
  setOwnerBusy(true);setOwnerAnswer(null);setOwnerError("");
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),22000);
  try{
   const endpoint=Platform.OS==="web"?"/api/classroom-ai":
    "https://openforge.mabrigkorie.org/api/classroom-ai";
   const response=await fetch(endpoint,{method:"POST",signal:controller.signal,
    headers:{"Content-Type":"application/json","X-OpenForge-Classroom-Token":ownerAccess.trim()},
    body:JSON.stringify({agentId:ownerAgent,question:topic.trim(),
     sources:sources.map((s,i)=>({id:"note_"+(i+1),title:s.title,
      excerpt:s.content.slice(0,1500)}))})});
   const result=await response.json() as {answer?:string;name?:string;warning?:string;error?:string};
   if(!response.ok||typeof result.answer!=="string")
    throw new Error(result.error||"Owner model inference is unavailable. Free local classroom still works.");
   setOwnerAnswer({name:result.name??"Selected AI Agent",answer:result.answer,
    warning:result.warning??"Model-generated text is unverified. Check original notes."});
  }catch(err){setOwnerError(err instanceof Error?err.message:"Owner model request failed.");}
  finally{clearTimeout(timeout);setOwnerBusy(false);setOwnerConsent(false);setOwnerAccess("");}
 };
 const toggleNote=(id:string)=>{
  setChosenNotes(prev=>prev.includes(id)?prev.filter(x=>x!==id):
   prev.length<(includeAcademyReview?2:3)?[...prev,id]:prev);
  setResult(null);
 };
 const run=(suggested?:string,suggestedMode?:ClassroomMode)=>{
  setError("");
  const prompt=typeof suggested==="string"&&suggested.trim()?suggested.trim():topic.trim();
  if(!prompt){setError("Enter a question or discussion topic.");return;}
  if(suggested){setTopic(prompt);setMode(suggestedMode??"qa");}
  if(!access.remaining){setError("Today's local preview allowance is exhausted. Basic access renews tomorrow.");return;}
  try{
   const approvedSources=[...(includeAcademyReview?[review.source]:[]),...selection]
     .slice(0,3);
   const transcript=runClassroom({
    mode:suggestedMode??mode,topic:prompt,selectedAgentId:initiator,maxSpeakers:access.maxSpeakers,
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
   Choose a course, practise with a source-based teacher response and hear distinct perspectives from selectable educational roles. No subscription is needed.
  </Text>
  <View className="bg-emerald-950 border border-emerald-700 rounded-2xl p-5 mt-5">
   <Text className="text-emerald-300 text-xs font-bold">START HERE · GUIDED STUDY</Text>
   <Text className="text-white text-xl font-bold mt-2">{review.unitTitle}</Text>
   <Text className="text-slate-200 mt-2 leading-5">
    {course.code}: a public lesson review is already selected. Try a source-grounded explanation or a classroom discussion; you can change the lesson below.
   </Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Explain this course lesson now"
    disabled={!access.remaining}
    onPress={()=>run("Explain "+review.unitTitle+" using the selected lesson review","qa")}
    className="bg-emerald-500 rounded-xl p-4 mt-4">
    <Text className="text-slate-950 text-center font-extrabold">TEACH ME THIS LESSON →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Run a guided class discussion now"
    disabled={!access.remaining}
    onPress={()=>run("Discuss "+review.unitTitle+" and test its main assumptions","discussion")}
    className="bg-indigo-700 rounded-xl p-4 mt-3">
    <Text className="text-white text-center font-bold">HEAR THE CLASS DISCUSS IT →</Text>
   </TouchableOpacity>
   {!access.remaining&&<Text className="text-amber-200 mt-3">Today's free run allowance is used. You can still read Academy lessons and practise in the offline labs.</Text>}
  </View>
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
    onPress={()=>{setCourseId(c.id);setUnitId(null);setIncludeAcademyReview(true);setResult(null);setOwnerConsent(false);setOwnerAnswer(null);}}
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
    onPress={()=>{setUnitId(u.id);setIncludeAcademyReview(false);setResult(null);setOwnerConsent(false);setOwnerAnswer(null);}}
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
    onPress={()=>{setIncludeAcademyReview(value=>!value);setResult(null);setOwnerConsent(false);setOwnerAnswer(null);}}
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
   value={topic} onChangeText={value=>{setTopic(value);setResult(null);setOwnerConsent(false);setOwnerAnswer(null);}}
   placeholder="e.g. What makes an argument logically valid?"
   placeholderTextColor="#94a3b8" className="bg-slate-800 text-white border border-slate-700 rounded-xl p-4 mt-3"
   style={{minHeight:90,textAlignVertical:"top"}}/>
  <Text className="text-white text-lg font-bold mt-7">4. Choose a classmate</Text>
  <Text className="text-slate-300 mt-2 leading-5">
   The selected classmate contributes to your next discussion. Teacher-first responses are preserved for direct questions. All 13 classmates can be selected.
  </Text>
  <TouchableOpacity accessibilityRole="button" accessibilityState={{expanded:showRolePicker}}
   accessibilityLabel="Choose a different classroom role"
   onPress={()=>setShowRolePicker(value=>!value)} className="bg-slate-700 p-4 rounded-xl mt-3">
   <Text className="text-white font-bold">Selected: {CLASSROOM_AGENTS.find(a=>a.id===initiator)?.name} · {showRolePicker?"Hide roles ↑":"Change role ↓"}</Text>
  </TouchableOpacity>
  {showRolePicker&&<View className="flex-row flex-wrap justify-between mt-3">
   {CLASSROOM_AGENTS.filter(a=>a.role==="student").map(a=><TouchableOpacity key={a.id}
    accessibilityRole="button" accessibilityState={{selected:initiator===a.id}}
    accessibilityLabel={"Choose "+a.name} onPress={()=>{setInitiator(a.id);setResult(null);}}
    style={{width:"48%"}}
    className={initiator===a.id?"bg-green-900 border border-green-500 p-3 rounded-xl mb-3":"bg-slate-800 border border-slate-700 p-3 rounded-xl mb-3"}>
    <Text className="text-white font-bold">{a.name}</Text>
    <Text className="text-slate-400 text-xs">{a.persona}</Text>
   </TouchableOpacity>)}
  </View>}
  <Text className="text-white text-lg font-bold mt-6">5. Additional personal notes (optional)</Text>
  <Text className="text-slate-300 mt-2 mb-3">
   You may select up to three sources in total, including the public review above. Personal saved notes are used only after you explicitly select them; no network requests occur.
  </Text>
  {!notes.length&&<Text className="text-amber-200 mb-3">No saved personal notes yet. The selected public Academy review is sufficient to start learning.</Text>}
  {notes.map(n=><TouchableOpacity key={n.id} accessibilityRole="checkbox"
   accessibilityState={{checked:chosenNotes.includes(n.id)}} accessibilityLabel={"Choose saved note "+n.title}
   onPress={()=>toggleNote(n.id)} className={chosenNotes.includes(n.id)?"bg-green-900 rounded-xl p-3 mb-2":"bg-slate-800 rounded-xl p-3 mb-2"}>
   <Text className="text-white">{chosenNotes.includes(n.id)?"☑ ":"☐ "}{n.title}</Text>
   {chosenNotes.includes(n.id)&&<Text selectable className="text-slate-300 text-xs mt-2">{n.content.slice(0,350)}{n.content.length>350?"…":""}</Text>}
  </TouchableOpacity>)}
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Run free local classroom"
   disabled={!topic.trim()||!access.remaining} onPress={()=>run()}
   className="bg-green-700 rounded-xl p-4 mt-5">
   <Text className="text-white text-center font-bold">
    {!access.remaining?"Today's free limit reached":"Run free local classroom →"}
   </Text>
  </TouchableOpacity>
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
  <View className="bg-slate-800 border border-amber-800 rounded-xl p-4 mt-6">
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show owner only model testing"
    onPress={()=>{setOwnerOpen(v=>!v);setOwnerConsent(false);setOwnerAnswer(null);setOwnerError("");}}>
    <Text className="text-amber-200 font-bold">OWNER TESTING ONLY — optional generative model {ownerOpen?"▲":"▼"}</Text>
   </TouchableOpacity>
   <Text className="text-slate-300 text-xs mt-2">
    Closed by default. No provider call is made by Free Basic or Explorer.
    The owner-only endpoint is disabled unless explicitly configured on the server.
   </Text>
   {ownerOpen&&<View className="mt-3">
    <Text className="text-amber-100">
     This is NOT part of the free trial. A live call may incur charges.
     Requires your private owner access code, not an OpenRouter API key.
     The provider may receive the question and up to three selected local excerpts.
    </Text>
    <Text className="text-white font-bold mt-4">Choose one model-backed role</Text>
    <ScrollView horizontal className="mt-2" showsHorizontalScrollIndicator={false}>
     {CLASSROOM_AGENTS.map(a=><TouchableOpacity key={a.id} accessibilityRole="button"
      accessibilityState={{selected:ownerAgent===a.id}} accessibilityLabel={"Owner AI agent "+a.name}
      onPress={()=>{setOwnerAgent(a.id);setOwnerConsent(false);setOwnerAnswer(null);}}
      className={ownerAgent===a.id?"bg-green-700 rounded-xl p-3 mr-2":"bg-slate-700 rounded-xl p-3 mr-2"}>
      <Text className="text-white">{a.name}</Text>
     </TouchableOpacity>)}
    </ScrollView>
    <TextInput accessibilityLabel="Owner classroom access code, not provider key"
     secureTextEntry autoCapitalize="none" value={ownerAccess}
     onChangeText={value=>{setOwnerAccess(value);setOwnerConsent(false);}}
     placeholder="Private owner access code" placeholderTextColor="#94a3b8"
     className="bg-slate-900 border border-slate-600 rounded-xl p-3 text-white mt-4"/>
    <Text className="text-slate-300 text-xs mt-3">
     Exact excerpts for this call (only after consent):
    </Text>
    {[...(includeAcademyReview?[review.source]:[]),...selection].slice(0,3)
     .map((note,i)=><View key={i} className="bg-slate-900 p-3 rounded-xl mt-2">
      <Text className="text-green-200 font-bold">{note.title}</Text>
      <Text selectable className="text-slate-300 text-xs mt-2">{note.content.slice(0,1500)}</Text>
     </View>)}
    <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{checked:ownerConsent}}
     accessibilityLabel="Consent to owner paid AI call and excerpt transmission"
     onPress={()=>setOwnerConsent(x=>!x)}
     className="bg-slate-700 rounded-xl p-3 mt-4">
     <Text className="text-white">
      {ownerConsent?"☑":"☐"} I am the authorized owner and approve this optional paid-provider call and transfer of the displayed selected excerpts.
     </Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Request one authorized owner AI response"
     disabled={ownerBusy||!ownerConsent||!ownerAccess.trim()||!topic.trim()||
       !(includeAcademyReview||selection.length)}
     onPress={askOwnerModel} className="bg-indigo-700 rounded-xl p-4 mt-3">
     <Text className="text-white text-center font-bold">
      {ownerBusy?"Requesting one owner-authorized response…":"Request one owner-authorized AI response →"}
     </Text>
    </TouchableOpacity>
    {!!ownerError&&<Text className="text-amber-200 mt-3">{ownerError}</Text>}
    {ownerAnswer&&<View className="bg-slate-900 rounded-xl p-4 mt-4">
     <Text className="text-green-300 font-bold">{ownerAnswer.name} • OWNER CLOUD TEST</Text>
     <Text selectable className="text-white mt-3">{ownerAnswer.answer}</Text>
     <Text className="text-amber-200 text-xs mt-3">{ownerAnswer.warning}</Text>
    </View>}
   </View>}
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open optional authenticated AI classroom preview"
   onPress={()=>router.push({pathname:"/classroom-live",params:{course:course.id}})}
   className="bg-indigo-800 rounded-xl p-4 mt-5">
   <Text className="text-white text-center font-bold">Optional authenticated AI trial (server-gated) →</Text>
  </TouchableOpacity>
  <Text className="text-slate-400 text-xs mt-2">
   Generative access is off until account authentication, durable limits and budget safeguards are approved and configured.
  </Text>
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
