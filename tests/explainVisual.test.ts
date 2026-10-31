import test from "node:test";
import assert from "node:assert/strict";
import { buildInfographicSvg, createStoryboard, escapeSvg, wrapWords } from "../lib/explainVisual.ts";
import { getStudioDraft, setStudioDraft, clearStudioDraft } from "../lib/studioDraft.ts";

test("generates a finite storyboard and real SVG, with escaped user content",()=>{
  const slides=createStoryboard("Why <offline> works & when", 
    "Students can download notes locally. Then they can take a practice quiz. Finally they can reflect on progress.");
  assert.equal(slides.length,4);
  assert.equal(slides[0].heading,"Why <offline> works & when");
  const svg=buildInfographicSvg(slides);
  assert.match(svg,/xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(svg,/&lt;offline&gt;/);
  assert.match(svg,/&amp;/);
  assert.doesNotMatch(svg,/<offline>/);
  assert.ok(svg.length>2000);
  assert.equal((svg.match(/<rect x="50"/g)||[]).length,slides.length);
});

test("escapes markup and bounds the number of frames",()=>{
  assert.equal(escapeSvg(`<x a="b">'&</x>`),
    "&lt;x a=&quot;b&quot;&gt;&apos;&amp;&lt;/x&gt;");
  const s=createStoryboard("Topic","Sentence one exists. Sentence two exists. Sentence three exists. Sentence four exists. Sentence five exists. Sentence six exists.");
  assert.equal(s.length,6);
  assert.ok(wrapWords("A ".repeat(500),10,3).length<=3);
  assert.equal(createStoryboard("","").length,2);
});

test("draft for visual studio stays in memory with bounds and no storage",()=>{
  clearStudioDraft();
  setStudioDraft("a".repeat(500),"b".repeat(5000));
  const copy=getStudioDraft();
  assert.equal(copy.title.length,120);
  assert.equal(copy.body.length,4000);
  copy.body="mutated";
  assert.equal(getStudioDraft().body.length,4000);
  clearStudioDraft();
  assert.equal(getStudioDraft().body,"");
});
