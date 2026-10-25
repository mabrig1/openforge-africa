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
