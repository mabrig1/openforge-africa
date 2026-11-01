import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { router } from "expo-router";
import { Alert } from "../lib/platformDialogs";
import {
  CAPSTONE_SECTIONS, CAPSTONE_RUBRIC, checkCapstone, countWords, capstoneExportText,
  type CapstoneKey,
} from "../lib/capstoneGuide";
import { useCapstoneDraft } from "../stores/capstoneStore";
import { exportCapstone } from "../lib/capstoneExport";
import { setStudioDraft } from "../lib/studioDraft";

export default function CapstoneScreen() {
  const draft=useCapstoneDraft(s=>s.draft);
  const update=useCapstoneDraft(s=>s.updateField);
  const reset=useCapstoneDraft(s=>s.reset);
  const [active,setActive]=useState<CapstoneKey>("question");
  const [message,setMessage]=useState("");
  const status=checkCapstone(draft);
  const section=CAPSTONE_SECTIONS.find(s=>s.key===active)!;
  const exportDraft=async()=>{
    try{
      await exportCapstone(capstoneExportText(draft));
      setMessage(Platform.OS==="web"?"Local TXT draft downloaded.":"Share sheet opened; you choose where the draft goes.");
    }catch(e){setMessage(e instanceof Error?e.message:"Could not export draft.");}
  };
  const openOralPlan=()=>{
    setStudioDraft(draft.title||"Capstone oral defense",
      [
        "Thesis: "+(draft.abstract||draft.question),
        "Strongest opposing argument: "+draft.alternatives,
        "Evidence: "+draft.searchMethod,
        "Why this conclusion: "+draft.recommendation,
        "Respond to two questions: "+draft.oralDefense,
      ].join("\n\n").slice(0,4000));
    router.push("/explainer");
  };
  return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
    contentContainerStyle={{padding:18,paddingBottom:80}}>
    <Text className="text-green-400 text-xs font-semibold">OPENFORGE ACADEMY • LCT 401 • CHAPTER 23</Text>
    <Text className="text-white text-3xl font-extrabold mt-2">Capstone Research Studio</Text>
    <Text className="text-slate-300 leading-6 mt-3">
      Plan a researchable argument, evidence review, competing positions, formalization,
      3,000–5,000-word essay and 6–10-minute oral defense. Your notes remain local to this device.
      You decide if and when to export or share.
    </Text>
    <View className="bg-amber-950 border border-amber-700 p-4 rounded-xl mt-4">
      <Text className="text-amber-100 leading-6">
        This tool provides a writing checklist, not academic grading, plagiarism detection,
        citation verification, credit or an accredited award. The device's local storage is not
        encrypted by OpenForge; don't enter confidential research data or third-party personal details.
      </Text>
    </View>
    <View className="bg-slate-800 rounded-xl border border-green-700 p-4 mt-5">
      <Text className="text-green-300 font-bold">DRAFT COMPLETENESS — NOT A GRADE</Text>
      <Text className="text-white text-2xl font-extrabold mt-2">
        {status.fieldsComplete} / {status.fieldCount} fields started
      </Text>
      <Text className="text-slate-200 mt-2">Essay draft: {status.writtenWords} words • target 3,000–5,000</Text>
      <Text className="text-slate-200 mt-1">Abstract: {status.abstractWords} words • target 150–250</Text>
      <Text className="text-amber-300 mt-2">{status.manuscriptTarget?"Length within suggested essay range. Human review still required.":"Continue developing the essay; length target not yet met."}</Text>
      <Text className="text-slate-300 mt-3 text-sm">Oral defense target: 6–10 minutes. Record and review it outside this planner or use the Visual Studio to create a slide summary; the app does not time or assess a defense recording.</Text>
    </View>
    <Text className="text-white font-bold text-lg mt-6 mb-3">Research writing sections</Text>
    <Text className="text-slate-400 mb-3">Choose a section, write your own content, then move to the next. Every entry is saved automatically on this device.</Text>
    {CAPSTONE_SECTIONS.map((item,index)=><TouchableOpacity key={item.key}
      accessibilityRole="button" accessibilityLabel={"Edit capstone section "+(index+1)+": "+item.label}
      accessibilityState={{selected:active===item.key}}
      onPress={()=>{setActive(item.key);setMessage("");}}
      className={active===item.key?"bg-green-900 border border-green-600 rounded-xl p-3 mb-2":"bg-slate-800 border border-slate-700 rounded-xl p-3 mb-2"}>
      <Text className="text-white">{countWords(draft[item.key])>=3?"✓ ":"○ "}{index+1}. {item.label}</Text>
    </TouchableOpacity>)}
    <View className="bg-slate-800 border border-green-700 rounded-2xl p-4 mt-4">
      <Text className="text-green-300 font-bold">{section.label}</Text>
      <Text className="text-slate-300 mt-2 leading-5">{section.hint}</Text>
      <TextInput accessibilityLabel={"Capstone "+section.key+" writing area"} multiline
        textAlignVertical="top" value={draft[active]} onChangeText={v=>update(active,v)}
        maxLength={24000} placeholder={"Write "+section.label.toLowerCase()+" here..."}
        placeholderTextColor="#94a3b8" className="bg-slate-900 text-white rounded-xl p-4 mt-3"
        style={{minHeight:200}}/>
      <Text className="text-slate-400 mt-2">{countWords(draft[active])} words in this section</Text>
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous capstone section"
          onPress={()=>setActive(CAPSTONE_SECTIONS[Math.max(0,
            CAPSTONE_SECTIONS.findIndex(s=>s.key===active)-1)].key)}
          className="bg-slate-700 p-3 rounded-xl" style={{width:"48%"}}>
          <Text className="text-white text-center">← Previous field</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next capstone section"
          onPress={()=>setActive(CAPSTONE_SECTIONS[Math.min(CAPSTONE_SECTIONS.length-1,
            CAPSTONE_SECTIONS.findIndex(s=>s.key===active)+1)].key)}
          className="bg-indigo-700 p-3 rounded-xl" style={{width:"48%"}}>
          <Text className="text-white text-center">Next field →</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View className="bg-slate-800 border border-slate-700 rounded-xl p-4 mt-5">
      <Text className="text-white font-bold text-xl">Suggested human-marking rubric</Text>
      {CAPSTONE_RUBRIC.map(([label,points])=><View key={label}
        className="flex-row justify-between border-b border-slate-700 py-2">
        <Text className="text-slate-200" style={{width:"75%"}}>{label}</Text>
        <Text className="text-green-300">{points} points</Text>
      </View>)}
      <Text className="text-slate-400 mt-3">
        Total 100 possible rubric points. No score is computed; an authorized evaluator must
        examine the actual work and defense.
      </Text>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Download or share capstone text draft"
      onPress={exportDraft} className="bg-green-700 rounded-xl p-4 mt-5">
      <Text className="text-white text-center font-bold">
        {Platform.OS==="web"?"↓ Download private TXT draft":"Share draft using device sheet"}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Generate capstone oral-defense visual outline"
      onPress={openOralPlan} className="bg-indigo-800 border border-indigo-600 rounded-xl p-4 mt-3">
      <Text className="text-white text-center font-bold">Create oral-defense storyboard →</Text>
    </TouchableOpacity>
    {!!message&&<Text accessibilityLiveRegion="polite" className="text-green-300 mt-4">{message}</Text>}
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset private capstone draft"
      onPress={()=>Alert.alert("Delete your local capstone draft?",
        "This removes all 14 writing sections on this device. Export first if you need a copy.",
        [{text:"Cancel",style:"cancel"},{text:"Delete draft",style:"destructive",
          onPress:()=>{reset();setMessage("Local draft cleared.");setActive("question");}}])}
      className="mt-5 p-3">
      <Text className="text-amber-300 text-center">Reset draft (confirmation required)</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to course"
      onPress={()=>router.push("/course")} className="border border-slate-600 rounded-xl p-4 mt-3">
      <Text className="text-white text-center">← Back to course</Text>
    </TouchableOpacity>
    <Text className="text-slate-400 text-xs mt-5">
      Source: Mabrig Korie, Logic and Critical Thinking (2026), Chapter 23. Use verifiable
      sources. Disclose AI assistance. Do not treat automatically populated fields as evidence.
    </Text>
  </ScrollView>;
}
