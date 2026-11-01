import {useEffect,useState} from "react";
import {ScrollView,Text,TouchableOpacity,View,TextInput} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {type ExpansionCourse,getExpansion,DECISION_LABS,FORGE_MILESTONES,FORGE_WEIGHTS} from "../lib/academyExpansion";
import {useExpandedCoursesProgress,expandedSummary} from "../stores/expandedCoursesStore";
import {speakText,stopSpeech} from "../lib/speech";
import {setStudioDraft} from "../lib/studioDraft";
function CourseCompanion({course}:{course:ExpansionCourse}){
 const isForge=course==="forge";
 const items=getExpansion(course);
 const read=useExpandedCoursesProgress(s=>s.read[course]);
 const passed=useExpandedCoursesProgress(s=>s.passed[course]);
 const selected=useExpandedCoursesProgress(s=>s.selected[course]);
 const drafts=useExpandedCoursesProgress(s=>s.evidence);
 const markRead=useExpandedCoursesProgress(s=>s.markRead);
 const passQuiz=useExpandedCoursesProgress(s=>s.passQuiz);
 const select=useExpandedCoursesProgress(s=>s.select);
 const saveEvidence=useExpandedCoursesProgress(s=>s.saveEvidence);
 const reset=useExpandedCoursesProgress(s=>s.reset);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [warning,setWarning]=useState("");
 const [menu,setMenu]=useState(false);
 const [outline,setOutline]=useState(false);
 const item=items.find(x=>x.id===selected)??items[0];
 const [evidenceUrl,setEvidenceUrl]=useState(drafts[String(item.id)]?.url??"");
 const [evidenceNote,setEvidenceNote]=useState(drafts[String(item.id)]?.note??"");
 useEffect(()=>()=>stopSpeech(),[]);
 const completion=expandedSummary(course,read,passed);
 const practiceChoices=[item.distractors[0],item.distractors[1]];
 practiceChoices.splice(item.id%3,0,item.correct);
 const navigate=(n:number)=>{
  if(n<1||n>items.length)return;
  stopSpeech();select(course,n);
  setChoice(null);setChecked(false);setWarning("");setMenu(false);
  setEvidenceUrl(drafts[String(n)]?.url??"");
  setEvidenceNote(drafts[String(n)]?.note??"");
 };
 const submit=()=>{
  if(choice===null){setWarning("Select a response first.");return;}
  const ok=passQuiz(course,item.id,choice);
  setChecked(true);
  setWarning(ok?"Correct explanation recorded. This is a formative practice check.":"Review the source-based explanation and try again.");
 };
 const sendTo=(route:"/reader"|"/explainer")=>{
  setStudioDraft(item.title,[
    (isForge?"FS 101 — Week ":"Human Intelligence, Logic and AI Decision Science — Unit ")+item.id,
    item.overview,
    "Three study cues: "+item.concepts.join(" • "),
    "Applied work: "+item.application,
    isForge?"Required artifact: "+item.artifact:"Independent checks: distinguish evidence, risk and stakeholder responsibility.",
    "Reference: "+(isForge?"OpenForge Africa, FS 101: Introduction to Forge Studies":"Mabrig Korie (2026), Human Intelligence, Logic and AI Decision Science"),
  ].join("\n\n").slice(0,4000));
  router.push(route);
 };
 const storeProof=()=>{
  if(!saveEvidence(item.id,evidenceUrl.trim(),evidenceNote.trim())){
   setWarning("Enter an HTTPS evidence URL under 500 characters and a note under 1,000 characters. Leave URL blank for a private draft.");return;
  }
  setWarning("Saved locally as YOUR OWN UNVERIFIED evidence draft. No mentor has reviewed it.");
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
   contentContainerStyle={{padding:18,paddingBottom:85}}>
   <Text className="text-green-400 font-bold tracking-widest text-xs">OPENFORGE ACADEMY • {isForge?"FS 101":"HILADS"}</Text>
   <Text className="text-white font-extrabold text-3xl mt-2">{isForge?"Introduction to Forge Studies":"Human Intelligence, Logic and AI Decision Science"}</Text>
   <Text className="text-slate-300 leading-6 mt-3">{isForge?
     "Ten weeks • Forge Cycle: Discover, Build, Launch, Prove, Share • syllabus-based native review":
     "Twenty units • twenty-week pathway • philosophy, logic, evidence, statistics, decisions and responsible AI"}</Text>
   <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
    <Text className="text-amber-100 leading-5">{isForge?
     "This screen is an independent self-study companion; quizzes and entered URLs are NOT assessed portfolio evidence. The syllabus's Foundation Certificate requires authentic public artifacts and human mentor/panel verification. No certificate or milestone badge is issued here. Do not expose interviewees' private data.":
     "The 100-page original Mabrig Korie textbook is supplied separately in the private offline bundle. These are concise source-aligned reviews, not the complete original book. Proposed institutional credits require approval; none are awarded here."}</Text>
   </View>
   <View className="bg-slate-800 border border-teal-700 rounded-xl p-5 mt-5">
    <Text className="text-teal-300 font-bold">ON-DEVICE REVIEW MILESTONES</Text>
    <Text className="text-white text-3xl font-bold mt-2">{completion.completed} / {completion.total}</Text>
    <Text className="text-slate-300 mt-1">{completion.percent}% reviewed and formative check passed</Text>
    <View className="bg-slate-700 rounded-full h-3 overflow-hidden mt-3">
      <View className="bg-teal-400 h-3" style={{width:(completion.percent+"%") as `${number}%`}}/>
    </View>
    <Text className="text-slate-400 text-xs mt-3">Review milestones are not proof verification, a course grade or academic credit.</Text>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back to four-course Academy"
      onPress={()=>router.push("/academy")}
      className="bg-indigo-800 rounded-xl p-4 mt-4">
      <Text className="text-white text-center font-bold">← Four-course Academy dashboard</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show or hide all units or weeks"
      onPress={()=>setMenu(x=>!x)} className="bg-slate-700 rounded-xl p-4 mt-3">
      <Text className="text-white text-center font-bold">{menu?"Hide course index":"Browse all "+items.length+(isForge?" weeks":" units")}</Text>
   </TouchableOpacity>
   {menu&&<View className="bg-slate-800 rounded-xl p-3 mt-2">
    {items.map(x=><TouchableOpacity key={x.id} accessibilityRole="button"
      accessibilityLabel={"Open "+(isForge?"week ":"unit ")+x.id+": "+x.title}
      onPress={()=>navigate(x.id)} className="border-b border-slate-700 p-3">
      <Text className="text-white">{read.includes(x.id)&&passed.includes(x.id)?"✓ ":""}{isForge?"Week ":"Unit "}{x.id}: {x.title}</Text>
      {x.phase&&<Text className="text-teal-300 text-xs mt-1">{x.phase}</Text>}
    </TouchableOpacity>)}
   </View>}
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show course learning syllabus"
      onPress={()=>setOutline(x=>!x)} className="bg-slate-700 rounded-xl p-4 mt-3">
      <Text className="text-white font-bold text-center">{outline?"Hide syllabus":"View source learning pathway and guidance"}</Text>
   </TouchableOpacity>
   {outline&&<View className="bg-slate-800 rounded-xl p-4 mt-2">
    <Text className="text-white leading-6">
      {isForge?
        "The source specifies ten weeks, approximately six hours weekly, public artifacts, peer review and mentor validation. The Forge Cycle has five phases and five proof-gated milestones. No written examination substitutes for authentic demonstration.":
        "The original course proposes one unit per week, with approximately six to eight hours of independent study weekly, and seven applied laboratories. Work through cases, complete at least four labs, then defend a source-verified capstone decision."}
    </Text>
    {isForge?<>
      <Text className="text-white text-lg font-bold mt-5">Evidence-gated syllabus milestones</Text>
      {FORGE_MILESTONES.map(x=><Text key={x.name} className="text-slate-300 mt-2">
        {x.name} — {x.requires} (human review required)</Text>)}
      <Text className="text-white font-bold mt-4">Source's 100% evaluation rubric</Text>
      {FORGE_WEIGHTS.map(([label,weight])=><Text className="text-slate-300 mt-2" key={label}>{label}: {weight}%</Text>)}
      <Text className="text-amber-200 mt-3">The syllabus suggests ≥50% plus five verified milestones for a pass, and extra criteria for distinction. This app cannot verify or issue either outcome.</Text>
    </>:<>
      <Text className="text-white text-lg font-bold mt-5">Seven original applied labs</Text>
      {DECISION_LABS.map((x,i)=><Text key={x} className="text-slate-300 mt-2">{i+1}. {x}</Text>)}
    </>}
   </View>}
   <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
    <Text className="text-teal-300 font-bold">{isForge?"WEEK":"UNIT"} {item.id} / {items.length} {item.phase?"• "+item.phase:""}</Text>
    <Text className="text-white text-2xl font-extrabold mt-2">{item.title}</Text>
    <Text className="text-slate-100 leading-7 mt-4">{item.overview}</Text>
    <Text className="text-teal-300 font-bold mt-5">Core teaching cues</Text>
    {item.concepts.map((v,i)=><Text key={i} className="text-slate-200 mt-2 leading-6">• {v}</Text>)}
    <View className="bg-slate-900 border-l-4 border-indigo-500 rounded-xl p-4 mt-5">
     <Text className="text-indigo-300 font-bold">Apply what you learned</Text>
     <Text className="text-white leading-6 mt-2">{item.application}</Text>
    </View>
    {isForge&&<>
      <Text className="text-white font-bold mt-5">Weekly shipped artifact</Text>
      <Text className="text-slate-200 mt-2">{item.artifact}</Text>
      <Text className="text-white font-bold mt-4">Proof described in source syllabus</Text>
      <Text className="text-slate-200 mt-2 leading-6">{item.proof}</Text>
    </>}
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read this new course review aloud"
      onPress={()=>speakText(item.overview+" "+item.application)}
      className="bg-teal-800 rounded-xl p-4 mt-5">
      <Text className="text-white font-bold text-center">▶ Read review aloud</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop course speech"
      onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mt-2">
      <Text className="text-white text-center">■ Stop speech</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open review in Text Reader"
      onPress={()=>sendTo("/reader")} className="bg-slate-700 rounded-xl p-3 mt-2">
      <Text className="text-white text-center">Open in Text Reader →</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create new course infographic or explainer"
      onPress={()=>sendTo("/explainer")} className="bg-indigo-800 rounded-xl p-3 mt-2">
      <Text className="text-white font-bold text-center">Create infographic or video storyboard →</Text>
    </TouchableOpacity>
    {!isForge&&[6,7,8].includes(item.id)&&<TouchableOpacity accessibilityRole="button"
      accessibilityLabel="Open actual formal logic truth-table simulator"
      onPress={()=>router.push("/logic-lab")} className="bg-teal-800 rounded-xl p-3 mt-2">
      <Text className="text-white text-center">Open interactive Truth Table Lab →</Text>
    </TouchableOpacity>}
    {!isForge&&[10,11,16].includes(item.id)&&<TouchableOpacity accessibilityRole="button"
      accessibilityLabel="Open decision science interactive probability and value laboratory"
      onPress={()=>router.push("/decision-lab")} className="bg-teal-800 rounded-xl p-3 mt-2">
      <Text className="text-white text-center">Open probability and decision science lab →</Text>
    </TouchableOpacity>}
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark expanded course reading reviewed"
      onPress={()=>markRead(course,item.id)} className="bg-slate-700 rounded-xl p-3 mt-4">
      <Text className="text-white text-center">{read.includes(item.id)?"✓ Reading marked reviewed":"Mark this review as read"}</Text>
    </TouchableOpacity>
   </View>
   <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
    <Text className="text-teal-300 font-bold">SOURCE-ALIGNED FORMATIVE PRACTICE</Text>
    <Text className="text-white text-lg mt-2 font-bold">Which statement is supported by this unit?</Text>
    {practiceChoices.map((text,i)=>
      <TouchableOpacity key={i} accessibilityRole="radio"
        accessibilityLabel={"Select expansion practice option "+(i+1)+": "+text}
        accessibilityState={{checked:choice===i}}
        onPress={()=>{if(!checked){setChoice(i);setWarning("");}}}
        className={choice===i?"bg-teal-900 border border-teal-600 rounded-xl p-4 mt-3":"bg-slate-700 rounded-xl p-4 mt-3"}>
        <Text className="text-white">{i+1}. {text}</Text>
      </TouchableOpacity>
    )}
    {checked&&<View className="bg-slate-900 p-4 rounded-xl mt-4">
      <Text className="text-teal-300 font-bold">{choice===item.id%3?"✓ Supported conclusion":"Review: "+item.correct}</Text>
      <Text className="text-white mt-2 leading-6">{item.reason}</Text>
      {! (choice===1)&&<TouchableOpacity accessibilityRole="button"
         accessibilityLabel="Retry expansion practice" onPress={()=>{setChoice(null);setChecked(false);setWarning("");}}
         className="bg-slate-700 rounded-xl p-3 mt-4">
         <Text className="text-white text-center">Try another answer</Text>
      </TouchableOpacity>}
    </View>}
    {!checked&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Check expansion practice response"
      onPress={submit} className="bg-teal-700 rounded-xl p-4 mt-5">
      <Text className="text-white text-center font-bold">Check my reasoning</Text>
    </TouchableOpacity>}
    {passed.includes(item.id)&&<Text className="text-green-300 mt-4">✓ This formative practice milestone was recorded locally.</Text>}
   </View>
   {isForge&&<View className="bg-slate-800 border border-indigo-700 rounded-2xl p-5 mt-5">
     <Text className="text-indigo-300 font-bold">PRIVATE PROOF-PREPARATION NOTEBOOK</Text>
     <Text className="text-slate-300 leading-5 mt-2">Paste a link to YOUR actual work, then record what remains to be independently checked.
       No submission is made, the linked content is not inspected, and this cannot earn a verified Forge badge.</Text>
     <Text className="text-white font-bold mt-4 mb-2">Public artifact HTTPS URL (optional)</Text>
     <TextInput accessibilityLabel="Weekly Forge evidence URL" value={evidenceUrl} onChangeText={setEvidenceUrl}
       autoCapitalize="none" autoCorrect={false} keyboardType="url" maxLength={500}
       placeholder="https://github.com/... or project link" placeholderTextColor="#94a3b8"
       className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-white"/>
     <Text className="text-white font-bold mt-4 mb-2">Private draft notes (avoid names or sensitive information)</Text>
     <TextInput accessibilityLabel="Weekly Forge evidence preparation notes" value={evidenceNote}
       onChangeText={setEvidenceNote} multiline maxLength={1000} textAlignVertical="top"
       placeholder="What is demonstrably real? What needs mentor review?" placeholderTextColor="#94a3b8"
       className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-white" style={{minHeight:110}}/>
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Save unverified Forge evidence draft"
       onPress={storeProof} className="bg-indigo-700 rounded-xl p-4 mt-4">
       <Text className="text-white text-center font-bold">Save private draft — NOT submit for verification</Text>
     </TouchableOpacity>
     {!!drafts[String(item.id)]?.url&&<Text className="text-slate-300 mt-3">Saved evidence link: {drafts[String(item.id)].url}</Text>}
   </View>}
   {!!warning&&<Text accessibilityLiveRegion="polite" className="text-amber-200 leading-5 mt-3">{warning}</Text>}
   <View className="flex-row justify-between mt-5">
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous new course lesson"
      disabled={item.id===1} onPress={()=>navigate(item.id-1)}
      className="bg-slate-700 rounded-xl p-4" style={{width:"48%",opacity:item.id===1?0.35:1}}>
      <Text className="text-white text-center">← Previous</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next new course lesson"
      disabled={item.id===items.length} onPress={()=>navigate(item.id+1)}
      className="bg-indigo-700 rounded-xl p-4" style={{width:"48%",opacity:item.id===items.length?0.35:1}}>
      <Text className="text-white text-center">Next →</Text>
    </TouchableOpacity>
   </View>
   <Text className="text-slate-400 text-xs leading-5 mt-6">
     {isForge?"Source: FS 101: Introduction to Forge Studies, OpenForge Africa, 10-week syllabus and lesson guide.":
      "Source: Mabrig Korie, Human Intelligence, Logic and AI Decision Science, first teaching edition, November 2026 (100-page student text)."}
     {" "}Learning review and question wording adapted for offline self-study.
   </Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset only this new course learning milestones"
     onPress={()=>Alert.alert("Reset this course?","Clears this subject's saved practice and reading progress"+(isForge?" plus all local Forge evidence drafts":"")+". Other Academy courses stay untouched.",[
       {text:"Cancel",style:"cancel"},{text:"Reset",style:"destructive",onPress:()=>{reset(course);navigate(1);}}
     ])} className="p-4 mt-3">
     <Text className="text-slate-400 text-center">Reset this course's local progress (confirm)</Text>
   </TouchableOpacity>
  </ScrollView>;
}
export function DecisionScienceCourse(){return <CourseCompanion course="decision"/>;}
export function ForgeStudiesCourse(){return <CourseCompanion course="forge"/>;}
