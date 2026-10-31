import { Share } from "react-native";
/** Native share sheet: user chooses target; no background upload. */
export function exportCapstone(content:string):Promise<unknown> {
  return Share.share({title:"OpenForge private capstone draft",message:content});
}
