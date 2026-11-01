import {useState} from "react";
import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {router} from "expo-router";
import {useExpandedCoursesProgress} from "../stores/expandedCoursesStore";
import {forgeEvidenceChecklist,forgeEvidenceDossier} from "../lib/forgeEvidenceDossier";
import {exportForgeDossier} from "../lib/forgeDossierExport";

export default function ForgePortfolioStudio(){
 const drafts=useExpandedCoursesProgress(s=>s.evidence);
 const select=useExpandedCoursesProgress(s=>s.select);
 const snapshot=forgeEvidenceChecklist(drafts);
 const [message,setMessage]=useState("");
 const editWeek=(week:number)=>{select("forge",week);router.push("/forge-studies");};
 const exportDraft=()=>{
  try{
   const result=exportForgeDossier(forgeEvidenceDossier(drafts));
   Promise.resolve(result).then(()=>setMessage("Dossier prepared on your device. No submission or credential verification occurred."))
    .catch(()=>setMessage("Export cancelled or unavailable. Your on-device draft remains unchanged."));
  }catch{setMessage("Unable to export on this device. Local source drafts remain saved.");}
 };
 return <ScrollView className="flex-1 bg-slate-900" keyboardShouldPersistTaps="handled"
  contentContainerStyle={{padding:18,paddingBottom:90}}>
   <Text className="text-teal-300 font-bold text-xs tracking-widest">OPENFORGE AFRICA • FS 101</Text>
   <Text className="text-white text-3xl font-extrabold mt-2">Forge Evidence Portfolio Studio</Text>
   <Text className="text-slate-200 leading-6 mt-3">
    Prepare a transparent private dossier for all ten weekly project artifacts.
    Each item connects directly to the FS 101 source syllabus and can be edited in its week.
   </Text>
   <View className="bg-amber-950 border border-amber-700 rounded-xl p-4 mt-4">
    <Text className="text-amber-100 leading-6">
      UNVERIFIED DRAFTS ONLY. A link is not proof that a project exists, serves genuine users,
      has enough Git commits, or passed a mentor panel. No marks, badges or certificates
      are issued here. Avoid adding names, confidential interview notes or other personal information.
      Local storage is not encrypted; export is an explicit user-controlled action.
    </Text>
   </View>
   <View className="bg-slate-800 border border-teal-700 rounded-xl p-5 mt-5">
    <Text className="text-teal-300 font-bold">PRIVATE PORTFOLIO PREPARATION</Text>
    <Text className="text-white font-extrabold text-3xl mt-2">{snapshot.links} / 10 draft URLs</Text>
    <Text className="text-slate-300 mt-2">{snapshot.notes} / 10 notes • {snapshot.noLinks} missing draft URLs</Text>
    <View className="bg-slate-700 rounded-full overflow-hidden mt-4" style={{height:12}}>
      <View className="bg-teal-400 h-3" style={{width:(snapshot.links*10+"%") as `${number}%`}}/>
    </View>
    <Text className="text-slate-400 mt-3 text-xs">This counts filled URL fields—not real evidence, verification or course completion.</Text>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Export private unverified Forge dossier"
      onPress={exportDraft} className="bg-indigo-700 p-4 rounded-xl mt-5">
      <Text className="text-white text-center font-bold">Export private evidence dossier (TXT) →</Text>
    </TouchableOpacity>
    {!!message&&<Text accessibilityLiveRegion="polite" className="text-teal-200 mt-3">{message}</Text>}
   </View>
   <Text className="text-white text-xl font-bold mt-7">All ten source-aligned weekly artifacts</Text>
   {snapshot.weeks.map(w=><View key={w.week} className="bg-slate-800 border border-slate-700 rounded-xl p-4 mt-4">
     <Text className="text-teal-300 font-bold">WEEK {w.week} • {w.phase}</Text>
     <Text className="text-white text-lg font-bold mt-2">{w.title}</Text>
     <Text className="text-slate-300 mt-3">Required artifact: {w.requiredArtifact}</Text>
     <Text className="text-slate-400 mt-2 leading-5">Source proof criterion: {w.requiredProof}</Text>
     <Text className={w.hasPublicLink?"text-green-300 mt-3":"text-amber-200 mt-3"}>
       {w.hasPublicLink?"Student supplied an HTTPS link — not inspected":"No public HTTPS link saved"}
     </Text>
     {!!w.note&&<Text className="text-slate-400 text-xs mt-2">A private explanatory note is recorded.</Text>}
     <Text className="text-slate-400 text-xs mt-2">Human review: NOT PERFORMED</Text>
     <TouchableOpacity accessibilityRole="button"
       accessibilityLabel={"Edit Week "+w.week+" Forge artifact evidence draft"}
       onPress={()=>editWeek(w.week)} className="bg-slate-700 rounded-xl p-3 mt-4">
       <Text className="text-white text-center font-bold">Open Week {w.week} draft editor →</Text>
     </TouchableOpacity>
   </View>)}
   <Text className="text-white text-xl font-bold mt-7">Five evidence gates requiring humans</Text>
   {snapshot.gates.map(g=><View key={g.name} className="bg-slate-800 border border-indigo-700 rounded-xl p-4 mt-3">
     <Text className="text-indigo-300 font-bold">{g.name} — NOT VERIFIED</Text>
     <Text className="text-slate-200 leading-6 mt-2">{g.explain}</Text>
   </View>)}
   <Text className="text-slate-400 mt-6 text-xs">Source: FS 101 Introduction to Forge Studies, assessment and progress milestones. A submitted upstream PR can count without merging, but all milestones still require legitimate evidence and human review. Never claim this preview has issued an official Foundation Certificate.</Text>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return from Forge Portfolio to Academy"
     onPress={()=>router.push("/academy")} className="bg-slate-700 rounded-xl p-4 mt-4">
      <Text className="text-white text-center font-bold">← Back to Academy</Text>
   </TouchableOpacity>
  </ScrollView>;
}
