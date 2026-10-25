import test from "node:test";
import assert from "node:assert/strict";
import { validateCircle, validateMaterial, validateTask, groundedReply, gradeQuiz, getProgress,
  type CourseMaterial, type StudyTask } from "../lib/study.ts";

const note: CourseMaterial = { id:"m1", circleId:"c1", title:"Governance Notes",
  content:"Public accountability means that public officials explain decisions and accept scrutiny.\n\nBudget transparency improves citizen oversight.", createdAt:0 };
test("validates circle and material input limits", () => {
  assert.ok(validateCircle("","PAD 101",""));
  assert.equal(validateCircle("Study group","PAD 101","Public Administration"),null);
  assert.ok(validateMaterial("","content"));
  assert.ok(validateMaterial("Notes","a".repeat(12001)));
});
test("retrieves matching source without invented model responses", () => {
  const found = groundedReply("What is public accountability?",[note]);
  assert.equal(found.matched,true);
  assert.equal(found.sourceTitle,"Governance Notes");
  assert.match(found.content,/officials explain decisions/);
  const missing = groundedReply("photosynthesis",[note]);
  assert.equal(missing.matched,false);
  assert.doesNotMatch(missing.content,/officials explain decisions/);
  assert.equal(groundedReply("anything",[]).matched,false);
});
test("micro-quiz input, scoring and progress are deterministic", () => {
  assert.ok(validateTask("Quiz","What?","micro-quiz",["Yes","No","Maybe"],4));
  assert.equal(validateTask("Quiz","What?","micro-quiz",["Yes","No","Maybe"],2),null);
  const task: StudyTask = { id:"t1",circleId:"c1",circleName:"One", title:"Test",type:"micro-quiz",
    prompt:"Question",options:["A","B","C"],correctIndex:1, status:"completed",createdAt:0,selectedIndex:1 };
  assert.equal(gradeQuiz(task,1),true);
  assert.equal(gradeQuiz(task,2),false);
  assert.equal(gradeQuiz(task,9),null);
  assert.deepEqual(getProgress([task]),{completed:1,total:1,percent:100,attemptedQuizzes:1,correctQuizzes:1});
});
