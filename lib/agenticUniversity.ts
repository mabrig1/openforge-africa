/** OpenForge 12-role offline agent desk. No network, model calls, storage writes or grades. */
import {groundedReply,type CourseMaterial} from "./study.ts";

export const AGENTS=[
 {id:"professor",name:"AI Professor",purpose:"Plan source-checkable lessons"},
 {id:"tutor",name:"AI Tutor",purpose:"Find passages in selected notes"},
 {id:"curriculum",name:"Curriculum Designer",purpose:"Sequence self-study activities"},
 {id:"assessment",name:"Assessment Agent",purpose:"Draft formative practice prompts"},
 {id:"research",name:"Research Assistant",purpose:"Plan verification and research methods"},
 {id:"adviser",name:"Academic Adviser",purpose:"Recommend the next review milestone"},
 {id:"multimedia",name:"Multimedia Lecturer",purpose:"Make editable explainer storyboards"},
 {id:"success",name:"Student Success Agent",purpose:"Review self-reported study rhythms"},
 {id:"library",name:"AI Library Agent",purpose:"Search explicitly selected notes"},
 {id:"career",name:"Career Mentor",purpose:"Plan a skills portfolio activity"},
 {id:"accessibility",name:"Accessibility Agent",purpose:"Prepare reader-friendly study notes"},
 {id:"coordinator",name:"University Coordinator",purpose:"Delegate a bounded local study plan"},
] as const;
export type AgentId=typeof AGENTS[number]["id"];
export interface AgentCourse {
 id:string;code:string;title:string;route:string;percent:number;
 next:{number:number;title:string;action:string;detail:string};
}
export interface AgentInput {
 course:AgentCourse;question:string;notes?:Pick<CourseMaterial,"id"|"title"|"content">[];
 sessions?:number;weeklyTarget?:number;
}
export interface AgentResult{
 agent:AgentId;name:string;headline:string;status:"ready"|"needs-source"|"human-review";
 steps:string[];evidence:{id:string;title:string}[];notice:string;
 draft?:string;delegates?:AgentId[];
}
type Context=Required<AgentInput>;
const clamp=(n:number,low:number,high:number)=>Number.isFinite(n)?Math.min(high,Math.max(low,n)):low;
function normalise(input:AgentInput):Context{
 if(!input||!input.course||!input.course.next||!input.course.title)
   throw new Error("Choose a valid Academy course.");
 if(typeof input.question!=="string"||input.question.length>500)
   throw new Error("Study request must contain at most 500 characters.");
 return {
  course:{...input.course,title:input.course.title.slice(0,140),
    next:{...input.course.next,title:input.course.next.title.slice(0,140)}},
  question:input.question.trim(),
  notes:(input.notes??[]).slice(0,3).filter(n=>n&&typeof n.id==="string"&&
     typeof n.title==="string"&&typeof n.content==="string")
     .map(n=>({id:n.id.slice(0,80),title:n.title.slice(0,120),content:n.content.slice(0,1500)})),
  sessions:clamp(input.sessions??0,0,7),weeklyTarget:clamp(input.weeklyTarget??3,1,7),
 };
}
function create(id:AgentId,headline:string,steps:string[],
 opts:Partial<Pick<AgentResult,"status"|"evidence"|"notice"|"draft"|"delegates">>={}):AgentResult{
 return {agent:id,name:AGENTS.find(a=>a.id===id)!.name,headline,steps,
  status:opts.status??"ready",evidence:opts.evidence??[],
  notice:opts.notice??"Local self-study draft. Verify against original sources and seek qualified human review.",
  ...(opts.draft?{draft:opts.draft}:{}),...(opts.delegates?{delegates:opts.delegates}:{})};
}
function lookup(c:Context){
 const answer=groundedReply(c.question||c.course.next.title||c.course.title,c.notes);
 return {answer,evidence:answer.matched&&answer.sourceId&&answer.sourceTitle?
   [{id:answer.sourceId,title:answer.sourceTitle}]:[]};
}
function next(c:Context){return c.course.next.number?
  c.course.next.action+": "+c.course.next.title:
  "All local review milestones recorded; revisit difficult topics.";}
