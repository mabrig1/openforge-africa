# OpenForge Architecture

## Design Principles

1. **Offline-first** – Every core action must work without internet.
2. **Low-end device first** – Target Android 8+ / 2GB RAM.
3. **Privacy by default** – Student data stays on device until explicit sync.
4. **Lightweight for tutors** – Tutors receive digests, not notification floods.
5. **Grant-measurable** – Built-in metrics for retention, engagement and peer interaction.

## High-Level Flow

```
Student creates / joins Study Circle
        ↓
Downloads or links course materials (shared with AI Course Assistant)
        ↓
Works offline: tasks, peer responses, AI facilitation
        ↓
When online → intelligent sync of activity + results
        ↓
Tutor receives clean activity digest
```

## Data Model (Core)

- Circles
- Members
- Tasks (discussion, peer-review, micro-quiz, explanation)
- Peer Responses
- Activity Log
- (Future) Local embeddings for AI Facilitator

## Sync Strategy

- Queue-based
- Conflict resolution: last-writer-wins for most fields + merge for activity logs
- Only send anonymized / consented data by default

## Integration Points

- Can share course materials with the existing AI Course Assistant
- Moodle Web Services hooks prepared for official institutional partnership
- Future: multi-institution federation for West/East African open universities
