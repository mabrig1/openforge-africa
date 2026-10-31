import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPsyModule } from "../lib/psy210Course";
interface PsyCourseStore {
 selected:number;read:number[];reviewed:number[];
 select:(id:number)=>void;markRead:(id:number)=>void;markQuiz:(id:number)=>void;reset:()=>void;
}
export const usePsy210Progress=create<PsyCourseStore>()(persist((set)=>({
 selected:1,read:[],reviewed:[],
 select:id=>set(s=>getPsyModule(id)?{selected:id}:s),
 markRead:id=>set(s=>getPsyModule(id)&&!s.read.includes(id)?{read:[...s.read,id]}:s),
 markQuiz:id=>set(s=>getPsyModule(id)&&!s.reviewed.includes(id)?{reviewed:[...s.reviewed,id]}:s),
 reset:()=>set({selected:1,read:[],reviewed:[]}),
}),{
 name:"openforge-psy210-private-companion-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({selected:s.selected,read:s.read,reviewed:s.reviewed}),
 migrate:(old:unknown)=>{
  const x=(old&&typeof old==="object"?old:{}) as {selected?:number;read?:unknown;reviewed?:unknown};
  const filter=(v:unknown)=>Array.isArray(v)?Array.from(new Set(v.filter(n=>Number.isInteger(n)&&getPsyModule(n)))):[];
  return {selected:getPsyModule(x.selected??0)?x.selected:1,read:filter(x.read),reviewed:filter(x.reviewed)};
 }
}));
