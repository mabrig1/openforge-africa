import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { newId, type StudyCircle, type StudyTask, type CourseMaterial } from "../lib/study";
import type { ImportedPack } from "../lib/studyPack";
import { addPilotCheckIn, localDay, type LocalPilot, type PilotCheckIn } from "../lib/pilot";
import { elapsedFocusSeconds, sessionReflectionIssue,
  type ActiveFocus, type FocusSession } from "../lib/focus";

// Keep legacy named imports compatible with existing screens.
export type { StudyCircle, CourseMaterial };
export type Task = StudyTask;

interface CircleState {
  circles: StudyCircle[];
  tasks: StudyTask[];
  materials: CourseMaterial[];
  imports: string[];
  sessions: FocusSession[];
  pilots: LocalPilot[];
  startPilot: (circleId: string) => boolean;
  recordPilotCheckIn: (circleId: string, checkIn: PilotCheckIn) => boolean;
  activeFocus: ActiveFocus | null;
  startFocus: (circleId: string) => boolean;
  finishFocus: (reflection?: string) => FocusSession | null;
  discardFocus: () => void;
  resetLocalData: () => void;
  importPack: (pack: ImportedPack) => string | null;
  addCircle: (circle: StudyCircle) => void;
  removeCircle: (id: string) => void;
  addTask: (task: StudyTask) => void;
  completeTask: (id: string, selectedIndex?: number) => void;
  addMaterial: (material: CourseMaterial) => void;
  removeMaterial: (id: string) => void;
}
export const useCircleStore = create<CircleState>()(
  persist(
    (set) => ({
      circles: [],
      tasks: [],
      materials: [],
      imports: [],
      sessions: [],
      pilots: [],
      startPilot: (circleId) => {
        let started = false;
        set((state) => {
          if (!state.circles.some(c => c.id === circleId) || state.pilots.some(p => p.circleId === circleId)) return state;
          started = true;
          return {...state, pilots: [...state.pilots, {circleId, startedDay:localDay(new Date()), checkIns:[]}]};
        });
        return started;
      },
      recordPilotCheckIn: (circleId, entry) => {
        let recorded = false;
        set(state => ({...state, pilots: state.pilots.map(p => {
          if(p.circleId !== circleId) return p;
          // The recorded day always comes from the current device date, not untrusted UI input.
          const result = addPilotCheckIn(p,{...entry,day:localDay(new Date())});
          if(result) recorded = true;
          return result ?? p;
        })}));
        return recorded;
      },
      activeFocus: null,
      startFocus: (circleId) => {
        let started = false;
        set((state) => {
          if(state.activeFocus || !state.circles.some(c => c.id === circleId)) return state;
          started = true;
          return {...state, activeFocus:{circleId,startedAt:Date.now()}};
        });
        return started;
      },
      finishFocus: (reflection = "") => {
        let record:FocusSession|null = null;
        set((state) => {
          const active = state.activeFocus;
          if(!active || sessionReflectionIssue(reflection) ||
             !state.circles.some((c) => c.id === active.circleId)) return state;
          const now=Date.now();
          const seconds=elapsedFocusSeconds(active.startedAt,now);
          if(seconds<10) return state;
          record={id:newId("focus"),circleId:active.circleId,
            startedAt:active.startedAt,endedAt:now,seconds,
            ...(reflection.trim()?{reflection:reflection.trim()}:{})};
          return {...state,activeFocus:null,sessions:[record,...state.sessions]};
        });
        return record;
      },
      discardFocus: () => set((state) => ({...state,activeFocus:null})),
      resetLocalData: () => set(() => ({
        circles: [], tasks: [], materials: [], imports: [], sessions: [], pilots: [], activeFocus: null,
      })),
      importPack: (pack) => {
        let createdId: string | null = null;
        set((s) => {
          if (s.imports.includes(pack.dedupeKey)) return s;
          const id = newId("circle");
          createdId = id;
          const now = Date.now();
          const circle: StudyCircle = {id, name: pack.name, courseCode: pack.courseCode,
            courseTitle: pack.courseTitle, memberCount: 1, taskCount: pack.tasks.length,
            lastActivity: "Imported", createdAt: now};
          const materials = pack.notes.map((n) => ({
            ...n, id: newId("note"), circleId: id, createdAt: now
          }));
          const tasks = pack.tasks.map((t) => ({
            ...t, id: newId("task"), circleId: id, circleName:pack.name,
            status:"pending" as const, createdAt: now
          }));
          return {
            circles: [circle, ...s.circles],
            materials: [...materials, ...s.materials],
            tasks: [...tasks, ...s.tasks],
            imports: [pack.dedupeKey, ...s.imports].slice(0, 100),
          };
        });
        return createdId;
      },
      addCircle: (circle) => set((s) => ({ circles: [circle, ...s.circles] })),
      removeCircle: (id) => set((s) => ({
        circles: s.circles.filter((c) => c.id !== id),
        tasks: s.tasks.filter((t) => t.circleId !== id),
        materials: s.materials.filter((m) => m.circleId !== id),
        sessions: s.sessions.filter((item) => item.circleId !== id),
        pilots: s.pilots.filter((item) => item.circleId !== id),
        activeFocus: s.activeFocus?.circleId === id ? null : s.activeFocus,
      })),
      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      completeTask: (id, selectedIndex) => set((s) => ({
        tasks: s.tasks.map((task) => {
          if (task.id !== id || task.status === "completed") return task;
          if (task.type === "micro-quiz" &&
              (!Number.isInteger(selectedIndex) || selectedIndex! < 0 ||
                selectedIndex! >= (task.options?.length ?? 0))) return task;
          return { ...task, status: "completed", selectedIndex, completedAt: Date.now() };
        }),
      })),
      addMaterial: (material) => set((s) => ({ materials: [material, ...s.materials] })),
      removeMaterial: (id) => set((s) => ({ materials: s.materials.filter((m) => m.id !== id) })),
    }),
    {
      name: "openforge-storage",
      version: 4,
      storage: createJSONStorage(() => AsyncStorage),
      // Merge defaults with historical v0.1 state so older circles/tasks survive.
      migrate: (persisted: any) => ({
        ...persisted,
        circles: Array.isArray(persisted?.circles) ? persisted.circles : [],
        tasks: Array.isArray(persisted?.tasks) ? persisted.tasks : [],
        materials: Array.isArray(persisted?.materials) ? persisted.materials : [],
        imports: Array.isArray(persisted?.imports) ? persisted.imports : [],
        sessions: Array.isArray(persisted?.sessions) ? persisted.sessions : [],
        pilots: Array.isArray(persisted?.pilots) ? persisted.pilots : [],
        activeFocus: persisted?.activeFocus ?? null,
      }),
    }
  )
);
