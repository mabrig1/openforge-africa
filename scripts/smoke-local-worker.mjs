/** Exercise the built site through Wrangler's local static-assets server.
 * Never contacts a Cloudflare account or creates a deployment.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve, relative, join } from "node:path";

const port = 8788;
const base = "http://127.0.0.1:" + port;
const start = Date.now();
const out = [];
const isWindows = process.platform === "win32";
const server = spawn(isWindows ? "npx.cmd" : "npx",
  ["--no-install", "wrangler", "dev", "--local", "--ip", "127.0.0.1", "--port", String(port)],
  { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, WRANGLER_SEND_METRICS: "false", CI: "true" } });
server.stdout.on("data", b => out.push(b.toString()));
server.stderr.on("data", b => out.push(b.toString()));
let died = false;
server.once("exit", () => { died = true; });
function collectJs(folder, list=[]) {
  for (const name of readdirSync(folder)) {
    const path = join(folder,name);
    if (statSync(path).isDirectory()) collectJs(path,list);
    else if (name.endsWith(".js")) list.push("/" + relative(resolve("dist"),path).replaceAll("\\","/"));
  }
  return list;
}
const sleep = ms => new Promise(r=>setTimeout(r,ms));
async function visit(path, mode) {
  const response=await fetch(base+path,{headers:mode ? {"Sec-Fetch-Mode":"navigate"} : undefined,signal:AbortSignal.timeout(6000)});
  const text=await response.text();
  return {response,text};
}
try {
  if (!existsSync(resolve("dist","index.html"))) throw Error("Missing dist/index.html. Run npm run build first.");
  let ready = false;
  for(let i=0;i<40;i++) {
    if(died) throw Error("Wrangler exited before health check.");
    try {
      const {response,text}=await visit("/",true);
      if(response.status===200 && text.includes("<html")) {ready=true;break;}
    } catch {/* initial server boot */}
    await sleep(500);
  }
  if(!ready) throw Error("Wrangler local server did not serve the SPA within 20 seconds.");
  const targets = ["/", "/pilot", "/create-circle", "/circle/demo-record", "/task/demo-task","/transfer-pack"];
  for (const path of targets) {
    const {response,text}=await visit(path,true);
    if (response.status!==200 || !text.includes("<html"))
      throw Error("SPA navigation failed at "+path+" (HTTP "+response.status+").");
    console.log("PASS navigation "+path+" → HTTP "+response.status);
  }
  const bundle=collectJs(resolve("dist"))[0];
  if (!bundle) throw Error("No JavaScript bundle in dist.");
  const {response}=await visit(bundle,false);
  if(response.status!==200 || !response.headers.get("content-type")?.includes("javascript"))
    throw Error("JS static asset failed at "+bundle+" (HTTP "+response.status+").");
  console.log("PASS static bundle "+bundle+" → HTTP 200");
  console.log("PASS Cloudflare Workers local SPA routing and static asset smoke tests");
} catch(err) {
  console.error("FAIL local Worker integration check: "+(err instanceof Error?err.message:String(err)));
  console.error("Wrangler output: "+out.join("").slice(-5000));
  process.exitCode=1;
} finally {
  if (!died) server.kill("SIGTERM");
  // The subprocess can keep handles alive on Windows. Exit after releasing its stdio.
  server.stdout.destroy(); server.stderr.destroy();
}
