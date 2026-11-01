/** Read-only RELEASE acceptance test for the publicly deployed Academy.
 * Requires installed Playwright Chromium. Never saves user data, issues POSTs,
 * sends notes, uses paid AI, or mutates Cloudflare/GitHub.
 *
 * This intentionally fails on a generic SPA shell serving "Unmatched Route".
 * Execute only AFTER authorized promotion or on an explicitly public preview URL.
 */
import {chromium} from "playwright";

const base=process.argv[2]??"https://openforge.mabrigkorie.org";
let url;
try{url=new URL(base);}catch{console.error("Expected absolute HTTPS origin");process.exit(2);}
if(url.protocol!=="https:"||url.username||url.password){
 console.error("Read-only acceptance requires a credential-free HTTPS origin.");process.exit(2);
}
const routes=[
 ["/","OpenForge Africa"],
 ["/academy","158"],
 ["/course","Logic and Critical Thinking"],
 ["/psychology-course","Psychology in the Age of AI"],
 ["/decision-science","Human Intelligence"],
 ["/forge-studies","Forge Studies"],
 ["/ail101","AI Literacy"],
 ["/relationalics","Foundations of Relationalics"],
 ["/ethnobotany","Computational Ethnobotany"],
 ["/integrated-soul","The Integrated Soul"],
 ["/clear-sight","Clear Sight"],
 ["/multi-channel-speaker","The Multi-Channel Speaker"]
];
let browser,failures=0;
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const page=await context.newPage();
 page.setDefaultTimeout(14000);
 for(const [route,needle] of routes){
  const address=new URL(route,url).toString();
  const errors=[];
  const onError=e=>errors.push(e.message);
  page.on("pageerror",onError);
  try{
   const response=await page.goto(address,{waitUntil:"domcontentloaded",timeout:18000});
   if(!response?.ok())throw Error("HTTP "+(response?.status()??"no response"));
   await page.waitForFunction(
    expected=>document.body?.innerText?.toLowerCase().includes(expected.toLowerCase()),
    needle,{timeout:14000}
   );
   const text=await page.locator("body").innerText();
   if(/unmatched route|page could not be found/i.test(text))throw Error("Expo unmatched route");
   if(errors.length)throw Error("browser runtime exception: "+errors[0]);
   console.log("PASS "+route+" • "+needle);
  }catch(e){
   failures++;
   console.error("FAIL "+route+": "+(e instanceof Error?e.message:String(e)).slice(0,450));
  }finally{page.off("pageerror",onError);}
 }
 await context.close();
} catch(e){
 console.error("Release browser failed: "+(e instanceof Error?e.message:String(e)));
 failures++;
}finally{await browser?.close();}
if(failures){
 console.error("NOT READY: "+failures+" route(s) failed. Do not claim production rollout successful.");
 process.exitCode=1;
}else{
 console.log("PASS: homepage, Academy + ten public course routes render at mobile width.");
 console.log("This does not replace real-device a11y, login, privacy, or source-rights review.");
}
