/** Device-local narration preference; never contains a provider key. */
import {create} from "zustand";
import {persist,createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface NarrationState{
 voiceId:string|null;rate:number;
 setVoiceId:(id:string|null)=>void;setRate:(rate:number)=>void;
}
export const useNarrationStore=create<NarrationState>()(persist((set)=>({
 voiceId:null,rate:0.94,
 setVoiceId:id=>set({voiceId:typeof id==="string"&&id.length<250?id:null}),
 setRate:rate=>{if(Number.isFinite(rate)&&rate>=0.75&&rate<=1.3)set({rate});}
}),{
 name:"openforge-narration-preferences-v1",version:1,
 storage:createJSONStorage(()=>AsyncStorage),
 partialize:s=>({voiceId:s.voiceId,rate:s.rate}),
}));
