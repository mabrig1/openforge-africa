/** Discovery content taxonomy: original OpenForge presentation metadata.
 * Source of truth for course titles/routes and real progress is academyDashboard.
 * No claims of enrollment, earned credentials or verified AI inference.
 */
import type {AcademyCourseId,AcademyCourseSummary} from "./academyDashboard";

export type DiscoveryCategory="All courses"|"AI & technology"|"Thinking & research"|"People & purpose"|"Communication";
export const DISCOVERY_CATEGORIES:DiscoveryCategory[]=[
 "All courses","AI & technology","Thinking & research","People & purpose","Communication",
];
export interface DiscoverySkin{
 category:Exclude<DiscoveryCategory,"All courses">;
 description:string;
 icon:string;
 color:string;
 tint:string;
 index:string;
}
export const DISCOVERY_SKINS:Record<AcademyCourseId,DiscoverySkin>={
 logic:{category:"Thinking & research",description:"Train your thinking. Question assumptions, reason with confidence.",icon:"lightbulb-on-outline",color:"#D97706",tint:"#FEF3C7",index:"01"},
 psy210:{category:"People & purpose",description:"Explore what shapes behavior in a rapidly changing AI world.",icon:"head-cog-outline",color:"#7C3AED",tint:"#EDE9FE",index:"02"},
 decision:{category:"Thinking & research",description:"Combine human judgment, logic and smarter decision tools.",icon:"brain",color:"#4338CA",tint:"#E0E7FF",index:"03"},
 forge:{category:"Thinking & research",description:"Turn ambitious ideas into questions, evidence and useful work.",icon:"hammer-wrench",color:"#0369A1",tint:"#DBEAFE",index:"04"},
 ail101:{category:"AI & technology",description:"Learn to work thoughtfully and productively alongside AI.",icon:"robot-outline",color:"#0F766E",tint:"#CCFBF1",index:"05"},
 rlx101:{category:"People & purpose",description:"Study relationships, trust and human-AI connections.",icon:"account-heart-outline",color:"#BE185D",tint:"#FCE7F3",index:"06"},
 ceai401:{category:"AI & technology",description:"Explore responsible computation and plant research methods.",icon:"sprout-outline",color:"#15803D",tint:"#DCFCE7",index:"07"},
 soul:{category:"People & purpose",description:"Reflect on philosophy, psychology and Christian formation.",icon:"hands-pray",color:"#C2410C",tint:"#FFEDD5",index:"08"},
 clearSight:{category:"People & purpose",description:"Develop stronger discernment through evidence and reflection.",icon:"eye-check-outline",color:"#7C3AED",tint:"#F3E8FF",index:"09"},
 speaker:{category:"Communication",description:"Build confident communication across written, video and live formats.",icon:"microphone-variant",color:"#BE123C",tint:"#FFE4E6",index:"10"},
};
export function filterDiscoveryCourses(
 courses:ReadonlyArray<AcademyCourseSummary>,
 query:string,category:DiscoveryCategory="All courses",
):AcademyCourseSummary[]{
 const needle=query.trim().toLocaleLowerCase();
 return courses.filter(course=>{
  const skin=DISCOVERY_SKINS[course.id];
  if(!skin||(category!=="All courses"&&skin.category!==category))return false;
  if(!needle)return true;
  return [course.title,course.code,skin.description,skin.category]
   .some(value=>value.toLocaleLowerCase().includes(needle));
 });
}
export function chooseNextDiscoveryCourse(courses:ReadonlyArray<AcademyCourseSummary>):
 AcademyCourseSummary|undefined{
 return courses.find(c=>c.completed>0&&c.completed<c.total)
  ??courses.find(c=>c.completed<c.total)
  ??courses[0];
}
