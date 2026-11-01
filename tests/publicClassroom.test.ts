import test from "node:test";
import assert from "node:assert/strict";
import {handlePublicClassroom,publicClassroomReady} from "../worker/publicClassroom.ts";
import type {PublicClassroomEnv} from "../worker/publicClassroom.ts";
const origin="https://example.org";
const note={id:"public_logic_1",title:"Logic overview",excerpt:"Deductive validity means that the conclusion follows from the premises."};
const payload={agentId:"of-teacher",question:"What is deductive validity?",sources:[note]};
const ctx={access:{getIdentity:async()=>({id:"stable-access-learner-123456"})}};
function env(){
 const ops:string[]=[];
 const mock={
  getByName:()=>({fetch:async(req:Request)=>{
   const body=await req.json() as {kind:string;account:string};
   ops.push(body.kind);
   assert.match(body.account,/^[0-9a-f]{64}$/);
   return new Response(JSON.stringify({accepted:true,quota:{
    plan:"basic",limit:1,used:1,remaining:0,canUse:false,
    canStartTrial:true,trialStarted:null,globalCapacityAvailable:true,
   }}),{status:200,headers:{"Content-Type":"application/json"}});
  }})
 };
 const data:PublicClassroomEnv={
  OPENFORGE_PUBLIC_AI_ENABLED:"true",
  OPENFORGE_PUBLIC_AI_DAILY_CAP:"3",OPENFORGE_PUBLIC_AI_MONTHLY_CAP:"50",
  OPENFORGE_IDENTITY_SALT:"b".repeat(64),
  OPENROUTER_API_KEY:"local-dummy-no-provider",
  OPENROUTER_MODEL:"test-model-only",
  CLASSROOM_TRIAL_LEDGER:mock,
 };
 return {data,ops};
}
const ask=(body:unknown=payload,extra:Record<string,string>={})=>
 new Request(origin+"/api/classroom-public/ask",{
  method:"POST",headers:{"Content-Type":"application/json","Origin":origin,...extra},
  body:JSON.stringify(body),
 });
test("disabled public trial never authenticates or calls a provider",async()=>{
 const e=env();
 e.data.OPENFORGE_PUBLIC_AI_ENABLED="false";
 assert.equal(publicClassroomReady(e.data),false);
 const reply=await handlePublicClassroom(ask(),e.data,ctx,"/api/classroom-public/ask");
 assert.equal(reply.status,503);assert.deepEqual(e.ops,[]);
});
test("Access identity required; reject spoofed identity headers and cross-origin writes",async()=>{
 const e=env();
 const spoof=ask(payload,{"Cf-Access-Authenticated-User-Email":"spoofed@example.com"});
 assert.equal((await handlePublicClassroom(spoof,e.data,{},"/api/classroom-public/ask")).status,401);
 const bad=ask(payload,{"Origin":"https://evil.example"});
 assert.equal((await handlePublicClassroom(bad,e.data,ctx,"/api/classroom-public/ask")).status,403);
 const noStable={access:{getIdentity:async()=>({email:"unknown@example.org"})}};
 assert.equal((await handlePublicClassroom(ask(),e.data,noStable,"/api/classroom-public/ask")).status,401);
 assert.deepEqual(e.ops,[]);
});
test("authenticated preview uses quota first and exactly one mocked model request",async()=>{
 const e=env();
 const original=globalThis.fetch;
 const models:{path:string;body:any}[]=[];
 globalThis.fetch=(async(url:RequestInfo|URL,init?:RequestInit)=>{
  models.push({path:String(url),body:JSON.parse(String(init?.body))});
  return new Response(JSON.stringify({choices:[{message:{content:"The conclusion follows logically."}}]}),{
   status:200,headers:{"Content-Type":"application/json"},
  });
 }) as typeof fetch;
 try{
  const status=await handlePublicClassroom(new Request(origin+"/api/classroom-public/status"),
   e.data,ctx,"/api/classroom-public/status");
  assert.equal(status.status,200);
  assert.deepEqual(e.ops,["status"]);
  const activation=await handlePublicClassroom(new Request(origin+"/api/classroom-public/trial",{
   method:"POST",headers:{"Content-Type":"application/json","Origin":origin},body:"{}",
  }),e.data,ctx,"/api/classroom-public/trial");
  assert.equal(activation.status,200);
  assert.deepEqual(e.ops,["status","activate"]);
  const generated=await handlePublicClassroom(ask(),e.data,ctx,"/api/classroom-public/ask");
  assert.equal(generated.status,200);
  const answer=await generated.json() as {answer:string;mode:string;quota:{remaining:number}};
  assert.equal(answer.mode,"authenticated-public-trial");
  assert.match(answer.answer,/conclusion follows/);
  assert.equal(answer.quota.remaining,0);
  assert.deepEqual(e.ops,["status","activate","spend"]);
  assert.equal(models.length,1);
  assert.equal(models[0].path,"https://openrouter.ai/api/v1/chat/completions");
  assert.equal(models[0].body.max_tokens,280);
 }finally{globalThis.fetch=original;}
});
test("invalid source or question cannot spend server admissions",async()=>{
 const e=env();
 assert.equal((await handlePublicClassroom(ask({...payload,question:""}),e.data,ctx,
  "/api/classroom-public/ask")).status,400);
 assert.equal((await handlePublicClassroom(ask({...payload,sources:[]}),e.data,ctx,
  "/api/classroom-public/ask")).status,400);
 assert.equal(e.ops.length,0);
});
