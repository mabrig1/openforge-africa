/** Immutable quota rules shared between the Worker and Durable Object.
 * Trial status is based on verified Access identity and server UTC time,
 * NEVER on a client clock or an editable browser counter.
 */
export const FREE_PUBLIC_AI_LIMITS={
 basicPerUtcDay:1,
 explorerPerUtcDay:2,
 trialDays:7,
 maxOutputTokens:280,
 maxSources:3,
} as const;
export interface PublicBudgetPolicy{
 globalDailyMax:number;
 globalMonthlyMax:number;
}
export interface TrialAccount{
 trialStarted:string|null; day:string; used:number;
}
export interface GlobalQuota{
 day:string;usedDay:number;month:string;usedMonth:number;
}
export function utcDay(now=new Date()):string{return now.toISOString().slice(0,10);}
export function utcMonth(now=new Date()):string{return now.toISOString().slice(0,7);}
const isDay=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&
 new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;
export function isActiveExplorer(start:string|null,day:string):boolean{
 if(!start||!isDay(start)||!isDay(day))return false;
 const elapsed=(Date.parse(day+"T00:00:00Z")-Date.parse(start+"T00:00:00Z"))/86400000;
 return elapsed>=0&&elapsed<FREE_PUBLIC_AI_LIMITS.trialDays;
}
export function validPublicBudget(env:{
 OPENFORGE_PUBLIC_AI_DAILY_CAP?:string;
 OPENFORGE_PUBLIC_AI_MONTHLY_CAP?:string;
}):PublicBudgetPolicy|null{
 const day=env.OPENFORGE_PUBLIC_AI_DAILY_CAP;
 const month=env.OPENFORGE_PUBLIC_AI_MONTHLY_CAP;
 if(!day||!month||!/^[1-9]\d{0,4}$/.test(day)||!/^[1-9]\d{0,5}$/.test(month))return null;
 const globalDailyMax=Number(day),globalMonthlyMax=Number(month);
 // Deliberate maximum bound avoids accidental unlimited growth from misconfiguration.
 if(globalDailyMax>500||globalMonthlyMax>5000)return null;
 return {globalDailyMax,globalMonthlyMax};
}
export function quotaView(account:TrialAccount|null,global:GlobalQuota,policy:PublicBudgetPolicy,
 day:string,month:string){
 const active=isActiveExplorer(account?.trialStarted??null,day);
 const limit=active?FREE_PUBLIC_AI_LIMITS.explorerPerUtcDay:FREE_PUBLIC_AI_LIMITS.basicPerUtcDay;
 const used=account?.day===day?account.used:0;
 const globalDay=global.day===day?global.usedDay:0;
 const globalMonth=global.month===month?global.usedMonth:0;
 const remaining=Math.max(0,limit-used);
 const allowed=remaining>0&&globalDay<policy.globalDailyMax&&globalMonth<policy.globalMonthlyMax;
 return {plan:active?"explorer" as const:"basic" as const,
  limit,used,remaining,canUse:allowed,canStartTrial:!account?.trialStarted,
  trialStarted:account?.trialStarted??null,
  globalCapacityAvailable:globalDay<policy.globalDailyMax&&globalMonth<policy.globalMonthlyMax};
}
