import test from "node:test";
import assert from "node:assert/strict";
import { elapsedFocusSeconds, learningSummary, sessionReflectionIssue, voluntaryLearningDigest,
 type FocusSession } from "../lib/focus.ts";
import type { StudyTask } from "../lib/study.ts";

const tasks: StudyTask[] = [
  {id:"a",circleId:"private-circle-1",circleName:"Private Study Circle",
    title:"Sensitive course",prompt:"Personal question",status:"completed",type:"micro-quiz",
    options:["option A","option B","option C"],selectedIndex:0,correctIndex:0,createdAt:1},
  {id:"b",circleId:"private-circle-1",circleName:"Private Study Circle",
    title:"Another task",status:"pending",type:"discussion",createdAt:2},
];
const sessions:FocusSession[] = [
 {id:"focus1",circleId:"private-circle-1",startedAt:1000,endedAt:61000,seconds:60,
  reflection:"Private notes about a learner"},
 {id:"focus2",circleId:"private-circle-1",startedAt:2000,endedAt:65000,seconds:63}
];
test("timer clamps invalid time changes and long sessions", ()=>{
  assert.equal(elapsedFocusSeconds(1000,10000),9);
  assert.equal(elapsedFocusSeconds(1000,900),0);
  assert.equal(elapsedFocusSeconds(-1,999),0);
  assert.equal(elapsedFocusSeconds(1000,1e12),4*60*60);
  assert.ok(sessionReflectionIssue("x".repeat(241)));
  assert.equal(sessionReflectionIssue("On track"),null);
});
test("summary is deterministic and excludes unverified attendance",()=>{
  assert.deepEqual(learningSummary(tasks,sessions),{
    taskCount:2,completedTaskCount:1,completionPercent:50,quizAttempts:1,
    correctQuizAttempts:1,focusSessions:2,focusMinutes:2,
  });
});
test("voluntary tutor digest contains only aggregate counts and disclosure",()=>{
  const digest=voluntaryLearningDigest(tasks,sessions);
  assert.match(digest,/Focus sessions saved: 2/);
  for (const secret of ["private-circle-1","Private Study Circle","Sensitive course",
   "Personal question","Private notes about a learner","option A","1000"])
    assert.ok(!digest.includes(secret), "Must not leak: "+secret);
  assert.match(digest,/Self-recorded/);
  assert.match(digest,/Small or distinctive aggregate values/);
});
