/** The Integrated Soul: six-week original blueprint expanded into twelve original
 * offline seminar REVIEWS (A/B per week). The full 32-page owner-uploaded source and
 * expanded 64-page instructor edition are NOT redistributed in this public repository.
 * This faith-oriented reflective education is not counselling, treatment or diagnosis.
 */
export type SoulLesson={id:number;week:number;title:string;scripture:string;overview:string;
 concepts:[string,string,string];exercise:string;question:string;correct:string;wrong:[string,string];reason:string};
const rows:Array<[string,number,string,string,string,string,string,string,string,string,string]> = [
 [
  "Human Dignity and the Three-Lens Anthropology",
  1,
  "Genesis 1:26–27; 1 Thessalonians 5:23",
  "The Integrated Soul studies the person through philosophy, psychology and Christian spirituality. Plato's tripartite psychology raises the problem of inner conflict; Descartes raises the mind-body question; the Christian Imago Dei grounds human dignity. These are distinct forms of reasoning: a philosophical argument is not a brain scan and a theological conviction is not a clinical measurement.",
  "Philosophical models of identity|Narrative identity|Imago Dei",
  "Fictional case: an unsuccessful job applicant says, 'I am worthless.' Distinguish the event, the global judgment and a dignity-based alternative.",
  "What best integrates the three lenses without confusing evidence types?",
  "Acknowledge philosophical arguments, psychological hypotheses and scriptural commitments as different but discussable claims.",
  "Prove a person's worth with an achievement score.",
  "Declare that a single biblical verse establishes brain anatomy.",
  "The lenses address different questions; a Christian account of dignity does not depend on performance or a laboratory result."
 ],
 [
  "Personal Narrative and Identity Agency",
  1,
  "Psalm 139; Genesis 1:26–27",
  "Narratives can make experiences coherent while also filtering counterexamples. A self-label such as 'I always fail' may be a learned interpretation rather than an exhaustive fact. The Identity Mapping Audit asks for precise observations and alternatives. A Christian learner may reflect on received dignity while choosing an ethical action; the exercise need not disclose private family history.",
  "Role versus worth|Identity mapping|Agentic response",
  "Create a fictional identity map with a role, observed event, a revised limited claim and a respectful next action.",
  "What is an appropriate result of an educational identity map?",
  "A more specific interpretation and a freely chosen practical action.",
  "A formal diagnosis of attachment disorder.",
  "A certificate measuring personal worth.",
  "This learning tool supports reasoning and reflection; it is not a diagnostic instrument."
 ],
 [
  "Epistemology and Testing Beliefs",
  2,
  "Romans 12:2; Philippians 4:8",
  "A belief can be deeply held without being well supported. Compare correspondence, coherence and practical consequences while recognizing their limits. Informal fallacies, overgeneralization and selective evidence are useful checks for public claims and personal interpretations. Study Scripture in context and do not present a theological claim as empirical confirmation of an unrelated statistic.",
  "Evidence tests|Fallacies and counterexamples|Theological interpretation",
  "Audit a fictional headline claiming that all students are losing faith: identify the sample needed and an overgeneralized conclusion.",
  "What should follow when a strong claim lacks adequate evidence?",
  "Qualify it, investigate the source and consider alternatives.",
  "Repeat it more often until it feels true.",
  "Treat confidence as proof of accuracy.",
  "Responsible belief uses suitable evidence and permits revision."
 ],
 [
  "Thought Audits and Scripture Reframing",
  2,
  "2 Corinthians 10:5; Philippians 4:8",
  "A voluntary thought audit records an observable event, a thought about it, counterevidence, a balanced alternative and a small next step. This is educational reflective practice and must not be advertised as treatment of anxiety, depression or trauma. Biblical mind renewal is a Christian conviction, not evidence that illness disappears with correct thinking.",
  "Observed fact versus interpretation|Balanced alternative|Voluntary spiritual reflection",
  "Build a six-column thought-audit table using a low-stakes fictional scenario; include an opt-out for private matters.",
  "Which description is appropriate for the classroom thought audit?",
  "An optional critical-reflection exercise, not a substitute for qualified mental-health treatment.",
  "A guaranteed cure for depression.",
  "A test that reveals moral defects.",
  "The source intends reflective growth; ethical teaching avoids diagnostic and curative claims."
 ],
 [
  "Emotion, Reason and the Choice to Respond",
  3,
  "Galatians 5:22–23; Psalm 46",
  "Emotions convey salience but are not automatic verdicts on truth. A Stoic distinction between what can and cannot be influenced can help learners identify constructive choices while resisting passive acceptance of injustice. Physiological regulation claims should be modest. Specific polyvagal neuroanatomical claims remain contested; a facilitator cannot diagnose a nervous-system state from a short worksheet.",
  "Emotion and interpretation|Dichotomy of influence|Evidence limits",
  "For a fictional public speaker receiving a hostile message, separate body sensations, interpretation and a respectful response.",
  "What does an intense emotion prove by itself?",
  "That the person is experiencing a feeling, not that every interpretation is accurate.",
  "That the other person's motive is certainly hostile.",
  "That a diagnosed nervous-system state has been measured.",
  "Emotions warrant attention but do not replace examination of evidence."
 ],
 [
  "Optional Grounding and Spiritual Peace",
  3,
  "Philippians 4:6–7; Galatians 5:22–23",
  "The blueprint introduces Orient, Breathe, Pray and Anchor. The expanded learning activity presents these as optional attention and faith practices, not a clinical intervention. Learners may keep their eyes open, breathe naturally, skip prayer or choose reflection. A person who finds body-focused work uncomfortable may stop immediately. Patience and gentleness can be discussed as moral commitments without treating them as physiological test results.",
  "Orient–Breathe–Pray–Anchor|Voluntary participation|Safe alternatives",
  "Design two accessible options for a fictional stressed mentor: a short reflective pause and a non-breath-focused grounding alternative.",
  "Which safeguard belongs in a guided grounding activity?",
  "Meaningful opt-out and alternatives without physiological cure claims.",
  "Mandatory breath-holding despite discomfort.",
  "Diagnosis of nervous-system categories from the student's response.",
  "Choice and ordinary comfort practices prevent pressure and misleading certainty."
 ],
 [
  "Virtue Ethics and Christian Character",
  4,
  "Matthew 5; James 2:14–17",
  "Aristotle's virtue ethics asks what patterns of action shape a flourishing life. Courage and generosity depend on context and consequences for other people, not public admiration. The Christian understanding of grace and sanctification contributes a theological dimension. Neither a prayer streak nor a digital productivity tracker measures moral worth or God's approval.",
  "Eudaimonia|Virtue as practiced action|Grace and humility",
  "In a fictional team, compare a leader's self-reported patience with evidence that coworkers are frequently interrupted.",
  "What is a responsible indicator of a chosen virtue practice?",
  "A specified, observable and consent-respecting action, interpreted cautiously.",
  "The number of minutes of prayer as a score of holiness.",
  "A claim that one successful day proves permanent character change.",
  "A tracking tool can record behavior, not moral superiority."
 ],
 [
  "Habits, Micro-Practices and Recovery",
  4,
  "Galatians 5:22–23; Matthew 5",
  "Habit plans work better when they name a cue, a modest response, an obstacle and a restart. A plan must account for disability, shift work, caring responsibilities and structural conditions. Weekly observations can reveal whether a particular action occurred, but cannot certify deep character transformation. The source's Habit Stack and Virtue Tracker remains voluntary and revisable.",
  "Implementation intentions|Environment and constraints|Nonjudgmental tracking",
  "Draft a fictional 30-day listening practice with a cue, ethical action, obstacle and restart rule.",
  "What follows from missing a planned habit day?",
  "Review barriers and adjust the next action without treating it as a judgment of spiritual worth.",
  "Conclude that moral failure has been medically demonstrated.",
  "Restart all practices with an impossible workload.",
  "A safe habit plan prioritizes realism, context and learning."
 ],
 [
  "Suffering, Meaning and the Ethics of Lament",
  5,
  "Psalms 13 and 42; Romans 8",
  "Theodicy, logotherapy and theology of the cross invite serious reflection on suffering without declaring each harmful event beneficial. Grief and lament are legitimate; post-traumatic growth is neither guaranteed nor required. Classroom discussion must not become trauma processing, especially with emotionally vulnerable learners. The source explicitly separates educational meaning-making from clinical treatment.",
  "Theodicy|Meaning without coercion|Biblical lament",
  "Fictional disaster case: contrast a leader demanding gratitude from survivors with volunteers offering shelter, listening and consent.",
  "Which response respects suffering without forced positivity?",
  "Offer practical support, allow lament and leave meaning-making voluntary.",
  "Insist everyone describe the hidden benefit of catastrophe.",
  "Treat uncertainty as spiritual failure.",
  "The course encourages honest lament, noncoercive interpretation and boundaries."
 ],
 [
  "Trauma-Informed Educational Practice",
  5,
  "2 Corinthians 1:3–4; Psalm 13",
  "An ethical facilitator maintains psychological safety, transparent expectations, choice and appropriate referral options. No learner needs to narrate personal trauma for an assignment. Fictional and composite cases are always acceptable; optional silence can be a competent response. Professional clinicians handle therapy and diagnosis. The course may teach care and meaning while refusing to overpromise a healing result.",
  "Safety and choice|Referral boundaries|No forced disclosure",
  "Create a trauma-informed ground-rule sheet for a fictional masterclass, including opt-out, confidentiality limits and appropriate referrals.",
  "What is a sound classroom safeguard for Week 5?",
  "Provide fictional alternatives, opt-outs and clear referral boundaries.",
  "Require disclosure of the participant's worst experience.",
  "Tell learners to stop prescribed care and rely only on the course.",
  "Consent and qualified referral protect participants from foreseeable harm."
 ],
 [
  "Relationships, Boundaries and Communal Life",
  6,
  "1 Corinthians 12; Matthew 22:37–40",
  "Buber's I–Thou and I–It distinction offers a lens for recognizing when persons are treated as ends rather than instruments. Ordinary task coordination may involve instrumental roles without exhausting the person's dignity. Healthy boundaries clarify what one will do and respect others' consent. Attachment concepts are educational frameworks, not diagnoses from a brief quiz.",
  "I–Thou versus I–It|Boundaries and consent|Communal responsibility",
  "For a fictional ministry team, draft one respectful boundary and one accountable repair action.",
  "How can boundaries support healthy Christian community?",
  "Clarify mutual responsibilities while honoring dignity and consent.",
  "Require unconditional availability in all circumstances.",
  "Allow leaders to override other people's consent.",
  "Good boundaries can make responsible care sustainable."
 ],
 [
  "Divine Vocation and the Personal Life Blueprint",
  6,
  "Mark 10:42–45; 1 Corinthians 12",
  "The capstone integrates a coherent worldview, realistic growth plan, voluntary spiritual commitments, relational ethics and a 90-day schedule. The source describes a Personal Life Blueprint and reflective facilitator feedback, not clinical scoring or academic accreditation. A credible final statement names whom to serve, what to practice, how to assess practical effects and where uncertainty remains.",
  "Vocation and limits|90-day review|Human-assessed capstone",
  "Draft a fictional five-part Life Blueprint with one philosophical argument, one evidence-aware habit, one spiritual practice, one boundary and a review date.",
  "What can a passed in-app reflection check legitimately establish?",
  "Only completion of a local learning milestone, not verified transformation or accredited credit.",
  "Guaranteed healing from trauma.",
  "Theological perfection and automatic university qualification.",
  "A substantive capstone still requires independent human feedback and ongoing development."
 ]
];
export const SOUL_LESSONS:SoulLesson[]=rows.map((x,i)=>({
 id:i+1,title:x[0],week:x[1],scripture:x[2],overview:x[3],
 concepts:x[4].split("|") as [string,string,string],exercise:x[5],
 question:x[6],correct:x[7],wrong:[x[8],x[9]],reason:x[10]
}));
export const SOUL_WEEKS=[
 "The Architecture of the Human Soul",
 "Cognitive Renewal and the Battle for Truth",
 "Emotional Mastery and Inner Tranquility",
 "Virtue, Habits and Moral Character",
 "Suffering, Trauma and Redemptive Meaning",
 "Relational Wholeness and Divine Vocation"
] as const;
export const SOUL_PRACTICUMS=[
 "Identity Mapping Audit","Thought Audit & Scripture Reframing Matrix",
 "Optional Four-Step Orient/Breathe/Pray/Anchor Practice","Habit Stack & Virtue Tracker",
 "Meaning Construction (fictional-case option)","Relational Blueprint & Vocation Statement"
] as const;
export function soulLesson(id:number){return Number.isInteger(id)?SOUL_LESSONS.find(x=>x.id===id):undefined;}
export function soulCorrectIndex(id:number){return soulLesson(id)?(id*7+1)%3:-1;}
export function soulCheck(id:number,choice:number){
 return !!soulLesson(id)&&Number.isInteger(choice)&&choice>=0&&choice<=2&&soulCorrectIndex(id)===choice;
}
export function soulProgress(read:number[],passed:number[]){
 const keep=(v:number[])=>new Set(v.filter(x=>!!soulLesson(x)));
 const r=keep(read),p=keep(passed);
 const completed=[...r].filter(x=>p.has(x)).length;
 return {total:SOUL_LESSONS.length,completed,percent:Math.round(completed*100/SOUL_LESSONS.length)};
}
