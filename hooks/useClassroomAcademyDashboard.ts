/** Academy's ten existing offline progress stores: read-only integration for classroom. */
import {useLogicCourseProgress} from "../stores/logicCourseStore";
import {usePsy210Progress} from "../stores/psy210Store";
import {useExpandedCoursesProgress} from "../stores/expandedCoursesStore";
import {useAil101Progress} from "../stores/ail101Store";
import {useAdditionalAcademyProgress} from "../stores/additionalAcademyStore";
import {useSoulProgress} from "../stores/integratedSoulStore";
import {useClearSightProgress} from "../stores/clearSightStore";
import {useSpeakerProgress} from "../stores/multiChannelSpeakerStore";
import {getAcademyDashboard} from "../lib/academyDashboard";
export function useClassroomAcademyDashboard(){
 const l=useLogicCourseProgress(),p=usePsy210Progress(),e=useExpandedCoursesProgress();
 const a=useAil101Progress(),n=useAdditionalAcademyProgress(),s=useSoulProgress();
 const c=useClearSightProgress(),sp=useSpeakerProgress();
 return getAcademyDashboard({
  logicRead:l.read,logicPassed:l.passed,logicSelected:l.selected,
  psyRead:p.read,psyScores:p.scores,psySelected:p.selected,
  decisionRead:e.read.decision,decisionPassed:e.passed.decision,decisionSelected:e.selected.decision,
  forgeRead:e.read.forge,forgePassed:e.passed.forge,forgeSelected:e.selected.forge,
  ailRead:a.read,ailPassed:a.passed,ailSelected:a.selected,
  rlxRead:n.read.rlx101,rlxPassed:n.passed.rlx101,rlxSelected:n.selected.rlx101,
  ceaiRead:n.read.ceai401,ceaiPassed:n.passed.ceai401,ceaiSelected:n.selected.ceai401,
  soulRead:s.read,soulPassed:s.passed,soulSelected:s.selected,
  clearRead:c.read,clearPassed:c.passed,clearSelected:c.selected,
  speakerRead:sp.read,speakerPassed:sp.passed,speakerSelected:sp.selected,
 });
}
