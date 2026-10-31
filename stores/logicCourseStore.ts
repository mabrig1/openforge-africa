import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLogicLesson, logicCourseCompletion } from "../lib/logicCourse";

interface ProgressState {
  read: number[];
  passed: number[];
  selected: number;
  markRead: (id:number)=>void;
  submitAnswer: (id:number,index:number)=>boolean;
  select: (id:number)=>void;
  reset: ()=>void;
}
export const useLogicCourseProgress = create<ProgressState>()(persist((set)=>({
  read:[],passed:[],selected:1,
  markRead:(id)=>set(s=>getLogicLesson(id) && !s.read.includes(id)?{read:[...s.read,id]}:s),
  submitAnswer:(id,index)=>{
    const lesson=getLogicLesson(id);
    const correct=!!lesson&&Number.isInteger(index)&&index===lesson.question.answer;
    if(correct)set(s=>s.passed.includes(id)?s:{passed:[...s.passed,id]});
    return correct;
  },
  select:(id)=>set(s=>getLogicLesson(id)?{selected:id}:s),
  reset:()=>set({read:[],passed:[],selected:1}),
}),{
  name:"openforge-logic-progress-v1",
  version:1,
  storage:createJSONStorage(()=>AsyncStorage),
  partialize:(s)=>({read:s.read,passed:s.passed,selected:s.selected}),
  migrate:(saved:any)=>({
    read:Array.isArray(saved?.read)?saved.read.filter((n:unknown)=>Number.isInteger(n)&&getLogicLesson(n as number)):[],
    passed:Array.isArray(saved?.passed)?saved.passed.filter((n:unknown)=>Number.isInteger(n)&&getLogicLesson(n as number)):[],
    selected:getLogicLesson(saved?.selected)?saved.selected:1,
  }),
}));
export function getCurrentLogicProgress(read:number[],passed:number[]){
  return logicCourseCompletion(read,passed);
}
