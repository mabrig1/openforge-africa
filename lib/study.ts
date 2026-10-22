/** Offline learning rules. No network, remote inference, or hidden telemetry. */
export type TaskType = "discussion" | "peer-review" | "micro-quiz" | "explanation";
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface StudyCircle {
  id: string; name: string; courseCode: string; courseTitle: string;
  memberCount: number; taskCount: number; lastActivity: string; createdAt: number;
}
export interface CourseMaterial {
  id: string; circleId: string; title: string; content: string; createdAt: number;
}
export interface StudyTask {
  id: string; circleId: string; circleName: string; title: string;
  type: TaskType; status: TaskStatus; createdAt: number;
  prompt?: string; options?: string[]; correctIndex?: number;
  selectedIndex?: number; completedAt?: number;
}
export const LIMITS = { circleName: 80, courseCode: 20, courseTitle: 120,
  materialTitle: 120, materialContent: 12000, taskTitle: 120, prompt: 1000 };
const clean = (value: string) => value.trim().replace(/\s+/g, " ");
export function newId(prefix: string): string {
  // Identifiers are local record keys; never use for authentication/security.
  return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}
export function validateCircle(name: string, code: string, title: string): string | null {
  if (!name.trim() || !code.trim()) return "Enter a circle name and course code.";
  if (name.trim().length > LIMITS.circleName || code.trim().length > LIMITS.courseCode ||
      title.trim().length > LIMITS.courseTitle) return "One or more fields are too long.";
  return null;
}
export function validateMaterial(title: string, content: string): string | null {
  if (!title.trim() || !content.trim()) return "Enter a title and course notes.";
  if (title.trim().length > LIMITS.materialTitle || content.trim().length > LIMITS.materialContent)
    return "Notes are too long. Split the material into smaller sections (12,000 characters maximum).";
  return null;
}
export function validateTask(title: string, prompt: string, type: TaskType, options?: string[], answer?: number): string | null {
  if (!title.trim() || title.trim().length > LIMITS.taskTitle) return "Enter a task title (up to 120 characters).";
  if (!prompt.trim() || prompt.trim().length > LIMITS.prompt) return "Enter task instructions (up to 1,000 characters).";
  if (type === "micro-quiz" && (!options || options.length !== 3 ||
      options.some((option) => !option.trim() || option.length > 200) ||
      answer === undefined || !Number.isInteger(answer) || answer < 0 || answer > 2))
    return "Provide three answer choices and select the correct one.";
  return null;
}
export function gradeQuiz(task: StudyTask, selection: number): boolean | null {
  if (task.type !== "micro-quiz" || !task.options || task.options.length !== 3 ||
      !Number.isInteger(task.correctIndex) || task.correctIndex! < 0 || task.correctIndex! > 2 ||
      !Number.isInteger(selection) || selection < 0 || selection >= task.options.length) return null;
  return task.correctIndex === selection;
}
export function getProgress(tasks: StudyTask[]) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const quizzes = tasks.filter((task) => task.type === "micro-quiz" &&
    task.status === "completed" && task.selectedIndex !== undefined);
  const correct = quizzes.filter((task) => gradeQuiz(task, task.selectedIndex!) === true).length;
  return { completed, total: tasks.length, percent: tasks.length ? Math.round(completed * 100 / tasks.length) : 0,
    attemptedQuizzes: quizzes.length, correctQuizzes: correct };
}
const STOP = new Set(["about","after","again","also","and","are","can","could","does","for","from","have","how",
  "into","its","just","more","not","our","should","some","than","that","the","their","them","there",
  "these","this","those","under","using","what","when","where","which","with","would","your","please",
  "explain","discuss","define","tell","give","question","questions"]);
const words = (text: string) => (text.toLowerCase().match(/[a-z0-9]{3,}/g) || []).filter((w) => !STOP.has(w));
export interface GroundedReply { content: string; sourceId?: string; sourceTitle?: string; matched: boolean; }
export function groundedReply(question: string, materials: CourseMaterial[]): GroundedReply {
  if (!materials.length) return { matched: false, content: "No course notes are saved for this circle yet. Add course material first. I won't invent a source or pretend an AI model is running offline." };
  const query = new Set(words(question).slice(0, 24));
  if (!query.size) return { matched: false, content: "Ask a specific question with a topic or key term from your saved notes." };
  let best: { material: CourseMaterial; section: string; score: number } | null = null;
  for (const material of materials) {
    const sections = material.content.split(/\n\s*\n|(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean).slice(0, 120);
    for (const section of sections) {
      const terms = new Set(words(section));
      const overlap = [...query].filter((w) => terms.has(w)).length;
      const score = overlap / Math.max(1, query.size);
      if (overlap && (!best || score > best.score)) best = { material, section, score };
    }
  }
  if (!best) return { matched: false, content: "I could not locate evidence for that question in the saved notes. Try a different keyword or add relevant material. No outside facts have been generated." };
  const excerpt = best.section.trim().slice(0, 650);
  return { matched: true, sourceId: best.material.id, sourceTitle: best.material.title,
    content: 'From your notes — "' + best.material.title + '":\n\n' + excerpt +
      (best.section.length > 650 ? "…" : "") +
      "\n\nStudy together: (1) Explain this in your own words. (2) Give a local example. (3) What should you verify in the original notes?\n\nThis is keyword-based retrieval, not an AI-generated or verified answer." };
}
