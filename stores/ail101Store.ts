import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getAilUnit,checkAilAnswer} from "../lib/ail101Course";

interface Ail101Progress {
 read:number[];
 passed:number[];
 selected:number;
 markRead:(id:number)=>void;
 passQuiz:(id:number,index:number)=>boolean;
 select:(id:number)=>void;
 reset:()=>void;
}
const known=(xs:unknown):number[]=>Array.isArray(xs)
 ? [...new Set(xs.filter((x):x is number=>Number.isInteger(x)&&!!getAilUnit(x)))] : [];
export const useAil101Progress=create<Ail101Progress>()(persist((set)=>({
 read:[],passed:[],selected:1,
 markRead:(id)=>{if(getAilUnit(id))set(s=>({read:known([...s.read,id])}));},
 passQuiz:(id,index)=>{
  if(!checkAilAnswer(id,index))return false;
  set(s=>({passed:known([...s.passed,id])}));return true;
 },
 select:(id)=>{if(getAilUnit(id))set({selected:id});},
 reset:()=>set({read:[],passed:[],selected:1}),
}),{
 name:"openforge-ail101-local-progress-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({read:s.read,passed:s.passed,selected:s.selected}),
 migrate:(saved:unknown)=>{
  const s=(saved&&typeof saved==="object"?saved:{}) as Record<string,unknown>;
  return {read:known(s.read),passed:known(s.passed),
   selected:typeof s.selected==="number"&&getAilUnit(s.selected)?s.selected:1};
 },
}));