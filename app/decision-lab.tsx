import {useState} from "react";
import {ScrollView,Text,TouchableOpacity,View,TextInput} from "react-native";
import {router} from "expo-router";
import {bayesPositivePosterior,expectedValue} from "../lib/decisionCalculators";
function Numeric({name,value,set}:{name:string,value:string,set:(v:string)=>void}){
 return <View className="mt-3">
  <Text className="text-slate-200 mb-2 font-bold">{name}</Text>
  <TextInput accessibilityLabel={name} value={value} onChangeText={set} keyboardType="decimal-pad"
    maxLength={15} className="bg-slate-900 border border-slate-600 rounded-xl p-4 text-white"/>
 </View>;
}
const fmt=(x:number)=>Number(x.toFixed(2)).toLocaleString("en-US");
function number(s:string,min:number,max:number):number|null {
 if(!/^\s*(?:\d+(?:\.\d*)?|\.\d+)\s*$/.test(s))return null;
 const x=Number(s);return Number.isFinite(x)&&x>=min&&x<=max?x:null;
}
export default function DecisionScienceLab(){
 const [base,setBase]=useState("1"),[sens,setSens]=useState("95"),[fpr,setFpr]=useState("5");
 const [prob,setProb]=useState("30"),[gain,setGain]=useState("100"),[sure,setSure]=useState("40");
 const p=number(base,0,100),s=number(sens,0,100),f=number(fpr,0,100);
 const posterior=p!==null&&s!==null&&f!==null?bayesPositivePosterior(p/100,s/100,f/100):null;
 const pp=number(prob,0,100),gg=number(gain,0,100000000),ss=number(sure,0,100000000);
 const ev=pp!==null&&gg!==null?expectedValue(pp/100,gg):null;
 return <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{padding:18,paddingBottom:90}}
  keyboardShouldPersistTaps="handled">
  <Text className="text-green-400 font-bold text-xs">MABRIG KORIE • DECISION SCIENCE LAB</Text>
  <Text className="text-white text-3xl font-extrabold mt-2">Probability & Choice</Text>
  <Text className="text-slate-300 leading-6 mt-3">Two real, offline computations based on Units 10, 11 and 16 of the supplied 100-page teaching edition. Numbers are fictional and for learning only.</Text>
  <View className="bg-slate-800 border border-teal-700 rounded-xl p-5 mt-5">
   <Text className="text-teal-300 font-bold text-xl">1. Bayes and the base-rate effect</Text>
   <Text className="text-slate-200 leading-6 mt-2">What is P(condition | positive) given prevalence, sensitivity and false-positive probability?</Text>
   <Numeric name="Prevalence (%)" value={base} set={setBase}/>
   <Numeric name="Sensitivity — P(positive | condition) (%)" value={sens} set={setSens}/>
   <Numeric name="False-positive rate — P(positive | no condition) (%)" value={fpr} set={setFpr}/>
   {posterior===null?<Text accessibilityLiveRegion="polite" className="text-amber-200 mt-4">Enter percentages from 0 to 100. If no positive results can occur, the posterior is undefined.</Text>:
   <View className="bg-slate-900 rounded-xl p-4 mt-4">
    <Text className="text-teal-200 font-bold">P(condition | positive)</Text>
    <Text accessibilityLiveRegion="polite" className="text-white text-3xl font-bold mt-1">{fmt(100*posterior)}%</Text>
    <Text className="text-slate-300 mt-2 leading-5">Illustrative only. A positive test does not prove a condition; this is a probability calculation, not medical advice.</Text>
   </View>}
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Set Bayes example with ten percent prevalence"
     onPress={()=>{setBase("10");setSens("95");setFpr("5");}} className="bg-slate-700 rounded-xl p-3 mt-4">
     <Text className="text-white text-center">Compare with 10% prevalence</Text>
   </TouchableOpacity>
  </View>
  <View className="bg-slate-800 border border-indigo-700 rounded-xl p-5 mt-5">
   <Text className="text-indigo-300 font-bold text-xl">2. Expected monetary value</Text>
   <Text className="text-slate-200 leading-6 mt-2">Compare a gamble yielding your chosen payoff with probability p (otherwise zero) to a sure alternative.</Text>
   <Numeric name="Chance of payoff (%)" value={prob} set={setProb}/>
   <Numeric name="Payoff if successful (illustrative units)" value={gain} set={setGain}/>
   <Numeric name="Certain alternative value (same units)" value={sure} set={setSure}/>
   {(ev===null||ss===null)?<Text className="text-amber-200 mt-4">Use a probability from 0 to 100 and nonnegative payoff values up to 100 million.</Text>:
   <View className="bg-slate-900 rounded-xl p-4 mt-4">
     <Text className="text-indigo-200 font-bold">Expected value of gamble</Text>
     <Text accessibilityLiveRegion="polite" className="text-white font-bold text-3xl mt-1">{fmt(ev)} units</Text>
     <Text className="text-slate-300 mt-3">Sure alternative: {fmt(ss)} units.</Text>
     <Text className="text-teal-200 mt-2 font-bold">{ev>ss?"Higher expected monetary value: Gamble":ev<ss?"Higher expected monetary value: Certain alternative":"Equal expected monetary values"}</Text>
     <Text className="text-slate-300 leading-5 mt-3">Expected money does not alone settle risk preference, opportunity costs, fairness, or ethical consequences.</Text>
   </View>}
  </View>
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to Human Intelligence course"
    onPress={()=>router.push("/decision-science")} className="bg-indigo-800 rounded-xl p-4 mt-5">
    <Text className="text-white text-center font-bold">← Return to Decision Science course</Text>
  </TouchableOpacity>
 </ScrollView>;
}
