import test from "node:test";
import assert from "node:assert/strict";
import {localDay,pilotDay,pilotIssue,addPilotCheckIn,pilotSummary,optionalPilotDigest,
  type LocalPilot,type PilotCheckIn} from "../lib/pilot.ts";
const initial:LocalPilot={circleId:"PRIVATE COURSE PAD101",startedDay:"2026-10-25",checkIns:[]};
const entry:PilotCheckIn={day:"2026-10-25",mode:"in-person",barrier:"data",helpfulness:4};
test("calendar is exactly seven local civil days",()=>{
  assert.equal(pilotDay(initial,"2026-10-25"),1);
  assert.equal(pilotDay(initial,"2026-10-31"),7);
  assert.equal(pilotDay(initial,"2026-11-01"),null);
  assert.equal(pilotDay(initial,"2026-10-24"),null);
  assert.equal(pilotDay(initial,"2026-02-30"),null);
  assert.equal(localDay(new Date(2026,9,25,23,55)),"2026-10-25");
});
test("duplicate, malformed and out-of-window entries are rejected",()=>{
  const saved=addPilotCheckIn(initial,entry);
  assert.ok(saved);
  assert.equal(initial.checkIns.length,0);
  assert.equal(saved.checkIns.length,1);
  assert.match(pilotIssue(saved,entry)??"",/already checked in/i);
  assert.equal(addPilotCheckIn(saved,entry),null);
  assert.match(pilotIssue(initial,{...entry,helpfulness:9 as any})??"",/valid/i);
  assert.match(pilotIssue(initial,{...entry,mode:"video call" as any})??"",/valid/i);
  assert.match(pilotIssue(initial,{...entry,day:"2026-11-01"})??"",/days 1–7/);
});
test("digest contains counts, warnings, no sensitive labels or dates",()=>{
  const pilot=addPilotCheckIn(initial,entry)!;
  assert.deepEqual(pilotSummary([pilot]),{pilots:1,checkIns:1,peerSessions:1,
    soloSessions:0,barrierDays:1,usefulnessResponses:1,averageUsefulness:4});
  const digest=optionalPilotDigest([pilot]);
  for(const secret of ["PRIVATE COURSE","PAD101","2026-10-25","in-person","data"])
    assert.ok(!digest.includes(secret),"Must not leak: "+secret);
  assert.match(digest,/not independently verified/i);
  assert.match(digest,/Small numbers/);
});
test("corrupted duplicate entries cannot inflate report",()=>{
  const corrupt={...initial,checkIns:[entry,entry,{...entry,day:"2026-11-01"}]};
  assert.equal(pilotSummary([corrupt]).checkIns,1);
});
