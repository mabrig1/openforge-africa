import test from "node:test";
import assert from "node:assert/strict";
import {
 CLEAR_SIGHT_MODULES,CLEAR_SIGHT_UNITS,CLEAR_SIGHT_PRACTICUMS,
 clearSightUnit,clearSightCorrectIndex,clearSightCheck,
 clearSightProgress,binaryBrierScore
} from "../lib/clearSightCourse.ts";

test("source-aligned Clear Sight maps six modules into 24 distinct review checkpoints",()=>{
 assert.equal(CLEAR_SIGHT_MODULES.length,6);
 assert.equal(CLEAR_SIGHT_UNITS.length,24);
 assert.equal(CLEAR_SIGHT_PRACTICUMS.length,7);
 assert.deepEqual(CLEAR_SIGHT_UNITS.map(x=>x.module),
  [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6]);
 assert.equal(new Set(CLEAR_SIGHT_UNITS.map(x=>x.title)).size,24);
 assert.match(CLEAR_SIGHT_MODULES[3],/Calibration/);
 assert.match(CLEAR_SIGHT_MODULES[4],/Hostile Environments/);
 for(const lesson of CLEAR_SIGHT_UNITS){
  assert.ok(lesson.source.length>10);
  assert.ok(lesson.overview.length>180);
  assert.equal(lesson.cues.length,3);
  assert.ok(lesson.task.length>85);
  assert.ok(lesson.question.endsWith("?"));
  assert.ok(lesson.reason.length>50);
  assert.notEqual(lesson.correct,lesson.wrong[0]);
  assert.notEqual(lesson.correct,lesson.wrong[1]);
 }
});
test("quiz choice keys reject invalid and mismatched identifiers",()=>{
 assert.ok(new Set(CLEAR_SIGHT_UNITS.map(x=>clearSightCorrectIndex(x.id))).size>=3);
 for(const x of CLEAR_SIGHT_UNITS){
  const answer=clearSightCorrectIndex(x.id);
  assert.ok(answer>=0&&answer<=2);
  assert.equal(clearSightCheck(x.id,answer),true);
  assert.equal(clearSightCheck(x.id,(answer+1)%3),false);
 }
 assert.equal(clearSightUnit(0),undefined);
 assert.equal(clearSightUnit(25),undefined);
 assert.equal(clearSightCorrectIndex(25),-1);
 assert.equal(clearSightCheck(25,-1),false);
 assert.equal(clearSightCheck(1,3),false);
 assert.equal(clearSightCheck(1,-1),false);
 assert.equal(clearSightCheck(1,0.4),false);
});
test("a milestone needs both reading and a passed question; duplicate or invalid IDs ignored",()=>{
 assert.deepEqual(clearSightProgress([1,1,2,100],[2,2,-1]),{total:24,completed:1,percent:4});
 assert.deepEqual(clearSightProgress([1,2],[3,4]),{total:24,completed:0,percent:0});
 assert.deepEqual(clearSightProgress(Array.from({length:24},(_,i)=>i+1),
  Array.from({length:24},(_,i)=>i+1)),{total:24,completed:24,percent:100});
});
test("Brier calibration is mathematically valid on synthetic events and rejects invalid input",()=>{
 assert.ok(Math.abs(binaryBrierScore(.7,1)!-.09)<1e-10);
 assert.ok(Math.abs(binaryBrierScore(.7,0)!-.49)<1e-10);
 assert.equal(binaryBrierScore(1,1),0);
 assert.equal(binaryBrierScore(0,1),1);
 assert.equal(binaryBrierScore(.3,2),null);
 assert.equal(binaryBrierScore(1.1,0),null);
 assert.equal(binaryBrierScore(-.01,1),null);
 assert.equal(binaryBrierScore(Number.NaN,1),null);
 assert.equal(binaryBrierScore(.5,.5),null);
});
