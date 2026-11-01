import type { ExplainerSlide } from "./explainVisual";
import type { VideoRenderOptions } from "./video";
export function supportedVideoMimeType(_withAudio = false): string | null { return null; }
export async function renderExplainerVideo(
  _slides: ExplainerSlide[], _onProgress?: (value:number)=>void,
  _signal?:AbortSignal, _options?:VideoRenderOptions
): Promise<Blob> {
  throw new Error("Native video export is not supported. Open the web studio in a compatible browser.");
}
export function downloadExplainerVideo(_blob: Blob): void {
  throw new Error("Video download requires a compatible web browser.");
}
