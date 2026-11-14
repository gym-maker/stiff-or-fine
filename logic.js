// Pure game logic (no DOM) so it can be tested in Node.
export const ROUND_SECONDS = 60;
export const WRONG_PENALTY = 2;
const DAY_ONE = Date.UTC(2026, 10, 14); // Daily #1 = 2026-11-14

export function localDateKey(d = new Date()) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
export function dailyNumber(d = new Date()) {
  const today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor((today - DAY_ONE) / 86400000) + 1;
}
// mulberry32
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function multiplier(streak) { return Math.min(5, 1 + Math.floor(streak / 3)); }

export function newState() {
  return { score: 0, streak: 0, bestStreak: 0, answers: [], penalty: 0 };
}
// Returns {correct, points}. Mutates state.
export function answer(state, item, saidStiff) {
  const correct = Boolean(item.s) === Boolean(saidStiff);
  let points = 0;
  if (correct) {
    points = 10 * multiplier(state.streak);
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.score += points;
  } else {
    state.streak = 0;
    state.penalty += WRONG_PENALTY;
  }
  state.answers.push({ item, correct, saidStiff: Boolean(saidStiff) });
  return { correct, points };
}
export function accuracy(state) {
  if (!state.answers.length) return 0;
  return Math.round(100 * state.answers.filter(a => a.correct).length / state.answers.length);
}
export const RANKS = [
  { min: 0,   en: "Reply-All Menace",          ko: "전체회신 빌런",         enLine: "Every inbox fears you. Lovingly.", koLine: "모두의 받은편지함이 당신을 두려워해요. 애정을 담아서." },
  { min: 60,  en: "Per-My-Last-Email Warrior", ko: "'지난 메일 참고' 전사",  enLine: "You've sent at least one 'as per my last email'. We know.", koLine: "'as per my last email' 한 번쯤 보내 보셨죠? 다 알아요." },
  { min: 150, en: "Circle-Back Apprentice",    ko: "리마인드 수습생",       enLine: "Getting there. Fewer 'kindly reverts', please.", koLine: "거의 다 왔어요. 'kindly revert'만 조금 줄여요." },
  { min: 300, en: "Clear Communicator",        ko: "깔끔한 메일러",         enLine: "People actually read your emails. Rare.", koLine: "사람들이 당신 메일은 끝까지 읽어요. 귀한 능력이에요." },
  { min: 500, en: "Inbox Diplomat",            ko: "받은편지함 외교관",     enLine: "You could make 'per my last email' sound kind.", koLine: "'per my last email'도 다정하게 바꿀 수 있는 사람이에요." },
  { min: 800, en: "Email Whisperer",           ko: "메일 마스터",           enLine: "Stiff phrases leave your drafts on their own.", koLine: "딱딱한 표현이 알아서 피해 가는 수준이에요." },
];
export function rankFor(score) {
  let r = RANKS[0];
  for (const x of RANKS) if (score >= x.min) r = x;
  return r;
}
export function emojiGrid(state, max = 20) {
  return state.answers.slice(0, max).map(a => (a.correct ? "🟩" : "🟥")).join("");
}
export function shareText(state, { lang, mode, day, url }) {
  const r = rankFor(state.score);
  const right = state.answers.filter(a => a.correct).length;
  if (lang === "ko") {
    const head = mode === "daily" ? `영어 메일 감각 테스트 데일리 #${day}` : "영어 메일 감각 테스트";
    return `${head}\n🏅 ${r.ko} · ${state.score}점 (${right}/${state.answers.length} 정답)\n${emojiGrid(state)}\n딱딱해 vs 괜찮아, 60초 도전 👉 ${url}`;
  }
  const head = mode === "daily" ? `Stiff or Fine? Daily #${day}` : "Stiff or Fine?";
  return `${head}\n🏅 ${r.en} · ${state.score} pts (${right}/${state.answers.length} right)\n${emojiGrid(state)}\nCan you beat it? 👉 ${url}`;
}
