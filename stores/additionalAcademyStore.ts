import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
 type NewCourseId,getNewCourseUnit,checkNewCourseAnswer
} from "../lib/additionalAcademyCourses";
type CourseMap<T>=Record<NewCourseId,T>;
interface Progress {
 read:CourseMap<number[]>;passed:CourseMap<number[]>;selected:CourseMap<number>;
 markRead:(course:NewCourseId,id:number)=>void;
 passQuiz:(course:NewCourseId,id:number,index:number)=>boolean;
 select:(course:NewCourseId,id:number)=>void;
 reset:(course:NewCourseId)=>void;
}
const valid=(v:unknown):v is NewCourseId=>v==="rlx101"||v==="ceai401";
const known=(c:NewCourseId,ids:unknown):number[]=>
 Array.isArray(ids)?[...new Set(ids.filter((x):x is number=>Number.isInteger(x)&&!!getNewCourseUnit(c,x)))]:[];
export const useAdditionalAcademyProgress=create<Progress>()(persist((set)=>({
 read:{rlx101:[],ceai401:[]},passed:{rlx101:[],ceai401:[]},selected:{rlx101:1,ceai401:1},
 markRead:(course,id)=>{
  if(!valid(course)||!getNewCourseUnit(course,id))return;
  set(s=>({read:{...s.read,[course]:known(course,[...s.read[course],id])}}));
 },
 passQuiz:(course,id,index)=>{
  if(!valid(course)||!checkNewCourseAnswer(course,id,index))return false;
  set(s=>({passed:{...s.passed,[course]:known(course,[...s.passed[course],id])}}));return true;
 },
 select:(course,id)=>{
  if(valid(course)&&getNewCourseUnit(course,id))
   set(s=>({selected:{...s.selected,[course]:id}}));
 },
 reset:course=>{
  if(!valid(course))return;
  set(s=>({read:{...s.read,[course]:[]},passed:{...s.passed,[course]:[]},
   selected:{...s.selected,[course]:1}}));
 }
}),{
 name:"openforge-additional-academy-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({read:s.read,passed:s.passed,selected:s.selected}),
 migrate:(raw:unknown)=>{
  const s=raw&&typeof raw==="object"?raw as Record<string,any>:{};
  return {
   read:{rlx101:known("rlx101",s.read?.rlx101),ceai401:known("ceai401",s.read?.ceai401)},
   passed:{rlx101:known("rlx101",s.passed?.rlx101),ceai401:known("ceai401",s.passed?.ceai401)},
   selected:{
    rlx101:getNewCourseUnit("rlx101",s.selected?.rlx101)?s.selected.rlx101:1,
    ceai401:getNewCourseUnit("ceai401",s.selected?.ceai401)?s.selected.ceai401:1
   }
  };
 }
}));