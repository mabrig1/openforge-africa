/** Offline-only propositional logic evaluator for Chapters 8–11 of Mabrig Korie (2026).
 * A bounded recursive-descent parser, not eval(), an LLM, or a full theorem prover.
 * Supported atoms: P, Q, R, S. ASCII ~ & | -> <->; Unicode ¬ ∧ ∨ → ⇔.
 */
type SymbolName = "P" | "Q" | "R" | "S";
type Connective = "~" | "&" | "|" | "->" | "<->";
export type Formula =
  | { kind:"atom"; name:SymbolName }
  | { kind:"not"; item:Formula }
  | { kind:"binary"; op:Exclude<Connective,"~">; left:Formula; right:Formula };
type Tok = { value:string; index:number };

export interface LogicRow {
  assignment: Record<SymbolName,boolean>;
  results: boolean[];
  result:boolean;
  invalidating:boolean;
}
export interface LogicAnalysis {
  variables:SymbolName[];
  expressions:string[];
  rows:LogicRow[];
  mode:"formula"|"argument";
  classification?: "tautology"|"contradiction"|"contingency";
  valid?:boolean;
  counterexample?:LogicRow;
  explanation:string;
}

function normalize(text:string) {
  return text.replace(/¬/g,"~").replace(/∧/g,"&").replace(/∨/g,"|")
    .replace(/⇔|↔/g,"<->").replace(/→/g,"->");
}
function lex(input:string):Tok[] {
  if(input.length>160)throw new Error("Use no more than 160 characters per formula.");
  const text=normalize(input);const tokens:Tok[]=[];
  for(let i=0;i<text.length;){
    if(/\s/.test(text[i])){i++;continue;}
    const index=i;const rest=text.slice(i);
    const match=rest.match(/^(<->|->|[PQRS]|[()~&|])/);
    if(!match)throw new Error("Unsupported symbol at position "+(i+1)+". Use P, Q, R, S and ~ & | -> <->.");
    tokens.push({value:match[0],index});
    i+=match[0].length;
    if(tokens.length>100)throw new Error("Formula is too complex for this practice tool.");
  }
  if(tokens.length===0)throw new Error("Enter a formula such as P -> Q.");
  return tokens;
}
export function parseFormula(input:string):Formula {
  const tokens=lex(input);let pos=0;
  const consume=(val:string)=>{if(tokens[pos]?.value===val){pos++;return true;}return false;};
  const parseAtom=():Formula=>{
    const tok=tokens[pos];
    if(!tok)throw new Error("Formula ended unexpectedly. Check the operators.");
    if(consume("~"))return {kind:"not",item:parseAtom()};
    if(consume("(")){
      const inside=parseEquiv();
      if(!consume(")"))throw new Error("Missing closing parenthesis.");
      return inside;
    }
    if(/^[PQRS]$/.test(tok.value)){pos++;return {kind:"atom",name:tok.value as SymbolName};}
    throw new Error("Unexpected symbol at position "+(tok.index+1)+".");
  };
  const parseAnd=():Formula=>{
    let node=parseAtom();
    while(consume("&"))node={kind:"binary",op:"&",left:node,right:parseAtom()};
    return node;
  };
  const parseOr=():Formula=>{
    let node=parseAnd();
    while(consume("|"))node={kind:"binary",op:"|",left:node,right:parseAnd()};
    return node;
  };
  const parseImplies=():Formula=>{
    const node=parseOr();
    return consume("->")?{kind:"binary",op:"->",left:node,right:parseImplies()}:node;
  };
  const parseEquiv=():Formula=>{
    let node=parseImplies();
    while(consume("<->"))node={kind:"binary",op:"<->",left:node,right:parseImplies()};
    return node;
  };
  const formula=parseEquiv();
  if(pos!==tokens.length)throw new Error("Unexpected trailing symbol near position "+(tokens[pos].index+1)+".");
  return formula;
}
function atoms(formula:Formula, out:Set<SymbolName>):void {
  if(formula.kind==="atom"){out.add(formula.name);return;}
  if(formula.kind==="not"){atoms(formula.item,out);return;}
  atoms(formula.left,out);atoms(formula.right,out);
}
export function evaluateFormula(formula:Formula, values:Record<SymbolName,boolean>):boolean {
  if(formula.kind==="atom")return !!values[formula.name];
  if(formula.kind==="not")return !evaluateFormula(formula.item,values);
  const l=evaluateFormula(formula.left,values);
  const r=evaluateFormula(formula.right,values);
  switch(formula.op){
    case "&":return l&&r;
    case "|":return l||r;
    case "->":return !l||r;
    case "<->":return l===r;
  }
}
function valuations(vars:SymbolName[]) {
  const rows:Record<SymbolName,boolean>[]=[];
  for(let mask=(1<<vars.length)-1;mask>=0;mask--){
    const v={P:false,Q:false,R:false,S:false};
    vars.forEach((name,index)=>v[name]=!!(mask&(1<<(vars.length-index-1))));
    rows.push(v);
  }
  return rows;
}
export function analyzeLogic(formulaText:string, premiseTexts:string[]=[]):LogicAnalysis {
  const premiseInputs=premiseTexts.map(s=>s.trim()).filter(Boolean);
  if(premiseInputs.length>4)throw new Error("Use at most four premises.");
  const target=formulaText.trim();
  if(!target)throw new Error("Enter a conclusion or formula.");
  const all=[...premiseInputs,target];
  const parsed=all.map(parseFormula);
  const vars=new Set<SymbolName>();parsed.forEach(ast=>atoms(ast,vars));
  const variables=[...vars].sort() as SymbolName[];
  if(!variables.length||variables.length>4)throw new Error("Use 1–4 letters (P, Q, R, S).");
  const mode=premiseInputs.length?"argument":"formula";
  const rows=valuations(variables).map(assignment=>{
    const outputs=parsed.map(ast=>evaluateFormula(ast,assignment));
    const premises=outputs.slice(0,-1);
    const result=outputs[outputs.length-1];
    return {assignment,results:premises,result,invalidating:mode==="argument"&&premises.every(Boolean)&&!result};
  });
  if(mode==="formula"){
    const yes=rows.filter(row=>row.result).length;
    const classification=yes===rows.length?"tautology":yes===0?"contradiction":"contingency";
    return {variables,expressions:all,rows,mode,classification,
      explanation:classification==="tautology"?"The formula is true on every valuation.":
      classification==="contradiction"?"The formula is false on every valuation.":
      "The formula is true on some valuations and false on others."};
  }
  const counterexample=rows.find(row=>row.invalidating);
  return {variables,expressions:all,rows,mode,
    valid:!counterexample,counterexample,
    explanation:counterexample?
      "Invalid: a row makes every premise true and the conclusion false. This disproves deductive validity, not necessarily the real-world conclusion.":
      "Valid: no row makes all premises true and the conclusion false. This does NOT establish that the premises are factually true."};
}
export const LOGIC_LAB_EXAMPLES=[
  {label:"Modus ponens (valid)",premises:["P -> Q","P"],conclusion:"Q"},
  {label:"Affirming consequent (invalid)",premises:["P -> Q","Q"],conclusion:"P"},
  {label:"De Morgan equivalence (tautology)",premises:[],conclusion:"~(P & Q) <-> (~P | ~Q)"},
  {label:"Modus tollens (valid)",premises:["P -> Q","~Q"],conclusion:"~P"},
] as const;
