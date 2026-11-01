import test from "node:test";
import assert from "node:assert/strict";
import {DatabaseSync} from "node:sqlite";
import {ClassroomTrialLedger} from "../worker/trialLedger.ts";
import {validPublicBudget,quotaView,isActiveExplorer} from "../worker/publicTrialPolicy.ts";
function ledger(db:DatabaseSync){
 const sql={exec:(sql:string,...values:(string|number)[])=>{
  if(sql.startsWith("CREATE TABLE")){db.exec(sql);return []}
  if(sql.startsWith("SELECT"))return db.prepare(sql).all(...values);
  db.prepare(sql).run(...values);
  return [];
 }};
 return new ClassroomTrialLedger({storage:{sql}} as never);
}
const subject="a".repeat(64);
async function cmd(o:ClassroomTrialLedger,kind:"status"|"activate"|"spend",account=subject,
 day="2026-11-01",policy={globalDailyMax:3,globalMonthlyMax:4}){
 const response=await o.fetch(new Request("https://quota.internal",{
  method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({kind,account,utcDay:day,utcMonth:day.slice(0,7),policy}),
 }));
 return {code:response.status,body:await response.json() as {
  accepted?:boolean;quota?:{plan:string;remaining:number;used:number;limit:number;
  canStartTrial:boolean;globalCapacityAvailable:boolean};
 }};
}
test("fail-closed global policy only accepts explicit bounded call caps",()=>{
 assert.equal(validPublicBudget({}),null);
 assert.equal(validPublicBudget({OPENFORGE_PUBLIC_AI_DAILY_CAP:"0",OPENFORGE_PUBLIC_AI_MONTHLY_CAP:"100"}),null);
 assert.equal(validPublicBudget({OPENFORGE_PUBLIC_AI_DAILY_CAP:"50000",OPENFORGE_PUBLIC_AI_MONTHLY_CAP:"100000"}),null);
 assert.deepEqual(validPublicBudget({OPENFORGE_PUBLIC_AI_DAILY_CAP:"3",OPENFORGE_PUBLIC_AI_MONTHLY_CAP:"10"}),
 {globalDailyMax:3,globalMonthlyMax:10});
 assert.equal(isActiveExplorer("2026-11-01","2026-11-07"),true);
 assert.equal(isActiveExplorer("2026-11-01","2026-11-08"),false);
 assert.equal(isActiveExplorer("2026-99-99","2026-11-01"),false);
});
test("SQLite-backed admissions enforce per-user Basic, Explorer and global provider call caps",async()=>{
 const db=new DatabaseSync(":memory:");
 try{
  const o=ledger(db);
  const state=await cmd(o,"status");
  assert.equal(state.body.quota?.plan,"basic");
  assert.equal(state.body.quota?.remaining,1);
  assert.equal((await cmd(o,"spend")).code,200);
  assert.equal((await cmd(o,"spend")).code,429);
  const trial=await cmd(o,"activate");
  assert.equal(trial.body.quota?.plan,"explorer");
  assert.equal(trial.body.quota?.remaining,1);
  assert.equal((await cmd(o,"spend")).code,200);
  assert.equal((await cmd(o,"spend")).code,429);
  assert.equal((await cmd(o,"activate")).body.quota?.remaining,0);
  assert.equal((await cmd(o,"spend","b".repeat(64))).code,200);
  // Global daily cap is 3 attempts, irrespective of other accounts.
  assert.equal((await cmd(o,"spend","c".repeat(64))).code,429);
  // Re-opening the DO does not reset limits, nor does switching clients.
  assert.equal((await cmd(ledger(db),"spend",subject)).code,429);
  const tomorrow=await cmd(ledger(db),"status",subject,"2026-11-02");
  assert.equal(tomorrow.body.quota?.remaining,2);
  assert.equal((await cmd(ledger(db),"spend",subject,"2026-11-02")).code,200);
  // Global monthly cap is 4, even on another UTC day.
  assert.equal((await cmd(ledger(db),"spend","d".repeat(64),"2026-11-02")).code,429);
  const afterTrial=await cmd(ledger(db),"status",subject,"2026-11-09");
  assert.equal(afterTrial.body.quota?.plan,"basic");
  assert.equal(afterTrial.body.quota?.canStartTrial,false);
 }finally{db.close();}
});
test("invalid untrusted ledger command cannot consume or change quota",async()=>{
 const db=new DatabaseSync(":memory:");
 try{
  const o=ledger(db);
  assert.equal((await cmd(o,"spend","fake-id")).code,400);
  assert.equal((await cmd(o,"status")).body.quota?.remaining,1);
 }finally{db.close();}
});
