import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Alert } from "../lib/platformDialogs";
import { PSY210_MODULES, PSY210_TITLE, PSY210_ATTRIBUTION, getPsyModule, psyProgress } from "../lib/psy210Course";
import { usePsy210Progress } from "../stores/psy210Store";
import { setStudioDraft } from "../lib/studioDraft";
import { speakText, stopSpeech } from "../lib/speech";

/** Low-bandwidth course companion: 6 modules, 12 review questions; full 60-item
 * practice bank and complete reader are in the separately delivered CC BY 4.0 HTML edition.
 * No real patient information, AI-generated clinical responses or public grading.
 */
export default function Psy210CourseScreen() {
 const selected=usePsy210Progress(s=>s.selected);
 const select=usePsy210Progress(s=>s.select);
 const read=usePsy210Progress(s=>s.read);
 const reviewed=usePsy210Progress(s=>s.reviewed);
 const markRead=usePsy210Progress(s=>s.markRead);
 const markQuiz=usePsy210Progress(s=>s.markQuiz);
 const reset=usePsy210Progress(s=>s.reset);
 const [index,setIndex]=useState(0);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [finished,setFinished]=useState(false);
 const module=getPsyModule(selected)??PSY210_MODULES[0];
 const result=psyProgress(read,reviewed);
 const question=module.questions[index];
 const go=(id:number)=>{
   stopSpeech();select(id);setIndex(0);setChoice(null);setChecked(false);setFinished(false);
 };
 const check=()=>{if(choice!==null)setChecked(true);};
 const next=()=>{
   if(!checked)return;
   if(index===module.questions.length-1){
     markQuiz(module.id);setFinished(true);
   }else {setIndex(index+1);setChoice(null);setChecked(false);}
 };
 const studio=()=>{
   setStudioDraft(module.title,module.summary+"\n\nCase example: "+module.example+
     "\n\nStudent activity: "+module.activity);
   router.push("/explainer");
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
   contentContainerStyle={{padding:17,paddingBottom:85}}>
   <Text className="text-green-300 font-bold text-xs tracking-widest">OPENFORGE ACADEMY • PSY 210</Text>
   <Text className="text-white text-3xl font-extrabold mt-3">{PSY210_TITLE}</Text>
   <Text className="text-slate-300 leading-6 mt-2">
     The Human Mind & Behavior in a Tech-Mediated World. Six source-aligned learning
     reviews across 14 weeks, followed by short formative checks and optional
     multimedia explanations.
   </Text>
   <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
     <Text className="text-amber-100 leading-5">
       This is an interactive companion, NOT the complete 23-page course reader
       or the 60-question standalone HTML edition. Those are delivered as a separate
       downloadable course kit. No accredited credit, clinical assessment, therapy,
       or AI inference is offered here. Never enter real patient information.
     </Text>
   </View>
   <View className="bg-slate-800 border border-green-700 rounded-2xl p-4 mt-5">
     <Text className="text-green-300 font-bold">PRIVATE SELF-STUDY PROGRESS</Text>
     <Text className="text-white text-3xl font-extrabold mt-2">{result.done} / 6 modules reviewed</Text>
     <Text className="text-slate-300 mt-2">
       {read.length} reading reviews completed • {reviewed.length} practice checks attempted
     </Text>
     <View className="bg-slate-700 rounded-xl overflow-hidden mt-3" style={{height:10}}>
       <View className="bg-green-500" style={{width:(result.percent+"%") as `${number}%`,height:10}}/>
     </View>
   </View>
   <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mt-5">
     <Text className="text-white text-xl font-bold">Choose a module</Text>
     <Text className="text-slate-400 mt-2">Based on the uploaded PSY 210 course reader's 14-week schedule.</Text>
     {PSY210_MODULES.map(m=><TouchableOpacity key={m.id} accessibilityRole="button"
       accessibilityLabel={"Open PSY 210 module "+m.id+": "+m.title}
       accessibilityState={{selected:m.id===module.id}}
       onPress={()=>go(m.id)}
       className={m.id===module.id?"bg-green-900 border border-green-600 rounded-xl p-3 mt-3":"bg-slate-700 rounded-xl p-3 mt-3"}>
       <Text className="text-white font-bold">{read.includes(m.id)&&reviewed.includes(m.id)?"✓ ":""}
         {m.id}. {m.title}</Text>
       <Text className="text-slate-300 mt-1 text-xs">Weeks {m.weeks} • {m.lessons.length} learning sections</Text>
     </TouchableOpacity>)}
   </View>
   <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
     <Text className="text-green-300 font-bold">MODULE {module.id} • WEEKS {module.weeks}</Text>
     <Text className="text-white text-2xl font-extrabold mt-2">{module.title}</Text>
     <Text className="text-slate-200 leading-7 mt-4">{module.summary}</Text>
     <Text className="text-white font-bold mt-5">Teaching sections</Text>
     {module.lessons.map((lesson,i)=><Text key={i} className="text-slate-300 leading-6 mt-2">• {lesson}</Text>)}
     <View className="bg-slate-900 border-l-4 border-green-600 rounded-xl p-4 mt-5">
       <Text className="text-green-300 font-bold">Applied example</Text>
       <Text className="text-white leading-6 mt-2">{module.example}</Text>
     </View>
     <Text className="text-white font-bold mt-5">Learning activity</Text>
     <Text className="text-slate-300 leading-6 mt-2">{module.activity}</Text>
     <Text className="text-slate-400 mt-5 text-xs">{PSY210_ATTRIBUTION}</Text>
     <View className="mt-5">
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Listen to PSY 210 review"
         onPress={()=>speakText(module.summary+" "+module.example)}
         className="bg-green-800 rounded-xl p-4 mb-2">
         <Text className="text-white font-bold text-center">▶ Read this review aloud</Text>
       </TouchableOpacity>
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop PSY 210 audio playback"
         onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mb-2">
         <Text className="text-white text-center">■ Stop audio</Text>
       </TouchableOpacity>
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create PSY 210 infographic or lesson video"
         onPress={studio} className="bg-indigo-900 border border-indigo-600 rounded-xl p-4 mb-2">
         <Text className="text-white font-bold text-center">Create infographic or lesson video →</Text>
       </TouchableOpacity>
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark PSY 210 module reviewed"
         onPress={()=>markRead(module.id)} className="bg-slate-700 rounded-xl p-4 mb-2">
         <Text className="text-white font-bold text-center">
           {read.includes(module.id)?"✓ Review marked complete":"Mark module review as read"}
         </Text>
       </TouchableOpacity>
     </View>
   </View>
   <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
     <Text className="text-green-300 font-bold">FORMATIVE PRACTICE • {module.id}</Text>
     {finished?<View>
       <Text className="text-white text-xl font-extrabold mt-3">Practice review completed</Text>
       <Text className="text-slate-300 mt-2">
         You attempted both companion review questions. This is not an examination grade.
         The full standalone HTML course provides ten practice questions per module.
       </Text>
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry PSY 210 companion quiz"
         onPress={()=>{setIndex(0);setChoice(null);setChecked(false);setFinished(false);}}
         className="bg-green-700 rounded-xl p-4 mt-4">
         <Text className="text-white text-center font-bold">Try again</Text>
       </TouchableOpacity>
     </View>:<View>
       <Text className="text-white text-xl font-bold mt-3">
         Question {index+1} of {module.questions.length}
       </Text>
       <Text className="text-white leading-6 mt-3">{question.stem}</Text>
       {question.choices.map((text,i)=><TouchableOpacity accessibilityRole="radio"
         accessibilityLabel={"Choice "+(i+1)+": "+text}
         accessibilityState={{checked:choice===i}}
         onPress={()=>{if(!checked)setChoice(i);}}
         key={i}
         className={choice===i?"bg-green-900 border border-green-600 rounded-xl p-3 mt-3":"bg-slate-700 rounded-xl p-3 mt-3"}>
         <Text className="text-white">{i+1}. {text}</Text>
       </TouchableOpacity>)}
       {checked&&<View className="bg-slate-900 rounded-xl p-4 mt-4">
         <Text accessibilityLiveRegion="polite" className="text-green-300 font-bold">
           {choice===question.answer?"Correct":"Review the explanation"}
         </Text>
         <Text className="text-slate-100 mt-2">{question.why}</Text>
         <Text className="text-slate-300 mt-2">Correct response: {question.choices[question.answer]}</Text>
       </View>}
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Check PSY 210 practice answer"
         disabled={choice===null||checked} onPress={check}
         className="bg-green-700 rounded-xl p-4 mt-4">
         <Text className="text-white text-center font-bold">Check answer</Text>
       </TouchableOpacity>
       {checked&&<TouchableOpacity accessibilityRole="button"
         accessibilityLabel="Advance PSY 210 companion quiz" onPress={next}
         className="bg-indigo-800 rounded-xl p-4 mt-3">
         <Text className="text-white text-center font-bold">
           {index===module.questions.length-1?"Finish practice":"Next question →"}
         </Text>
       </TouchableOpacity>}
     </View>}
     <View className="flex-row justify-between mt-5">
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous PSY 210 module"
         disabled={module.id===1} onPress={()=>go(module.id-1)}
         className="bg-slate-700 rounded-xl p-3" style={{width:"48%"}}>
         <Text className="text-white text-center">← Previous</Text>
       </TouchableOpacity>
       <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next PSY 210 module"
         disabled={module.id===6} onPress={()=>go(module.id+1)}
         className="bg-slate-700 rounded-xl p-3" style={{width:"48%"}}>
         <Text className="text-white text-center">Next →</Text>
       </TouchableOpacity>
     </View>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset PSY 210 private progress"
     onPress={()=>Alert.alert("Reset PSY 210 progress?",
       "This clears only this device's PSY 210 reading and practice progress.",[
         {text:"Keep progress",style:"cancel"},
         {text:"Reset",style:"destructive",onPress:()=>{reset();setIndex(0);setChoice(null);setChecked(false);setFinished(false);}},
       ])} className="p-4 mt-3">
     <Text className="text-slate-400 text-center">Reset local course progress</Text>
   </TouchableOpacity>
 </ScrollView>;
}
