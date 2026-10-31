/**
 * Public demonstration curriculum synthesized from Mabrig Korie's supplied
 * "Logic and Critical Thinking" (First Teaching Edition, 2026).
 * Original chapter manuscript is NOT copied into this public repository.
 * The author retains all rights; no accredited university course is claimed.
 */
export interface LogicQuestion {
  stem: string; choices: [string,string,string]; answer: number;
}
export interface LogicLesson {
  id: number; title: string; part: 1|2|3|4; overview: string;
  workedExample: string; question: LogicQuestion; source: string;
}
const ROWS: Array<[number,string,string,string,string,string,string,string,number]> = [
  [
    1,
    "What Does It Mean to Think Critically?",
    "Critical thinking is evidence-sensitive reflective judgment. The CLEAR routine moves from clarifying a claim, to locating reasons, evaluating inference, assessing uncertainty, and revising conclusions. It is not a habit of rejecting everything; it is deciding proportionately to the evidence.",
    "Apply CLEAR to the claim that a new learning app doubled exam success; ask what doubled and whether the cohorts were comparable.",
    "Which is a critical-thinking response?",
    "Reject every claim",
    "Clarify, assess evidence, and consider alternatives",
    "Follow the most popular speaker",
    1
  ],
  [
    2,
    "Claims, Premises, Conclusions, and Argument Reconstruction",
    "An argument offers one or more premises to support a conclusion. Signal words may help, but context matters. Reconstruct the actual claim fairly, supply only plausible hidden assumptions, and distinguish linked from convergent reasons.",
    "Map why a scholarship board should publish eligibility criteria: students need to know the standards and publication permits scrutiny.",
    "A conclusion is…",
    "The claim supported by the premises",
    "Always the first sentence",
    "A source's title",
    0
  ],
  [
    3,
    "Deduction, Induction, Abduction, and Degrees of Support",
    "Deduction aims at necessity; induction provides probabilistic support from observed cases; abduction compares the best available explanations. Validity concerns logical form, not whether empirical premises are true.",
    "If the library is open, the light is on; the light is on; therefore it is open. This affirms the consequent and is invalid.",
    "Which form selects the best available explanation?",
    "Deduction",
    "Abduction",
    "Translation",
    1
  ],
  [
    4,
    "Fallacies: When the Support Breaks Down",
    "An ad hominem attacks a person instead of the relevant evidence; a straw man misrepresents a claim; a false dilemma excludes live alternatives. Other errors include post hoc causation, hasty generalization, and equivocation. Diagnose the broken support, not merely the label.",
    "The claim 'Two students liked it, so no one else will' overgeneralizes from an inadequate sample.",
    "A straw man…",
    "Supplies a counterexample",
    "Misstates a position to make it easier to attack",
    "Adds independent evidence",
    1
  ],
  [
    5,
    "Cognitive Biases, Intellectual Humility, and Self-Correction",
    "Confirmation bias favors supporting examples; availability makes vivid cases seem common; anchors distort estimates; overconfidence exceeds accuracy. Reduce bias by recording predictions, seeking disconfirming evidence, and revising without treating disagreement as a threat.",
    "Before evaluating a pilot, specify what result would count against your preferred interpretation.",
    "Which habit counters confirmation bias?",
    "Seek disconfirming evidence",
    "Avoid independent reviewers",
    "Rely on striking anecdotes",
    0
  ],
  [
    6,
    "Evidence, Sources, and the Architecture of a Good Claim",
    "Evidence must fit the claim. Check relevance, credibility, sufficiency, independence, and recency. Toulmin analysis identifies claim, data, warrant, backing, qualifier, and rebuttal. Copies of one press release do not count as independent confirmations.",
    "A jump in pass rates may be real even if the claim that an intervention caused it remains unproved.",
    "Four sites repeating one release provide…",
    "Four independent confirmations",
    "One repeated source, not four independent checks",
    "Proof of causation",
    1
  ],
  [
    7,
    "Informal Logic and Argument Mapping",
    "Argument maps show conclusions, linked or independent supporting premises, objections, and replies. Apply acceptability, relevance, and sufficiency; distinguish factual, definitional, value, and practical disagreements.",
    "Map the case for low-bandwidth lessons: access needs, evidence about connectivity, cost objections, staged-rollout reply.",
    "Linked premises…",
    "Work together to support one conclusion",
    "Are always false",
    "Cannot be diagrammed",
    0
  ],
  [
    8,
    "Formal Languages and Propositional Symbolization",
    "Atomic propositions stand for declarative claims. Classical connectives include negation ¬, conjunction ∧, inclusive disjunction ∨, conditional →, and biconditional ⇔. Parentheses determine scope; always translate back into ordinary language.",
    "'The lecture is recorded but not downloadable' translates as R ∧ ¬D.",
    "P ∨ Q means…",
    "Exactly one is true",
    "Neither is true",
    "At least one is true, possibly both",
    2
  ],
  [
    9,
    "Connectives and the Logic of Conditionals",
    "P → Q is false only when P is true and Q is false. In P → Q, P is sufficient for Q and Q necessary for P. 'P only if Q' means P → Q; do not reverse it. Biconditionals state two-way requirements.",
    "'A student graduates only if the capstone is complete' gives G → C, not C → G.",
    "'P only if Q' symbolizes…",
    "Q → P",
    "P → Q",
    "P ∧ Q",
    1
  ],
  [
    10,
    "Truth Tables, Tautologies, Contradictions, and Equivalence",
    "For n sentence letters, truth tables need 2^n rows. A tautology is true on every valuation; a contradiction is false on every valuation; equivalence requires matching truth values across every row.",
    "(P ∧ Q) → P is a tautology. ¬(P ∧ Q) and ¬P ∨ ¬Q are logically equivalent.",
    "A truth table for three atoms has…",
    "6 rows",
    "8 rows",
    "9 rows",
    1
  ],
  [
    11,
    "Validity, Counterexamples, and Logical Equivalence in Arguments",
    "A deductive argument is valid iff there is no valuation making every premise true and conclusion false. Soundness additionally requires true premises. A single counterexample defeats a claim of deductive validity.",
    "P → Q; Q; therefore P is invalid when P=F and Q=T, yet P → Q and Q both hold.",
    "Which valuation refutes P→Q; Q; ∴P?",
    "P=T,Q=T",
    "P=F,Q=T",
    "P=T,Q=F",
    1
  ],
  [
    12,
    "Rules of Inference and Natural Deduction",
    "Natural-deduction proofs justify every derived line. Conjunction introduction/elimination, conditional elimination, and conditional introduction are central rules; discharged assumptions must not be reused as unconditional premises.",
    "From P→Q, Q→R and P: derive Q by →E, then R by →E.",
    "A rigorous formal proof…",
    "Explains each step's rule",
    "Needs only a plausible conclusion",
    "Always verifies empirical premises",
    0
  ],
  [
    13,
    "Formal Logic in Everyday Decision Rules",
    "Translate policy eligibility rules precisely before programming. 'Necessary' is not the same as 'sufficient'; inclusive or differs from exclusive or. Test clear passes, clear failures, boundaries, and conflicting-data cases.",
    "If access is S ∨ W, a student with both a subscription and waiver qualifies.",
    "For access rule S ∨ W…",
    "Both S and W causes denial",
    "S or W or both grants access",
    "Neither grants access",
    1
  ],
  [
    14,
    "Predicate Logic: All, Some, and Relations",
    "Quantifiers unpack 'all' and 'some'. ∀x(T(x)→R(x)) means all tutors are trained; ∃x(T(x)∧R(x)) asserts at least one trained tutor exists. Quantifier order can change an entire claim.",
    "Every student has some mentor need not mean one mentor serves every student.",
    "Some tutors are trained is…",
    "∃x(T(x) ∧ R(x))",
    "∃x(T(x) → R(x))",
    "¬∃x T(x)",
    0
  ],
  [
    15,
    "Predicate Proofs, Countermodels, and the Limits of Formalization",
    "Universal elimination permits particular instances; existential introduction asserts a witness exists; existential elimination requires a fresh witness and side conditions. A countermodel demonstrates true premises and false conclusion.",
    "Two lecturers can each teach a course without there being one course taught by both.",
    "A countermodel…",
    "Has true premises and a false conclusion",
    "Repeats a conclusion",
    "Proves a policy is fair",
    0
  ],
  [
    16,
    "Scientific Reasoning and Pseudoscience",
    "Research claims should be testable, reproducible where appropriate, and evaluated against alternative explanations. Correlation alone does not establish causation; track selection, confounding, attrition, controls, and uncertainty.",
    "Tutored students might score higher due to prior achievement or motivation rather than tutoring itself.",
    "Which offers stronger causal evidence?",
    "A testimonial",
    "A suitable controlled comparison",
    "A viral success story",
    1
  ],
  [
    17,
    "Law, Public Policy, and Ethical Reasoning",
    "Legal and policy arguments must distinguish descriptive facts from normative judgments. Identify principles, rights, costs, proportionality, uncertainty, competing values, and counterarguments.",
    "An effective policy can still be unfair if its criteria ignore access barriers or proper appeals.",
    "A policy argument must examine…",
    "Only popular opinion",
    "Empirical evidence and ethical standards",
    "Only mathematical validity",
    1
  ],
  [
    18,
    "Media, Information Literacy, and AI-Generated Claims",
    "Verify origin, date, context, claim, and independent evidence before sharing. AI-generated images and quotations may be convincing but fabricated. Distinguish verified records from copied posts, decontextualized screenshots, or synthetic media.",
    "An authoritative-looking screenshot is a claim requiring provenance, not independent proof.",
    "A dramatic AI image should be…",
    "Accepted because it looks real",
    "Checked for provenance and corroboration",
    "Shared before checking",
    1
  ],
  [
    19,
    "Statistics, Risk, and Everyday Quantitative Claims",
    "Inspect denominators, sampling, missing observations, base rates, and risk framing. Percentage points represent absolute changes between rates; relative percentage change divides by the starting rate.",
    "From 40% to 50% is +10 percentage points and a 25% relative rise.",
    "The difference between percentage points and relative change is…",
    "They are identical",
    "Absolute rate difference versus difference over baseline",
    "Neither uses a baseline",
    1
  ],
  [
    20,
    "Argumentation Theory, Rhetoric, and Dialogue",
    "Good rhetoric informs without replacing argument quality. Examine audience, warrants, dialogue obligations, rebuttals, and charity. Reconstruct opponents' actual positions before offering criticism.",
    "Before objecting to a classmate's argument, restate the claim in language they would accept.",
    "Fair dialogue begins by…",
    "Distorting opposing claims",
    "Reconstructing the strongest reasonable opposing case",
    "Ignoring evidence",
    1
  ],
  [
    21,
    "Logic, Computation, and Meta-Theory",
    "Formal systems can automate certain deductions, truth-functional evaluations and consistency checks, while metatheory examines their properties and limits. Proving entailment does not independently establish the factual truth of premises.",
    "A program can correctly enforce a badly drafted eligibility rule and still produce unjust outcomes.",
    "What is a limit of a logic engine?",
    "It proves empirical premises true",
    "It tests formal structure but not reality unaided",
    "It cannot evaluate any formula",
    1
  ],
  [
    22,
    "Research Critique and Integrative Case Analysis",
    "Critique a study by connecting its research question, concepts, design, sampling, evidence, inference, ethics and limitations. A strong critique states strengths as well as defects and recommends warranted improvements.",
    "A reported increase in grades demands examination of baseline cohorts, controls, selection and missing data.",
    "A strong research critique tests…",
    "Only a headline",
    "Design, data, inference and limits",
    "Only author prestige",
    1
  ],
  [
    23,
    "The Applied Reasoning Capstone",
    "The capstone brings the course together. Develop a precise research question, reconstruct competing arguments, evaluate credible evidence, apply logical tests, consider objections, qualify the conclusion, and reflect on revisions.",
    "Analyze a real-world institutional claim using a source log, argument map, alternative explanations and an evidence-based recommendation.",
    "A capstone should demonstrate…",
    "An unqualified conclusion",
    "A sourced argument with objections and justified qualification",
    "Memorized slogans",
    1
  ]
];
export const LOGIC_COURSE_TITLE = "Logic and Critical Thinking";
export const LOGIC_COURSE_AUTHOR = "Mabrig Korie";
export const LOGIC_COURSE_PARTS = [
  "Foundations of Critical Thinking",
  "Formal Logic: Propositions, Tables, and Proofs",
  "Applied Critical Reasoning",
  "Advanced Argumentation and Computation",
] as const;
export const LOGIC_LESSONS: LogicLesson[] = ROWS.map(row => ({
  id: row[0], title: row[1], part: row[0]<=7?1:row[0]<=15?2:row[0]<=19?3:4,
  overview: row[2], workedExample: row[3],
  question: { stem: row[4], choices:[row[5],row[6],row[7]], answer: row[8]},
  source:"Mabrig Korie, Logic and Critical Thinking (2026), Chapter "+row[0],
}));
export function validateLogicCourse() {
  if(LOGIC_LESSONS.length!==23) return false;
  return LOGIC_LESSONS.every((lesson,i) =>
    lesson.id===i+1 && lesson.title.length>=10 &&
    lesson.overview.length>=100 && lesson.question.choices.length===3 &&
    Number.isInteger(lesson.question.answer) &&
    lesson.question.answer>=0 && lesson.question.answer<3);
}
export function getLogicLesson(id:number):LogicLesson|null {
  return LOGIC_LESSONS.find(ch=>ch.id===id)??null;
}
export function logicCourseCompletion(read:number[],passed:number[]) {
  const valid = new Set(LOGIC_LESSONS.map(ch=>ch.id));
  const doneRead = new Set(read.filter(id=>valid.has(id)));
  const donePass = new Set(passed.filter(id=>valid.has(id)));
  const completed = [...valid].filter(id=>doneRead.has(id)&&donePass.has(id)).length;
  return {completed,total:23,percent:Math.round(completed*100/23),eligible:completed===23};
}
