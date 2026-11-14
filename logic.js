// Pure game logic (no DOM) so it can be tested in Node.
export const DAY_SECONDS = 90;          // 9 AM -> 6 PM
export const LIVES = 3;
export const HEAL_EVERY = 10;          // 10 correct calls while hurt = boss calms down (+1 life)
const DAY_ONE = Date.UTC(2026, 10, 14); // Daily #1 = 2026-11-14

export function localDateKey(d = new Date()) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
export function dailyNumber(d = new Date()) {
  const today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor((today - DAY_ONE) / 86400000) + 1;
}
export function rng(seed) { // mulberry32
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
// Difficulty curves (t = game seconds). Speed in px/s for a 700px-tall field.
export function fallSpeed(t) { return 105 + 2.5 * t; }
export function spawnGap(t) { return Math.max(0.48, 1.2 - 0.0095 * t); }
export function multiplier(streak) { return Math.min(5, 1 + Math.floor(streak / 5)); }

export function newState() {
  return { score: 0, streak: 0, bestStreak: 0, lives: LIVES, answers: [], slashed: 0, t: 0, survived: false, calm: 0, heals: 0 };
}
// kind: "slash" (player shredded it) or "land" (it reached the inbox). Mutates state.
export function resolve(state, item, kind, chain = 1) {
  const correct = kind === "slash" ? Boolean(item.s) : !item.s;
  let points = 0, healed = false;
  if (correct) {
    const base = kind === "slash" ? 10 : 5;
    const chainBonus = kind === "slash" && chain > 1 ? chain : 1; // multi-slash in one swipe
    points = base * multiplier(state.streak) * chainBonus;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.score += points;
    if (kind === "slash") state.slashed += 1;
    if (state.lives < LIVES && ++state.calm >= HEAL_EVERY) { state.lives += 1; state.calm = 0; state.heals += 1; healed = true; }
  } else {
    state.streak = 0;
    state.lives = Math.max(0, state.lives - 1);
  }
  state.answers.push({ item, kind, correct });
  return { correct, points, healed, dead: state.lives === 0 };
}
export function surviveBonus(state) { return state.lives * 100; }
export function accuracy(state) {
  if (!state.answers.length) return 0;
  return Math.round(100 * state.answers.filter(a => a.correct).length / state.answers.length);
}
export function clockText(t) { // 9:00 AM + t/90 * 9h
  const mins = Math.min(9 * 60, Math.floor((t / DAY_SECONDS) * 9 * 60));
  const h = 9 + Math.floor(mins / 60), m = mins % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
export const RANKS = [
  { min: 0,    en: "Reply-All Menace",          ko: "전체회신 빌런",         enLine: "Every inbox fears you. Lovingly.", koLine: "모두의 받은편지함이 당신을 두려워해요. 애정을 담아서." },
  { min: 200,  en: "Per-My-Last-Email Warrior", ko: "'지난 메일 참고' 전사",  enLine: "You've sent at least one 'as per my last email'. We know.", koLine: "'as per my last email' 한 번쯤 보내 보셨죠? 다 알아요." },
  { min: 600,  en: "Circle-Back Apprentice",    ko: "리마인드 수습생",       enLine: "Getting there. Fewer 'kindly reverts', please.", koLine: "거의 다 왔어요. 'kindly revert'만 조금 줄여요." },
  { min: 1200,  en: "Clear Communicator",        ko: "깔끔한 메일러",         enLine: "People actually read your emails. Rare.", koLine: "사람들이 당신 메일은 끝까지 읽어요. 귀한 능력이에요." },
  { min: 2200, en: "Inbox Diplomat",            ko: "받은편지함 외교관",     enLine: "The boss went home calm. A miracle.", koLine: "부장님이 평온하게 퇴근했어요. 기적이에요." },
  { min: 3500, en: "Email Whisperer",           ko: "메일 마스터",           enLine: "Stiff phrases leave your drafts on their own.", koLine: "딱딱한 표현이 알아서 피해 가는 수준이에요." },
];
export function rankFor(score) {
  let r = RANKS[0];
  for (const x of RANKS) if (score >= x.min) r = x;
  return r;
}
export function emojiGrid(state, max = 20) {
  return state.answers.slice(0, max).map(a => (a.correct ? (a.kind === "slash" ? "🟩" : "⬜") : "🟥")).join("");
}
export function shareText(state, { lang, mode, day, url }) {
  const r = rankFor(state.score);
  const clock = clockText(state.t);
  if (lang === "ko") {
    const head = mode === "daily" ? `받은편지함 지키기 데일리 #${day}` : "받은편지함 지키기";
    const end = state.survived ? "🏠 6시 칼퇴 성공" : `🤯 ${clock}에 부장님 폭발`;
    return `${head}\n🏅 ${r.ko} · ${state.score}점 · 딱딱한 메일 ${state.slashed}개 파쇄\n${end}\n${emojiGrid(state)}\n도전 👉 ${url}`;
  }
  const head = mode === "daily" ? `Inbox Defense Daily #${day}` : "Inbox Defense";
  const end = state.survived ? "🏠 Survived till 6 PM" : `🤯 Boss exploded at ${clock}`;
  return `${head}\n🏅 ${r.en} · ${state.score} pts · ${state.slashed} stiff emails shredded\n${end}\n${emojiGrid(state)}\nCan you beat it? 👉 ${url}`;
}
