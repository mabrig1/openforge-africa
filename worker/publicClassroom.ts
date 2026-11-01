/**
 * Optional public classroom AI via validated Cloudflare Access identity and
 * durable global+per-account rate limits. Fail closed unless ALL owner config
 * and a durable ledger are present. DO NOT use the device-local preview counter.
 *
 * No access JWT or arbitrary identity header is accepted. Cloudflare Access
 * must be attached to the API route in Cloudflare and ctx.access.getIdentity()
 * must succeed. The user cannot choose or impersonate an account ID.
 */
import {requestClassroomModel,validateClassroomAIInput} from "./classroomInference.ts";
import {validPublicBudget,utcDay,utcMonth} from "./publicTrialPolicy.ts";
type AccessIdentity={id?:string;email?:string};
interface AccessContext{access?:{getIdentity:()=>Promise<AccessIdentity|null>}}
interface DurableStub{fetch:(req:Request)=>Promise<Response>}
interface DurableNamespace{getByName:(name:string)=>DurableStub}
export interface PublicClassroomEnv{
 OPENFORGE_PUBLIC_AI_ENABLED?:string;
 OPENFORGE_PUBLIC_AI_DAILY_CAP?:string;
 OPENFORGE_PUBLIC_AI_MONTHLY_CAP?:string;
 OPENFORGE_IDENTITY_SALT?:string;
 OPENROUTER_API_KEY?:string;
 OPENROUTER_MODEL?:string;
 CLASSROOM_TRIAL_LEDGER?:DurableNamespace;
}
const respond=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{
 "Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store, private",
 "X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer",
}});
export function publicClassroomReady(env:PublicClassroomEnv):boolean{
 return env.OPENFORGE_PUBLIC_AI_ENABLED==="true"&&
  !!env.OPENROUTER_API_KEY?.trim()&&!!env.OPENROUTER_MODEL?.trim()&&
  !!env.CLASSROOM_TRIAL_LEDGER?.getByName&&
  typeof env.OPENFORGE_IDENTITY_SALT==="string"&&env.OPENFORGE_IDENTITY_SALT.length>=32&&
  !!validPublicBudget(env);
}
async function accountDigest(id:string,secret:string):Promise<string>{
 const enc=new TextEncoder();
 const key=await crypto.subtle.importKey("raw",enc.encode(secret),
  {name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const sig=await crypto.subtle.sign("HMAC",key,enc.encode(id));
 return Array.from(new Uint8Array(sig),b=>b.toString(16).padStart(2,"0")).join("");
}
export async function handlePublicClassroom(request:Request,env:PublicClassroomEnv,
 ctx:AccessContext,path:string):Promise<Response>{
 if(!["/api/classroom-public/status","/api/classroom-public/trial",
   "/api/classroom-public/ask"].includes(path))
   return respond({error:"Unknown endpoint"},404);
 if(!publicClassroomReady(env))
  return respond({error:"Public AI preview is not enabled; local classroom remains free."},503);
 // Access is a verified runtime capability, not a request-controlled header.
 if(!ctx?.access?.getIdentity)return respond({error:"Verified Cloudflare Access login required"},401);
 let user:AccessIdentity|null;
 try{user=await ctx.access.getIdentity();}catch{return respond({error:"Access identity not verified"},401);}
 if(!user||typeof user.id!=="string"||user.id.length<8||user.id.length>256)
  return respond({error:"A stable authenticated Access account is required"},401);
 const isStatus=path.endsWith("/status");
 if(request.method!==(isStatus?"GET":"POST"))return respond({error:"Method not allowed"},405);
 const origin=request.headers.get("Origin");
 // POST requests from same-origin web UI include an Origin header.
 if(!isStatus&&origin!==new URL(request.url).origin)
  return respond({error:"Same-origin request required"},403);
 if(!isStatus&&!(request.headers.get("Content-Type")||"").toLowerCase().startsWith("application/json"))
  return respond({error:"JSON required"},415);
 const now=new Date();
 const day=utcDay(now),month=utcMonth(now);
 let input:ReturnType<typeof validateClassroomAIInput>=null;
 if(path.endsWith("/ask")){
  const declared=Number(request.headers.get("Content-Length")||"0");
  if(!Number.isFinite(declared)||declared>8000)return respond({error:"Request too large"},413);
  try{
   const body=await request.text();
   if(body.length>8000)return respond({error:"Request too large"},413);
   input=validateClassroomAIInput(JSON.parse(body));
  }catch{return respond({error:"Malformed request"},400);}
  if(!input||!input.sources.length)
   return respond({error:"Select one or more short, consented study sources and a role"},400);
 }else if(!isStatus){
  const content=await request.text();
  if(content.length>128||content.trim()!=="{}")return respond({error:"Empty JSON body required"},400);
 }
 try{
  const account=await accountDigest(user.id,env.OPENFORGE_IDENTITY_SALT!);
  const ledger=env.CLASSROOM_TRIAL_LEDGER!.getByName("global-classroom-admission-v1");
  const operation=isStatus?"status":path.endsWith("/trial")?"activate":"spend";
  const result=await ledger.fetch(new Request("https://classroom-quota.internal/command",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({kind:operation,account,utcDay:day,utcMonth:month,
    policy:validPublicBudget(env)}),
  }));
  if(!result.ok)return respond({error:result.status===429?
   "Account daily or platform capacity exhausted":"Server quota unavailable; no model was called",
   retryable:result.status===429},result.status===429?429:503);
  const receipt=await result.json() as {
   accepted?:boolean;quota?:{
    plan:string;remaining:number;used:number;limit:number;canUse:boolean;
    canStartTrial:boolean;trialStarted:string|null;globalCapacityAvailable:boolean;
   };
  };
  if(!receipt.accepted||!receipt.quota)return respond({error:"Admission denied"},503);
  if(operation!=="spend")return respond({
   mode:"authenticated-public-trial",source:"cloudflare-access-and-durable-ledger",
   dayUtc:day,quota:receipt.quota,privateNotesStored:false,
  });
  // Admission has already been durably consumed; failures also count to bound
  // provider attempts. One call = one agent, not fifteen concurrent charges.
  const upstream=await requestClassroomModel(input!,env);
  if(!upstream.ok)return respond({error:"Model unavailable; this attempt consumed one server admission",
   retryable:false,quota:receipt.quota},502);
  const payload=await upstream.json() as Record<string,unknown>;
  return respond({...payload,mode:"authenticated-public-trial",
   dayUtc:day,quota:receipt.quota,
   notice:"Generated educational response; verify independently. A failed provider attempt also uses one daily allowance."});
 }catch{return respond({error:"Public classroom quota unavailable; model was not called"},503);}
}
