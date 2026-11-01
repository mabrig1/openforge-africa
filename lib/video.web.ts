import type { ExplainerSlide } from "./explainVisual";
import { wrapWords } from "./explainVisual";
import { createCaptionCues, DEFAULT_SLIDE_MS, SLIDE_MS_OPTIONS } from "./mediaCaptions";

/** Local motion graphics; optional live microphone narration is recorded ONLY after explicit consent. */
export interface VideoRenderOptions { withMicrophone?: boolean; slideMs?: number }

export function supportedVideoMimeType(withAudio = false): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  // MP4 is browser-dependent; never rename a WebM as MP4.
  const options = withAudio ? [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ] : [
    "video/mp4;codecs=avc1.42E01E",
    "video/mp4",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return options.find(type => MediaRecorder.isTypeSupported(type)) ?? null;
}
export async function renderExplainerVideo(
  slides: ExplainerSlide[],
  onProgress?: (value: number) => void,
  signal?: AbortSignal,
  options: VideoRenderOptions = {},
): Promise<Blob> {
  if (typeof document === "undefined" || typeof MediaRecorder === "undefined")
    throw new Error("Video export needs a modern browser with MediaRecorder.");
  if (!HTMLCanvasElement.prototype.captureStream)
    throw new Error("This browser cannot capture an animated canvas.");
  const storyboard = slides.slice(0, 6);
  const slideMs = options.slideMs ?? DEFAULT_SLIDE_MS;
  if (!SLIDE_MS_OPTIONS.some(v => v === slideMs)) throw new Error("Unsupported slide duration.");
  const captions = createCaptionCues(storyboard, slideMs);
  const withMicrophone = options.withMicrophone === true;
  if (signal?.aborted) throw new Error("Video export cancelled.");
  const mime = supportedVideoMimeType(withMicrophone);
  if (!mime) throw new Error("This browser cannot encode a supported MP4/WebM video.");
  const canvas = document.createElement("canvas");
  canvas.width = 540; canvas.height = 960;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering is unavailable.");
  const duration = storyboard.length * slideMs;
  const canvasStream = canvas.captureStream(12);
  let microphoneStream: MediaStream | null = null;
  let combinedStream: MediaStream = canvasStream;
  const cleanupMedia = () => {
    canvasStream.getTracks().forEach(track => track.stop());
    microphoneStream?.getTracks().forEach(track => track.stop());
  };
  try {
    if (withMicrophone) {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Microphone recording requires a secure, compatible browser.");
      try {
        // Browser permission prompt occurs only on explicit Record with microphone.
        microphoneStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true }, video: false,
        });
      } catch {
        throw new Error("Microphone permission was denied or unavailable. Switch to silent video.");
      }
      if (signal?.aborted) throw new Error("Video export cancelled.");
      if (!microphoneStream.getAudioTracks().length)
        throw new Error("No microphone audio track was captured.");
      combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(), ...microphoneStream.getAudioTracks(),
      ]);
    }
    // Some browsers advertise MP4 but cannot construct a recorder for a particular track set.
    // In that situation fall back to actual WebM, never fake an MP4 extension.
    let recorder: MediaRecorder | undefined;
    let encodedMime = mime;
    for (const candidate of [
      mime,
      withMicrophone ? "video/webm;codecs=vp8,opus" : "video/webm;codecs=vp8",
      "video/webm",
    ]) {
      if (!MediaRecorder.isTypeSupported(candidate)) continue;
      try {
        recorder = new MediaRecorder(combinedStream, {
          mimeType: candidate, videoBitsPerSecond: 1_400_000,
        });
        encodedMime = candidate;
        break;
      } catch { /* Try next supported container. */ }
    }
    if (!recorder) throw new Error("Browser cannot start an MP4 or WebM encoder.");
    const active = recorder;
    const chunks: Blob[] = [];
    let raf = 0;
    let aborted = false;
    const draw = (elapsed: number) => {
      const index = Math.min(storyboard.length - 1, Math.floor(elapsed / slideMs));
      const slide = storyboard[index];
      const progress = Math.min(1, Math.max(0, (elapsed % slideMs) / slideMs));
      ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, 540, 960);
      ctx.fillStyle = "#166534"; ctx.fillRect(0, 0, 540, 16);
      ctx.fillStyle = "#22c55e"; ctx.fillRect(0, 0, 540 * Math.min(1, elapsed / duration), 16);
      ctx.font = "bold 21px sans-serif"; ctx.fillStyle = "#86efac"; ctx.fillText("OPENFORGE AFRICA", 36, 95);
      ctx.fillStyle = "#1e293b"; ctx.fillRect(22, 185, 496, 600);
      ctx.fillStyle = "#4ade80"; ctx.fillRect(22, 185, Math.min(496, 50 + progress * 400), 7);
      ctx.fillStyle = "#94a3b8"; ctx.font = "bold 18px sans-serif";
      ctx.fillText("STEP " + (index + 1) + " OF " + storyboard.length, 45, 248);
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 37px sans-serif";
      wrapWords(slide.heading, 22, 3).forEach((line, i) => ctx.fillText(line, 45, 335 + i * 50));
      ctx.fillStyle = "#cbd5e1"; ctx.font = "25px sans-serif";
      wrapWords(slide.body, 32, 6).forEach((line, i) => ctx.fillText(line, 45, 505 + i * 39));
      ctx.fillStyle = "#94a3b8"; ctx.font = "18px sans-serif";
      ctx.fillText(withMicrophone ? "Live microphone narration" : "Silent motion graphics", 32, 864);
      ctx.fillText("Review accuracy before sharing", 32, 900);
      // Text on the video frames reflects the displayed storyboard, not speech transcription.
    };
    return await new Promise<Blob>((resolve, reject) => {
      let settled = false;
      const fail = (message: string) => {
        if (!settled) { settled = true; reject(new Error(message)); }
      };
      const finish = () => {
        cancelAnimationFrame(raf); cleanupMedia();
        signal?.removeEventListener("abort", cancel);
      };
      const cancel = () => {
        aborted = true;
        if (active.state !== "inactive") {
          try { active.stop(); } catch { finish(); fail("Video export cancelled."); }
        } else { finish(); fail("Video export cancelled."); }
      };
      active.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      active.onerror = () => {
        aborted = true;
        if (active.state !== "inactive") active.stop();
        fail("Browser video recording failed.");
      };
      active.onstop = () => {
        finish();
        if (aborted) { fail("Video export cancelled or recording failed."); return; }
        const blob = new Blob(chunks, { type: active.mimeType || encodedMime });
        if (!blob.size) { fail("Browser created an empty recording."); return; }
        if (!settled) { settled = true; resolve(blob); }
      };
      if (signal?.aborted) { cancel(); return; }
      signal?.addEventListener("abort", cancel, { once: true });
      let started: number | null = null;
      const tick = (stamp: number) => {
        if (aborted || settled) return;
        if (started === null) started = stamp;
        const elapsed = stamp - started;
        if (elapsed >= duration) {
          draw(duration - 1);
          if (active.state !== "inactive") active.stop();
          return;
        }
        draw(elapsed);
        onProgress?.(Math.min(99, Math.floor(100 * elapsed / duration)));
        raf = requestAnimationFrame(tick);
      };
      try {
        draw(0);
        active.start(250);
        raf = requestAnimationFrame(tick);
      } catch {
        finish();
        fail("Could not start browser video recording.");
      }
    });
  } catch (error) {
    cleanupMedia();
    throw error;
  }
}

export function downloadExplainerVideo(blob: Blob) {
  const isMp4 = blob.type.toLowerCase().includes("mp4");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "openforge-explainer." + (isMp4 ? "mp4" : "webm");
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
