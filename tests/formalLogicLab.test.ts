import test from "node:test";
import assert from "node:assert/strict";
import { analyzeLogic, evaluateFormula, parseFormula, LOGIC_LAB_EXAMPLES } from "../lib/formalLogicLab.ts";

test("modus ponens and tollens are deductively valid on exhaustive valuations",()=>{
 const p=analyzeLogic("Q",["P -> Q","P"]);
 const t=analyzeLogic("~P",["P -> Q","~Q"]);
 assert.equal(p.valid,true);assert.equal(t.valid,true);
 assert.equal(p.rows.length,4);assert.equal(p.rows.some(row=>row.invalidating),false);
 assert.deepEqual(p.variables,["P","Q"]);
});
test("affirming the consequent has real counterexample P=false Q=true",()=>{
 const d=analyzeLogic("P",["P -> Q","Q"]);
 assert.equal(d.valid,false);
 assert.deepEqual(d.counterexample?.assignment,{P:false,Q:true,R:false,S:false});
 assert.deepEqual(d.counterexample?.results,[true,true]);
 assert.equal(d.counterexample?.result,false);
});
test("De Morgan, tautology, contradiction and contingency classifications match table definitions",()=>{
 const eq=analyzeLogic("~(P & Q) <-> (~P | ~Q)");
 assert.equal(eq.classification,"tautology");assert.equal(eq.rows.length,4);
 assert.equal(analyzeLogic("P & ~P").classification,"contradiction");
 assert.equal(analyzeLogic("P | Q").classification,"contingency");
 assert.equal(analyzeLogic("(P & Q) -> P").classification,"tautology");
 assert.equal(analyzeLogic("P -> P").classification,"tautology");
});
test("semantic precedence, right association, ASCII and Unicode are consistent",()=>{
 const a=analyzeLogic("P | Q & R"),b=analyzeLogic("P | (Q & R)");
 assert.deepEqual(a.rows.map(x=>x.result),b.rows.map(x=>x.result));
 assert.deepEqual(analyzeLogic("¬(P ∧ Q) ⇔ (¬P ∨ ¬Q)").rows.map(x=>x.result),
   analyzeLogic("~(P & Q) <-> (~P | ~Q)").rows.map(x=>x.result));
 const valuation={P:false,Q:false,R:true,S:false};
 assert.equal(evaluateFormula(parseFormula("P -> Q -> R"),valuation),true);
 assert.equal(evaluateFormula(parseFormula("(P -> Q) -> R"),valuation),true);
 const different={P:false,Q:true,R:false,S:false};
 assert.notEqual(evaluateFormula(parseFormula("P -> Q -> R"),different),
   evaluateFormula(parseFormula("(P -> Q) -> R"),different));
});
test("rejects malformed, unsafe, unbounded and unsupported input without executing JS",()=>{
 for(const s of ["","P + Q","P && Q","process.exit()","P;Q",")P(","~","P ->",
   "(P","P Q","P -> Q)","P".repeat(180)]){
   assert.throws(()=>parseFormula(s),s);
 }
 assert.throws(()=>analyzeLogic("P",Array(5).fill("P")));
 assert.throws(()=>parseFormula("T"));
 assert.equal(LOGIC_LAB_EXAMPLES.length,4);
 assert.equal(analyzeLogic("P & Q & R & S").rows.length,16);
});
