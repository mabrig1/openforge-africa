/** Chapter 23 practice worksheet derived from the author's 2026 textbook.
 * Local self-assessment only. This cannot verify facts, originality or academic credit.
 */
export const CAPSTONE_SECTIONS = [
  {key:"title",label:"Project title",hint:"Narrow, researchable claim or problem."},
  {key:"abstract",label:"Executive abstract",hint:"150–250 words summarizing question, evidence, objections and qualified judgment."},
  {key:"question",label:"Exact research question and scope",hint:"Define population, setting, period and disputed claim."},
  {key:"definitions",label:"Definitions and conceptual distinctions",hint:"Clarify contested terms, scope, necessary and sufficient conditions."},
  {key:"searchMethod",label:"Evidence search and source appraisal",hint:"Search terms, dates, inclusion rules, credibility, limitations and original links."},
  {key:"reconstruction",label:"Argument reconstruction and map",hint:"Premises, conclusions, warrants and linked/convergent support."},
  {key:"alternatives",label:"Competing explanations or policy options",hint:"Fairly present the strongest rival interpretation."},
  {key:"objections",label:"Objections, replies and limits",hint:"Respond to serious counterarguments and note uncertainty."},
  {key:"recommendation",label:"Recommendation and implementation",hint:"Give proportionate conclusions, constraints and a testable next step."},
  {key:"references",label:"Verifiable references",hint:"Cite original sources accurately; never invent details."},
  {key:"formalization",label:"Formalization or reason not to formalize",hint:"Show a valid formal translation, or explain why symbols would oversimplify."},
  {key:"oralDefense",label:"6–10-minute oral defense plan",hint:"90-second thesis, strongest opposing argument, supporting evidence and two anticipated questions."},
  {key:"aiDisclosure",label:"AI assistance and integrity disclosure",hint:"Specify tools, scope and verification of any generated content. State none if none used."},
  {key:"reflection",label:"Exit reflection",hint:"Compare the argument with an earlier belief and explain any revision."},
] as const;
export type CapstoneKey = typeof CAPSTONE_SECTIONS[number]["key"];
export type CapstoneDraft = Record<CapstoneKey,string>;
export const EMPTY_CAPSTONE:CapstoneDraft = Object.fromEntries(
  CAPSTONE_SECTIONS.map(s=>[s.key,""])) as CapstoneDraft;
export const CAPSTONE_RUBRIC = [
  ["Question and scope",10],
  ["Accurate reconstruction",15],
  ["Quality and handling of evidence",20],
  ["Logical rigor",20],
  ["Alternatives and objections",15],
  ["Written clarity and referencing",10],
  ["Oral defense",10],
] as const;
export function countWords(text:string):number{
  return text.trim()?text.trim().split(/\s+/u).filter(Boolean).length:0;
}
export function checkCapstone(draft:CapstoneDraft) {
  const writtenSections:CapstoneKey[]=[
    "abstract","question","definitions","searchMethod","reconstruction",
    "alternatives","objections","recommendation","references","formalization",
  ];
  const writtenWords=writtenSections.reduce((n,key)=>n+countWords(draft[key]??""),0);
  const abstractWords=countWords(draft.abstract??"");
  const fieldsComplete=CAPSTONE_SECTIONS.filter(s=>
    countWords(draft[s.key]??"")>=3).length;
  const rubricTotal=CAPSTONE_RUBRIC.reduce((s,[_label,points])=>s+points,0);
  return {
    writtenWords, abstractWords, fieldsComplete, fieldCount:CAPSTONE_SECTIONS.length,
    abstractTarget:abstractWords>=150&&abstractWords<=250,
    manuscriptTarget:writtenWords>=3000&&writtenWords<=5000,
    rubricTotal,
    // Text fields are a checklist, NOT a grade or independent evaluation.
    checklistOnly:true as const,
  };
}
export function capstoneExportText(draft:CapstoneDraft):string {
  return [
    "OPENFORGE AFRICA — APPLIED REASONING CAPSTONE",
    "Author's course: Mabrig Korie, Logic and Critical Thinking (2026), Chapter 23",
    "Independent practice draft • NOT assessed or awarded credit",
    "",
    ...CAPSTONE_SECTIONS.flatMap(s=>[
      s.label.toUpperCase(),"",draft[s.key]?.trim()||"[Not yet completed]","",
    ]),
    "RUBRIC (FOR HUMAN REVIEW ONLY)",
    ...CAPSTONE_RUBRIC.map(([name,points])=>name+": "+points+" points"),
    "",
    "Integrity notice: Check citations, originality, consent and all factual claims.",
  ].join("\n");
}
