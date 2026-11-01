import {Share} from "react-native";
/** The OS share sheet is opt-in, controlled by user. No background transfer. */
export function exportForgeDossier(content:string):Promise<unknown>{
 return Share.share({title:"FS 101 private unverified evidence dossier",message:content});
}
