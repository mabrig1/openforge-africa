import {useEffect,useState} from "react";
import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {SOUL_LESSONS,SOUL_WEEKS,SOUL_PRACTICUMS,soulCorrectIndex,soulProgress} from "../lib/integratedSoulCourse";
import {useSoulProgress} from "../stores/integratedSoulStore";
import {speakText,stopSpeech} from "../lib/speech";
import {setStudioDraft} from "../lib/studioDraft";

export default function IntegratedSoulCourse(){
 const read=useSoulProgress(s=>s.read),passed=useSoulProgress(s=>s.passed);
 const selected=useSoulProgress(s=>s.selected);
 const markRead=useSoulProgress(s=>s.markRead),passQuiz=useSoulProgress(s=>s.passQuiz);
 const select=useSoulProgress(s=>s.select),reset=useSoulProgress(s=>s.reset);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [menu,setMenu]=useState(false);
 const [outline,setOutline]=useState(false);
 const [warning,setWarning]=useState("");
 const unit=SOUL_LESSONS.find(x=>x.id===selected)??SOUL_LESSONS[0];
 const progress=soulProgress(read,passed);
 const options=[...unit.wrong];options.splice(soulCorrectIndex(unit.id),0,unit.correct);
 useEffect(()=>()=>stopSpeech(),[]);
 const navigate=(id:number)=>{
  if(!SOUL_LESSONS.some(x=>x.id===id))return;
  stopSpeech();select(id);setChoice(null);setChecked(false);setWarning("");setMenu(false);
 };
 const check=()=>{
  if(choice===null){setWarning("Choose an answer first.");return;}
  const ok=passQuiz(unit.id,choice);
  setChecked(true);setWarning(ok?"Supported conclusion. Local formative check saved.":"Review the explanation, then try again.");
 };
 const sendTo=(route:"/reader"|"/explainer")=>{
  setStudioDraft("The Integrated Soul • Week "+unit.week+": "+unit.title,[
   "Short original source-aligned review from a private 6-week course blueprint and its expanded teaching companion.",
   "Philosophy • Psychology • Christian spirituality",
   "Scripture reading: "+unit.scripture,unit.overview,
   "Three inquiry cues: "+unit.concepts.join("; "),
   "Fictional learning exercise: "+unit.exercise,
   "This is not clinical advice, trauma therapy or accredited assessment. Keep private reflections offline."
  ].join("\n\n").slice(0,4000));
  router.push(route);
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:90}}>
  <Text className="text-amber-300 text-xs font-bold tracking-widest">OPENFORGE ACADEMY • FAITH & HUMAN FORMATION</Text>
  <Text className="text-white text-3xl font-extrabold mt-3">The Integrated Soul</Text>
  <Text className="text-white font-bold mt-2">Philosophy, Psychology and Christian Transformation</Text>
  <Text className="text-slate-300 leading-6 mt-3">
   Six-week Christian formation masterclass • twelve expanded A/B seminar reviews • six practical learning exercises.
  </Text>
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
   <Text className="text-amber-100 leading-6">
    Voluntary Christian educational content. NOT psychotherapy, diagnosis, crisis care,
    evidence of spiritual worth, or a substitute for qualified human care. Avoid entering
    personal trauma, diagnoses or private histories; use fictional cases. This is an
    original SHORT learning companion, NOT the private full 64-page expanded book.
    Progress is unencrypted device-local self-study, not verified attainment or academic credit.
   </Text>
  </View>
  <View className="bg-slate-800 border border-amber-700 rounded-2xl p-5 mt-5">
   <Text className="text-amber-300 font-bold">INDEPENDENT LEARNING CHECKS</Text>
   <Text className="text-white text-3xl font-bold mt-2">{progress.completed} / {progress.total}</Text>
   <Text className="text-slate-300 mt-1">{progress.percent}% reviews marked read AND checked correctly</Text>
   <View className="bg-slate-700 rounded-full overflow-hidden mt-3" style={{height:11}}>
    <View className="bg-amber-400 h-3" style={{width:(progress.percent+"%") as `${number}%`}}/>
   </View>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to eight-course Academy dashboard"
   onPress={()=>router.push("/academy")} className="bg-indigo-800 rounded-xl p-4 mt-4">
   <Text className="text-white text-center font-bold">← Eight-course Academy dashboard</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Browse six weeks and twelve seminar reviews"
   accessibilityState={{expanded:menu}} onPress={()=>setMenu(!menu)} className="bg-slate-700 rounded-xl p-4 mt-3">
   <Text className="text-white text-center font-bold">{menu?"Hide all seminars":"Browse six weeks and twelve seminars"}</Text>
  </TouchableOpacity>
  {menu&&<View className="bg-slate-800 rounded-xl mt-2 p-3">
    {SOUL_WEEKS.map((week,i)=><View key={i}>
      <Text className="text-amber-300 font-bold mt-4 mb-2">WEEK {i+1}: {week}</Text>
      {SOUL_LESSONS.filter(x=>x.week===i+1).map(x=><TouchableOpacity key={x.id}
       accessibilityRole="button" accessibilityLabel={"Open Integrated Soul seminar "+x.id+": "+x.title}
       onPress={()=>navigate(x.id)} className="p-3 border-b border-slate-700">
       <Text className="text-white">{read.includes(x.id)&&passed.includes(x.id)?"✓ ":""}{x.id%2===1?"A":"B"} • {x.title}</Text>
      </TouchableOpacity>)}
    </View>)}
  </View>}
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="View source-aligned practical workbook and capstone"
   accessibilityState={{expanded:outline}} onPress={()=>setOutline(!outline)} className="bg-slate-700 rounded-xl p-4 mt-3">
   <Text className="text-white text-center font-bold">{outline?"Hide workbook guide":"View six practicum tools and capstone"}</Text>
  </TouchableOpacity>
  {outline&&<View className="bg-slate-800 rounded-xl p-4 mt-2">
    {SOUL_PRACTICUMS.map((x,i)=><Text key={x} className="text-slate-200 leading-6 mt-2">{i+1}. {x}</Text>)}
    <Text className="text-amber-200 font-bold mt-4">Personal Life Blueprint • facilitator reviewed</Text>
    <Text className="text-slate-200 leading-6 mt-2">
     Source capstone: worldview statement, practical psychological growth plan,
     chosen spiritual practices, consent-aware relational boundaries, integrative
     narrative and 90-day follow-through. The original source favors descriptive
     facilitator feedback, not numeric grades. A fictional/composite submission is valid.
    </Text>
    <Text className="text-slate-400 mt-2">See the private expanded course book for full seminar scripts and printable worksheets.</Text>
  </View>}
  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
    <Text className="text-amber-300 font-bold">WEEK {unit.week} / 6 • SEMINAR {unit.id%2===1?"A":"B"}</Text>
    <Text className="text-white text-2xl font-bold mt-3">{unit.title}</Text>
    <Text className="text-slate-400 text-sm mt-2">Reading: {unit.scripture}</Text>
    <Text className="text-slate-100 leading-7 mt-4">{unit.overview}</Text>
    <Text className="text-amber-300 font-bold mt-5">Three-lens study cues</Text>
    {unit.concepts.map((c,i)=><Text key={i} className="text-slate-200 mt-2 leading-6">• {c}</Text>)}
    <View className="bg-slate-900 border-l-4 border-amber-500 rounded-xl p-4 mt-5">
      <Text className="text-amber-300 font-bold">Fictional case or voluntary reflection</Text>
      <Text className="text-white mt-2 leading-6">{unit.exercise}</Text>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read this learning review aloud"
     onPress={()=>speakText(unit.title+". "+unit.overview+". "+unit.exercise)}
     className="bg-amber-800 rounded-xl p-3 mt-5">
     <Text className="text-white text-center font-bold">▶ Read learning review aloud</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop reading"
     onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mt-2">
     <Text className="text-white text-center">■ Stop reading</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open learning review in Text Reader"
     onPress={()=>sendTo("/reader")} className="bg-slate-700 rounded-xl p-3 mt-2">
     <Text className="text-white text-center">Open in Text Reader →</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create offline infographic from this review"
     onPress={()=>sendTo("/explainer")} className="bg-indigo-800 rounded-xl p-3 mt-2">
     <Text className="text-white text-center">Create infographic / storyboard →</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark Integrated Soul seminar read"
     onPress={()=>markRead(unit.id)} className="bg-slate-700 rounded-xl p-3 mt-4">
     <Text className="text-white text-center">{read.includes(unit.id)?"✓ Reading marked reviewed":"Mark this seminar review as read"}</Text>
    </TouchableOpacity>
  </View>
  <View className="bg-slate-800 border border-amber-700 rounded-2xl p-5 mt-5">
    <Text className="text-amber-300 font-bold">SOURCE-ALIGNED FORMATIVE QUESTION</Text>
    <Text className="text-white text-lg font-bold mt-3">{unit.question}</Text>
    {options.map((answer,i)=><TouchableOpacity key={i} accessibilityRole="radio"
      accessibilityLabel={"Seminar answer "+(i+1)+": "+answer}
      accessibilityState={{checked:choice===i,disabled:checked}}
      onPress={()=>{if(!checked){setChoice(i);setWarning("");}}}
      className={choice===i?"bg-amber-950 border border-amber-600 rounded-xl p-4 mt-3":"bg-slate-700 rounded-xl p-4 mt-3"}>
      <Text className="text-white">{i+1}. {answer}</Text>
    </TouchableOpacity>)}
    {!!warning&&<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-4">{warning}</Text>}
    {checked&&<View className="bg-slate-900 rounded-xl p-4 mt-3">
      <Text className="text-white leading-6">{unit.reason}</Text>
      {choice!==soulCorrectIndex(unit.id)&&<TouchableOpacity accessibilityRole="button"
       accessibilityLabel="Retry this source-aligned learning check" onPress={()=>{setChoice(null);setChecked(false);setWarning("");}}
       className="bg-amber-800 rounded-xl p-3 mt-3">
       <Text className="text-white text-center">Try again</Text>
      </TouchableOpacity>}
    </View>}
    {!checked&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Check Integrated Soul formative response"
     onPress={check} className="bg-amber-700 rounded-xl p-4 mt-5">
     <Text className="text-white font-bold text-center">Check my reasoning</Text>
    </TouchableOpacity>}
    {passed.includes(unit.id)&&<Text className="text-green-300 mt-4">✓ Formative check saved on this device only</Text>}
  </View>
  <View className="flex-row justify-between mt-5">
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous Integrated Soul seminar"
     disabled={unit.id===1} onPress={()=>navigate(unit.id-1)} style={{width:"48%",opacity:unit.id===1?0.5:1}}
     className="bg-slate-700 rounded-xl p-4"><Text className="text-white text-center">← Previous</Text></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next Integrated Soul seminar"
     disabled={unit.id===12} onPress={()=>navigate(unit.id+1)} style={{width:"48%",opacity:unit.id===12?0.5:1}}
     className="bg-amber-800 rounded-xl p-4"><Text className="text-white text-center font-bold">Next →</Text></TouchableOpacity>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset Integrated Soul progress with confirmation"
   onPress={()=>Alert.alert("Reset Integrated Soul self-study?",
    "Only the twelve reading and formative learning records for this course will be cleared.",
    [{text:"Keep",style:"cancel"},{text:"Reset this course",style:"destructive",onPress:reset}])}
   className="p-4 mt-4"><Text className="text-slate-400 text-center">Reset Integrated Soul self-study record</Text>
  </TouchableOpacity>
 </ScrollView>;
}
