import {useState} from "react";
import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {CAUSAL_TEACHING_SCENARIOS,causalRates} from "../lib/appliedDecisionLabs";
const fmt=(x:number)=>Number(x.toFixed(1)).toLocaleString("en-US");
export default function CausalInferenceLab(){
 const [mode,setMode]=useState<"uneven"|"balanced">("uneven");
 const [details,setDetails]=useState(false);
 const scenario=CAUSAL_TEACHING_SCENARIOS[mode];
 const rates=causalRates(scenario.strata);
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:85}}>
  <Text className="text-green-400 font-bold text-xs">DECISION SCIENCE • UNIT 13 • APPLIED LAB</Text>
  <Text className="text-white text-3xl font-bold mt-2">Causal Inference & Simpson's Paradox</Text>
  <Text className="text-slate-300 leading-6 mt-3">Compare two entirely synthetic datasets. Does a pooled association reverse when you consider pre-existing learner need? Counts are illustrative, not real study results.</Text>
  <View className="bg-slate-800 border border-indigo-700 rounded-xl p-4 mt-5">
   <Text className="text-indigo-300 font-bold">Choose synthetic group composition</Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Load unequal learner selection example"
      onPress={()=>setMode("uneven")} className={mode==="uneven"?"bg-indigo-700 rounded-xl p-3 mt-3":"bg-slate-700 rounded-xl p-3 mt-3"}>
     <Text className="text-white">Uneven enrollment (selection bias)</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Load balanced learner composition example"
      onPress={()=>setMode("balanced")} className={mode==="balanced"?"bg-indigo-700 rounded-xl p-3 mt-3":"bg-slate-700 rounded-xl p-3 mt-3"}>
     <Text className="text-white">Balanced learner composition</Text>
   </TouchableOpacity>
   <Text className="text-slate-300 mt-4">{scenario.description}</Text>
  </View>
  {rates&&<View className="bg-slate-800 border border-teal-700 rounded-xl p-5 mt-5">
    <Text className="text-teal-300 font-bold">Pooled success rates</Text>
    <Text className="text-white text-2xl font-bold mt-2">Support group: {fmt(rates.treatedRate*100)}%</Text>
    <Text className="text-white text-2xl font-bold mt-2">No-support group: {fmt(rates.untreatedRate*100)}%</Text>
    <Text accessibilityLiveRegion="polite" className="text-amber-200 font-bold mt-3">Raw difference: {fmt(rates.pooledDifferencePP)} percentage points</Text>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Toggle within-stratum causal teaching comparisons"
     onPress={()=>setDetails(v=>!v)} className="bg-teal-700 rounded-xl p-4 mt-5">
      <Text className="text-white text-center font-bold">{details?"Hide comparisons":"Reveal need-group comparisons"}</Text>
    </TouchableOpacity>
    {details&&rates.within.map((stratum,i)=><View key={stratum.label} className="bg-slate-900 p-4 mt-3 rounded-xl">
      <Text className="text-teal-200 font-bold">{stratum.label}</Text>
      <Text className="text-slate-200 mt-2">Support: {scenario.strata[i].treated.success}/{scenario.strata[i].treated.n} = {fmt(stratum.treatedRate*100)}%</Text>
      <Text className="text-slate-200 mt-2">No support: {scenario.strata[i].untreated.success}/{scenario.strata[i].untreated.n} = {fmt(stratum.untreatedRate*100)}%</Text>
      <Text className="text-green-300 font-bold mt-2">Within-group association: +{fmt(stratum.differencePP)} pp</Text>
    </View>)}
  </View>}
  <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-5">
    <Text className="text-amber-100 leading-6">Neither dataset alone proves that tutoring CAUSED better outcomes. Stratified associations can still be confounded; randomized assignment, comparable outcomes, well-defined treatment and ethical consent improve causal identification. Changing the composition here is a teaching demonstration, not a randomized experiment.</Text>
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to decision science course from causal inference lab"
    onPress={()=>router.push("/decision-science")} className="bg-slate-700 p-4 rounded-xl mt-5">
    <Text className="text-white text-center">← Decision Science course</Text>
  </TouchableOpacity>
 </ScrollView>;
}
