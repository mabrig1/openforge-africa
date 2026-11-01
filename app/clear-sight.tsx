import {useEffect,useState} from "react";
import {ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {speakText,stopSpeech} from "../lib/speech";
import {setStudioDraft} from "../lib/studioDraft";
import {useClearSightProgress} from "../stores/clearSightStore";
import {CLEAR_SIGHT_MODULES,CLEAR_SIGHT_UNITS,CLEAR_SIGHT_PRACTICUMS,
 binaryBrierScore,clearSightCorrectIndex,clearSightProgress} from "../lib/clearSightCourse";

export default function ClearSightCourseScreen(){
 const read=useClearSightProgress(s=>s.read),passed=useClearSightProgress(s=>s.passed);
 const selected=useClearSightProgress(s=>s.selected);
 const markRead=useClearSightProgress(s=>s.markRead),passQuiz=useClearSightProgress(s=>s.passQuiz);
 const select=useClearSightProgress(s=>s.select),reset=useClearSightProgress(s=>s.reset);
 const [menu,setMenu]=useState(false),[tools,setTools]=useState(false);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false),[feedback,setFeedback]=useState("");
 const [percent,setPercent]=useState("70"),[event,setEvent]=useState<0|1>(1);
 const [brierError,setBrierError]=useState("");
 const [brier,setBrier]=useState<number|null>(null);
 const item=CLEAR_SIGHT_UNITS.find(x=>x.id===selected)??CLEAR_SIGHT_UNITS[0];
 const progress=clearSightProgress(read,passed);
 const options=[...item.wrong];options.splice(clearSightCorrectIndex(item.id),0,item.correct);
 useEffect(()=>()=>stopSpeech(),[]);
 const navigate=(id:number)=>{
  if(!CLEAR_SIGHT_UNITS.some(x=>x.id===id))return;
  stopSpeech();select(id);setMenu(false);setChoice(null);setChecked(false);setFeedback("");
 };
 const check=()=>{
  if(choice===null){setFeedback("Select an answer before checking.");return;}
  const ok=passQuiz(item.id,choice);
  setChecked(true);setFeedback(ok?"Evidence-based answer. This formative check is saved on your device.":"Review the explanation and try the question again.");
 };
 const doBrier=()=>{
  const raw=percent.trim();
  if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw)){setBrier(null);setBrierError("Enter a number from 0 to 100.");return;}
  const value=Number(raw);
  const score=binaryBrierScore(value/100,event);
  if(score===null){setBrier(null);setBrierError("Enter a probability between 0% and 100%.");return;}
  setBrierError("");setBrier(score);
 };
 const editProbability=(v:string)=>{setPercent(v);setBrier(null);setBrierError("");};
 const sourceTransfer=(route:"/reader"|"/explainer")=>{
  setStudioDraft("Clear Sight • Module "+item.module+": "+item.title,[
   "Clear Sight — Mastering Discernment in an Age of Manipulation, State Failure & Toxic Environments.",
   "Original short source-aligned review, not the full private 100-page manuscript.",
   "Source reading: "+item.source+"; Module "+item.module+": "+CLEAR_SIGHT_MODULES[item.module-1],
   item.overview,"Core checks: "+item.cues.join("; "),
   "Fictional learning exercise: "+item.task,
   "Separate observation from inference. Do not record or upload sensitive private information."
  ].join("\n\n").slice(0,4000));
  router.push(route);
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:90}}>
  <Text className="text-sky-300 text-xs font-bold tracking-widest">OPENFORGE ACADEMY • DISCERNMENT & EVIDENCE</Text>
  <Text className="text-white text-3xl font-extrabold mt-3">Clear Sight</Text>
  <Text className="text-white font-bold mt-2 leading-6">Mastering Discernment in an Age of Manipulation, State Failure & Toxic Environments</Text>
  <Text className="text-slate-300 leading-6 mt-3">
   6 original modules • 24 adapted interactive review lessons • source 12-week route • practical Brier calibration.
  </Text>
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
   <Text className="text-amber-100 leading-6">
    This companion teaches evidence-led judgment, NOT suspicion, diagnosis, psychotherapy,
    legal advice or investigation of any person. Do not confront suspected abusers,
    secretly collect evidence, or disclose private documents or personal histories.
    In danger, prioritize appropriate local professional or emergency support.
    The full 100-page source book is NOT published in this app. Only short original reviews are shown.
    Your unencrypted progress is saved on this device; it is neither a grade nor academic credit.
   </Text>
  </View>
  <View className="bg-slate-800 border border-sky-700 rounded-2xl p-5 mt-5">
   <Text className="text-sky-300 font-bold">SELF-STUDY PROGRESS</Text>
   <Text className="text-white font-extrabold text-3xl mt-2">{progress.completed} / {progress.total}</Text>
   <Text className="text-slate-300 mt-2">{progress.percent}% with a read review and correct formative check</Text>
   <View className="bg-slate-700 rounded-full overflow-hidden mt-3" style={{height:11}}>
    <View className="bg-sky-400 h-3" style={{width:(progress.percent+"%") as `${number}%`}}/>
   </View>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to nine-course Academy dashboard"
   onPress={()=>router.push("/academy")} className="bg-indigo-800 rounded-xl p-4 mt-4">
   <Text className="text-white text-center font-bold">← Nine-course Academy dashboard</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Browse all six Clear Sight modules and twenty-four lesson reviews"
   accessibilityState={{expanded:menu}} onPress={()=>setMenu(!menu)} className="bg-slate-700 rounded-xl p-4 mt-3">
   <Text className="text-white text-center font-bold">{menu?"Hide course index":"Browse 6 modules / 24 reviews"}</Text>
  </TouchableOpacity>
  {menu&&<View className="bg-slate-800 rounded-xl mt-2 p-3">
    {CLEAR_SIGHT_MODULES.map((module,i)=><View key={module}>
     <Text className="text-sky-300 font-bold mt-4 mb-2">MODULE {i+1}: {module}</Text>
     {CLEAR_SIGHT_UNITS.filter(x=>x.module===i+1).map(x=><TouchableOpacity key={x.id}
       accessibilityRole="button" accessibilityLabel={"Open Clear Sight review "+x.id+": "+x.title}
       onPress={()=>navigate(x.id)} className="p-3 border-b border-slate-700">
       <Text className="text-white">{read.includes(x.id)&&passed.includes(x.id)?"✓ ":""}{x.id}. {x.title}</Text>
       <Text className="text-slate-400 text-xs mt-1">Original source {x.source}</Text>
     </TouchableOpacity>)}
    </View>)}
  </View>}
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show Clear Sight practice tools and Brier scoring laboratory"
   accessibilityState={{expanded:tools}} onPress={()=>setTools(!tools)} className="bg-slate-700 rounded-xl p-4 mt-3">
   <Text className="text-white text-center font-bold">{tools?"Hide practice studio":"Open practice studio and calibration lab"}</Text>
  </TouchableOpacity>
  {tools&&<View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mt-2">
   <Text className="text-sky-300 font-bold">SEVEN SOURCE-ALIGNED PRACTICES</Text>
   {CLEAR_SIGHT_PRACTICUMS.map((p,i)=><Text key={p} className="text-slate-200 leading-6 mt-2">{i+1}. {p}</Text>)}
   <Text className="text-white text-xl font-bold mt-5">Binary Brier Score Lab • Synthetic Data</Text>
   <Text className="text-slate-300 leading-6 mt-2">
     Choose a hypothetical chance of an event and whether it happened (1) or not (0).
     The Brier score is (probability minus outcome) squared. Lower scores reflect better probability accuracy
     for this scored case; evaluate many resolved forecasts before judging calibration.
     Never enter forecasts about real people, private medical matters or threats.
   </Text>
   <Text className="text-sky-200 font-bold mt-4">Predicted chance (0–100%)</Text>
   <TextInput accessibilityLabel="Synthetic forecast percentage" keyboardType="decimal-pad"
     value={percent} onChangeText={editProbability} placeholder="70"
     placeholderTextColor="#94a3b8" className="bg-slate-900 text-white rounded-xl p-4 mt-2 border border-slate-600"/>
   <View className="flex-row gap-2 mt-4">
    {[0,1].map(n=><TouchableOpacity key={n} accessibilityRole="radio"
      accessibilityLabel={n===1?"Synthetic event occurred":"Synthetic event did not occur"}
      accessibilityState={{checked:event===n}}
      onPress={()=>{setEvent(n as 0|1);setBrier(null);setBrierError("");}}
      className={event===n?"bg-sky-800 border border-sky-500 rounded-xl p-3 flex-1":"bg-slate-700 rounded-xl p-3 flex-1"}>
      <Text className="text-white text-center">{n===1?"Occurred (1)":"Did not (0)"}</Text>
    </TouchableOpacity>)}
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Calculate synthetic binary Brier score"
    onPress={doBrier} className="bg-sky-800 rounded-xl p-4 mt-4">
    <Text className="text-white text-center font-bold">Calculate Brier score</Text>
   </TouchableOpacity>
   {!!brierError&&<Text accessibilityLiveRegion="polite" className="text-amber-300 mt-3">{brierError}</Text>}
   {brier!==null&&<View className="bg-slate-900 border border-sky-700 rounded-xl p-4 mt-3">
     <Text accessibilityLiveRegion="polite" className="text-white font-bold">Brier score: {brier.toFixed(4)}</Text>
     <Text className="text-slate-300 mt-2">Squared probability error for this one hypothetical outcome; not a clinical or safety rating.</Text>
   </View>}
   <Text className="text-sky-300 font-bold mt-5">CAPSTONE: PERSONAL CLARITY CHARTER</Text>
   <Text className="text-slate-200 leading-6 mt-2">
    Create a private, revisable charter covering source checks, evidence standards, emotional pauses,
    safe boundaries, forecast review and a 90-day update calendar. An in-app check cannot evaluate
    the full capstone or issue an accredited certificate.
   </Text>
  </View>}
  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
   <Text className="text-sky-300 font-bold">MODULE {item.module} • REVIEW {item.id} / {CLEAR_SIGHT_UNITS.length}</Text>
   <Text className="text-white text-2xl font-bold mt-3">{item.title}</Text>
   <Text className="text-slate-400 text-sm mt-2">Source sections {item.source}</Text>
   <Text className="text-slate-100 leading-7 mt-4">{item.overview}</Text>
   <Text className="text-sky-300 font-bold mt-5">Three discernment checks</Text>
   {item.cues.map((c,i)=><Text key={i} className="text-slate-200 mt-2 leading-6">• {c}</Text>)}
   <View className="bg-slate-900 border-l-4 border-sky-500 rounded-xl p-4 mt-5">
    <Text className="text-sky-300 font-bold">Fictional case and field exercise</Text>
    <Text className="text-white mt-2 leading-6">{item.task}</Text>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read Clear Sight review aloud"
    onPress={()=>speakText(item.title+". "+item.overview+". "+item.task)}
    className="bg-sky-800 rounded-xl p-3 mt-5">
    <Text className="text-white text-center font-bold">▶ Read review aloud</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop reading Clear Sight review"
    onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">■ Stop reading</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send short Clear Sight review to Text Reader"
    onPress={()=>sourceTransfer("/reader")} className="bg-slate-700 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">Open in Text Reader →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send short Clear Sight review to offline Explainer"
    onPress={()=>sourceTransfer("/explainer")} className="bg-indigo-800 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">Create offline infographic / storyboard →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark Clear Sight review as read"
    onPress={()=>markRead(item.id)} className="bg-slate-700 rounded-xl p-3 mt-4">
    <Text className="text-white text-center">{read.includes(item.id)?"✓ Reading marked reviewed":"Mark review as read"}</Text>
   </TouchableOpacity>
  </View>
  <View className="bg-slate-800 border border-sky-700 rounded-2xl p-5 mt-5">
   <Text className="text-sky-300 font-bold">FORMATIVE EVIDENCE CHECK • NOT A GRADE</Text>
   <Text className="text-white font-bold text-lg mt-3">{item.question}</Text>
   {options.map((answer,i)=><TouchableOpacity key={i} accessibilityRole="radio"
    accessibilityLabel={"Clear Sight answer "+(i+1)+": "+answer}
    accessibilityState={{checked:choice===i,disabled:checked}}
    onPress={()=>{if(!checked){setChoice(i);setFeedback("");}}}
    className={choice===i?"bg-sky-950 border border-sky-600 rounded-xl p-4 mt-3":"bg-slate-700 rounded-xl p-4 mt-3"}>
    <Text className="text-white">{i+1}. {answer}</Text>
   </TouchableOpacity>)}
   {!!feedback&&<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-4">{feedback}</Text>}
   {checked&&<View className="bg-slate-900 rounded-xl p-4 mt-3">
     <Text className="text-white leading-6">{item.reason}</Text>
     {choice!==clearSightCorrectIndex(item.id)&&<TouchableOpacity accessibilityRole="button"
      accessibilityLabel="Retry Clear Sight formative question"
      onPress={()=>{setChoice(null);setChecked(false);setFeedback("");}}
      className="bg-sky-800 rounded-xl p-3 mt-3">
      <Text className="text-white text-center">Try again</Text>
     </TouchableOpacity>}
   </View>}
   {!checked&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Check Clear Sight formative answer"
    onPress={check} className="bg-sky-700 rounded-xl p-4 mt-5">
    <Text className="text-white text-center font-bold">Check my reasoning</Text>
   </TouchableOpacity>}
   {passed.includes(item.id)&&<Text className="text-green-300 mt-4">✓ Formative review check stored locally</Text>}
  </View>
  <View className="flex-row justify-between mt-5">
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous Clear Sight review"
    disabled={item.id===1} onPress={()=>navigate(item.id-1)} style={{width:"48%",opacity:item.id===1?0.5:1}}
    className="bg-slate-700 rounded-xl p-4"><Text className="text-white text-center">← Previous</Text></TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next Clear Sight review"
    disabled={item.id===24} onPress={()=>navigate(item.id+1)} style={{width:"48%",opacity:item.id===24?0.5:1}}
    className="bg-sky-800 rounded-xl p-4"><Text className="text-white text-center font-bold">Next →</Text></TouchableOpacity>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset Clear Sight progress with confirmation"
    onPress={()=>Alert.alert("Reset Clear Sight self-study progress?",
      "Only Clear Sight reading and formative quiz records will be cleared. Other Academy subjects are unaffected.",
      [{text:"Keep",style:"cancel"},{text:"Reset Clear Sight",style:"destructive",onPress:reset}])}
    className="p-4 mt-4"><Text className="text-slate-400 text-center">Reset Clear Sight learning progress</Text>
  </TouchableOpacity>
 </ScrollView>;
}