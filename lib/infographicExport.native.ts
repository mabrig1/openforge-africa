import { Share } from "react-native";
export function exportInfographic(_svg: string, text: string) {
  return Share.share({title:"OpenForge learning infographic outline",
    message:"OpenForge Africa — Visual learning pathway\n\n"+text});
}
