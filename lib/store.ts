"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { uid } from "./utils";
import {
  generateMockData,
  makeNewWeek,
  makeEmptyDay,
} from "./mockData";
import { startOfWeekMonday, weekLabel } from "./date";
import type {
  AppData,
  DayData,
  MoodType,
  Priority,
  StudyBlock,
  Todo,
  Week,
  WeekGoal,
  WorkTask,
  WorkType,
} from "./types";

interface Actions {
  // hydration
  setHasHydrated: (v: boolean) => void;
  // week
  selectWeek: (id: string) => void;
  createWeek: (mondayISO: string) => void;
  deleteWeek: (id: string) => void;
  renameWeek: (id: string, name: string) => void;
  // day mutation helper
  updateDay: (
    weekId: string,
    dateISO: string,
    updater: (day: DayData) => DayData
  ) => void;
  // todos
  addTodo: (weekId: string, date: string, text: string, priority?: Priority) => void;
  toggleTodo: (weekId: string, date: string, todoId: string) => void;
  editTodo: (weekId: string, date: string, todoId: string, text: string) => void;
  deleteTodo: (weekId: string, date: string, todoId: string) => void;
  setTodoPriority: (weekId: string, date: string, todoId: string, p: Priority) => void;
  setTodosOrder: (weekId: string, date: string, todos: Todo[]) => void;
  // vocab / grammar — study blocks (text + images)
  setStudyText: (
    weekId: string,
    date: string,
    kind: "vocab" | "grammar",
    text: string
  ) => void;
  addStudyImage: (
    weekId: string,
    date: string,
    kind: "vocab" | "grammar",
    image: string
  ) => void;
  deleteStudyImage: (
    weekId: string,
    date: string,
    kind: "vocab" | "grammar",
    index: number
  ) => void;
  // reading
  addReading: (weekId: string, date: string, book: string, minutes: number) => void;
  deleteReading: (weekId: string, date: string, id: string) => void;
  // notes
  addNote: (weekId: string, date: string) => void;
  updateNote: (weekId: string, date: string, id: string, content: string) => void;
  deleteNote: (weekId: string, date: string, id: string) => void;
  // transcription
  addTranscription: (weekId: string, date: string, image: string) => void;
  deleteTranscription: (weekId: string, date: string, id: string) => void;
  // work
  addWork: (weekId: string, date: string, type: WorkType, text: string) => void;
  toggleWork: (weekId: string, date: string, id: string) => void;
  editWork: (weekId: string, date: string, id: string, text: string) => void;
  deleteWork: (weekId: string, date: string, id: string) => void;
  // mood
  setMood: (weekId: string, date: string, type: MoodType, note?: string) => void;
  clearMood: (weekId: string, date: string) => void;
  // diary
  setDiaryContent: (weekId: string, date: string, content: string) => void;
  addDiaryImage: (weekId: string, date: string, image: string) => void;
  removeDiaryImage: (weekId: string, date: string, index: number) => void;
  // goals
  addGoal: (weekId: string, text: string) => void;
  toggleGoal: (weekId: string, id: string) => void;
  editGoal: (weekId: string, id: string, text: string) => void;
  deleteGoal: (weekId: string, id: string) => void;
  // weight & period
  setWeight: (dateISO: string, value: number | null) => void;
  setTargetWeight: (value: number | null) => void;
  togglePeriodDay: (dateISO: string) => void;
  setPeriodCycle: (n: number) => void;
  setPeriodDuration: (n: number) => void;
  // reset
  resetAll: () => void;
  // backup / restore
  exportData: () => BackupPayload;
  importData: (data: BackupPayload) => void;
}

export interface BackupPayload {
  version: number;
  weeks: Week[];
  selectedWeekId: string | null;
  weights: Record<string, number>;
  targetWeight: number | null;
  periodDays: string[];
  periodCycle: number;
  periodDuration: number;
}

