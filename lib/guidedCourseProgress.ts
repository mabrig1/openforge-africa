/** Writes formative milestones back to each original Academy store.
 * Classroom does not create parallel/fictional course-completion records.
 */
import type {AcademyCourseId} from "./academyDashboard";
import {useLogicCourseProgress} from "../stores/logicCourseStore";
import {usePsy210Progress} from "../stores/psy210Store";
import {useExpandedCoursesProgress} from "../stores/expandedCoursesStore";
import {useAil101Progress} from "../stores/ail101Store";
import {useAdditionalAcademyProgress} from "../stores/additionalAcademyStore";
import {useSoulProgress} from "../stores/integratedSoulStore";
import {useClearSightProgress} from "../stores/clearSightStore";
import {useSpeakerProgress} from "../stores/multiChannelSpeakerStore";
import {gradeCheck,getLessonCheck,nextUnlockedUnit} from "./guidedLearning";

export function lessonPassed(course:AcademyCourseId,id:number):boolean{
 if(course==="logic"){const s=useLogicCourseProgress.getState();return s.read.includes(id)&&s.passed.includes(id);}
 if(course==="psy210"){const s=usePsy210Progress.getState();return s.read.includes(id)&&(s.scores[String(id)]??0)>=2;}
 if(course==="decision"||course==="forge"){
  const s=useExpandedCoursesProgress.getState();
  return s.read[course].includes(id)&&s.passed[course].includes(id);
 }
 if(course==="ail101"){const s=useAil101Progress.getState();return s.read.includes(id)&&s.passed.includes(id);}
 if(course==="rlx101"||course==="ceai401"){
  const s=useAdditionalAcademyProgress.getState();
  return s.read[course].includes(id)&&s.passed[course].includes(id);
 }
 if(course==="soul"){const s=useSoulProgress.getState();return s.read.includes(id)&&s.passed.includes(id);}
 if(course==="clearSight"){const s=useClearSightProgress.getState();return s.read.includes(id)&&s.passed.includes(id);}
 const s=useSpeakerProgress.getState();return s.read.includes(id)&&s.passed.includes(id);
}
export function unlockedLesson(course:AcademyCourseId,total:number){
 return nextUnlockedUnit(total,id=>lessonPassed(course,id));
}
export function recordGuidedQuiz(course:AcademyCourseId,id:number,choices:number[]):boolean{
 const check=getLessonCheck(course,id),result=gradeCheck(check,choices);
 if(!result.passed)return false;
 if(course==="logic"){
  const s=useLogicCourseProgress.getState();s.markRead(id);s.submitAnswer(id,choices[0]);s.select(id);
 }else if(course==="psy210"){
  const s=usePsy210Progress.getState();s.markRead(id);s.saveQuiz(id,choices);s.select(id);
 }else if(course==="decision"||course==="forge"){
  const s=useExpandedCoursesProgress.getState();s.markRead(course,id);s.passQuiz(course,id,choices[0]);s.select(course,id);
 }else if(course==="ail101"){
  const s=useAil101Progress.getState();s.markRead(id);s.passQuiz(id,choices[0]);s.select(id);
 }else if(course==="rlx101"||course==="ceai401"){
  const s=useAdditionalAcademyProgress.getState();s.markRead(course,id);s.passQuiz(course,id,choices[0]);s.select(course,id);
 }else if(course==="soul"){
  const s=useSoulProgress.getState();s.markRead(id);s.passQuiz(id,choices[0]);s.select(id);
 }else if(course==="clearSight"){
  const s=useClearSightProgress.getState();s.markRead(id);s.passQuiz(id,choices[0]);s.select(id);
 }else{
  const s=useSpeakerProgress.getState();s.markRead(id);s.passQuiz(id,choices[0]);s.select(id);
 }
 return lessonPassed(course,id);
}
