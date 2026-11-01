import {useState} from "react";
import {ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {describeSmallSample} from "../lib/appliedDecisionLabs";
const display=(value:number)=>Number(value.toFixed(3)).toLocaleString("en-US");
export default function StatisticsLab(){
 const [numbers,setNumbers]=useState("4, 5, 5, 6, 7");
 const data=describeSmallSample(numbers);
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:90}}>
  <Text className="text-green-400 font-bold text-xs">DECISION SCIENCE • UNIT 12 • APPLIED LAB</Text>
  <Text className="text-white text-3xl font-extrabold mt-2">Descriptive Statistics Laboratory</Text>
  <Text className="text-slate-300 leading-6 mt-3">Enter between 2 and 25 comma-separated sample observations (each between −1,000,000 and 1,000,000). The lab computes real arithmetic offline. It never claims these are representative of a population.</Text>
  <Text className="text-white font-bold mt-6 mb-2">Sample observations</Text>
  <TextInput accessibilityLabel="Statistics sample observations" value={numbers} onChangeText={setNumbers}
    multiline autoCorrect={false} maxLength={340} placeholder="4, 5, 5, 6, 7"
    placeholderTextColor="#94a3b8" className="bg-slate-800 text-white border border-slate-600 p-4 rounded-xl"
    style={{minHeight:70}}/>
  {data?<View className="bg-slate-800 border border-teal-700 rounded-2xl p-5 mt-5">
    <Text className="text-teal-300 text-lg font-bold">Calculated sample summary</Text>
    {[
     ["Observations",String(data.count)],
     ["Arithmetic mean",display(data.mean)],
     ["Median",display(data.median)],
     ["Minimum",display(data.min)],
     ["Maximum",display(data.max)],
     ["Sample standard deviation (n−1)",display(data.sampleSd)],
    ].map(([label,value])=><View key={label} className="flex-row justify-between border-b border-slate-700 py-3">
      <Text className="text-slate-300" style={{maxWidth:"68%"}}>{label}</Text>
      <Text className="text-white font-bold">{value}</Text>
    </View>)}
    <Text className="text-slate-300 leading-6 mt-4">Notice how the mean reacts to extreme observations. This descriptive summary is not a confidence interval, an effect-size estimate, or evidence of a causal relationship.</Text>
  </View>:<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-5">Enter valid comma-separated numbers. At least two observations are required; no missing values or words.</Text>}
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Load statistics outlier example" onPress={()=>setNumbers("4, 5, 5, 6, 7, 100")}
    className="bg-indigo-700 rounded-xl p-4 mt-5">
    <Text className="text-white text-center font-bold">Add one extreme outlier →</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset statistics sample" onPress={()=>setNumbers("4, 5, 5, 6, 7")}
    className="bg-slate-700 rounded-xl p-4 mt-3">
    <Text className="text-white text-center">Reset initial example</Text>
  </TouchableOpacity>
  <Text className="text-amber-200 text-sm leading-5 mt-5">Learning question: Would a larger sample eliminate selection bias? No. Investigate who was sampled and why some observations are missing.</Text>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to decision science course from statistics lab"
    onPress={()=>router.push("/decision-science")} className="bg-slate-700 rounded-xl p-4 mt-4">
    <Text className="text-white text-center">← Decision Science course</Text>
  </TouchableOpacity>
 </ScrollView>;
}
