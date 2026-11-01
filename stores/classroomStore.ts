import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFreeAccess,localDayKey,startFreeExplorer,spendFreeRun,
 type FreeAccessSnapshot} from "../lib/classroomAccess";
import type {ClassroomAgentId,ClassroomMode,ClassroomRun} from "../lib/openMaicClassroom";

export interface ClassroomRunLog{
 id:string;day:string;mode:ClassroomMode;
 agents:ClassroomAgentId[];sourceMatched:boolean;
}
interface State extends FreeAccessSnapshot{
 logs:ClassroomRunLog[];
 beginExplorer:(day?:string)=>void;
 recordRun:(run:ClassroomRun,day?:string)=>boolean;
}
export const useClassroomStore=create<State>()(persist((set,get)=>({
 trialStartedOn:null,dailyUsage:{},logs:[],
 beginExplorer:(day=localDayKey())=>set(s=>startFreeExplorer(s,day)),
 recordRun:(run,day=localDayKey())=>{
  if(!getFreeAccess(get(),day).remaining)return false;
  const next=spendFreeRun(get(),day);
  if(!next)return false;
  // Deliberately omit questions, note contents, identities and API credentials.
  const log:ClassroomRunLog={id:day+"-"+(get().logs.length+1)+"-"+Date.now().toString(36),
   day,mode:run.mode,agents:run.dispatched.map(d=>d.agentId),
   sourceMatched:run.turns.some(t=>t.evidence.length>0)};
  set(s=>({...spendFreeRun(s,day)!,logs:[log,...s.logs].slice(0,50)}));
  return true;
 },
}),{
 name:"openforge-local-classroom-preview-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({trialStartedOn:s.trialStartedOn,dailyUsage:s.dailyUsage,logs:s.logs}),
}));
