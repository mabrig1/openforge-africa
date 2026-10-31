import test from "node:test";
import assert from "node:assert/strict";
import {
  PSY210_TITLE,PSY210_ATTRIBUTION,PSY210_MODULES,psyProgress,validatePsy210,
} from "../lib/psy210Course.ts";

test("PSY 210 companion covers all six distinct modules and 14-week source schedule",()=>{
 assert.equal(validatePsy210(),true);
 assert.equal(PSY210_MODULES.length,6);
 assert.equal(PSY210_MODULES[0].weeks,"1–2");
 assert.equal(PSY210_MODULES.at(-1)?.weeks,"12–14");
 assert.match(PSY210_ATTRIBUTION,/CC BY 4\.0/);
 assert.match(PSY210_TITLE,/Psychology/);
 assert.ok(PSY210_MODULES.slice(0,5).every(m=>m.lessons.length===3));
});
test("twelve companion review questions have valid independent answer keys",()=>{
 const all=PSY210_MODULES.flatMap(m=>m.questions);
 assert.equal(all.length,12);
 for(const q of all){
  assert.equal(q.choices.length,4);
  assert.equal(new Set(q.choices).size,4);
  assert.ok(q.answer>=0&&q.answer<=3);
  assert.ok(q.why.length>25);
 }
});
test("independent course progress cannot be inflated by duplicate or nonexistent ids",()=>{
 assert.deepEqual(psyProgress([],[]),{done:0,total:6,percent:0});
 assert.deepEqual(psyProgress([1,1,9],[1,1,9]),{done:1,total:6,percent:17});
 assert.equal(psyProgress([1,2],[2]).done,1);
 assert.equal(psyProgress([1,2,3,4,5,6],[1,2,3,4,5,6]).done,6);
});
