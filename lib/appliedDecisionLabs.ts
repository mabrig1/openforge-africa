/** Deterministic numerical exercises only; not statistical inference from real populations. */
export type NumericSummary={count:number;mean:number;median:number;min:number;max:number;sampleSd:number};
export function describeSmallSample(text:string):NumericSummary|null {
 if(typeof text!=="string"||text.length>340)return null;
 const tokens=text.split(",").map(x=>x.trim());
 if(tokens.length<2||tokens.length>25)return null;
 if(tokens.some(x=>! /^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(x)))return null;
 const values=tokens.map(Number);
 if(values.some(x=>!Number.isFinite(x)||Math.abs(x)>1_000_000))return null;
 const count=values.length;
 const sorted=[...values].sort((a,b)=>a-b);
 const mean=values.reduce((s,v)=>s+v,0)/count;
 const median=count%2?sorted[(count-1)/2]:(sorted[count/2-1]+sorted[count/2])/2;
 const sampleSd=Math.sqrt(values.reduce((s,v)=>s+(v-mean)**2,0)/(count-1));
 return {count,mean,median,min:sorted[0],max:sorted[count-1],sampleSd};
}
export type CohortCell={n:number;success:number};
export type CohortStratum={
 label:string;treated:CohortCell;untreated:CohortCell;
};
export type CausalTeachingScenario={
 id:"uneven"|"balanced";title:string;strata:[CohortStratum,CohortStratum];description:string;
};
/** Illustrative synthetic tutoring success counts; never real research or randomized evidence. */
export const CAUSAL_TEACHING_SCENARIOS:{
 uneven:CausalTeachingScenario;balanced:CausalTeachingScenario;
}={
 uneven:{
  id:"uneven",title:"Uneven enrollment: high-need learners disproportionately receive support",
  description:"A supportive tutoring program appears worse in the pooled sample despite higher success inside both pre-existing need groups. The enrolment pattern is a confounder.",
  strata:[
   {label:"Higher prior learning need",treated:{n:90,success:45},untreated:{n:10,success:4}},
   {label:"Lower prior learning need",treated:{n:10,success:9},untreated:{n:90,success:72}},
  ],
 },
 balanced:{
  id:"balanced",title:"Balanced composition: equal shares of need groups",
  description:"Both treated and untreated synthetic groups have equal prior-need composition. A gap still does not establish causality without sound assignment and measurement.",
  strata:[
   {label:"Higher prior learning need",treated:{n:40,success:20},untreated:{n:40,success:16}},
   {label:"Lower prior learning need",treated:{n:40,success:36},untreated:{n:40,success:32}},
  ],
 },
};
export function causalRates(strata:readonly CohortStratum[]):{
 treatedRate:number;untreatedRate:number;pooledDifferencePP:number;
 within:{label:string;treatedRate:number;untreatedRate:number;differencePP:number}[];
}|null{
 if(!Array.isArray(strata)||strata.length<1||strata.length>8)return null;
 const good=(c:CohortCell)=>!!c&&Number.isInteger(c.n)&&Number.isInteger(c.success)
   &&c.n>0&&c.n<=1_000_000&&c.success>=0&&c.success<=c.n;
 if(strata.some(x=>!x||!good(x.treated)||!good(x.untreated)||typeof x.label!=="string"))return null;
 const tN=strata.reduce((s,x)=>s+x.treated.n,0),uN=strata.reduce((s,x)=>s+x.untreated.n,0);
 const tS=strata.reduce((s,x)=>s+x.treated.success,0),uS=strata.reduce((s,x)=>s+x.untreated.success,0);
 const treatedRate=tS/tN,untreatedRate=uS/uN;
 return {treatedRate,untreatedRate,pooledDifferencePP:100*(treatedRate-untreatedRate),
  within:strata.map(x=>{
    const treatedRate=x.treated.success/x.treated.n;
    const untreatedRate=x.untreated.success/x.untreated.n;
    return {label:x.label,treatedRate,untreatedRate,
      differencePP:100*(treatedRate-untreatedRate)};
  })};
}
