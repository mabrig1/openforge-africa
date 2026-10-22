import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { newId, type StudyCircle, type StudyTask, type CourseMaterial } from "../lib/study";
import type { ImportedPack } from "../lib/studyPack";

// Keep legacy named imports compatible with existing screens.
export type { StudyCircle, CourseMaterial };
export type Task = StudyTask;

interface CircleState {
  circles: StudyCircle[];
  tasks: StudyTask[];
  materials: CourseMaterial[];
  imports: string[];
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
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // Merge defaults with historical v0.1 state so older circles/tasks survive.
      migrate: (persisted: any) => ({
        ...persisted,
        circles: Array.isArray(persisted?.circles) ? persisted.circles : [],
        tasks: Array.isArray(persisted?.tasks) ? persisted.tasks : [],
        materials: Array.isArray(persisted?.materials) ? persisted.materials : [],
        imports: Array.isArray(persisted?.imports) ? persisted.imports : [],
      }),
    }
  )
);
