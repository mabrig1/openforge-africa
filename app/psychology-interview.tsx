import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {Alert} from "../lib/platformDialogs";
import {PSY210_CLIENTS,psy210InterviewProgress} from "../lib/psy210Interview";
import {usePsy210Interview} from "../stores/psy210InterviewStore";
import {setStudioDraft} from "../lib/studioDraft";
export default function PsychologyInterviewScreen(){
 const caseIndex=usePsy210Interview(s=>s.caseIndex);
 const chosen=usePsy210Interview(s=>s.chosen);
 const chooseCase=usePsy210Interview(s=>s.chooseCase);
 const addChoice=usePsy210Interview(s=>s.addChoice);
 const reset=usePsy210Interview(s=>s.reset);
 const c=PSY210_CLIENTS[caseIndex]??PSY210_CLIENTS[0];
 const status=psy210InterviewProgress(caseIndex,chosen);
 const turn=c.turns[status.turns];
 const changeCase=(index:number)=>{
   if(index===caseIndex)return;
   if(chosen.length>0)Alert.alert("Switch fictional client?",
     "This starts a new fictional conversation and clears the selected-response record for this exercise.",
     [{text:"Keep current case",style:"cancel"},{text:"Start new case",onPress:()=>chooseCase(index)}]);
   else chooseCase(index);
 };
 const toExplainer=()=>{
   const transcript=[
     "Fictional practice case: "+c.name,
     "Scripted opening: "+c.opening,
     ...chosen.flatMap((choice,i)=>{
       const row=c.turns[i];return [
        "Turn "+(i+1)+": "+row.skill,
        "Student selected: "+row.choices[choice],
        "Fictional reply: "+row.replies[choice],
        "Practice explanation: "+row.explanation
       ];
     }),
     "This is synthetic educational dialogue, not a real consultation or a clinical competency assessment.",
   ].join("\n\n");
   setStudioDraft("PSY 210 • Fictional interview "+c.name,transcript.slice(0,4000));
   router.push("/reader");
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
   contentContainerStyle={{padding:18,paddingBottom:80}}>
   <Text className="text-teal-400 text-xs font-bold">OPENFORGE ACADEMY • PSY 210 MODULE 5</Text>
   <Text className="text-white text-3xl font-extrabold mt-2">Virtual Interview Practice</Text>
   <Text className="text-slate-300 leading-6 mt-3">
     Complete five conversational turns with a fictional person. Your selected wording
     changes the scripted reply. This demonstrates interviewing concepts rather than clinical skill.
   </Text>
   <View className="bg-amber-950 border border-amber-700 p-4 rounded-xl mt-4">
     <Text className="text-amber-100 leading-6">
       EDUCATIONAL SIMULATION ONLY. These characters are invented and do not represent patients.
       There is no AI inference, real therapy, diagnostic testing or human safety supervision.
       No personal health information is collected by this exercise; only anonymous option numbers
       are saved on the current device. For real concerns, seek qualified human assistance.
     </Text>
   </View>
   <Text className="text-white font-bold mt-6">Select a fictional client</Text>
   {PSY210_CLIENTS.map((item,index)=><TouchableOpacity key={item.name}
     accessibilityRole="button" accessibilityLabel={"Select fictional client "+item.name}
     onPress={()=>changeCase(index)}
     className={index===caseIndex?"bg-teal-900 border border-teal-600 p-4 rounded-xl mt-3":"bg-slate-800 border border-slate-700 p-4 rounded-xl mt-3"}>
     <Text className="text-white font-semibold">{item.name}</Text>
   </TouchableOpacity>)}
   <View className="bg-slate-800 border border-teal-700 p-5 rounded-2xl mt-5">
     <Text className="text-teal-300 font-bold">SCRIPTED CLIENT OPENING</Text>
     <Text className="text-white text-xl leading-7 mt-3">{c.opening}</Text>
     <Text className="text-slate-300 mt-4">{status.turns} of 5 turns completed</Text>
     <View className="bg-slate-700 h-3 rounded-full mt-3 overflow-hidden">
       <View className="bg-teal-400 h-3" style={{width:(status.turns*20+"%") as `${number}%`}}/>
     </View>
     <Text className="text-slate-400 text-xs mt-2">{status.modelResponses} of {status.turns} responses matched the illustrative listening guidance. This is not an assessment of professional competence.</Text>
   </View>
   {chosen.map((value,index)=>{
     const t=c.turns[index];
     return <View key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-4 mt-4">
       <Text className="text-teal-300 font-bold">TURN {index+1}: {t.skill}</Text>
       <Text className="text-slate-400 mt-3">Your selected statement</Text>
       <Text className="text-white leading-6 mt-2">{t.choices[value]}</Text>
       <Text className="text-slate-400 mt-3">Fictional client replied</Text>
       <Text className="text-white leading-6 mt-2">{t.replies[value]}</Text>
       <Text className="text-slate-300 leading-6 mt-3">{t.explanation}</Text>
     </View>;
   })}
   {status.finished?<View className="bg-green-950 border border-green-700 rounded-xl p-5 mt-5">
      <Text className="text-green-300 font-bold text-xl">Five-turn simulation complete</Text>
      <Text className="text-white leading-6 mt-3">
       Review how your responses affected the scripted dialogue. An instructor or qualified
       supervisor would still need to evaluate real interviewing technique and ethical conduct.
      </Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Transfer fictional interview transcript to Text Reader"
        onPress={toExplainer} className="bg-indigo-700 rounded-xl p-4 mt-5">
        <Text className="text-white text-center font-bold">Review scripted transcript in Reader →</Text>
      </TouchableOpacity>
    </View>:
    <View className="bg-slate-800 border border-slate-700 rounded-xl p-5 mt-5">
      <Text className="text-teal-300 font-bold">TURN {status.turns+1} OF 5 • {turn.skill}</Text>
      <Text className="text-white text-xl font-semibold mt-3">{turn.prompt}</Text>
      {turn.choices.map((option,i)=><TouchableOpacity key={i}
        accessibilityRole="button" accessibilityLabel={"Select interview response "+(i+1)+": "+option}
        onPress={()=>addChoice(i)}
        className="bg-slate-700 border border-slate-600 p-4 rounded-xl mt-3">
        <Text className="text-white leading-6">{i+1}. {option}</Text>
      </TouchableOpacity>)}
    </View>}
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset fictional psychology interview"
      onPress={()=>Alert.alert("Restart fictional practice?","Clears selected options for this case only.",
       [{text:"Keep",style:"cancel"},{text:"Restart",style:"destructive",onPress:reset}])}
      className="border border-slate-600 rounded-xl p-4 mt-5">
      <Text className="text-white text-center">↻ Restart fictional interview</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to PSY 210 module index"
      onPress={()=>router.push("/psychology-course")} className="p-4 mt-3">
      <Text className="text-teal-300 text-center">← Return to PSY 210 course</Text>
   </TouchableOpacity>
 </ScrollView>;
}
