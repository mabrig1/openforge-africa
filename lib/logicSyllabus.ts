/** Teaching-edition proposed modules, not credit-bearing awards. Source: appendices D & E. */
export interface LogicModule { tier:string;code:string;name:string;credits:number;chapters:string;optional:boolean }
export interface SyllabusWeek { week:number;focus:string;task:string;assessment:string }
export const LOGIC_PROGRAM_MODULES: LogicModule[] = [
  {
    "tier": "Foundation",
    "code": "LCT 101",
    "name": "Introduction to Critical Thinking",
    "credits": 3,
    "chapters": "1–6",
    "optional": false
  },
  {
    "tier": "Foundation",
    "code": "LCT 102",
    "name": "Informal Logic and Argumentation",
    "credits": 3,
    "chapters": "2, 4, 6–7, 20",
    "optional": false
  },
  {
    "tier": "Intermediate",
    "code": "LCT 201",
    "name": "Formal Logic I: Propositional Logic",
    "credits": 3,
    "chapters": "8–13",
    "optional": false
  },
  {
    "tier": "Intermediate",
    "code": "LCT 202",
    "name": "Applied Critical Reasoning",
    "credits": 3,
    "chapters": "16–19, 22",
    "optional": false
  },
  {
    "tier": "Advanced",
    "code": "LCT 301",
    "name": "Argumentation Theory",
    "credits": 3,
    "chapters": "7, 20, 22",
    "optional": false
  },
  {
    "tier": "Capstone",
    "code": "LCT 401",
    "name": "Applied Reasoning Project",
    "credits": 3,
    "chapters": "22–23",
    "optional": false
  },
  {
    "tier": "Elective",
    "code": "LCT 302",
    "name": "Formal Logic II: Predicate Logic",
    "credits": 3,
    "chapters": "14–15 and further reading",
    "optional": true
  },
  {
    "tier": "Elective",
    "code": "LCT 303",
    "name": "Logic and Computation",
    "credits": 3,
    "chapters": "21 and further reading",
    "optional": true
  }
];
export const LCT_201_WEEKS: SyllabusWeek[] = [
  {
    "week": 1,
    "focus": "Arguments and logical form",
    "task": "Compare deduction with induction; diagnostic reconstruction",
    "assessment": "Diagnostic quiz, ungraded"
  },
  {
    "week": 2,
    "focus": "Atomic statements, ¬, ∧, ∨",
    "task": "Translate simple and compound claims",
    "assessment": "Practice set 1"
  },
  {
    "week": 3,
    "focus": "Conditionals and biconditionals",
    "task": "Only if, unless, necessity and sufficiency",
    "assessment": "Practice set 2"
  },
  {
    "week": 4,
    "focus": "Symbolization workshop",
    "task": "Audit ambiguous eligibility statements",
    "assessment": "Assignment 1: Symbolization (10%)"
  },
  {
    "week": 5,
    "focus": "Truth tables I",
    "task": "Complete tables for two and three atoms",
    "assessment": "Practice set 3"
  },
  {
    "week": 6,
    "focus": "Truth tables II",
    "task": "Equivalences, De Morgan laws, consistency",
    "assessment": "Assignment 2: Truth tables (10%); practice set 4"
  },
  {
    "week": 7,
    "focus": "Testing validity",
    "task": "Find invalidating rows and explain counterexamples",
    "assessment": "Practice set 5"
  },
  {
    "week": 8,
    "focus": "Consolidation and assessment",
    "task": "Mixed symbolization and validity problems",
    "assessment": "Mid-module exam (25%)"
  },
  {
    "week": 9,
    "focus": "Natural deduction I",
    "task": "∧I, ∧E, ∨I, →E and basic proofs",
    "assessment": "Practice set 6"
  },
  {
    "week": 10,
    "focus": "Natural deduction II",
    "task": "Conditional proof, subproof assumptions, negation",
    "assessment": "Assignment 3: Proofs (10%)"
  },
  {
    "week": 11,
    "focus": "Real-world applications",
    "task": "Critique a digital decision rule and its translation",
    "assessment": "Ungraded discussion with feedback"
  },
  {
    "week": 12,
    "focus": "Comprehensive review",
    "task": "Explain validity, proof limitations, and edge cases",
    "assessment": "Final exam (45%)"
  }
];
export const LCT_201_GRADE_WEIGHTS = {assignment1:10,assignment2:10,assignment3:10,midExam:25,finalExam:45} as const;
export function getLogicCreditProposals() {
 return {
   core:LOGIC_PROGRAM_MODULES.filter(m=>!m.optional).reduce((s,m)=>s+m.credits,0),
   optional:LOGIC_PROGRAM_MODULES.filter(m=>m.optional).reduce((s,m)=>s+m.credits,0),
   appliedGradeWeight:Object.values(LCT_201_GRADE_WEIGHTS).reduce((s,n)=>s+n,0),
 };
}
