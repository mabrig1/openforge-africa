import {useEffect,useState} from "react";
import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {speakText,stopSpeech} from "../lib/speech";
import {setStudioDraft} from "../lib/studioDraft";
import {
 type NewCourseId,NEW_COURSE_META,getNewCourseUnits,newCourseCorrectIndex,
 newCourseCompletion
} from "../lib/additionalAcademyCourses";
import {useAdditionalAcademyProgress} from "../stores/additionalAcademyStore";

export function AdditionalAcademyCourse({course}:{course:NewCourseId}){
 const items=getNewCourseUnits(course),meta=NEW_COURSE_META[course];
 const read=useAdditionalAcademyProgress(s=>s.read[course]);
 const passed=useAdditionalAcademyProgress(s=>s.passed[course]);
 const selected=useAdditionalAcademyProgress(s=>s.selected[course]);
 const markRead=useAdditionalAcademyProgress(s=>s.markRead);
 const passQuiz=useAdditionalAcademyProgress(s=>s.passQuiz);
 const select=useAdditionalAcademyProgress(s=>s.select);
 const reset=useAdditionalAcademyProgress(s=>s.reset);
 const [menu,setMenu]=useState(false);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [message,setMessage]=useState("");
 const unit=items.find(x=>x.id===selected)??items[0];
 const isHealth=course==="ceai401";
 const progress=newCourseCompletion(course,read,passed);
 const choices=[...unit.incorrect];
 choices.splice(newCourseCorrectIndex(course,unit.id),0,unit.correct);
 useEffect(()=>()=>stopSpeech(),[]);
 const go=(id:number)=>{
  if(!items.some(x=>x.id===id))return;
  stopSpeech();select(course,id);setChoice(null);setChecked(false);setMessage("");setMenu(false);
 };
 const openTool=(url:"/reader"|"/explainer")=>{
  setStudioDraft(meta.code+" • "+unit.title,[
   meta.source,"This is a new concise review, not the original complete uploaded book.",
   unit.overview,"Key concepts: "+unit.concepts.join("; "),
   "Fictional, low-risk learning activity: "+unit.task,
   isHealth?"Computational screening and models cannot approve herbal safety, efficacy, dosing or medical treatment.":"Do not disclose private emotional or relationship histories."
  ].join("\n\n").slice(0,4000));
  router.push(url);
 };
 const check=()=>{
  if(choice===null){setMessage("Choose one answer before checking.");return;}
  const ok=passQuiz(course,unit.id,choice);
  setChecked(true);
  setMessage(ok?"Correct. Formative learning check saved on this device.":"Review the explanation, then retry.");
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:100}}>
  <Text className="text-teal-300 font-bold tracking-widest text-xs">OPENFORGE ACADEMY • {meta.code}</Text>
  <Text className="text-white text-3xl font-extrabold mt-3">{meta.title}</Text>
  <Text className="text-slate-300 mt-3 leading-6">
   {isHealth?"Seven advanced chapter reviews • research-focused, not a clinical training credential":
   "Twelve course modules • source 12-week teaching syllabus • independent study companion"}
  </Text>
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-5">
   <Text className="text-amber-100 leading-6">
    {isHealth?
     "Educational computational research only. Models, chemical scores and simulations are NOT proof of herbal safety, clinical benefit or regulatory approval. No dosing, medicinal preparation, live experiments or treatment instructions are provided. Consult qualified specialists for actual research or care.":
     "Private and fictional examples are encouraged. No mental-health diagnosis, therapy, personal disclosure or claim that AI is conscious. The original 40-page course remains private."}
    {" "}These short reviews are not the full source text. Local unencrypted progress is not a grade, institutional credit or certificate.
   </Text>
  </View>
  <View className="bg-slate-800 border border-teal-700 rounded-2xl p-5 mt-5">
   <Text className="text-teal-300 font-bold">SOURCE-ALIGNED SELF-STUDY PROGRESS</Text>
   <Text className="text-white font-extrabold text-3xl mt-2">{progress.completed} / {progress.total}</Text>
   <Text className="text-slate-300 mt-2">{progress.percent}% with reading AND successful practice checks</Text>
   <View className="bg-slate-700 rounded-full overflow-hidden mt-3" style={{height:11}}>
    <View className="bg-teal-400 h-3" style={{width:(progress.percent+"%") as `${number}%`}}/>
   </View>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to Academy"
   onPress={()=>router.push("/academy")} className="bg-indigo-800 rounded-xl p-4 mt-4">
   <Text className="text-white text-center font-bold">← Seven-course Academy</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Browse all "+meta.code+" units"}
   accessibilityState={{expanded:menu}} onPress={()=>setMenu(!menu)}
   className="bg-slate-700 rounded-xl p-4 mt-3">
   <Text className="text-white text-center font-bold">{menu?"Hide index":"Browse all "+items.length+(isHealth?" chapters":" modules")}</Text>
  </TouchableOpacity>
  {menu&&<View className="bg-slate-800 rounded-xl mt-2 p-3">
   {items.map(x=><TouchableOpacity key={x.id} accessibilityRole="button"
     accessibilityLabel={"Open "+meta.code+" section "+x.id+": "+x.title}
     onPress={()=>go(x.id)} className="border-b border-slate-700 p-3">
     <Text className="text-white">{read.includes(x.id)&&passed.includes(x.id)?"✓ ":""}{x.id}. {x.title}</Text>
   </TouchableOpacity>)}
  </View>}
  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
   <Text className="text-teal-300 font-bold">{isHealth?"CHAPTER":"MODULE"} {unit.id} / {items.length}</Text>
   <Text className="text-white text-2xl font-bold mt-3">{unit.title}</Text>
   <Text className="text-slate-100 leading-7 mt-4">{unit.overview}</Text>
   <Text className="text-teal-300 font-bold mt-5">Key learning concepts</Text>
   {unit.concepts.map((concept,i)=><Text key={i} className="text-slate-200 mt-2 leading-6">• {concept}</Text>)}
   <View className="bg-slate-900 border-l-4 border-indigo-600 rounded-xl p-4 mt-5">
    <Text className="text-indigo-300 font-bold">Independent case-based exercise</Text>
    <Text className="text-white leading-6 mt-2">{unit.task}</Text>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read current module aloud"
    onPress={()=>speakText(unit.title+". "+unit.overview+". "+unit.task)}
    className="bg-teal-800 rounded-xl p-3 mt-5">
    <Text className="text-white font-bold text-center">▶ Read review aloud</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop reading aloud"
    onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">■ Stop speech</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send short review to Text Reader"
    onPress={()=>openTool("/reader")} className="bg-slate-700 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">Open review in Text Reader →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send short review to offline Explainer"
    onPress={()=>openTool("/explainer")} className="bg-indigo-800 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">Create offline infographic / storyboard →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Mark "+meta.code+" review read"}
    onPress={()=>markRead(course,unit.id)} className="bg-slate-700 rounded-xl p-3 mt-4">
    <Text className="text-white text-center">{read.includes(unit.id)?"✓ Review marked read":"Mark this review as read"}</Text>
   </TouchableOpacity>
  </View>
  <View className="bg-slate-800 border border-teal-700 rounded-2xl p-5 mt-5">
   <Text className="text-teal-300 font-bold">FORMATIVE REASONING CHECK • NOT A GRADE</Text>
   <Text className="text-white font-bold text-lg mt-3">{unit.question}</Text>
   {choices.map((answer,i)=><TouchableOpacity key={i} accessibilityRole="radio"
    accessibilityState={{checked:choice===i,disabled:checked}}
    accessibilityLabel={"Answer "+(i+1)+": "+answer}
    onPress={()=>{if(!checked){setChoice(i);setMessage("");}}}
    className={choice===i?"bg-teal-900 border border-teal-600 rounded-xl p-4 mt-3":"bg-slate-700 rounded-xl p-4 mt-3"}>
    <Text className="text-white">{i+1}. {answer}</Text>
   </TouchableOpacity>)}
   {!!message&&<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-4">{message}</Text>}
   {checked&&<View className="bg-slate-900 rounded-xl p-4 mt-3">
    <Text className="text-white leading-6">{unit.feedback}</Text>
    {choice!==newCourseCorrectIndex(course,unit.id)&&<TouchableOpacity
      accessibilityRole="button" accessibilityLabel="Try formative answer again"
      onPress={()=>{setChoice(null);setChecked(false);setMessage("");}}
      className="bg-teal-800 rounded-xl p-3 mt-3">
      <Text className="text-white text-center">Try again</Text>
    </TouchableOpacity>}
   </View>}
   {!checked&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Check course answer"
    onPress={check} className="bg-teal-700 rounded-xl p-4 mt-5">
    <Text className="text-white text-center font-bold">Check my answer</Text>
   </TouchableOpacity>}
   {passed.includes(unit.id)&&<Text className="text-green-300 mt-4">✓ Formative check recorded locally</Text>}
  </View>
  <View className="flex-row justify-between mt-5">
   <TouchableOpacity accessibilityRole="button" disabled={unit.id===1}
    accessibilityLabel={"Previous "+meta.code+" section"} onPress={()=>go(unit.id-1)}
    style={{width:"48%",opacity:unit.id===1?0.5:1}}
    className="bg-slate-700 rounded-xl p-4">
    <Text className="text-white text-center">← Previous</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" disabled={unit.id===items.length}
    accessibilityLabel={"Next "+meta.code+" section"} onPress={()=>go(unit.id+1)}
    style={{width:"48%",opacity:unit.id===items.length?0.5:1}}
    className="bg-teal-800 rounded-xl p-4">
    <Text className="text-white text-center">Next →</Text>
   </TouchableOpacity>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Reset "+meta.code+" progress with confirmation"}
    onPress={()=>Alert.alert("Reset "+meta.code+" self-study progress?",
      "Only this course's local reading and practice records will be cleared.",
      [{text:"Keep",style:"cancel"},{text:"Reset this course",style:"destructive",onPress:()=>reset(course)}])}
    className="p-4 mt-4"><Text className="text-slate-400 text-center">Reset this course's progress</Text>
  </TouchableOpacity>
 </ScrollView>;
}