import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {PSY210_CLIENTS,psy210ValidSession} from "../lib/psy210Interview";
interface Session {
 caseIndex:number;
 chosen:number[];
 chooseCase:(id:number)=>void;
 addChoice:(index:number)=>boolean;
 reset:()=>void;
}
export const usePsy210Interview=create<Session>()(persist((set,get)=>({
 caseIndex:0,chosen:[],
 chooseCase:(id)=>{if(Number.isInteger(id)&&id>=0&&id<PSY210_CLIENTS.length)
   set({caseIndex:id,chosen:[]});},
 addChoice:(index)=>{
   const s=get();
   if(!Number.isInteger(index)||index<0||index>2||s.chosen.length>=5)return false;
   set({chosen:[...s.chosen,index]});return true;
 },
 reset:()=>set(s=>({caseIndex:s.caseIndex,chosen:[]})),
}),{
 name:"openforge-psy210-fictional-interview-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({caseIndex:s.caseIndex,chosen:s.chosen}),
 migrate:(saved:any)=>{
  const ci=saved?.caseIndex;
  const cs=saved?.chosen;
  return psy210ValidSession(ci,cs)?{caseIndex:ci,chosen:cs}:{caseIndex:0,chosen:[]};
 }
}));
