import test from "node:test";
import assert from "node:assert/strict";
import { buildAdvancedInfographicSvg, DIAGRAM_LAYOUTS } from "../lib/advancedDiagram.ts";
import { createStoryboard, buildInfographicSvg } from "../lib/explainVisual.ts";
const slides=createStoryboard("How learning works","First, read the notes. Next, ask a question. Finally, test what you learned.");
test("four distinct diagrams are complete safe SVG markup",()=>{
  assert.deepEqual(DIAGRAM_LAYOUTS,["cards","flow","timeline","comparison"]);
  const outputs=DIAGRAM_LAYOUTS.map(layout=>buildAdvancedInfographicSvg(slides,layout));
  assert.equal(new Set(outputs).size,4);
  assert.equal(outputs[0],buildInfographicSvg(slides));
  outputs.forEach(v=>{
    assert.match(v,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.ok(v.includes("</svg>"));
    assert.ok(v.length>1000);
  });
  assert.match(outputs[1],/<path d="M540/);
  assert.match(outputs[2],/<line x1="109"/);
  assert.match(outputs[3],/width="475"/);
});
test("diagram never embeds raw learner tags or onload attributes",()=>{
  const evil=[{heading:"<svg onload=alert('x')>",body:"<script>alert(1)</script> & important"},
    {heading:"<title>",body:"<foreignObject>"},];
  for(const layout of DIAGRAM_LAYOUTS) {
    const svg=buildAdvancedInfographicSvg(evil,layout);
    assert.ok(!svg.includes("<script>"));
    assert.ok(!svg.includes("<foreignObject>"));
    assert.doesNotMatch(svg, /<svg[^>]*onload\s*=/i);
    assert.match(svg,/&lt;/);
  }
  assert.throws(()=>buildAdvancedInfographicSvg([], "cards"));
  assert.throws(()=>buildAdvancedInfographicSvg(evil, "unknown" as any));
});
