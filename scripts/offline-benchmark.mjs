/**
 * Public, synthetic, deterministic developer regression suite.
 * This is NOT an independent AI benchmark, evidence of student impact,
 * an external leaderboard, or a claim that any competitor has been defeated.
 */
import { readFileSync } from "node:fs";
import { groundedReply } from "../lib/study.ts";

const file = new URL("../benchmarks/offline-grounding-v1.json", import.meta.url);
const suite = JSON.parse(readFileSync(file, "utf8"));

if (!Array.isArray(suite.materials) || !Array.isArray(suite.cases) ||
    suite.cases.length === 0 || suite.cases.length > 100)
  throw new Error("Invalid synthetic benchmark data.");
const results = suite.cases.map(item => {
  if (!item || typeof item.id !== "string" || typeof item.question !== "string" ||
      !(item.expectedTitle === null || typeof item.expectedTitle === "string"))
    throw new Error("Malformed benchmark case.");
  const got = groundedReply(item.question, suite.materials);
  const actualTitle = got.matched ? got.sourceTitle ?? null : null;
  return {
    id: item.id,
    expectedTitle: item.expectedTitle,
    actualTitle,
    passed: actualTitle === item.expectedTitle,
  };
});
if (new Set(results.map(item => item.id)).size !== results.length)
  throw new Error("Duplicate benchmark case IDs.");

const passed = results.filter(item => item.passed).length;
const report = {
  suite: suite.suite,
  classification: "public synthetic developer regression; not independent evaluation",
  codeMode: "offline lexical note retrieval; no generative AI or external inference",
  total: results.length,
  passed,
  percent: Math.round(100 * passed / results.length),
  cases: results,
};
console.log(JSON.stringify(report, null, 2));
if (passed !== results.length) process.exitCode = 1;
