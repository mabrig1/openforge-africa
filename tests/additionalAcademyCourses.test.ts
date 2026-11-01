import test from "node:test";
import assert from "node:assert/strict";
import {RLX_UNITS,CEAI_UNITS,getNewCourseUnit,newCourseCorrectIndex,
 checkNewCourseAnswer,newCourseCompletion,NEW_COURSE_META} from "../lib/additionalAcademyCourses.ts";

test("RLX 101 source mapping preserves all twelve Relationalics weeks and required learning themes",()=>{
 assert.equal(RLX_UNITS.length,12);
 assert.match(RLX_UNITS[0].title,/Relational Turn/);
 assert.match(RLX_UNITS[5].title,/Trust/);
 assert.match(RLX_UNITS[7].title,/Displacement/);
 assert.match(RLX_UNITS[9].title,/Faith/);
 assert.match(RLX_UNITS[11].title,/Capstone/);
 assert.match(NEW_COURSE_META.rlx101.notice,/not.*credential/i);
});
test("CEAI-401 preserves seven research chapters and never equates predicted chemistry with clinical approval",()=>{
 assert.equal(CEAI_UNITS.length,7);
 assert.match(CEAI_UNITS[1].title,/Fingerprint/);
 assert.match(CEAI_UNITS[3].title,/Toxicity/);
 assert.match(CEAI_UNITS[6].title,/Indigenous/);
 assert.match(NEW_COURSE_META.ceai401.notice,/cannot validate herb safety/);
 for(const x of CEAI_UNITS){
  assert.ok(x.overview.length>150);
  assert.ok(!/approved for (human )?(consumption|ingestion|clinical use)/i.test(x.correct));
  assert.ok(x.task.length>65);
 }
});
test("all nineteen formative quizzes are bounded, explained, and answer positions vary",()=>{
 for(const [course,items] of [["rlx101",RLX_UNITS],["ceai401",CEAI_UNITS]] as const){
  assert.ok(new Set(items.map(x=>newCourseCorrectIndex(course,x.id))).size>=3);
  for(const x of items){
   assert.equal(x.concepts.length,3);
   assert.ok(x.question.endsWith("?"));
   assert.ok(x.feedback.length>45);
   const answer=newCourseCorrectIndex(course,x.id);
   assert.equal(checkNewCourseAnswer(course,x.id,answer),true);
   assert.equal(checkNewCourseAnswer(course,x.id,(answer+1)%3),false);
   assert.notEqual(x.correct,x.incorrect[0]);
   assert.notEqual(x.correct,x.incorrect[1]);
  }
  assert.equal(getNewCourseUnit(course,0),undefined);
  assert.equal(getNewCourseUnit(course,99),undefined);
  assert.equal(checkNewCourseAnswer(course,0,-1),false);
  assert.equal(checkNewCourseAnswer(course,1,-1),false);
  assert.equal(checkNewCourseAnswer(course,1,3),false);
 }
});
test("local counts require both reading and passed quiz, and are not inflated by bad identifiers",()=>{
 assert.deepEqual(newCourseCompletion("rlx101",[1,1,4,22],[4,4,30]),
  {completed:1,total:12,percent:8});
 assert.deepEqual(newCourseCompletion("ceai401",[1,2,8],[2,9]),
  {completed:1,total:7,percent:14});
 assert.deepEqual(newCourseCompletion("ceai401",[1,2,3,4,5,6,7],[1,2,3,4,5,6,7]),
  {completed:7,total:7,percent:100});
});
