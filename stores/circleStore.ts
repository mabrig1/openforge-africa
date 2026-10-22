import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StudyCircle, StudyTask, CourseMaterial } from "../lib/study";

// Keep legacy named imports compatible with existing screens.
export type { StudyCircle, CourseMaterial };
export type Task = StudyTask;

interface CircleState {
  circles: StudyCircle[];
  tasks: StudyTask[];
  materials: CourseMaterial[];
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
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted: any) => ({
        circles: Array.isArray(persisted?.circles) ? persisted.circles : [],
        tasks: Array.isArray(persisted?.tasks) ? persisted.tasks : [],
        materials: Array.isArray(persisted?.materials) ? persisted.materials : [],
      }),
      partialize: (s) => ({ circles: s.circles, tasks: s.tasks, materials: s.materials }),
    }
  )
);
