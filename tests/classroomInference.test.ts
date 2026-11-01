import test from "node:test";
import assert from "node:assert/strict";
import {CLASSROOM_AGENTS} from "../lib/openMaicClassroom.ts";
import {classroomAIReady,validateClassroomAIInput,handleClassroomAI} from "../worker/classroomInference.ts";

const disabled={OPENFORGE_CLASSROOM_AI_ENABLED:"false",OPENROUTER_MODEL:"mock-model",
 OPENROUTER_API_KEY:"placeholder",OPENFORGE_CLASSROOM_ACCESS_TOKEN:"a".repeat(32)};
const enabled={...disabled,OPENFORGE_CLASSROOM_AI_ENABLED:"true"};
const body={agentId:"of-teacher",question:"What is a valid inference?",
 sources:[{id:"note1",title:"Logic note",excerpt:"A valid argument follows necessarily from its premises."}]};
const request=(data:unknown,token="a".repeat(32))=>new Request("https://test.example/api/classroom-ai",{
 method:"POST",headers:{"Content-Type":"application/json","X-OpenForge-Classroom-Token":token},
 body:JSON.stringify(data),
});
test("owner cloud inference is completely disabled unless deliberately enabled",async()=>{
 assert.equal(classroomAIReady(disabled),false);
 const r=await handleClassroomAI(request(body),disabled);
 assert.equal(r.status,503);
 const get=await handleClassroomAI(new Request("https://test.example/api/classroom-ai"),disabled);
 assert.equal((await get.json() as {available:boolean}).available,false);
});
test("rejects bad bearer token and unsupported input before provider access",async()=>{
 assert.equal((await handleClassroomAI(request(body,"bad"),enabled)).status,401);
 assert.equal(validateClassroomAIInput({...body,agentId:"not-configured"}),null);
 assert.equal(validateClassroomAIInput({...body,question:""}),null);
 assert.equal(validateClassroomAIInput({...body,sources:Array(4).fill(body.sources[0])}),null);
 assert.equal((await handleClassroomAI(request({...body,question:""}),enabled)).status,400);
});
test("all 15 agent ids are eligible for a single bounded owner-only model call",async()=>{
 const original=globalThis.fetch;
 const calls:{url:string;body:any}[]=[];
 globalThis.fetch=(async(input:RequestInfo|URL,init?:RequestInit)=>{
  calls.push({url:String(input),body:JSON.parse(String(init?.body))});
  return new Response(JSON.stringify({choices:[{message:{content:"Please check the given source."}}]}),
   {status:200,headers:{"Content-Type":"application/json"}});
 }) as typeof fetch;
 try{
  for(const agent of CLASSROOM_AGENTS){
   const r=await handleClassroomAI(request({...body,agentId:agent.id}),enabled);
   assert.equal(r.status,200);
   const data=await r.json() as {agentId:string;answer:string;modelGenerated:boolean};
   assert.equal(data.agentId,agent.id);
   assert.equal(data.modelGenerated,true);
  }
  assert.equal(calls.length,15);
  assert.ok(calls.every(c=>c.url==="https://openrouter.ai/api/v1/chat/completions"));
  assert.ok(calls.every(c=>c.body.max_tokens===280));
  assert.ok(calls.every(c=>c.body.messages[0].content.includes("untrusted DATA")));
 }finally{globalThis.fetch=original;}
});
