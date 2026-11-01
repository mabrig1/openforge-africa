/** Offline storyboard / SVG infographic generator; no model and no network. */
export interface ExplainerSlide { heading: string; body: string }
export function createStoryboard(title: string, explanation: string): ExplainerSlide[] {
  const cleanTitle = title.trim().slice(0, 90) || "Your learning explainer";
  const sentences = explanation.replace(/\[(?:S[1-3])\]/g, "")
    .replace(/[#*_\x60]/g, "").replace(/\r/g, "")
    .split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => s.length >= 8);
  const chosen = sentences.slice(0, 5).map((s, i) =>
    ({heading: ["The big idea", "How it works", "Why it matters", "Example", "Remember"][i],
      body: s.slice(0, 240)}));
  return [{heading: cleanTitle, body: "A visual explanation from your selected text."},
    ...chosen.length ? chosen : [{heading: "Start with a clear idea",body: explanation.trim().slice(0, 240) || "Enter an explanation first."}]];
}
export function escapeSvg(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"
  }[char] || char));
}
export function wrapWords(value: string, maxLength = 31, maxLines = 4): string[] {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > maxLength && current) {
      lines.push(current); current = "";
      if (lines.length === maxLines) break;
    }
    if (word.length > maxLength) {
      if(current) lines.push(current);
      lines.push(word.slice(0, maxLength)); current = "";
    } else current = current ? current + " " + word : word;
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (words.join(" ").length > lines.join(" ").length && lines.length) {
    lines[lines.length-1] = lines[lines.length-1].replace(/[.…]+$/,"").slice(0,maxLength-1) + "…";
  }
  return lines;
}
export function buildInfographicSvg(slides: ExplainerSlide[]): string {
  const blocks = slides.slice(0, 6);
  const width = 1080, height = 320 + blocks.length * 200;
  const blockSvg = blocks.map((slide,i) => {
    const top = 212 + i*200;
    const heading = escapeSvg(slide.heading.slice(0, 70));
    const lines = wrapWords(slide.body, 55, 3).map((line, j) =>
      `<text x="136" y="${top+99+j*30}" fill="#cbd5e1" font-size="24" font-family="Arial,sans-serif">${escapeSvg(line)}</text>`).join("");
    return `<rect x="50" y="${top}" rx="28" width="980" height="178" fill="#1e293b" stroke="#334155"/>
      <circle cx="91" cy="${top+49}" r="25" fill="#15803d"/>
      <text x="91" y="${top+57}" text-anchor="middle" font-size="22" font-weight="bold" fill="white" font-family="Arial">${i+1}</text>
      <text x="136" y="${top+56}" font-weight="bold" font-size="29" fill="#86efac" font-family="Arial,sans-serif">${heading}</text>
      ${lines}`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#0f172a"/>
  <text x="54" y="84" fill="#86efac" font-size="26" font-weight="bold" font-family="Arial,sans-serif">OPENFORGE AFRICA · LEARNING EXPLAINED</text>
  <text x="54" y="150" fill="white" font-size="46" font-weight="bold" font-family="Arial,sans-serif">Visual learning pathway</text>
  ${blockSvg}
  <text x="55" y="${height-40}" fill="#94a3b8" font-size="19" font-family="Arial,sans-serif">Generated from learner-provided text · Review for accuracy · No automatic cloud upload</text>
</svg>`;
}
