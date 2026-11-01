import test from "node:test";
import assert from "node:assert/strict";
import {
 SOUL_LESSONS,SOUL_WEEKS,SOUL_PRACTICUMS,
 soulLesson,soulCorrectIndex,soulCheck,soulProgress
} from "../lib/integratedSoulCourse.ts";

test("the six source weeks become twelve distinct optional seminar reviews",()=>{
 assert.equal(SOUL_WEEKS.length,6);
 assert.equal(SOUL_PRACTICUMS.length,6);
 assert.equal(SOUL_LESSONS.length,12);
 assert.deepEqual(SOUL_LESSONS.map(x=>x.week),[1,1,2,2,3,3,4,4,5,5,6,6]);
 assert.match(SOUL_WEEKS[0],/Architecture/);
 assert.match(SOUL_WEEKS[4],/Suffering/);
 assert.match(SOUL_PRACTICUMS[5],/Relational Blueprint/);
 const allTitles=new Set(SOUL_LESSONS.map(x=>x.title));
 assert.equal(allTitles.size,12);
 for(const unit of SOUL_LESSONS){
  assert.ok(unit.overview.length>180);
  assert.equal(unit.concepts.length,3);
  assert.match(unit.question,/\?$/);
  assert.ok(unit.reason.length>35);
  assert.ok(unit.scripture.length>5);
  assert.ok(unit.exercise.length>70);
  assert.notEqual(unit.correct,unit.wrong[0]);
  assert.notEqual(unit.correct,unit.wrong[1]);
 }
});
test("local formative checks reject invalid input and require a supported answer",()=>{
 for(const unit of SOUL_LESSONS){
  const i=soulCorrectIndex(unit.id);
  assert.ok(i>=0&&i<=2);
  assert.equal(soulCheck(unit.id,i),true);
  assert.equal(soulCheck(unit.id,(i+1)%3),false);
 }
 assert.equal(soulLesson(0),undefined);
 assert.equal(soulLesson(13),undefined);
 assert.equal(soulCorrectIndex(13),-1);
 assert.equal(soulCheck(13,-1),false);
 assert.equal(soulCheck(1,4),false);
 assert.equal(soulCheck(1,0.5),false);
});
test("no duplicate or bad ID inflates practice-and-reading achievements",()=>{
 assert.deepEqual(soulProgress([1,1,2,99],[2,2,-1]),{total:12,completed:1,percent:8});
 assert.deepEqual(soulProgress([1,2],[3,4]),{total:12,completed:0,percent:0});
 assert.deepEqual(soulProgress(Array.from({length:12},(_,i)=>i+1),
 Array.from({length:12},(_,i)=>i+1)),{total:12,completed:12,percent:100});
});