export type StoreState = AppData & { _hasHydrated: boolean } & Actions;

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...generateMockData(),
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      selectWeek: (id) => set({ selectedWeekId: id }),

      createWeek: (mondayISO) => {
        const monday = startOfWeekMonday(mondayISO);
        const { weeks } = get();
        const newWeek = makeNewWeek(monday, weeks.length + 1);
        newWeek.label = weekLabel(monday);
        set({ weeks: [...weeks, newWeek], selectedWeekId: newWeek.id });
      },

      deleteWeek: (id) => {
        const { weeks, selectedWeekId } = get();
        const remaining = weeks.filter((w) => w.id !== id);
        const nextSelected =
          selectedWeekId === id
            ? remaining[0]?.id ?? null
            : selectedWeekId;
        set({ weeks: remaining, selectedWeekId: nextSelected });
      },

      renameWeek: (id, name) =>
        set({
          weeks: get().weeks.map((w) =>
            w.id === id ? { ...w, name } : w
          ),
        }),

      updateDay: (weekId, dateISO, updater) =>
        set({
          weeks: get().weeks.map((w) =>
            w.id === weekId
              ? {
                  ...w,
                  days: w.days.map((d) =>
                    d.date === dateISO ? updater(d) : d
                  ),
                }
              : w
          ),
        }),

      // ----- Todos -----
      addTodo: (weekId, date, text, priority = "medium") =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          todos: [
            ...d.todos,
            { id: uid("todo"), text, done: false, priority },
          ],
        })),
      toggleTodo: (weekId, date, todoId) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          todos: d.todos.map((t) =>
            t.id === todoId ? { ...t, done: !t.done } : t
          ),
        })),
      editTodo: (weekId, date, todoId, text) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          todos: d.todos.map((t) =>
            t.id === todoId ? { ...t, text } : t
          ),
        })),
      deleteTodo: (weekId, date, todoId) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          todos: d.todos.filter((t) => t.id !== todoId),
        })),
      setTodoPriority: (weekId, date, todoId, p) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          todos: d.todos.map((t) =>
            t.id === todoId ? { ...t, priority: p } : t
          ),
        })),
      setTodosOrder: (weekId, date, todos) =>
        get().updateDay(weekId, date, (d) => ({ ...d, todos })),

      // ----- Vocab / Grammar (study blocks) -----
      setStudyText: (weekId, date, kind, text) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          [kind]: { ...(d[kind] as StudyBlock), text },
        })),
      addStudyImage: (weekId, date, kind, image) =>
        get().updateDay(weekId, date, (d) => {
          const block = d[kind] as StudyBlock;
          return {
            ...d,
            [kind]: { ...block, images: [...block.images, image] },
          };
        }),
      deleteStudyImage: (weekId, date, kind, index) =>
        get().updateDay(weekId, date, (d) => {
          const block = d[kind] as StudyBlock;
          return {
            ...d,
            [kind]: {
              ...block,
              images: block.images.filter((_, i) => i !== index),
            },
          };
        }),

      // ----- Reading -----
      addReading: (weekId, date, book, minutes) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          reading: [
            ...d.reading,
            { id: uid("read"), book, minutes },
          ],
        })),
      deleteReading: (weekId, date, id) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          reading: d.reading.filter((r) => r.id !== id),
        })),

      // ----- Notes -----
      addNote: (weekId, date) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          notes: [...d.notes, { id: uid("note"), content: "" }],
        })),
      updateNote: (weekId, date, id, content) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          notes: d.notes.map((n) =>
            n.id === id ? { ...n, content } : n
          ),
        })),
      deleteNote: (weekId, date, id) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          notes: d.notes.filter((n) => n.id !== id),
        })),

      // ----- Transcription -----
      addTranscription: (weekId, date, image) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          transcriptions: [
            ...d.transcriptions,
            { id: uid("tr"), image },
          ],
        })),
      deleteTranscription: (weekId, date, id) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          transcriptions: d.transcriptions.filter((t) => t.id !== id),
        })),

      // ----- Work -----
      addWork: (weekId, date, type, text) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          work: [
            ...d.work,
            { id: uid("w"), type, text, done: false } as WorkTask,
          ],
        })),
      toggleWork: (weekId, date, id) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          work: d.work.map((w) =>
            w.id === id ? { ...w, done: !w.done } : w
          ),
        })),
      editWork: (weekId, date, id, text) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          work: d.work.map((w) =>
            w.id === id ? { ...w, text } : w
          ),
        })),
      deleteWork: (weekId, date, id) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          work: d.work.filter((w) => w.id !== id),
        })),

      // ----- Mood -----
      setMood: (weekId, date, type, note) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          mood: { type, note },
        })),
      clearMood: (weekId, date) =>
        get().updateDay(weekId, date, (d) => ({ ...d, mood: null })),

      // ----- Diary -----
      setDiaryContent: (weekId, date, content) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          diary: {
            content,
            images: d.diary?.images ?? [],
          },
        })),
      addDiaryImage: (weekId, date, image) =>
        get().updateDay(weekId, date, (d) => ({
          ...d,
          diary: {
            content: d.diary?.content ?? "",
            images: [...(d.diary?.images ?? []), image],
          },
        })),
      removeDiaryImage: (weekId, date, index) =>
        get().updateDay(weekId, date, (d) => {
          if (!d.diary) return d;
          return {
            ...d,
            diary: {
              ...d.diary,
              images: d.diary.images.filter((_, i) => i !== index),
            },
          };
        }),

      // ----- Goals -----
      addGoal: (weekId, text) =>
        set({
          weeks: get().weeks.map((w) =>
            w.id === weekId
              ? {
                  ...w,
                  goals: [
                    ...w.goals,
                    { id: uid("goal"), text, done: false },
                  ],
                }
              : w
          ),
        }),
      toggleGoal: (weekId, id) =>
        set({
          weeks: get().weeks.map((w) =>
            w.id === weekId
              ? {
                  ...w,
                  goals: w.goals.map((g) =>
                    g.id === id ? { ...g, done: !g.done } : g
                  ),
                }
              : w
          ),
        }),
      editGoal: (weekId, id, text) =>
        set({
          weeks: get().weeks.map((w) =>
            w.id === weekId
              ? {
                  ...w,
                  goals: w.goals.map((g) =>
                    g.id === id ? { ...g, text } : g
                  ),
                }
              : w
          ),
        }),
      deleteGoal: (weekId, id) =>
        set({
          weeks: get().weeks.map((w) =>
            w.id === weekId
              ? { ...w, goals: w.goals.filter((g) => g.id !== id) }
              : w
          ),
        }),

      // ----- Weight & Period -----
      setWeight: (dateISO, value) =>
        set((s) => {
          const next = { ...s.weights };
          if (value === null || Number.isNaN(value)) delete next[dateISO];
          else next[dateISO] = value;
          return { weights: next };
        }),
      setTargetWeight: (value) =>
        set({
          targetWeight: value === null || Number.isNaN(value) ? null : value,
        }),
      togglePeriodDay: (dateISO) =>
        set((s) => ({
          periodDays: s.periodDays.includes(dateISO)
            ? s.periodDays.filter((d) => d !== dateISO)
            : [...s.periodDays, dateISO],
        })),
      setPeriodCycle: (n) => set({ periodCycle: n }),
      setPeriodDuration: (n) => set({ periodDuration: n }),

      resetAll: () => {
        const fresh = generateMockData();
        set({ ...fresh, _hasHydrated: true });
      },

      exportData: () => {
        const s = get();
        return {
          version: 2,
          weeks: s.weeks,
          selectedWeekId: s.selectedWeekId,
          weights: s.weights,
          targetWeight: s.targetWeight,
          periodDays: s.periodDays,
          periodCycle: s.periodCycle,
          periodDuration: s.periodDuration,
        };
      },
      importData: (data) => {
        if (!data || !Array.isArray(data.weeks)) return;
        set({
          weeks: data.weeks,
          selectedWeekId: data.selectedWeekId ?? data.weeks[0]?.id ?? null,
          weights: data.weights ?? {},
          targetWeight: data.targetWeight ?? null,
          periodDays: data.periodDays ?? [],
          periodCycle: data.periodCycle ?? 28,
          periodDuration: data.periodDuration ?? 6,
          _hasHydrated: true,
        });
      },
    }),
    {
      name: "pgd-store-v2",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage
      ),
      skipHydration: true,
      partialize: (s) => ({
        weeks: s.weeks,
        selectedWeekId: s.selectedWeekId,
        weights: s.weights,
        targetWeight: s.targetWeight,
        periodDays: s.periodDays,
        periodCycle: s.periodCycle,
        periodDuration: s.periodDuration,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Convenience selector hooks
export function useSelectedWeek(): Week | null {
  return useStore((s) =>
    s.weeks.find((w) => w.id === s.selectedWeekId) ?? null
  );
}
