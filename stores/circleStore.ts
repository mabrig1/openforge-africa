import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StudyCircle {
  id: string;
  name: string;
  courseCode: string;
  courseTitle: string;
  memberCount: number;
  taskCount: number;
  lastActivity: string;
  createdAt: number;
}

export interface Task {
  id: string;
  circleId: string;
  circleName: string;
  title: string;
  type: "discussion" | "peer-review" | "micro-quiz" | "explanation";
  status: "pending" | "in-progress" | "completed";
  createdAt: number;
}

interface CircleState {
  circles: StudyCircle[];
  tasks: Task[];
  addCircle: (circle: StudyCircle) => void;
  addTask: (task: Task) => void;
}

export const useCircleStore = create<CircleState>()(
  persist(
    (set) => ({
      circles: [],
      tasks: [],

      addCircle: (circle) =>
        set((state) => ({
          circles: [circle, ...state.circles],
        })),

      addTask: (task) =>
        set((state) => ({
          tasks: [task, ...state.tasks],
        })),
    }),
    {
      name: "openforge-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
