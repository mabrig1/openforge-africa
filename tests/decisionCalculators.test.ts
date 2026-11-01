import test from "node:test";
import assert from "node:assert/strict";
import {bayesPositivePosterior,expectedValue} from "../lib/decisionCalculators.ts";
test("Bayes respects base rate and uses false positive rate rather than specificity",()=>{
 assert.ok(Math.abs(bayesPositivePosterior(.01,.95,.05)!-(.0095/(.0095+.0495)))<1e-10);
 assert.ok(Math.abs(bayesPositivePosterior(.1,.95,.05)!-(.095/(.095+.045)))<1e-10);
 assert.equal(bayesPositivePosterior(0,0,0),null);
 assert.equal(bayesPositivePosterior(1,1,0),1);
 assert.equal(bayesPositivePosterior(-.1,.9,.1),null);
 assert.equal(bayesPositivePosterior(.1,1.3,.1),null);
});
test("expected monetary value handles zero, certainty, invalid inputs and bounds",()=>{
 assert.equal(expectedValue(.3,100),30);
 assert.equal(expectedValue(.25,100,0),25);
 assert.equal(expectedValue(0,40,20),20);
 assert.equal(expectedValue(1,40,20),40);
 assert.equal(expectedValue(-.2,100),null);
 assert.equal(expectedValue(.5,Infinity),null);
 assert.equal(expectedValue(.5,100000001),null);
});
