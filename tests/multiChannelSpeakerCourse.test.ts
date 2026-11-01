import test from "node:test";
import assert from "node:assert/strict";
import {SPEAKER_WEEKS,SPEAKER_LAYERS,SPEAKER_UNITS,SPEAKER_CAPSTONE,
 getSpeakerUnit,speakerCorrectIndex,checkSpeakerAnswer,speakerCompletion,
 BEACON_SYNTHETIC,beaconFollowUpRate} from "../lib/multiChannelSpeakerCourse.ts";
test("source structure: eight weeks, four layers, three native review stages per week",()=>{
 assert.equal(SPEAKER_WEEKS.length,8);
 assert.equal(SPEAKER_LAYERS.length,4);
 assert.equal(SPEAKER_UNITS.length,24);
 assert.deepEqual(SPEAKER_UNITS.map(x=>x.week),Array.from({length:8},(_,i)=>[i+1,i+1,i+1]).flat());
 assert.equal(new Set(SPEAKER_UNITS.map(x=>x.title)).size,24);
 assert.match(SPEAKER_WEEKS[0],/Audience Calibration/);
 assert.match(SPEAKER_WEEKS[7],/Capstone/);
 for(const x of SPEAKER_UNITS){
   assert.ok(x.overview.length>=160);
   assert.ok(x.exercise.length>60);
   assert.ok(x.question.endsWith("?"));
   assert.ok(x.reason.length>40);
   assert.match(x.sourcePages,/^\d+–\d+$/);
   assert.notEqual(x.correct,x.wrong[0]);
   assert.notEqual(x.correct,x.wrong[1]);
 }
});
test("speaker choices reject nonexistent and malformed replies",()=>{
 for(const x of SPEAKER_UNITS){
  const i=speakerCorrectIndex(x.id);
  assert.equal(checkSpeakerAnswer(x.id,i),true);
  assert.equal(checkSpeakerAnswer(x.id,(i+1)%3),false);
 }
 assert.equal(getSpeakerUnit(0),undefined);
 assert.equal(getSpeakerUnit(25),undefined);
 assert.equal(speakerCorrectIndex(25),-1);
 assert.equal(checkSpeakerAnswer(25,-1),false);
 assert.equal(checkSpeakerAnswer(1,-1),false);
 assert.equal(checkSpeakerAnswer(1,3),false);
 assert.equal(checkSpeakerAnswer(1,0.5),false);
});
test("speaker progress needs independent reading and correct quiz and protects against duplicate ids",()=>{
 assert.deepEqual(speakerCompletion([1,1,2,25],[2,2,200]),{completed:1,total:24,percent:4});
 assert.deepEqual(speakerCompletion([1,2],[3,4]),{completed:0,total:24,percent:0});
 assert.deepEqual(speakerCompletion(Array.from({length:24},(_,i)=>i+1),
  Array.from({length:24},(_,i)=>i+1)),{completed:24,total:24,percent:100});
});
test("fictional Project Beacon numbers and source three-channel capstone are reported accurately",()=>{
 assert.deepEqual(BEACON_SYNTHETIC,{enrolled:240,returned:96,pilotBudgetNGN:450000});
 assert.equal(beaconFollowUpRate(),0.4);
 assert.equal(Object.keys(SPEAKER_CAPSTONE).length,3);
 assert.match(SPEAKER_CAPSTONE.briefing,/One-page/);
 assert.match(SPEAKER_CAPSTONE.video,/Three-minute/);
 assert.match(SPEAKER_CAPSTONE.live,/Five-minute/);
});
