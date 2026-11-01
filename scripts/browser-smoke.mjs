/** Browser runtime smoke test: verifies that the actual app renders, not just an HTML shell. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
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
  await page.getByRole("checkbox",{name:/Share preview of Offline Study/}).click();
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
  await page.getByRole("button",{name:"Choose timeline infographic layout"}).click();
  const svgDownload=page.waitForEvent("download",{timeout:15000});
  await page.getByRole("button",{name:"Download SVG infographic"}).click();
  const saved=await svgDownload;
  if(saved.suggestedFilename()!=="openforge-infographic.svg")throw Error("SVG download failed");
  const actualSvg=await readFile(await saved.path(),"utf8");
  if(!actualSvg.includes('<line x1="109"')||!actualSvg.includes("OPENFORGE AFRICA"))
    throw Error("Selected timeline diagram was not exported");
  console.log("PASS: timeline infographic SVG generated and downloaded");
  await page.getByRole("button",{name:"Slide duration 5 seconds"}).click();
  const subtitleDownload=page.waitForEvent("download",{timeout:15000});
  await page.getByRole("button",{name:"Download SRT slide subtitles"}).click();
  const subtitle=await subtitleDownload;
  if(subtitle.suggestedFilename()!=="openforge-explainer.srt")throw Error("SRT filename invalid");
  const srt=await readFile(await subtitle.path(),"utf8");
  if(!srt.includes("00:00:00,000 --> 00:00:05,000")||!srt.includes("00:00:05,000 --> 00:00:10,000"))
    throw Error("SRT cues do not match 5 second scene timing");
  console.log("PASS: SRT subtitle export with exact per-slide timings");
  await page.getByRole("button",{name:"Slide duration 3 seconds"}).click();
  await page.getByRole("checkbox",{name:"Record my own microphone narration locally"}).click();
  await page.getByText("Requires microphone permission upon Render.",{exact:false}).waitFor({state:"visible"});
  await page.getByRole("checkbox",{name:"Record my own microphone narration locally"}).click();
  console.log("PASS: optional microphone opt-in can be enabled and disabled");
  const canRecord=await page.evaluate(()=>
    typeof MediaRecorder!=="undefined" && !!HTMLCanvasElement.prototype.captureStream &&
    ["video/webm;codecs=vp8","video/webm"].some(m=>MediaRecorder.isTypeSupported(m)));
  if(canRecord){
    await page.getByRole("button",{name:"Render explainer video"}).click();
    await page.getByRole("button",{name:"Download rendered explainer video"}).waitFor({state:"visible",timeout:35000});
    await page.getByLabel("Local recorded explainer preview").waitFor({state:"visible",timeout:12000});
    await page.waitForFunction(() => {
      const v=document.querySelector('video[aria-label="Local recorded explainer preview"]');
      return v instanceof HTMLVideoElement && v.readyState>=1 && v.videoWidth>0;
    },null,{timeout:12000});
    console.log("PASS: actual browser video metadata plays in local preview");
    const videoDownload=page.waitForEvent("download",{timeout:15000});
    await page.getByRole("button",{name:"Download rendered explainer video"}).click();
    const video=await videoDownload;
    const name=video.suggestedFilename();
    if(!["openforge-explainer.webm","openforge-explainer.mp4"].includes(name))
      throw Error("Invalid real video filename: "+name);
    const output=await video.path();
    if((await stat(output)).size<2000)throw Error("Encoded video file is too small");
    const bytes=await readFile(output);
    if(name.endsWith(".webm") && bytes.subarray(0,4).toString("hex")!=="1a45dfa3")
      throw Error("WebM signature missing");
    if(name.endsWith(".mp4") && !bytes.subarray(0,20).toString("latin1").includes("ftyp"))
      throw Error("MP4 container signature missing");
    console.log("PASS: real playable-format "+name+" video exported with valid container header");
  } else console.log("SKIP: headless browser does not support WebM capture");
  await page.goto(address+"/course",{waitUntil:"domcontentloaded"});
  await page.getByText("Logic and Critical Thinking").last().waitFor({state:"visible",timeout:15000});
  await page.getByText("0 / 23 complete").waitFor({state:"visible",timeout:15000});
  await page.getByRole("button",{name:"Show all 23 lesson titles"}).click();
  await page.getByRole("button",{name:"Open lesson 23: The Applied Reasoning Capstone"}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Show all 23 lesson titles"}).click();
  await page.getByRole("radio",{name:"Answer 2: Clarify, assess evidence, and consider alternatives"}).click();
  await page.getByRole("button",{name:"Check logic lesson answer"}).click();
  await page.getByRole("button",{name:"Mark logic lesson as read"}).click();
  await page.getByText("1 / 23 complete").waitFor({state:"visible",timeout:15000});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 23 complete").waitFor({state:"visible",timeout:15000});
  console.log("PASS: complete 23-chapter course index, live quiz and persistent lesson mastery");
  await page.getByRole("button",{name:"Make infographic or video from lesson"}).click();
  await page.getByRole("textbox",{name:"Explainer source text"}).waitFor({state:"visible",timeout:15000});
  const prefill=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!prefill.includes("CLEAR routine"))throw Error("Course lesson did not transfer into creative studio");
  console.log("PASS: course chapter is sent to existing diagram and video studio");
  await page.goto(address+"/course",{waitUntil:"domcontentloaded"});
  await page.getByRole("button",{name:"Save lesson to offline study circle and open Tutor"}).click();
  await page.getByText("Ask your AI Tutor").waitFor({state:"visible",timeout:15000});
  const savedCourse=await page.getByText("Chapter 1: What Does It Mean to Think Critically?");
  await savedCourse.waitFor({state:"visible",timeout:15000});
  console.log("PASS: course notes join offline study circle and appear in AI Tutor without cloud calls");
  await page.goto(address+"/logic-lab",{waitUntil:"domcontentloaded"});
  await page.getByText("Formal Logic Lab").last().waitFor({state:"visible",timeout:15000});
  await page.getByText("INVALID ARGUMENT").waitFor({state:"visible",timeout:12000});
  await page.getByText("P=F, Q=T").waitFor({state:"visible",timeout:12000});
  await page.getByRole("radio",{name:"Predict invalid"}).click();
  await page.getByRole("button",{name:"Check my logic prediction"}).click();
  await page.getByText("Correct. Compare your reasoning",{exact:false}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Load Modus ponens (valid) example"}).click();
  await page.getByText("VALID ARGUMENT",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Load De Morgan equivalence (tautology) example"}).click();
  await page.getByText("tautology",{exact:false}).last().waitFor({state:"visible"});
  console.log("PASS: real truth-table calculations distinguish counterexample, valid inference and tautology");
  await page.goto(address+"/capstone",{waitUntil:"domcontentloaded"});
  await page.getByText("Capstone Research Studio").last().waitFor({state:"visible",timeout:15000});
  await page.getByRole("textbox",{name:"Capstone question writing area"}).fill(
    "Should a university require a mobile learning application despite unequal device access?");
  await page.getByRole("button",{name:"Edit capstone section 13: AI assistance and integrity disclosure"}).click();
  await page.getByRole("textbox",{name:"Capstone aiDisclosure writing area"}).fill(
    "No AI services have been used to create this fictional test case.");
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByRole("button",{name:"Edit capstone section 3: Exact research question and scope"}).click();
  const savedQuestion=await page.getByRole("textbox",{name:"Capstone question writing area"}).inputValue();
  if(!savedQuestion.includes("unequal device access"))throw Error("Private capstone draft was not persisted");
  const capstoneFile=page.waitForEvent("download",{timeout:15000});
  await page.getByRole("button",{name:"Download or share capstone text draft"}).click();
  const capstoneDownload=await capstoneFile;
  if(capstoneDownload.suggestedFilename()!=="openforge-capstone-draft.txt")
    throw Error("Capstone TXT export missing");
  const exportedDraft=await readFile(await capstoneDownload.path(),"utf8");
  if(!exportedDraft.includes("unequal device access")||!exportedDraft.includes("No AI services"))
    throw Error("Capstone export lost data or disclosure");
  console.log("PASS: capstone saves privately across reload, retains disclosure and exports readable TXT");
  await page.goto(address+"/psychology-course",{waitUntil:"domcontentloaded"});
  await page.getByText("PSY 210: Psychology in the Age of AI").last().waitFor({state:"visible",timeout:15000});
  await page.getByText("0 / 6 reviewed and practised").waitFor({state:"visible",timeout:15000});
  await page.getByRole("button",{name:"Toggle psychology learning modules"}).click();
  await page.getByRole("button",{name:"Read PSY 210 Module 6: Applied Capstone Project"}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Toggle psychology learning modules"}).click();
  await page.getByRole("radio",{name:/Module 1 question 1 answer 2:/}).click();
  await page.getByRole("radio",{name:/Module 1 question 2 answer 1:/}).click();
  await page.getByRole("radio",{name:/Module 1 question 3 answer 3:/}).click();
  await page.getByRole("button",{name:"Save PSY 210 three-question check"}).click();
  await page.getByText("3 / 3", {exact:false}).last().waitFor({state:"visible"});
  await page.getByRole("button",{name:"Mark PSY 210 module reviewed"}).click();
  await page.getByText("1 / 6 reviewed and practised").waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 6 reviewed and practised").waitFor({state:"visible"});
  console.log("PASS: six-module PSY 210 native course, practice answers and offline milestone persistence");
  await page.getByRole("button",{name:"Create psychology lesson infographic or video storyboard"}).click();
  await page.getByRole("textbox",{name:"Explainer source text"}).waitFor({state:"visible"});
  const psyDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!psyDraft.includes("Psychology studies mind and behavior"))
    throw Error("PSY 210 did not transfer reading review into multimedia studio");
  console.log("PASS: PSY 210 lesson transfers to infographic and video studio");
  await page.goto(address+"/psychology-course",{waitUntil:"domcontentloaded"});
  await page.getByRole("button",{name:"Save psychology lesson to offline circle and tutor"}).click();
  await page.getByText("Ask your AI Tutor").waitFor({state:"visible"});
  await page.getByText("PSY 210 — Module 1: Foundations of Mind & AI").waitFor({state:"visible"});
  console.log("PASS: private PSY 210 course notes appear in offline study circle tutor");
  await page.goto(address+"/psychology-interview",{waitUntil:"domcontentloaded"});
  await page.getByText("Virtual Interview Practice").last().waitFor({state:"visible",timeout:15000});
  for(const answer of [2,1,3,2,1]) {
    await page.getByRole("button",{name:new RegExp("^Select interview response "+answer+":")}).click();
  }
  await page.getByText("Five-turn simulation complete").waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("Five-turn simulation complete").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Transfer fictional interview transcript to Text Reader"}).click();
  await page.getByRole("textbox",{name:"Text for speech reader"}).waitFor({state:"visible"});
  const transcript=await page.getByRole("textbox",{name:"Text for speech reader"}).inputValue();
  if(!transcript.includes("Fictional practice case: Academic stress"))
    throw Error("Synthetic psychology dialogue was not transferred to Reader");
  console.log("PASS: three-case ethical interviewing lab branches, persists anonymously and exports scripted transcript to Reader");
  await page.goto(address+"/academy",{waitUntil:"domcontentloaded"});
  await page.getByText("My Learning Dashboard").last().waitFor({state:"visible",timeout:15000});
  await page.getByText("2 / 158 milestones").waitFor({state:"visible",timeout:15000});
  await page.getByText(/1\/23 milestones complete/).waitFor({state:"visible"});
  await page.getByText(/1\/6 milestones complete/).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Set weekly study goal to 4 sessions"}).click();
  await page.getByRole("button",{
    name:"Record today's study session for Logic and Critical Thinking"}).click();
  await page.getByRole("button",{
    name:"Record today's study session for Psychology in the Age of AI"}).click();
  await page.getByText("2 / 4 sessions recorded this device-calendar week").waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("2 / 158 milestones").waitFor({state:"visible"});
  await page.getByText("2 / 4 sessions recorded this device-calendar week").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume Psychology in the Age of AI"}).click();
  await page.getByText("PSY 210: Psychology in the Age of AI").last().waitFor({state:"visible"});
  await page.getByRole("button",{name:"Return to unified Academy dashboard from Psychology course"}).click();
  await page.getByText("My Learning Dashboard").last().waitFor({state:"visible"});
  console.log("PASS: unified Academy tracks both native courses, plans real local study records and resumes study");
  await page.goto(address+"/decision-science",{waitUntil:"domcontentloaded"});
  await page.getByText("Human Intelligence, Logic and AI Decision Science").last().waitFor({state:"visible"});
  await page.getByText("0 / 20",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Show or hide all units or weeks"}).click();
  await page.getByRole("button",{name:"Open unit 20: AI Ethics, Risk Governance and Public Responsibility"})
    .waitFor({state:"visible"});
  await page.getByRole("button",{name:"Show or hide all units or weeks"}).click();
  await page.getByRole("radio",{name:/Select expansion practice option 2:/}).click();
  await page.getByRole("button",{name:"Check expansion practice response"}).click();
  await page.getByRole("button",{name:"Mark expanded course reading reviewed"}).click();
  await page.getByText("1 / 20",{exact:true}).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 20",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Create new course infographic or explainer"}).click();
  await page.getByRole("textbox",{name:"Explainer source text"}).waitFor({state:"visible"});
  const decisionDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!decisionDraft.includes("capable demonstration"))throw Error("Decision course text not transferred to studio");
  console.log("PASS: twenty decision-science units, practice persistence and explainer transfer");
  await page.goto(address+"/decision-lab",{waitUntil:"domcontentloaded"});
  await page.getByText("Probability & Choice").last().waitFor({state:"visible"});
  await page.getByText("16.1%",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Set Bayes example with ten percent prevalence"}).click();
  await page.getByText("67.86%",{exact:true}).waitFor({state:"visible"});
  await page.getByText("30 units",{exact:true}).waitFor({state:"visible"});
  console.log("PASS: real Bayes posterior and expected-value calculations in mobile browser");
  await page.goto(address+"/forge-studies",{waitUntil:"domcontentloaded"});
  await page.getByText("Introduction to Forge Studies").last().waitFor({state:"visible"});
  await page.getByText("0 / 10",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Show or hide all units or weeks"}).click();
  await page.getByRole("button",{name:"Open week 10: Demo Day"}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Show or hide all units or weeks"}).click();
  await page.getByRole("radio",{name:/Select expansion practice option 2:/}).click();
  await page.getByRole("button",{name:"Check expansion practice response"}).click();
  await page.getByRole("button",{name:"Mark expanded course reading reviewed"}).click();
  await page.getByRole("textbox",{name:"Weekly Forge evidence URL"}).fill("https://example.org/public-project-demo");
  await page.getByRole("textbox",{name:"Weekly Forge evidence preparation notes"}).fill(
   "Fictional QA example, not a submitted or verified project.");
  await page.getByRole("button",{name:"Save unverified Forge evidence draft"}).click();
  await page.getByText("Saved locally as YOUR OWN UNVERIFIED evidence draft.",{exact:false})
    .waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 10",{exact:true}).waitFor({state:"visible"});
  if((await page.getByRole("textbox",{name:"Weekly Forge evidence URL"}).inputValue())
     !=="https://example.org/public-project-demo")throw Error("Forge local evidence draft lost after reload");
  console.log("PASS: FS101 10-week course, unverified proof draft and persistence without credential issuance");
  await page.goto(address+"/academy",{waitUntil:"domcontentloaded"});
  await page.getByText("4 / 158 milestones").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume Human Intelligence, Logic and AI Decision Science"})
    .waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume Introduction to Forge Studies"})
    .waitFor({state:"visible"});
  console.log("PASS: unified eight-course Academy retains 98 separate review milestones");

  // AIL 101 course is a short on-device companion, NOT the complete copyrighted manuscript.
  await page.goto(address+"/ail101",{waitUntil:"domcontentloaded"});
  await page.getByText("AI Literacy and Human–AI Collaboration").last()
    .waitFor({state:"visible",timeout:15000});
  await page.getByRole("radio",{name:/Option 1:/}).click();
  await page.getByRole("button",{name:"Check formative answer"}).click();
  await page.getByRole("button",{name:"Retry this formative quiz"}).click();
  await page.getByRole("radio",{name:/Option 3:/}).click();
  await page.getByRole("button",{name:"Check formative answer"}).click();
  await page.getByRole("button",{name:"Mark AI literacy review as read"}).click();
  await page.getByText("1 / 20",{exact:true}).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 20",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Send review to offline infographic and explainer studio"}).click();
  const ailDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!ailDraft.includes("independently checking important claims"))
    throw Error("AIL 101 review not transferred to offline explainer");
  await page.goto(address+"/academy",{waitUntil:"domcontentloaded"});
  await page.getByText("5 / 158 milestones").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume AI Literacy and Human–AI Collaboration"})
    .waitFor({state:"visible"});
  console.log("PASS: AIL 101 wrong/correct quiz, dual milestone, persistence, local explainer and fifth subject");

  await page.goto(address+"/relationalics",{waitUntil:"domcontentloaded"});
  await page.getByText("Foundations of Relationalics").last().waitFor({state:"visible",timeout:15000});
  await page.getByRole("radio",{name:/Answer 2:/}).click();
  await page.getByRole("button",{name:"Check course answer"}).click();
  await page.getByRole("button",{name:"Try formative answer again"}).click();
  await page.getByRole("radio",{name:/Answer 1:/}).click();
  await page.getByRole("button",{name:"Check course answer"}).click();
  await page.getByRole("button",{name:"Mark RLX 101 review read"}).click();
  await page.getByText("1 / 12",{exact:true}).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 12",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Send short review to offline Explainer"}).click();
  const rlxDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!rlxDraft.includes("Relationalics studies patterns formed"))
    throw Error("RLX review did not transfer to local Explainer");
  await page.goto(address+"/ethnobotany",{waitUntil:"domcontentloaded"});
  await page.getByText("Advanced Computational Ethnobotany").last().waitFor({state:"visible",timeout:15000});
  await page.getByText(/NOT proof of herbal safety/).waitFor({state:"visible"});
  await page.getByRole("radio",{name:/Answer 2:/}).click();
  await page.getByRole("button",{name:"Check course answer"}).click();
  await page.getByRole("button",{name:"Mark CEAI-401 review read"}).click();
  await page.getByText("1 / 7",{exact:true}).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 7",{exact:true}).waitFor({state:"visible"});
  await page.goto(address+"/academy",{waitUntil:"domcontentloaded"});
  await page.getByText("7 / 158 milestones").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume Foundations of Relationalics"}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume Advanced Computational Ethnobotany & Precision AI Phytotherapy"}).waitFor({state:"visible"});
  console.log("PASS: RLX101 and CEAI401 practice, correct retry, persistence, safety disclosure, and eight-course catalogue");

  // The Integrated Soul: six-week programme, twelve source-based seminar reviews.
  // Use only invented cases; never enter personal histories or infer clinical outcomes.
  await page.goto(address+"/integrated-soul",{waitUntil:"domcontentloaded"});
  await page.getByText("The Integrated Soul").last().waitFor({state:"visible",timeout:15000});
  await page.getByText("Philosophy, Psychology and Christian Transformation").last().waitFor({state:"visible"});
  await page.getByText("0 / 12",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("radio",{name:/Seminar answer 1:/}).click();
  await page.getByRole("button",{name:"Check Integrated Soul formative response"}).click();
  await page.getByRole("button",{name:"Retry this source-aligned learning check"}).click();
  await page.getByRole("radio",{name:/Seminar answer 3:/}).click();
  await page.getByRole("button",{name:"Check Integrated Soul formative response"}).click();
  await page.getByRole("button",{name:"Mark Integrated Soul seminar read"}).click();
  await page.getByText("1 / 12",{exact:true}).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 12",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Create offline infographic from this review"}).click();
  const soulDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!soulDraft.includes("The Integrated Soul")||
     !soulDraft.includes("Plato"))
    throw Error("Integrated Soul review transfer was not source grounded");
  await page.goto(address+"/academy",{waitUntil:"domcontentloaded"});
  await page.getByText("8 / 158 milestones").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume The Integrated Soul: Philosophy, Psychology and Christian Transformation"})
    .waitFor({state:"visible"});
  console.log("PASS: Integrated Soul preserves six weeks, correct/retry review, local persistence, transfer and eight-course milestones");

  // Clear Sight: source-aligned 24-unit review, local offline calibration and source-aware transfer.
  await page.goto(address+"/clear-sight",{waitUntil:"domcontentloaded"});
  await page.getByText("Clear Sight",{exact:true}).waitFor({state:"visible",timeout:15000});
  await page.getByText("0 / 24",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Show Clear Sight practice tools and Brier scoring laboratory"}).click();
  await page.getByRole("button",{name:"Calculate synthetic binary Brier score"}).click();
  await page.getByText("Brier score: 0.0900").waitFor({state:"visible"});
  await page.getByRole("radio",{name:"Synthetic event did not occur"}).click();
  await page.getByRole("button",{name:"Calculate synthetic binary Brier score"}).click();
  await page.getByText("Brier score: 0.4900").waitFor({state:"visible"});
  await page.getByRole("textbox",{name:"Synthetic forecast percentage"}).fill("105");
  await page.getByRole("button",{name:"Calculate synthetic binary Brier score"}).click();
  await page.getByText("Enter a probability between 0% and 100%.").waitFor({state:"visible"});
  await page.getByRole("radio",{name:/Clear Sight answer 2:/}).click();
  await page.getByRole("button",{name:"Check Clear Sight formative answer"}).click();
  await page.getByRole("button",{name:"Retry Clear Sight formative question"}).click();
  await page.getByRole("radio",{name:/Clear Sight answer 1:/}).click();
  await page.getByRole("button",{name:"Check Clear Sight formative answer"}).click();
  await page.getByRole("button",{name:"Mark Clear Sight review as read"}).click();
  await page.getByText("1 / 24",{exact:true}).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 24",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Send short Clear Sight review to offline Explainer"}).click();
  const clarityDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  const clarityTitle=await page.getByRole("textbox",{name:"Explainer topic"}).inputValue();
  if(!clarityTitle.includes("Observation, Inference and Unresolved Claims")||
     !clarityDraft.includes("Discernment begins by stating what happened")||
     !clarityDraft.includes("Mastering Discernment"))
    throw Error("Clear Sight short review or separate topic did not transfer to local Explainer");
  await page.goto(address+"/academy",{waitUntil:"domcontentloaded"});
  await page.getByText("9 / 158 milestones").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume Clear Sight: Mastering Discernment"}).waitFor({state:"visible"});
  console.log("PASS: Clear Sight course, Brier synthetic calculation, quiz retry, persistence, explainer and nine-course dashboard");
  // Speaker: eight source weeks; independent review, consent-aware practice and offline media transfer.
  await page.goto(address+"/multi-channel-speaker",{waitUntil:"domcontentloaded"});
  await page.getByText("The Multi-Channel Speaker",{exact:true}).last().waitFor({state:"visible",timeout:15000});
  await page.getByText("0 / 24",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"View Multi-Channel Speaker course showcase and synthetic case"}).click();
  await page.getByText(/Descriptive return rate: 40%/).waitFor({state:"visible"});
  await page.getByRole("radio",{name:/Speaker answer 1:/}).click();
  await page.getByRole("button",{name:"Check Speaker formative answer"}).click();
  await page.getByRole("button",{name:"Retry Speaker formative quiz"}).click();
  await page.getByRole("radio",{name:/Speaker answer 3:/}).click();
  await page.getByRole("button",{name:"Check Speaker formative answer"}).click();
  await page.getByRole("button",{name:"Mark Speaker review as read"}).click();
  await page.getByText("1 / 24",{exact:true}).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("1 / 24",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Send Speaker review to offline Explainer"}).click();
  const speakerTitle=await page.getByRole("textbox",{name:"Explainer topic"}).inputValue();
  const speakerDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!speakerTitle.includes("Listening Before Persuading")||
     !speakerDraft.includes("Active listening requires a neutral paraphrase"))
    throw Error("Speaker review transfer missing original source-aligned material");
  await page.goto(address+"/academy",{waitUntil:"domcontentloaded"});
  await page.getByText("10 / 158 milestones").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Resume The Multi-Channel Speaker"}).waitFor({state:"visible"});
  console.log("PASS: Speaker eight-week track, synthetic capstone, quiz retry, persistent progress and tenth Academy course");





  await page.goto(address+"/statistics-lab",{waitUntil:"domcontentloaded"});
  await page.getByText("Descriptive Statistics Laboratory").last().waitFor({state:"visible"});
  await page.getByText("5.4",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Load statistics outlier example"}).click();
  await page.getByText("21.167",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("textbox",{name:"Statistics sample observations"}).fill("no values here");
  await page.getByText("Enter valid comma-separated numbers.",{exact:false}).waitFor({state:"visible"});
  console.log("PASS: descriptive statistics computes mean and responds safely to outlier and invalid inputs");
  await page.goto(address+"/causal-lab",{waitUntil:"domcontentloaded"});
  await page.getByText("Causal Inference & Simpson's Paradox").last().waitFor({state:"visible"});
  await page.getByText("Raw difference: -22 percentage points").waitFor({state:"visible"});
  await page.getByRole("button",{name:"Toggle within-stratum causal teaching comparisons"}).click();
  await page.getByText("Within-group association: +10 pp").first().waitFor({state:"visible"});
  await page.getByRole("button",{name:"Load balanced learner composition example"}).click();
  await page.getByText("Raw difference: 10 percentage points").waitFor({state:"visible"});
  console.log("PASS: Simpson paradox teaching dataset reverses on balanced composition with strata shown");
  await page.goto(address+"/forge-portfolio",{waitUntil:"domcontentloaded"});
  await page.getByText("Forge Evidence Portfolio Studio").last().waitFor({state:"visible"});
  await page.getByText("1 / 10 draft URLs").waitFor({state:"visible"});
  await page.getByText("Launcher — NOT VERIFIED").waitFor({state:"visible"});
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:"Export private unverified Forge dossier"}).click();
  const download=await downloadPromise;
  if(download.suggestedFilename()!=="forge-studies-private-evidence-dossier.txt")throw Error("Unexpected Forge dossier filename");
  const dossier=await readFile(await download.path(),"utf8");
  if(!dossier.includes("NOT AN OFFICIAL SUBMISSION")||
     !dossier.includes("https://example.org/public-project-demo")||
     !dossier.includes("WEEK 10:"))throw Error("Forge dossier missing mandatory transparency/source content");
  await page.getByRole("button",{name:"Edit Week 1 Forge artifact evidence draft"}).click();
  await page.getByText("Introduction to Forge Studies").last().waitFor({state:"visible"});
  console.log("PASS: ten-week Forge portfolio exports private human-review dossier with no credential issued");
  // Agent Desk: verify actual mobile SPA route, local coordination and editable handoff.
  await page.goto(address+"/agents",{waitUntil:"domcontentloaded"});
  await page.getByText("12-agent learning studio",{exact:true}).waitFor({state:"visible",timeout:15000});
  await page.getByRole("button",{name:"Run the selected local learning agent"}).click();
  await page.getByText("Three-agent local learning plan",{exact:true}).waitFor({state:"visible"});
  await page.getByText(/Local delegation:/).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Choose AI Tutor"}).click();
  await page.getByRole("textbox",{name:"Agent question"}).fill("photosynthesis");
  await page.getByRole("button",{name:"Run the selected local learning agent"}).click();
  await page.getByText("No matching local passage",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Choose Multimedia Lecturer"}).click();
  await page.getByRole("button",{name:"Run the selected local learning agent"}).click();
  await page.getByText("Editable multimedia outline",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Open draft in Explainer Studio"}).click();
  const agentDraft=await page.getByRole("textbox",{name:"Explainer source text"}).inputValue();
  if(!agentDraft.includes("Scene 4:")||!agentDraft.includes("source-verified"))
    throw Error("Agent Desk explainer draft handoff missing");
  console.log("PASS: 12-agent Desk Coordinator, missing-evidence refusal and local storyboard handoff");
  // Free 15-agent classroom: validate browser UI, actual local dispatch and trial quota.
  await page.goto(address+"/classroom",{waitUntil:"domcontentloaded"});
  await page.getByText("15-agent classroom",{exact:true}).waitFor({state:"visible",timeout:15000});
  await page.getByText(/3 \/ 3 classroom runs left today/).waitFor({state:"visible"});
  await page.getByRole("textbox",{name:"Classroom question or topic"}).fill("What is logical validity?");
  await page.getByRole("button",{name:"Run free local classroom"}).click();
  await page.getByText("VERIFIABLE DIRECTOR DISPATCH TRACE",{exact:true}).waitFor({state:"visible"});
  await page.getByText(/Round 1: Lead Teacher/).waitFor({state:"visible"});
  await page.getByText(/Source gap: a learner question remains unverified/).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Start free seven day Explorer preview"}).click();
  await page.getByText(/FREE EXPLORER TRIAL/).waitFor({state:"visible"});
  await page.getByRole("button",{name:"Discussion mode"}).click();
  await page.getByRole("textbox",{name:"Classroom question or topic"}).fill("Thinking and reasoning discussion");
  await page.getByRole("button",{name:"Choose Visual Learner"}).click();
  await page.getByRole("button",{name:"Run free local classroom"}).click();
  await page.getByText(/Round 1: Visual Learner/).waitFor({state:"visible"});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText(/FREE EXPLORER TRIAL/).waitFor({state:"visible"});
  await page.getByText(/6 \/ 8 classroom runs left today/).waitFor({state:"visible"});
  console.log("PASS: 15-agent local classroom, teacher-first, rotated debate, persisted free trial counters");
  // Connected Academy course review, explicit local-source opt-in and audit dashboard.
  await page.goto(address+"/classroom?course=psy210",{waitUntil:"domcontentloaded"});
  await page.getByText("Psychology in the Age of AI",{exact:true}).waitFor({state:"visible",timeout:15000});
  await page.getByText("Foundations of Mind & AI",{exact:true}).waitFor({state:"visible"});
  await page.getByRole("checkbox",{name:"Include displayed Academy review as local classroom source"}).click();
  await page.getByRole("textbox",{name:"Classroom question or topic"}).fill("What does psychology study?");
  await page.getByRole("button",{name:"Run free local classroom"}).click();
  await page.getByText(/Round 1: Lead Teacher/).waitFor({state:"visible"});
  await page.getByText(/Local source: PSY 210/).first().waitFor({state:"visible"});
  await page.getByRole("button",{name:"Open classroom verification dashboard"}).click();
  await page.getByText("Classroom Verification",{exact:true}).waitFor({state:"visible"});
  await page.getByText("SYNTHETIC CHECKS PASS",{exact:true}).waitFor({state:"visible"});
  await page.getByText(/15 local roles · 10 linked courses · 158 short study reviews/).waitFor({state:"visible"});
  console.log("PASS: PSY 210 Academy course/short review consent, local source evidence and transparent verification dashboard");
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
