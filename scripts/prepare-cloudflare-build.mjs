/** Cloudflare Workers Builds automatically sets WORKERS_CI=1.
 * Ensure ./dist exists before default npx wrangler preview or deploy.
 * Ordinary local and GitHub installs are unaffected; never deploy here.
 */
import {existsSync} from "node:fs";
import {spawnSync} from "node:child_process";
const isCloudflare=process.env.WORKERS_CI==="1";
if(!isCloudflare){
 console.log("[openforge] Not Workers Builds; skipping web postinstall export.");
 process.exit(0);
}
if(Number(process.versions.node.split(".")[0])<22){
 console.error("[openforge] Workers Builds must use Node 22 (set NODE_VERSION=22).");
 process.exit(1);
}
console.log("[openforge] Workers Builds: generating ./dist before Wrangler preview.");
const cmd=process.platform==="win32"?"npm.cmd":"npm";
const b=spawnSync(cmd,["run","build"],{stdio:"inherit",env:process.env});
if(b.error||b.status!==0){
 console.error("[openforge] Expo export failed.",b.error?.message??"");
 process.exit(b.status||1);
}
const q=spawnSync(process.execPath,["scripts/check-web-output.mjs"],{stdio:"inherit"});
if(q.error||q.status!==0||!existsSync("dist/index.html")){
 console.error("[openforge] Cloudflare output verification failed.");
 process.exit(q.status||1);
}
console.log("[openforge] Verified ./dist/index.html; Wrangler may run now.");
