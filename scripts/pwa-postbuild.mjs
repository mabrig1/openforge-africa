/**
 * Deterministic, dependency-free Metro SPA -> installable PWA packaging.
 * Generated graphics are original. No learner content is cached or transmitted.
 */
import {existsSync,mkdirSync,readFileSync,readdirSync,statSync,writeFileSync} from "node:fs";
import {join,resolve,relative,sep} from "node:path";
import {deflateSync} from "node:zlib";
import {createHash} from "node:crypto";

const out=resolve(process.argv[2]??"dist");
const index=join(out,"index.html");
if(!existsSync(index))throw Error("Run Expo web export before PWA postbuild");
mkdirSync(join(out,"icons"),{recursive:true});
function crc32(b){
 let c=0xFFFFFFFF;
 for(const v of b){c^=v;for(let n=0;n<8;n++)c=(c>>>1)^((c&1)?0xEDB88320:0);}
 return (c^0xFFFFFFFF)>>>0;
}
function chunk(name,bytes){
 const type=Buffer.from(name),len=Buffer.alloc(4),crc=Buffer.alloc(4);
 len.writeUInt32BE(bytes.length);crc.writeUInt32BE(crc32(Buffer.concat([type,bytes])));
 return Buffer.concat([len,type,bytes,crc]);
}
function png(size){
 const data=Buffer.alloc(size*(size*4+1)),scale=512/size;
 for(let y=0;y<size;y++){
  for(let x=0;x<size;x++){
   const X=(x+0.5)*scale,Y=(y+0.5)*scale;
   const dx=X-256,dy=Y-256;
   const d=Math.sqrt(dx*dx+dy*dy);
   let rgb=[18,38,79];
   if(d<178)rgb=[142,249,209];
   if(d<143)rgb=[18,38,79];
   // Simple OF monogram made of mathematical shapes, no external logo.
   if(d<139&&((X>161&&X<194&&Y>200&&Y<310)||
    (X>161&&X<254&&Y>196&&Y<231)||
    (X>161&&X<254&&Y>284&&Y<319)||
    (X>260&&X<294&&Y>196&&Y<322)||
    (X>260&&X<354&&Y>196&&Y<231)||
    (X>260&&X<335&&Y>249&&Y<280)))rgb=[255,255,255];
   const i=y*(size*4+1)+1+x*4;
   data[i]=rgb[0];data[i+1]=rgb[1];data[i+2]=rgb[2];data[i+3]=255;
  }
 }
 const h=Buffer.alloc(13);h.writeUInt32BE(size,0);h.writeUInt32BE(size,4);h[8]=8;h[9]=6;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),
  chunk("IHDR",h),chunk("IDAT",deflateSync(data,{level:9})),chunk("IEND",Buffer.alloc(0))]);
}
for(const s of [180,192,512])
 writeFileSync(join(out,"icons","openforge-"+s+".png"),png(s));
const manifest={
 id:"/",name:"OpenForge Africa – Learning Academy",short_name:"OpenForge",
 description:"Ten self-study subjects and a fifteen-role offline learning classroom.",
 start_url:"/",scope:"/",display:"standalone",
 background_color:"#F6F7FB",theme_color:"#142A50",
 categories:["education","productivity"],lang:"en",
 icons:[
  {src:"/icons/openforge-192.png",sizes:"192x192",type:"image/png",purpose:"any"},
  {src:"/icons/openforge-512.png",sizes:"512x512",type:"image/png",purpose:"any maskable"},
 ],
 shortcuts:[
  {name:"Explore courses",short_name:"Academy",url:"/academy"},
  {name:"15-Agent Classroom",short_name:"Classroom",url:"/classroom"},
 ],
};
writeFileSync(join(out,"manifest.webmanifest"),JSON.stringify(manifest,null,2)+"\n");
const metadata=[
 '<meta name="theme-color" content="#142A50" />',
 '<meta name="apple-mobile-web-app-capable" content="yes" />',
 '<meta name="apple-mobile-web-app-status-bar-style" content="default" />',
 '<meta name="apple-mobile-web-app-title" content="OpenForge" />',
 '<meta name="application-name" content="OpenForge Africa" />',
 '<link rel="manifest" href="/manifest.webmanifest" />',
 '<link rel="apple-touch-icon" sizes="180x180" href="/icons/openforge-180.png" />',
 '<link rel="icon" sizes="192x192" type="image/png" href="/icons/openforge-192.png" />',
 '<script>',
 'window.addEventListener("beforeinstallprompt",function(e){',
 ' e.preventDefault();window.__openforgeDeferredPrompt=e;',
 '});',
 'if("serviceWorker" in navigator){',
 ' window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js",{scope:"/"})',
 ' .catch(function(){ /* optional offline shell */ });});',
 '}',
 '</script>',
].join("\n");
let html=readFileSync(index,"utf8");
if(!html.includes("</head>"))throw Error("Expected Expo HTML </head> tag");
html=html.replace("</head>",metadata+"\n</head>");
writeFileSync(index,html);
const files=[];
function scan(path){
 for(const name of readdirSync(path)){
  const full=join(path,name),stat=statSync(full);
  if(stat.isDirectory()){scan(full);continue;}
  const url="/"+relative(out,full).split(sep).join("/");
  if(url.startsWith("/_expo/")&&/\.(js|css|woff2?|ttf)$/.test(url)&&stat.size<12_000_000)
   files.push(url);
 }
}
scan(out);
const shell=[...new Set(["/","/index.html","/manifest.webmanifest",
 "/icons/openforge-192.png","/icons/openforge-512.png",...files])];
const buildId=createHash("sha256").update(html+JSON.stringify(shell)).digest("hex").slice(0,16);
const sourceSW=join(out,"sw.js");
if(!existsSync(sourceSW))throw Error("public/sw.js was not copied by Expo export");
const sw=readFileSync(sourceSW,"utf8")
 .replaceAll("__BUILD_VERSION__",buildId)
 .replace("__SHELL_URLS__",JSON.stringify(shell));
writeFileSync(sourceSW,sw);
console.log("[OpenForge] PWA packaged: manifest, install icons, service worker and "+shell.length+" offline shell files.");
