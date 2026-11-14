import { PHRASES } from "./data.js";
import * as L from "./logic.js";
import { createEngine } from "./engine.js";
import { initAudio, setMuted, isMuted } from "./sfx.js";

const SITE = "https://gym-maker.github.io/stiff-or-fine/";
const LINK_BASE = {
  tool: "https://gym-maker.github.io/email-phrase-fixer/",
  sample: "https://3368936654923.gumroad.com/l/pjgcqqj",
  tracker: "https://3368936654923.gumroad.com/l/mkupyy",
  book: "https://3368936654923.gumroad.com/l/efgbup",
  ko: "https://3368936654923.gumroad.com/l/tblbvl",
};
function trafficSource() {
  const q = new URLSearchParams(location.search);
  const hinted = (q.get("src") || q.get("from") || "").toLowerCase();
  if (hinted.includes("itch")) return "itch";
  if (hinted.includes("gamejolt") || hinted === "gj") return "gamejolt";
  const hay = `${location.hostname} ${document.referrer}`;
  if (/itch\.(io|zone)|itch\.fun/i.test(hay)) return "itch";
  if (/gamejolt\.(com|net|io)/i.test(hay)) return "gamejolt";
  return "web";
}
function withUtm(url, term) {
  const u = new URL(url);
  u.searchParams.set("utm_source", "inbox_defense");
  u.searchParams.set("utm_medium", "game");
  u.searchParams.set("utm_campaign", "endscreen");
  u.searchParams.set("utm_content", trafficSource());
  if (term) u.searchParams.set("utm_term", term);
  return u.toString();
}
function applyCtas() {
  $("cta-tool").href = withUtm(LINK_BASE.tool);
  $("cta-sample").href = withUtm(LINK_BASE.sample);
  $("cta-tracker").href = withUtm(LINK_BASE.tracker, "tracker5");
  $("cta-book").href = withUtm(lang === "ko" ? LINK_BASE.ko : LINK_BASE.book);
  $("cta-sample").hidden = lang === "ko";
  $("cta-tracker").hidden = lang === "ko";
  const foot = $("foot-link");
  if (foot) foot.href = withUtm(lang === "ko" ? LINK_BASE.ko : LINK_BASE.book);
}
const pick = a => a[Math.floor(Math.random() * a.length)];

