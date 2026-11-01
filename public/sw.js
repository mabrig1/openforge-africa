/*
 * Versioned PUBLIC app-shell cache only. No API responses or notes are cached.
 * Network-first HTML avoids keeping users on an old release after deploy.
 * Build replaces compile-time version and public asset manifest placeholders.
 */
const CACHE="openforge-public-__BUILD_VERSION__";
const SHELL=__SHELL_URLS__;
const PUBLIC_PATHS=new Set(SHELL);
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.allSettled(SHELL.map(url=>cache.add(url)));
  await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const existing=await caches.keys();
  await Promise.all(existing.filter(k=>k.startsWith("openforge-public-")&&k!==CACHE)
   .map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET"||req.headers.has("Authorization"))return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||url.pathname.startsWith("/api/"))return;
 const navigation=req.mode==="navigate";
 if(!navigation&&!PUBLIC_PATHS.has(url.pathname)&&!url.pathname.startsWith("/_expo/"))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(navigation){
   try{
    const response=await fetch(req);
    if(response.ok&&response.headers.get("Content-Type")?.includes("text/html"))
     await cache.put("/",response.clone());
    return response;
   }catch{
    return await cache.match("/")??await cache.match("/index.html")??Response.error();
   }
  }
  // Content-addressed Expo bundles are stable; navigation is ALWAYS fresh-first.
  if(url.pathname.startsWith("/_expo/")){
   const hit=await cache.match(req);
   if(hit)return hit;
  }
  try{
   const response=await fetch(req);
   if(response.ok&&response.type==="basic")await cache.put(req,response.clone());
   return response;
  }catch{return await cache.match(req)??Response.error();}
 })());
});
