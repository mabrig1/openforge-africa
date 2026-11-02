/** Android/iOS installed speech voices. Never upload text or impersonate a
 * Nigerian male voice if the device did not install one.
 */
import * as Speech from "expo-speech";
import {bestAvailableVoice,orderSpeechVoices,type SpeechVoiceChoice} from "./voiceSelection";
export async function getSpeechVoices():Promise<SpeechVoiceChoice[]>{
 const all=await Speech.getAvailableVoicesAsync();
 return orderSpeechVoices(all.map(v=>({
  id:v.identifier,name:v.name,lang:v.language,
  quality:String(v.quality).toLowerCase().includes("enhanced")?"enhanced":"standard"
 })));
}
export function speakText(text:string,rate=0.94,voiceId?:string|null){
 Speech.stop();
 const chosen=voiceId||undefined;
 Speech.speak(text.slice(0,4000),{
  language:"en-NG",rate:Math.min(1.3,Math.max(0.75,rate)),pitch:0.96,
  ...(chosen?{voice:chosen}:{})
 });
}
export function stopSpeech(){Speech.stop();}
