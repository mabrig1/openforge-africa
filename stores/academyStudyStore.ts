import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
 type AcademyCourseId,type AcademySession,
 localCalendarDay,sanitizeAcademySessions,
} from "../lib/academyDashboard";

interface AcademyStudyState{
 following:AcademyCourseId[];
 weeklyTarget:number;
 sessions:AcademySession[];
 toggleCourse:(id:AcademyCourseId)=>void;
 setTarget:(n:number)=>void;
 markSession:(id:AcademyCourseId,day?:string)=>void;
 resetPlan:()=>void;
}
function validCourse(id:unknown):id is AcademyCourseId{return id==="logic"||id==="psy210";}
export const useAcademyStudyStore=create<AcademyStudyState>()(persist((set)=>({
 following:["logic","psy210"],weeklyTarget:3,sessions:[],
 toggleCourse:id=>{
  if(!validCourse(id))return;
  set(s=>({following:s.following.includes(id)
    ?s.following.filter(x=>x!==id):[...s.following,id]}));
 },
 setTarget:n=>{
  if(!Number.isInteger(n)||n<1||n>7)return;
  set({weeklyTarget:n});
 },
 markSession:(id,day=localCalendarDay())=>{
  if(!validCourse(id))return;
  const today=localCalendarDay();
  // Do not permit arbitrary dates or fabricated future/history entries.
  if(day!==today)return;
  set(s=>({sessions:sanitizeAcademySessions([...s.sessions,{course:id,day}],today)}));
 },
 resetPlan:()=>set({following:["logic","psy210"],weeklyTarget:3,sessions:[]}),
}),{
 name:"openforge-academy-study-plan-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({following:s.following,weeklyTarget:s.weeklyTarget,sessions:s.sessions}),
 migrate:(saved:unknown)=>{
  const data=(saved&&typeof saved==="object"?saved:{}) as Record<string,unknown>;
  const following=Array.isArray(data.following)?([...new Set(data.following.filter(validCourse))] as AcademyCourseId[]):["logic","psy210"];
  return {
   following,
   weeklyTarget:Number.isInteger(data.weeklyTarget)&&(data.weeklyTarget as number)>=1&&(data.weeklyTarget as number)<=7?data.weeklyTarget:3,
   sessions:sanitizeAcademySessions(data.sessions,localCalendarDay()),
  };
 },
}));
