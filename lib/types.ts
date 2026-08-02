// ---------------------------------------------------------------------------
// Domain types for Personal Growth Dashboard
// ---------------------------------------------------------------------------

export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
}

/** 学习模块的内容块：打字文稿 + 图片上传 */
export interface StudyBlock {
  /** 打字文稿 / 文档内容 */
  text: string;
  /** 图片上传（base64 data url） */
  images: string[];
}

export interface ReadingRecord {
  id: string;
  book: string;
  minutes: number;
}

export interface BookNote {
  id: string;
  /** rich text HTML */
  content: string;
}

export interface Transcription {
  id: string;
  /** base64 data url */
  image: string;
}

export type WorkType = "备课" | "批改" | "回复学生" | "自定义";

export interface WorkTask {
  id: string;
  type: WorkType;
  text: string;
  done: boolean;
}

export type MoodType = "happy" | "calm" | "sad" | "angry" | "tired";

export interface Mood {
  type: MoodType;
  note?: string;
}

export interface DiaryEntry {
  content: string;
  /** base64 data urls */
  images: string[];
}

export interface DayData {
  /** ISO date string (yyyy-mm-dd) of this day */
  date: string;
  todos: Todo[];
  /** 学习-生词：打字文稿 + 图片 */
  vocab: StudyBlock;
  /** 学习-语法：打字文稿 + 图片 */
  grammar: StudyBlock;
  reading: ReadingRecord[];
  notes: BookNote[];
  transcriptions: Transcription[];
  work: WorkTask[];
  mood: Mood | null;
  diary: DiaryEntry | null;
}

export interface WeekGoal {
  id: string;
  text: string;
  done: boolean;
}

export interface Week {
  id: string;
  /** e.g. "Week 1" */
  name: string;
  /** e.g. "8.3—8.9" */
  label: string;
  year: number;
  /** ISO date of Monday */
  startDate: string;
  days: DayData[]; // exactly 7
  goals: WeekGoal[];
}

export interface AppData {
  weeks: Week[];
  selectedWeekId: string | null;
  /** 体重记录：ISO 日期 -> 体重(kg) */
  weights: Record<string, number>;
  /** 目标体重(kg) */
  targetWeight: number | null;
  /** 例假日期集合（ISO 日期） */
  periodDays: string[];
  /** 周期长度（天） */
  periodCycle: number;
  /** 典型持续时间（天） */
  periodDuration: number;
}
