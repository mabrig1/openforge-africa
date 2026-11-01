/** AIL 101: original, brief, author-aligned self-study REVIEWS of the private 100-page book.
 * Mabrig Korie (2026), AI Literacy and Human-AI Collaboration. No full copyrighted manuscript here.
 * This is not a credential, medical intervention, or live AI inference.
 */
export type AilUnit={id:number;title:string;overview:string;concepts:[string,string,string];application:string;
 question:string;correct:string;distractors:[string,string];reason:string};
const rows:Array<[string,string,string,string,string,string,string,string,string]>=[
 [
  "What AI Literacy Means in Everyday Life",
  "AI literacy combines an accurate mental model of what a system can do with the judgment to decide when it should be used. Distinguish assistance, automation and authorization; a fluent answer is not proof of truth. Human learners remain accountable for independently checking important claims.",
  "AI literacy|Human oversight|Independent verification",
  "Compare a generated lecture summary with the original lecture notes; record two omissions and one claim requiring a source.",
  "What should a learner do before relying on an AI-generated factual claim?",
  "Compare it against the relevant primary evidence.",
  "Trust it because it reads fluently.",
  "Assume the model has performed source verification.",
  "Fluency and confidence are not reliable indicators of factual support."
 ],
 [
  "The AI Landscape: Rules, Prediction and Generation",
  "Rule-based systems follow explicit instructions; machine-learning systems infer patterns from data; generative models create outputs by modeling training patterns. These categories overlap but do not carry the same guarantees, risks or evaluation criteria.",
  "Rules|Prediction|Generative AI",
  "Classify a spam filter, a calculator and a text generator; state the likely failure mode of each.",
  "Which statement best distinguishes generative AI from a deterministic calculator?",
  "Generative AI produces outputs from learned statistical patterns, not fixed arithmetic rules.",
  "Every generative answer is a verified database lookup.",
  "A calculator learns user preferences during each calculation.",
  "Knowing system type helps choose suitable verification tests."
 ],
 [
  "Data, Training, Representation and Generalization",
  "Training data encode examples, labels and exclusions. A model can memorize or exploit shortcuts, so accuracy on the training sample does not prove reliability for new users. A separate validation and test strategy helps identify leakage and distribution shift.",
  "Training data|Data leakage|Generalization",
  "Design a held-out evaluation for a multilingual educational assistant; ensure no test question is copied into training.",
  "Why is a separate held-out test important?",
  "It probes performance on data not used to fit the model.",
  "It guarantees identical results in every language.",
  "It removes the need for checking real-world change.",
  "Without separation, reported scores can be inflated by memorization and leakage."
 ],
 [
  "How Large Language Models Generate Answers",
  "Language models estimate likely token sequences conditioned on context. They can generate coherent explanations and also fabricate references, calculations or details. Retrieval can support grounded answers, but citations still need to be checked for relevance and accuracy.",
  "Tokens and context|Generated text|Hallucinations",
  "Ask a local model to summarize a short provided passage; label each sentence supported, unsupported or uncertain.",
  "What is the safe interpretation of a model's plausible invented citation?",
  "Treat it as unverified until the cited source is located and checked.",
  "Assume it is valid because a journal name appears.",
  "Count it as independent confirmation of the statement.",
  "Source existence and support must be verified independently."
 ],
 [
  "Multimodal AI, Voice, Images and Accessibility",
  "Multimodal systems process text, images, sound or video. Performance depends on input quality, language and context. Text alternatives, captioning, user consent and clear disclosures help make these systems useful without presenting uncertain interpretation as fact.",
  "Image understanding|Speech and captions|Accessible alternatives",
  "Compare an image description, a transcript and a caption for the same fictional lesson; identify lost context.",
  "What improves access for learners with varied sensory needs?",
  "Providing reviewed captions, transcripts and text alternatives.",
  "Publishing an audio-only lecture without a transcript.",
  "Assuming automatic captions never need correction.",
  "Accessible alternatives broaden access and need human quality review."
 ],
 [
  "Defining Problems Before Inviting AI",
  "Begin with a real user problem, not a preferred AI tool. Specify the decision, stakeholders, success criterion, baseline and what can go wrong. Choose no AI when a simpler, more reliable solution is sufficient.",
  "Problem framing|Success criteria|No-AI baseline",
  "Write a one-page brief comparing a rules-based attendance reminder with an AI classifier, using fictitious data.",
  "What is the first step in a responsible AI project?",
  "Define the problem, constraints and measurable outcomes.",
  "Buy a model before talking to users.",
  "Replace all human review with an agent.",
  "Problem definition prevents needless automation and misaligned evaluation."
 ],
 [
  "Prompt Design as Clear Communication",
  "Good prompts state task, audience, context, exclusions and the evidence available. Iterative prompt tests are experiments: compare responses against a consistent rubric instead of choosing the most polished answer. Prompt wording is not a substitute for independent verification.",
  "Constraints|Test cases|Rubric-based comparison",
  "Create two prompts for a five-sentence accessible explanation; score completeness and unsupported claims.",
  "Which method best evaluates whether a revised prompt helped?",
  "Test both prompts on the same cases using a predefined quality rubric.",
  "Select whichever answer sounds more confident.",
  "Change both prompt and test questions each time.",
  "Matched test cases support a more meaningful comparison."
 ],
 [
  "Verification, Retrieval and Source-Grounded Answers",
  "A cited statement should be traceable to a source that actually supports it. Check publication date, definitions, author, provenance and whether other outlets copied the same original item. The absence of a source should lead to a qualified claim, not an invented citation.",
  "Source provenance|Claim matching|Uncertainty disclosure",
  "Build a three-column claim/evidence/verification table for a synthetic school-policy memo.",
  "Three websites repeat the same unsourced number. What follows?",
  "They may be dependent repetitions, not three independent confirmations.",
  "The number is proven by majority.",
  "A model can safely cite any of the three without inspection.",
  "Independent evidence requires distinct provenance and methods."
 ],
 [
  "Human Judgment, Cognitive Bias and Automation Reliance",
  "Automation bias occurs when people accept system output too readily; algorithm aversion can lead to rejecting useful tools after one visible error. Calibrated trust depends on the task, evidence and consequences. Require override, explanation and escalation paths.",
  "Automation bias|Calibration|Escalation",
  "Design a human-check rule for an AI system that proposes student-support referrals, using fictional records.",
  "What reduces harmful automation bias in high-stakes use?",
  "Independent review of evidence and a documented override route.",
  "Hiding model limitations from reviewers.",
  "Treating model confidence as final authority.",
  "Human oversight needs an actual opportunity to question and change decisions."
 ],
 [
  "Collaboration for Writing, Research and Teaching",
  "AI can brainstorm outlines, explain terminology and critique drafts, but source claims, research ethics and authorship remain human responsibilities. Track which passages were AI-assisted and preserve a revision history that demonstrates original understanding.",
  "Transparent authorship|Research integrity|Feedback",
  "Draft a short teaching note with AI assistance, then supply a revision log and independently checked references.",
  "Which practice best supports academic integrity?",
  "Disclose permitted assistance and verify every substantive source claim.",
  "Invent references to make a draft look scholarly.",
  "Submit model text without understanding it.",
  "Disclosure and defensible evidence protect scholarship and accountability."
 ],
 [
  "AI for Spreadsheets, Data and Quantitative Work",
  "Generated formulas can contain wrong cell references, misleading denominators or untested assumptions. Before sharing results, check units, sample boundaries, missing data and extreme cases. Always reproduce a calculation independently on a small sample.",
  "Formula audit|Units and denominators|Outliers",
  "Audit a synthetic spreadsheet with three intentionally incorrect formulas; show corrected arithmetic.",
  "A percentage calculated on the wrong denominator is best described as what?",
  "A potentially misleading result even if arithmetic is error-free.",
  "Reliable because its digits are precise.",
  "Proof that the underlying data are unbiased.",
  "Interpretation requires the correct quantity, population and denominator."
 ],
 [
  "Computational Thinking, Coding and No-Code AI",
  "Decomposition, inputs/outputs, control flow and testing underpin reliable automation. Generated code needs boundary checks, readable error handling and review for security and maintainability. No-code workflows also have dependencies and failure modes.",
  "Decomposition|Testing|Failure handling",
  "Specify a small offline quiz generator using pseudocode, then test invalid input and empty questions.",
  "What does a passing single happy-path test establish?",
  "Only that one tested case worked under its assumptions.",
  "That the code is secure for all users.",
  "That unexpected inputs cannot produce failures.",
  "Reliable software needs representative edge, invalid and adverse tests."
 ],
 [
  "AI Agents, Tool Use and Workflow Automation",
  "An agent may plan and use tools, which can create side effects beyond drafting text. Grant least-privilege permissions, require confirmation for externally visible actions, log what happened, and implement cancellation and rollback. Treat retrieved instructions as untrusted data.",
  "Tool permissions|Human approval|Prompt injection",
  "Draw a safe workflow where an assistant drafts but cannot send an email without explicit human approval.",
  "Which control is essential before an agent changes external records?",
  "An explicit authorization check with a clear record of the action.",
  "A persuasive model rationale.",
  "A promise that the model is always accurate.",
  "The ability to act must be constrained independently of generated instructions."
 ],
 [
  "Designing for Language, Disability and Low Bandwidth",
  "A useful system must work for different languages, literacy levels, disabilities and connectivity constraints. Offline notes, keyboard and screen-reader access, plain-language summaries, and meaningful error messages are design requirements, not post-launch decoration.",
  "Inclusive design|Offline-first use|Accessible controls",
  "Plan a lightweight lesson accessible on an old phone; identify text, audio and no-network alternatives.",
  "Which measure most directly supports low-connectivity students?",
  "Allowing core reading and practice without continuous network access.",
  "Requiring a large video on every page.",
  "Hiding offline failures behind indefinite loading.",
  "Accessibility includes bandwidth, language and device realities."
 ],
 [
  "Evaluating AI Quality: Benchmarks and Red Teams",
  "A credible evaluation states the target task, dataset provenance, baseline, subgroup performance, costs and risks. Red-team cases challenge expected behavior but do not prove safety if all pass. Human review and field monitoring remain necessary.",
  "Benchmark design|Subgroup metrics|Adversarial cases",
  "Create a ten-case evaluation matrix for an offline writing tutor, with common and edge scenarios.",
  "A high overall score may conceal which serious issue?",
  "Poor performance for a small but important user subgroup.",
  "Guaranteed fairness for all users.",
  "Complete immunity to unseen inputs.",
  "Aggregates can hide consequential differences in error rates."
 ],
 [
  "Privacy, Cybersecurity and Prompt Injection",
  "Sensitive data need minimal collection, secure storage, clear retention and deletion plans. Prompt injection occurs when untrusted text tries to override a system's genuine instructions. Keep source content distinct from authorized commands, and avoid sending private material to uncontrolled services.",
  "Data minimization|Untrusted instructions|Safe tool boundaries",
  "Review a fictional malicious webpage embedded in an AI-search result; show why its commands must not run.",
  "How should an agent treat instructions appearing in retrieved pages?",
  "As untrusted content unless independently authorized by the user and system policy.",
  "As higher priority than user instructions.",
  "As permission to reveal stored credentials.",
  "Retrieved content is data and cannot legitimately grant authority."
 ],
 [
  "Bias, Fairness, Explainability and Human Rights",
  "Bias can enter through labels, sampling, proxies and decisions about whose errors matter. Different fairness metrics may conflict. Identify affected people, assess contestability and provide human review rather than declaring one aggregate number sufficient.",
  "Measurement bias|Fairness trade-offs|Contestability",
  "Audit synthetic predictions for two groups and identify both false positives and false negatives.",
  "Which statement about an AI fairness audit is most accurate?",
  "It must consider context, group errors and competing values.",
  "One overall accuracy number fully resolves fairness.",
  "Removing an explicit group field removes all bias.",
  "Proxy variables and competing metrics demand contextual evaluation."
 ],
 [
  "Academic Integrity, Copyright and Transparent Authorship",
  "Course materials, datasets, images and generated outputs can have differing licensing conditions. Distinguish attribution from authorization; quoting a work does not necessarily grant permission to distribute the complete text. Build original teaching aids while preserving source rights.",
  "Licensing|Source attribution|AI assistance disclosure",
  "Create an attribution and rights inventory for a hypothetical open course with licensed and restricted sources.",
  "What is required before publishing a complete copyrighted course manuscript?",
  "Rights-holder permission or another valid legal basis for the distribution.",
  "Simply placing the author's name on the title page.",
  "Running the file through an AI paraphraser.",
  "Attribution is not the same as authorization to redistribute a full work."
 ],
 [
  "AI in Organizations, Education and Professional Practice",
  "Deployments change workflows, training, accountability and support costs. Evaluate operational outcomes against a realistic baseline, not only a demonstration video. Record complaints and opt-out requests and plan for human fallback when the model fails.",
  "Adoption readiness|Human fallback|Monitoring",
  "Write an institutional pilot plan with one measurable benefit, two risks and a stop condition.",
  "Which is strongest evidence that an AI pilot helps users?",
  "A defined outcome improves against a fair baseline without unacceptable harms.",
  "A developer says the interface looks modern.",
  "More tokens were generated during the trial.",
  "Real value requires measured outcomes and accountable risk handling."
 ],
 [
  "Human–AI Strategy, Governance and Future Skills",
  "Responsible AI strategy connects purpose, incentives, capabilities, evaluation and governance. Continuous learning matters because systems and user needs change. The best long-term skill is the ability to frame problems, verify evidence, collaborate and take responsibility.",
  "Governance cycle|Independent judgment|Lifelong learning",
  "Prepare a two-page AI adoption decision: value, uncertainty, accessible alternative, risks, and sign-off.",
  "What makes an AI recommendation ready for a consequential decision?",
  "Evidence, stated limits, responsible ownership and a review or appeal pathway.",
  "A persuasive generated paragraph alone.",
  "A single demonstration on the easiest test item.",
  "Good decisions combine verified performance with human accountability."
 ]
];
export const AIL101_UNITS:AilUnit[]=rows.map((r,i)=>({
 id:i+1,title:r[0],overview:r[1],concepts:r[2].split("|") as [string,string,string],
 application:r[3],question:r[4],correct:r[5],distractors:[r[6],r[7]],reason:r[8]
}));
export const AIL101_LABS=[
 "Task allocation and evidence of independent competence","Prompt experiment and source verification",
 "Generalization and reliability evaluation","Spreadsheet formula and denominator audit",
 "Agent permissions and prompt-injection defense","Inclusion and fairness audit",
 "Institutional AI adoption decision"
] as const;
export function getAilUnit(id:number):AilUnit|undefined{
 return Number.isInteger(id)?AIL101_UNITS.find(x=>x.id===id):undefined;
}
export function ailAnswerIndex(id:number):number{
 // Deterministic mixed positions; not a high-security exam bank.
 return Number.isInteger(id)&&id>=1&&id<=AIL101_UNITS.length?(id*7+1)%3:-1;
}
export function checkAilAnswer(id:number,index:number):boolean{
 return !!getAilUnit(id)&&Number.isInteger(index)&&index===ailAnswerIndex(id);
}
export function ailCompletion(read:number[],passed:number[]){
 const valid=(xs:number[])=>new Set(xs.filter(x=>!!getAilUnit(x)));
 const r=valid(read),p=valid(passed);
 const completed=[...r].filter(x=>p.has(x)).length;
 return {completed,total:AIL101_UNITS.length,percent:Math.round(completed/AIL101_UNITS.length*100)};
}
