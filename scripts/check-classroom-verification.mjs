/** Read-only synthetic classroom evaluation; no model calls, accounts or writes. */
import {verifyClassroom} from "../lib/classroomVerification.ts";
const report=verifyClassroom();
for(const p of report.probes)
 console.log((p.passed?"PASS ":"FAIL ")+p.id+": "+p.detail);
console.log("SYNTHETIC ONLY: "+JSON.stringify({
 agents:report.agentCount,courses:report.courseCount,reviews:report.courseReviewCount,
 teacherFirstRate:report.teacherFirstRate,
 unansweredRemainedOpen:report.questionUnresolvedOpenRate,
 executableRoleCoverage:report.roleDispatchRate,
 modelDrivenAgents:report.modelDrivenAgents,OpenMAICDeployed:report.deployedOpenMaic,
}));
if(!report.passed)process.exitCode=1;
