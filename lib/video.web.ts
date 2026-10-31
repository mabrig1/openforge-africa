import type { ExplainerSlide } from "./explainVisual";
import { wrapWords } from "./explainVisual";
/**
 * Creates a real, silent WebM text-motion video in supporting browsers.
 * Local Canvas + MediaRecorder only. No GPU generation/voice-over claimed.
 */
export async function renderExplainerVideo(slides: ExplainerSlide[],
  onProgress?: (value: number) => void, signal?: AbortSignal): Promise<Blob> {
  if (typeof document === "undefined" || typeof MediaRecorder === "undefined")
    throw new Error("Video export needs a modern browser with MediaRecorder.");
  if (!HTMLCanvasElement.prototype.captureStream)
    throw new Error("This browser cannot capture a canvas video stream.");
  const mime = ["video/webm;codecs=vp8","video/webm"].find(s => MediaRecorder.isTypeSupported(s));
  if (!mime) throw new Error("This browser cannot encode WebM video. Try desktop Chrome.");
  const canvas = document.createElement("canvas"); canvas.width = 540; canvas.height = 960;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering is unavailable.");
  const storyboard = slides.slice(0,6);
  if (!storyboard.length) throw new Error("Add text to create a storyboard.");
  const duration = storyboard.length * 2000; // two seconds per slide
  const fps = 12;
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {mimeType:mime,videoBitsPerSecond:1_400_000});
  const chunks: Blob[] = [];
  let aborted = false;
  let frame = 0;
  let animation = 0;
  const draw = (elapsed: number) => {
    const index = Math.min(storyboard.length-1,Math.floor(elapsed/2000));
    const slide = storyboard[index];
    const progress = (elapsed%2000)/2000;
    ctx.fillStyle="#0f172a";ctx.fillRect(0,0,540,960);
    ctx.fillStyle="#166534";ctx.fillRect(0,0,540,16);
    ctx.fillStyle="#22c55e";ctx.fillRect(0,0,540*Math.min(1,elapsed/duration),16);
    ctx.font="bold 21px sans-serif";ctx.fillStyle="#86efac";ctx.fillText("OPENFORGE AFRICA",36,95);
    ctx.fillStyle="#1e293b";ctx.fillRect(22,185,496,600);
    ctx.fillStyle="#4ade80";ctx.fillRect(22,185,Math.min(496,50+progress*400),7);
    ctx.fillStyle="#94a3b8";ctx.font="bold 18px sans-serif";
    ctx.fillText("STEP "+(index+1)+" OF "+storyboard.length,45,248);
    ctx.fillStyle="#ffffff";ctx.font="bold 37px sans-serif";
    wrapWords(slide.heading,22,3).forEach((line,i)=>ctx.fillText(line,45,335+i*50));
    ctx.fillStyle="#cbd5e1";ctx.font="25px sans-serif";
    wrapWords(slide.body,32,8).forEach((line,i)=>ctx.fillText(line,45,505+i*39));
    ctx.fillStyle="#94a3b8";ctx.font="18px sans-serif";
    ctx.fillText("Learning explainer • Visual summary",32,863);
    ctx.fillText("Review accuracy before sharing",32,899);
  };
  return await new Promise<Blob>((resolve,reject)=>{
    let settled=false;
    const fail=(message:string)=>{
      if(settled)return;settled=true;
      reject(new Error(message));
    };
    const cancel=()=>{
      aborted=true;
      if(recorder.state!=="inactive")recorder.stop();
    };
    const finish=()=>{
      cancelAnimationFrame(animation);stream.getTracks().forEach(t=>t.stop());
      signal?.removeEventListener("abort",cancel);
    };
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    recorder.onerror=()=>fail("Browser could not record the animated slides.");
    recorder.onstop=()=>{
      finish();
      if(aborted){fail("Video export cancelled.");return;}
      const blob=new Blob(chunks,{type:mime});
      if(!blob.size){fail("Browser created an empty recording.");return;}
      if(!settled){settled=true;resolve(blob);}
    };
    if(signal?.aborted){fail("Video export cancelled.");finish();return;}
    signal?.addEventListener("abort",cancel,{once:true});
    let started=0;
    const tick=(stamp:number)=>{
      if(aborted||settled)return;
      if(!started)started=stamp;
      const elapsed=stamp-started;
      if(elapsed>=duration){draw(duration-1);recorder.stop();return;}
      draw(elapsed);frame++;onProgress?.(Math.min(99,Math.floor(100*elapsed/duration)));
      animation=requestAnimationFrame(tick);
    };
    try {draw(0);recorder.start(250);animation=requestAnimationFrame(tick);}
    catch {finish();fail("Could not start browser recording.");}
  });
}
export function downloadExplainerVideo(blob: Blob) {
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;
  a.download="openforge-explainer.webm";
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
