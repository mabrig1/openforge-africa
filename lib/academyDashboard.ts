/**
 * Deterministic, offline-only Academy dashboard shared by seven courses.
 * Course checks remain independent; this does NOT grant credits or grades.
 */
import { LOGIC_LESSONS } from "./logicCourse.ts";
import { PSY210_MODULES } from "./psy210Course.ts";
import {getExpansion,type ExpansionCourse} from "./academyExpansion.ts";
import {AIL101_UNITS} from "./ail101Course.ts";
import {getNewCourseUnits,NEW_COURSE_META,type NewCourseId} from "./additionalAcademyCourses.ts";

export type AcademyCourseId = "logic"|"psy210"|"decision"|"forge"|"ail101"|"rlx101"|"ceai401";
export interface AcademySnapshotInput {
  logicRead: number[];
  logicPassed: number[];
  logicSelected: number;
  psyRead: number[];
  psyScores: Record<string,number>;
  psySelected: number;
  decisionRead:number[];
  decisionPassed:number[];
  decisionSelected:number;
  forgeRead:number[];
  forgePassed:number[];
  forgeSelected:number;
  ailRead?:number[];
  ailPassed?:number[];
  ailSelected?:number;
  rlxRead?:number[];
  rlxPassed?:number[];
  rlxSelected?:number;
  ceaiRead?:number[];
  ceaiPassed?:number[];
  ceaiSelected?:number;
}
export interface AcademyNext {
  number:number; title:string; action:"Read and study"|"Complete practice check"|"Mark reading reviewed"|"Review or retake quiz"|"Explore independently"; detail:string;
}
export interface AcademyCourseSummary {
  id:AcademyCourseId;
  title:string;
  code:string;
  route:"/course"|"/psychology-course"|"/decision-science"|"/forge-studies"|"/ail101"|"/relationalics"|"/ethnobotany";
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
  decision:{
    id:"decision",code:"HILADS",title:"Human Intelligence, Logic and AI Decision Science",
    route:"/decision-science",notice:"Twenty adapted reviews; complete 100-page Mabrig Korie textbook is in the private offline library. Institutional credit is not granted.",
  },
  ail101:{
    id:"ail101",code:"AIL 101",title:"AI Literacy and Human–AI Collaboration",
    route:"/ail101",notice:"Twenty original source-aligned reviews and formative quizzes. Full 100-page book remains private; not academic credit.",
  },
  rlx101:{id:"rlx101",...NEW_COURSE_META.rlx101},
  ceai401:{id:"ceai401",...NEW_COURSE_META.ceai401},
  forge:{
    id:"forge",code:"FS 101",title:"Introduction to Forge Studies",
    route:"/forge-studies",notice:"Ten weeks of independent review. Public project evidence and mentor validation are separate and NOT awarded in this app.",
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
 courses:AcademyCourseSummary[];
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

 function expanded(course:ExpansionCourse):AcademyCourseSummary{
   const all=getExpansion(course);
   const isDecision=course==="decision";
   const read=distinctKnown(isDecision?input.decisionRead:input.forgeRead,all.length);
   const passed=distinctKnown(isDecision?input.decisionPassed:input.forgePassed,all.length);
   const complete=read.filter(id=>passed.includes(id));
   const selected=isDecision?input.decisionSelected:input.forgeSelected;
   const next=all.find(x=>x.id===selected&&!complete.includes(x.id))||
      all.find(x=>!complete.includes(x.id));
   const action:AcademyNext["action"]=!next?"Explore independently":
      !read.includes(next.id)&&passed.includes(next.id)?"Mark reading reviewed":
      read.includes(next.id)&&!passed.includes(next.id)?"Review or retake quiz":"Read and study";
   const detail=!next?
      (isDecision?"All independent unit reviews recorded.":"Weekly self-study reviews finished; external project proof remains unverified."):
      action==="Mark reading reviewed"?"Read the complete unit and mark the review in the app.":
      action==="Review or retake quiz"?"Pass the source-aligned formative check.":"Read the source-aligned summary and try its practice question.";
   return {...ACADEMY_COURSE_META[course],
     total:all.length,completed:complete.length,percent:percent(complete.length,all.length),
     read:read.length,practised:passed.length,
     next:{number:next?.id??0,title:next?.title??"Self-study complete",action,detail}};
 }
 const decision=expanded("decision"),forge=expanded("forge");
 const ailRead=distinctKnown(input.ailRead??[],AIL101_UNITS.length);
 const ailPassed=distinctKnown(input.ailPassed??[],AIL101_UNITS.length);
 const ailCompleted=ailRead.filter(id=>ailPassed.includes(id));
 const ailNext=AIL101_UNITS.find(u=>u.id===input.ailSelected&&!ailCompleted.includes(u.id))||
   AIL101_UNITS.find(u=>!ailCompleted.includes(u.id));
 const ailAction:AcademyNext["action"]=!ailNext?"Explore independently":
   !ailRead.includes(ailNext.id)&&ailPassed.includes(ailNext.id)?"Mark reading reviewed":
   ailRead.includes(ailNext.id)&&!ailPassed.includes(ailNext.id)?"Review or retake quiz":"Read and study";
 const ail:AcademyCourseSummary={...ACADEMY_COURSE_META.ail101,
   total:AIL101_UNITS.length,completed:ailCompleted.length,
   percent:percent(ailCompleted.length,AIL101_UNITS.length),read:ailRead.length,practised:ailPassed.length,
   next:{number:ailNext?.id??0,title:ailNext?.title??"Self-study complete",action:ailAction,
     detail:!ailNext?"All independent AIL 101 review milestones recorded.":
       ailAction==="Mark reading reviewed"?"Practice is passed; complete the reading review.":
       ailAction==="Review or retake quiz"?"Pass this unit's formative reasoning check.":
       "Review the unit and try its source-aligned reasoning check."}
 };

 function additional(course:NewCourseId):AcademyCourseSummary{
   const units=getNewCourseUnits(course);
   const isRlx=course==="rlx101";
   const read=distinctKnown(isRlx?input.rlxRead:input.ceaiRead,units.length);
   const passed=distinctKnown(isRlx?input.rlxPassed:input.ceaiPassed,units.length);
   const completed=read.filter(id=>passed.includes(id));
   const selected=isRlx?input.rlxSelected:input.ceaiSelected;
   const next=units.find(x=>x.id===selected&&!completed.includes(x.id))||
     units.find(x=>!completed.includes(x.id));
   const action:AcademyNext["action"]=!next?"Explore independently":
     !read.includes(next.id)&&passed.includes(next.id)?"Mark reading reviewed":
     read.includes(next.id)&&!passed.includes(next.id)?"Review or retake quiz":"Read and study";
   return {...ACADEMY_COURSE_META[course],total:units.length,
     completed:completed.length,percent:percent(completed.length,units.length),
     read:read.length,practised:passed.length,
     next:{number:next?.id??0,title:next?.title??"Self-study complete",
       action,detail:!next?"All short independent review milestones recorded; instructor and domain reviews remain separate.":
         action==="Mark reading reviewed"?"Practice passed; read and mark the review.":
         action==="Review or retake quiz"?"Retake the formative check.":"Read the short source-aligned review and answer the practice question."}
   };
 }
 const rlx=additional("rlx101"),ceai=additional("ceai401");
 const courses=[logic,psy,decision,forge,ail,rlx,ceai];
 const total=courses.reduce((sum,x)=>sum+x.total,0),
    completed=courses.reduce((sum,x)=>sum+x.completed,0);
 return {courses,completed,total,percent:percent(completed,total)};
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
  if(!["logic","psy210","decision","forge","ail101","rlx101","ceai401"].includes(r.course as string))continue;
  if(typeof r.day!=="string")continue;
  const time=dayUTC(r.day);
  if(!Number.isFinite(time)||time>current||time<current-90*86400000)continue;
  const key=r.course+":"+r.day;
  if(seen.has(key))continue;
  seen.add(key);clean.push({day:r.day,course:r.course as AcademyCourseId});
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
     psy210:entries.filter(x=>x.course==="psy210").length,
     decision:entries.filter(x=>x.course==="decision").length,
     forge:entries.filter(x=>x.course==="forge").length,
     ail101:entries.filter(x=>x.course==="ail101").length,
     rlx101:entries.filter(x=>x.course==="rlx101").length,
     ceai401:entries.filter(x=>x.course==="ceai401").length}};
}
