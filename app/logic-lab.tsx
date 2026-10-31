import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { analyzeLogic, LOGIC_LAB_EXAMPLES, type LogicAnalysis } from "../lib/formalLogicLab";

export default function FormalLogicScreen() {
  const [premises,setPremises]=useState("P -> Q\nQ");
  const [conclusion,setConclusion]=useState("P");
  const [showRows,setShowRows]=useState(true);
  const [verdict,setVerdict]=useState<"valid"|"invalid"|null>(null);
  const [feedback,setFeedback]=useState("");
  const result=useMemo<{analysis:LogicAnalysis|null;error:string}>(()=>{
    try {return {analysis:analyzeLogic(conclusion,premises.split("\n")),error:""};}
    catch(error){return {analysis:null,error:error instanceof Error?error.message:"Unable to parse the formula."};}
  },[premises,conclusion]);
  const selectExample=(index:number)=>{
    const example=LOGIC_LAB_EXAMPLES[index];
    setPremises(example.premises.join("\n"));setConclusion(example.conclusion);
    setVerdict(null);setFeedback("");setShowRows(true);
  };
  const check=()=>{
    if(!result.analysis||result.analysis.mode!=="argument"||!verdict)return;
    const correct=verdict===(result.analysis.valid?"valid":"invalid");
    setFeedback(correct?"Correct. Compare your reasoning with the valuation table below.":
      "Not yet. Look for a row with all premises true and a false conclusion.");
  };
  return <ScrollView className="flex-1 bg-slate-900"
    keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:18,paddingBottom:75}}>
    <Text className="text-green-400 font-semibold text-xs">OPENFORGE ACADEMY • CHAPTERS 8–11</Text>
    <Text className="text-white text-3xl font-extrabold mt-2">Formal Logic Lab</Text>
    <Text className="text-slate-200 mt-2 leading-6">
      Enter any supported propositional formula or 1–4 premises and conclusion.
      Generate the entire truth table, check deductive validity, and inspect a genuine counterexample.
      This is a local classical-logic calculator, not an AI language model.
    </Text>
    <View className="bg-indigo-950 border border-indigo-700 rounded-xl p-4 mt-4">
      <Text className="text-indigo-100">
        Supported letters: P, Q, R, S. Operators: ~ (not), & (and), | (or), -&gt; (if...then),
        &lt;-&gt; (if and only if). Unicode ¬, ∧, ∨, → and ⇔ work too.
        Use parentheses for clarity. Maximum four variables, four premises and 16 rows.
      </Text>
    </View>
    <Text className="text-white font-bold mt-5 mb-2">Guided demonstrations</Text>
    {LOGIC_LAB_EXAMPLES.map((item,index)=><TouchableOpacity key={item.label}
      accessibilityRole="button" accessibilityLabel={"Load "+item.label+" example"}
      onPress={()=>selectExample(index)} className="bg-slate-800 border border-slate-700 p-3 rounded-xl mb-2">
      <Text className="text-green-300">{item.label} →</Text>
    </TouchableOpacity>)}
    <Text className="text-white font-bold mt-5 mb-2">Premises — optional, one per line</Text>
    <TextInput accessibilityLabel="Logic premises" value={premises} onChangeText={s=>{setPremises(s);setFeedback("");}}
      maxLength={600} multiline textAlignVertical="top" placeholder="P -> Q&#10;P"
      placeholderTextColor="#94a3b8"
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-white" style={{minHeight:110}}/>
    <Text className="text-white font-bold mt-5 mb-2">Formula or conclusion</Text>
    <TextInput accessibilityLabel="Logic conclusion" value={conclusion}
      onChangeText={s=>{setConclusion(s);setFeedback("");}} maxLength={160}
      autoCapitalize="characters" placeholder="Q" placeholderTextColor="#94a3b8"
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"/>
    {!!result.error&&<View className="bg-amber-950 border border-amber-600 rounded-xl p-4 mt-4">
      <Text accessibilityLiveRegion="polite" className="text-amber-200">Check formula: {result.error}</Text>
    </View>}
    {!!result.analysis&&<>
      <View className="bg-green-950 border border-green-600 rounded-xl p-4 mt-5">
        <Text className="text-green-300 font-bold text-sm">MECHANICALLY VERIFIED RESULT</Text>
        <Text accessibilityLiveRegion="polite" className="text-white text-2xl font-bold mt-2">
          {result.analysis.mode==="formula"?result.analysis.classification:
            result.analysis.valid?"VALID ARGUMENT":"INVALID ARGUMENT"}
        </Text>
        <Text className="text-slate-100 leading-6 mt-2">{result.analysis.explanation}</Text>
        {result.analysis.counterexample&&<View className="bg-slate-900 rounded-xl p-3 mt-4">
          <Text className="text-red-300 font-bold">Counterexample assignment</Text>
          <Text className="text-white mt-1">{result.analysis.variables.map(n=>
            n+"="+(result.analysis!.counterexample!.assignment[n]?"T":"F")).join(", ")}</Text>
          <Text className="text-slate-300 mt-2">All premises evaluate to T; the conclusion evaluates to F.</Text>
        </View>}
      </View>
      {result.analysis.mode==="argument"&&<View className="bg-slate-800 rounded-xl p-4 mt-5">
        <Text className="text-white font-bold text-lg">Before reading the table, predict the validity</Text>
        <View className="flex-row justify-between mt-3">
          {(["valid","invalid"] as const).map(option=><TouchableOpacity key={option}
            accessibilityRole="radio" accessibilityState={{checked:verdict===option}}
            accessibilityLabel={"Predict "+option}
            onPress={()=>{setVerdict(option);setFeedback("");}}
            className={verdict===option?"bg-green-700 rounded-xl p-3":"bg-slate-700 rounded-xl p-3"}
            style={{width:"48%"}}>
            <Text className="text-white text-center">{option==="valid"?"Valid":"Invalid"}</Text>
          </TouchableOpacity>)}
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Check my logic prediction"
          onPress={check} disabled={!verdict} className="bg-indigo-700 rounded-xl p-3 mt-3">
          <Text className="text-white text-center font-bold">Check prediction</Text>
        </TouchableOpacity>
        {!!feedback&&<Text className="text-amber-200 mt-3">{feedback}</Text>}
      </View>}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Toggle complete truth table"
        onPress={()=>setShowRows(v=>!v)} className="bg-slate-700 p-4 rounded-xl mt-5">
        <Text className="text-white text-center font-bold">{showRows?"Hide":"Show"} complete {result.analysis.rows.length}-row truth table</Text>
      </TouchableOpacity>
      {showRows&&<ScrollView horizontal showsHorizontalScrollIndicator accessibilityLabel="Truth table horizontally scrollable" className="mt-3">
        <View className="bg-slate-800 border border-slate-700 rounded-xl p-2">
          <View className="flex-row border-b border-slate-500 pb-3">
            {result.analysis.variables.map(n=><Text key={n} className="text-green-300 font-bold text-center" style={{width:44}}>{n}</Text>)}
            {result.analysis.expressions.map((f,index)=><Text key={index}
              className="text-green-300 font-bold text-center" numberOfLines={2} style={{width:126}}>
              {index===result.analysis!.expressions.length-1?"Conclusion":"Premise "+(index+1)}{"\n"}{f}
            </Text>)}
          </View>
          {result.analysis.rows.map((r,index)=><View key={index}
            className={r.invalidating?"flex-row bg-red-900 border border-red-700":"flex-row border-b border-slate-700"}>
            {result.analysis!.variables.map(n=><Text key={n} className="text-white text-center py-3" style={{width:44}}>
              {r.assignment[n]?"T":"F"}</Text>)}
            {[...r.results,r.result].map((v,i)=><Text key={i} className="text-white text-center py-3" style={{width:126}}>
              {v?"T":"F"}{r.invalidating&&i===r.results.length?"  ←":""}</Text>)}
          </View>)}
        </View>
      </ScrollView>}
    </>}
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back to Logic and Critical Thinking course"
      onPress={()=>router.push("/course")} className="border border-green-600 p-4 rounded-xl mt-6">
      <Text className="text-green-300 text-center">← Return to course</Text>
    </TouchableOpacity>
    <Text className="text-slate-400 mt-5 leading-5 text-xs">
      Formalization models a chosen interpretation. A valid argument does not prove the factual truth
      of its premises. This lab does not support predicate logic, modal logic, or proof-search.
      Reference: Mabrig Korie, Logic and Critical Thinking (2026), Chapters 8–11.
    </Text>
  </ScrollView>;
}
