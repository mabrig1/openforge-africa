import test from "node:test";
import assert from "node:assert/strict";
import { createCaptionCues, createSrt, createVtt, DEFAULT_SLIDE_MS, SLIDE_MS_OPTIONS } from "../lib/mediaCaptions.ts";
const slides=[
  {heading:"Introduction",body:"What is a learning circle?"},
  {heading:"Study together",body:"Share ideas and test your understanding."},
  {heading:"Conclusion",body:"Reflect and improve."},
];
test("subtitle cues follow actual deterministic slide durations",()=>{
  const cues=createCaptionCues(slides,5000);
  assert.deepEqual(cues.map(c=>[c.index,c.startMs,c.endMs]),[
    [1,0,5000],[2,5000,10000],[3,10000,15000]
  ]);
  assert.match(cues[0].text,/Introduction\nWhat is/);
  assert.equal(DEFAULT_SLIDE_MS,3000);
  assert.deepEqual(SLIDE_MS_OPTIONS,[3000,5000,8000]);
});
test("SRT and VTT are valid timestamped text, no transcription claim",()=>{
  const srt=createSrt(slides,3000);
  assert.match(srt,/1\n00:00:00,000 --> 00:00:03,000/);
  assert.match(srt,/3\n00:00:06,000 --> 00:00:09,000/);
  const vtt=createVtt(slides,3000);
  assert.ok(vtt.startsWith("WEBVTT\n\n"));
  assert.match(vtt,/00:00:03\.000 --> 00:00:06\.000/);
  assert.ok(!vtt.includes("00:00:03,000"));
});
test("caption bounds reject excessive/inconsistent video lengths",()=>{
  assert.throws(()=>createCaptionCues([],3000));
  assert.throws(()=>createSrt(slides,0));
  assert.throws(()=>createSrt(slides,1000));
  assert.throws(()=>createSrt(Array.from({length:7},()=>slides[0]),3000));
  const cue=createCaptionCues([{heading:"a\nb",body:"text\nline"}],8000)[0];
  assert.equal(cue.text,"a b\ntext line");
});
