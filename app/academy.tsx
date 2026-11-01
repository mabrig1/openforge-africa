import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {useLogicCourseProgress} from "../stores/logicCourseStore";
import {usePsy210Progress} from "../stores/psy210Store";
import {useExpandedCoursesProgress} from "../stores/expandedCoursesStore";
import {useAcademyStudyStore} from "../stores/academyStudyStore";
import {useAil101Progress} from "../stores/ail101Store";
import {useAdditionalAcademyProgress} from "../stores/additionalAcademyStore";
import {useSoulProgress} from "../stores/integratedSoulStore";
import {useClearSightProgress} from "../stores/clearSightStore";
import {useSpeakerProgress} from "../stores/multiChannelSpeakerStore";
import {
 getAcademyDashboard,academyWeeklySessions,localCalendarDay,
 type AcademyCourseId,
} from "../lib/academyDashboard";

export default function AcademyDashboardScreen(){
 const logicRead=useLogicCourseProgress(s=>s.read);
 const logicPassed=useLogicCourseProgress(s=>s.passed);
 const logicSelected=useLogicCourseProgress(s=>s.selected);
 const psyRead=usePsy210Progress(s=>s.read);
 const psyScores=usePsy210Progress(s=>s.scores);
 const psySelected=usePsy210Progress(s=>s.selected);
 const decisionRead=useExpandedCoursesProgress(s=>s.read.decision);
 const decisionPassed=useExpandedCoursesProgress(s=>s.passed.decision);
 const decisionSelected=useExpandedCoursesProgress(s=>s.selected.decision);
 const forgeRead=useExpandedCoursesProgress(s=>s.read.forge);
 const forgePassed=useExpandedCoursesProgress(s=>s.passed.forge);
 const forgeSelected=useExpandedCoursesProgress(s=>s.selected.forge);
 const ailRead=useAil101Progress(s=>s.read);
 const ailPassed=useAil101Progress(s=>s.passed);
 const ailSelected=useAil101Progress(s=>s.selected);
 const rlxRead=useAdditionalAcademyProgress(s=>s.read.rlx101);
 const rlxPassed=useAdditionalAcademyProgress(s=>s.passed.rlx101);
 const rlxSelected=useAdditionalAcademyProgress(s=>s.selected.rlx101);
 const ceaiRead=useAdditionalAcademyProgress(s=>s.read.ceai401);
 const ceaiPassed=useAdditionalAcademyProgress(s=>s.passed.ceai401);
 const ceaiSelected=useAdditionalAcademyProgress(s=>s.selected.ceai401);
 const soulRead=useSoulProgress(s=>s.read);
 const soulPassed=useSoulProgress(s=>s.passed);
 const soulSelected=useSoulProgress(s=>s.selected);
 const clearRead=useClearSightProgress(s=>s.read);
 const clearPassed=useClearSightProgress(s=>s.passed);
 const clearSelected=useClearSightProgress(s=>s.selected);
 const speakerRead=useSpeakerProgress(s=>s.read);
 const speakerPassed=useSpeakerProgress(s=>s.passed);
 const speakerSelected=useSpeakerProgress(s=>s.selected);
 const following=useAcademyStudyStore(s=>s.following);
 const weeklyTarget=useAcademyStudyStore(s=>s.weeklyTarget);
 const sessions=useAcademyStudyStore(s=>s.sessions);
 const toggleCourse=useAcademyStudyStore(s=>s.toggleCourse);
 const setTarget=useAcademyStudyStore(s=>s.setTarget);
 const markSession=useAcademyStudyStore(s=>s.markSession);
 const resetPlan=useAcademyStudyStore(s=>s.resetPlan);
 const dashboard=getAcademyDashboard({
  logicRead,logicPassed,logicSelected,psyRead,psyScores,psySelected,
  decisionRead,decisionPassed,decisionSelected,forgeRead,forgePassed,forgeSelected,
  ailRead,ailPassed,ailSelected,
  rlxRead,rlxPassed,rlxSelected,ceaiRead,ceaiPassed,ceaiSelected,
  soulRead,soulPassed,soulSelected,
  clearRead,clearPassed,clearSelected,
  speakerRead,speakerPassed,speakerSelected,
 });
 const today=localCalendarDay();
 const weekly=academyWeeklySessions(sessions,today);
 const followed=dashboard.courses.filter(c=>following.includes(c.id));
 const nextSteps=followed.filter(c=>c.next.number>0).sort((a,b)=>a.percent-b.percent);
 const todayMarked=(id:AcademyCourseId)=>sessions.some(s=>s.day===today&&s.course===id);
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:90}}>
   <Text className="text-green-400 text-xs font-bold tracking-widest">OPENFORGE AFRICA • ACADEMY</Text>
   <Text className="text-white text-3xl font-extrabold mt-2">My Learning Dashboard</Text>
   <Text className="text-slate-300 leading-6 mt-3">
     Continue your ten independent subjects in one place. Your learning checks,
     study preferences and manually recorded study sessions stay on this device.
   </Text>
   <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
     <Text className="text-amber-100 leading-5">
       Personal self-study record only. This is not institution-approved enrollment,
       a degree, an accredited certificate, verified attendance or a clinical qualification.
       Different courses have different practice rules; the numbers below track review milestones only.
     </Text>
   </View>
   <View className="bg-slate-800 border border-green-700 rounded-2xl p-5 mt-5">
     <Text className="text-green-300 font-bold">TEN-COURSE OVERVIEW</Text>
     <Text className="text-white text-3xl font-extrabold mt-2">
       {dashboard.completed} / {dashboard.total} milestones
     </Text>
     <Text className="text-slate-300 mt-2">
       {dashboard.percent}% of the ten native review tracks · {following.length} followed subject(s)
     </Text>
     <View className="bg-slate-700 rounded-full mt-4 overflow-hidden" style={{height:12}}>
       <View className="bg-green-500 h-3"
         style={{width:(dashboard.percent+"%") as `${number}%`}}/>
     </View>
     <Text className="text-slate-400 text-xs mt-3">
       23 logic chapters + 6 psychology modules + 20 decision-science units + 10 Forge weeks + 20 AI literacy units + 12 Relationalics modules + 7 Computational Ethnobotany chapters + 12 Integrated Soul seminars + 24 Clear Sight reviews + 24 Multi-Channel Speaker reviews. Self-study only, not a cross-subject exam or verified Forge project evidence.
     </Text>
   </View>
   <Text className="text-white text-xl font-bold mt-7 mb-3">Course catalogue</Text>
   {dashboard.courses.map(course=>{
     const isFollowing=following.includes(course.id);
     const isLogic=course.id==="logic";
     return <View key={course.id}
       className={isLogic?
         "bg-slate-800 border border-green-800 rounded-2xl p-5 mb-4":
         "bg-slate-800 border border-teal-700 rounded-2xl p-5 mb-4"}>
       <Text className="text-slate-400 font-bold text-xs">{course.code} • SELF-STUDY COURSE</Text>
       <Text className="text-white text-2xl font-bold mt-2">{course.title}</Text>
       <Text className="text-slate-300 mt-2">{course.completed}/{course.total} milestones complete • {course.percent}%</Text>
       <View className="bg-slate-700 rounded-full overflow-hidden mt-3" style={{height:10}}>
         <View className={isLogic?"bg-green-400 h-3":"bg-teal-400 h-3"}
           style={{width:(course.percent+"%") as `${number}%`}}/>
       </View>
       <Text className="text-slate-300 mt-3">{course.read} reading checks • {course.practised} practice achievements</Text>
       <Text className="text-slate-400 text-sm leading-5 mt-3">{course.notice}</Text>
       <View className="bg-slate-900 border-l-4 border-indigo-500 rounded-xl p-4 mt-4">
         <Text className="text-indigo-300 font-bold">YOUR NEXT LEARNING STEP</Text>
         <Text className="text-white mt-2 font-bold">{course.next.number?
           (course.id==="logic"?"Chapter ":course.id==="psy210"?"Module ":course.id==="decision"||course.id==="ail101"?"Unit ":course.id==="rlx101"?"Module ":course.id==="ceai401"?"Chapter ":course.id==="soul"?"Seminar ":course.id==="clearSight"||course.id==="speaker"?"Review ":"Week ")+course.next.number+": "+course.next.title:
           "All review milestones recorded"}</Text>
         <Text className="text-slate-300 mt-2">{course.next.action} — {course.next.detail}</Text>
       </View>
       <TouchableOpacity accessibilityRole="button"
         accessibilityLabel={"Resume "+course.title}
         onPress={()=>router.push(course.route)}
         className={isLogic?"bg-green-700 rounded-xl p-4 mt-4":"bg-teal-700 rounded-xl p-4 mt-4"}>
         <Text className="text-white text-center font-bold">
           {course.completed===course.total?"Revisit subject →":"Resume subject →"}
         </Text>
       </TouchableOpacity>
       <TouchableOpacity accessibilityRole="button"
         accessibilityLabel={(isFollowing?"Stop following ":"Follow ")+course.title+" in weekly plan"}
         onPress={()=>toggleCourse(course.id)}
         className="bg-slate-700 border border-slate-600 rounded-xl p-3 mt-3">
         <Text className="text-white text-center">
           {isFollowing?"✓ Following · remove from weekly plan":"Add this subject to weekly plan"}
         </Text>
       </TouchableOpacity>
     </View>;
   })}
   <View className="bg-slate-800 border border-indigo-700 rounded-2xl p-5 mt-3">
     <Text className="text-white text-xl font-bold">Personal weekly study rhythm</Text>
     <Text className="text-slate-300 leading-6 mt-2">
       Set a small goal, choose one next action and mark a session only after
       you actually study. These entries are self-reported, not automatically verified.
     </Text>
     <Text className="text-green-300 font-bold mt-4">
       {weekly.count} / {weeklyTarget} sessions recorded this device-calendar week
     </Text>
     <Text className="text-slate-300 mt-2">
       {weekly.activeDays} active study day(s) · Logic {weekly.byCourse.logic} · Psychology {weekly.byCourse.psy210} · Decision {weekly.byCourse.decision} · Forge {weekly.byCourse.forge} · AI Literacy {weekly.byCourse.ail101} · Relationalics {weekly.byCourse.rlx101} · Ethnobotany {weekly.byCourse.ceai401} · Integrated Soul {weekly.byCourse.soul} · Clear Sight {weekly.byCourse.clearSight} · Speaker {weekly.byCourse.speaker}
     </Text>
     <View className="bg-slate-700 rounded-full overflow-hidden mt-3" style={{height:10}}>
       <View className="bg-indigo-400 h-3"
         style={{width:(Math.min(100,Math.round(weekly.count/weeklyTarget*100))+"%") as `${number}%`}}/>
     </View>
     <Text className="text-white font-bold mt-5">Sessions per week (goal)</Text>
     <View className="flex-row flex-wrap mt-3">
       {[2,3,4,5,7].map(n=><TouchableOpacity key={n}
         accessibilityRole="button" accessibilityLabel={"Set weekly study goal to "+n+" sessions"}
         accessibilityState={{selected:weeklyTarget===n}}
         onPress={()=>setTarget(n)} style={{minWidth:48}}
         className={weeklyTarget===n?"bg-green-700 rounded-xl p-3 mr-2 mb-2":"bg-slate-700 rounded-xl p-3 mr-2 mb-2"}>
         <Text className="text-white text-center">{n}</Text>
       </TouchableOpacity>)}
     </View>
     {nextSteps.length===0?
       <Text className="text-slate-300 mt-4">
         {followed.length===0?"Follow at least one subject above to build your study plan.":
         "All followed subjects have completed their local review milestones. Consider instructor-reviewed assignments."}
       </Text>:
       nextSteps.map(course=><View key={course.id} className="bg-slate-900 rounded-xl p-4 mt-4">
         <Text className="text-indigo-300 font-bold">{course.code} • {course.next.action}</Text>
         <Text className="text-white mt-2">{course.next.title}</Text>
         <View className="flex-row justify-between mt-3">
           <TouchableOpacity accessibilityRole="button"
             accessibilityLabel={"Study next section in "+course.title}
             onPress={()=>router.push(course.route)}
             className="bg-indigo-700 rounded-xl p-3" style={{width:"48%"}}>
             <Text className="text-white text-center font-bold">Study now →</Text>
           </TouchableOpacity>
           <TouchableOpacity accessibilityRole="button"
             accessibilityLabel={"Record today's study session for "+course.title}
             disabled={todayMarked(course.id)} onPress={()=>markSession(course.id)}
             className={todayMarked(course.id)?
               "bg-slate-700 border border-slate-600 rounded-xl p-3":
               "bg-green-700 rounded-xl p-3"} style={{width:"48%"}}>
             <Text className="text-white text-center">
               {todayMarked(course.id)?"✓ Recorded today":"Mark session done"}
             </Text>
           </TouchableOpacity>
         </View>
       </View>)}
     <Text className="text-slate-400 text-xs mt-4">
       One optional self-reported study session per subject per device-local day; cannot replace reading checks, quizzes or formal instructor assessments.
     </Text>
   </View>
   <Text className="text-white text-xl font-bold mt-7 mb-3">Applied research & evidence tools</Text>
   <View className="flex-row justify-between">
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open statistics lab from Academy"
       onPress={()=>router.push("/statistics-lab")} className="bg-slate-700 rounded-xl p-3" style={{width:"48%"}}>
       <Text className="text-white text-center font-bold">Statistics Lab →</Text>
     </TouchableOpacity>
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open causal inference lab from Academy"
       onPress={()=>router.push("/causal-lab")} className="bg-slate-700 rounded-xl p-3" style={{width:"48%"}}>
       <Text className="text-white text-center font-bold">Causal Reasoning →</Text>
     </TouchableOpacity>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Forge Studies evidence portfolio studio"
     onPress={()=>router.push("/forge-portfolio")} className="bg-indigo-800 rounded-xl p-4 mt-3">
     <Text className="text-white text-center font-bold">Forge Evidence Portfolio Studio →</Text>
   </TouchableOpacity>
   <Text className="text-white text-xl font-bold mt-7 mb-3">Learning tools</Text>
   <View className="flex-row justify-between">
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open offline Tutor from Academy"
       onPress={()=>router.push("/tutor")} className="bg-indigo-800 rounded-xl p-4"
       style={{width:"48%"}}>
       <Text className="text-white font-bold text-center">Ask the Tutor →</Text>
     </TouchableOpacity>
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Text Reader from Academy"
       onPress={()=>router.push("/reader")} className="bg-slate-700 rounded-xl p-4"
       style={{width:"48%"}}>
       <Text className="text-white font-bold text-center">Text Reader →</Text>
     </TouchableOpacity>
   </View>
   <View className="flex-row justify-between mt-3">
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open multimedia explainer from Academy"
       onPress={()=>router.push("/explainer")} className="bg-slate-700 rounded-xl p-4"
       style={{width:"48%"}}>
       <Text className="text-white font-bold text-center">Explainer Studio →</Text>
     </TouchableOpacity>
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open fictional psychology interview simulator"
       onPress={()=>router.push("/psychology-interview")} className="bg-slate-700 rounded-xl p-4"
       style={{width:"48%"}}>
       <Text className="text-white font-bold text-center">Interview Lab →</Text>
     </TouchableOpacity>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset weekly study plan only"
     onPress={()=>Alert.alert("Reset study plan?",
       "This clears your followed subjects, weekly goal and self-reported study sessions. It does not erase any course reading or quiz record.",
       [{text:"Keep plan",style:"cancel"},{text:"Reset plan",style:"destructive",onPress:resetPlan}])}
     className="p-4 mt-5">
     <Text className="text-slate-400 text-center">Reset weekly study plan (confirmation required)</Text>
   </TouchableOpacity>
  </ScrollView>;
}
