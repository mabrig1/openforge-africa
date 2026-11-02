/** Source-aligned formative checks. Every question comes from an existing public
 * short Academy review. No generative exam items, accreditation or secret answer bank.
 */
import type {AcademyCourseId} from "./academyDashboard.ts";
import {LOGIC_LESSONS} from "./logicCourse.ts";
import {PSY210_MODULES} from "./psy210Course.ts";
import {getExpansion} from "./academyExpansion.ts";
import {AIL101_UNITS,ailAnswerIndex} from "./ail101Course.ts";
import {getNewCourseUnits,newCourseCorrectIndex} from "./additionalAcademyCourses.ts";
import {SOUL_LESSONS,soulCorrectIndex} from "./integratedSoulCourse.ts";
import {CLEAR_SIGHT_UNITS,clearSightCorrectIndex} from "./clearSightCourse.ts";
import {SPEAKER_UNITS,speakerCorrectIndex} from "./multiChannelSpeakerCourse.ts";

export interface PracticeItem{
  stem:string;options:[string,string,string];answer:number;rationale:string;
}
export interface LessonCheck{
  courseId:AcademyCourseId;unitId:number;title:string;items:PracticeItem[];passMark:number;
}
const three=(correct:string,wrong:[string,string],position:number):[string,string,string]=>{
  const choices:[string,string,string]=["","",""];
  choices[position]=correct;
  const other=[0,1,2].filter(i=>i!==position);
  choices[other[0]]=wrong[0];choices[other[1]]=wrong[1];
  return choices;
};
const one=(stem:string,correct:string,wrong:[string,string],position:number,rationale:string):PracticeItem=>
  ({stem,options:three(correct,wrong,position),answer:position,rationale});
export function getLessonCheck(courseId:AcademyCourseId,unitId:number):LessonCheck{
  if(!Number.isInteger(unitId)||unitId<1)throw Error("Unknown lesson.");
  let title="",items:PracticeItem[]=[];
  if(courseId==="logic"){
    const item=LOGIC_LESSONS.find(u=>u.id===unitId);
    if(item){title=item.title;items=[{stem:item.question.stem,options:item.question.choices,
      answer:item.question.answer,rationale:item.overview}];}
  }else if(courseId==="psy210"){
    const item=PSY210_MODULES.find(u=>u.id===unitId);
    if(item){title=item.name;items=item.questions.map(q=>({
      stem:q.stem,options:q.options,answer:q.answer,rationale:q.rationale}));}
  }else if(courseId==="decision"||courseId==="forge"){
    const item=getExpansion(courseId).find(u=>u.id===unitId);
    if(item){title=item.title;items=[one(
      "Which principle best fits this lesson on "+item.title+"?",
      item.correct,item.distractors,unitId%3,item.reason)];}
  }else if(courseId==="ail101"){
    const item=AIL101_UNITS.find(u=>u.id===unitId);
    if(item){title=item.title;items=[one(item.question,item.correct,item.distractors,
      ailAnswerIndex(unitId),item.reason)];}
  }else if(courseId==="rlx101"||courseId==="ceai401"){
    const item=getNewCourseUnits(courseId).find(u=>u.id===unitId);
    if(item){title=item.title;items=[one(item.question,item.correct,item.incorrect,
      newCourseCorrectIndex(courseId,unitId),item.feedback)];}
  }else if(courseId==="soul"){
    const item=SOUL_LESSONS.find(u=>u.id===unitId);
    if(item){title=item.title;items=[one(item.question,item.correct,item.wrong,
      soulCorrectIndex(unitId),item.reason)];}
  }else if(courseId==="clearSight"){
    const item=CLEAR_SIGHT_UNITS.find(u=>u.id===unitId);
    if(item){title=item.title;items=[one(item.question,item.correct,item.wrong,
      clearSightCorrectIndex(unitId),item.reason)];}
  }else if(courseId==="speaker"){
    const item=SPEAKER_UNITS.find(u=>u.id===unitId);
    if(item){title=item.title;items=[one(item.question,item.correct,item.wrong,
      speakerCorrectIndex(unitId),item.reason)];}
  }
  if(!items.length)throw Error("No published formative question for this lesson.");
  return {courseId,unitId,title,items,passMark:items.length===3?2:1};
}
export function gradeCheck(check:LessonCheck,choices:number[]){
  if(choices.length!==check.items.length||
    !choices.every(x=>Number.isInteger(x)&&x>=0&&x<=2))
    throw Error("Answer every quiz question before submitting.");
  const score=check.items.reduce((n,q,i)=>n+Number(q.answer===choices[i]),0);
  return {score,total:check.items.length,passed:score>=check.passMark};
}
/** Three different course units, not three rephrasings of one question. */
export function getCourseAssessment(courseId:AcademyCourseId,totalUnits:number):LessonCheck{
  if(!Number.isInteger(totalUnits)||totalUnits<3)throw Error("Course must have at least three units.");
  const indices=[1,Math.floor((totalUnits+1)/2),totalUnits];
  const items=indices.map(id=>getLessonCheck(courseId,id).items[0]);
  return {courseId,unitId:0,title:"End-of-course formative assessment",
    items,passMark:2};
}
/** Only consecutive passed lessons unlock the next new lesson. Revisits remain possible. */
export function nextUnlockedUnit(total:number,isPassed:(id:number)=>boolean){
  for(let id=1;id<=total;id++)if(!isPassed(id))return id;
  return total+1;
}
