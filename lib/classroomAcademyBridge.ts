/**
 * Explicit course selection bridge for ten pre-existing public short reviews.
 * Does NOT read or publish any owner's private full-length manuscripts.
 * The learner must affirm the review before it can be used by the classroom.
 */
import {LOGIC_LESSONS} from "./logicCourse.ts";
import {PSY210_MODULES,PSY210_ATTRIBUTION} from "./psy210Course.ts";
import {getExpansion} from "./academyExpansion.ts";
import {AIL101_UNITS} from "./ail101Course.ts";
import {getNewCourseUnits,NEW_COURSE_META} from "./additionalAcademyCourses.ts";
import {SOUL_LESSONS} from "./integratedSoulCourse.ts";
import {CLEAR_SIGHT_UNITS} from "./clearSightCourse.ts";
import {SPEAKER_UNITS} from "./multiChannelSpeakerCourse.ts";
import {ACADEMY_COURSE_META,type AcademyCourseId,
 type AcademyCourseSummary} from "./academyDashboard.ts";
import type {ClassroomSource} from "./openMaicClassroom.ts";

export interface AcademyClassroomReview {
 courseId:AcademyCourseId;code:string;title:string;
 unitId:number;unitTitle:string;source:ClassroomSource;
 attribution:string;route:AcademyCourseSummary["route"];
 completed:boolean;percent:number;
}

interface ReviewEntry{id:number;title:string;overview:string;practice:string}
const entry=(id:number,title:string,overview:string,practice:string):ReviewEntry=>
 ({id,title,overview,practice});
function units(course:AcademyCourseId):ReviewEntry[]{
 switch(course){
  case "logic":return LOGIC_LESSONS.map(u=>entry(u.id,u.title,u.overview,u.workedExample));
  case "psy210":return PSY210_MODULES.map(u=>entry(u.id,u.name,u.overview,u.practice));
  case "decision":case "forge":return getExpansion(course)
    .map(u=>entry(u.id,u.title,u.overview,u.application));
  case "ail101":return AIL101_UNITS.map(u=>entry(u.id,u.title,u.overview,u.application));
  case "rlx101":case "ceai401":return getNewCourseUnits(course)
    .map(u=>entry(u.id,u.title,u.overview,u.task));
  case "soul":return SOUL_LESSONS.map(u=>entry(u.id,u.title,u.overview,u.exercise));
  case "clearSight":return CLEAR_SIGHT_UNITS.map(u=>entry(u.id,u.title,u.overview,u.task));
  case "speaker":return SPEAKER_UNITS.map(u=>entry(u.id,u.title,u.overview,u.exercise));
 }
}
function attribution(id:AcademyCourseId):string{
 if(id==="psy210")return PSY210_ATTRIBUTION;
 if(id==="rlx101"||id==="ceai401")return NEW_COURSE_META[id].source+
  ". Public short original companion review only; no private manuscript.";
 if(id==="logic")return "Mabrig Korie, Logic and Critical Thinking (2026), public short review.";
 return ACADEMY_COURSE_META[id].title+
  " — OpenForge Academy public short source-aligned review. No private textbook reproduced.";
}
export function academyCourseReview(
 course:AcademyCourseSummary,unitId?:number):AcademyClassroomReview{
 const all=units(course.id);
 if(!all.length)throw new Error("No public review for this course.");
 const target=unitId??(course.next.number||all[0].id);
 const selected=all.find(u=>u.id===target);
 if(!selected)throw new Error("Unknown course review; choose a unit from this course.");
 const notes=[
  "Course: "+course.title+" ("+course.code+").",
  "Unit "+selected.id+": "+selected.title+".",
  "Public review: "+selected.overview,
  "Independent application (not a grade): "+selected.practice,
 ].join("\n\n");
 return {
  courseId:course.id,code:course.code,title:course.title,unitId:selected.id,
  unitTitle:selected.title,attribution:attribution(course.id),route:course.route,
  completed:course.next.number===0,percent:course.percent,
  source:{id:"review_"+course.id+"_"+selected.id,
   title:course.code+" — "+selected.title,content:notes},
 };
}
export function listAcademyClassroomUnits(courseId:AcademyCourseId):{
 id:number;title:string}[]{
 return units(courseId).map(u=>({id:u.id,title:u.title}));
}
export function academyCourseExists(id:string):id is AcademyCourseId{
 return Object.prototype.hasOwnProperty.call(ACADEMY_COURSE_META,id);
}
