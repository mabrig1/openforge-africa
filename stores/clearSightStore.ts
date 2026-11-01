import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {clearSightUnit,clearSightCheck} from "../lib/clearSightCourse";
interface ClearSightState{
 read:number[];passed:number[];selected:number;
 markRead:(id:number)=>void;passQuiz:(id:number,index:number)=>boolean;
 select:(id:number)=>void;reset:()=>void;
}
const known=(rows:unknown):number[]=>Array.isArray(rows)
 ?[...new Set(rows.filter((x):x is number=>Number.isInteger(x)&&!!clearSightUnit(x)))]:[];
export const useClearSightProgress=create<ClearSightState>()(persist((set)=>({
 read:[],passed:[],selected:1,
 markRead:id=>{if(clearSightUnit(id))set(s=>({read:known([...s.read,id])}));},
 passQuiz:(id,index)=>{
  if(!clearSightCheck(id,index))return false;
  set(s=>({passed:known([...s.passed,id])}));return true;
 },
 select:id=>{if(clearSightUnit(id))set({selected:id});},
 reset:()=>set({read:[],passed:[],selected:1})
}),{
 name:"openforge-clear-sight-self-study-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({read:s.read,passed:s.passed,selected:s.selected}),
 migrate:raw=>{
  const s=(raw&&typeof raw==="object"?raw:{}) as Record<string,unknown>;
  return {read:known(s.read),passed:known(s.passed),
   selected:typeof s.selected==="number"&&clearSightUnit(s.selected)?s.selected:1};
 }
}));