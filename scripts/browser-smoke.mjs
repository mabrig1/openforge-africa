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
  await page.getByText("Fictional QA Circle").last().waitFor({timeout:12000});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("Fictional QA Circle").last().waitFor({state:"visible",timeout:15000});
  console.log("PASS: browser-local study circle persists on reload");
  await page.goto(address+"/pilot",{waitUntil:"domcontentloaded"});
  await page.getByText("Seven-day study pilot").last().waitFor({state:"visible",timeout:15000});
  console.log("PASS: direct SPA navigation to /pilot");
  await page.goto(address+"/challenge",{waitUntil:"domcontentloaded"});
  await page.getByText("Build better. Prove it.").waitFor({state:"visible",timeout:15000});
  await page.getByRole("button",{name:"Run six local integrity checks"}).click();
  await page.getByText("6 of 6 local checks passed").waitFor({state:"visible",timeout:15000});
  console.log("PASS: challenge page runs real local integrity checks");
  await page.getByRole("button",{name:"Load synthetic demonstration study circle"}).click();
  await page.getByText("OpenForge Judge Demo (synthetic)").last().waitFor({state:"visible",timeout:15000});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("OpenForge Judge Demo (synthetic)").last().waitFor({state:"visible",timeout:15000});
  console.log("PASS: synthetic judge course imports and survives reload");
  const api=await page.request.get(address+"/api/tutor");
  if(api.status()!==200 || (await api.json()).available!==false)
    throw Error("Unconfigured tutor API did not clearly report disabled state");
  const disabled=await page.request.post(address+"/api/tutor",{
    data:{question:"test",sources:[{id:"s1",title:"Test",excerpt:"synthetic"}]}
  });
  if(disabled.status()!==503)throw Error("Disabled private tutor unexpectedly accepted inference");
  console.log("PASS: tutor route responds safely without credentials or inference");
  await page.goto(address+"/tutor",{waitUntil:"domcontentloaded"});
  await page.getByText("Ask your AI Tutor").waitFor({state:"visible",timeout:15000});
  await page.getByRole("checkbox",{name:"Share preview of Fictional Learning Notes"}).check();
  await page.getByRole("textbox",{name:"Tutor question"}).fill("What is offline study?");
  await page.getByRole("button",{name:"Ask offline note coach"}).click();
  await page.getByText("OFFLINE NOTE LOOKUP").waitFor({state:"visible",timeout:15000});
  console.log("PASS: offline tutor with explicit selected notes");
  await page.goto(address+"/reader",{waitUntil:"domcontentloaded"});
  await page.getByText("Text Reader").last().waitFor({state:"visible",timeout:15000});
  await page.getByRole("textbox",{name:"Text for speech reader"}).fill("Public accountability means explaining decisions.");
  await page.getByRole("button",{name:"Speed 1.2 times"}).click();
  console.log("PASS: text reader accepts content and speed controls");
  await page.goto(address+"/explainer",{waitUntil:"domcontentloaded"});
  await page.getByRole("textbox",{name:"Explainer source text"}).fill("Students can learn without internet. Offline notes support practice tasks. Small quizzes show local progress.");
  await page.getByRole("button",{name:"Generate storyboard and infographic"}).click();
  await page.getByText("Actual SVG infographic preview").waitFor({state:"visible",timeout:15000});
  const svgDownload=page.waitForEvent("download",{timeout:15000});
  await page.getByRole("button",{name:"Download SVG infographic"}).click();
  const saved=await svgDownload;
  if(saved.suggestedFilename()!=="openforge-infographic.svg")throw Error("SVG download failed");
  console.log("PASS: real downloadable SVG infographic created");
  const canRecord=await page.evaluate(()=>
    typeof MediaRecorder!=="undefined" && !!HTMLCanvasElement.prototype.captureStream &&
    ["video/webm;codecs=vp8","video/webm"].some(m=>MediaRecorder.isTypeSupported(m)));
  if(canRecord){
    await page.getByRole("button",{name:"Render silent WebM explainer video"}).click();
    await page.getByRole("button",{name:"Download rendered WebM video"}).waitFor({state:"visible",timeout:35000});
    const videoDownload=page.waitForEvent("download",{timeout:15000});
    await page.getByRole("button",{name:"Download rendered WebM video"}).click();
    const video=await videoDownload;
    if(video.suggestedFilename()!=="openforge-explainer.webm")throw Error("WebM download failed");
    console.log("PASS: actual WebM video export produced by canvas recorder");
  } else console.log("SKIP: headless browser does not support WebM capture");
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
