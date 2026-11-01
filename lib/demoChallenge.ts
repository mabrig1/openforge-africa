/**
 * Synthetic judge walkthrough and local integrity checks.
 * No network activity, model inference, telemetry, user data, or competition results.
 * These are self-checks of deterministic code, not a third-party product benchmark.
 */
import { gradeQuiz, groundedReply, getProgress, validateMaterial,
  type CourseMaterial, type StudyTask } from "./study.ts";
import { parseStudyPack, type ImportedPack } from "./studyPack.ts";

const SYNTHETIC_PACK = JSON.stringify({
  format: "openforge-study-pack",
  version: 1,
  circle: {
    name: "OpenForge Judge Demo (synthetic)",
    courseCode: "DEMO 101",
    courseTitle: "Community Learning and Accountability",
  },
  notes: [
    {
      title: "Community Accountability — Fictional Learning Notes",
      content: "Public accountability means public officials explain decisions to citizens and accept scrutiny. Transparent budgets help communities monitor public spending. These are fictional practice notes, not an institutional course handout.",
    },
    {
      title: "Offline Study — Fictional Learning Notes",
      content: "Offline study makes practice possible when a student has no network connection. A learner can save short notes, attempt practice quizzes, and later discuss the ideas with peers. This passage is a fictional demonstration, not an efficacy claim.",
    },
  ],
  tasks: [
    {
      title: "Explain accountability in your own words",
      type: "explanation",
      prompt: "Using the fictional notes, explain accountability and give a hypothetical community example.",
    },
    {
      title: "Discuss studying with limited mobile data",
      type: "discussion",
      prompt: "Compare independent offline practice with an in-person group discussion. Do not share personal information.",
    },
    {
      title: "Practice quiz: accountability",
      type: "micro-quiz",
      prompt: "Which action is an example of public accountability?",
      options: [
        "Keeping all public spending secret",
        "Explaining public spending and accepting scrutiny",
        "Refusing to answer citizens' questions",
      ],
      correctIndex: 1,
    },
  ],
});

export function makeSyntheticDemoPack(): ImportedPack {
  // Re-use the exact public import validator to exercise the real workflow.
  return parseStudyPack(SYNTHETIC_PACK);
}

export interface LocalIntegrityCheck {
  id: string;
  title: string;
  passed: boolean;
  detail: string;
}

export function runLocalIntegrityChecks(): LocalIntegrityCheck[] {
  const pack = makeSyntheticDemoPack();
  const notes: CourseMaterial[] = pack.notes.map((n, i) => ({
    ...n, id: "demo-note-" + i, circleId: "demo", createdAt: 0,
  }));
  const grounded = groundedReply("Explain public accountability", notes);
  const outOfScope = groundedReply("What is mitochondrial genetics?", notes);
  const quiz: StudyTask = {
    id: "demo-quiz", circleId: "demo", circleName: pack.name, createdAt: 0,
    title: "Practice quiz", type: "micro-quiz", status: "completed",
    prompt: "Choose one", options: ["A", "B", "C"], correctIndex: 1,
    selectedIndex: 1,
  };
  let rejectedTampering = false;
  try {
    parseStudyPack('{"format":"invalid","version":1,"circle":{},"notes":[],"tasks":[]}');
  } catch {
    rejectedTampering = true;
  }
  const progress = getProgress([quiz, {
    ...quiz, id: "pending", type: "discussion", status: "pending",
    selectedIndex: undefined,
  }]);
  return [
    {
      id: "source",
      title: "Grounds an answer in saved notes",
      passed: grounded.matched && grounded.sourceTitle === pack.notes[0].title,
      detail: "Checks local passage retrieval with an attributable fictional source.",
    },
    {
      id: "abstain",
      title: "Refuses to invent unsupported evidence",
      passed: !outOfScope.matched && outOfScope.sourceTitle === undefined,
      detail: "Checks that an out-of-scope question returns no invented citation.",
    },
    {
      id: "grading",
      title: "Differentiates correct and wrong quiz responses",
      passed: gradeQuiz(quiz, 1) === true && gradeQuiz(quiz, 0) === false,
      detail: "Checks deterministic practice-quiz grading; no exam security claim.",
    },
    {
      id: "validation",
      title: "Rejects empty and oversized notes",
      passed: !!validateMaterial("", "note") && !!validateMaterial("Title", "a".repeat(12001)),
      detail: "Checks two input-validation limits on local learning material.",
    },
    {
      id: "import",
      title: "Rejects an invalid study-pack format",
      passed: rejectedTampering,
      detail: "Checks format rejection only; not cryptographic integrity.",
    },
    {
      id: "progress",
      title: "Counts only locally completed tasks",
      passed: progress.total === 2 && progress.completed === 1 && progress.percent === 50,
      detail: "Checks local completion arithmetic, not actual learning outcomes.",
    },
  ];
}
