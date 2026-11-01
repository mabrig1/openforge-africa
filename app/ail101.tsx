import {useEffect,useState} from "react";
import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {AIL101_UNITS,AIL101_LABS,ailAnswerIndex,ailCompletion} from "../lib/ail101Course";
import {useAil101Progress} from "../stores/ail101Store";
import {speakText,stopSpeech} from "../lib/speech";
import {setStudioDraft} from "../lib/studioDraft";
import {Alert} from "../lib/platformDialogs";

export default function AiLiteracyCourse(){
 const read=useAil101Progress(s=>s.read);
 const passed=useAil101Progress(s=>s.passed);
 const selected=useAil101Progress(s=>s.selected);
 const markRead=useAil101Progress(s=>s.markRead);
 const passQuiz=useAil101Progress(s=>s.passQuiz);
 const select=useAil101Progress(s=>s.select);
 const reset=useAil101Progress(s=>s.reset);
 const [menu,setMenu]=useState(false);
 const [outline,setOutline]=useState(false);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [warning,setWarning]=useState("");
 const item=AIL101_UNITS.find(x=>x.id===selected)??AIL101_UNITS[0];
 const progress=ailCompletion(read,passed);
 const options=[...item.distractors];
 options.splice(ailAnswerIndex(item.id),0,item.correct);
 useEffect(()=>()=>stopSpeech(),[]);
 const navigate=(id:number)=>{
  if(!AIL101_UNITS.some(x=>x.id===id))return;
  stopSpeech();select(id);setChoice(null);setChecked(false);setWarning("");setMenu(false);
 };
 const submit=()=>{
  if(choice===null){setWarning("Choose an answer first.");return;}
  const ok=passQuiz(item.id,choice);
  setChecked(true);
  setWarning(ok?"Correct. Your formative practice is saved only on this device.":"Review the explanation, then retry.");
 };
 const transfer=(route:"/reader"|"/explainer")=>{
  setStudioDraft("AIL 101 • Unit "+item.id+": "+item.title,[
   "Mabrig Korie (2026), AI Literacy and Human-AI Collaboration (AIL 101): original native unit review.",
   item.overview,"Core concepts: "+item.concepts.join("; "),
   "Independent application: "+item.application,
   "Important: verify all sources and do not upload private course material."
  ].join("\n\n").slice(0,4000));
  router.push(route);
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
   contentContainerStyle={{padding:18,paddingBottom:90}}>
  <Text className="text-green-400 font-bold tracking-widest text-xs">OPENFORGE ACADEMY • AIL 101</Text>
  <Text className="text-white font-extrabold text-3xl mt-2">AI Literacy and Human–AI Collaboration</Text>
  <Text className="text-slate-300 leading-6 mt-3">
   Twenty-week independent self-study companion • twenty original unit reviews • seven applied studios.
  </Text>
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
   <Text className="text-amber-100 leading-5">
    This is a concise, source-aligned learning companion, NOT the complete private
    100-page Mabrig Korie textbook. All progress stays in unencrypted on-device app
    storage; avoid entering sensitive data. No paid AI inference, academic credit,
    institutional approval or certificate is included.
   </Text>
  </View>
  <View className="bg-slate-800 border border-teal-700 rounded-2xl p-5 mt-5">
    <Text className="text-teal-300 font-bold">INDEPENDENT REVIEW PROGRESS</Text>
    <Text className="text-white text-3xl font-bold mt-2">{progress.completed} / {progress.total}</Text>
    <Text className="text-slate-300 mt-2">{progress.percent}% reading AND successful practice checks</Text>
    <View className="bg-slate-700 rounded-full mt-3 overflow-hidden" style={{height:11}}>
      <View className="bg-teal-400 h-3" style={{width:(progress.percent+"%") as `${number}%`}}/>
    </View>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to Academy course catalogue"
    onPress={()=>router.push("/academy")} className="bg-indigo-800 rounded-xl p-4 mt-4">
    <Text className="text-white font-bold text-center">← Academy dashboard</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityState={{expanded:menu}}
    accessibilityLabel="Browse all AI literacy units" onPress={()=>setMenu(!menu)}
    className="bg-slate-700 rounded-xl p-4 mt-3">
    <Text className="text-white font-bold text-center">{menu?"Hide units":"Browse all 20 units"}</Text>
  </TouchableOpacity>
  {menu&&<View className="bg-slate-800 rounded-xl p-3 mt-2">
   {AIL101_UNITS.map(unit=><TouchableOpacity key={unit.id} accessibilityRole="button"
     accessibilityLabel={"Study AI literacy unit "+unit.id+": "+unit.title}
     onPress={()=>navigate(unit.id)} className="border-b border-slate-700 p-3">
      <Text className="text-white">{read.includes(unit.id)&&passed.includes(unit.id)?"✓ ":""}{unit.id}. {unit.title}</Text>
   </TouchableOpacity>)}
  </View>}
  <TouchableOpacity accessibilityRole="button" accessibilityState={{expanded:outline}}
    accessibilityLabel="Show AI literacy applied studio syllabus" onPress={()=>setOutline(!outline)}
    className="bg-slate-700 rounded-xl p-4 mt-3">
    <Text className="text-white font-bold text-center">{outline?"Hide applied studios":"View seven applied studios"}</Text>
  </TouchableOpacity>
  {outline&&<View className="bg-slate-800 rounded-xl p-4 mt-2">
   <Text className="text-white leading-6">The 100-page source course includes these seven guided studios. Full procedures and capstone instructions remain in the owner's separate book.</Text>
   {AIL101_LABS.map((name,i)=><Text key={name} className="text-slate-300 mt-3">{i+1}. {name}</Text>)}
  </View>}
  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
   <Text className="text-teal-300 font-bold">UNIT {item.id} / {AIL101_UNITS.length}</Text>
   <Text className="text-white text-2xl font-bold mt-3">{item.title}</Text>
   <Text className="text-slate-100 leading-7 mt-4">{item.overview}</Text>
   <Text className="text-teal-300 font-bold mt-5">Key concepts</Text>
   {item.concepts.map((concept,i)=><Text key={i} className="text-slate-200 mt-2 leading-6">• {concept}</Text>)}
   <View className="bg-slate-900 border-l-4 border-indigo-500 rounded-xl p-4 mt-5">
    <Text className="text-indigo-300 font-bold">Practice in context</Text>
    <Text className="text-white leading-6 mt-2">{item.application}</Text>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read current AI literacy review aloud"
      onPress={()=>speakText(item.title+". "+item.overview+". "+item.application)}
      className="bg-teal-800 rounded-xl p-3 mt-5">
     <Text className="text-white text-center font-bold">▶ Read aloud</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop text to speech"
      onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mt-2">
     <Text className="text-white text-center">■ Stop reading</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send review to local Text Reader"
      onPress={()=>transfer("/reader")} className="bg-slate-700 rounded-xl p-3 mt-2">
     <Text className="text-white text-center">Open in Text Reader →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send review to offline infographic and explainer studio"
      onPress={()=>transfer("/explainer")} className="bg-indigo-800 rounded-xl p-3 mt-2">
     <Text className="text-white text-center">Create infographic / storyboard →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark AI literacy review as read"
      onPress={()=>markRead(item.id)} className="bg-slate-700 rounded-xl p-3 mt-4">
     <Text className="text-white text-center">{read.includes(item.id)?"✓ Review marked read":"Mark review as read"}</Text>
   </TouchableOpacity>
  </View>
  <View className="bg-slate-800 border border-teal-700 rounded-2xl p-5 mt-5">
   <Text className="text-teal-300 font-bold">FORMATIVE REASONING CHECK</Text>
   <Text className="text-white font-bold text-lg mt-3">{item.question}</Text>
   {options.map((option,i)=><TouchableOpacity key={i} accessibilityRole="radio"
      accessibilityState={{checked:choice===i,disabled:checked}}
      accessibilityLabel={"Option "+(i+1)+": "+option}
      onPress={()=>{if(!checked){setChoice(i);setWarning("");}}}
      className={choice===i?"bg-teal-900 border border-teal-600 rounded-xl p-4 mt-3":"bg-slate-700 rounded-xl p-4 mt-3"}>
     <Text className="text-white">{i+1}. {option}</Text>
   </TouchableOpacity>)}
   {!!warning&&<Text className="text-amber-200 mt-4" accessibilityLiveRegion="polite">{warning}</Text>}
   {checked&&<View className="bg-slate-900 rounded-xl p-4 mt-3">
      <Text className="text-white leading-6">{item.reason}</Text>
      {choice!==ailAnswerIndex(item.id)&&<TouchableOpacity accessibilityRole="button"
       accessibilityLabel="Retry this formative quiz" onPress={()=>{setChoice(null);setChecked(false);setWarning("");}}
       className="bg-teal-800 rounded-xl p-3 mt-3">
       <Text className="text-white text-center">Try again</Text>
      </TouchableOpacity>}
   </View>}
   {!checked&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Check formative answer"
    onPress={submit} className="bg-teal-700 rounded-xl p-4 mt-5">
    <Text className="text-white font-bold text-center">Check my reasoning</Text>
   </TouchableOpacity>}
   {passed.includes(item.id)&&<Text className="text-green-300 mt-4">✓ Formative practice saved locally</Text>}
  </View>
  <View className="flex-row justify-between mt-5">
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous AI literacy unit"
    disabled={item.id===1} onPress={()=>navigate(item.id-1)}
    className="bg-slate-700 rounded-xl p-4" style={{width:"48%",opacity:item.id===1?0.5:1}}>
    <Text className="text-white text-center">← Previous</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next AI literacy unit"
    disabled={item.id===20} onPress={()=>navigate(item.id+1)}
    className="bg-teal-800 rounded-xl p-4" style={{width:"48%",opacity:item.id===20?0.5:1}}>
    <Text className="text-white text-center font-bold">Next →</Text>
   </TouchableOpacity>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset AIL 101 progress with confirmation"
    onPress={()=>Alert.alert("Reset AIL 101 self-study progress?",
    "This clears reading and formative quiz checks for AIL 101 only. It does not affect other Academy subjects.",
    [{text:"Keep progress",style:"cancel"},{text:"Reset only AIL 101",style:"destructive",onPress:reset}])}
    className="p-4 mt-4"><Text className="text-slate-400 text-center">Reset AIL 101 progress</Text></TouchableOpacity>
 </ScrollView>;
}
