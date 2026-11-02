/** Types for the platform-selected native/browser speech implementation. */
import type {SpeechVoiceChoice} from "./voiceSelection";
export declare function getSpeechVoices():Promise<SpeechVoiceChoice[]>;
export declare function speakText(text:string,rate?:number,voiceId?:string|null):void;
export declare function stopSpeech():void;
