import test from "node:test";
import assert from "node:assert/strict";
import {PSY210_MODULES,PSY210_WEEKS,PSY210_ASSESSMENTS,PSY210_ATTRIBUTION,
  psy210Completion,psy210GetModule,psy210ValidateCourse} from "../lib/psy210Course.ts";
test("six genuine course modules retain source alignment and licensing",()=>{
 assert.equal(psy210ValidateCourse().length,0);
 assert.equal(PSY210_MODULES.length,6);
 assert.equal(PSY210_MODULES.reduce((n,m)=>n+m.questions.length,0),18);
 assert.equal(PSY210_WEEKS.length,14);
 assert.equal(PSY210_ASSESSMENTS.reduce((n,[,v])=>n+v,0),100);
 assert.match(PSY210_ATTRIBUTION,/CC BY 4.0/);
 assert.match(psy210GetModule(5)!.overview,/not a diagnosis/);
});
test("every question has three choices and a bounded valid answer",()=>{
 for(const m of PSY210_MODULES){
  assert.ok(m.overview.length>200);
  assert.equal(m.concepts.length,4);
  for(const q of m.questions) {
   assert.equal(q.options.length,3);
   assert.ok(q.options[q.answer].length>8);
   assert.ok(q.rationale.length>20);
  }
 }
});
test("self-study progress needs reading plus 2/3 quiz, never assumes formal academic credit",()=>{
 assert.deepEqual(psy210Completion([],{}),{completed:0,total:6,percent:0,eligible:false});
 assert.equal(psy210Completion([1],{"1":1}).completed,0);
 assert.equal(psy210Completion([1],{"1":2}).completed,1);
 assert.equal(psy210Completion([1,2,3,4,5,6],{"1":2,"2":2,"3":2,"4":2,"5":2,"6":2}).eligible,true);
});
