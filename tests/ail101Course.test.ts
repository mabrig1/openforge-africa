import test from "node:test";
import assert from "node:assert/strict";
import {AIL101_UNITS,AIL101_LABS,getAilUnit,ailAnswerIndex,
 checkAilAnswer,ailCompletion} from "../lib/ail101Course.ts";

test("AIL 101 source-aligned self-study covers 20 separate units and 7 studios",()=>{
 assert.equal(AIL101_UNITS.length,20);
 assert.equal(AIL101_LABS.length,7);
 assert.match(AIL101_UNITS[0].title,/AI Literacy/);
 assert.match(AIL101_UNITS[15].title,/Cybersecurity/);
 assert.match(AIL101_UNITS[19].title,/Strategy/);
 for(const x of AIL101_UNITS){
  assert.ok(x.title.length>15);
  assert.ok(x.overview.length>130);
  assert.ok(x.application.length>60);
  assert.equal(x.concepts.length,3);
  assert.ok(x.question.endsWith("?"));
  assert.notEqual(x.correct,x.distractors[0]);
  assert.notEqual(x.correct,x.distractors[1]);
  assert.ok(x.reason.length>40);
 }
});
test("three choices use a bounded deterministic key; invalid index or unit never awards a pass",()=>{
 for(const u of AIL101_UNITS){
  const answer=ailAnswerIndex(u.id);
  assert.ok(answer>=0&&answer<=2);
  assert.equal(checkAilAnswer(u.id,answer),true);
  assert.equal(checkAilAnswer(u.id,(answer+1)%3),false);
 }
 assert.equal(getAilUnit(-1),undefined);
 assert.equal(getAilUnit(21),undefined);
 assert.equal(checkAilAnswer(21,1),false);
 assert.equal(checkAilAnswer(1,3),false);
 assert.equal(checkAilAnswer(1,0.4),false);
 assert.equal(ailAnswerIndex(0),-1);
});
test("no inflated progress; reading and a correct check are independently required",()=>{
 assert.deepEqual(ailCompletion([1,1,3,99],[3,3,-3]),{total:20,completed:1,percent:5});
 assert.deepEqual(ailCompletion([1,2],[4,5]),{total:20,completed:0,percent:0});
 assert.deepEqual(ailCompletion(Array.from({length:20},(_,i)=>i+1),
 Array.from({length:20},(_,i)=>i+1)),{total:20,completed:20,percent:100});
});
