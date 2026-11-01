/** Fixed fictional interview-training cases adapted from PSY 210 Module 5
 * and Appendix C; this is not therapy, clinical AI, or a real patient encounter.
 */
export type Psy210InterviewTurn={
 skill:string;
 prompt:string;
 choices:[string,string,string];
 replies:[string,string,string];
 best:0|1|2;
 explanation:string;
};
export type Psy210InterviewCase={
 name:string;opening:string;turns:[Psy210InterviewTurn,Psy210InterviewTurn,Psy210InterviewTurn,Psy210InterviewTurn,Psy210InterviewTurn];
};
export const PSY210_CLIENTS:Psy210InterviewCase[]=[
 {name:"Academic stress",opening:"Fictional learner: I have exams soon and can't stop worrying about my study progress.",
  turns:[
   {skill:"Open question",prompt:"Invite the person's account.",choices:["You have a clinical condition.","What have recent study evenings been like for you?","Just study harder."],
    replies:["I didn't come for a diagnosis.","I often start late and go to bed exhausted.","I'm trying, but it's difficult."],best:1,
    explanation:"Open questions allow the fictional person to set out their experience without premature labeling."},
   {skill:"Reflect feeling",prompt:"Respond to what was shared.",choices:["That sounds exhausting and frustrating.","You are exaggerating.","I guarantee you will pass."],
    replies:["Yes, that's exactly how it feels.","I don't feel heard.","I wish you could be so sure."],best:0,
    explanation:"Tentative feeling reflections convey listening and avoid unsupported predictions."},
   {skill:"Clarify context",prompt:"Explore a pattern rather than blame.",choices:["Why are you lazy?","I already know the solution.","When is studying hardest to begin?"],
    replies:["That makes it harder to talk.","I want to understand it myself.","Usually late at night after scrolling on my phone."],best:2,
    explanation:"Specific, neutral clarification is safer than judging the person."},
   {skill:"Explore resources",prompt:"Preserve autonomy.",choices:["Stop speaking to your classmates.","What has helped during previous demanding weeks?","AI companionship should replace all human support."],
    replies:["That sounds isolating.","Studying with a peer used to help.","I would still like support from people."],best:1,
    explanation:"Strengths-oriented exploration invites options without prescribing one."},
   {skill:"Close respectfully",prompt:"Summarize and invite correction.",choices:["We discussed tiredness, worries and study options. Did I understand you?","Your diagnosis is confirmed.","There is no need for human help."],
    replies:["Yes; I'd like to choose one small step.","I didn't ask for a diagnosis.","That doesn't feel right."],best:0,
    explanation:"A collaborative summary checks understanding and avoids clinical claims."},
  ]},
 {name:"Workplace conflict",opening:"Fictional employee: After tense meetings with my supervisor, I replay every word in my head.",
  turns:[
   {skill:"Invite specifics",prompt:"Begin without blame.",choices:["Your supervisor must be wrong.","Resign immediately.","Can you tell me about one recent meeting?"],
    replies:["I'm not sure of their motives.","I can't make that decision right now.","I asked for clarification and got a short answer."],best:2,
    explanation:"Explore a concrete episode instead of announcing the cause or solution."},
   {skill:"Reflect an emotion",prompt:"Show careful attention.",choices:["The uncertainty sounds stressful after work.","Nothing happened; forget it.","You have a disorder."],
    replies:["I do feel tense long after the meeting.","It matters to me.","I'm not seeking a diagnosis."],best:0,
    explanation:"A tentative reflection leaves space for the other person to confirm or correct it."},
   {skill:"Clarify intentions",prompt:"Ask what the person wanted.",choices:["Why didn't you do better?","What were you hoping to clarify in that meeting?","I know your supervisor's thoughts."],
    replies:["That sounds judgmental.","I needed clearer project instructions.","You couldn't know what they think."],best:1,
    explanation:"Clarify communication goals without mind-reading."},
   {skill:"Explore a choice",prompt:"Offer agency.",choices:["You must confront them publicly.","Stop working with others.","What options for getting clearer instructions would suit you?"],
    replies:["That might create more conflict.","That isn't realistic.","Maybe ask for a brief written check-in."],best:2,
    explanation:"Let the fictional person consider realistic alternatives."},
   {skill:"Summary",prompt:"End with a non-diagnostic summary.",choices:["Clarity and respectful communication seem important. What have I missed?","You have no options.","I can certify that your supervisor is abusive."],
    replies:["That's right; boundaries matter too.","I believe I have some options.","You haven't assessed the situation."],best:0,
    explanation:"A checked summary is better than a coercive recommendation."},
  ]},
 {name:"Life transition and relocation",opening:"Fictional person: Since I moved to a new city I feel cut off from my old support network.",
  turns:[
   {skill:"Open conversation",prompt:"Listen to personal meaning.",choices:["You should be grateful.","What has changed most since the move?","You are clinically depressed."],
    replies:["I want to explain, not be judged.","I miss seeing friends at weekends.","I don't want a diagnosis."],best:1,
    explanation:"Invite description without dismissing the speaker."},
   {skill:"Empathic response",prompt:"Reflect an apparent feeling.",choices:["You'll always be lonely.","Just use an AI friend instead.","This sounds lonely even though you chose to move."],
    replies:["I hope that's not true.","I want real relationships too.","Yes, the move has good and difficult sides."],best:2,
    explanation:"Validate the emotional meaning without making permanent claims."},
   {skill:"Explore strengths",prompt:"Identify possible positive exceptions.",choices:["When have you felt a little connected in the new city?","Why can't you make friends?","I know exactly how you feel."],
    replies:["I enjoyed a local gathering last week.","I'm trying.","Our circumstances aren't the same."],best:0,
    explanation:"A strengths-based inquiry helps identify resources without pretending complete understanding."},
   {skill:"Support autonomy",prompt:"Invite realistic next steps.",choices:["Attend an event every day.","What small connection might you like to explore?","Give me control of your social accounts."],
    replies:["That seems overwhelming.","Perhaps call an old friend and revisit the arts group.","I don't want that."],best:1,
    explanation:"Learners should respect pace, autonomy and privacy."},
   {skill:"Collaborative closing",prompt:"Summarize without diagnosis.",choices:["I can diagnose the difficulty.","Keep everything secret from people.","You miss familiar relationships and have a few emerging options. Is that accurate?"],
    replies:["That isn't appropriate.","I may want to talk to someone I trust.","Yes; I can see small openings."],best:2,
    explanation:"Summaries should be provisional; people may seek trusted human support."},
  ]},
];
export function psy210ValidSession(caseIndex:number,chosen:number[]) {
 return Number.isInteger(caseIndex)&&caseIndex>=0&&caseIndex<PSY210_CLIENTS.length&&
  Array.isArray(chosen)&&chosen.length<=5&&chosen.every(v=>Number.isInteger(v)&&v>=0&&v<=2);
}
export function psy210InterviewProgress(caseIndex:number,chosen:number[]){
 if(!psy210ValidSession(caseIndex,chosen))return {turns:0,modelResponses:0,finished:false};
 const c=PSY210_CLIENTS[caseIndex];
 return {turns:chosen.length,
   modelResponses:chosen.filter((choice,index)=>choice===c.turns[index].best).length,
   finished:chosen.length===5};
}
