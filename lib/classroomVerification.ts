/** Offline reproducible *synthetic* verification, not a model or a live deployment test. */
import {CLASSROOM_AGENTS,runClassroom,scheduleClassroom,validateClassroomRoster,
 type ClassroomAgentId} from "./openMaicClassroom.ts";
import {ACADEMY_COURSE_META,type AcademyCourseId} from "./academyDashboard.ts";
import {academyCourseReview,listAcademyClassroomUnits} from "./classroomAcademyBridge.ts";

export interface ProbeResult{id:string;passed:boolean;detail:string}
export interface ClassroomVerification {
 type:"synthetic-deterministic";
 agentCount:number;courseCount:number;courseReviewCount:number;
 modelDrivenAgents:0;deployedOpenMaic:false;
 teacherFirstRate:number;questionUnresolvedOpenRate:number;
 roleDispatchRate:number;probes:ProbeResult[];
 trace:{round:number;agentId:string;reason:string}[];
 passed:boolean;
}
const probe=(id:string,passed:boolean,detail:string):ProbeResult=>({id,passed,detail});
export function verifyClassroom():ClassroomVerification{
 const roleCount=validateClassroomRoster();
 const courses=Object.keys(ACADEMY_COURSE_META) as AcademyCourseId[];
 const checks:ProbeResult[]=[];
 checks.push(probe("registry-count",roleCount.total===15&&roleCount.teachers===1&&
  roleCount.assistants===1&&roleCount.classmates===13&&roleCount.unique,
  "Exactly 15 unique agents: 1 teacher, 1 assistant, 13 classmates."));
 let reviews=0;
 for(const id of courses){
  const all=listAcademyClassroomUnits(id);
  reviews+=all.length;
  const meta=ACADEMY_COURSE_META[id];
  const summary={...meta,completed:0,total:all.length,read:0,practised:0,percent:0,
   next:{number:all[0]?.id??0,title:all[0]?.title??"",action:"Read and study" as const,detail:""}},
   review=academyCourseReview(summary);
  checks.push(probe("course-"+id,all.length>0&&!!review.source.content.includes(review.unitTitle)&&
    review.source.id.startsWith("review_"+id+"_")&&review.source.content.length>=100,
    id+" provides "+all.length+" original public short review(s) with explicit source selection."));
 }
 const questions=[
  "What is a valid argument?","Why does gravity act?","How should we check evidence?",
  "Can we evaluate a claim?","Please explain statistics","Define reasoning"
 ];
 let first=0,open=0;
 for(const q of questions){
  const result=runClassroom({mode:"qa",topic:q,maxSpeakers:3});
  if(result.dispatched[0]?.agentId==="of-teacher")first++;
  if(result.closed===false&&result.questionUnanswered)open++;
 }
 checks.push(probe("teacher-first",first===questions.length,
  first+"/"+questions.length+" unanswered synthetic questions routed to Teacher first."));
 checks.push(probe("unresolved-never-closed",open===questions.length,
  open+"/"+questions.length+" no-source synthetic questions left open and flagged."));
 const seen=new Set<ClassroomAgentId>();
 for(const a of CLASSROOM_AGENTS){
  const run=runClassroom({mode:a.role==="student"?"discussion":"qa",
   topic:"Reasoning and evidence",selectedAgentId:a.id,maxSpeakers:5});
  if(run.turns.some(t=>t.agentId===a.id&&t.message.trim().length>=20))seen.add(a.id);
 }
 checks.push(probe("all-roles-execute",seen.size===CLASSROOM_AGENTS.length,
  seen.size+"/"+CLASSROOM_AGENTS.length+" separate agent IDs produced an actual local turn."));
 const selected:ClassroomAgentId="of-quiet-observer";
 const trace=scheduleClassroom({mode:"discussion",topic:"Reasoning discussion",
  selectedAgentId:selected,maxSpeakers:5});
 checks.push(probe("roundtable-sequencing",trace[0]?.agentId===selected&&
  trace[1]?.agentId==="of-teacher"&&new Set(trace.map(t=>t.agentId)).size===trace.length,
  "Selected classmate starts non-question roundtable; Teacher frames; no duplicate speakers."));
 const withNote=runClassroom({mode:"qa",topic:"argument validity?",maxSpeakers:3},[
  {id:"synthetic1",title:"Fictional teaching note",
   content:"Argument validity describes a deductive relation where the conclusion follows from the premises."}]);
 const noNote=runClassroom({mode:"qa",topic:"photosynthesis?",maxSpeakers:3});
 checks.push(probe("source-scope",withNote.turns[0].evidence.length===1&&
  noNote.turns[0].evidence.length===0,
  "Synthetic matching excerpt yields local source; no source yields none."));
 return {type:"synthetic-deterministic",agentCount:roleCount.total,courseCount:courses.length,
  courseReviewCount:reviews,modelDrivenAgents:0,deployedOpenMaic:false,
  teacherFirstRate:first/questions.length,
  questionUnresolvedOpenRate:open/questions.length,
  roleDispatchRate:seen.size/CLASSROOM_AGENTS.length,
  probes:checks,passed:checks.every(c=>c.passed),
  trace:trace.map(t=>({round:t.index,agentId:t.agentId,reason:t.reason}))};
}
