import test from "node:test";
import assert from "node:assert/strict";
import {forgeEvidenceChecklist,forgeEvidenceDossier,FORGE_REVIEW_GATES} from "../lib/forgeEvidenceDossier.ts";
test("FS101 dossier follows exactly 10 syllabus weekly artefacts and five independent mentor gates",()=>{
 const x=forgeEvidenceChecklist({});
 assert.equal(x.weeks.length,10);
 assert.equal(x.links,0);assert.equal(x.noLinks,10);
 assert.equal(FORGE_REVIEW_GATES.length,5);
 assert.ok(x.weeks.every(w=>w.needsHumanReview===true));
 assert.match(x.weeks[7].requiredProof,/user count/);
});
test("link coverage is merely preparatory, never proof or a fake course award",()=>{
 const data={"1":{url:"https://example.org/mock-work",note:"Fictional class exercise: for review."},
 "8":{url:"https://example.org/demo",note:"Do not claim ten users."}};
 const r=forgeEvidenceChecklist(data);
 assert.equal(r.links,2);assert.equal(r.notes,2);
 const report=forgeEvidenceDossier(data);
 assert.match(report,/2 of 10 weekly link fields/);
 assert.match(report,/Human reviewers should check/);
 assert.match(report,/NONE VERIFIED BY OPENFORGE/);
 assert.match(report,/NOT AN OFFICIAL SUBMISSION/);
 assert.ok(report.includes("WEEK 10:"));
 assert.ok(report.includes("Student-provided URL (UNVERIFIED): https://example.org/mock-work"));
});
test("invalid links and untrusted evidence fields are dropped from export",()=>{
 const data={"1":{url:"javascript:alert(1)",note:"ok"},
  "2":{url:"https://alice:pass@example.org/foo",note:"A".repeat(2000)},
  "3":{url:"http://example.org/",note:33},
  "4":{url:"https://example.org/valid",note:"B".repeat(1001)}};
 const r=forgeEvidenceChecklist(data);
 assert.equal(r.links,1);assert.equal(r.notes,3);
 assert.ok(r.weeks[1].note.length<=1000);
 assert.ok(!forgeEvidenceDossier(data).includes("javascript:alert"));
 assert.ok(!forgeEvidenceDossier(data).includes("alice:pass"));
});
