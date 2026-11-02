/** Prefer genuinely installed high-quality regional voices. We never claim a voice
 * is African or male when the system does not expose reliable gender metadata.
 * The Azure en-NG-AbeoNeural voice is NOT bundled; it requires licensed cloud TTS.
 */
export interface SpeechVoiceChoice{
 id:string;name:string;lang:string;quality:"enhanced"|"standard";
}
export function scoreVoice(v:SpeechVoiceChoice):number{
 const name=v.name.toLowerCase(),lang=v.lang.toLowerCase();
 const natural=/natural|neural|enhanced|premium|high.?quality|wavenet/.test(name)||v.quality==="enhanced";
 const knownMale=/abeo|chilemba|ryan|daniel|arthur|oliver|james|george|david|guy|thomas/.test(name);
 // Voice metadata has no reliable gender field, but a few provider voice names
 // have documented gender. Never label other voices as guaranteed male.
 const documentedFemale=/ezinne|asilia/.test(name);
 const ng=lang.startsWith("en-ng"),ke=lang.startsWith("en-ke");
 const international=lang.startsWith("en-gb");
 return (ng?65:ke?45:international?25:lang.startsWith("en-")?5:-100)
   +(natural?35:0)+(knownMale?20:0)-(documentedFemale?60:0);
}
export function orderSpeechVoices(voices:SpeechVoiceChoice[]):SpeechVoiceChoice[]{
 return voices.filter(v=>v.lang.toLowerCase().startsWith("en"))
   .sort((a,b)=>scoreVoice(b)-scoreVoice(a)||a.name.localeCompare(b.name));
}
export function bestAvailableVoice(voices:SpeechVoiceChoice[],savedId?:string|null){
 const all=orderSpeechVoices(voices);
 return all.find(v=>v.id===savedId)??all[0]??null;
}
