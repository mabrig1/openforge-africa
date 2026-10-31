/** Native Android/iOS device TTS. May use installed platform voices. */
import * as Speech from "expo-speech";
export function speakText(text: string, rate = 1) {
  Speech.stop();
  Speech.speak(text.slice(0, 4000), { language: "en", rate: Math.min(1.6, Math.max(0.7, rate)) });
}
export function stopSpeech() { Speech.stop(); }
