import { PHRASES } from "./data.js";
import * as L from "./logic.js";

const SITE = "https://gym-maker.github.io/stiff-or-fine/";
const UTM = "utm_source=game&utm_medium=web&utm_campaign=stiff_or_fine";
const LINKS = {
  tool: `https://gym-maker.github.io/email-phrase-fixer/?${UTM}`,
  sample: `https://3368936654923.gumroad.com/l/pjgcqqj?${UTM}`,
  book: `https://3368936654923.gumroad.com/l/efgbup?${UTM}`,
  ko: `https://3368936654923.gumroad.com/l/tblbvl?${UTM}`,
};

const T = {
  en: {
    brand: "Stiff or Fine?", kicker: "The 60-second work email test",
    title: 'Is it <span class="stiff">stiff</span> or <span class="fine">fine</span>?',
    lede: "You'll see real phrases from work emails. Some sound stiff, bossy, or passive-aggressive. Some are perfectly fine. Decide fast.",
    how1: '<kbd>←</kbd> or swipe left: <b class="stiff">Stiff</b>', how2: '<kbd>→</kbd> or swipe right: <b class="fine">Fine</b>',
    how3: "Streaks multiply your points. Wrong answers cost 2 seconds.",
    daily: "Play today's challenge", practice: "Practice round", time: "Time", score: "Score", combo: "Combo",
    stiff: "Stiff", fine: "Fine", accuracy: "Accuracy", beststreak: "Best streak", share: "Share result", copy: "Copy text",
    copied: "Copied", copyFail: "Copy failed", onx: "Post on X", save: "Save image", again: "Play again",
    misses: "What you missed, and what to send instead", promoTitle: "Fix your own emails",
    promoBody: "Paste a real draft into the free Email Phrase Fixer. It flags stiff phrases and suggests plainer ones. It runs in your browser and nothing is uploaded.",
    ctaTool: "Open the free fixer", ctaBook: "Get 5 free sample emails",
    foot: 'Made by <a id="foot-link" href="#">Send This Instead</a>, with AI help. No sign-up, no tracking. Scores stay on your device.',
    langBtn: "한국어", right: "Right!", wasStiff: "That one's stiff.", wasFine: "That one's fine.", try: "Try:",
    best: (d, all) => `Your best today: ${d ?? "–"} · All-time: ${all ?? "–"}`, dailyNo: n => `#${n}`,
    mode: (m, n) => (m === "daily" ? `Daily #${n} · result` : "Practice · result"), noMiss: "No misses. Impressive.",
    cardTitle: "Stiff or Fine?", cardSub: "The 60-second work email test", cardPts: "pts", cardAcc: "accuracy", cardStreak: "best streak",
    reddit: "I took the 60-second 'Stiff or Fine?' work email test", subj: "Re: Re: Fwd: quick thing",
  },
  ko: {
    brand: "딱딱해 or 괜찮아?", kicker: "60초 영어 메일 감각 테스트",
    title: '이 영어 메일, <span class="stiff">딱딱해</span>? <span class="fine">괜찮아</span>?',
    lede: "실제 업무 메일에 나오는 영어 표현이 나와요. 딱딱하거나 명령조이거나 은근히 날 선 표현도 있고, 아무 문제 없는 표현도 있어요. 빨리 골라 보세요.",
    how1: '<kbd>←</kbd> 또는 왼쪽으로 밀기: <b class="stiff">딱딱해</b>', how2: '<kbd>→</kbd> 또는 오른쪽으로 밀기: <b class="fine">괜찮아</b>',
    how3: "연속으로 맞히면 점수가 몇 배로 올라가요. 틀리면 2초가 줄어요.",
    daily: "오늘의 도전 시작", practice: "연습 모드", time: "시간", score: "점수", combo: "콤보",
    stiff: "딱딱해", fine: "괜찮아", accuracy: "정답률", beststreak: "최고 연속", share: "결과 공유", copy: "텍스트 복사",
    copied: "복사됨", copyFail: "복사 실패", onx: "X에 올리기", save: "이미지 저장", again: "다시 하기",
    misses: "틀린 문제와 이렇게 쓰면 되는 표현", promoTitle: "내 메일도 고쳐 보기",
    promoBody: "실제로 쓴 영어 메일을 무료 'Email Phrase Fixer'에 붙여 넣어 보세요. 딱딱한 표현을 찾아서 더 자연스러운 표현을 알려 줘요. 브라우저 안에서만 돌아가고 아무것도 업로드되지 않아요.",
    ctaTool: "무료 교정기 열기", ctaBook: "전자책 『그대로 보내면 되는 영어 업무 메일 80개』",
    foot: '<a id="foot-link" href="#">Send This Instead</a>가 AI의 도움을 받아 만들었어요. 가입도 추적도 없고, 점수는 내 기기에만 저장돼요.',
    langBtn: "English", right: "정답!", wasStiff: "딱딱한 표현이에요.", wasFine: "괜찮은 표현이에요.", try: "이렇게:",
    best: (d, all) => `오늘 최고 점수: ${d ?? "–"} · 역대 최고: ${all ?? "–"}`, dailyNo: n => `#${n}`,
    mode: (m, n) => (m === "daily" ? `데일리 #${n} 결과` : "연습 모드 결과"), noMiss: "하나도 안 틀렸어요. 대단해요.",
    cardTitle: "딱딱해 or 괜찮아?", cardSub: "60초 영어 메일 감각 테스트", cardPts: "점", cardAcc: "정답률", cardStreak: "최고 연속",
    reddit: "60초 영어 메일 감각 테스트 해봤어요", subj: "Re: Re: Fwd: 확인 부탁드려요",
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
let mode = "daily", deck = [], idx = 0, state = null, timeLeft = 0, endAt = 0, timer = 0, locked = false, current = null;

function applyLang() {
  document.documentElement.lang = lang;
  document.title = lang === "ko" ? "딱딱해 or 괜찮아? 60초 영어 메일 감각 테스트" : "Stiff or Fine? The 60-second work email test";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $("lang").textContent = t("langBtn");
  $("lang").setAttribute("aria-label", lang === "ko" ? "Switch to English" : "한국어로 바꾸기");
  $("daily-no").textContent = t("dailyNo")(day);
  document.querySelector(".subj").textContent = t("subj");
  $("cta-tool").href = LINKS.tool;
  $("cta-book").href = lang === "ko" ? LINKS.ko : LINKS.sample;
  $("foot-link").href = lang === "ko" ? LINKS.ko : LINKS.book;
  showBest();
  if (state && !$("screen-result").hidden) renderResult();
}
function showBest() {
  const d = store.get(`sof-best-${day}`), all = store.get("sof-best");
  $("best").textContent = d || all ? t("best")(d, all) : "";
}
function show(id) {
  for (const s of ["start", "game", "result"]) $(`screen-${s}`).hidden = s !== id;
}

function start(m) {
  mode = m;
  const seed = m === "daily" ? L.localDateKey() : (Math.random() * 2 ** 32) >>> 0;
  deck = L.shuffle(PHRASES, L.rng(seed));
  idx = 0; state = L.newState(); locked = false;
  endAt = performance.now() + L.ROUND_SECONDS * 1000;
  show("game");
  next();
  tick();
  clearInterval(timer);
  timer = setInterval(tick, 100);
  $("btn-fine").focus({ preventScroll: true });
}
function remaining() { return Math.max(0, (endAt - performance.now()) / 1000 - state.penalty); }
function tick() {
  timeLeft = remaining();
  $("hud-time").textContent = Math.ceil(timeLeft);
  const bar = $("hud-bar");
  bar.style.transform = `scaleX(${timeLeft / L.ROUND_SECONDS})`;
  bar.classList.toggle("low", timeLeft < 10);
  if (timeLeft <= 0) finish();
}
function next() {
  if (idx >= deck.length) { deck = L.shuffle(PHRASES, L.rng(idx + 7)); idx = 0; }
  current = deck[idx++];
  const card = $("card");
  card.style.transform = ""; card.style.opacity = "";
  card.classList.remove("tilt-left", "tilt-right");
  $("verdict").hidden = true;
  $("phrase").textContent = current.p;
}
function choose(saidStiff) {
  if (locked || !state || $("screen-game").hidden) return;
  locked = true;
  const { correct } = L.answer(state, current, saidStiff);
  const v = $("verdict"), card = $("card");
  $("hud-score").textContent = state.score;
  const mult = L.multiplier(state.streak);
  $("hud-combo").textContent = `×${mult}`;
  $("hud-combo").classList.toggle("hot", mult >= 3);
  if (correct) {
    v.className = "verdict ok"; v.textContent = `${t("right")} +${10 * L.multiplier(Math.max(0, state.streak - 1))}`;
  } else {
    v.className = "verdict bad";
    v.textContent = (current.s ? t("wasStiff") : t("wasFine")) + " " + (lang === "ko" ? current.k : current.w);
    if (current.s) { const f = document.createElement("span"); f.className = "fix"; f.textContent = `${t("try")} ${current.f}`; v.append(f); }
  }
  v.hidden = false;
  card.classList.remove("flash-ok", "flash-bad"); void card.offsetWidth;
  card.classList.add(correct ? "flash-ok" : "flash-bad");
  tick();
  setTimeout(() => { locked = false; if (!$("screen-game").hidden) next(); }, correct ? 260 : 1300);
}
function finish() {
  clearInterval(timer);
  if ($("screen-game").hidden) return;
  const best = +store.get("sof-best") || 0;
  if (state.score > best) store.set("sof-best", state.score);
  if (mode === "daily") {
    const bd = +store.get(`sof-best-${day}`) || 0;
    if (state.score > bd) store.set(`sof-best-${day}`, state.score);
  }
  show("result");
  renderResult();
  $("again").focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

function shareUrl() { return lang === "ko" ? `${SITE}?lang=ko` : SITE; }
function renderResult() {
  const r = L.rankFor(state.score);
  $("res-mode").textContent = t("mode")(mode, day);
  $("rank-title").textContent = lang === "ko" ? r.ko : r.en;
  $("rank-line").textContent = lang === "ko" ? r.koLine : r.enLine;
  $("res-score").textContent = state.score;
  $("res-acc").textContent = `${L.accuracy(state)}%`;
  $("res-streak").textContent = state.bestStreak;
  $("res-grid").textContent = L.emojiGrid(state, 40);
  const text = L.shareText(state, { lang, mode, day, url: shareUrl() });
  $("share-x").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  $("share-reddit").href = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl())}&title=${encodeURIComponent(`${t("reddit")}: ${lang === "ko" ? r.ko : r.en}, ${state.score}`)}`;
  const ol = $("misses"); ol.replaceChildren();
  const missed = state.answers.filter(a => !a.correct);
  if (!missed.length) { const li = document.createElement("li"); li.textContent = t("noMiss"); ol.append(li); }
  for (const a of missed) {
    const li = document.createElement("li");
    const p = document.createElement("div"); p.textContent = `“${a.item.p}” → ${a.item.s ? t("stiff") : t("fine")}`;
    if (a.item.s) p.className = "bad-p";
    li.append(p);
    if (a.item.s) { const g = document.createElement("div"); g.className = "good-p"; g.textContent = a.item.f; li.append(g); }
    const w = document.createElement("small"); w.className = "muted"; w.textContent = lang === "ko" ? a.item.k : a.item.w; li.append(w);
    ol.append(li);
  }
  $("misses-box").open = missed.length > 0 && missed.length <= 4;
  drawCard();
}

let cardBlob = null;
function drawCard() {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1080;
  const x = c.getContext("2d");
  const r = L.rankFor(state.score);
  const sans = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
  x.fillStyle = "#F5F0E8"; x.fillRect(0, 0, 1080, 1080);
  x.fillStyle = "#FFFBF5"; x.strokeStyle = "#D4CDBF"; x.lineWidth = 3;
  x.beginPath(); x.roundRect(60, 60, 960, 960, 36); x.fill(); x.stroke();
  x.fillStyle = "#1C5446"; x.fillRect(110, 110, 90, 10);
  x.fillStyle = "#A03A20"; x.font = `700 30px ${sans}`; x.fillText(t("cardSub").toUpperCase(), 110, 175);
  x.fillStyle = "#1A1814"; x.font = `800 76px ${sans}`; x.fillText(t("cardTitle"), 110, 260);
  x.fillStyle = "#5C574E"; x.font = `600 34px ${sans}`;
  x.fillText(mode === "daily" ? (lang === "ko" ? `데일리 #${day}` : `Daily #${day}`) : (lang === "ko" ? "연습 모드" : "Practice"), 110, 320);
  x.fillStyle = "#A03A20"; x.font = `800 ${lang === "ko" ? 88 : 80}px ${sans}`;
  fitText(x, `🏅 ${lang === "ko" ? r.ko : r.en}`, 110, 450, 860);
  const stats = [[state.score, t("cardPts")], [`${L.accuracy(state)}%`, t("cardAcc")], [state.bestStreak, t("cardStreak")]];
  stats.forEach(([v, l], i) => {
    const bx = 110 + i * 290;
    x.fillStyle = "#F5F0E8"; x.beginPath(); x.roundRect(bx, 510, 260, 170, 20); x.fill();
    x.fillStyle = "#1A1814"; x.font = `800 72px ${sans}`; x.fillText(String(v), bx + 26, 600);
    x.fillStyle = "#5C574E"; x.font = `600 28px ${sans}`; x.fillText(l, bx + 26, 652);
  });
  state.answers.slice(0, 30).forEach((a, i) => {
    x.fillStyle = a.correct ? "#1C5446" : "#A03A20";
    x.beginPath(); x.roundRect(110 + (i % 15) * 58, 730 + Math.floor(i / 15) * 58, 46, 46, 8); x.fill();
  });
  x.fillStyle = "#1A1814"; x.font = `700 34px ${sans}`; x.fillText(lang === "ko" ? "도전해 보세요 👉" : "Can you beat it? 👉", 110, 920);
  x.fillStyle = "#1C5446"; x.font = `600 30px ${sans}`; x.fillText("gym-maker.github.io/stiff-or-fine", 110, 965);
  const url = c.toDataURL("image/png");
  $("share-img").src = url; $("share-dl").href = url;
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
  clearTimeout(tipTimers.get(button));
  tip.textContent = "";
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
  const file = cardBlob ? new File([cardBlob], "stiff-or-fine.png", { type: "image/png" }) : null;
  try {
    if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ text, files: [file] });
    else if (navigator.share) await navigator.share({ text });
    else return copyText();
  } catch (e) { if (e?.name !== "AbortError") copyText(); }
}

