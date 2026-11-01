import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {type ExpansionCourse,getExpansionItem,expansionCompletion} from "../lib/academyExpansion";
export type EvidenceDraft={url:string;note:string};
interface ExpandedCoursesProgress{
 read:Record<ExpansionCourse,number[]>;
 passed:Record<ExpansionCourse,number[]>;
 selected:Record<ExpansionCourse,number>;
 evidence:Record<string,EvidenceDraft>;
 markRead:(course:ExpansionCourse,id:number)=>void;
 passQuiz:(course:ExpansionCourse,id:number,answer:number)=>boolean;
 select:(course:ExpansionCourse,id:number)=>void;
 saveEvidence:(id:number,url:string,note:string)=>boolean;
 reset:(course:ExpansionCourse)=>void;
}
const valid=(c:unknown):c is ExpansionCourse=>c==="decision"||c==="forge";
const keep=(c:ExpansionCourse,x:unknown)=>{
 return Array.isArray(x)?[...new Set(x.filter((v):v is number=>
   Number.isInteger(v)&&!!getExpansionItem(c,v)))]:[];
};
export function forgeEvidenceURL(text:string):boolean{
 if(text==="")return true; // a draft can omit a link
 if(text.length>500||!/^(https:\/\/)/i.test(text))return false;
 try{const parsed=new URL(text);return parsed.protocol==="https:"&&
   !!parsed.hostname&&!parsed.username&&!parsed.password;}
 catch{return false;}
}
export const useExpandedCoursesProgress=create<ExpandedCoursesProgress>()(persist((set)=>({
 read:{decision:[],forge:[]},passed:{decision:[],forge:[]},
 selected:{decision:1,forge:1},evidence:{},
 markRead:(course,id)=>{if(valid(course)&&getExpansionItem(course,id))
  set(s=>({read:{...s.read,[course]:[...new Set([...s.read[course],id])]}}));},
 passQuiz:(course,id,answer)=>{
  if(!valid(course)||!getExpansionItem(course,id)||!Number.isInteger(answer)||answer<0||answer>2)return false;
  if(answer!==1)return false;
  set(s=>({passed:{...s.passed,[course]:[...new Set([...s.passed[course],id])]}}));
  return true;
 },
 select:(course,id)=>{if(valid(course)&&getExpansionItem(course,id))
   set(s=>({selected:{...s.selected,[course]:id}}));},
 saveEvidence:(id,url,note)=>{
  if(!getExpansionItem("forge",id)||!forgeEvidenceURL(url)||note.length>1000)return false;
  set(s=>({evidence:{...s.evidence,[String(id)]:{url,note}}}));return true;
 },
 reset:course=>{if(!valid(course))return;set(s=>({
   read:{...s.read,[course]:[]},passed:{...s.passed,[course]:[]},
   selected:{...s.selected,[course]:1},
   evidence:course==="forge"?{}:s.evidence,
 }));},
}),{
 name:"openforge-expanded-academy-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({read:s.read,passed:s.passed,selected:s.selected,evidence:s.evidence}),
 migrate:(saved:unknown)=>{
  const s=(saved&&typeof saved==="object"?saved:{}) as Record<string,any>;
  const evidence:Record<string,EvidenceDraft>={};
  if(s.evidence&&typeof s.evidence==="object"&&!Array.isArray(s.evidence)){
   for(let i=1;i<=10;i++){
    const v=s.evidence[String(i)];
    if(v&&typeof v.url==="string"&&typeof v.note==="string"&&
      forgeEvidenceURL(v.url)&&v.note.length<=1000)
       evidence[String(i)]={url:v.url,note:v.note};
   }
  }
  return {
   read:{decision:keep("decision",s.read?.decision),forge:keep("forge",s.read?.forge)},
   passed:{decision:keep("decision",s.passed?.decision),forge:keep("forge",s.passed?.forge)},
   selected:{
    decision:getExpansionItem("decision",s.selected?.decision)?s.selected.decision:1,
    forge:getExpansionItem("forge",s.selected?.forge)?s.selected.forge:1,
   },evidence
  };
 }
}));
export function expandedSummary(course:ExpansionCourse,read:number[],passed:number[]){
 return expansionCompletion(course,read,passed);
}
