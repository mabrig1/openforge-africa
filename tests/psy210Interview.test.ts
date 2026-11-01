import test from "node:test";
import assert from "node:assert/strict";
import {PSY210_CLIENTS,psy210ValidSession,psy210InterviewProgress} from "../lib/psy210Interview.ts";
test("three fictional five-step interviews branch with complete responses",()=>{
 assert.equal(PSY210_CLIENTS.length,3);
 for(const c of PSY210_CLIENTS){
  assert.equal(c.turns.length,5);
  for(const t of c.turns){
    assert.equal(t.choices.length,3);
    assert.equal(t.replies.length,3);
    assert.ok(t.replies.every(r=>r.length>8));
    assert.ok(t.explanation.length>20);
    assert.ok(Number.isInteger(t.best)&&t.best>=0&&t.best<3);
  }
 }
});
test("choice indexes are sole session content and validation excludes arbitrary data",()=>{
 assert.equal(psy210ValidSession(0,[]),true);
 assert.equal(psy210ValidSession(2,[0,1,2,0,1]),true);
 for(const v of [-1,3,NaN])assert.equal(psy210ValidSession(v,[]),false);
 assert.equal(psy210ValidSession(0,[4]),false);
 assert.equal(psy210ValidSession(0,[0,0,0,0,0,0]),false);
 assert.equal(psy210ValidSession(0,["sensitive identity data"] as any),false);
 const optimal=PSY210_CLIENTS[0].turns.map(t=>t.best);
 assert.deepEqual(psy210InterviewProgress(0,optimal),{turns:5,modelResponses:5,finished:true});
 assert.equal(psy210InterviewProgress(0,[0]).turns,1);
 assert.equal(psy210InterviewProgress(0,[9]).turns,0);
});