const T = {
  en: {
    brand: "Inbox Defense", kicker: "Stiff or Fine? · a 90-second office arcade",
    title: 'Shred the <span class="stiff">stiff</span> emails. Keep the <span class="fine">fine</span> ones.',
    lede: "Emails rain into your inbox. Swipe through the stiff, bossy, passive-aggressive ones before they land. Let the polite ones through.",
    how1: "✋ <b>Swipe</b> across an email (or tap it) to shred it",
    how2: '💣 Shred a <b class="fine">fine</b> one, or let a <b class="stiff">stiff</b> one land, and the boss gets angrier. 3 strikes and he explodes. 10 good calls calm him down.',
    how3: "⚡ Slice 2–3 in one swipe for a chain bonus · ☕ slows time · 🏝️ clears the inbox",
    daily: "Play today's shift", practice: "Practice shift", score: "Score", shredded: "Shredded",
    beststreak: "Best streak", share: "Share result", copy: "Copy text",
    copied: "Copied", copyFail: "Copy failed", onx: "Post on X", save: "Save image", again: "Play again",
    misses: "What went wrong, and what to send instead", promoTitle: "Fix your own emails",
    promoBody: "Paste a real draft into the free Email Phrase Fixer. It flags stiff phrases and suggests plainer ones. It runs in your browser and nothing is uploaded. You can also grab 5 free sample emails, a $5 follow-up tracker with 30 templates, or the $19 book Send This Instead.",
    ctaTool: "Open the free Email Phrase Fixer", ctaSample: "Get 5 free sample emails", ctaTracker: "Get the $5 follow-up tracker + 30 templates", ctaBook: "Buy Send This Instead — $19",
    foot: 'Made by <a id="foot-link" href="#">Send This Instead</a>, with AI help. No sign-up, no tracking. Scores stay on your device.',
    langBtn: "한국어", tray: "📥 INBOX · the boss reads all of it", healed: "😌 Boss calmed down +❤️",
    chain: n => `${n}× CHAIN!`, combo: (s, m) => `${s} STREAK · ×${m}`, oopsFine: "That one was fine! 😱", oopsStiff: "Stiff email landed! 😬",
    survived: b => `6 PM! Survived +${b}`,
    best: (d, all) => `Your best today: ${d ?? "–"} · All-time: ${all ?? "–"}`,
    mode: (m, n) => (m === "daily" ? `Daily #${n} · result` : "Practice · result"),
    endDead: c => `🤯 The boss exploded at ${c}.`, endWin: "🏠 You survived until 6 PM. Go home.",
    noMiss: "No mistakes. The boss is suspicious of how calm he feels.",
    wasFineShredded: "You shredded a fine email:", wasStiffLanded: "This stiff one reached the inbox:", sendInstead: "Send instead:",
    cardTitle: "Inbox Defense", cardSub: "Stiff or Fine? · office arcade", cardPts: "pts", cardShred: "shredded", cardStreak: "best streak",
    reddit: "Inbox Defense: I shredded stiff work emails for 90 seconds",
    lines: {
      start: ["Inbox opens at 9. Don't let me down.", "New day, new emails. Shred the stiff ones.", "If I see 'kindly revert' I'm leaving."],
      slashFine: ["You shredded a THANK-YOU note?!", "That was the CEO saying hi.", "HR would like a word.", "Why is the client crying?"],
      stiffLanded: ["Who let 'kindly revert' in?!", "'As per my last email'… in MY inbox?", "My eye is twitching.", "I'm forwarding this to everyone."],
      lastLife: ["ONE more and I explode.", "I can feel my blood pressure.", "Last warning. I mean it."],
      combo: ["Coworker: legend. 🙌", "Coworker: teach me your ways.", "Coworker: inbox zero energy.", "Coworker: promote this person."],
      coffee: ["☕ Coffee! Everything slows down."], ooo: ["🏝️ Out of Office! Inbox cleared."],
      survive: ["6 PM. Go home, legend."], heal: ["Okay… that's better.", "Fine. I'm calming down.", "Breathing… breathing…"],
    },
  },
  ko: {
    brand: "받은편지함 지키기", kicker: "딱딱해 or 괜찮아? · 90초 오피스 아케이드",
    title: '<span class="stiff">딱딱한</span> 영어 메일은 파쇄, <span class="fine">괜찮은</span> 메일은 통과!',
    lede: "받은편지함으로 영어 메일이 쏟아져요. 딱딱하거나 명령조이거나 은근히 날 선 메일은 떨어지기 전에 쓱 베어 버리고, 공손한 메일은 그냥 통과시키세요.",
    how1: "✋ 메일 위를 <b>쓱 긋거나</b> 탭하면 파쇄돼요",
    how2: '💣 <b class="fine">괜찮은</b> 메일을 파쇄하거나 <b class="stiff">딱딱한</b> 메일이 들어오면 부장님 화가 쌓여요. 3번이면 폭발! 10번 잘 맞히면 다시 진정돼요.',
    how3: "⚡ 한 번에 2~3개 베면 체인 보너스 · ☕ 시간 느리게 · 🏝️ 메일함 싹 정리",
    daily: "오늘의 근무 시작", practice: "연습 근무", score: "점수", shredded: "파쇄",
    beststreak: "최고 연속", share: "결과 공유", copy: "텍스트 복사",
    copied: "복사됨", copyFail: "복사 실패", onx: "X에 올리기", save: "이미지 저장", again: "다시 하기",
    misses: "틀린 메일과 이렇게 쓰면 되는 표현", promoTitle: "내 메일도 고쳐 보기",
    promoBody: "실제로 쓴 영어 메일을 무료 Email Phrase Fixer에 붙여 넣어 보세요. 딱딱한 표현을 찾아서 더 자연스러운 표현을 알려 줘요. 브라우저 안에서만 돌아가고 아무것도 업로드되지 않아요. 더 많은 예문이 필요하면 $12 전자책 『그대로 보내면 되는 영어 업무 메일 80개』도 있어요.",
    ctaTool: "무료 교정기 열기", ctaSample: "무료 샘플 메일 5통", ctaTracker: "Get the $5 follow-up tracker + 30 templates", ctaBook: "전자책 $12 · 『그대로 보내면 되는 영어 업무 메일 80개』",
    foot: '<a id="foot-link" href="#">Send This Instead</a>가 AI의 도움을 받아 만들었어요. 가입도 추적도 없고, 점수는 내 기기에만 저장돼요.',
    langBtn: "English", tray: "📥 받은편지함 · 부장님이 다 읽어요", healed: "😌 부장님 진정 +❤️",
    chain: n => `${n}연속 베기!`, combo: (s, m) => `${s}연속 · ×${m}`, oopsFine: "괜찮은 메일이었어요! 😱", oopsStiff: "딱딱한 메일 도착! 😬",
    survived: b => `6시 칼퇴! +${b}`,
    best: (d, all) => `오늘 최고 점수: ${d ?? "–"} · 역대 최고: ${all ?? "–"}`,
    mode: (m, n) => (m === "daily" ? `데일리 #${n} 결과` : "연습 근무 결과"),
    endDead: c => `🤯 ${c}에 부장님이 폭발했어요.`, endWin: "🏠 6시까지 버텼어요. 칼퇴!",
    noMiss: "실수 0개. 부장님이 너무 평온해서 오히려 불안해해요.",
    wasFineShredded: "괜찮은 메일을 파쇄했어요:", wasStiffLanded: "딱딱한 메일이 들어왔어요:", sendInstead: "이렇게 쓰세요:",
    cardTitle: "받은편지함 지키기", cardSub: "딱딱해 or 괜찮아? · 영어 메일 아케이드", cardPts: "점", cardShred: "파쇄", cardStreak: "최고 연속",
    reddit: "받은편지함 지키기: 90초 동안 딱딱한 영어 메일 파쇄하기",
    lines: {
      start: ["9시 업무 시작. 실망시키지 마.", "오늘도 메일 폭탄이다. 딱딱한 건 다 잘라.", "'kindly revert' 보이면 나 퇴사한다."],
      slashFine: ["감사 메일을 파쇄했다고?!", "그거 대표님 인사 메일이었어.", "인사팀에서 잠깐 보재.", "클라이언트가 울고 있어."],
      stiffLanded: ["누가 'kindly revert' 들여보냈어?!", "'As per my last email'이 내 메일함에?", "눈 밑이 떨린다.", "이거 전체 회신으로 돌린다."],
      lastLife: ["한 번만 더 하면 나 폭발한다.", "혈압 오르는 소리 들리지?", "마지막 경고야."],
      combo: ["동료: 전설이다 🙌", "동료: 비법 좀 알려줘요.", "동료: 받은편지함 제로 기운.", "동료: 이분 승진시켜 주세요."],
      coffee: ["☕ 커피 수혈! 시간이 느려져요."], ooo: ["🏝️ 부재중 자동응답! 메일함 싹 정리."],
      survive: ["6시 칼퇴! 수고했어."], heal: ["음… 좀 낫네.", "그래, 진정됐다.", "후… 심호흡 중…"],
    },
  },
};

