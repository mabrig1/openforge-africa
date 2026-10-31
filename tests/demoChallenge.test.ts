import test from "node:test";
import assert from "node:assert/strict";
import { makeSyntheticDemoPack, runLocalIntegrityChecks } from "../lib/demoChallenge.ts";
import { parseStudyPack } from "../lib/studyPack.ts";

test("synthetic demonstration uses the real, validated import schema", () => {
  const pack = makeSyntheticDemoPack();
  assert.equal(pack.courseCode, "DEMO 101");
  assert.equal(pack.notes.length, 2);
  assert.equal(pack.tasks.length, 3);
  assert.equal(pack.tasks.filter(task => task.type === "micro-quiz").length, 1);
  assert.match(pack.name, /synthetic/i);
  assert.ok(pack.notes.every(note => /fictional/i.test(note.title)));
  assert.equal(makeSyntheticDemoPack().dedupeKey, pack.dedupeKey);
});

test("a different or malformed pack cannot masquerade as the official synthetic demo", () => {
  assert.throws(() => parseStudyPack('{"format":"unknown"}'));
  const original = makeSyntheticDemoPack();
  assert.ok(original.dedupeKey.length > 0);
});

test("local integrity checks are deterministic, meaningful and explicit about scope", () => {
  const first = runLocalIntegrityChecks();
  const second = runLocalIntegrityChecks();
  assert.deepEqual(second, first);
  assert.equal(first.length, 6);
  assert.equal(new Set(first.map(c => c.id)).size, 6);
  assert.ok(first.every(c => c.passed === true));
  assert.ok(first.every(c => c.detail.length > 20));
});
