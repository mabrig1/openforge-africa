import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const postbuild=fileURLToPath(new URL("../scripts/pwa-postbuild.mjs",import.meta.url));
const template=fileURLToPath(new URL("../public/sw.js",import.meta.url));
test("PWA packaging generates valid PNG icons, install metadata, offline SW and cache-safe API exclusions",()=>{
 const base=mkdtempSync(join(tmpdir(),"openforge-pwa-"));
 try{
  const dir=join(base,"dist");mkdirSync(dir,{recursive:true});
  const js=join(dir,"_expo","static","js");
  mkdirSync(js,{recursive:true});
  writeFileSync(join(js,"index-abc123.js"),"console.log('synthetic public test');");
  writeFileSync(join(dir,"index.html"),"<!doctype html><html><head><title>Test Expo</title></head><body><script src='/_expo/static/js/index-abc123.js'></script></body></html>");
  writeFileSync(join(dir,"sw.js"),readFileSync(template));
  const p=spawnSync(process.execPath,[postbuild,dir],{encoding:"utf8",cwd:root});
  assert.equal(p.status,0,p.stderr||p.stdout);
  const html=readFileSync(join(dir,"index.html"),"utf8");
  assert.match(html,/rel="manifest"/);
  assert.match(html,/beforeinstallprompt/);
  assert.match(html,/serviceWorker\.register/);
  assert.match(html,/apple-touch-icon/);
  const manifest=JSON.parse(readFileSync(join(dir,"manifest.webmanifest"),"utf8"));
  assert.equal(manifest.display,"standalone");
  assert.equal(manifest.scope,"/");
  assert.equal(manifest.start_url,"/");
  assert.deepEqual(manifest.icons.map(x=>x.sizes),["192x192","512x512"]);
  for(const size of [180,192,512]){
   const png=readFileSync(join(dir,"icons","openforge-"+size+".png"));
   assert.equal(png.readUInt32BE(16),size);
   assert.equal(png.readUInt32BE(20),size);
   assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  }
  const sw=readFileSync(join(dir,"sw.js"),"utf8");
  assert.doesNotMatch(sw,/__BUILD_VERSION__|__SHELL_URLS__/);
  assert.match(sw,/"\/_expo\/static\/js\/index-abc123\.js"/);
  assert.match(sw,/url\.pathname\.startsWith\("\/api\/"\)/);
  assert.match(sw,/req\.method!=="GET"/);
  assert.match(sw,/const navigation=req\.mode==="navigate"/);
  const before=readFileSync(join(dir,"manifest.webmanifest"));
  const rerun=spawnSync(process.execPath,[postbuild,dir],{encoding:"utf8",cwd:root});
  assert.equal(rerun.status,0,rerun.stderr||rerun.stdout);
  assert.deepEqual(readFileSync(join(dir,"manifest.webmanifest")),before);
 }finally{rmSync(base,{recursive:true,force:true});}
});
