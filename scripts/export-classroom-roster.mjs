/** Export the audited OpenMAIC-compatible 15-agent manifest. Never reads user notes. */
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {CLASSROOM_AGENTS,validateClassroomRoster} from "../lib/openMaicClassroom.ts";
const counts=validateClassroomRoster();
if(counts.total!==15||counts.teachers!==1||counts.assistants!==1||
   counts.classmates!==13||!counts.unique)
 throw new Error("Expected unique 1 Teacher + 1 Assistant + 13 classmates");
const actions=new Set(["spotlight","laser","play_video","wb_open","wb_close",
 "wb_draw_text","wb_draw_shape","wb_draw_chart","wb_draw_latex","wb_draw_table",
 "wb_draw_line","wb_draw_code","wb_edit_code","wb_clear","wb_delete"]);
for(const a of CLASSROOM_AGENTS){
 if(!/^[A-Za-z0-9_-]{1,128}$/.test(a.id)||a.id.startsWith("default-"))
  throw new Error("Invalid OpenMAIC custom agent ID: "+a.id);
 if(a.priority<0||a.priority>100||a.allowedActions.some(x=>!actions.has(x)))
  throw new Error("Unsupported OpenMAIC action or priority: "+a.id);
}
console.log("PASS: 15 unique OpenMAIC-shaped educational roles, no unsupported actions");
if(process.argv.includes("--export")){
 const at=process.argv.indexOf("--export");
 const folder=resolve(process.argv[at+1]??"artifacts/openmaic");
 mkdirSync(folder,{recursive:true});
 const agents=CLASSROOM_AGENTS.map(a=>({...a,allowedActions:[...a.allowedActions]}));
 writeFileSync(resolve(folder,"openmaic-15-agents.json"),JSON.stringify(agents,null,2)+"\n");
 const lines=["# OpenForge original fifteen-agent roster, suitable for adapting to OpenMAIC","agents:"];
 for(const a of agents){
  lines.push("  - id: "+JSON.stringify(a.id));
  for(const key of ["name","role","persona","priority","allowedActions","avatar","color"]){
   const value=a[key];
   lines.push("    "+key+": "+JSON.stringify(value));
  }
 }
 writeFileSync(resolve(folder,"openmaic-15-agents.yaml"),lines.join("\n")+"\n");
 console.log("Exported JSON and YAML to "+folder);
}
