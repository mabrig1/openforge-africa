import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getSpeakerUnit,checkSpeakerAnswer} from "../lib/multiChannelSpeakerCourse";
interface SpeakerState{
 read:number[];passed:number[];selected:number;
 markRead:(id:number)=>void;passQuiz:(id:number,index:number)=>boolean;
 select:(id:number)=>void;reset:()=>void;
}
const known=(rows:unknown):number[]=>Array.isArray(rows)
 ?[...new Set(rows.filter((x):x is number=>Number.isInteger(x)&&!!getSpeakerUnit(x)))]:[];
export const useSpeakerProgress=create<SpeakerState>()(persist((set)=>({
 read:[],passed:[],selected:1,
 markRead:id=>{if(getSpeakerUnit(id))set(s=>({read:known([...s.read,id])}));},
 passQuiz:(id,index)=>{
  if(!checkSpeakerAnswer(id,index))return false;
  set(s=>({passed:known([...s.passed,id])}));return true;
 },
 select:id=>{if(getSpeakerUnit(id))set({selected:id});},
 reset:()=>set({read:[],passed:[],selected:1})
}),{
 name:"openforge-multi-channel-speaker-self-study-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({read:s.read,passed:s.passed,selected:s.selected}),
 migrate:raw=>{
  const s=(raw&&typeof raw==="object"?raw:{}) as Record<string,unknown>;
  return {read:known(s.read),passed:known(s.passed),
   selected:typeof s.selected==="number"&&getSpeakerUnit(s.selected)?s.selected:1};
 }
}));