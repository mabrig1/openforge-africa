/**
 * A single SQLite-backed Cloudflare Durable Object serializes all public
 * inference admissions across users. It contains pseudonymous Access identity
 * HMACs and counters ONLY; no course notes, emails, questions or model text.
 *
 * Not bound in the current production Wrangler config; a separate candidate
 * config is provided for review. Do not enable inference without deployment,
 * verified Access protection and provider-level spending ceiling.
 */
import {quotaView,type GlobalQuota,type TrialAccount,type PublicBudgetPolicy} from "./publicTrialPolicy.ts";
interface SqlCursor<T>{[Symbol.iterator]():Iterator<T>}
interface SqlStorage{exec<T=Record<string,unknown>>(sql:string,...bindings:(string|number)[]):SqlCursor<T>}
interface DurableState{storage:{sql:SqlStorage}}
type Command={
 kind:"status"|"activate"|"spend";
 account:string;utcDay:string;utcMonth:string;
 policy:PublicBudgetPolicy;
};
const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),
 {status,headers:{"Content-Type":"application/json;charset=utf-8","Cache-Control":"no-store, private"}});
const row=<T>(cursor:SqlCursor<T>):T|undefined=>Array.from(cursor)[0];
export class ClassroomTrialLedger{
 private sql:SqlStorage;
 constructor(state:DurableState){
  this.sql=state.storage.sql;
  this.sql.exec("CREATE TABLE IF NOT EXISTS trials (account TEXT PRIMARY KEY, trial_start TEXT, utc_day TEXT NOT NULL, used INTEGER NOT NULL DEFAULT 0)");
  this.sql.exec("CREATE TABLE IF NOT EXISTS totals (id INTEGER PRIMARY KEY CHECK(id=1), utc_day TEXT NOT NULL, day_used INTEGER NOT NULL DEFAULT 0, utc_month TEXT NOT NULL, month_used INTEGER NOT NULL DEFAULT 0)");
 }
 fetch(request:Request):Response{
  if(request.method!=="POST")return respond({error:"Not allowed"},405);
  // DO internal fetch uses a Request body; no fetch to external providers here.
  return respond({error:"Use async internal dispatch"},405);
 }
 async handleCommand(command:Command):Promise<Response>{
  if(!command||!["status","activate","spend"].includes(command.kind)||
    !/^[0-9a-f]{64}$/.test(command.account)||
    !/^\d{4}-\d{2}-\d{2}$/.test(command.utcDay)||
    command.utcMonth!==command.utcDay.slice(0,7)||
    !Number.isInteger(command.policy.globalDailyMax)||
    !Number.isInteger(command.policy.globalMonthlyMax)||
    command.policy.globalDailyMax<1||command.policy.globalDailyMax>500||
    command.policy.globalMonthlyMax<1||command.policy.globalMonthlyMax>5000)
    return respond({error:"Invalid ledger command"},400);
  const sql=this.sql;
  try{
   const p=command.policy;
   // All work below is synchronous SQLite execution inside one DO isolate.
   // No await occurs between reading counters and spending one model admission.
   sql.exec("INSERT OR IGNORE INTO totals(id,utc_day,day_used,utc_month,month_used) VALUES(1,?,0,?,0)",
    command.utcDay,command.utcMonth);
   const oldAccount=row<{trial_start:string|null;utc_day:string;used:number}>(
    sql.exec("SELECT trial_start,utc_day,used FROM trials WHERE account=?",command.account));
   let account:TrialAccount|null=oldAccount?{
    trialStarted:oldAccount.trial_start,day:oldAccount.utc_day,used:oldAccount.used}:null;
   if(command.kind==="activate"&&!account?.trialStarted){
    if(!account){
     sql.exec("INSERT OR IGNORE INTO trials(account,trial_start,utc_day,used) VALUES(?,?,?,0)",
      command.account,command.utcDay,command.utcDay);
    }else{
     sql.exec("UPDATE trials SET trial_start=? WHERE account=? AND trial_start IS NULL",
      command.utcDay,command.account);
    }
    account={trialStarted:command.utcDay,day:account?.day??command.utcDay,used:account?.used??0};
   }
   const oldGlobal=row<{utc_day:string;day_used:number;utc_month:string;month_used:number}>(
    sql.exec("SELECT utc_day,day_used,utc_month,month_used FROM totals WHERE id=1"));
   const totals:GlobalQuota={day:oldGlobal?.utc_day??command.utcDay,
    usedDay:oldGlobal?.day_used??0,month:oldGlobal?.utc_month??command.utcMonth,
    usedMonth:oldGlobal?.month_used??0};
   const view=quotaView(account,totals,p,command.utcDay,command.utcMonth);
   if(command.kind==="spend"){
    if(!view.canUse)return respond({accepted:false,quota:view},429);
    if(!account){
     sql.exec("INSERT INTO trials(account,trial_start,utc_day,used) VALUES(?,NULL,?,1)",
      command.account,command.utcDay);
    }else if(account.day===command.utcDay){
     sql.exec("UPDATE trials SET used=used+1 WHERE account=?",command.account);
    }else{
     sql.exec("UPDATE trials SET utc_day=?, used=1 WHERE account=?",
      command.utcDay,command.account);
    }
    const dayUsed=totals.day===command.utcDay?totals.usedDay:0;
    const monthUsed=totals.month===command.utcMonth?totals.usedMonth:0;
    sql.exec("UPDATE totals SET utc_day=?, day_used=?, utc_month=?, month_used=? WHERE id=1",
     command.utcDay,dayUsed+1,command.utcMonth,monthUsed+1);
    return respond({accepted:true,quota:quotaView({
     trialStarted:account?.trialStarted??null,day:command.utcDay,
     used:view.used+1}, {
      day:command.utcDay,usedDay:dayUsed+1,month:command.utcMonth,usedMonth:monthUsed+1
     },p,command.utcDay,command.utcMonth)});
   }
   return respond({accepted:true,quota:view});
  }catch{
   return respond({error:"Ledger unavailable; model access blocked"},503);
  }
 }
 async fetchCommand(request:Request):Promise<Response>{
  if(request.method!=="POST")return respond({error:"Not allowed"},405);
  try{
   const command=await request.json() as Command;
   return this.handleCommand(command);
  }catch{return respond({error:"Invalid ledger request"},400);}
 }
}
