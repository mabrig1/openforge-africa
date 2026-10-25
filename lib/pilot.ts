/** Voluntary seven-day device-local self-reporting. No telemetry or verified attendance. */
export type StudyMode = "solo" | "in-person" | "messaging";
export type Barrier = "none" | "data" | "device" | "time" | "materials" | "other";
export type Helpfulness = 1 | 2 | 3 | 4 | 5;
export interface PilotCheckIn {
  day: string;
  mode: StudyMode;
  barrier: Barrier;
  helpfulness: Helpfulness;
}
export interface LocalPilot {
  circleId: string;
  startedDay: string;
  checkIns: PilotCheckIn[];
}
const MODES: StudyMode[] = ["solo", "in-person", "messaging"];
const BARRIERS: Barrier[] = ["none", "data", "device", "time", "materials", "other"];
/** Local civil day, not UTC midnight. */
export function localDay(date: Date): string {
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"),
    String(date.getDate()).padStart(2,"0")].join("-");
}
function ordinal(day: string): number | null {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const [y,m,d]=day.split("-").map(Number);
  if(y<2000||y>2100) return null;
  const ms=Date.UTC(y,m-1,d), valid=new Date(ms);
  if(valid.getUTCFullYear()!==y || valid.getUTCMonth()+1!==m || valid.getUTCDate()!==d) return null;
  return ms / 86400000;
}
/** Day 1..7 inclusive. Device clock changes may affect this estimate. */
export function pilotDay(pilot: LocalPilot, day: string): number | null {
  const start=ordinal(pilot.startedDay), current=ordinal(day);
  if(start===null||current===null) return null;
  const count=current-start+1;
  return count>=1&&count<=7?count:null;
}
export function pilotIssue(pilot: LocalPilot, entry: PilotCheckIn): string | null {
  if(pilotDay(pilot,entry.day)===null) return "Check-ins are allowed only on days 1–7 of this pilot.";
  if(!MODES.includes(entry.mode) || !BARRIERS.includes(entry.barrier) ||
    !Number.isInteger(entry.helpfulness) || entry.helpfulness<1 || entry.helpfulness>5)
    return "Select a valid study method, barrier and usefulness score.";
  if(pilot.checkIns.some(existing=>existing.day===entry.day))
    return "You have already checked in today. This entry cannot be submitted twice.";
  if(pilot.checkIns.length>=7) return "The seven-day pilot is already complete.";
  return null;
}
export function addPilotCheckIn(pilot: LocalPilot, entry: PilotCheckIn): LocalPilot | null {
  return pilotIssue(pilot,entry)?null:{...pilot,checkIns:[...pilot.checkIns,entry]};
}
export interface PilotSummary {
  pilots:number; checkIns:number; peerSessions:number; soloSessions:number;
  barrierDays:number; usefulnessResponses:number; averageUsefulness:number|null;
}
export function pilotSummary(pilots: LocalPilot[]): PilotSummary {
  const checkIns=pilots.flatMap(p=>{
    const seen=new Set<string>();
    return p.checkIns.filter(c=>{
      if(pilotDay(p,c.day)===null || seen.has(c.day) || !MODES.includes(c.mode) ||
        !BARRIERS.includes(c.barrier) || !Number.isInteger(c.helpfulness) ||
        c.helpfulness<1 || c.helpfulness>5) return false;
      seen.add(c.day); return true;
    });
  });
  const scores=checkIns.map(c=>c.helpfulness);
  return {pilots:pilots.length,checkIns:checkIns.length,
    peerSessions:checkIns.filter(c=>c.mode!=="solo").length,
    soloSessions:checkIns.filter(c=>c.mode==="solo").length,
    barrierDays:checkIns.filter(c=>c.barrier!=="none").length,
    usefulnessResponses:scores.length,
    averageUsefulness:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)*10/scores.length)/10:null};
}
/** Deliberately omit identifiers, dates, course labels, free text and raw check-ins. */
export function optionalPilotDigest(pilots: LocalPilot[]): string {
  const s=pilotSummary(pilots);
  return ["OPENFORGE AFRICA — VOLUNTARY SEVEN-DAY PILOT SUMMARY",
    "Learner-entered estimates only; not independently verified attendance or retention.",
    "", "Local pilots begun: "+s.pilots,
    "Daily check-ins saved: "+s.checkIns,
    "Days reporting a peer study activity: "+s.peerSessions,
    "Days reporting solo study: "+s.soloSessions,
    "Days reporting an obstacle: "+s.barrierDays,
    "Average self-rated usefulness (1–5): "+(s.averageUsefulness??"No responses"),
    "", "Counts do not prove improved outcomes or group participation.",
    "No names, course labels, dates, free text, or device identifiers included.",
    "Small numbers can still disclose activity to someone who knows the learner.",
    "Sent only if the learner chooses a recipient in the device Share sheet."].join("\n");
}
