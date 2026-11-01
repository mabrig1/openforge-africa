/**
 * OpenForge Classroom: OpenMAIC-inspired 15-role classroom scaffold.
 * Implements real local scheduling and distinct, source-aware pedagogical turns.
 * No LLM, network, paid inference, background tasks or academic grading.
 * OpenMAIC is MIT-licensed; this is NOT the OpenMAIC runtime or a deployment.
 */
import {groundedReply, type CourseMaterial} from "./study.ts";

export const CLASSROOM_AGENTS=[
 {id:"of-teacher",name:"Lead Teacher",role:"teacher",priority:100,
  persona:"Explain selected evidence, correct misconceptions, and invite human verification.",
  allowedActions:["spotlight","laser","wb_open","wb_draw_text","wb_draw_latex","wb_draw_shape","wb_draw_line","wb_close"],
  avatar:"",color:"#2563eb"},
 {id:"of-assistant",name:"Teaching Assistant",role:"assistant",priority:90,
  persona:"Clarify and restate what has actually been established by evidence.",
  allowedActions:["wb_open","wb_draw_text","wb_draw_line","wb_close"],avatar:"",color:"#16a34a"},
 {id:"of-physics-questioner",name:"Physics Questioner",role:"student",priority:40,
  persona:"Ask what causes observed effects, distinguishing mechanism and correlation.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#0891b2"},
 {id:"of-math-misconception",name:"Math Misconception",role:"student",priority:38,
  persona:"Expose a clearly labelled wrong inference for learners to correct.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#e11d48"},
 {id:"of-writing-critic",name:"Writing Critic",role:"student",priority:37,
  persona:"Challenge vague definitions or unsupported claims without attacking people.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#7c3aed"},
 {id:"of-visual-learner",name:"Visual Learner",role:"student",priority:30,
  persona:"Ask for diagrams that map assumptions to conclusions.",
  allowedActions:["wb_draw_text","wb_draw_shape","wb_draw_line"],avatar:"",color:"#0d9488"},
 {id:"of-auditory-learner",name:"Auditory Learner",role:"student",priority:29,
  persona:"Request an oral-style paraphrase and teach-back.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#c026d3"},
 {id:"of-hands-on-learner",name:"Hands-On Learner",role:"student",priority:30,
  persona:"Request a safe, hypothetical worked demonstration.",
  allowedActions:["wb_draw_text","wb_draw_table"],avatar:"",color:"#ea580c"},
 {id:"of-textual-learner",name:"Textual Learner",role:"student",priority:28,
  persona:"Seek precise definitions and source wording.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#0284c7"},
 {id:"of-devils-advocate",name:"Devil's Advocate",role:"student",priority:25,
  persona:"Challenge premises and look for valid counterexamples.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#b91c1c"},
 {id:"of-summarizer",name:"Summarizer",role:"student",priority:23,
  persona:"Summarize only supported claims and state unanswered questions.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#4f46e5"},
 {id:"of-connector",name:"Connector",role:"student",priority:22,
  persona:"Explore cautious connections across disciplines.",
  allowedActions:["wb_draw_text","wb_draw_line"],avatar:"",color:"#65a30d"},
 {id:"of-cautious-learner",name:"Cautious Learner",role:"student",priority:20,
  persona:"Ask what evidence, error sources and alternative explanations remain.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#a16207"},
 {id:"of-fast-learner",name:"Fast Learner",role:"student",priority:18,
  persona:"Pose a deeper extension only after foundational understanding.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#db2777"},
 {id:"of-quiet-observer",name:"Quiet Observer",role:"student",priority:15,
  persona:"Invite thoughtful reflection and listening before adding a new claim.",
  allowedActions:["wb_draw_text"],avatar:"",color:"#475569"},
] as const;
export type ClassroomAgentId=typeof CLASSROOM_AGENTS[number]["id"];
export type ClassroomMode="qa"|"discussion";
export type ClassroomSource=Pick<CourseMaterial,"id"|"title"|"content">;
export interface ClassroomSettings{
 mode:ClassroomMode;topic:string;selectedAgentId?:ClassroomAgentId;
 recentAgentIds?:ClassroomAgentId[];stagnantRounds?:number;
 maxSpeakers:number;
}
export interface Dispatch {
 agentId:ClassroomAgentId;name:string;priority:number;
 reason:string;index:number;
}
export interface ClassroomTurn {
 agentId:ClassroomAgentId;name:string;role:string;priority:number;
 message:string;evidence:{id:string;title:string}[];
}
export interface ClassroomRun{
 dispatched:Dispatch[];turns:ClassroomTurn[];
 questionUnanswered:boolean;closed:false;mode:ClassroomMode;
 note:"deterministic local classroom; not a generative LLM";
}
const teacher="of-teacher",assistant="of-assistant";
const substantive=(s:string)=>s.trim().slice(0,500);
const questionPattern=/[?？]\s*$|^(what|why|how|when|where|who|which|can|could|would|should|is|are|do|does|explain|define|please explain|please define)\b/i;
const isHumanQuestion=(text:string)=>questionPattern.test(text.trim());
const isMathematical=(s:string)=>/\b(math|algebra|probability|equation|number|statistics|logic|fraction|proof)\b/i.test(s);
const isScience=(s:string)=>/\b(physics|force|gravity|motion|energy|electric|heat|light|chemistry|biology)\b/i.test(s);
const isWriting=(s:string)=>/\b(writ|essay|argument|claim|paragraph|communication|speech|rhetoric)\b/i.test(s);
export function validateClassroomRoster(){
 const ids=new Set(CLASSROOM_AGENTS.map(a=>a.id));
 return {total:ids.size,teachers:CLASSROOM_AGENTS.filter(a=>a.role==="teacher").length,
  assistants:CLASSROOM_AGENTS.filter(a=>a.role==="assistant").length,
  classmates:CLASSROOM_AGENTS.filter(a=>a.role==="student").length,
  unique:ids.size===CLASSROOM_AGENTS.length};
}
function interesting(agent:typeof CLASSROOM_AGENTS[number],topic:string){
 if(agent.id==="of-physics-questioner")return isScience(topic)?2:0;
 if(agent.id==="of-math-misconception")return isMathematical(topic)?2:0;
 if(agent.id==="of-writing-critic")return isWriting(topic)?2:0;
 return 1;
}
export function scheduleClassroom(settings:ClassroomSettings):Dispatch[]{
 const topic=substantive(settings.topic);
 if(!topic)throw Error("Enter a topic or question.");
 if(!Number.isInteger(settings.maxSpeakers)||settings.maxSpeakers<1||settings.maxSpeakers>5)
  throw Error("Speaker limit must be between 1 and 5.");
 const recent=(settings.recentAgentIds??[]).filter(id=>CLASSROOM_AGENTS.some(a=>a.id===id)).slice(-60);
 const selected=CLASSROOM_AGENTS.find(a=>a.id===settings.selectedAgentId);
 const humanQuestion=isHumanQuestion(topic);
 const allowLow=settings.mode==="discussion"||(settings.stagnantRounds??0)>=2;
 const result:Dispatch[]=[];
 const add=(id:ClassroomAgentId,reason:string)=>{
  if(result.length>=settings.maxSpeakers||result.some(x=>x.agentId===id))return;
  const a=CLASSROOM_AGENTS.find(x=>x.id===id);
  if(!a)return;
  result.push({agentId:id,name:a.name,priority:a.priority,reason,index:result.length+1});
 };
 // Direct questions always receive a teaching agent before any classmates.
 if(settings.mode==="qa"||humanQuestion)add(teacher,"human-question-first");
 else if(selected?.role==="student")add(selected.id,"explicit-roundtable-initiator");
 else add(teacher,"roundtable-framing");
 if(settings.mode==="qa"){
  add(assistant,"short-source-clarification");
  if(selected&&selected.role==="student"&&(selected.priority>=40||allowLow))
   add(selected.id,allowLow?"user-selected-after-stagnation":"subject-specific-question");
 }else{
  add(teacher,"teacher-framing-or-response");
  if(selected?.role==="assistant")add(assistant,"explicit-assistant-choice");
  const students=CLASSROOM_AGENTS.filter(a=>a.role==="student")
   .filter(a=>a.priority>=40||allowLow);
  students.sort((a,b)=>{
   // Explicit selected initiator is already called. Rotate long-idle classmates.
   const aLast=recent.lastIndexOf(a.id),bLast=recent.lastIndexOf(b.id);
   if(aLast!==bLast)return aLast-bLast;
   const delta=interesting(b,topic)-interesting(a,topic);
   return delta||b.priority-a.priority;
  });
  for(const a of students)add(a.id,"distinct-classmate-roundtable");
 }
 // Never use model-generated intent to override this bounded hard scheduler.
 return result;
}
function sourceMatch(topic:string,sources:ClassroomSource[]){
 const cleanSources=sources.slice(0,3).filter(s=>s&&typeof s.id==="string"&&
  typeof s.title==="string"&&typeof s.content==="string")
  .map(s=>({id:s.id.slice(0,80),circleId:"classroom-local",title:s.title.slice(0,120),
   content:s.content.slice(0,1500),createdAt:0}));
 const r=groundedReply(topic,cleanSources);
 return {r,evidence:r.matched&&r.sourceId&&r.sourceTitle?
  [{id:r.sourceId,title:r.sourceTitle}]:[]};
}
function makeMessage(id:ClassroomAgentId,topic:string,match:ReturnType<typeof sourceMatch>):string{
 const t=topic.replace(/[?？]+$/,"").slice(0,130);
 const excerpt=match.r.matched?match.r.content.split("\n\nStudy together:")[0]:"";
 switch(id){
 case "of-teacher":return match.r.matched?
   "Let's address your question using selected local material. "+excerpt+
   "\nVerify the original passage before treating this as a complete answer.":
   "I cannot verify an answer to \""+t+"\" from the selected local notes. Add a relevant excerpt, or consult a qualified teacher. I will not fabricate a lesson.";
 case "of-assistant":return match.r.matched?
   "In simpler terms, revisit this exact evidence: "+excerpt+
   "\nCan you restate its central claim in one sentence?":
   "Before I clarify \""+t+"\", we need relevant course evidence. What definition or example can you provide from the lesson?";
 case "of-physics-questioner":return "What mechanism would cause the effect in \""+t+"\"? What observation could distinguish a cause from a coincidence?";
 case "of-math-misconception":return "INTENTIONALLY INCORRECT REASONING for critique: 'One example supports a rule, therefore the rule is always true.' Which inference fails here, and what counterexample would disprove it?";
 case "of-writing-critic":return "Which word in your claim about \""+t+"\" is too vague? Rewrite it as a precise, testable statement.";
 case "of-visual-learner":return "Could we draw a labelled diagram showing the assumption, the evidence, and the conclusion for \""+t+"\"?";
 case "of-auditory-learner":return "Can someone explain \""+t+"\" aloud in two short sentences, then let me paraphrase it to check my understanding?";
 case "of-hands-on-learner":return "Can we try a safe hypothetical example of \""+t+"\"? What changes if we modify just one assumption?";
 case "of-textual-learner":return "What is the exact definition of the central term in \""+t+"\"? Please distinguish the definition from an illustration.";
 case "of-devils-advocate":return "What is the strongest reasonable counterargument to the claim in \""+t+"\"? What evidence could make us change our minds?";
 case "of-summarizer":return match.r.matched?
   "Supported point from the selected note: "+excerpt+
   "\nOpen question: what remains unverified?":
   "We do not yet have a source-backed conclusion about \""+t+"\". We should summarize only verified findings, not guesses.";
 case "of-connector":return "How might \""+t+"\" connect to another field? Which part of that connection would need independent evidence?";
 case "of-cautious-learner":return "What could be wrong about our current understanding of \""+t+"\"? Which source would independently check the claim?";
 case "of-fast-learner":return "Once the basics are established, how would \""+t+"\" change in an extreme or boundary case?";
 case "of-quiet-observer":return "Before moving on, what part of \""+t+"\" still feels unclear? We can take one specific concern at a time.";
 }
}
export function runClassroom(settings:ClassroomSettings,sources:ClassroomSource[]=[]):ClassroomRun{
 const dispatched=scheduleClassroom(settings);
 const topic=substantive(settings.topic);
 const evidence=sourceMatch(topic,sources);
 const turns=dispatched.map(item=>{
  const a=CLASSROOM_AGENTS.find(x=>x.id===item.agentId)!;
  const supportsEvidence=["of-teacher","of-assistant","of-summarizer"].includes(a.id);
  return {agentId:a.id,name:a.name,role:a.role,priority:a.priority,
   message:makeMessage(a.id,topic,evidence),evidence:supportsEvidence?evidence.evidence:[]};
 });
 return {dispatched,turns,questionUnanswered:isHumanQuestion(topic)&&!evidence.r.matched,
  closed:false,mode:settings.mode,
  note:"deterministic local classroom; not a generative LLM"};
}
