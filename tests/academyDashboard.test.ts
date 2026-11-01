import test from "node:test";
import assert from "node:assert/strict";
import {
 getAcademyDashboard,academyWeeklySessions,localCalendarDay,
 weekStartMonday,sanitizeAcademySessions,
} from "../lib/academyDashboard.ts";
const blank={
 logicRead:[],logicPassed:[],logicSelected:1,
 psyRead:[],psyScores:{},psySelected:1,
 decisionRead:[],decisionPassed:[],decisionSelected:1,
 forgeRead:[],forgePassed:[],forgeSelected:1,
};
test("catalog combines 23 logic, 6 psychology, 20 decision and 10 Forge milestones without falsely counting unfinished study",()=>{
 const s=getAcademyDashboard(blank);
 assert.deepEqual([s.completed,s.total,s.percent],[0,79,0]);
 assert.equal(s.courses.length,5);
 assert.equal(s.courses[4].total,20);
 assert.equal(s.courses[4].route,"/ail101");
 assert.equal(s.courses[2].total,20);
 assert.equal(s.courses[3].total,10);
 assert.equal(s.courses[2].route,"/decision-science");
 assert.equal(s.courses[3].route,"/forge-studies");
 assert.equal(s.courses[0].next.number,1);
 assert.equal(s.courses[1].next.number,1);
 assert.equal(s.courses[0].route,"/course");
 assert.equal(s.courses[1].route,"/psychology-course");
 assert.match(s.courses[0].notice,/private full-text/);
});
test("marks only read AND successful formative practice; distinguishes missing components",()=>{
 const s=getAcademyDashboard({
  ...blank,logicRead:[1,2],logicPassed:[2,3],logicSelected:2,
  psyRead:[1,3],psyScores:{"1":2,"2":3,"3":1},psySelected:1,
 });
 assert.equal(s.courses[0].completed,1);
 assert.equal(s.courses[0].next.number,1);
 assert.equal(s.courses[0].next.action,"Complete practice check");
 assert.equal(s.courses[1].completed,1);
 assert.equal(s.courses[1].next.number,2);
 assert.equal(s.courses[1].next.action,"Mark reading reviewed");
 const needsReview=getAcademyDashboard({
  ...blank,psyRead:[1,3],psyScores:{"1":2,"2":3,"3":1},
  psySelected:3,
 }).courses[1];
 assert.equal(needsReview.next.number,3);
 assert.equal(needsReview.next.action,"Review or retake quiz");
 assert.equal(s.completed,2);
});
test("invalid duplicate and out-of-range counts cannot inflate progress",()=>{
 const data=getAcademyDashboard({
  ...blank,logicRead:[1,1,-4,333,2],logicPassed:[1,1,999],
  psyRead:[1,1,2,7],psyScores:{"1":2,"2":999,"3":-1},
 });
 assert.equal(data.courses[0].read,2);
 assert.equal(data.courses[0].completed,1);
 assert.equal(data.courses[1].read,2);
 assert.equal(data.courses[1].completed,1);
 assert.equal(data.completed,2);
});
test("both courses complete only with all respective course milestones",()=>{
 const data=getAcademyDashboard({
  ...blank,logicRead:Array.from({length:23},(_,i)=>i+1),
  logicPassed:Array.from({length:23},(_,i)=>i+1),
  psyRead:[1,2,3,4,5,6],psyScores:{"1":2,"2":3,"3":2,"4":2,"5":2,"6":2},
 });
 assert.deepEqual([data.completed,data.total,data.percent],[29,79,37]);
 assert.equal(data.courses[0].next.number,0);
 assert.equal(data.courses[1].next.action,"Explore independently");
});
test("week-start Monday handles Sunday, month boundary and invalid date without local UTC shift",()=>{
 assert.equal(weekStartMonday("2026-11-01"),"2026-10-26");
 assert.equal(weekStartMonday("2026-11-02"),"2026-11-02");
 assert.equal(weekStartMonday("2026-03-01"),"2026-02-23");
 assert.throws(()=>weekStartMonday("2026-02-30"));
 const day=localCalendarDay(new Date(2026,10,1,5,30));
 assert.equal(day,"2026-11-01");
});
test("weekly study log is bounded, deduplicated and rejects future, forged or impossible dates",()=>{
 const rows=[
  {day:"2026-11-01",course:"logic"},
  {day:"2026-11-01",course:"logic"},
  {day:"2026-11-01",course:"psy210"},
  {day:"2026-10-26",course:"logic"},
  {day:"2026-10-25",course:"logic"},
  {day:"2026-11-02",course:"psy210"},
  {day:"2026-02-30",course:"logic"},
  {day:"2026-11-01",course:"injected"},
  {day:"none",course:"logic"}
 ];
 const valid=sanitizeAcademySessions(rows,"2026-11-01");
 assert.equal(valid.length,4);
 const thisWeek=academyWeeklySessions(rows,"2026-11-01");
 assert.deepEqual(thisWeek,{
  count:3,activeDays:2,byCourse:{logic:2,psy210:1,decision:0,forge:0,ail101:0}
 });
 assert.deepEqual(academyWeeklySessions([{day:"2026-11-01",course:"logic"}],"2026-11-02"),
  {count:0,activeDays:0,byCourse:{logic:0,psy210:0,decision:0,forge:0,ail101:0}});
});

