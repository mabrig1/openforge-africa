import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Alert } from "../lib/platformDialogs";
import {
  LOGIC_COURSE_AUTHOR, LOGIC_COURSE_PARTS, LOGIC_COURSE_TITLE,
  LOGIC_LESSONS, getLogicLesson, logicCourseCompletion,
} from "../lib/logicCourse";
import { useLogicCourseProgress } from "../stores/logicCourseStore";
import { LOGIC_PROGRAM_MODULES, LCT_201_WEEKS, getLogicCreditProposals } from "../lib/logicSyllabus";
import { useCircleStore } from "../stores/circleStore";
import { setStudioDraft } from "../lib/studioDraft";
import { speakText, stopSpeech } from "../lib/speech";

const CIRCLE_ID="logic-critical-thinking-2026";
export default function LogicCourseScreen() {
  const read=useLogicCourseProgress(s=>s.read);
  const passed=useLogicCourseProgress(s=>s.passed);
  const selected=useLogicCourseProgress(s=>s.selected);
  const select=useLogicCourseProgress(s=>s.select);
  const markRead=useLogicCourseProgress(s=>s.markRead);
  const submitAnswer=useLogicCourseProgress(s=>s.submitAnswer);
  const reset=useLogicCourseProgress(s=>s.reset);
  const [choice,setChoice]=useState<number|null>(null);
  const [feedback,setFeedback]=useState("");
  const [showIndex,setShowIndex]=useState(false);
  const [showSyllabus,setShowSyllabus]=useState(false);
  const credits=getLogicCreditProposals();
  const lesson=getLogicLesson(selected)??LOGIC_LESSONS[0];
  const stats=logicCourseCompletion(read,passed);
  const chooseLesson=(id:number)=>{
    stopSpeech();select(id);setChoice(null);setFeedback("");setShowIndex(false);
  };
  const onGrade=()=>{
    if(choice===null){setFeedback("Select a response before checking your understanding.");return;}
    const right=submitAnswer(lesson.id,choice);
    setFeedback(right?"Correct. This chapter practice check is now recorded.":(
      "Not quite. "+lesson.overview+" Review the explanation and attempt the question again."
    ));
  };
  const toReader=()=>{
    setStudioDraft(lesson.title,lesson.overview+"\n\nWorked example: "+lesson.workedExample);
    router.push("/reader");
  };
  const toDiagram=()=>{
    setStudioDraft(lesson.title,lesson.overview+"\n\nWorked example: "+lesson.workedExample);
    router.push("/explainer");
  };
  const addToStudyCircle=()=>{
    const store=useCircleStore.getState();
    if(!store.circles.some(c=>c.id===CIRCLE_ID))store.addCircle({
      id:CIRCLE_ID,name:"Logic and Critical Thinking (Self-study)",
      courseCode:"LCT DEMO",courseTitle:"Mabrig Korie: Logic and Critical Thinking",
      memberCount:1,taskCount:0,lastActivity:"Locally installed",createdAt:Date.now(),
    });
    const id="logic-review-"+String(lesson.id).padStart(2,"0");
    if(!useCircleStore.getState().materials.some(m=>m.id===id)){
      useCircleStore.getState().addMaterial({
        id,circleId:CIRCLE_ID,title:"Chapter "+lesson.id+": "+lesson.title,
        content:lesson.overview+"\n\nWorked case: "+lesson.workedExample+
          "\n\nSource: "+lesson.source+
          "\n\nThis short teaching review is not the full copyrighted manuscript.",
        createdAt:Date.now(),
      });
    }
    router.push({pathname:"/tutor",params:{circleId:CIRCLE_ID}});
  };
  return <ScrollView className="flex-1 bg-slate-900"
    contentContainerStyle={{padding:18,paddingBottom:85}} keyboardShouldPersistTaps="handled">
    <Text className="text-green-400 text-xs font-bold tracking-widest">OPENFORGE ACADEMY • INTERACTIVE COURSE</Text>
    <Text className="text-white text-3xl font-extrabold mt-3">{LOGIC_COURSE_TITLE}</Text>
    <Text className="text-slate-300 mt-2">{LOGIC_COURSE_AUTHOR} • 2026 teaching edition</Text>
    <Text className="text-slate-300 mt-3 leading-6">23 chapters across four parts: foundations, formal logic, applied reasoning, and advanced argumentation. This interactive track offers lesson reviews and self-checks; the companion course kit contains the full author's manuscript.</Text>
    <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
      <Text className="text-amber-100 leading-5">This is independent self-study, not a university enrollment, accredited certificate or an examination grade. Quizzes are formative and answer keys are stored locally.</Text>
    </View>
    <View className="bg-slate-800 border border-green-700 rounded-2xl p-5 mt-5">
      <Text className="text-green-300 font-bold">YOUR PRIVATE PROGRESS</Text>
      <Text className="text-white text-3xl font-extrabold mt-2">{stats.completed} / 23 complete</Text>
      <Text className="text-slate-300 mt-2">{read.length} marked as read • {passed.length} practice checks passed • {stats.percent}% completed</Text>
      <View className="bg-slate-700 rounded-full overflow-hidden mt-4" style={{height:12}}>
        <View className="bg-green-500 h-3" style={{width:(stats.percent+"%") as `${number}%`}}/>
      </View>
      {stats.eligible&&<View className="bg-green-950 border border-green-600 rounded-xl p-4 mt-4">
        <Text className="text-green-300 font-bold">Self-study milestone achieved!</Text>
        <Text className="text-white mt-2">You marked all 23 lessons as read and passed all practice checks. This is not a university award or proof of identity.</Text>
      </View>}
    </View>
    <View className="bg-slate-800 border border-indigo-700 rounded-2xl p-4 mt-5">
      <Text className="text-white font-bold text-xl">Hands-on learning laboratories</Text>
      <Text className="text-slate-300 mt-2">Apply your reasoning skills, not just answer multiple-choice questions.</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open interactive Formal Logic Lab"
        onPress={()=>router.push("/logic-lab")} className="bg-indigo-700 rounded-xl p-4 mt-4">
        <Text className="text-white text-center font-bold">∴ Truth tables & counterexamples →</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Capstone Research Studio"
        onPress={()=>router.push("/capstone")} className="bg-green-800 rounded-xl p-4 mt-3">
        <Text className="text-white text-center font-bold">✎ Capstone writing & evidence studio →</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show 8 course modules and 12-week formal logic syllabus"
      onPress={()=>setShowSyllabus(v=>!v)}
      className="bg-slate-700 border border-slate-500 rounded-xl p-4 mt-5">
      <Text className="text-white font-semibold text-center">{showSyllabus?"Hide programme and syllabus":"View 8-module programme + 12-week Formal Logic I syllabus"}</Text>
    </TouchableOpacity>
    {showSyllabus&&<View className="bg-slate-800 border border-slate-700 rounded-xl p-4 mt-3">
      <Text className="text-white text-xl font-bold">Proposed programme map</Text>
      <Text className="text-slate-300 mt-2">Suggested {credits.core} core credits + {credits.optional} elective credits. Institutional approval has not been granted or implied.</Text>
      {LOGIC_PROGRAM_MODULES.map(m=><View key={m.code} className="border-t border-slate-600 mt-3 pt-3">
        <Text className="text-green-300 font-bold">{m.code} • {m.name}</Text>
        <Text className="text-slate-300 mt-1">{m.tier} • {m.credits} suggested credits • Chapters {m.chapters}</Text>
      </View>)}
      <Text className="text-white text-xl font-bold mt-7">LCT 201: Formal Logic I — 12 weeks</Text>
      <Text className="text-slate-300 mt-2">Assessment framework in the manuscript: three assignments of 10% each, mid-module exam 25%, final exam 45% (total {credits.appliedGradeWeight}%). The app does not administer these graded assessments.</Text>
      {LCT_201_WEEKS.map(w=><View key={w.week} className="bg-slate-700 rounded-xl p-3 mt-3">
        <Text className="text-white font-bold">Week {w.week}: {w.focus}</Text>
        <Text className="text-slate-200 mt-2">{w.task}</Text>
        <Text className="text-green-300 mt-2">{w.assessment}</Text>
      </View>)}
    </View>}
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show all 23 lesson titles"
      onPress={()=>setShowIndex(v=>!v)} className="bg-indigo-800 rounded-xl p-4 mt-5">
      <Text className="text-white text-center font-bold">{showIndex?"Hide course contents":"☰ Browse all 23 lessons"}</Text>
    </TouchableOpacity>
    {showIndex&&<View className="bg-slate-800 rounded-2xl p-3 mt-2">
      {LOGIC_COURSE_PARTS.map((part,p)=><View key={part}>
        <Text className="text-green-400 font-bold mt-4 mb-2">PART {p+1}: {part}</Text>
        {LOGIC_LESSONS.filter(ch=>ch.part===p+1).map(ch=><TouchableOpacity key={ch.id}
          accessibilityRole="button" accessibilityLabel={"Open lesson "+ch.id+": "+ch.title}
          onPress={()=>chooseLesson(ch.id)}
          className="bg-slate-700 border border-slate-600 rounded-lg p-3 mb-2">
          <Text className="text-white">{read.includes(ch.id)&&passed.includes(ch.id)?"✓ ":""}
            {ch.id}. {ch.title}</Text>
        </TouchableOpacity>)}
      </View>)}
    </View>}
    <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
      <Text className="text-green-400 text-sm font-bold">PART {lesson.part} · CHAPTER {lesson.id} OF 23</Text>
      <Text className="text-white text-2xl font-extrabold mt-2">{lesson.title}</Text>
      <Text className="text-slate-200 leading-7 mt-4">{lesson.overview}</Text>
      <View className="bg-slate-900 border-l-4 border-green-500 rounded-xl p-4 mt-5">
        <Text className="text-green-300 font-bold">Worked example</Text>
        <Text className="text-white leading-6 mt-2">{lesson.workedExample}</Text>
      </View>
      <Text className="text-slate-400 text-xs mt-4">Source: {lesson.source}. Review excerpt; consult the full course kit for all worked examples and exercises.</Text>
      <View className="mt-5">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Read course lesson aloud"
          onPress={()=>speakText(lesson.overview+" "+lesson.workedExample)}
          className="bg-green-800 rounded-xl p-3 mb-2">
          <Text className="text-white text-center font-semibold">▶ Read lesson aloud</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop course lesson speech"
          onPress={stopSpeech} className="bg-slate-700 rounded-xl p-3 mb-2">
          <Text className="text-white text-center font-semibold">■ Stop reading</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Make infographic or video from lesson"
          onPress={toDiagram} className="bg-indigo-900 border border-indigo-600 rounded-xl p-3 mb-2">
          <Text className="text-white text-center font-semibold">◈ Make infographic or lesson video</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open lesson in Text Reader"
          onPress={toReader} className="bg-slate-700 rounded-xl p-3 mb-2">
          <Text className="text-white text-center">Open full Text Reader →</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Save lesson to offline study circle and open Tutor"
          onPress={addToStudyCircle} className="border border-green-700 rounded-xl p-3 mb-2">
          <Text className="text-green-300 text-center">Save lesson to offline study circle & open Tutor →</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
      <Text className="text-green-400 font-bold">PRACTICE CHECK {lesson.id} / 23</Text>
      <Text className="text-white text-xl font-semibold mt-2">{lesson.question.stem}</Text>
      {lesson.question.choices.map((o,i)=><TouchableOpacity key={i}
        accessibilityRole="radio" accessibilityLabel={"Answer "+(i+1)+": "+o}
        accessibilityState={{checked:choice===i}} onPress={()=>{setChoice(i);setFeedback("");}}
        className={choice===i?"bg-green-900 border border-green-600 rounded-xl p-4 mt-3":"bg-slate-700 rounded-xl p-4 mt-3"}>
        <Text className="text-white">{i+1}. {o}</Text>
      </TouchableOpacity>)}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Check logic lesson answer"
        onPress={onGrade} className="bg-green-700 rounded-xl p-4 mt-4">
        <Text className="text-white text-center font-bold">Check my answer</Text>
      </TouchableOpacity>
      {!!feedback&&<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-4 leading-6">{feedback}</Text>}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark logic lesson as read"
        onPress={()=>markRead(lesson.id)} className="bg-slate-700 border border-slate-600 rounded-xl p-4 mt-3">
        <Text className="text-white text-center font-bold">{read.includes(lesson.id)?"✓ Lesson marked read":"Mark lesson as read"}</Text>
      </TouchableOpacity>
      <View className="flex-row justify-between mt-5">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous logic lesson"
          disabled={lesson.id===1} onPress={()=>chooseLesson(lesson.id-1)}
          className="bg-slate-700 rounded-xl p-3" style={{width:"48%"}}>
          <Text className="text-white text-center">← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next logic lesson"
          disabled={lesson.id===23} onPress={()=>chooseLesson(lesson.id+1)}
          className="bg-indigo-700 rounded-xl p-3" style={{width:"48%"}}>
          <Text className="text-white text-center">Next lesson →</Text>
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset course progress"
      onPress={()=>Alert.alert("Reset local practice progress?","This clears your reading and quiz history on this device. It does not delete your saved study-circle notes.",[
        {text:"Keep progress",style:"cancel"},{text:"Reset",style:"destructive",onPress:()=>{reset();setChoice(null);setFeedback("");}},
      ])} className="p-4 mt-2">
      <Text className="text-slate-400 text-center text-sm">Reset course progress (confirmation required)</Text>
    </TouchableOpacity>
  </ScrollView>;
}