const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
const params = new URLSearchParams(location.search);
let lang = params.get("lang") || store.get("sof-lang") || ((navigator.language || "").startsWith("ko") ? "ko" : "en");
if (!T[lang]) lang = "en";
const t = k => T[lang][k];
const day = L.dailyNumber();
let mode = "daily", state = null;
const MOODS = ["🤯", "😡", "😒", "😌"];
let bubbleTimer = 0, lastLives = 3, lastMult = 1;

const engine = createEngine($("cv"), {
  phrases: PHRASES,
  t: k => t(k),
  hud(st) {
    $("hud-score").textContent = st.score;
    const m = L.multiplier(st.streak);
    $("hud-combo").textContent = st.streak ? `×${m} · ${st.streak}🔥` : "×1";
    if (m !== lastMult) { const c = $("hud-combo"); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); lastMult = m; }
    if (st.lives !== lastLives) {
      const b = $("boss"); b.textContent = MOODS[st.lives]; b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit");
      $("lives").textContent = "❤️".repeat(st.lives) + "🖤".repeat(L.LIVES - st.lives);
      lastLives = st.lives;
    }
  },
  clock(text, tsec) { const c = $("hud-clock"); c.textContent = text; c.classList.toggle("late", tsec > 70); },
  say(key) {
    const b = $("bubble"); b.textContent = (MOODS[engine.state ? engine.state.lives : 3] || "😌") + " " + pick(t("lines")[key]);
    b.classList.add("show"); clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => b.classList.remove("show"), 1800);
  },
  vibrate(p) { try { if (navigator.vibrate && store.get("sof-mute") !== "1") navigator.vibrate(p); } catch {} },
  boom() { const b = $("boss"); b.textContent = "🤯"; b.classList.remove("hit"); b.classList.add("boom"); },
  over(st) { state = st; finish(); },
});

