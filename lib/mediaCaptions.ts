/** Deterministic slide captions. These are NOT a transcription of recorded speech. */
import type { ExplainerSlide } from "./explainVisual.ts";

export const DEFAULT_SLIDE_MS = 3000;
export const SLIDE_MS_OPTIONS = [3000, 5000, 8000] as const;
export interface CaptionCue { index: number; startMs: number; endMs: number; text: string }

export function createCaptionCues(slides: ExplainerSlide[], slideMs = DEFAULT_SLIDE_MS): CaptionCue[] {
  if (!SLIDE_MS_OPTIONS.some(s => s === slideMs)) throw new Error("Unsupported slide duration.");
  if (!Array.isArray(slides) || slides.length === 0 || slides.length > 6)
    throw new Error("A storyboard must contain 1–6 slides.");
  return slides.map((slide, index) => {
    const heading = slide.heading.trim().replace(/[\r\n]+/g, " ").slice(0, 90);
    const body = slide.body.trim().replace(/[\r\n]+/g, " ").slice(0, 240);
    return {
      index: index + 1, startMs: index * slideMs, endMs: (index + 1) * slideMs,
      text: [heading, body].filter(Boolean).join("\n"),
    };
  });
}
function timeCode(ms: number, srt: boolean): string {
  const hours = Math.floor(ms/3600000);
  const minutes = Math.floor(ms%3600000/60000);
  const seconds = Math.floor(ms%60000/1000);
  const millis = Math.floor(ms%1000);
  const sep = srt ? "," : ".";
  return [hours,minutes,seconds].map(n => String(n).padStart(2,"0")).join(":")+
    sep+String(millis).padStart(3,"0");
}
export function createSrt(slides: ExplainerSlide[], slideMs = DEFAULT_SLIDE_MS): string {
  return createCaptionCues(slides,slideMs).map(c => (
    c.index+"\n"+timeCode(c.startMs,true)+" --> "+timeCode(c.endMs,true)+"\n"+c.text
  )).join("\n\n")+"\n";
}
export function createVtt(slides: ExplainerSlide[], slideMs = DEFAULT_SLIDE_MS): string {
  return "WEBVTT\n\n"+createCaptionCues(slides,slideMs).map(c => (
    timeCode(c.startMs,false)+" --> "+timeCode(c.endMs,false)+"\n"+c.text
  )).join("\n\n")+"\n";
}
