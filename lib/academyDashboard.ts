/**
 * Deterministic, offline-only Academy dashboard shared by two courses.
 * Course checks remain independent; this does NOT grant credits or grades.
 */
import { LOGIC_LESSONS } from "./logicCourse.ts";
import { PSY210_MODULES } from "./psy210Course.ts";

export type AcademyCourseId = "logic"|"psy210";
export interface AcademySnapshotInput {
  logicRead: number[];
  logicPassed: number[];
  logicSelected: number;
  psyRead: number[];
  psyScores: Record<string,number>;
  psySelected: number;
}
export interface AcademyNext {
  number:number; title:string; action:"Read and study"|"Complete practice check"|"Mark reading reviewed"|"Review or retake quiz"|"Explore independently"; detail:string;
}
export interface AcademyCourseSummary {
  id:AcademyCourseId;
  title:string;
  code:string;
  route:"/course"|"/psychology-course";
  total:number;
  completed:number;
  percent:number;
  read:number;
  practised:number;
  next:AcademyNext;
  notice:string;
}
export const ACADEMY_COURSE_META={
  logic:{
    id:"logic",code:"LCT DEMO",title:"Logic and Critical Thinking",
    route:"/course",notice:"23 lesson reviews; source book is a separate private full-text course kit.",
  },
  psy210:{
    id:"psy210",code:"PSY 210",title:"Psychology in the Age of AI",
    route:"/psychology-course",notice:"Six adapted module reviews; full reader and larger practice bank are in the separate course kit.",
  },
} as const;
function distinctKnown(ids:unknown, total:number):number[]{
  if(!Array.isArray(ids))return [];
  return [...new Set(ids.filter((x):x is number=>Number.isInteger(x)&&x>=1&&x<=total))];
}
function boundedScore(value:unknown):number{
 return typeof value==="number" && Number.isInteger(value) && value>=0 && value<=3?value:0;
}
function percent(completed:number,total:number){return Math.round(100*completed/total);}
export function getAcademyDashboard(input:AcademySnapshotInput):{
 courses:[AcademyCourseSummary,AcademyCourseSummary];
 completed:number;total:number;percent:number;
}{
 const logicRead=distinctKnown(input.logicRead,LOGIC_LESSONS.length);
 const logicPassed=distinctKnown(input.logicPassed,LOGIC_LESSONS.length);
 const logicCompleted=logicRead.filter(id=>logicPassed.includes(id));
 const selectedLogic=LOGIC_LESSONS.find(ch=>ch.id===input.logicSelected);
 const logicNext=selectedLogic&&!logicCompleted.includes(selectedLogic.id)?
   selectedLogic:LOGIC_LESSONS.find(ch=>!logicCompleted.includes(ch.id));
 const logicNextAction=logicNext
   ?logicRead.includes(logicNext.id)
      ? "Complete practice check"
      :logicPassed.includes(logicNext.id)
        ? "Mark reading reviewed":"Read and study"
   :"Explore independently";
 const logicNextDetail=logicNext
   ?logicRead.includes(logicNext.id)
      ?"You reviewed this chapter; pass its formative practice check."
      :logicPassed.includes(logicNext.id)
        ?"Practice is passed; mark this chapter as reviewed after reading."
        :"Read the example and mark the review before trying the question."
   :"All self-study reading and practice milestones recorded.";
 const psyRead=distinctKnown(input.psyRead,PSY210_MODULES.length);
 const scores=input.psyScores&&typeof input.psyScores==="object"&&!Array.isArray(input.psyScores)?input.psyScores:{};
 const psyPractised=PSY210_MODULES.filter(m=>boundedScore(scores[String(m.id)])>=2).map(m=>m.id);
 const psyCompleted=psyRead.filter(id=>psyPractised.includes(id));
 const selectedPsy=PSY210_MODULES.find(m=>m.id===input.psySelected);
 const psyNext=selectedPsy&&!psyCompleted.includes(selectedPsy.id)
   ?selectedPsy:PSY210_MODULES.find(m=>!psyCompleted.includes(m.id));
 const psyNextAction=psyNext
   ?!psyRead.includes(psyNext.id)&&psyPractised.includes(psyNext.id)
     ?"Mark reading reviewed"
     :psyRead.includes(psyNext.id)&&!psyPractised.includes(psyNext.id)
       ?"Review or retake quiz":"Read and study"
   :"Explore independently";
 const psyNextDetail=psyNext
   ?psyRead.includes(psyNext.id)&&!psyPractised.includes(psyNext.id)
     ?"Aim for at least two correct answers out of three on the native review check."
     :!psyRead.includes(psyNext.id)&&psyPractised.includes(psyNext.id)
       ?"You passed practice; study the review and mark the reading."
       :"Start with this module's review and a short formative quiz."
   :"All six native self-study milestones recorded.";
 const logic:AcademyCourseSummary={
  ...ACADEMY_COURSE_META.logic,
  total:LOGIC_LESSONS.length,completed:logicCompleted.length,
  percent:percent(logicCompleted.length,LOGIC_LESSONS.length),
  read:logicRead.length,practised:logicPassed.length,
  next:{number:logicNext?.id??0,title:logicNext?.title??"Self-study complete",
    action:logicNextAction,detail:logicNextDetail},
 };
 const psy:AcademyCourseSummary={
  ...ACADEMY_COURSE_META.psy210,
  total:PSY210_MODULES.length,completed:psyCompleted.length,
  percent:percent(psyCompleted.length,PSY210_MODULES.length),
  read:psyRead.length,practised:psyPractised.length,
  next:{number:psyNext?.id??0,title:psyNext?.name??"Self-study complete",
    action:psyNextAction,detail:psyNextDetail},
 };
 const total=logic.total+psy.total, completed=logic.completed+psy.completed;
 return {courses:[logic,psy],completed,total,percent:percent(completed,total)};
}
/** Stored date-only records use the DEVICE calendar, never a timezone-shifted ISO timestamp. */
export function localCalendarDay(now:Date=new Date()):string {
 return [now.getFullYear().toString().padStart(4,"0"),
  (now.getMonth()+1).toString().padStart(2,"0"),
  now.getDate().toString().padStart(2,"0")].join("-");
}
function dayUTC(s:string):number {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return NaN;
 const [y,m,d]=s.split("-").map(Number);
 if(y<2000||y>2100||m<1||m>12||d<1||d>31)return NaN;
 const ms=Date.UTC(y,m-1,d),date=new Date(ms);
 return date.getUTCFullYear()===y&&date.getUTCMonth()+1===m&&date.getUTCDate()===d?ms:NaN;
}
export function weekStartMonday(day:string):string{
 const time=dayUTC(day);
 if(!Number.isFinite(time))throw Error("Expected valid YYYY-MM-DD local-calendar date");
 const weekday=new Date(time).getUTCDay();
 const start=new Date(time-((weekday+6)%7)*86400000);
 return start.toISOString().slice(0,10);
}
export interface AcademySession {day:string;course:AcademyCourseId;}
export function sanitizeAcademySessions(rows:unknown,referenceDay:string):AcademySession[]{
 if(!Array.isArray(rows)||!Number.isFinite(dayUTC(referenceDay)))return [];
 const current=dayUTC(referenceDay),seen=new Set<string>(),clean:AcademySession[]=[];
 for(const row of rows){
  if(!row||typeof row!=="object")continue;
  const r=row as Record<string,unknown>;
  if(r.course!=="logic"&&r.course!=="psy210")continue;
  if(typeof r.day!=="string")continue;
  const time=dayUTC(r.day);
  if(!Number.isFinite(time)||time>current||time<current-90*86400000)continue;
  const key=r.course+":"+r.day;
  if(seen.has(key))continue;
  seen.add(key);clean.push({day:r.day,course:r.course});
 }
 return clean.slice(-90);
}
export function academyWeeklySessions(rows:unknown,referenceDay:string):{
 count:number;activeDays:number; byCourse:Record<AcademyCourseId,number>;
}{
 const valid=sanitizeAcademySessions(rows,referenceDay);
 const monday=dayUTC(weekStartMonday(referenceDay));
 const entries=valid.filter(x=>dayUTC(x.day)>=monday);
 return {count:entries.length,activeDays:new Set(entries.map(x=>x.day)).size,
   byCourse:{logic:entries.filter(x=>x.course==="logic").length,
     psy210:entries.filter(x=>x.course==="psy210").length}};
}