function specialist(id:Exclude<AgentId,"coordinator">,c:Context):AgentResult{
 const topic=c.course.next.title||c.course.title;
 switch(id){
 case "professor":return create(id,"Teaching outline: "+topic,[
   "Opening: ask the learner to state one assumption about "+topic+".",
   "Read the original course section before teaching; do not invent definitions.",
   "Teach-back: define the idea, give a labelled hypothetical example, and discuss one limitation.",
   "Exit ticket: record a question to verify with a qualified instructor."],{status:"human-review"});
 case "tutor":{
  const hit=lookup(c);
  return create(id,hit.answer.matched?"Matching selected note":"No matching local passage",
   [hit.answer.content],{status:hit.answer.matched?"ready":"needs-source",
    evidence:hit.evidence,notice:"Keyword retrieval only, not generative AI. Check note provenance."});
 }
 case "curriculum":return create(id,"Next learning sequence — "+c.course.code,[
   "Read: "+next(c)+".",
   "Practise: explain one concept in your own words and write a counterexample.",
   "Check understanding with the course's existing formative activity.",
   "Record a study session manually only after completing real study. No curriculum record is changed."]);
 case "assessment":{
  const hit=lookup(c);
  return create(id,"Ungraded exercise: "+topic,[
   "Explain "+(c.question||topic)+" in your own words using the course reading.",
   "Human self-check rubric: correct definition; supported example; one limitation (3 criteria, not an official score).",
   hit.answer.matched?"Selected evidence: "+hit.answer.content:
    "No selected passage supports this question. Read the original source before attempting to mark it."],
   {evidence:hit.evidence,status:hit.answer.matched?"human-review":"needs-source",
    notice:"Ungraded practice only. No automated marking or academic credits."});
 }
 case "research":return create(id,"Research planning worksheet",[
   "Rewrite "+(c.question||topic)+" as a research question with defined scope.",
   "Write a falsifiable claim and at least one rival explanation.",
   "Identify primary sources and an independent check; do not invent citations.",
   "Select methods for data collection and data analysis, and consider consent/ethics if human participants are involved.",
   "Record uncertainties and submit for human academic review."],{status:"human-review"});
 case "adviser":return create(id,"Next academic study action",[
   c.course.code+": "+c.course.percent+"% of local review milestones recorded.",
   "Next: "+next(c)+".",
   "Plan a realistic study block and review the existing course activity.",
   "Local self-study is not a university transcript or accredited credential."]);
 case "multimedia":{
  const draft="Explainer storyboard: "+topic+"\n"+
   "Scene 1: Ask a motivating question about the topic.\n"+
   "Scene 2: Insert a source-verified explanation from course materials.\n"+
   "Scene 3: Add a labelled hypothetical example.\n"+
   "Scene 4: Invite the viewer to identify one limitation or question.\n"+
   "Verify factual claims before any export.";
  return create(id,"Editable multimedia outline",[
   "Review the four-scene storyboard and add citations from the original teaching material.",
   "Open the existing Explainer Studio only after checking this draft.",
   "Edit locally; this workflow does not generate media or publish anything."],
   {draft,status:"human-review",notice:"Storyboard only; no video, speech, upload or automatic publication."});
 }
 case "success":{
  const gap=Math.max(0,c.weeklyTarget-c.sessions);
  return create(id,"Study rhythm checkpoint",[
   "This device-calendar week: "+c.sessions+" recorded session(s); your optional target is "+c.weeklyTarget+".",
   gap?"You have "+gap+" optional session(s) left; choose a manageable study block.":
    "Your self-recorded target is met. Prioritise understanding over counting sessions.",
   "Suggested topic: "+next(c)+".",
   "Self-reported sessions are not monitored, validated attendance or predicted outcomes."]);
 }
 case "library":{
  const hit=lookup(c);
  return create(id,hit.answer.matched?"Matched local note":"No local note found",[
   hit.answer.content,
   "Check source author, date, usage rights and context before academic citation.",
   "No online journal, web or other saved file was searched."],
   {status:hit.answer.matched?"ready":"needs-source",evidence:hit.evidence,
    notice:"Only the notes explicitly selected on this screen were searched; no outside citations."});
 }
 case "career":return create(id,"Practical portfolio idea: "+topic,[
   "Identify a real-world problem where this course topic could be applied responsibly.",
   "Produce an evidence-led brief, annotated example or prototype.",
   "Document assumptions, limitations and human feedback.",
   "Do not advertise a degree, professional qualification or guaranteed placement."],{status:"human-review"});
 case "accessibility":{
  const hit=lookup(c);
  const draft=hit.answer.matched?hit.answer.content:
    "Reading plan for "+topic+": read one short section at a time and define unfamiliar terms.";
  return create(id,"Accessible reading preparation",[
   "Read one short passage, pause and paraphrase it in your own words.",
   hit.answer.matched?"A selected note has been prepared as a reader draft.":
    "No matching passage found; this is a reading strategy, not a factual explanation.",
   "Open the Text Reader manually; narration is not started automatically."],
   {draft,status:hit.answer.matched?"ready":"needs-source",evidence:hit.evidence,
    notice:"No diagnosis, disability inference, external transfer or automatic playback."});
 }
 }
}
export function runAgent(id:AgentId,input:AgentInput):AgentResult{
 if(!AGENTS.some(a=>a.id===id))throw new Error("Unknown agent.");
 const c=normalise(input);
 if(id!=="coordinator")return specialist(id,c);
 // Bounded local orchestration: three nonrecursive, read-only specialist calls.
 const delegates:Exclude<AgentId,"coordinator">[]=["adviser","professor","assessment"];
 const parts=delegates.map(a=>specialist(a,c));
 return create("coordinator","Three-agent local learning plan",[
  "Adviser: "+parts[0].steps[1],
  "Professor: "+parts[1].steps[1],
  "Assessment: "+parts[2].steps[0],
  "Human review and a separate explicit action are required before using any draft."],
  {delegates,evidence:parts.flatMap(p=>p.evidence),status:"human-review",
   notice:"Coordinator ran only local deterministic specialists; no cloud calls, grades, tools or records were changed."});
}
