/** Pure device-local focus-session logic and privacy-minimised voluntary digest. */
import type { StudyTask } from "./study.ts";

export interface ActiveFocus {
  circleId: string;
  startedAt: number;
}
export interface FocusSession {
  id: string;
  circleId: string;
  startedAt: number;
  endedAt: number;
  seconds: number;
  reflection?: string;
}
export const MAX_REFLECTION = 240;
export const MAX_FOCUS_SECONDS = 4 * 60 * 60;
export function elapsedFocusSeconds(startedAt: number, now: number): number {
  if (!Number.isFinite(startedAt) || !Number.isFinite(now) ||
      startedAt <= 0 || now < startedAt) return 0;
  return Math.min(MAX_FOCUS_SECONDS, Math.floor((now - startedAt) / 1000));
}
export function sessionReflectionIssue(reflection: string): string | null {
  return reflection.length > MAX_REFLECTION ? "Keep your reflection under 240 characters." : null;
}
export interface LearningSummary {
  taskCount: number;
  completedTaskCount: number;
  completionPercent: number;
  quizAttempts: number;
  correctQuizAttempts: number;
  focusSessions: number;
  focusMinutes: number;
}
export function learningSummary(tasks: StudyTask[], sessions: FocusSession[]): LearningSummary {
  const valid = sessions.filter((s) => Number.isFinite(s.seconds) && s.seconds >= 10 &&
    s.seconds <= MAX_FOCUS_SECONDS && s.endedAt >= s.startedAt);
  const completed = tasks.filter((t) => t.status === "completed").length;
  const attempted = tasks.filter((t) => t.type === "micro-quiz" && t.status === "completed" &&
    Number.isInteger(t.selectedIndex) && Number.isInteger(t.correctIndex));
  return {
    taskCount: tasks.length,
    completedTaskCount: completed,
    completionPercent: tasks.length ? Math.round(completed / tasks.length * 100) : 0,
    quizAttempts: attempted.length,
    correctQuizAttempts: attempted.filter((t) => t.selectedIndex === t.correctIndex).length,
    focusSessions: valid.length,
    focusMinutes: Math.floor(valid.reduce((sum, s) => sum + s.seconds, 0) / 60),
  };
}
export function voluntaryLearningDigest(tasks: StudyTask[], sessions: FocusSession[]): string {
  const stats = learningSummary(tasks, sessions);
  // Deliberately exclude circle names, note text, task titles, reflections,
  // student identifiers, device IDs, timestamps and answer keys.
  return [
    "OPENFORGE AFRICA — VOLUNTARY LOCAL LEARNING DIGEST",
    "Self-recorded on-device activity; not a verified attendance, grade, or learning-outcome report.",
    "",
    "Learning tasks: " + stats.taskCount,
    "Tasks marked complete: " + stats.completedTaskCount,
    "Completion rate: " + stats.completionPercent + "%",
    "Practice quizzes attempted: " + stats.quizAttempts,
    "Practice quizzes correct: " + stats.correctQuizAttempts,
    "Focus sessions saved: " + stats.focusSessions,
    "Recorded focus time: " + stats.focusMinutes + " minutes",
    "",
    "Shared only because a learner intentionally chose to send it.",
    "No names, source texts, course labels or reflection content are included.",
    "Small or distinctive aggregate values might still identify someone in context.",
    "Not an official institutional transcript or supervised examination."
  ].join("\n");
}
