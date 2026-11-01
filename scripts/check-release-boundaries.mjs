/** Release privacy gate: do not accidentally commit full source manuscripts or
 * production secrets to the PUBLIC OpenForge repository.
 * This conservative check cannot prove content licensing or data privacy.
 */
import {execFileSync} from "node:child_process";
const tracked=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);
const privateArtifact=/\.(docx?|pdf|pptx?|xlsx?|odt|rtf|epub|mobi|p12|pfx|pem|key)$/i;
const sensitiveFile=/(^|\/)\.env(?:\.[^/]+)?$/i;
const allowedSample=/(^|\/)\.env\.(?:example|sample|template)$/i;
const forbidden=tracked.filter(path=>privateArtifact.test(path)||
    (sensitiveFile.test(path)&&!allowedSample.test(path))||
    /(^|\/)(?:private-manuscripts|student-records|user-uploads)\//i.test(path));
if(forbidden.length){
 console.error("RELEASE BLOCKED: potentially private tracked files:\n"+forbidden.join("\n"));
 process.exitCode=1;
}else{
 console.log("PASS: no tracked manuscript binary, private-data directory or live .env filename.");
 console.log("This does NOT replace owner permissions, source-content review, credential scans or student privacy tests.");
}
