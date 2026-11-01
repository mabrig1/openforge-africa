import test from "node:test";
import assert from "node:assert/strict";
import {ACADEMY_COURSE_META,type AcademyCourseId,
 type AcademyCourseSummary} from "../lib/academyDashboard.ts";
import {academyCourseReview,academyCourseExists,listAcademyClassroomUnits} from "../lib/classroomAcademyBridge.ts";
import {verifyClassroom} from "../lib/classroomVerification.ts";
import {runClassroom} from "../lib/openMaicClassroom.ts";
const ids=Object.keys(ACADEMY_COURSE_META) as AcademyCourseId[];
function sample(id:AcademyCourseId,nextId=1):AcademyCourseSummary{
 const meta=ACADEMY_COURSE_META[id],units=listAcademyClassroomUnits(id);
 const u=units.find(u=>u.id===nextId)!;
 return {id,...meta,total:units.length,completed:0,percent:0,
  read:0,practised:0,next:{number:u.id,title:u.title,
   action:"Read and study",detail:"Selected review"}};
}
test("all ten public Academy subject tracks provide a selectable real review",()=>{
 assert.equal(ids.length,10);
 const counts=ids.map(id=>listAcademyClassroomUnits(id).length);
 assert.deepEqual(counts.slice().sort((a,b)=>a-b),[6,7,10,12,12,20,20,23,24,24]);
 assert.equal(counts.reduce((a,b)=>a+b,0),158);
 for(const id of ids){
  assert.equal(academyCourseExists(id),true);
  const first=academyCourseReview(sample(id));
  assert.equal(first.courseId,id);
  assert.equal(first.unitId,1);
  assert.ok(first.source.title.includes(first.unitTitle));
  assert.ok(first.source.content.length>100);
  assert.ok(first.attribution.length>30);
  const last=academyCourseReview(sample(id),counts[ids.indexOf(id)]);
  assert.equal(last.unitId,counts[ids.indexOf(id)]);
  assert.throws(()=>academyCourseReview(sample(id),999),/Unknown course review/);
 }
});
test("course progress stays read only; source use requires explicit selection",()=>{
 const course=sample("logic",3);
 course.percent=40;
 const review=academyCourseReview(course);
 assert.equal(review.percent,40);
 const q="Deduction induction abduction validity?";
 const noConsent=runClassroom({topic:q,mode:"qa",maxSpeakers:3},[]);
 const withConsent=runClassroom({topic:q,mode:"qa",maxSpeakers:3},[review.source]);
 assert.equal(noConsent.turns[0].evidence.length,0);
 assert.equal(withConsent.turns[0].evidence.length,1);
 assert.ok(withConsent.turns[0].message.includes("From your notes"));
});
test("synthetic verification dashboard reports precise provenance and bounded scenario results",()=>{
 const report=verifyClassroom();
 assert.equal(report.type,"synthetic-deterministic");
 assert.equal(report.modelDrivenAgents,0);
 assert.equal(report.deployedOpenMaic,false);
 assert.equal(report.courseCount,10);
 assert.equal(report.courseReviewCount,158);
 assert.equal(report.agentCount,15);
 assert.equal(report.teacherFirstRate,1);
 assert.equal(report.questionUnresolvedOpenRate,1);
 assert.equal(report.roleDispatchRate,1);
 assert.ok(report.passed,JSON.stringify(report.probes.filter(x=>!x.passed)));
 assert.equal(report.probes.length,16);
 assert.equal(report.trace[0].agentId,"of-quiet-observer");
 assert.equal(report.trace[1].agentId,"of-teacher");
});

test("first-run lesson prompts for all ten courses find their included public review",()=>{
 for(const id of ids){
  const selected=sample(id);
  const review=academyCourseReview(selected);
  const result=runClassroom({topic:"Explain "+review.unitTitle+
   " using the selected lesson review",mode:"qa",maxSpeakers:3},[review.source]);
  assert.equal(result.dispatched[0].agentId,"of-teacher");
  assert.equal(result.turns[0].evidence.length,1,"Missing default source: "+id);
  assert.equal(result.questionUnanswered,false,"Unexpected empty lesson: "+id);
  assert.ok(result.turns[0].message.length>80);
 }
});
