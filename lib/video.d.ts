import type { ExplainerSlide } from "./explainVisual";
export declare function renderExplainerVideo(
  slides: ExplainerSlide[], onProgress?: (value: number) => void, signal?: AbortSignal
): Promise<Blob>;
export declare function downloadExplainerVideo(blob: Blob): void;
