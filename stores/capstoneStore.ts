import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CAPSTONE_SECTIONS, EMPTY_CAPSTONE, type CapstoneDraft, type CapstoneKey } from "../lib/capstoneGuide";
interface CapstoneState {
 draft:CapstoneDraft;
 updateField:(key:CapstoneKey,value:string)=>void;
 reset:()=>void;
}
export const useCapstoneDraft=create<CapstoneState>()(persist((set)=>({
 draft:{...EMPTY_CAPSTONE},
 updateField:(key,value)=>{
   if(!CAPSTONE_SECTIONS.some(s=>s.key===key))return;
   set(s=>({draft:{...s.draft,[key]:value.slice(0,24000)}}));
 },
 reset:()=>set({draft:{...EMPTY_CAPSTONE}}),
}),{
 name:"openforge-capstone-local-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({draft:s.draft}),
 migrate:(saved:unknown)=>{
   const record=(saved&&typeof saved==="object"?saved:{}) as {draft?:Record<string,unknown>};
   const draft={...EMPTY_CAPSTONE};
   CAPSTONE_SECTIONS.forEach(({key})=>{
     if(typeof record.draft?.[key]==="string")draft[key]=(record.draft[key] as string).slice(0,24000);
   });
   return {draft};
 }
}));
