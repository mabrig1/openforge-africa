import test from "node:test";
import assert from "node:assert/strict";
import {
  CAPSTONE_SECTIONS, CAPSTONE_RUBRIC, EMPTY_CAPSTONE, countWords,
  checkCapstone, capstoneExportText,
} from "../lib/capstoneGuide.ts";
test("chapter 23 requirements, word count and 100-point human rubric",()=>{
 assert.equal(CAPSTONE_SECTIONS.length,14);
 assert.equal(CAPSTONE_RUBRIC.reduce((n,[_k,p])=>n+p,0),100);
 const p=checkCapstone(EMPTY_CAPSTONE);
 assert.deepEqual([p.abstractTarget,p.manuscriptTarget,p.fieldsComplete],[false,false,0]);
 assert.equal(p.rubricTotal,100);
 assert.equal(p.checklistOnly,true);
 assert.equal(countWords("  two\n words  "),2);
});
test("draft readiness checks length but never invents academic grades",()=>{
 const draft={...EMPTY_CAPSTONE,question:"Is online tutoring equitable?",
   abstract:Array(160).fill("abstract").join(" "),
   reconstruction:Array(3100).fill("premise").join(" "),
   references:"Author, year, document",
   aiDisclosure:"No AI assistance was used."};
 const result=checkCapstone(draft);
 assert.equal(result.abstractTarget,true);
 assert.equal(result.manuscriptTarget,true);
 assert.ok(result.fieldsComplete<14);
 const exported=capstoneExportText(draft);
 assert.match(exported,/APPLIED REASONING CAPSTONE/);
 assert.match(exported,/No AI assistance was used/);
 assert.match(exported,/NOT assessed or awarded credit/);
 assert.doesNotMatch(exported,/FINAL GRADE/);
});
