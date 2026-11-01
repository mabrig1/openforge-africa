import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {verifyClassroom} from "../lib/classroomVerification";
import {CLASSROOM_AGENTS} from "../lib/openMaicClassroom";
import {useClassroomStore} from "../stores/classroomStore";

export default function ClassroomVerificationScreen(){
 const result=verifyClassroom();
 const logs=useClassroomStore(s=>s.logs);
 return <ScrollView className="flex-1 bg-slate-900"
  contentContainerStyle={{padding:18,paddingBottom:80}}>
  <Text className="text-green-400 text-xs font-bold">OPENFORGE AFRICA • REPRODUCIBILITY LAB</Text>
  <Text className="text-white text-3xl font-extrabold mt-2">Classroom Verification</Text>
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
   <Text className="text-amber-100 leading-6">
    This is an on-device deterministic self-test. Its percentages are NOT real student
    results, live LLM dispatch accuracy, third-party certification, independent auditing,
    a deployed OpenMAIC instance, or a verified world record.
   </Text>
  </View>
  <View className="bg-slate-800 border border-green-700 rounded-xl p-5 mt-5">
   <Text className="text-green-300 font-bold">{result.passed?"SYNTHETIC CHECKS PASS":"SYNTHETIC CHECKS NEED REVIEW"}</Text>
   <Text className="text-white text-xl font-bold mt-3">
    {result.agentCount} local roles · {result.courseCount} linked courses · {result.courseReviewCount} short study reviews
   </Text>
   <Text className="text-slate-300 mt-3">Teacher-first on synthetic questions: {Math.round(result.teacherFirstRate*100)}%</Text>
   <Text className="text-slate-300 mt-2">Unanswered questions kept open: {Math.round(result.questionUnresolvedOpenRate*100)}%</Text>
   <Text className="text-slate-300 mt-2">Roles with an executable local turn: {Math.round(result.roleDispatchRate*100)}%</Text>
   <Text className="text-amber-200 mt-3">Generative model-driven classroom agents in this free preview: 0.</Text>
  </View>
  <Text className="text-white text-xl font-bold mt-7">Agent roster (public source manifest)</Text>
  {CLASSROOM_AGENTS.map(a=><View key={a.id} className="bg-slate-800 rounded-xl p-3 mt-2">
    <Text className="text-white font-semibold">{a.name} · {a.role}</Text>
    <Text className="text-slate-400 text-xs mt-1" selectable>{a.id} · priority {a.priority}</Text>
    <Text className="text-slate-300 text-xs mt-2">{a.persona}</Text>
   </View>)}
  <Text className="text-white text-xl font-bold mt-7">Deterministic test cases</Text>
  {result.probes.map(c=><View key={c.id} className="bg-slate-800 p-4 rounded-xl mt-2">
   <Text className={c.passed?"text-green-300 font-bold":"text-amber-200 font-bold"}>{c.passed?"PASS":"FAIL"} · {c.id}</Text>
   <Text className="text-slate-300 mt-2">{c.detail}</Text>
  </View>)}
  <Text className="text-white text-xl font-bold mt-7">Synthetic scheduling trace</Text>
  {result.trace.map(t=><Text key={t.round} selectable className="text-slate-300 mt-2">
   Round {t.round} → {t.agentId} ({t.reason})
  </Text>)}
  <View className="bg-slate-800 p-4 rounded-xl mt-6">
   <Text className="text-white font-bold">This device: {logs.length} recorded preview dispatch(es)</Text>
   {logs.slice(0,10).map(l=><Text key={l.id} selectable className="text-slate-300 text-xs mt-2">
    {l.day} · {l.mode} · {l.agents.join(" → ")} · evidence {l.sourceMatched?"matched":"not matched"}
   </Text>)}
   {!logs.length&&<Text className="text-slate-300 mt-2">No local classroom runs have been recorded on this device.</Text>}
   <Text className="text-slate-400 text-xs mt-4">
    These local traces are not centrally collected or publicly published. No learner questions,
    user identifiers, personal notes, credentials or paid provider data are exported.
   </Text>
  </View>
  <View className="bg-slate-800 p-4 rounded-xl mt-5">
   <Text className="text-white font-bold">Reproduction instructions</Text>
   <Text selectable className="text-slate-300 leading-6 mt-2">
    npm run typecheck{"\n"}npm test{"\n"}npm run check:classroom-roster{"\n"}
    npm run check:classroom-verification{"\n"}npm run check:browser
   </Text>
   <Text className="text-slate-400 text-xs mt-2">
    Production claims require independently checked deployed runtime logs, source licensing,
    authenticated quota enforcement, genuine generative calls and human educational review.
   </Text>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to 15-agent classroom"
   onPress={()=>router.push("/classroom")} className="bg-indigo-700 p-4 rounded-xl mt-6">
   <Text className="text-white text-center font-bold">Back to 15-Agent Classroom →</Text>
  </TouchableOpacity>
 </ScrollView>;
}
