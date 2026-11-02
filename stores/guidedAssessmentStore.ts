/** This is a local formative review, never an accredited final examination. */
import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {AcademyCourseId} from "../lib/academyDashboard";
interface AssessmentState{
  results:Partial<Record<AcademyCourseId,{best:number;passed:boolean}>>;
  record:(id:AcademyCourseId,score:number)=>void;
}
export const useGuidedAssessmentStore=create<AssessmentState>()(persist((set)=>({
 results:{},
 record:(id,score)=>{
   if(!Number.isInteger(score)||score<0||score>3)return;
   set(s=>{
     const old=s.results[id];
     return {results:{...s.results,[id]:{
       best:Math.max(old?.best??0,score),passed:!!old?.passed||score>=2
     }}};
   });
 },
}),{
 name:"openforge-guided-review-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({results:s.results}),
}));
