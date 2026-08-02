import { uid } from "./utils";
import { addDays, startOfWeekMonday, toISO, weekLabel } from "./date";
import type {
  AppData,
  DayData,
  StudyBlock,
  Todo,
  Week,
  WeekGoal,
} from "./types";

/** 展开一段日期范围为 ISO 日期数组（含首尾）。 */
function rangeDays(start: string, end: string): string[] {
  const out: string[] = [];
  let cur = start;
  while (cur <= end) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

// 待办默认空 —— 用户自行添加
function defaultTodos(): Todo[] {
  return [];
}

// 学习块默认空（打字文稿 + 图片）
function emptyStudy(): StudyBlock {
  return { text: "", images: [] };
}

export function makeEmptyDay(dateISO: string): DayData {
  return {
    date: dateISO,
    todos: defaultTodos(),
    vocab: emptyStudy(),
    grammar: emptyStudy(),
    reading: [],
    notes: [],
    transcriptions: [],
    work: [],
    mood: null,
    diary: null,
  };
}

const WEEK_NAMES = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
const WEEK_STARTS = [
  "2026-08-03",
  "2026-08-10",
  "2026-08-17",
  "2026-08-24",
  "2026-08-31",
];

function defaultGoals(): WeekGoal[] {
  return [
    { id: uid("goal"), text: "背单词", done: false },
    { id: uid("goal"), text: "阅读", done: false },
    { id: uid("goal"), text: "工作", done: false },
    { id: uid("goal"), text: "学习", done: false },
  ];
}

// Build the default 5 weeks with a little sample content so the app feels alive.
export function generateWeeks(): Week[] {
  return WEEK_STARTS.map((start, idx) => {
    const monday = startOfWeekMonday(start);
    const days = Array.from({ length: 7 }, (_, i) =>
      makeEmptyDay(addDays(monday, i))
    );

    // 周计划为干净模板：待办/学习/工作默认空，用户自行添加

    return {
      id: uid("week"),
      name: WEEK_NAMES[idx],
      label: weekLabel(monday),
      year: 2026,
      startDate: monday,
      days,
      goals: defaultGoals(),
    };
  });
}

export function generateMockData(): AppData {
  const weeks = generateWeeks();

  // 例假日期集合（演示：上一轮 7/5-7/11，当前轮 8/2-8/8）
  const periodDays = [
    ...rangeDays("2026-07-05", "2026-07-11"),
    ...rangeDays("2026-08-02", "2026-08-08"),
  ];

  // 体重演示数据（Week 1 每天）
  const weights: Record<string, number> = {
    "2026-08-03": 52.4,
    "2026-08-04": 52.1,
    "2026-08-05": 51.8,
    "2026-08-06": 51.6,
    "2026-08-07": 51.5,
    "2026-08-08": 51.3,
    "2026-08-09": 51.2,
  };

  return {
    weeks,
    selectedWeekId: weeks[0].id,
    weights,
    targetWeight: 50,
    periodDays,
    periodCycle: 28,
    periodDuration: 6,
  };
}

export function makeNewWeek(mondayISO: string, index: number): Week {
  const monday = startOfWeekMonday(mondayISO);
  const days = Array.from({ length: 7 }, (_, i) =>
    makeEmptyDay(addDays(monday, i))
  );
  return {
    id: uid("week"),
    name: `Week ${index}`,
    label: weekLabel(monday),
    year: parseYear(monday),
    startDate: monday,
    days,
    goals: defaultGoals(),
  };
}

function parseYear(iso: string): number {
  return Number(iso.split("-")[0]);
}

// helper exposed for store
export { toISO };
