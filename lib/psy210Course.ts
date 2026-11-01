/**
 * PSY 210 Psychology in the Age of AI — native companion study track.
 * Adapted and paraphrased from the user-supplied PSY 210 course reader,
 * Version 1.0 (October 2026), which declares Creative Commons
 * Attribution 4.0 International (CC BY 4.0).
 * Source attribution must stay with any distribution.
 *
 * Full source reader, workbook, appendices and 60 supplemental practice
 * questions are in the author's separate standalone HTML course kit.
 * This app screen deliberately labels its shorter 18-question companion.
 * Not clinical care, diagnostic assessment or approved university credit.
 */
export const PSY210_ATTRIBUTION =
  "Adapted from PSY 210: Psychology in the Age of AI — The Human Mind & Behavior in a Tech-Mediated World, Course Reader & Workbook, Version 1.0, October 2026. Original source declares CC BY 4.0. This companion adds adapted reviews and new practice questions.";
export const PSY210_LICENSE_URL="https://creativecommons.org/licenses/by/4.0/";
export type Psy210Question = {
  stem:string; options:[string,string,string]; answer:0|1|2; rationale:string;
};
export type Psy210Module={
  id:number; name:string; weeks:string; learningGoal:string;
  overview:string; concepts:string[]; practice:string; caseExample:string;
  questions:[Psy210Question,Psy210Question,Psy210Question];
};
export const PSY210_MODULES:Psy210Module[]=[
  {id:1,name:"Foundations of Mind & AI",weeks:"1–2",
   learningGoal:"Compare psychological perspectives and analyze everyday responses to AI.",
   overview:"Psychology studies mind and behavior scientifically. Biological, cognitive, behavioral, psychodynamic, humanistic and sociocultural perspectives each illuminate different mechanisms. Machine learning and large language models can produce fluent social language, but conversational fluency alone does not establish consciousness, human understanding or reciprocal care. Anthropomorphism occurs when people attribute human motives or mental states to a non-human system. Investigate why users respond socially to chatbots and how interfaces may encourage assumptions about authority or emotion.",
   concepts:["Psychological perspectives","Narrow AI and large language models","Anthropomorphism","Human–AI social inference"],
   practice:"Choose one everyday smartphone behavior and explain it using three different perspectives. Then identify one unverified claim people might make about a conversational AI.",
   caseExample:"A learner calls a study chatbot their 'best friend.' The learner's sense of connection may be genuine, even though the app is not a human friend. Examine user experience, disclosure and possible design incentives.",
   questions:[
    {stem:"What does the cognitive perspective emphasize?",options:["Observable reinforcement alone","Attention, memory and reasoning","Only inherited brain anatomy"],answer:1,rationale:"Cognitive psychology investigates mental processes such as memory, attention, language and decision-making."},
    {stem:"Anthropomorphism involves…",options:["Attributing human traits or states to a machine","Verifying a machine's clinical license","Measuring human reaction time"],answer:0,rationale:"People often interpret fluent machine responses using social expectations developed for other humans."},
    {stem:"Fluent, apparently empathetic chatbot output by itself establishes…",options:["Its capacity for psychiatric diagnosis","Reciprocal human emotion","Neither consciousness nor reciprocal human feeling"],answer:2,rationale:"Convincing text is not direct evidence that a system possesses subjective experiences or human empathy."},
   ]},
  {id:2,name:"AI as a Mirror — Self-Awareness & Well-being",weeks:"3–4",
   learningGoal:"Critique AI-supported self-reflection using metacognition and well-being frameworks.",
   overview:"Self-concept describes beliefs about oneself; self-esteem evaluates the self; metacognition involves monitoring and regulating one's thinking. A tracker may invite useful reflection, but arbitrary mood categories, hypervigilant monitoring and biased feedback can distort experience. PERMA organizes well-being into Positive Emotion, Engagement, Relationships, Meaning and Accomplishment. A wellness product offering PERMA-themed features has not automatically demonstrated a clinical benefit: evaluation requires suitable evidence, context, transparency, privacy and user choice. In this course, use fictional data unless an authorized instructor has established a suitable personal-data protocol.",
   concepts:["Self-concept and metacognition","PERMA model","Confirmation bias","Evidence and privacy in wellness apps"],
   practice:"Audit a fictional wellness app. Identify which PERMA dimensions its features target, what independent evidence is missing and how data could be deleted.",
   caseExample:"A tracker shows improving mood for 14 fictional days. Consider seasonal change, workload, missing observations and the effect of tracking before claiming the app caused improvement.",
   questions:[
    {stem:"Metacognition is primarily…",options:["Thinking about and regulating one's thinking","A fixed personality type","A formal psychiatric diagnosis"],answer:0,rationale:"Metacognition concerns monitoring and regulating one's cognitive processes."},
    {stem:"Which term is NOT an element of PERMA?",options:["Relationships","Pathology","Meaning"],answer:1,rationale:"PERMA comprises Positive emotion, Engagement, Relationships, Meaning and Accomplishment."},
    {stem:"A high wellness-app feature score proves…",options:["A strong causal treatment effect","Perfect confidentiality","Neither effectiveness nor safety without independent evidence"],answer:2,rationale:"Visible features cannot replace reliable outcome studies, risk assessment or privacy review."},
   ]},
  {id:3,name:"Empathy, Relationships & AI",weeks:"5–6",
   learningGoal:"Differentiate empathy components and practise respectful, bounded listening.",
   overview:"Cognitive empathy is understanding another person's perspective; affective empathy concerns feeling with them; empathic concern adds motivation to help. An AI may produce language perceived as empathic without demonstrating human feeling or moral responsibility. Attachment theory illuminates why responsive AI companions may become meaningful to users, and why changes to their behavior can be distressing. Practical listening uses paraphrasing, tentative reflections of feeling, clarification and summary. For training, use fictional simulated cases, respect autonomy, and avoid treating a classroom exercise as therapy.",
   concepts:["Cognitive, affective and compassionate empathy","Attachment-like bonds with AI","Paraphrasing and reflective listening","Human support and appropriate boundaries"],
   practice:"Write a respectful open question, a tentative reflection and a neutral summary for a fictional person describing a stressful week.",
   caseExample:"A person feels distressed after a companion chatbot changes its style. Analyse both the person's genuine reaction and the non-reciprocal nature of a software relationship.",
   questions:[
    {stem:"Cognitive empathy most directly refers to…",options:["Feeling exactly the same emotion","Understanding another's perspective","Providing a medical diagnosis"],answer:1,rationale:"Perspective-taking differs from affective resonance and compassionate motivation."},
    {stem:"Which response illustrates reflective listening?",options:["You should quit immediately.","I know exactly what is wrong with you.","It sounds like this change has been unsettling."],answer:2,rationale:"Tentative reflection acknowledges the person's account without giving premature advice."},
    {stem:"A key ethical design concern for companion AI is…",options:["Misleading users about reciprocity and privacy","Ensuring every user believes AI is human","Replacing all human connection"],answer:0,rationale:"Transparency, autonomy, user expectations and privacy all matter."},
   ]},
  {id:4,name:"Decision-Making, Bias & Ethics",weeks:"7–8",
   learningGoal:"Explain judgment bias and conduct a cautious algorithmic fairness audit.",
   overview:"Dual-process frameworks distinguish relatively fast, intuitive thinking from more deliberate checking. Anchoring, availability, framing, representativeness and confirmation bias can shape decisions. AI tools may amplify these tendencies by supplying authoritative-looking answers, or mitigate them by presenting uncertainty and alternative evidence. Systemic algorithmic bias may arise in data, model objectives or deployment. A selection-rate difference between synthetic groups is descriptive evidence, not automatically proof of illegal discrimination, causal mechanism or intent. Ethical review must examine data, proxy variables, missing groups, contestability, appeal, privacy and accountability.",
   concepts:["System 1 and System 2","Framing and anchoring","Data/design/deployment bias","Consent, fairness and oversight"],
   practice:"Compare selection rates for two fictional groups. Explain what the difference shows and what additional subgroup, label and outcome data an auditor would need.",
   caseExample:"A fictional selection tool admits 48 of 80 in group A and 32 of 80 in group B. The 60% versus 40% descriptive gap needs investigation; it does not identify a cause.",
   questions:[
    {stem:"Anchoring is when…",options:["An initial value disproportionately influences a later estimate","All evidence is evaluated independently","People avoid using probabilities"],answer:0,rationale:"Initial numbers or suggestions can bias judgments, even when their relevance is uncertain."},
    {stem:"An observed selection-rate gap alone establishes…",options:["Deliberate discrimination","A difference that deserves further examination","That one group lacks ability"],answer:1,rationale:"Interpretation requires quality, comparability and context; rate differences do not reveal motive or mechanism alone."},
    {stem:"Meaningful oversight of an AI decision aid includes…",options:["Removing all human appeals","Hiding the decision criteria","Transparent limitations and a correction route"],answer:2,rationale:"Contestability and intelligible information support accountable decisions."},
   ]},
  {id:5,name:"Virtual Practice Lab — Interviewing Skills",weeks:"9–11",
   learningGoal:"Practise introductory interviewing skills and distinguish formulation from diagnosis.",
   overview:"Foundational interviewing requires rapport, open questions, appropriate clarification, accurate summaries, respect for autonomy and ethical boundaries. A tentative formulation offers a hypothesis about the person's circumstances that remains revisable; it is not a diagnosis. Students are not licensed clinicians by completing a role-play. The course's simulated clients depict ordinary fictional educational and workplace concerns, and any real-world risk disclosure must leave the simulation and follow appropriate qualified-human safeguarding channels. The local interview studio is scripted and cannot evaluate free-form therapeutic competence.",
   concepts:["Rapport and open questions","Reflective listening","Working formulation versus diagnosis","Informed consent and role boundaries"],
   practice:"Run the five-turn fictional client simulation, then write an explanation of how your responses facilitated or limited disclosure. Seek instructor review for actual interviewing competence.",
   caseExample:"A fictional student says studying feels overwhelming. An open question and neutral reflection invite elaboration; diagnosing them based on this brief account is inappropriate.",
   questions:[
    {stem:"A suitable exploratory opening is…",options:["Why are you incapable of coping?","Tell me what the past week has been like.","You have a specific disorder."],answer:1,rationale:"Open questions make space for a person's account and avoid premature labels."},
    {stem:"A psychological formulation in student training should be…",options:["Tentative and revisable","A guaranteed diagnosis","A medication directive"],answer:0,rationale:"A working hypothesis is not equivalent to a professional diagnosis."},
    {stem:"When an actual participant reports urgent safety concerns…",options:["Continue the scripted exercise without intervention","Attempt an autonomous AI diagnosis","Stop training and follow human-led safeguarding/referral procedure"],answer:2,rationale:"A student simulator cannot handle real clinical risk or provide qualified care."},
   ]},
  {id:6,name:"Applied Capstone Project",weeks:"12–14",
   learningGoal:"Plan a theoretically grounded, ethical psychology-and-AI design or critique.",
   overview:"Two capstone pathways are described in the source course. Option A designs a psychologically informed AI tool, naming the intended population, user journey, theory, evidence, risks, oversight and implementation. Option B critically evaluates an existing product, checking claims, bias, privacy, consent, accountability and recommendations. Both require a proposal, substantial written work and a suggested five-minute oral defense, subject to accessibility alternatives. The source rubric weights psychological grounding 25%, critical analysis 25%, innovation or insight 20%, ethics 15%, and communication 15%. Appropriate human assessors must verify sources, academic integrity and permitted AI assistance.",
   concepts:["Design pathway and analysis pathway","Evidence quality and rival explanations","Privacy/consent and design mitigation","Five-minute defense and AI-use disclosure"],
   practice:"Choose either capstone pathway and draft the problem statement, three source-verification questions, two ethical risks and mitigation options.",
   caseExample:"A wellness assistant promises to reduce loneliness. A responsible review examines studied populations, independent comparison groups, human alternatives, transparency, privacy and unintended dependency.",
   questions:[
    {stem:"Which capstone task belongs to Option B?",options:["Critically analyse an existing AI product","Diagnose a real patient","Train a clinical model without consent"],answer:0,rationale:"Option B requires evidence review, fairness, ethics and prioritized recommendations."},
    {stem:"The source capstone rubric gives ethics what weight?",options:["40%","15%","0%"],answer:1,rationale:"The reader lists ethics 15%, with psychological grounding 25%, critical analysis 25%, innovation 20%, and communication 15%."},
    {stem:"Responsible permitted AI support for the capstone requires…",options:["Presenting generated claims as one's own analysis","Inventing references to save time","Disclosing permitted assistance and verifying all substantive claims"],answer:2,rationale:"The source's academic-integrity rules require transparent assistance, original analysis and no fabricated data."},
   ]},
];
export const PSY210_WEEKS=[
  [1,1,"Psychological perspectives and media habits"],
  [2,1,"AI, anthropomorphism and machine social cues"],
  [3,2,"Self-awareness, metacognition and tracking limitations"],
  [4,2,"PERMA, evidence and app audits"],
  [5,3,"Forms of empathy and relational meaning"],
  [6,3,"Attachment and active-listening practice"],
  [7,4,"Heuristics, framing and decision aids"],
  [8,4,"Algorithmic fairness, ethics and appeals"],
  [9,5,"Interview opening, consent and rapport"],
  [10,5,"Listening, boundaries and tentative formulation"],
  [11,5,"Practice portfolio and capstone proposal"],
  [12,6,"Capstone evidence and project design"],
  [13,6,"Capstone written draft and critical review"],
  [14,6,"Capstone oral defense and reflection"],
] as const;
export const PSY210_ASSESSMENTS=[
  ["Mood-tracking experiment report",15],
  ["Bias audit report",15],
  ["Virtual interview laboratory portfolio",25],
  ["Capstone project",30],
  ["Participation and discussion",15],
] as const;
export function psy210GetModule(id:number):Psy210Module|undefined{
 return PSY210_MODULES.find(x=>x.id===id);
}
export function psy210Completion(read:number[],scores:Record<string,number>) {
 const completed=PSY210_MODULES.filter(m=>
   read.includes(m.id) && (scores[String(m.id)]??0)>=2).length;
 return {completed,total:6,percent:Math.round(completed/6*100),eligible:completed===6};
}
export function psy210ValidateCourse():string[]{
 const errors:string[]=[];
 if(PSY210_MODULES.length!==6)errors.push("Expected six modules");
 if(PSY210_WEEKS.length!==14)errors.push("Expected 14 weeks");
 if(PSY210_ASSESSMENTS.reduce((n,[_s,v])=>n+v,0)!==100)errors.push("Assessment weights must total 100%");
 for(const m of PSY210_MODULES){
   if(m.questions.length!==3)errors.push("Module "+m.id+" needs 3 companion questions");
   for(const q of m.questions){
     if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)
       errors.push("Invalid answer in module "+m.id);
   }
 }
 return errors;
}
