import {useEffect,useState} from "react";
import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {speakText,stopSpeech} from "../lib/speech";
import {setStudioDraft} from "../lib/studioDraft";
import {useSpeakerProgress} from "../stores/multiChannelSpeakerStore";
import {SPEAKER_LAYERS,SPEAKER_WEEKS,SPEAKER_UNITS,SPEAKER_CAPSTONE,
 speakerCorrectIndex,speakerCompletion,BEACON_SYNTHETIC,beaconFollowUpRate} from "../lib/multiChannelSpeakerCourse";

export default function MultiChannelSpeakerCourse(){
 const read=useSpeakerProgress(s=>s.read),passed=useSpeakerProgress(s=>s.passed);
 const selected=useSpeakerProgress(s=>s.selected),markRead=useSpeakerProgress(s=>s.markRead);
 const passQuiz=useSpeakerProgress(s=>s.passQuiz),select=useSpeakerProgress(s=>s.select);
 const reset=useSpeakerProgress(s=>s.reset);
 const [indexOpen,setIndexOpen]=useState(false),[capstoneOpen,setCapstoneOpen]=useState(false);
 const [answer,setAnswer]=useState<number|null>(null),[checked,setChecked]=useState(false);
 const [message,setMessage]=useState("");
 const lesson=SPEAKER_UNITS.find(x=>x.id===selected)??SPEAKER_UNITS[0];
 const progress=speakerCompletion(read,passed);
 const choices=[...lesson.wrong];choices.splice(speakerCorrectIndex(lesson.id),0,lesson.correct);
 useEffect(()=>()=>stopSpeech(),[]);
 const go=(n:number)=>{
  if(!SPEAKER_UNITS.some(x=>x.id===n))return;
  stopSpeech();select(n);setAnswer(null);setChecked(false);setMessage("");setIndexOpen(false);
 };
 const quiz=()=>{
  if(answer===null){setMessage("Select a response to check.");return;}
  const ok=passQuiz(lesson.id,answer);setChecked(true);
  setMessage(ok?"Correct. Independent practice progress saved on this device.":"Study the explanation, then retry.");
 };
 const transfer=(route:"/reader"|"/explainer")=>{
  setStudioDraft("The Multi-Channel Speaker • W"+lesson.week+": "+lesson.title,[
   "Short owner-authorized educational companion, not the private 100-page source manuscript.",
   "Mabrig Korie (2026), The Multi-Channel Speaker. Source workbook pages "+lesson.sourcePages+".",
   "Week "+lesson.week+": "+SPEAKER_WEEKS[lesson.week-1],lesson.overview,
   "Fictional/consented exercise: "+lesson.exercise,
   "Use accurate facts, accessible presentation and permission for any real recordings."
  ].join("\n\n"));
  router.push(route);
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:110}}>
  <Text className="text-sky-300 text-xs font-bold tracking-widest">OPENFORGE ACADEMY • PROFESSIONAL COMMUNICATION</Text>
  <Text className="text-white text-3xl font-extrabold mt-2">The Multi-Channel Speaker</Text>
  <Text className="text-white font-bold text-lg mt-2">Command the Room. Capture the Screen. Move the Needle.</Text>
  <Text className="text-slate-300 leading-6 mt-3">
   Eight weeks • 24 source-aligned original reviews • 16 live workshop hours and 8 async lab hours • four learning layers.
  </Text>
  <View className="bg-amber-950 border border-amber-600 rounded-xl p-4 mt-5">
   <Text className="text-amber-100 leading-6">
    Private 100-page textbook NOT included here. These are short independent reviews, not
    complete live workshops, graded presentation submissions or an accredited certificate.
    Examples and Project Beacon figures are hypothetical; do not represent them as real
    research. Obtain consent before recording anyone and never upload confidential
    videos or private briefings into an unapproved service. Local progress is unencrypted.
   </Text>
  </View>
  <View className="bg-slate-800 border border-sky-700 rounded-2xl p-5 mt-5">
   <Text className="text-sky-300 font-bold">READING + FORMATIVE CHECK PROGRESS</Text>
   <Text className="text-white text-3xl font-extrabold mt-2">{progress.completed} / {progress.total}</Text>
   <Text className="text-slate-300 mt-1">{progress.percent}% independently reviewed</Text>
   <View className="bg-slate-700 h-3 rounded-full overflow-hidden mt-3">
    <View className="bg-sky-400 h-3" style={{width:(progress.percent+"%") as `${number}%`}}/>
   </View>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to OpenForge Academy catalogue"
   onPress={()=>router.push("/academy")} className="bg-indigo-800 rounded-xl p-4 mt-4">
   <Text className="text-white font-bold text-center">← Academy dashboard</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Browse all eight weeks and twenty-four reviews"
   accessibilityState={{expanded:indexOpen}} onPress={()=>setIndexOpen(!indexOpen)}
   className="bg-slate-700 rounded-xl p-4 mt-3">
   <Text className="text-white font-bold text-center">{indexOpen?"Hide all reviews":"Browse 8 weeks / 24 reviews"}</Text>
  </TouchableOpacity>
  {indexOpen&&<View className="bg-slate-800 rounded-xl p-4 mt-2">
   {SPEAKER_WEEKS.map((name,w)=><View key={name}>
    <Text className="text-sky-300 font-bold mt-4">WEEK {w+1} • {SPEAKER_LAYERS[Math.floor(w/2)]}</Text>
    <Text className="text-white mt-1 mb-2">{name}</Text>
    {SPEAKER_UNITS.filter(x=>x.week===w+1).map(x=><TouchableOpacity key={x.id}
      accessibilityRole="button" accessibilityLabel={"Open Speaker review "+x.id+": "+x.title}
      onPress={()=>go(x.id)} className="border-b border-slate-700 p-3">
      <Text className="text-white">{read.includes(x.id)&&passed.includes(x.id)?"✓ ":""}{x.id}. {x.title}</Text>
      <Text className="text-slate-400 text-xs mt-1">{x.stage} • Book pp. {x.sourcePages}</Text>
    </TouchableOpacity>)}
   </View>)}
  </View>}
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="View Multi-Channel Speaker course showcase and synthetic case"
   accessibilityState={{expanded:capstoneOpen}} onPress={()=>setCapstoneOpen(!capstoneOpen)}
   className="bg-slate-700 rounded-xl p-4 mt-3">
   <Text className="text-white font-bold text-center">{capstoneOpen?"Hide capstone":"View capstone + Project Beacon practice"}</Text>
  </TouchableOpacity>
  {capstoneOpen&&<View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-3">
   <Text className="text-sky-300 font-bold">SYNTHETIC PROJECT BEACON CASE</Text>
   <Text className="text-slate-200 leading-6 mt-2">
    Hypothetical enrolled learners: {BEACON_SYNTHETIC.enrolled}. Hypothetical follow-up returns:
    {" "}{BEACON_SYNTHETIC.returned}. Descriptive return rate: {(100*beaconFollowUpRate()).toFixed(0)}%.
    Proposed test-only budget: ₦{BEACON_SYNTHETIC.pilotBudgetNGN.toLocaleString("en-NG")}.
    None of these figures establish real project results or intervention effectiveness.
   </Text>
   <Text className="text-sky-300 font-bold mt-5">ONE DEFENSIBLE INITIATIVE • THREE CHANNELS</Text>
   {Object.entries(SPEAKER_CAPSTONE).map(([key,value],i)=>
    <Text key={key} className="text-slate-200 leading-6 mt-2">{i+1}. {value}</Text>)}
   <Text className="text-slate-300 leading-6 mt-4">
    Portfolio: eight dated weekly drafts, clear source provenance, consent for recordings,
    a revision log, captions or transcripts, peer feedback and human-observed showcase
    review. The app cannot automatically score real-world audience comprehension.
   </Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open existing local Text Reader for rehearsals"
    onPress={()=>transfer("/reader")} className="bg-teal-800 rounded-xl p-3 mt-4">
    <Text className="text-white text-center font-bold">Send review to Text Reader →</Text>
   </TouchableOpacity>
  </View>}
  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
   <Text className="text-sky-300 font-bold">WEEK {lesson.week} / 8 • {lesson.stage} • REVIEW {lesson.id}/24</Text>
   <Text className="text-white text-2xl font-bold mt-3">{lesson.title}</Text>
   <Text className="text-slate-400 mt-2">Book source pages {lesson.sourcePages}</Text>
   <Text className="text-slate-100 leading-7 mt-4">{lesson.overview}</Text>
   <View className="bg-slate-900 border-l-4 border-sky-500 rounded-xl p-4 mt-5">
    <Text className="text-sky-300 font-bold">Fictional case / consent-aware drill</Text>
    <Text className="text-white leading-6 mt-2">{lesson.exercise}</Text>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read Speaker review aloud"
    onPress={()=>speakText(lesson.title+". "+lesson.overview+". "+lesson.exercise)}
    className="bg-sky-800 rounded-xl p-3 mt-5">
    <Text className="text-white font-bold text-center">▶ Read review aloud</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop reading Speaker review"
    onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">■ Stop reading</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send Speaker review to Text Reader"
    onPress={()=>transfer("/reader")} className="bg-slate-700 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">Open in Text Reader →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send Speaker review to offline Explainer"
    onPress={()=>transfer("/explainer")} className="bg-indigo-800 rounded-xl p-3 mt-2">
    <Text className="text-white text-center">Create infographic / storyboard →</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark Speaker review as read"
    onPress={()=>markRead(lesson.id)} className="bg-slate-700 rounded-xl p-3 mt-4">
    <Text className="text-white text-center">{read.includes(lesson.id)?"✓ Review marked read":"Mark review as read"}</Text>
   </TouchableOpacity>
  </View>
  <View className="bg-slate-800 border border-sky-700 rounded-2xl p-5 mt-5">
   <Text className="text-sky-300 font-bold">FORMATIVE PRACTICE • NOT A GRADED PRESENTATION</Text>
   <Text className="text-white font-bold text-lg mt-3">{lesson.question}</Text>
   {choices.map((option,i)=><TouchableOpacity key={i} accessibilityRole="radio"
    accessibilityLabel={"Speaker answer "+(i+1)+": "+option}
    accessibilityState={{checked:answer===i,disabled:checked}}
    onPress={()=>{if(!checked){setAnswer(i);setMessage("");}}}
    className={answer===i?"bg-sky-950 border border-sky-600 rounded-xl p-4 mt-3":"bg-slate-700 rounded-xl p-4 mt-3"}>
    <Text className="text-white">{i+1}. {option}</Text>
   </TouchableOpacity>)}
   {!!message&&<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-4">{message}</Text>}
   {checked&&<View className="bg-slate-900 rounded-xl p-4 mt-3">
    <Text className="text-white leading-6">{lesson.reason}</Text>
    {answer!==speakerCorrectIndex(lesson.id)&&<TouchableOpacity accessibilityRole="button"
     accessibilityLabel="Retry Speaker formative quiz" onPress={()=>{setAnswer(null);setChecked(false);setMessage("");}}
     className="bg-sky-800 rounded-xl p-3 mt-3"><Text className="text-white text-center">Try again</Text></TouchableOpacity>}
   </View>}
   {!checked&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Check Speaker formative answer"
    onPress={quiz} className="bg-sky-700 rounded-xl p-4 mt-5">
    <Text className="text-white text-center font-bold">Check my reasoning</Text>
   </TouchableOpacity>}
   {passed.includes(lesson.id)&&<Text className="text-green-300 mt-4">✓ Practice recorded locally</Text>}
  </View>
  <View className="flex-row justify-between mt-5">
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous Speaker review"
    disabled={lesson.id===1} onPress={()=>go(lesson.id-1)}
    style={{width:"48%",opacity:lesson.id===1?0.5:1}}
    className="bg-slate-700 rounded-xl p-4"><Text className="text-white text-center">← Previous</Text></TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next Speaker review"
    disabled={lesson.id===24} onPress={()=>go(lesson.id+1)}
    style={{width:"48%",opacity:lesson.id===24?0.5:1}}
    className="bg-sky-800 rounded-xl p-4"><Text className="text-white text-center">Next →</Text></TouchableOpacity>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset Speaker course progress with confirmation"
   onPress={()=>Alert.alert("Reset Speaker progress?","Only this course's local reading and quiz practice will be cleared.",
    [{text:"Keep progress",style:"cancel"},{text:"Reset this course",style:"destructive",onPress:reset}])}
   className="p-4 mt-4"><Text className="text-slate-400 text-center">Reset Speaker practice progress</Text>
  </TouchableOpacity>
 </ScrollView>;
}