import type { ExplainerSlide } from "./explainVisual";
export async function renderExplainerVideo(_slides: ExplainerSlide[],
  _onProgress?: (value:number)=>void, _signal?:AbortSignal): Promise<Blob> {
  throw new Error("Video rendering currently works in Chrome/Edge web browsers. Native video export is not yet implemented.");
}
export function downloadExplainerVideo(_blob: Blob) {
  throw new Error("Video download currently requires a supported web browser.");
}
