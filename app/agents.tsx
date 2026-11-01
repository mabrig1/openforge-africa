import {useState} from "react";
import {ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {useCircleStore} from "../stores/circleStore";
import {useLogicCourseProgress} from "../stores/logicCourseStore";
import {usePsy210Progress} from "../stores/psy210Store";
import {useExpandedCoursesProgress} from "../stores/expandedCoursesStore";
import {useAil101Progress} from "../stores/ail101Store";
import {useAdditionalAcademyProgress} from "../stores/additionalAcademyStore";
import {useSoulProgress} from "../stores/integratedSoulStore";
import {useClearSightProgress} from "../stores/clearSightStore";
import {useSpeakerProgress} from "../stores/multiChannelSpeakerStore";
import {useAcademyStudyStore} from "../stores/academyStudyStore";
import {getAcademyDashboard,academyWeeklySessions,localCalendarDay,
 type AcademyCourseId} from "../lib/academyDashboard";
import {AGENTS,runAgent,type AgentId,type AgentResult} from "../lib/agenticUniversity";
import {setStudioDraft} from "../lib/studioDraft";

export default function AgentDesk(){
 const l=useLogicCourseProgress(),p=usePsy210Progress(),e=useExpandedCoursesProgress();
 const a=useAil101Progress(),n=useAdditionalAcademyProgress(),so=useSoulProgress();
 const cs=useClearSightProgress(),sp=useSpeakerProgress();
 const weeklyTarget=useAcademyStudyStore(s=>s.weeklyTarget);
 const sessions=useAcademyStudyStore(s=>s.sessions);
 const savedNotes=useCircleStore(s=>s.materials);
 const [courseId,setCourseId]=useState<AcademyCourseId>("logic");
 const [agent,setAgent]=useState<AgentId>("coordinator");
 const [question,setQuestion]=useState("");
 const [selectedNotes,setSelectedNotes]=useState<string[]>([]);
 const [result,setResult]=useState<AgentResult|null>(null);
 const [error,setError]=useState("");
 const dashboard=getAcademyDashboard({
  logicRead:l.read,logicPassed:l.passed,logicSelected:l.selected,
  psyRead:p.read,psyScores:p.scores,psySelected:p.selected,
  decisionRead:e.read.decision,decisionPassed:e.passed.decision,decisionSelected:e.selected.decision,
  forgeRead:e.read.forge,forgePassed:e.passed.forge,forgeSelected:e.selected.forge,
  ailRead:a.read,ailPassed:a.passed,ailSelected:a.selected,
  rlxRead:n.read.rlx101,rlxPassed:n.passed.rlx101,rlxSelected:n.selected.rlx101,
  ceaiRead:n.read.ceai401,ceaiPassed:n.passed.ceai401,ceaiSelected:n.selected.ceai401,
  soulRead:so.read,soulPassed:so.passed,soulSelected:so.selected,
  clearRead:cs.read,clearPassed:cs.passed,clearSelected:cs.selected,
  speakerRead:sp.read,speakerPassed:sp.passed,speakerSelected:sp.selected,
 });
 const course=dashboard.courses.find(c=>c.id===courseId)??dashboard.courses[0];
 const notes=savedNotes.filter(note=>selectedNotes.includes(note.id)).slice(0,3);
 const run=()=>{
  setError("");
  try{
   setResult(runAgent(agent,{course,question,notes,
     weeklyTarget,sessions:academyWeeklySessions(sessions,localCalendarDay()).count}));
  }catch(err){setResult(null);setError(err instanceof Error?err.message:"Could not make local draft.");}
 };
 const openDraft=()=>{
  if(!result?.draft)return;
  setStudioDraft(result.headline,result.draft);
  router.push(result.agent==="accessibility"?"/reader":"/explainer");
 };
 const chooseNote=(id:string)=>{
  setSelectedNotes(previous=>previous.includes(id)?previous.filter(x=>x!==id):
   previous.length<3?[...previous,id]:previous);
  setResult(null);
 };
 return <ScrollView className="flex-1 bg-slate-900"
  contentContainerStyle={{padding:18,paddingBottom:80}} keyboardShouldPersistTaps="handled">
  <Text className="text-green-400 text-xs font-bold">OPENFORGE AFRICA • AGENT DESK V0.1</Text>
  <Text className="text-white text-3xl font-extrabold mt-2">12-agent learning studio</Text>
  <Text className="text-slate-300 leading-6 mt-3">
   Select an Academy course and a specialist. These are transparent rule-based role workflows,
   not twelve autonomous AI models. The Coordinator can delegate to three local specialists.
  </Text>
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
   <Text className="text-amber-100 leading-5">
    Runs only when you tap Run. No external AI, payment, search, uploads, automatic speech,
    assessment scores, enrollment or publishing. All drafts need human review.
    Course milestones are not accredited credentials.
   </Text>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open interactive 15-agent free classroom"
    onPress={()=>router.push("/classroom")} className="bg-indigo-700 rounded-xl p-4 mt-5">
    <Text className="text-white text-center font-bold">Explore 15-Agent Free Classroom →</Text>
  </TouchableOpacity>
  <Text className="text-white font-bold text-lg mt-6 mb-3">1. Select your course</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
   {dashboard.courses.map(c=><TouchableOpacity key={c.id} accessibilityRole="button"
    accessibilityState={{selected:courseId===c.id}} accessibilityLabel={"Choose "+c.title}
    onPress={()=>{setCourseId(c.id);setResult(null);}}
    className={courseId===c.id?"bg-green-700 p-3 rounded-xl mr-2":"bg-slate-700 p-3 rounded-xl mr-2"}>
    <Text className="text-white font-semibold">{c.code}</Text>
   </TouchableOpacity>)}
  </ScrollView>
  <View className="bg-slate-800 border border-slate-700 p-4 rounded-xl mt-3">
   <Text className="text-white font-bold">{course.title}</Text>
   <Text className="text-slate-300 mt-2">{course.percent}% local milestones recorded</Text>
   <Text className="text-slate-300 mt-2">Next: {course.next.action} — {course.next.title}</Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open selected course"
    onPress={()=>router.push(course.route)} className="bg-indigo-800 p-3 rounded-xl mt-3">
    <Text className="text-white text-center">Open selected course →</Text>
   </TouchableOpacity>
  </View>
  <Text className="text-white font-bold text-lg mt-6 mb-3">2. Choose one specialist</Text>
  <View className="flex-row flex-wrap justify-between">
   {AGENTS.map(def=><TouchableOpacity key={def.id} accessibilityRole="button"
    accessibilityState={{selected:agent===def.id}} accessibilityLabel={"Choose "+def.name}
    onPress={()=>{setAgent(def.id);setResult(null);}} style={{width:"48%"}}
    className={agent===def.id?"bg-green-900 border border-green-500 rounded-xl p-3 mb-3":"bg-slate-800 border border-slate-600 rounded-xl p-3 mb-3"}>
    <Text className="text-white font-bold">{def.name}</Text>
    <Text className="text-slate-300 text-xs mt-2">{def.purpose}</Text>
   </TouchableOpacity>)}
  </View>
  <Text className="text-white font-bold text-lg mt-5 mb-3">3. Choose local notes (optional, max 3)</Text>
  <Text className="text-slate-300 mb-3">Only your selected note excerpts (up to 1,500 characters each) can be searched locally. Nothing is uploaded.</Text>
  {savedNotes.length===0?<Text className="text-amber-300">
   No saved study-circle notes yet. The Tutor, Library and source-grounded Assessment require local notes.
  </Text>:savedNotes.map(note=><TouchableOpacity key={note.id} accessibilityRole="checkbox"
   accessibilityState={{checked:selectedNotes.includes(note.id)}}
   accessibilityLabel={"Select saved note "+note.title} onPress={()=>chooseNote(note.id)}
   className={selectedNotes.includes(note.id)?"bg-green-900 p-3 rounded-xl mb-2":"bg-slate-800 p-3 rounded-xl mb-2"}>
   <Text className="text-white">{selectedNotes.includes(note.id)?"☑ ":"☐ "}{note.title}</Text>
   {selectedNotes.includes(note.id)&&<Text selectable className="text-slate-300 text-xs mt-2">{note.content.slice(0,300)}{note.content.length>300?"…":""}</Text>}
  </TouchableOpacity>)}
  <Text className="text-white font-bold text-lg mt-5 mb-2">4. Topic or study request</Text>
  <TextInput accessibilityLabel="Agent question" multiline value={question} maxLength={500}
   onChangeText={value=>{setQuestion(value);setResult(null);}}
   placeholder="Optional: a topic, question or learning goal"
   placeholderTextColor="#94a3b8" className="text-white bg-slate-800 border border-slate-700 rounded-xl p-4"
   style={{minHeight:88,textAlignVertical:"top"}}/>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Run the selected local learning agent"
   onPress={run} className="bg-green-700 rounded-xl p-4 mt-4">
   <Text className="text-white text-center font-bold">Run {AGENTS.find(a=>a.id===agent)?.name} locally →</Text>
  </TouchableOpacity>
  {!!error&&<Text className="text-amber-300 mt-4">{error}</Text>}
  {result&&<View className="bg-slate-800 border border-green-700 p-5 rounded-2xl mt-6">
   <Text className="text-green-300 text-xs font-bold">{result.name.toUpperCase()} • {result.status.replace("-"," ").toUpperCase()}</Text>
   <Text className="text-white text-2xl font-bold mt-2">{result.headline}</Text>
   {!!result.delegates&&<Text className="text-indigo-200 mt-3">Local delegation: {result.delegates.map(id=>AGENTS.find(a=>a.id===id)?.name).join(" → ")}</Text>}
   {result.steps.map((step,index)=><Text key={index} selectable className="text-slate-100 leading-6 mt-4">{index+1}. {step}</Text>)}
   {!!result.evidence.length&&<View className="bg-slate-900 p-3 rounded-xl mt-4">
    <Text className="text-green-300 font-bold">Matched local source(s)</Text>
    {result.evidence.map(item=><Text key={item.id} className="text-slate-200 mt-2">{item.title} — saved note</Text>)}
   </View>}
   <Text className="text-amber-200 mt-5 text-sm">{result.notice}</Text>
   {!!result.draft&&<TouchableOpacity accessibilityRole="button" onPress={openDraft}
    accessibilityLabel={"Open draft in "+(result.agent==="accessibility"?"Text Reader":"Explainer Studio")}
    className="bg-indigo-700 rounded-xl p-4 mt-4">
    <Text className="text-white text-center font-bold">Open editable draft in {result.agent==="accessibility"?"Text Reader":"Explainer Studio"} →</Text>
   </TouchableOpacity>}
  </View>}
 </ScrollView>;
}
