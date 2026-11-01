import test from "node:test";
import assert from "node:assert/strict";
import {describeSmallSample,causalRates,CAUSAL_TEACHING_SCENARIOS} from "../lib/appliedDecisionLabs.ts";
test("descriptive statistics compute correct mean, median and sample SD without arbitrary precision claims",()=>{
 const x=describeSmallSample("4, 5, 5, 6, 7");
 assert.ok(x);assert.equal(x.count,5);assert.equal(x.mean,5.4);assert.equal(x.median,5);
 assert.equal(x.min,4);assert.equal(x.max,7);
 assert.ok(Math.abs(x.sampleSd-Math.sqrt(5.2/4))<1e-12);
 const y=describeSmallSample("4, 5, 5, 6, 7, 100");
 assert.ok(y);assert.equal(y.median,5.5);assert.ok(y.mean>21);
 const even=describeSmallSample("-2, -1, 0, 3");
 assert.equal(even?.median,-.5);
 assert.equal(even?.count,4);
});
test("stats sample parser rejects script, missing values, huge or invalid samples",()=>{
 for(const v of ["","3","1,","1,,2","foo,2","1;2","NaN,2","Infinity,2","1e9,2","1000001,0","1,2<script>","1, 2, 3, bad",
  Array.from({length:26},()=>String(1)).join(",")]){
  assert.equal(describeSmallSample(v),null,"should reject "+v);
 }
});
test("synthetic selection reversal: poorer aggregate but better performance within each group",()=>{
 const x=causalRates(CAUSAL_TEACHING_SCENARIOS.uneven.strata);
 assert.ok(x);
 assert.equal(x.treatedRate,.54);assert.equal(x.untreatedRate,.76);
 assert.ok(Math.abs(x.pooledDifferencePP+22)<1e-10);
 assert.deepEqual(x.within.map(c=>Math.round(c.differencePP)),[10,10]);
});
test("balanced groups give same direction aggregate and each stratum; not proof of causality",()=>{
 const x=causalRates(CAUSAL_TEACHING_SCENARIOS.balanced.strata);
 assert.ok(x);
 assert.ok(Math.abs(x.pooledDifferencePP-10)<1e-10);
 assert.deepEqual(x.within.map(c=>Math.round(c.differencePP)),[10,10]);
});
test("invalid outcome counts and missing denominators are rejected rather than divided",()=>{
 assert.equal(causalRates([{label:"bad",treated:{n:10,success:11},untreated:{n:2,success:1}}]),null);
 assert.equal(causalRates([{label:"bad",treated:{n:0,success:0},untreated:{n:2,success:1}}]),null);
 assert.equal(causalRates([]),null);
});
