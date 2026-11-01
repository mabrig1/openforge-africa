import test from "node:test";
import assert from "node:assert/strict";
import {CLASSROOM_AGENTS,scheduleClassroom,runClassroom,validateClassroomRoster,
 type ClassroomAgentId} from "../lib/openMaicClassroom.ts";
import {getFreeAccess,startFreeExplorer,spendFreeRun,trialIsActive} from "../lib/classroomAccess.ts";
const sample=[{id:"local1",title:"Logic reading",content:"An argument is valid if the conclusion necessarily follows from the premises."}];
test("15 valid distinct roles and OpenMAIC-compatible action names",()=>{
 const count=validateClassroomRoster();
 assert.deepEqual(count,{total:15,teachers:1,assistants:1,classmates:13,unique:true});
 assert.equal(new Set(CLASSROOM_AGENTS.map(a=>a.name)).size,15);
 assert.ok(CLASSROOM_AGENTS.every(a=>a.priority>=0&&a.priority<=100));
 assert.ok(CLASSROOM_AGENTS.every(a=>a.allowedActions.every(x=>x!=="speak"&&x!=="cue_user")));
 assert.ok(CLASSROOM_AGENTS.every(a=>a.id!=="default-1"&&a.role));
});
test("direct human question always dispatches Teacher first",()=>{
 for(const mode of ["qa","discussion"] as const){
  const route=scheduleClassroom({topic:"Why does an argument fail?",mode,
   selectedAgentId:"of-quiet-observer",maxSpeakers:5});
  assert.equal(route[0].agentId,"of-teacher");
  assert.ok(route.length<=5);
  assert.equal(new Set(route.map(d=>d.agentId)).size,route.length);
 }
});
test("ordinary QA rejects low-priority participation, even when selected",()=>{
 const route=scheduleClassroom({topic:"What is logic?",mode:"qa",
  selectedAgentId:"of-quiet-observer",maxSpeakers:3});
 assert.deepEqual(route.map(d=>d.agentId),["of-teacher","of-assistant"]);
});
test("discussion starts with chosen classmate and frames with teacher",()=>{
 const route=scheduleClassroom({topic:"Logic and thinking",mode:"discussion",
  selectedAgentId:"of-visual-learner",maxSpeakers:5});
 assert.equal(route[0].agentId,"of-visual-learner");
 assert.equal(route[1].agentId,"of-teacher");
 assert.equal(route.length,5);
});
test("explicit inquiry overrides chosen initiator; remaining classmates rotate",()=>{
 const first=scheduleClassroom({topic:"What is a valid argument?",mode:"discussion",
  selectedAgentId:"of-quiet-observer",maxSpeakers:5});
 assert.equal(first[0].agentId,"of-teacher");
 const older=["of-physics-questioner","of-math-misconception"] as ClassroomAgentId[];
 const next=scheduleClassroom({topic:"Logic discussion",mode:"discussion",
  recentAgentIds:older,maxSpeakers:5});
 assert.ok(!older.includes(next[2].agentId));
});
test("teacher is grounded or clearly refuses to invent missing source",()=>{
 const yes=runClassroom({topic:"What is a valid argument?",mode:"qa",maxSpeakers:3},sample);
 assert.equal(yes.turns[0].agentId,"of-teacher");
 assert.equal(yes.turns[0].evidence.length,1);
 assert.match(yes.turns[0].message,/conclusion necessarily follows/);
 const no=runClassroom({topic:"photosynthesis?",mode:"qa",maxSpeakers:3},sample);
 assert.equal(no.turns[0].evidence.length,0);
 assert.match(no.turns[0].message,/cannot verify/i);
 assert.equal(no.questionUnanswered,true);
 assert.equal(no.closed,false);
});
test("misconceptions are explicitly marked incorrect, not stated as fact",()=>{
 const response=runClassroom({topic:"Algebra discussion",mode:"discussion",
  selectedAgentId:"of-math-misconception",maxSpeakers:3},[]);
 assert.match(response.turns[0].message,/INTENTIONALLY INCORRECT/i);
});
test("daily quotas, 7-day free explorer, expiry and permanent Basic fall-back",()=>{
 const date="2026-11-01";
 let state={trialStartedOn:null,dailyUsage:{} as Record<string,number>};
 assert.deepEqual([getFreeAccess(state,date).maxRuns,getFreeAccess(state,date).maxSpeakers],[3,3]);
 for(let i=0;i<3;i++)state=spendFreeRun(state,date)!;
 assert.equal(getFreeAccess(state,date).remaining,0);
 assert.equal(spendFreeRun(state,date),null);
 state=startFreeExplorer(state,date);
 assert.equal(getFreeAccess(state,date).maxRuns,8);
 assert.equal(getFreeAccess(state,date).remaining,5);
 assert.equal(trialIsActive(date,"2026-11-07"),true);
 assert.equal(trialIsActive(date,"2026-11-08"),false);
 assert.equal(getFreeAccess(state,"2026-11-08").plan,"basic");
 assert.equal(getFreeAccess(state,"2026-11-08").remaining,3);
 assert.equal(startFreeExplorer(state,"2026-11-09").trialStartedOn,date);
});
test("invalid inputs fail cleanly without hidden actions",()=>{
 assert.throws(()=>scheduleClassroom({topic:"",mode:"qa",maxSpeakers:3}),/topic/);
 assert.throws(()=>scheduleClassroom({topic:"test",mode:"qa",maxSpeakers:99}),/Speaker limit/);
});
