import test from "node:test";
import assert from "node:assert/strict";
import {chooseNextDiscoveryCourse,DISCOVERY_CATEGORIES,DISCOVERY_SKINS,filterDiscoveryCourses} from "../lib/discoveryCatalog.ts";
import type {AcademyCourseSummary} from "../lib/academyDashboard.ts";
const fake=(id:AcademyCourseSummary["id"],title:string,code:string,completed=0,total=10)=>({
 id,title,code,completed,total,percent:Math.round(completed*100/total),
 route:"/academy",read:completed,practised:completed,notice:"",
 next:{number:1,title:"Start here",action:"Read and study",detail:""} 
}) as AcademyCourseSummary;
const courses=[
 fake("logic","Logic and Critical Thinking","LCT DEMO"),
 fake("psy210","Psychology in the Age of AI","PSY 210"),
 fake("speaker","The Multi-Channel Speaker","SPEAK SELF-STUDY",3),
 fake("ail101","AI Literacy and Human–AI Collaboration","AIL 101",2),
 fake("rlx101","Foundations of Relationalics","RLX 101"),
];
test("every real Academy id has distinct design metadata; categories are stable",()=>{
 assert.equal(Object.keys(DISCOVERY_SKINS).length,10);
 assert.equal(new Set(Object.values(DISCOVERY_SKINS).map(s=>s.index)).size,10);
 assert.equal(DISCOVERY_CATEGORIES.length,5);
});
test("discovery search is functional, trimmed and case-insensitive",()=>{
 assert.deepEqual(filterDiscoveryCourses(courses,"  RELATIONAl  ").map(c=>c.id),["rlx101"]);
 assert.deepEqual(filterDiscoveryCourses(courses,"PSY 210").map(c=>c.id),["psy210"]);
 assert.deepEqual(filterDiscoveryCourses(courses,"reason").map(c=>c.id),["logic"]);
 assert.equal(filterDiscoveryCourses(courses,"unfindable").length,0);
 assert.equal(filterDiscoveryCourses(courses,"").length,5);
});
test("category filters combine with search rather than show decorative chips",()=>{
 assert.deepEqual(filterDiscoveryCourses(courses,"","Communication").map(c=>c.id),["speaker"]);
 assert.deepEqual(filterDiscoveryCourses(courses,"","AI & technology").map(c=>c.id),["ail101"]);
 assert.equal(filterDiscoveryCourses(courses,"psychology","AI & technology").length,0);
});
test("continue learning selects real partial progress, then first unfinished course",()=>{
 assert.equal(chooseNextDiscoveryCourse(courses)?.id,"speaker");
 const fresh=courses.map(c=>({...c,completed:0}));
 assert.equal(chooseNextDiscoveryCourse(fresh)?.id,"logic");
 const complete=courses.map(c=>({...c,completed:c.total}));
 assert.equal(chooseNextDiscoveryCourse(complete)?.id,"logic");
});
