import { Share } from "react-native";
/** Native users can copy/share subtitle text, but no file download is claimed. */
export function downloadCaptionFile(content: string, _format: "srt"|"vtt"): Promise<unknown> {
  return Share.share({title:"OpenForge slide captions",message:content});
}