// swipe
function initSwipe() {
  const card = $("card");
  let sx = 0, dx = 0, active = false;
  card.addEventListener("pointerdown", e => { if (locked) return; active = true; sx = e.clientX; dx = 0; card.classList.add("dragging"); card.setPointerCapture(e.pointerId); });
  card.addEventListener("pointermove", e => {
    if (!active) return;
    dx = e.clientX - sx;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
    card.classList.toggle("tilt-left", dx < -40); card.classList.toggle("tilt-right", dx > 40);
  });
  const end = () => {
    if (!active) return; active = false; card.classList.remove("dragging");
    if (Math.abs(dx) > 80) { card.style.transform = `translateX(${Math.sign(dx) * 30}px)`; choose(dx < 0); }
    else { card.style.transform = ""; card.classList.remove("tilt-left", "tilt-right"); }
  };
  card.addEventListener("pointerup", end); card.addEventListener("pointercancel", end);
}

$("play-daily").addEventListener("click", () => start("daily"));
$("play-practice").addEventListener("click", () => start("practice"));
$("again").addEventListener("click", () => start(mode));
$("btn-stiff").addEventListener("click", () => choose(true));
$("btn-fine").addEventListener("click", () => choose(false));
$("share-copy").addEventListener("click", copyText);
$("share-native").addEventListener("click", nativeShare);
$("lang").addEventListener("click", () => {
  lang = lang === "ko" ? "en" : "ko"; store.set("sof-lang", lang);
  const u = new URL(location.href); u.searchParams.set("lang", lang); history.replaceState(null, "", u);
  applyLang();
});
document.addEventListener("keydown", e => {
  if ($("screen-game").hidden) return;
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "s") { e.preventDefault(); choose(true); }
  if (e.key === "ArrowRight" || e.key.toLowerCase() === "f") { e.preventDefault(); choose(false); }
});
document.addEventListener("visibilitychange", () => { if (!document.hidden && state && !$("screen-game").hidden) tick(); });
initSwipe();
applyLang();
// test hook (harmless): expose state for automated checks
window.__sof = { get state() { return state; }, finish: () => { endAt = 0; tick(); } };
