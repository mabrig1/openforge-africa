/** Local device voices; browser chooses voice. No audio is sent to OpenForge. */
export function speakText(text: string, rate = 1) {
  if (typeof window === "undefined" || !("speechSynthesis" in window))
    throw new Error("This browser does not support text-to-speech.");
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 4000));
  utterance.rate = Math.min(1.6, Math.max(0.7, rate));
  utterance.lang = "en";
  window.speechSynthesis.speak(utterance);
}
export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
