# OpenForge Africa

**Offline Collaborative Learning Platform for Open Universities in Africa**

> *Study together. Even when the internet is gone.*

## The Problem

Open and Distance Learning (ODL) institutions such as the National Open University of Nigeria (NOUN) face a structural crisis:

- Extreme learner isolation
- Almost zero structured peer interaction
- Weak continuous assessment that depends on internet
- High dropout rates driven by lack of community and accountability
- Tutors overwhelmed and unable to give timely feedback

Existing LMS platforms assume reliable connectivity. Pure content apps do not create community. **No current product** combines offline peer study circles, AI facilitation, micro-assessments, and lightweight tutor oversight designed for African realities (low-end Android devices, expensive data, intermittent power).

## The Solution: OpenForge

OpenForge enables students to form small **Study Circles** around downloaded courses. Students collaborate offline. An AI facilitator guides discussion and checks understanding using only the course materials stored on the device. Micro-tasks and peer reviews happen without internet. Everything syncs intelligently when connectivity returns. Tutors receive clean activity digests instead of noise.

### Core Modules

1. **Study Circles** – Create or join small groups (3–8 students) around a course
2. **Offline Collaborative Tasks** – Shared questions, peer explanations, concept mapping
3. **AI Facilitator** – Guides discussion, suggests questions, verifies understanding (RAG-grounded)
4. **Micro-Assessments** – Short offline quizzes + structured peer feedback that sync later
5. **Tutor Dashboard Lite** – Simple activity overview when online
6. **Progress & Accountability** – Circle completion rates, gentle streaks, visibility without surveillance

## Why This Is Grant-Ready

- Directly targets dropout and isolation in African ODL systems
- Strong alignment with **SDG 4**, African Union Continental Education Strategy, and priorities of Mastercard Foundation, IDRC, UNESCO, Ford Foundation, SSRC, and related education windows
- Built for real constraints: Android 8+, 2GB RAM, high data cost environments
- Measurable outcomes: retention, peer interaction frequency, assessment completion, tutor workload reduction
- Designed for scale beyond a single institution (NOUN → West & East African open universities)

## Tech Stack (MVP)

- React Native + Expo
- Offline-first architecture (SQLite + local vector search)
- Zustand for state
- Expo Router
- Privacy-first design (student data stays on device by default)

## Project Status

**v0.1 – Foundation**  
Architecture, data model, core screens, and offline-first scaffolding are in place.

## Getting Started

```bash
git clone https://github.com/mabrig1/openforge-africa.git
cd openforge-africa
npm install
npx expo start
```

## Repository Structure

```
app/                  # Expo Router screens
components/           # Reusable UI
lib/
  db.ts               # SQLite schema
  rag/                # Offline AI facilitator
  sync/               # Intelligent sync engine
stores/               # Zustand stores
types/
docs/                 # Architecture & grant notes
```

## Roadmap

- **v0.2** – Full Study Circle creation + offline task flow
- **v0.3** – AI Facilitator + micro-assessments
- **v0.4** – Tutor Dashboard Lite + Moodle integration hooks
- **Phase 2** – Multi-institution pilots + impact measurement framework

## License

MIT – Open for partnership with African open universities and international funders.

---

Built for African learners. Privacy-first. Offline by design. Grant-oriented from day one.
