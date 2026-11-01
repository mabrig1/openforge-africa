import test from "node:test";
import assert from "node:assert/strict";
import {AGENTS,runAgent,type AgentInput} from "../lib/agenticUniversity.ts";
const base:AgentInput={
 course:{id:"logic",code:"LCT DEMO",title:"Logic and Critical Thinking",
  route:"/course",percent:25,next:{number:2,title:"Argument validity",action:"Read and study",detail:"Review"}},
 question:"What is argument validity?",sessions:1,weeklyTarget:3,
 notes:[{id:"n1",title:"Logic Notes",
  content:"Argument validity means that if the premises are true, the conclusion must follow."}],
};
test("12 distinct registered roles are callable",()=>{
 assert.equal(AGENTS.length,12);
 assert.equal(new Set(AGENTS.map(a=>a.id)).size,12);
 for(const a of AGENTS){
  const r=runAgent(a.id,base);
  assert.equal(r.agent,a.id);
  assert.ok(r.steps.length);
  assert.ok(r.notice);
 }
});
test("tutor and library cite only selected matched local notes",()=>{
 for(const id of ["tutor","library"] as const){
  const found=runAgent(id,base);
  assert.equal(found.status,"ready");
  assert.deepEqual(found.evidence,[{id:"n1",title:"Logic Notes"}]);
  const absent=runAgent(id,{...base,notes:[]});
  assert.equal(absent.status,"needs-source");
  assert.deepEqual(absent.evidence,[]);
 }
});
test("unmatched source requests never invent retrieved passages",()=>{
 const result=runAgent("tutor",{...base,question:"photosynthesis"});
 assert.equal(result.status,"needs-source");
 assert.deepEqual(result.evidence,[]);
 assert.doesNotMatch(result.steps.join(" "),/the premises are true/i);
});
test("coordinator delegates three nonrecursive read-only specialists",()=>{
 const result=runAgent("coordinator",base);
 assert.deepEqual(result.delegates,["adviser","professor","assessment"]);
 assert.equal(result.steps.length,4);
 assert.equal(result.status,"human-review");
});
test("reject long prompts and unknown agents",()=>{
 assert.throws(()=>runAgent("unknown" as any,base),/Unknown agent/);
 assert.throws(()=>runAgent("tutor",{...base,question:"x".repeat(501)}),/500/);
});
test("drafts are text-only and require an explicit UI action",()=>{
 assert.match(runAgent("multimedia",base).draft??"",/Scene 4/);
 assert.match(runAgent("accessibility",base).draft??"",/Argument validity/i);
});
