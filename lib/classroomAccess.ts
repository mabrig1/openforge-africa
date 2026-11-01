/** Device-local learning access only; NOT a secure entitlement or billing system. */
export type PreviewPlan="basic"|"explorer";
export interface FreeAccessSnapshot {
 trialStartedOn:string|null;
 dailyUsage:Record<string,number>;
}
const isDay=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&
 !Number.isNaN(new Date(value+"T00:00:00Z").getTime());
export function localDayKey(now=new Date()):string{
 const y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,"0"),
  d=String(now.getDate()).padStart(2,"0");
 return y+"-"+m+"-"+d;
}
export function trialIsActive(start:string|null,today:string):boolean{
 if(!start||!isDay(start)||!isDay(today))return false;
 const a=Date.parse(start+"T00:00:00Z"),b=Date.parse(today+"T00:00:00Z");
 const elapsed=Math.floor((b-a)/86400000);
 return elapsed>=0&&elapsed<7;
}
export function getFreeAccess(state:FreeAccessSnapshot,today=localDayKey()){
 const explorer=trialIsActive(state.trialStartedOn,today);
 const plan:PreviewPlan=explorer?"explorer":"basic";
 const maxRuns=explorer?8:3;
 const maxSpeakers=explorer?5:3;
 const usage=state.dailyUsage?.[today];
 const used=Number.isInteger(usage)&&usage>=0?usage:0;
 return {plan,used,maxRuns,maxSpeakers,remaining:Math.max(0,maxRuns-used),
  canStartTrial:!state.trialStartedOn,
  expiresOn:state.trialStartedOn?new Date(Date.parse(state.trialStartedOn+"T00:00:00Z")+7*86400000).toISOString().slice(0,10):null};
}
export function startFreeExplorer(state:FreeAccessSnapshot,today=localDayKey()):FreeAccessSnapshot{
 if(state.trialStartedOn||!isDay(today))return state;
 return {...state,trialStartedOn:today};
}
export function spendFreeRun(state:FreeAccessSnapshot,today=localDayKey()):FreeAccessSnapshot|null{
 if(!isDay(today)||getFreeAccess(state,today).remaining<=0)return null;
 const dailyUsage={...state.dailyUsage,[today]:(state.dailyUsage[today]??0)+1};
 const days=Object.keys(dailyUsage).filter(isDay).sort().slice(-30);
 return {...state,dailyUsage:Object.fromEntries(days.map(day=>[day,dailyUsage[day]]))};
}
