# OpenForge Media Studio v0.7 — Editable Infographics, Captions & Microphone Narration

**Status:** review-only stacked upgrade. Base PR #7 adds the owner-gated AI tutor, browser/native text reader, and initial SVG/WebM studio. This PR must not merge or deploy before reviewing the base chain and existing Cloudflare deployment failures. No API requests, model inference, secrets, or paid video generation are needed to test the new features.

## New capabilities

1. **Four visually distinct SVG diagram layouts:** learning cards, sequence flowchart with arrows, step timeline, and side-by-side comparison. These are arrangements of learner-provided text, not fact-checked semantic analysis. They export locally as real SVG (web).
2. **Editable storyboard panels:** after deterministic text splitting, students can rewrite the heading (90 characters) and body (240 characters) of any of up to six slides. Updates immediately change the diagram, caption file, and next video export. Edits are in memory, not synced or stored across reload.
3. **Timed SRT and WebVTT captions:** each slide's *displayed text* appears for its configured 3, 5 or 8 seconds. Caption text is **not a transcript of actual narration**. If the student reads slowly or pauses, it may not align with speech; they can edit timings externally.
4. **Optional microphone narration during real browser video recording:** the user selects an explicit checkbox and then clicks Render. Only then does the browser ask for microphone access. Speech is captured live while the slides advance. Audio is multiplexed with canvas frames locally through MediaRecorder. If access is denied, a clear error appears and no silent file masquerades as a narrated one. Turning the microphone off produces silent video. Never attempt hidden microphone access or automatic publishing.
5. **MP4 when supported, otherwise WebM:** the encoder actually creates the matching container via MediaRecorder. An MP4 filename is never used for WebM bytes. Supported codecs and formats vary by browser and operating system. Native app video recording/export is still unimplemented.

### Where it works

- **Web (modern Chrome/Edge and some Android browsers):** SVG download, SRT/VTT download, browser MediaRecorder video. Device performance and browser format support vary.
- **Android/iOS native Expo:** editable visual storyboard, native text reader from PR #7, textual outline/share. Actual local SVG file download, SRT/VTT attachment and native video recorder are not implemented.
- **AI Tutor:** remains owner-only with separate consent and server-only key. This release does not make it public or start paid jobs.
- **Text Reader voice:** playback remains separate from exported video. It is not captured as a narration track and is not a voice clone.

## User flow

1. Open Visual Learning Studio. Paste a lesson or open it from Tutor/Reader.
2. Tap **Generate visual explanation**; edit individual headings and summaries.
3. Choose cards, process flow, timeline, or comparison; download SVG.
4. Choose 3, 5, or 8 seconds per slide; download SRT/VTT if needed.
5. For silent video, press Render without selecting microphone.
6. For live spoken narration, select *Record my own voice* and press Render, grant permission, then speak while each slide appears. Permission denial is reported, not bypassed.
7. Download the resulting MP4 or WebM and play it locally. You must separately check captions and speech alignment in an editor.

**No automatic social media upload, no external media service, no generated scenes/video diffusion and no shared AI keys.**

## Privacy and testing gates

- Mic permission is asked only after a deliberate recording action.
- Microphone and canvas media tracks are stopped on completion, failure, or cancellation; cancellation discards the generated file.
- Keep the web page in the foreground for accurate slide timing; recording depends on browser scheduling.
- Video and subtitle content are local; choose content you are authorized to redistribute. Video voice recording may contain background noise or other people; obtain consent before recording.
- Unit tests verify caption boundaries, format strings, SVG escaping and distinct diagram layouts.
- Browser automation checks selected timeline SVG bytes, SRT timing, audio option controls and real MP4/WebM container headers. This does **not** establish perceptual audio/video quality or actual mic capture.
- Physical Android/desktop media QA remains required for codec compatibility, microphone consent behavior, track audio, downloaded-file playback and accessibility.
- AI output can hallucinate, and the diagram is based on provided text. Do not claim verified scientific explanations without independent review.

## Future work (not present)

True automatic voiceover with audio file generation, sentence-level synchronized transcripts, native Android/MP4 pipeline, AI scene illustrations or video generation, speech-to-text and broader public AI access still need a separate consented design, legal/privacy review, provider budget and physical-device validation.
