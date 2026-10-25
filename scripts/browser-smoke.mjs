/** Browser runtime smoke test: verifies that the actual app renders, not just an HTML shell. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const address="http://127.0.0.1:8792";
const log=[];
const child=spawn(process.platform==="win32"?"npx.cmd":"npx",[
  "--no-install","wrangler","dev","--local","--ip","127.0.0.1","--port","8792"
],{stdio:["ignore","pipe","pipe"],env:{...process.env,CI:"true",WRANGLER_SEND_METRICS:"false"}});
child.stdout.on("data",b=>log.push(b.toString()));
child.stderr.on("data",b=>log.push(b.toString()));
let browser;
try {
  let working=false;
  for(let attempts=0;attempts<60;attempts++) {
    if(child.exitCode!==null) throw new Error("Wrangler stopped early: "+child.exitCode);
    try {const r=await fetch(address,{signal:AbortSignal.timeout(2500)});
      if(r.status===200){working=true;break;}}catch{}
    await sleep(500);
  }
  if(!working) throw new Error("Wrangler local app never started");
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:375,height:812}});
  const page=await context.newPage();
  const runtimeErrors=[];
  page.on("pageerror",e=>runtimeErrors.push(e.message));
  page.on("console",m=>{if(m.type()==="error")runtimeErrors.push(m.text())});
  await page.goto(address,{waitUntil:"domcontentloaded"});
  await page.getByText("Learn stronger, together.").waitFor({state:"visible",timeout:25000});
  if((await page.locator("body").innerText()).trim().toLowerCase()==="hello world")
    throw new Error("Page still displays the placeholder Worker");
  console.log("PASS: full Expo application rendered at 375px mobile viewport");
  await page.getByRole("button",{name:"Create study circle"}).click();
  await page.getByRole("textbox",{name:"Circle name"}).fill("Fictional QA Circle");
  await page.getByRole("textbox",{name:"Course code"}).fill("QA 101");
  await page.getByRole("textbox",{name:"Course title"}).fill("Synthetic test subject");
  await page.getByRole("button",{name:"Create local workspace"}).click();
  await page.getByText("Fictional QA Circle").first().waitFor({timeout:12000});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("Fictional QA Circle").first().waitFor({state:"visible",timeout:15000});
  console.log("PASS: browser-local study circle persists on reload");
  await page.goto(address+"/pilot",{waitUntil:"domcontentloaded"});
  await page.getByText("Seven-day study pilot").waitFor({state:"visible",timeout:15000});
  console.log("PASS: direct SPA navigation to /pilot");
  if(runtimeErrors.length)throw Error("Browser JS errors: "+runtimeErrors.slice(0,5).join(" | "));
  console.log("PASS: no captured JavaScript exceptions");
  await context.close();
}catch(error){
  console.error("FAIL: "+(error instanceof Error?error.stack:String(error)));
  console.error("Wrangler: "+log.join("").slice(-5000));
  if(browser){
    try{mkdirSync("test-results",{recursive:true});
      for(const p of browser.contexts().flatMap(c=>c.pages()))await p.screenshot({path:"test-results/openforge-web-failure.png",fullPage:true});
    }catch{}
  }
  process.exitCode=1;
}finally{
  try {await browser?.close();}catch{}
  if(child.exitCode===null) child.kill("SIGTERM");
  child.stdout.destroy();child.stderr.destroy();
}