function applyLang() {
  document.documentElement.lang = lang;
  document.title = lang === "ko" ? "받은편지함 지키기: 딱딱한 영어 메일 파쇄 게임" : "Inbox Defense: shred the stiff emails (Stiff or Fine?)";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $("lang").textContent = t("langBtn");
  $("lang").setAttribute("aria-label", lang === "ko" ? "Switch to English" : "한국어로 바꾸기");
  $("daily-no").textContent = `#${day}`;
  applyCtas();
  showBest();
  if (state && !$("screen-result").hidden) renderResult();
}
function showBest() {
  const d = store.get(`sof2-best-${day}`), all = store.get("sof2-best");
  $("best").textContent = d || all ? t("best")(d, all) : "";
}
function show(id) {
  for (const s of ["start", "game", "result"]) $(`screen-${s}`).hidden = s !== id;
  document.body.classList.toggle("playing", id === "game");
}
function start(m) {
  initAudio();
  mode = m; state = null; lastLives = L.LIVES; lastMult = 1;
  const b = $("boss"); b.className = "boss"; b.textContent = MOODS[3];
  $("lives").textContent = "❤️❤️❤️";
  show("game");
  window.scrollTo(0, 0);
  requestAnimationFrame(() => engine.start(m === "daily" ? L.localDateKey() : (Math.random() * 2 ** 32) >>> 0));
}
function finish() {
  const best = +store.get("sof2-best") || 0;
  if (state.score > best) store.set("sof2-best", state.score);
  if (mode === "daily") { const bd = +store.get(`sof2-best-${day}`) || 0; if (state.score > bd) store.set(`sof2-best-${day}`, state.score); }
  show("result"); renderResult();
  $("again").focus({ preventScroll: true }); window.scrollTo({ top: 0 });
}
function shareUrl() { return lang === "ko" ? `${SITE}?lang=ko` : SITE; }
function renderResult() {
  const r = L.rankFor(state.score);
  $("res-mode").textContent = t("mode")(mode, day);
  $("rank-title").textContent = lang === "ko" ? r.ko : r.en;
  $("rank-line").textContent = lang === "ko" ? r.koLine : r.enLine;
  $("res-end").textContent = state.survived ? t("endWin") : t("endDead")(L.clockText(state.t));
  $("res-score").textContent = state.score;
  $("res-shred").textContent = state.slashed;
  $("res-streak").textContent = state.bestStreak;
  $("res-grid").textContent = L.emojiGrid(state, 40);
  const text = L.shareText(state, { lang, mode, day, url: shareUrl() });
  $("share-x").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  $("share-reddit").href = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl())}&title=${encodeURIComponent(`${t("reddit")} (${lang === "ko" ? r.ko : r.en}, ${state.score})`)}`;
  const ol = $("misses"); ol.replaceChildren();
  const missed = state.answers.filter(a => !a.correct);
  if (!missed.length) { const li = document.createElement("li"); li.textContent = t("noMiss"); ol.append(li); }
  for (const a of missed) {
    const li = document.createElement("li");
    const head = document.createElement("small"); head.className = "muted"; head.textContent = a.item.s ? t("wasStiffLanded") : t("wasFineShredded"); li.append(head);
    const p = document.createElement("div"); p.textContent = `“${a.item.p}”`; if (a.item.s) p.className = "bad-p"; li.append(p);
    if (a.item.s) { const g = document.createElement("div"); g.className = "good-p"; g.textContent = `${t("sendInstead")} ${a.item.f}`; li.append(g); }
    const w = document.createElement("small"); w.className = "muted"; w.textContent = lang === "ko" ? a.item.k : a.item.w; li.append(w);
    ol.append(li);
  }
  $("misses-box").open = missed.length > 0;
  drawCard();
}

let cardBlob = null;
function drawCard() {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1080;
  const x = c.getContext("2d"), r = L.rankFor(state.score);
  const sans = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
  x.fillStyle = "#1A1814"; x.fillRect(0, 0, 1080, 1080);
  x.fillStyle = "#FFFBF5"; x.beginPath(); x.roundRect(50, 50, 980, 980, 36); x.fill();
  x.fillStyle = "#A03A20"; x.font = `700 30px ${sans}`; x.fillText(t("cardSub").toUpperCase(), 100, 130);
  x.fillStyle = "#1A1814"; x.font = `900 84px ${sans}`; x.fillText(t("cardTitle"), 100, 225);
  x.fillStyle = "#5C574E"; x.font = `600 34px ${sans}`;
  x.fillText((mode === "daily" ? (lang === "ko" ? `데일리 #${day}` : `Daily #${day}`) : (lang === "ko" ? "연습 근무" : "Practice")) + "  ·  " + (state.survived ? (lang === "ko" ? "🏠 6시 칼퇴" : "🏠 survived to 6 PM") : `🤯 ${L.clockText(state.t)}`), 100, 285);
  x.font = `140px ${sans}`; x.fillText(state.survived ? "😌" : "🤯", 830, 300);
  x.fillStyle = "#A03A20"; x.font = `900 80px ${sans}`;
  fitText(x, `🏅 ${lang === "ko" ? r.ko : r.en}`, 100, 420, 880);
  [[state.score, t("cardPts")], [state.slashed, t("cardShred")], [state.bestStreak, t("cardStreak")]].forEach(([v, l], i) => {
    const bx = 100 + i * 300;
    x.fillStyle = "#F5F0E8"; x.beginPath(); x.roundRect(bx, 480, 270, 180, 20); x.fill();
    x.fillStyle = "#1A1814"; x.font = `900 76px ${sans}`; x.fillText(String(v), bx + 26, 575);
    x.fillStyle = "#5C574E"; x.font = `600 28px ${sans}`; x.fillText(l, bx + 26, 630);
  });
  state.answers.slice(0, 32).forEach((a, i) => {
    x.fillStyle = !a.correct ? "#A03A20" : a.kind === "slash" ? "#1C5446" : "#D4CDBF";
    x.beginPath(); x.roundRect(100 + (i % 16) * 55, 710 + Math.floor(i / 16) * 55, 44, 44, 8); x.fill();
  });
  x.fillStyle = "#1A1814"; x.font = `800 36px ${sans}`; x.fillText(lang === "ko" ? "부장님 폭발 전에 버텨 보세요 👉" : "Can you keep the boss calm? 👉", 100, 905);
  x.fillStyle = "#1C5446"; x.font = `700 32px ${sans}`; x.fillText("gym-maker.github.io/stiff-or-fine", 100, 960);
  const url = c.toDataURL("image/png");
  $("share-img").src = url; $("share-dl").href = url; $("share-dl").download = "inbox-defense.png";
  $("share-img").alt = L.shareText(state, { lang, mode, day, url: "" });
  c.toBlob(b => { cardBlob = b; }, "image/png");
}
function fitText(x, s, px, py, max) {
  let size = parseInt(x.font.match(/(\d+)px/)[1], 10);
  while (x.measureText(s).width > max && size > 30) { size -= 4; x.font = x.font.replace(/\d+px/, `${size}px`); }
  x.fillText(s, px, py);
}
const tipTimers = new WeakMap();
function report(button, ok) {
  const tip = button.nextElementSibling;
  clearTimeout(tipTimers.get(button)); tip.textContent = "";
  requestAnimationFrame(() => (tip.textContent = ok ? t("copied") : t("copyFail")));
  tipTimers.set(button, setTimeout(() => (tip.textContent = ""), 2000));
}
async function copyText() {
  const btn = $("share-copy");
  try { await navigator.clipboard.writeText(L.shareText(state, { lang, mode, day, url: shareUrl() })); report(btn, true); }
  catch { report(btn, false); }
}
async function nativeShare() {
  const text = L.shareText(state, { lang, mode, day, url: shareUrl() });
  const file = cardBlob ? new File([cardBlob], "inbox-defense.png", { type: "image/png" }) : null;
  try {
    if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ text, files: [file] });
    else if (navigator.share) await navigator.share({ text });
    else return copyText();
  } catch (e) { if (e?.name !== "AbortError") copyText(); }
}

