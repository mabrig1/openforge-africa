import test from "node:test";
import assert from "node:assert/strict";
import {DECISION_UNITS,FORGE_WEEKS,FORGE_WEIGHTS,FORGE_MILESTONES,DECISION_LABS,
  correctExpansionAnswer,expansionCompletion} from "../lib/academyExpansion.ts";
test("authored 100-page decision science source has 20 native reviews and seven labs",()=>{
 assert.equal(DECISION_UNITS.length,20);
 assert.equal(DECISION_LABS.length,7);
 assert.match(DECISION_UNITS[10].title,/Bayesian/);
 assert.match(DECISION_UNITS[15].title,/Decision Theory/);
 for(const x of DECISION_UNITS){
   assert.ok(x.overview.length>150);
   assert.equal(x.concepts.length,3);
   assert.ok(x.application.length>35);
   assert.ok(x.correct.length>24);
   assert.ok(x.reason.length>25);
   assert.notEqual(x.correct,x.distractors[0]);
 }
});
test("FS 101 syllabus retains ten weekly artifacts, five externally verified milestones and 100 percent assessment weighting",()=>{
 assert.equal(FORGE_WEEKS.length,10);
 assert.equal(FORGE_MILESTONES.length,5);
 assert.equal(FORGE_WEIGHTS.reduce((sum,x)=>sum+x[1],0),100);
 assert.equal(FORGE_WEEKS[0].artifact,"One-page Problem Brief");
 assert.match(FORGE_WEEKS[7].proof,/user count/);
 assert.match(FORGE_WEEKS[9].proof,/panel review/);
 for(const x of FORGE_WEEKS){
   assert.ok(x.artifact&&x.proof&&x.phase);
   assert.ok(x.overview.length>70);
 }
});
test("formative answers are bounded and independent study always needs both reading and check",()=>{
 assert.equal(correctExpansionAnswer("decision",6,1),true);
 assert.equal(correctExpansionAnswer("forge",3,0),true);\n assert.equal(correctExpansionAnswer("decision",2,2),true);
 assert.equal(correctExpansionAnswer("forge",3,0),false);
 assert.equal(correctExpansionAnswer("decision",24,1),false);
 assert.equal(correctExpansionAnswer("forge",1,99),false);
 assert.deepEqual(expansionCompletion("decision",[1,1,3,99],[3,3,66]),
  {total:20,completed:1,percent:5});
 assert.deepEqual(expansionCompletion("forge",[1,3,11],[3,5]),
  {total:10,completed:1,percent:10});
});
