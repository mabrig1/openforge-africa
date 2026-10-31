/** Explicitly selected infographic templates; visualizes provided text, does not infer facts. */
import type { ExplainerSlide } from "./explainVisual.ts";
import { buildInfographicSvg, escapeSvg, wrapWords } from "./explainVisual.ts";

export type DiagramLayout = "cards" | "flow" | "timeline" | "comparison";
export const DIAGRAM_LAYOUTS: DiagramLayout[] = ["cards","flow","timeline","comparison"];

function safeLines(value: string, width = 36, count = 4): string {
  return wrapWords(value, width, count).map((line,i) =>
    `<tspan x="0" dy="${i===0?0:34}">${escapeSvg(line)}</tspan>`).join("");
}
function shell(body: string, height: number, label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${height}"
    viewBox="0 0 1080 ${height}" role="img" aria-label="${escapeSvg(label.slice(0,110))}">
    <rect width="1080" height="${height}" fill="#0f172a"/>
    <text x="54" y="79" font-size="26" font-weight="bold" font-family="Arial" fill="#86efac">OPENFORGE AFRICA · VISUAL LEARNING</text>
    <text x="54" y="142" font-size="41" font-weight="bold" font-family="Arial" fill="#ffffff">${escapeSvg(label.slice(0,43))}</text>
    ${body}
    <text x="54" y="${height-40}" font-size="19" fill="#cbd5e1" font-family="Arial">Visualization of provided text · Verify accuracy before sharing</text>
  </svg>`;
}
export function buildAdvancedInfographicSvg(slides: ExplainerSlide[], layout: DiagramLayout): string {
  if (!DIAGRAM_LAYOUTS.includes(layout)) throw new Error("Unknown layout.");
  const input = slides.slice(0,6);
  if (!input.length) throw new Error("No storyboard available.");
  if (layout==="cards") return buildInfographicSvg(input);
  // Opening slide supplies the graphic title; the following source slides supply visual items.
  const title = input[0].heading.trim() || "Learning visual";
  const items = input.slice(1).length ? input.slice(1) : input;
  if (layout==="comparison") {
    const height = 280 + Math.ceil(items.length/2)*268;
    const body = items.map((s,i)=>{
      const x=52+(i%2)*494, y=207+Math.floor(i/2)*268;
      return `<rect x="${x}" y="${y}" width="475" height="242" rx="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="${x+20}" y="${y+45}" font-size="25" font-weight="bold" fill="#7dd3fc" font-family="Arial">${escapeSvg(s.heading.slice(0,34))}</text>
        <g transform="translate(${x+20} ${y+88})"><text font-size="22" fill="#f1f5f9" font-family="Arial">${safeLines(s.body,31,4)}</text></g>`;
    }).join("\n");
    return shell(body,height,title);
  }
  const height=260+items.length*230;
  if(layout==="flow"){
    const body=items.map((s,i)=>{
      const y=200+i*230;
      const arrow=i===items.length-1?"":`<path d="M540 ${y+178} v37 m-15 -16 l15 16 l15 -16" fill="none" stroke="#4ade80" stroke-width="6"/>`;
      return `<rect x="112" y="${y}" width="850" height="176" rx="28" fill="#1e293b" stroke="#4ade80"/>
        <circle cx="160" cy="${y+51}" r="28" fill="#15803d"/>
        <text x="160" y="${y+60}" font-size="25" text-anchor="middle" fill="white" font-family="Arial">${i+1}</text>
        <text x="207" y="${y+54}" font-size="30" font-weight="bold" fill="#86efac" font-family="Arial">${escapeSvg(s.heading.slice(0,38))}</text>
        <g transform="translate(207 ${y+98})"><text font-size="23" fill="#f1f5f9" font-family="Arial">${safeLines(s.body,51,2)}</text></g>${arrow}`;
    }).join("\n");
    return shell(body,height,title);
  }
  const body=`<line x1="109" y1="198" x2="109" y2="${198+(items.length-1)*230}" stroke="#38bdf8" stroke-width="7"/>`+
    items.map((s,i)=>{
      const y=201+i*230;
      return `<circle cx="109" cy="${y+48}" r="27" fill="#0369a1" stroke="#bae6fd" stroke-width="4"/>
        <text x="109" y="${y+57}" font-size="24" text-anchor="middle" fill="white" font-family="Arial">${i+1}</text>
        <rect x="170" y="${y}" width="820" height="182" rx="23" fill="#1e293b" stroke="#334155"/>
        <text x="195" y="${y+53}" font-size="29" font-weight="bold" fill="#7dd3fc" font-family="Arial">${escapeSvg(s.heading.slice(0,40))}</text>
        <g transform="translate(195 ${y+98})"><text font-size="23" fill="#f1f5f9" font-family="Arial">${safeLines(s.body,48,2)}</text></g>`;
    }).join("\n");
  return shell(body,height,title);
}
