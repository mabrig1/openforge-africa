import {useState} from "react";
import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {
  PSY210_MODULES,PSY210_ATTRIBUTION,PSY210_WEEKS,PSY210_ASSESSMENTS,
  psy210GetModule,psy210Completion,
} from "../lib/psy210Course";
import {usePsy210Progress} from "../stores/psy210Store";
import {useCircleStore} from "../stores/circleStore";
import {setStudioDraft} from "../lib/studioDraft";
import {speakText,stopSpeech} from "../lib/speech";
const CIRCLE_ID="psy210-psychology-ai-self-study";
export default function PsychologyCourseScreen(){
 const read=usePsy210Progress(s=>s.read);
 const scores=usePsy210Progress(s=>s.scores);
 const selected=usePsy210Progress(s=>s.selected);
 const select=usePsy210Progress(s=>s.select);
 const markRead=usePsy210Progress(s=>s.markRead);
 const saveQuiz=usePsy210Progress(s=>s.saveQuiz);
 const reset=usePsy210Progress(s=>s.reset);
 const [showIndex,setShowIndex]=useState(false);
 const [showSyllabus,setShowSyllabus]=useState(false);
 const [choices,setChoices]=useState<(number|null)[]>([null,null,null]);
 const [graded,setGraded]=useState<number|null>(null);
 const [message,setMessage]=useState("");
 const lesson=psy210GetModule(selected)??PSY210_MODULES[0];
 const stat=psy210Completion(read,scores);
 const openModule=(id:number)=>{
   stopSpeech();select(id);setChoices([null,null,null]);setGraded(null);
   setMessage("");setShowIndex(false);
 };
 const grade=()=>{
   if(choices.some(x=>x===null)){setMessage("Answer all three questions first.");return;}
   const score=saveQuiz(lesson.id,choices as number[]);
   setGraded(score);setMessage(
     score>=2?"Practice check recorded: revise any missed items.":"Review the explanations and retake this three-question check.");
 };
 const studioContent=()=>lesson.overview+"\n\nConcepts: "+lesson.concepts.join("; ")+
  "\n\nExample: "+lesson.caseExample+"\n\nYour practice task: "+lesson.practice;
 const toStudio=(route:"/reader"|"/explainer")=>{
   setStudioDraft(lesson.name,studioContent());router.push(route);
 };
 const toTutor=()=>{
   const store=useCircleStore.getState();
   if(!store.circles.some(x=>x.id===CIRCLE_ID))store.addCircle({
     id:CIRCLE_ID,name:"PSY 210: Psychology in the Age of AI (Self-study)",
     courseCode:"PSY 210 DEMO",courseTitle:"Psychology in the Age of AI",
     memberCount:1,taskCount:0,lastActivity:"On-device course",createdAt:Date.now(),
   });
   const id="psy210-review-"+lesson.id;
   if(!useCircleStore.getState().materials.some(m=>m.id===id)){
     useCircleStore.getState().addMaterial({
       id,circleId:CIRCLE_ID,title:"PSY 210 — Module "+lesson.id+": "+lesson.name,
       content:studioContent()+"\n\nAdapted review, not the complete original source reader. "+PSY210_ATTRIBUTION,
       createdAt:Date.now(),
     });
   }
   router.push({pathname:"/tutor",params:{circleId:CIRCLE_ID}});
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:80}}>
   <Text className="text-teal-400 font-bold tracking-widest text-xs">OPENFORGE ACADEMY • SECOND INTERACTIVE SUBJECT</Text>
   <Text className="text-white text-3xl font-extrabold mt-2">PSY 210: Psychology in the Age of AI</Text>
   <Text className="text-slate-300 mt-2">Six modules • 14-week learning map • 18 native practice questions</Text>
   <Text className="text-slate-300 leading-6 mt-3">
    Explore psychological foundations, AI-mediated self-awareness, empathy, biases,
    interview skills and applied research. This native track provides concise chapter
    reviews; the separate downloadable companion HTML contains the entire provided
    reader, 60 extra formative questions, seven labs and reference materials.
   </Text>
   <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
     <Text className="text-amber-100 leading-5">Independent non-accredited self-study only.
     Virtual cases are fictional. This app cannot diagnose, treat, certify interviewing competence,
     or grant the source's proposed four university credits. Never share patient data.</Text>
   </View>
   <View className="bg-slate-800 border border-teal-700 rounded-2xl p-5 mt-5">
     <Text className="text-teal-300 font-bold">PRIVATE ON-DEVICE LEARNING RECORD</Text>
     <Text className="text-white text-3xl font-bold mt-2">{stat.completed} / 6 reviewed and practised</Text>
     <Text className="text-slate-300 mt-2">{read.length} marked read · {stat.percent}% of review milestones</Text>
     <View className="bg-slate-700 rounded-full h-3 overflow-hidden mt-3">
       <View className="bg-teal-400 h-3" style={{width:(stat.percent+"%") as `${number}%`}}/>
     </View>
     <Text className="text-slate-400 text-xs mt-3">Each self-study milestone requires a marked reading and at least two of three formative questions correct. This does not evaluate applied competence.</Text>
     {stat.eligible&&<Text className="text-teal-300 mt-3 font-bold">✓ All native review milestones completed — not an academic award.</Text>}
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open advanced scripted psychology interview simulator"
     onPress={()=>router.push("/psychology-interview")}
     className="bg-indigo-700 p-4 rounded-xl mt-5">
     <Text className="text-white font-bold text-center">◈ Advanced fictional interviewing studio →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Toggle psychology learning modules"
     onPress={()=>setShowIndex(x=>!x)} className="bg-slate-700 rounded-xl p-4 mt-3">
     <Text className="text-white font-bold text-center">{showIndex?"Hide modules":"Browse all six teaching modules"}</Text>
   </TouchableOpacity>
   {showIndex&&<View className="bg-slate-800 rounded-xl p-3 mt-2">
    {PSY210_MODULES.map(m=><TouchableOpacity key={m.id}
      accessibilityRole="button" accessibilityLabel={"Read PSY 210 Module "+m.id+": "+m.name}
      onPress={()=>openModule(m.id)} className="border-b border-slate-700 p-3">
      <Text className="text-white">{read.includes(m.id)&&scores[String(m.id)]>=2?"✓ ":""}
       Module {m.id}: {m.name}</Text>
      <Text className="text-slate-400 mt-1">Weeks {m.weeks} · Best check {scores[String(m.id)]??"—"}/3</Text>
    </TouchableOpacity>)}
   </View>}
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Toggle 14-week PSY 210 syllabus"
     onPress={()=>setShowSyllabus(x=>!x)} className="bg-slate-700 rounded-xl p-4 mt-3">
     <Text className="text-white font-bold text-center">{showSyllabus?"Hide syllabus":"View 14-week syllabus and source assessment weights"}</Text>
   </TouchableOpacity>
   {showSyllabus&&<View className="bg-slate-800 border border-slate-700 rounded-xl p-4 mt-3">
     {PSY210_WEEKS.map(([week,module,focus])=><View key={week} className="border-b border-slate-700 py-3">
       <Text className="text-teal-300 font-bold">Week {week} · Module {module}</Text>
       <Text className="text-white mt-1">{focus}</Text>
     </View>)}
     <Text className="text-white text-lg font-bold mt-5">Source assessment structure</Text>
     {PSY210_ASSESSMENTS.map(([label,weight])=><View key={label} className="flex-row justify-between py-2">
       <Text className="text-slate-300" style={{maxWidth:"76%"}}>{label}</Text>
       <Text className="text-teal-300 font-bold">{weight}%</Text>
     </View>)}
     <Text className="text-amber-300 mt-2">These are source syllabus weights; the app does not award formal grades.</Text>
   </View>}
   <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
    <Text className="text-teal-400 font-bold">MODULE {lesson.id} / 6 · WEEKS {lesson.weeks}</Text>
    <Text className="text-white text-2xl font-extrabold mt-2">{lesson.name}</Text>
    <Text className="text-slate-300 mt-2 font-bold">{lesson.learningGoal}</Text>
    <Text className="text-white leading-7 mt-4">{lesson.overview}</Text>
    <Text className="text-teal-300 font-bold mt-5">Core concepts</Text>
    {lesson.concepts.map((c,i)=><Text className="text-slate-100 leading-6 mt-2" key={i}>• {c}</Text>)}
    <View className="bg-slate-900 border-l-4 border-teal-500 rounded-xl p-4 mt-5">
      <Text className="text-teal-300 font-bold">Fictional analysis scenario</Text>
      <Text className="text-white mt-2 leading-6">{lesson.caseExample}</Text>
    </View>
    <Text className="text-teal-300 font-bold mt-5">Applied learning task</Text>
    <Text className="text-slate-100 leading-6 mt-2">{lesson.practice}</Text>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read PSY 210 module aloud"
     onPress={()=>speakText(lesson.overview+" "+lesson.caseExample)}
     className="bg-teal-800 rounded-xl p-3 mt-5">
      <Text className="text-white text-center font-bold">▶ Listen to this review</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop reading PSY 210 aloud"
     onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mt-2">
      <Text className="text-white text-center">■ Stop speech</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open PSY 210 lesson in Text Reader"
     onPress={()=>toStudio("/reader")} className="bg-slate-700 rounded-xl p-3 mt-2">
      <Text className="text-white text-center">Open in Text Reader →</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create psychology lesson infographic or video storyboard"
     onPress={()=>toStudio("/explainer")} className="bg-indigo-900 border border-indigo-600 rounded-xl p-3 mt-2">
      <Text className="text-white text-center font-bold">Create infographic or explainer video →</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Save psychology lesson to offline circle and tutor"
     onPress={toTutor} className="border border-teal-700 rounded-xl p-3 mt-2">
      <Text className="text-teal-300 text-center">Save to private study circle & Tutor →</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark PSY 210 module reviewed"
     onPress={()=>markRead(lesson.id)} className="bg-slate-700 rounded-xl p-3 mt-3">
      <Text className="text-white text-center">{read.includes(lesson.id)?"✓ Reading marked reviewed":"Mark reading reviewed"}</Text>
    </TouchableOpacity>
   </View>
   <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
     <Text className="text-teal-300 font-bold">MODULE {lesson.id} • THREE-QUESTION RETRIEVAL CHECK</Text>
     <Text className="text-slate-300 mt-2">Choose your answers, then check explanations. This short app quiz is a new learning aid, not a copy of the manuscript's separate instructor assessment bank.</Text>
     {lesson.questions.map((q,idx)=><View key={idx} className="border-t border-slate-700 mt-5 pt-4">
       <Text className="text-white font-semibold text-lg">{idx+1}. {q.stem}</Text>
       {q.options.map((o,i)=><TouchableOpacity key={i}
         accessibilityRole="radio" accessibilityState={{checked:choices[idx]===i}}
         accessibilityLabel={"Module "+lesson.id+" question "+(idx+1)+" answer "+(i+1)+": "+o}
         onPress={()=>{if(graded!==null)return;setChoices(a=>a.map((x,j)=>j===idx?i:x));setMessage("");}}
         className={choices[idx]===i?"bg-teal-900 border border-teal-600 rounded-xl p-3 mt-2":"bg-slate-700 rounded-xl p-3 mt-2"}>
         <Text className="text-white">{i+1}. {o}</Text>
       </TouchableOpacity>)}
       {graded!==null&&<View className="bg-slate-900 rounded-xl p-3 mt-3">
         <Text className="text-teal-200">{choices[idx]===q.answer?"✓ Correct":"Review: "+q.options[q.answer]}</Text>
         <Text className="text-slate-300 mt-2">{q.rationale}</Text>
       </View>}
     </View>)}
     {graded===null?<TouchableOpacity accessibilityRole="button" accessibilityLabel="Save PSY 210 three-question check"
       onPress={grade} className="bg-teal-700 p-4 rounded-xl mt-5">
       <Text className="text-white text-center font-bold">Check & save my answers</Text>
     </TouchableOpacity>:<TouchableOpacity accessibilityRole="button" accessibilityLabel="Retake current PSY 210 quiz"
       onPress={()=>{setChoices([null,null,null]);setGraded(null);setMessage("");}}
       className="bg-slate-700 p-4 rounded-xl mt-5">
       <Text className="text-white text-center font-bold">Retry the three questions</Text>
     </TouchableOpacity>}
     {!!message&&<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-3">{graded!==null?graded+" / 3 — ":""}{message}</Text>}
     <View className="flex-row justify-between mt-6">
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous PSY 210 module"
         disabled={lesson.id===1} onPress={()=>openModule(lesson.id-1)}
         className="bg-slate-700 p-3 rounded-xl" style={{width:"48%"}}>
         <Text className="text-white text-center">← Previous</Text>
       </TouchableOpacity>
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next PSY 210 module"
         disabled={lesson.id===6} onPress={()=>openModule(lesson.id+1)}
         className="bg-indigo-700 p-3 rounded-xl" style={{width:"48%"}}>
         <Text className="text-white text-center">Next module →</Text>
       </TouchableOpacity>
     </View>
   </View>
   <Text className="text-slate-400 text-xs leading-5 mt-5">{PSY210_ATTRIBUTION} License details: creativecommons.org/licenses/by/4.0/</Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset PSY 210 local learning record"
     onPress={()=>Alert.alert("Reset PSY 210 practice?", "This clears local chapter reading and quiz history, not saved offline study circles.",[
       {text:"Cancel",style:"cancel"},{text:"Reset",style:"destructive",onPress:()=>{reset();setChoices([null,null,null]);setGraded(null);setMessage("");}},
     ])} className="p-4 mt-4">
     <Text className="text-slate-400 text-center">Reset private course progress (confirmation required)</Text>
   </TouchableOpacity>
  </ScrollView>;
}
