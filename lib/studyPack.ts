/** Explicit, manually shared text study packs. No implicit sync or trust. */
import { validateCircle, validateMaterial, validateTask,
  type CourseMaterial, type StudyCircle, type StudyTask, type TaskType } from "./study.ts";

const KINDS: TaskType[] = ["discussion","explanation","peer-review","micro-quiz"];
const MAX_PACK_CHARS = 30000;
export interface ImportedPack {
  name: string; courseCode: string; courseTitle: string;
  notes: Pick<CourseMaterial,"title"|"content">[];
  tasks: Pick<StudyTask,"title"|"type"|"prompt"|"options"|"correctIndex">[];
  dedupeKey: string;
}
function fingerprint(content: string): string {
  // Only for accidental duplicate detection; NOT a signature or integrity proof.
  let hash=2166136261;
  for(let i=0;i<content.length;i++) hash=Math.imul(hash ^ content.charCodeAt(i),16777619);
  return (hash>>>0).toString(16)+"_"+content.length;
}
export function buildStudyPack(circle: StudyCircle, notes: CourseMaterial[], tasks: StudyTask[]): string {
  if (notes.length > 6 || tasks.length > 20) throw new Error("Share up to 6 notes and 20 tasks per pack. Move extra content into another circle.");
  const obj = {format:"openforge-study-pack",version:1,
    circle:{name:circle.name,courseCode:circle.courseCode,courseTitle:circle.courseTitle},
    notes:notes.map((n)=>({title:n.title,content:n.content})),
    tasks:tasks.map((t)=>({title:t.title,prompt:t.prompt||t.title,type:t.type,
      ...(t.type==="micro-quiz"?{options:t.options,correctIndex:t.correctIndex}:{})}))};
  const data=JSON.stringify(obj);
  if(data.length>MAX_PACK_CHARS) throw new Error("Pack exceeds 30,000 characters. Reduce the size of your course notes.");
  return data;
}
export function parseStudyPack(data: string): ImportedPack {
  if (!data || data.length>MAX_PACK_CHARS) throw new Error("Invalid or oversized study pack.");
  let raw: any;
  try {raw=JSON.parse(data);} catch {throw new Error("This is not valid study pack JSON.");}
  if(!raw || raw.format!=="openforge-study-pack" || raw.version!==1 ||
     !raw.circle || !Array.isArray(raw.notes) || !Array.isArray(raw.tasks) ||
     raw.notes.length>6 || raw.tasks.length>20) throw new Error("Unsupported study pack format or too many items.");
  const c=raw.circle;
  if(typeof c.name!=="string"||typeof c.courseCode!=="string"||typeof c.courseTitle!=="string" ||
     validateCircle(c.name,c.courseCode,c.courseTitle)) throw new Error("Invalid course information.");
  const notes: ImportedPack["notes"]=[];
  for (const item of raw.notes) {
    if(!item || typeof item.title!=="string" || typeof item.content!=="string" ||
       validateMaterial(item.title,item.content)) throw new Error("Invalid note in study pack.");
    notes.push({title:item.title.trim(),content:item.content.trim()});
  }
  const tasks: ImportedPack["tasks"]=[];
  for(const item of raw.tasks) {
    if (!item || typeof item.title!=="string" || typeof item.prompt!=="string" ||
        !KINDS.includes(item.type) || (item.type==="micro-quiz" &&
          (!Array.isArray(item.options)||item.options.some((s:unknown)=>typeof s!=="string"))) ||
        validateTask(item.title,item.prompt,item.type,item.options,item.correctIndex))
      throw new Error("Invalid task in study pack.");
    tasks.push({title:item.title.trim(),prompt:item.prompt.trim(),type:item.type,
      ...(item.type==="micro-quiz"?{options:item.options.map((s:string)=>s.trim()),correctIndex:item.correctIndex}:{})});
  }
  return {name:c.name.trim(),courseCode:c.courseCode.trim().toUpperCase(),
    courseTitle:c.courseTitle.trim(),notes,tasks,dedupeKey:fingerprint(JSON.stringify({circle:c,notes,tasks}))};
}
