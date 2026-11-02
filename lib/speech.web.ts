/** Browser narration uses voices installed in the browser / OS.
 * Natural Nigerian male speech requires an installed matching voice or a separately
 * configured licensed neural TTS provider; pitch cannot manufacture an accent.
 */
import {bestAvailableVoice,orderSpeechVoices,type SpeechVoiceChoice} from "./voiceSelection";
const map=(v:SpeechSynthesisVoice):SpeechVoiceChoice=>({
 id:v.voiceURI,name:v.name,lang:v.lang,
 quality:/natural|neural|enhanced|premium/i.test(v.name)?"enhanced":"standard"
});
export async function getSpeechVoices():Promise<SpeechVoiceChoice[]>{
 if(typeof window==="undefined"||!("speechSynthesis" in window))return [];
 const engine=window.speechSynthesis;
 let available=engine.getVoices();
 if(!available.length){
   available=await new Promise<SpeechSynthesisVoice[]>(resolve=>{
     let done=false;
     const finish=()=>{if(done)return;done=true;engine.removeEventListener("voiceschanged",onChange);
       clearTimeout(timer);resolve(engine.getVoices());};
     const onChange=()=>finish();
     engine.addEventListener("voiceschanged",onChange);
     const timer=setTimeout(finish,1000);
   });
 }
 return orderSpeechVoices(available.map(map));
}
export function speakText(text:string,rate=0.94,voiceId?:string|null){
 if(typeof window==="undefined"||!("speechSynthesis" in window))
   throw new Error("This browser cannot read text aloud. Choose a browser with speech support.");
 const engine=window.speechSynthesis;
 engine.cancel();
 const all=engine.getVoices(),selected=bestAvailableVoice(all.map(map),voiceId);
 const matching=all.find(v=>v.voiceURI===selected?.id);
 const utterance=new SpeechSynthesisUtterance(text.slice(0,4000));
 if(matching)utterance.voice=matching;
 utterance.lang=matching?.lang||"en-NG";
 utterance.rate=Math.min(1.3,Math.max(0.75,rate));
 utterance.pitch=0.96;
 engine.speak(utterance);
}
export function stopSpeech(){
 if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
}
