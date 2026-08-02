// ---------------------------------------------------------------------------
// Lightweight date helpers (no external date library)
// All stored dates are ISO yyyy-mm-dd strings.
// ---------------------------------------------------------------------------

const WEEKDAYS_CN = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function addDaysDate(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** Monday of the week that contains the given ISO date. */
export function startOfWeekMonday(iso: string): string {
  const d = parseISO(iso);
  const day = d.getDay(); // 0 = Sun, 1 = Mon ...
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(toISO(d), diff);
}

/** Build "8.3—8.9" style label for a Monday-start week. */
export function weekLabel(mondayISO: string): string {
  const start = parseISO(mondayISO);
  const end = parseISO(addDays(mondayISO, 6));
  const fmt = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
  return `${fmt(start)}—${fmt(end)}`;
}

/** "8 月 3 日" */
export function formatMonthDay(iso: string): string {
  const d = parseISO(iso);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export function weekdayName(iso: string): string {
  return WEEKDAYS_CN[parseISO(iso).getDay()];
}

export function daysBetween(a: string, b: string): number {
  const ms = parseISO(b).getTime() - parseISO(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function todayISO(): string {
  return toISO(new Date());
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

/** Predict the next period start based on the most recent record + cycle. */
export function predictNextPeriod(records: { start: string; cycle: number }[]): string | null {
  if (records.length === 0) return null;
  const sorted = [...records].sort((a, b) => (a.start < b.start ? 1 : -1));
  const latest = sorted[0];
  const avgCycle =
    sorted.reduce((s, r) => s + r.cycle, 0) / (sorted.length || 1);
  return addDays(latest.start, Math.round(avgCycle));
}
