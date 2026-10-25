/** Read-only post-deploy health check.
 * Never invokes Wrangler and never changes remote infrastructure.
 */
const url=process.argv[2];
if(!url) {
  console.error("Usage: node scripts/verify-live-site.mjs https://openforge.mabrigkorie.org/");
  process.exit(2);
}
let target;
try { target=new URL(url); }
catch { console.error("Invalid URL."); process.exit(2); }
if(target.protocol!=="https:") {
  console.error("HTTPS required for remote verification.");
  process.exit(2);
}
try {
  const response=await fetch(target,{redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{"Accept":"text/html","Sec-Fetch-Mode":"navigate"}});
  const contentType=response.headers.get("content-type")??"";
  const html=await response.text();
  if(!response.ok) throw Error("HTTP "+response.status);
  if(/^\s*hello\s+world[.!]?\s*$/i.test(html)) {
    throw Error("DEFAULT_WORKER: this URL serves the Cloudflare Hello world placeholder, not the OpenForge SPA.");
  }
  if(!contentType.includes("text/html") || !/<html[\s>]/i.test(html))
    throw Error("NOT_HTML_APP: response is not the Expo HTML shell (content-type: "+contentType+").");
  if(!/<script\b/i.test(html)) throw Error("MISSING_BUNDLE: HTML references no JavaScript entry.");
  console.log("PASS: HTML SPA shell served at "+target.origin+target.pathname);
  console.log("Note: client-side runtime and authentication must still be tested in a real browser.");
} catch(error) {
  console.error("FAIL: "+(error instanceof Error?error.message:String(error)));
  process.exitCode=1;
}
