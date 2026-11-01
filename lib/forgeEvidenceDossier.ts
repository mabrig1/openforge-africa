/** Local, unverified FS 101 evidence *preparation*; NOT a validator, grade, badge, credential or publication. */
import {FORGE_WEEKS,FORGE_MILESTONES,FORGE_WEIGHTS} from "./academyExpansion.ts";
export type ForgeDraft = {url?:unknown;note?:unknown};
export type ForgeReadiness={
  week:number;title:string;phase:string;requiredArtifact:string;requiredProof:string;
  link:string;note:string;hasPublicLink:boolean;
  needsHumanReview:true;
};
export const FORGE_REVIEW_GATES=[
 {name:"Spark",weeks:[1],explain:"Mentor must validate actual interviews and Problem Brief; private interviewee details must not be published."},
 {name:"Builder",weeks:[3],explain:"Human must inspect repository, genuine commit history and license."},
 {name:"Contributor",weeks:[6],explain:"Human must confirm a submitted PR to another project (not an invented link)."},
 {name:"Launcher",weeks:[8],explain:"Human must check real working deployment and ten genuinely independent users and feedback."},
 {name:"Forger",weeks:[10],explain:"Human panel must review the actual Demo Day and published portfolio."},
] as const;
function cleanText(v:unknown,max=1000):string{
 return typeof v==="string"?v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").slice(0,max).trim():"";
}
function link(v:unknown):string{
 if(typeof v!=="string"||v.length>500||!/^(https:\/\/)/i.test(v))return "";
 try{const u=new URL(v);return u.protocol==="https:"&&u.hostname.includes(".")&&!u.username&&!u.password?v:"";}
 catch{return "";}
}
export function forgeEvidenceChecklist(data:unknown):{
 weeks:ForgeReadiness[];links:number;notes:number;noLinks:number;gates:typeof FORGE_REVIEW_GATES;
}{
 const raw=data&&typeof data==="object"&&!Array.isArray(data)?data as Record<string,ForgeDraft>:{};
 const weeks=FORGE_WEEKS.map(w=>{
  const d=raw[String(w.id)]&&typeof raw[String(w.id)]==="object"?raw[String(w.id)]:{};
  const u=link(d?.url), n=cleanText(d?.note);
  return {week:w.id,title:w.title,phase:w.phase??"",requiredArtifact:w.artifact??"",
   requiredProof:w.proof??"",link:u,note:n,hasPublicLink:!!u,
   needsHumanReview:true as const};
 });
 return {
  weeks,links:weeks.filter(w=>w.hasPublicLink).length,
  notes:weeks.filter(w=>w.note).length,
  noLinks:weeks.filter(w=>!w.hasPublicLink).length,
  gates:FORGE_REVIEW_GATES,
 };
}
/** Safe plain-text dossier: intentionally avoids HTML and untrusted rendered Markdown. */
export function forgeEvidenceDossier(data:unknown):string{
 const s=forgeEvidenceChecklist(data);
 const rows=[
  "FS 101 | FORGE STUDIES | PRIVATE EVIDENCE PREPARATION DOSSIER",
  "Source: FS 101: Introduction to Forge Studies, OpenForge Africa (10-week syllabus).",
  "",
  "STATUS: ALL LINKS, USER COUNTS, CLAIMS AND NOTES ARE SELF-REPORTED AND UNVERIFIED.",
  "NOT AN OFFICIAL SUBMISSION, PROJECT VALIDATION, PASS, GRADE, CERTIFICATE OR BADGE.",
  "Review privacy/consent and remove identifying details before sharing this dossier.",
  "",
  "DRAFT COVERAGE: "+s.links+" of 10 weekly link fields have an HTTPS URL; "+
   s.notes+" of 10 weeks contain a note. Links are not opened or audited by this tool.",
  "",
  "SOURCE ASSESSMENT WEIGHTS: "+FORGE_WEIGHTS.map(([n,p])=>n+" "+p+"%").join(" | "),
  "Passing and distinction require real externally verified evidence and human review.",
  "",
  ...s.weeks.flatMap(w=>[
   "WEEK "+w.week+": "+w.title+" ("+w.phase+")",
   "Required artifact: "+w.requiredArtifact,
   "Evidence specified by source syllabus: "+w.requiredProof,
   "Student-provided URL (UNVERIFIED): "+(w.link||"[not added]"),
   "Student notes (UNVERIFIED): "+(w.note||"[not added]"),
   "Independent mentor/reviewer check: NOT PERFORMED",
   "",
  ]),
  "FIVE SOURCE MILESTONE GATES — NONE VERIFIED BY OPENFORGE:",
  ...FORGE_REVIEW_GATES.map(g=>g.name+": "+g.explain),
  "",
  "Human reviewers should check all real artefacts, usage evidence, consent, honest AI assistance,",
  "risk notes and rubric before making any assessment or awarding a credential.",
  "No data was uploaded or published by generating this local text dossier.",
 ];
 return rows.join("\n");
}
