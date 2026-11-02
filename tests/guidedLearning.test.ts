import test from "node:test";
import assert from "node:assert/strict";
import {getLessonCheck,gradeCheck,getCourseAssessment,nextUnlockedUnit} from "../lib/guidedLearning.ts";
import {scoreVoice,bestAvailableVoice,orderSpeechVoices} from "../lib/voiceSelection.ts";
import {ACADEMY_COURSE_META,type AcademyCourseId} from "../lib/academyDashboard.ts";
import {listAcademyClassroomUnits} from "../lib/classroomAcademyBridge.ts";
const courses=Object.keys(ACADEMY_COURSE_META) as AcademyCourseId[];
test("all ten Academy courses have genuine graded checks for every one of 158 public reviews",()=>{
 let total=0;
 for(const course of courses){
  const units=listAcademyClassroomUnits(course);
  for(const u of units){
   const check=getLessonCheck(course,u.id);
   assert.equal(check.title,u.title,course+":"+u.id);
   assert.ok(check.items.length>=1);
   assert.ok(check.passMark>=1&&check.passMark<=check.items.length);
   for(const item of check.items){
    assert.equal(item.options.length,3);
    assert.ok(item.options[item.answer].length>8);
    assert.equal(new Set(item.options).size,3);
    assert.ok(item.rationale.length>15);
   }
   const answer=check.items.map(i=>i.answer);
   const score=gradeCheck(check,answer);
   assert.equal(score.score,check.items.length);
   assert.equal(score.passed,true);
   const wrong=gradeCheck(check,check.items.map(q=>(q.answer+1)%3));
   assert.equal(wrong.score,0);
   assert.equal(wrong.passed,false);
  }
  total+=units.length;
  const assessment=getCourseAssessment(course,units.length);
  assert.equal(assessment.items.length,3);
  assert.equal(assessment.passMark,2);
  assert.equal(gradeCheck(assessment,assessment.items.map(q=>q.answer)).passed,true);
 }
 assert.equal(total,158);
});
test("PSY 210 uses its authentic three-item assessment and two-correct pass mark",()=>{
 const check=getLessonCheck("psy210",1);
 assert.equal(check.items.length,3);
 assert.equal(check.passMark,2);
 assert.equal(gradeCheck(check,[1,0,0]).score,2);
 assert.equal(gradeCheck(check,[1,0,0]).passed,true);
 assert.equal(gradeCheck(check,[1,1,0]).passed,false);
});
test("missing, invalid and incomplete answers cannot earn completion",()=>{
 const c=getLessonCheck("logic",1);
 assert.throws(()=>gradeCheck(c,[]),/Answer every/);
 assert.throws(()=>gradeCheck(c,[3]),/Answer every/);
 assert.throws(()=>getLessonCheck("logic",999),/No published/);
 assert.throws(()=>getCourseAssessment("logic",2),/three units/);
});
test("sequential unlock uses first incomplete lesson even if later lessons are marked passed",()=>{
 assert.equal(nextUnlockedUnit(4,()=>false),1);
 assert.equal(nextUnlockedUnit(4,n=>n===1),2);
 assert.equal(nextUnlockedUnit(4,n=>n!==3),3);
 assert.equal(nextUnlockedUnit(4,()=>true),5);
});
test("Nigerian enhanced male-name voice is preferred only if actually installed; saved voice takes precedence",()=>{
 const voices=[
  {id:"low",name:"Basic",lang:"en-US",quality:"standard" as const},
  {id:"abeo",name:"Abeo Neural",lang:"en-NG",quality:"enhanced" as const},
  {id:"uk",name:"Ryan Natural",lang:"en-GB",quality:"enhanced" as const}
 ];
 assert.equal(orderSpeechVoices(voices)[0].id,"abeo");
 assert.ok(scoreVoice(voices[1])>scoreVoice(voices[2]));
 assert.equal(bestAvailableVoice(voices,"uk")?.id,"uk");
 assert.equal(bestAvailableVoice(voices,"deleted")?.id,"abeo");
 assert.equal(bestAvailableVoice([]),null);
});
