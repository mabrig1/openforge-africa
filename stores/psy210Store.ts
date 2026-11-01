import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { psy210GetModule,psy210Completion } from "../lib/psy210Course";

interface Psy210Progress {
 read:number[];
 scores:Record<string,number>;
 selected:number;
 markRead:(id:number)=>void;
 saveQuiz:(id:number,choices:number[])=>number;
 select:(id:number)=>void;
 reset:()=>void;
}
export const usePsy210Progress=create<Psy210Progress>()(persist((set)=>({
 read:[],scores:{},selected:1,
 markRead:(id)=>set(s=>psy210GetModule(id)&&!s.read.includes(id)?{read:[...s.read,id]}:s),
 saveQuiz:(id,choices)=>{
   const m=psy210GetModule(id);
   if(!m||!Array.isArray(choices)||choices.length!==3||
     !choices.every(c=>Number.isInteger(c)&&c>=0&&c<=2))return -1;
   const score=m.questions.reduce((n,q,index)=>n+Number(q.answer===choices[index]),0);
   set(s=>({scores:{...s.scores,[String(id)]:Math.max(score,s.scores[String(id)]??0)}}));
   return score;
 },
 select:(id)=>set(s=>psy210GetModule(id)?{selected:id}:s),
 reset:()=>set({read:[],scores:{},selected:1}),
}),{
 name:"openforge-psy210-self-study-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:(s)=>({read:s.read,scores:s.scores,selected:s.selected}),
 migrate:(saved:any)=>{
   const r=Array.isArray(saved?.read)?saved.read.filter((n:unknown)=>Number.isInteger(n)&&psy210GetModule(n as number)):[];
   const scores:Record<string,number>={};
   if(saved?.scores && typeof saved.scores==="object"&&!Array.isArray(saved.scores)){
     for(const [k,v] of Object.entries(saved.scores)){
       if(/^[1-6]$/.test(k)&&Number.isInteger(v)&&(v as number)>=0&&(v as number)<=3)
         scores[k]=v as number;
     }
   }
   return {read:[...new Set(r)],scores,selected:psy210GetModule(saved?.selected)?saved.selected:1};
 },
}));
export {psy210Completion};