function syncMute() { const m = store.get("sof-mute") === "1"; setMuted(m); $("mute").textContent = m ? "🔇" : "🔊"; $("mute").setAttribute("aria-label", m ? "Unmute sound" : "Mute sound"); }
$("mute").addEventListener("click", () => { store.set("sof-mute", isMuted() ? "0" : "1"); syncMute(); });
$("play-daily").addEventListener("click", () => start("daily"));
$("play-practice").addEventListener("click", () => start("practice"));
$("again").addEventListener("click", () => start(mode));
$("share-copy").addEventListener("click", copyText);
$("share-native").addEventListener("click", nativeShare);
$("lang").addEventListener("click", () => {
  lang = lang === "ko" ? "en" : "ko"; store.set("sof-lang", lang);
  const u = new URL(location.href); u.searchParams.set("lang", lang); history.replaceState(null, "", u);
  applyLang();
});
document.addEventListener("keydown", e => {
  if ($("screen-game").hidden) return;
  if (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key.toLowerCase() === "s") { e.preventDefault(); engine.keySlash(); }
});
document.addEventListener("visibilitychange", () => engine.pause(document.hidden));
window.addEventListener("resize", () => engine.resize());
syncMute();
applyLang();
// test hook (harmless): lets automated checks read the game state
window.__sof = { get state() { return engine.state; }, get cards() { return engine.cards; }, get fps() { return engine.fps; }, slash: (c, n) => engine.debugSlash(c, n), end: () => engine.debugEnd() };