test("new decision and Forge weekly review milestones count only when read and practised",()=>{
 const s=getAcademyDashboard({...blank,
   decisionRead:[1,2,4],decisionPassed:[1,3],decisionSelected:2,
   forgeRead:[1,2,11],forgePassed:[2,5],forgeSelected:1,
 });
 assert.equal(s.total,79);
 assert.equal(s.courses[2].completed,1);
 assert.equal(s.courses[3].completed,1);
 assert.equal(s.courses[2].next.number,2);
 assert.equal(s.courses[2].next.action,"Review or retake quiz");
 assert.equal(s.courses[3].next.number,1);
 assert.equal(s.courses[3].next.action,"Review or retake quiz");
 assert.equal(s.completed,2);
});
test("all five subjects reaching independent self-study mastery is 79 of 79, but not academic credit",()=>{
 const a=getAcademyDashboard({...blank,
  logicRead:Array.from({length:23},(_,i)=>i+1),
  logicPassed:Array.from({length:23},(_,i)=>i+1),
  psyRead:[1,2,3,4,5,6],psyScores:Object.fromEntries([1,2,3,4,5,6].map(i=>[String(i),2])),
  decisionRead:Array.from({length:20},(_,i)=>i+1),
  decisionPassed:Array.from({length:20},(_,i)=>i+1),
  forgeRead:Array.from({length:10},(_,i)=>i+1),
  forgePassed:Array.from({length:10},(_,i)=>i+1),
  ailRead:Array.from({length:20},(_,i)=>i+1),
  ailPassed:Array.from({length:20},(_,i)=>i+1),
 });
 assert.deepEqual([a.completed,a.total,a.percent],[79,79,100]);
 assert.ok(a.courses.every(c=>c.next.action==="Explore independently"));
 assert.match(a.courses[3].next.detail,/unverified/);
});
test("weekly calendar includes decision, Forge and AI Literacy, not only earlier courses",()=>{
 const t=academyWeeklySessions([{day:"2026-11-01",course:"decision"},{day:"2026-11-01",course:"forge"}],"2026-11-01");
 assert.deepEqual(t,{count:2,activeDays:1,byCourse:{logic:0,psy210:0,decision:1,forge:1,ail101:0}});
});

test("AI literacy's 20 units require reading and a successful formative check; invalid data cannot inflate progress",()=>{
 const a=getAcademyDashboard({...blank,
  ailRead:[1,1,2,88],ailPassed:[2,2,99],ailSelected:1
 });
 assert.equal(a.total,79);
 assert.equal(a.courses[4].read,2);
 assert.equal(a.courses[4].completed,1);
 assert.equal(a.courses[4].next.number,1);
 assert.equal(a.courses[4].next.action,"Review or retake quiz");
 assert.equal(a.courses[4].route,"/ail101");
 const b=academyWeeklySessions([{day:"2026-11-01",course:"ail101"}],"2026-11-01");
 assert.equal(b.byCourse.ail101,1);
});
