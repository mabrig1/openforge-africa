/** In-memory only, no persistence or URL parameters (avoids leaking text into history). */
let draft = { title: "", body: "" };
export function setStudioDraft(title: string, body: string) {
  draft = { title: title.slice(0, 120), body: body.slice(0, 4000) };
}
export function getStudioDraft() { return { ...draft }; }
export function clearStudioDraft() { draft = { title: "", body: "" }; }
