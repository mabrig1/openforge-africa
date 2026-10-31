import type { ExplainerSlide } from "./explainVisual";
export interface VideoRenderOptions { withMicrophone?: boolean; slideMs?: number }
export declare function supportedVideoMimeType(withAudio?: boolean): string | null;
export declare function renderExplainerVideo(
  slides: ExplainerSlide[], onProgress?: (value: number) => void,
  signal?: AbortSignal, options?: VideoRenderOptions
): Promise<Blob>;
export declare function downloadExplainerVideo(blob: Blob): void;
