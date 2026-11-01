import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const dist = resolve("dist");
const entry = join(dist, "index.html");
if (!existsSync(entry)) {
  console.error("Missing dist/index.html. Use npm run build for Expo Router SPA output.");
  process.exit(1);
}
const html = readFileSync(entry, "utf8");
if (!/<html[\s>]/i.test(html) || !/<script\b/i.test(html)) {
  console.error("Expo web export is not a usable HTML+JavaScript SPA.");
  process.exit(1);
}
let bundleCount=0;
function walk(folder) {
  for (const item of readdirSync(folder)) {
    const p=join(folder,item);
    if (statSync(p).isDirectory()) walk(p);
    else if (item.endsWith(".js")) bundleCount++;
  }
}
walk(dist);
if (!bundleCount) {
  console.error("No JavaScript bundles were emitted by Expo web export.");
  process.exit(1);
}
console.log("Web output OK: dist/index.html and "+bundleCount+" JS bundle(s).");


const manifestPath=join(dist,"manifest.webmanifest");
const swPath=join(dist,"sw.js");
if(!existsSync(manifestPath)||!existsSync(swPath)){
 console.error("PWA installation files missing. Check pwa-postbuild.mjs.");
 process.exit(1);
}
const manifest=JSON.parse(readFileSync(manifestPath,"utf8"));
if(manifest.display!=="standalone"||manifest.start_url!=="/"||manifest.scope!=="/"||
 !manifest.icons?.some(x=>x.sizes==="192x192")||
 !manifest.icons?.some(x=>x.sizes==="512x512")||
 !html.includes('rel="manifest"')){
 console.error("Web app manifest or HTML install metadata invalid.");
 process.exit(1);
}
for(const s of [180,192,512]){
 const path=join(dist,"icons","openforge-"+s+".png");
 if(!existsSync(path))throw Error("PWA icon missing: "+path);
 const bytes=readFileSync(path);
 if(bytes.readUInt32BE(16)!==s||bytes.readUInt32BE(20)!==s)
  throw Error("PWA icon dimensions invalid: "+path);
}
const sw=readFileSync(swPath,"utf8");
if(sw.includes("__BUILD_VERSION__")||sw.includes("__SHELL_URLS__")||
 !sw.includes('url.pathname.startsWith("/api/")')||
 !sw.includes('req.mode==="navigate"')){
 console.error("Unsafe or unprocessed service worker.");
 process.exit(1);
}
console.log("PWA output OK: install manifest, Apple/Chromium icons, versioned service worker and install bootstrap.");
