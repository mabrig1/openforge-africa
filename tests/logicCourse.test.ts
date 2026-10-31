import test from "node:test";
import assert from "node:assert/strict";
import { getLogicCreditProposals, LOGIC_PROGRAM_MODULES, LCT_201_WEEKS } from "../lib/logicSyllabus.ts";
import {
  LOGIC_LESSONS,LOGIC_COURSE_PARTS,getLogicLesson,
  logicCourseCompletion,validateLogicCourse,
} from "../lib/logicCourse.ts";

test("complete self-study programme has 23 distinct chapters and 4 source-aligned parts",()=>{
  assert.equal(validateLogicCourse(),true);
  assert.equal(LOGIC_LESSONS.length,23);
  assert.equal(LOGIC_COURSE_PARTS.length,4);
  assert.equal(new Set(LOGIC_LESSONS.map(c=>c.id)).size,23);
  assert.deepEqual([1,7,8,15,16,19,20,23].map(n=>getLogicLesson(n)?.part),
    [1,1,2,2,3,3,4,4]);
  assert.match(getLogicLesson(1)?.overview??"",/CLEAR/);
  assert.match(getLogicLesson(10)?.overview??"",/2\^n/);
  assert.match(getLogicLesson(23)?.overview??"",/capstone/);
  assert.equal(getLogicLesson(24),null);
});
test("all formative questions have exactly one safe answer index",()=>{
  LOGIC_LESSONS.forEach(lesson=>{
    assert.equal(lesson.question.choices.length,3);
    assert.ok(lesson.question.choices.every(s=>s.trim().length>=5));
    assert.equal(Number.isInteger(lesson.question.answer),true);
    assert.ok(lesson.question.answer>=0 && lesson.question.answer<3);
    assert.equal(new Set(lesson.question.choices).size,3);
    assert.match(lesson.source,/2026/);
  });
});
test("completion cannot be inflated by duplicates, invalid chapters, or only reading",()=>{
  assert.deepEqual(logicCourseCompletion([],[]),{completed:0,total:23,percent:0,eligible:false});
  assert.deepEqual(logicCourseCompletion([1,1,999],[1,1,999]),
    {completed:1,total:23,percent:4,eligible:false});
  assert.equal(logicCourseCompletion([1,2],[2]).completed,1);
  const all=LOGIC_LESSONS.map(c=>c.id);
  assert.equal(logicCourseCompletion(all,all).eligible,true);
  assert.equal(logicCourseCompletion(all.slice(0,-1),all).eligible,false);
});

test("suggested programme has 18 core and 6 elective credits, with 12-week formal-logic plan",()=>{
 const credits=getLogicCreditProposals();
 assert.deepEqual(credits,{core:18,optional:6,appliedGradeWeight:100});
 assert.equal(LOGIC_PROGRAM_MODULES.length,8);
 assert.equal(LCT_201_WEEKS.length,12);
 assert.deepEqual(LCT_201_WEEKS.map(w=>w.week),Array.from({length:12},(_,i)=>i+1));
 assert.match(LCT_201_WEEKS[7].assessment,/25%/);
 assert.match(LCT_201_WEEKS[11].assessment,/45%/);
});
