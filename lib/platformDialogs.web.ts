/** Browser-only adapter: react-native-web does not supply native Alert dialogs or Share sheet. */
type DialogButton = { text?: string; style?: "default" | "cancel" | "destructive"; onPress?: () => void };
function safeText(title: string, message?: string): string {
  return title + (message ? "\n\n" + message : "");
}
export const Alert = {
  alert(title: string, message?: string, buttons?: DialogButton[]) {
    if (typeof window === "undefined") return;
    if (!buttons?.length) { window.alert(safeText(title,message)); return; }
    const nonCancel=buttons.filter(b=>b.style!=="cancel");
    const cancel=buttons.find(b=>b.style==="cancel");
    const action=nonCancel[nonCancel.length-1];
    if (!action) { window.alert(safeText(title,message)); return; }
    if (window.confirm(safeText(title,message) + "\n\nOK: " + (action.text || "Continue") +
      "\nCancel: " + (cancel?.text || "Keep private"))) action.onPress?.();
    else cancel?.onPress?.();
  }
};
export const Share = {
  async share({title,message}: {title?:string;message:string}) {
    if (typeof window === "undefined") throw new Error("Web sharing is not available.");
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({title,text:message});
      return { action: "sharedAction" };
    }
    // Fallback is always separately confirmed. Clipboard may be accessible to other applications.
    if (!window.confirm("Your browser has no Share sheet. Copy this text to the clipboard instead? " +
      "Other apps or people using this device may read the clipboard.")) {
      return { action: "dismissedAction" };
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      window.alert("Copied to clipboard. Paste only into a recipient or application you trust.");
      return { action: "sharedAction" };
    }
    window.prompt("Select and copy this text manually. It was NOT sent anywhere.",message);
    return { action: "dismissedAction" };
  }
};
