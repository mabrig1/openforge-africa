import test from "node:test";
import assert from "node:assert/strict";
import { buildStudyPack,parseStudyPack } from "../lib/studyPack.ts";
import type { StudyCircle,CourseMaterial,StudyTask } from "../lib/study.ts";
const circle:StudyCircle={id:"c1",name:"Study Friends",courseCode:"PAD 101",courseTitle:"Public Admin",memberCount:1,
  taskCount:0,lastActivity:"now",createdAt:0};
const note:CourseMaterial={id:"n1",circleId:"c1",title:"Lesson",content:"Accountability requires review of government decisions.",createdAt:0};
const task:StudyTask={id:"t1",circleId:"c1",circleName:"Study Friends",title:"Quiz",prompt:"What is accountability?",
  type:"micro-quiz",options:["Transparency","Travel","Rain"],correctIndex:0,status:"completed",createdAt:0,selectedIndex:0};
test("exports only study content and validates imported pack",()=>{
  const data=buildStudyPack(circle,[note],[task]);
  assert.doesNotMatch(data,/"selectedIndex"/);
  assert.doesNotMatch(data,/"status"/);
  const parsed=parseStudyPack(data);
  assert.equal(parsed.notes.length,1);
  assert.equal(parsed.tasks[0].correctIndex,0);
  assert.equal(parsed.name,"Study Friends");
  assert.equal(parseStudyPack(data).dedupeKey,parsed.dedupeKey);
});
test("rejects malformed, overlarge and untrusted shapes",()=>{
  assert.throws(()=>parseStudyPack("{"));
  assert.throws(()=>parseStudyPack("x".repeat(31000)));
  assert.throws(()=>parseStudyPack(JSON.stringify({format:"openforge-study-pack",version:1,
    circle:{name:"Bad",courseCode:"PAD 101",courseTitle:"Course"},notes:[{title:"n",content:""}],tasks:[]})));
  assert.throws(()=>parseStudyPack(JSON.stringify({format:"openforge-study-pack",version:1,
    circle:{name:"Bad",courseCode:"PAD 101",courseTitle:"Course"},notes:[],tasks:[{title:"Danger",prompt:"do it",type:"malware"}]})));
});
