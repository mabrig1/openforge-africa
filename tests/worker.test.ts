import test from "node:test";
import assert from "node:assert/strict";
import { handleTutorRequest, validateTutorInput } from "../worker/index.ts";

const base = "https://openforge.example.test/api/tutor";
const env = {
  ASSETS:{fetch:async(_request:Request)=>new Response("HTML")},
  OPENFORGE_TUTOR_ENABLED:"true",
  OPENROUTER_API_KEY:"synthetic-test-only-never-real",
  OPENROUTER_MODEL:"example/test-model",
  OPENFORGE_TUTOR_ACCESS_TOKEN:"a".repeat(32),
};
const valid = {question:"What is public accountability?",
  sources:[{id:"note_1",title:"Fictional notes",excerpt:"Public accountability means that officials explain decisions."}]};
const post=(body:unknown,token=env.OPENFORGE_TUTOR_ACCESS_TOKEN,headers:Record<string,string>={}) =>
  new Request(base,{method:"POST",headers:{"Content-Type":"application/json",
    "X-OpenForge-Access-Token":token, Origin:"https://openforge.example.test",...headers},
    body:JSON.stringify(body)});

test("does not accept unbounded, fake, duplicate or empty excerpts",()=>{
  assert.equal(validateTutorInput(valid)?.sources.length,1);
  assert.equal(validateTutorInput({...valid,question:""}),null);
  assert.equal(validateTutorInput({...valid,question:"q".repeat(501)}),null);
  assert.equal(validateTutorInput({...valid,sources:[]}),null);
  assert.equal(validateTutorInput({...valid,sources:[valid.sources[0],valid.sources[0]]}),null);
  assert.equal(validateTutorInput({...valid,sources:[{...valid.sources[0],excerpt:"x".repeat(1501)}]}),null);
  assert.equal(validateTutorInput({...valid,sources:[{...valid.sources[0],id:"../../credentials"}]}),null);
});

test("stays disabled before owner config, never calls AI",async()=>{
  let requests=0;const original=globalThis.fetch;
  globalThis.fetch=async()=>{requests++;throw Error("must not call")};
  try {
    const res=await handleTutorRequest(post(valid),{...env,OPENFORGE_TUTOR_ENABLED:"false"});
    assert.equal(res.status,503);assert.equal(requests,0);
    const get=await handleTutorRequest(new Request(base),{...env,OPENFORGE_TUTOR_ENABLED:"false"});
    assert.deepEqual((await get.json()).available,false);
  } finally {globalThis.fetch=original;}
});

test("refuses wrong token, other origins, unsupported methods and bad JSON without external requests",async()=>{
  const original=globalThis.fetch;let calls=0;
  globalThis.fetch=async()=>{calls++;throw Error("must not call")};
  try {
    assert.equal((await handleTutorRequest(post(valid,"wrong"),env)).status,401);
    assert.equal((await handleTutorRequest(post(valid,env.OPENFORGE_TUTOR_ACCESS_TOKEN,{Origin:"https://evil.example"}),env)).status,403);
    assert.equal((await handleTutorRequest(new Request(base,{method:"DELETE"}),env)).status,405);
    const bad=new Request(base,{method:"POST",headers:{"Content-Type":"application/json","X-OpenForge-Access-Token":env.OPENFORGE_TUTOR_ACCESS_TOKEN},body:"{bad"});
    assert.equal((await handleTutorRequest(bad,env)).status,400);
    assert.equal(calls,0);
  } finally {globalThis.fetch=original;}
});

test("authorized user gets bounded source-based completion from mocked provider",async()=>{
  const original=globalThis.fetch;const seen:string[]=[];
  globalThis.fetch=async(_url:RequestInfo|URL, init?:RequestInit)=>{
    seen.push(String(_url));const body=JSON.parse(String(init?.body));
    assert.equal(body.messages[1].content.includes("Fictional notes"),true);
    assert.equal(body.max_tokens,400);
    assert.match(String(init?.headers&&JSON.stringify(init.headers)),/Bearer synthetic-test-only/);
    return new Response(JSON.stringify({choices:[{message:{content:"Officials explain decisions [S1]."}}]}),
      {status:200,headers:{"Content-Type":"application/json"}});
  };
  try {
    const response=await handleTutorRequest(post(valid),env);
    const payload=await response.json();
    assert.equal(response.status,200);
    assert.equal(payload.answer,"Officials explain decisions [S1].");
    assert.equal(payload.sources[0].title,"Fictional notes");
    assert.equal(response.headers.get("Cache-Control"),"no-store, private");
    assert.equal(seen.length,1);
    assert.equal(seen[0],"https://openrouter.ai/api/v1/chat/completions");
  } finally {globalThis.fetch=original;}
});
