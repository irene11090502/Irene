// Daily motivational quotes (zh + en). Picked by day-of-year for a stable daily rotate.

export interface Quote {
  zh: string;
  en: string;
}

export const QUOTES: Quote[] = [
  { zh: "今天的努力，是幸运的伏笔。", en: "Today's effort is the foreshadowing of luck." },
  { zh: "慢慢来，比较快。", en: "Slow is smooth, smooth is fast." },
  { zh: "你不必完美，只要在路上。", en: "You don't have to be perfect, just on the way." },
  { zh: "把简单的事做好，就是不简单。", en: "Doing simple things well is itself remarkable." },
  { zh: "成长是把委屈撑大的过程。", en: "Growth is the process of expanding your capacity." },
  { zh: "种一棵树最好的时间是十年前，其次是现在。", en: "The best time to plant a tree was ten years ago; the next best is now." },
  { zh: "温柔而坚定，是成年人的勇敢。", en: "Gentle and firm — that is adult courage." },
  { zh: "你读过的书，会变成你的气质。", en: "Books you read become part of who you are." },
  { zh: "每一天都是新的开始。", en: "Every day is a fresh beginning." },
  { zh: "先做重要的事，剩下的交给时间。", en: "Do the important thing first; leave the rest to time." },
  { zh: "保持热爱，奔赴山海。", en: "Hold on to passion and head for the mountains and seas." },
  { zh: "自律给你自由。", en: "Discipline gives you freedom." },
  { zh: "微小的进步，也是进步。", en: "A tiny step forward is still a step forward." },
  { zh: "愿你眼里有光，心中有爱。", en: "May your eyes shine and your heart be full of love." },
];

export function quoteForDate(iso: string): Quote {
  const [y, m, d] = iso.split("-").map(Number);
  const dayOfYear = Math.floor(
    (Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
