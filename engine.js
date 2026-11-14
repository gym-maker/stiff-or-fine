// Inbox Defense: canvas arcade engine.
import * as L from "./logic.js";
import { sfx } from "./sfx.js";

const SENDERS = ["Dana · Sales", "Mr. Park · CFO", "Priya · Legal", "Tom · IT", "Client · Acme", "HR Team", "Jin · Design", "Alex · Ops", "Mina · Marketing", "Vendor · Globex"];
const INK = "#1A1814", PAPER = "#FFFBF5", RUST = "#A03A20", PINE = "#1C5446", LINE = "#D4CDBF", CREAM = "#F5F0E8";
const CONFETTI = ["#A03A20", "#1C5446", "#E0A43A", "#3A6EA5", "#D9638C"];
const MAX_PARTS = 260;

export function createEngine(canvas, hooks) {
  const ctx = canvas.getContext("2d", { alpha: false });
  let W = 0, H = 0, dpr = 1, k = 1, inboxY = 0, bg = null;
  let st, rand, deck, deckIdx, cards, halves, parts, pops, trail;
  let nextSpawn, nextPower, powerCount, realT, slowUntil, hitstop, shake, flash, flashColor, dying, dyingT, ending, raf = 0, last = 0, running = false, paused = false;
  let trayGlow = 0, trayColor = PINE, heartT = 0, lastClock = "";
  const fps = { frames: 0, acc: 0, samples: [] };

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(280, r.width); H = Math.max(360, r.height);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    k = H / 700; inboxY = H - 54;
    bg = document.createElement("canvas"); bg.width = canvas.width; bg.height = canvas.height;
    const b = bg.getContext("2d"); b.scale(dpr, dpr);
    b.fillStyle = CREAM; b.fillRect(0, 0, W, H);
    b.strokeStyle = "rgba(26,24,20,.05)"; b.lineWidth = 1;
    for (let y = 28; y < inboxY; y += 28) { b.beginPath(); b.moveTo(0, y + .5); b.lineTo(W, y + .5); b.stroke(); }
    const g = b.createLinearGradient(0, inboxY - 70, 0, inboxY);
    g.addColorStop(0, "rgba(160,58,32,0)"); g.addColorStop(1, "rgba(160,58,32,.10)");
    b.fillStyle = g; b.fillRect(0, inboxY - 70, W, 70);
    b.fillStyle = INK; b.fillRect(0, inboxY, W, H - inboxY);
    b.fillStyle = "#2B2822"; for (let x = 8; x < W; x += 22) b.fillRect(x, inboxY + 6, 12, 3);
    b.fillStyle = PAPER; b.font = `800 15px ${sansFont()}`; b.textBaseline = "middle";
    b.fillText(hooks.t("tray"), 14, inboxY + (H - inboxY) / 2 + 2);
  }
  function sansFont() { return 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif'; }

  // ---------- cards ----------
  function wrap(c, text, maxW) {
    const words = text.split(" "), lines = []; let line = "";
    for (const w of words) { const tryL = line ? line + " " + w : w; if (c.measureText(tryL).width > maxW && line) { lines.push(line); line = w; } else line = tryL; }
    if (line) lines.push(line); return lines;
  }
  function makeMail(item) {
    const w = Math.round(Math.min(W * 0.78, 300)), fs = W < 360 ? 16 : 17, lh = fs * 1.25;
    const m = document.createElement("canvas").getContext("2d");
    m.font = `500 ${fs}px Georgia, "Noto Serif", serif`;
    const lines = wrap(m, item.p, w - 28);
    const h = Math.round(34 + lines.length * lh + 14);
    const img = document.createElement("canvas"); img.width = (w + 12) * dpr; img.height = (h + 14) * dpr;
    const c = img.getContext("2d"); c.scale(dpr, dpr); c.translate(6, 4);
    c.shadowColor = "rgba(26,24,20,.18)"; c.shadowBlur = 10; c.shadowOffsetY = 4;
    c.fillStyle = PAPER; c.beginPath(); c.roundRect(0, 0, w, h, 12); c.fill();
    c.shadowColor = "transparent"; c.strokeStyle = LINE; c.lineWidth = 1; c.stroke();
    c.fillStyle = "#EFE8DA"; c.beginPath(); c.roundRect(0, 0, w, 26, [12, 12, 0, 0]); c.fill();
    c.fillStyle = "#8A8377"; c.font = `600 11px ${sansFont()}`; c.textBaseline = "middle";
    c.fillText("✉  " + SENDERS[Math.floor(rand() * SENDERS.length)], 12, 13);
    c.fillStyle = INK; c.font = `500 ${fs}px Georgia, "Noto Serif", serif`; c.textBaseline = "alphabetic";
    lines.forEach((l, i) => c.fillText(l, 14, 26 + 8 + fs + i * lh));
    return { kind: "mail", item, w, h, img };
  }
  function makePower(kind) {
    const w = 84, h = 84, img = document.createElement("canvas"); img.width = (w + 12) * dpr; img.height = (h + 14) * dpr;
    const c = img.getContext("2d"); c.scale(dpr, dpr); c.translate(6, 4);
    c.shadowColor = "rgba(0,0,0,.25)"; c.shadowBlur = 14; c.shadowOffsetY = 4;
    c.fillStyle = kind === "coffee" ? "#6B4226" : "#2F7FA8"; c.beginPath(); c.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2); c.fill();
    c.shadowColor = "transparent"; c.strokeStyle = "#FFF"; c.lineWidth = 3; c.stroke();
    c.font = `38px ${sansFont()}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(kind === "coffee" ? "☕" : "🏝️", w / 2, h / 2 - 6);
    c.fillStyle = "#FFF"; c.font = `800 10px ${sansFont()}`; c.fillText(kind === "coffee" ? "SLOW-MO" : "OUT OF OFFICE", w / 2, h / 2 + 24);
    return { kind, item: null, w, h, img };
  }
  function spawn(card) {
    card.x = 10 + rand() * Math.max(0, W - card.w - 20);
    card.y = -card.h - 4; card.vx = (rand() - 0.5) * 30; card.rot = (rand() - 0.5) * 0.12; card.vr = (rand() - 0.5) * 0.25;
    card.sp = card.kind === "mail" ? 1 : 0.85; card.born = realT; rand();
    cards.push(card);
  }
  function nextMail() {
    if (deckIdx >= deck.length) { deck = L.shuffle(deck, rand); deckIdx = 0; }
    return makeMail(deck[deckIdx++]);
  }

  // ---------- fx ----------
  function addPart(p) { if (parts.length < MAX_PARTS) parts.push(p); }
  function burst(x, y, n, confetti, power = 1) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (120 + Math.random() * 380) * power;
      addPart({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120, life: 0.6 + Math.random() * 0.6, max: 1.2, w: confetti ? 7 : 4 + Math.random() * 3, h: confetti ? 4 : 14 + Math.random() * 12, rot: Math.random() * 6, vr: (Math.random() - .5) * 14, color: confetti ? CONFETTI[i % CONFETTI.length] : (i % 3 ? PAPER : "#E9E1D2") });
    }
  }
  function pop(x, y, text, color = INK, size = 22, life = 0.8) { pops.push({ x, y, text, color, size, life, max: life }); }
  function doShake(a) { shake = Math.max(shake, a); }
  function doFlash(color, a = 0.35) { flash = a; flashColor = color; }

  // ---------- actions ----------
  function slashCard(card, angle, chain) {
    const i = cards.indexOf(card); if (i < 0) return;
    cards.splice(i, 1);
    const cx = card.x + card.w / 2, cy = card.y + card.h / 2;
    const n = { x: -Math.sin(angle), y: Math.cos(angle) };
    for (const side of [1, -1]) halves.push({ img: card.img, w: card.w, h: card.h, x: cx, y: cy, rot: card.rot, angle: angle - card.rot, side, vx: n.x * side * 160 + card.vx, vy: n.y * side * 160 - 60, vr: side * (2 + Math.random() * 3), life: 0.9 });
    burst(cx, cy, 14, false);
    if (card.kind === "coffee") { slowUntil = realT + 5; sfx.power(); burst(cx, cy, 20, true); hooks.say("coffee"); pop(cx, cy, "☕ SLOW-MO", "#6B4226", 26); hooks.vibrate(20); return; }
    if (card.kind === "ooo") { sfx.power(); hooks.say("ooo"); pop(W / 2, H * 0.4, "🏝️ OUT OF OFFICE", "#2F7FA8", 30, 1.1); doFlash("#FFFFFF", 0.6); clearBoard(); hooks.vibrate(30); return; }
    const res = L.resolve(st, card.item, "slash", chain);
    if (res.correct) {
      sfx.slash(chain); hitstop = Math.max(hitstop, chain > 1 ? 0.07 : 0.04); doShake(chain > 1 ? 7 : 3.5);
      burst(cx, cy, 8 + chain * 4, true);
      pop(cx, cy - 10, `+${res.points}`, PINE, 24);
      if (chain > 1) pop(cx, cy - 44, hooks.t("chain")(chain), RUST, 28, 1);
      hooks.vibrate(chain > 1 ? 25 : 12);
      if (res.healed) healFx();
      milestone();
    } else {
      mistake(cx, cy, "slashFine");
    }
    hooks.hud(st);
    if (res.dead) die();
  }
  function land(card) {
    const i = cards.indexOf(card); if (i < 0) return;
    cards.splice(i, 1);
    const cx = card.x + card.w / 2;
    if (card.kind !== "mail") return;
    const res = L.resolve(st, card.item, "land");
    if (res.correct) {
      sfx.ding(Math.min(st.streak, 12)); trayGlow = 0.6; trayColor = PINE;
      pop(cx, inboxY - 16, `✓ +${res.points}`, PINE, 18, 0.6);
      if (res.healed) healFx();
      milestone();
    } else {
      trayGlow = 1; trayColor = RUST;
      mistake(cx, inboxY - 20, "stiffLanded");
    }
    hooks.hud(st);
    if (res.dead) die();
  }
  function mistake(x, y, why) {
    sfx.buzz(); doShake(16); doFlash(RUST, 0.32); hitstop = Math.max(hitstop, 0.09);
    pop(W / 2, H * 0.45, why === "slashFine" ? hooks.t("oopsFine") : hooks.t("oopsStiff"), RUST, 26, 1.1);
    hooks.vibrate([50, 30, 70]);
    if (st.lives > 0) hooks.say(st.lives === 1 ? "lastLife" : why);
  }
  function healFx() {
    sfx.power(); hooks.say("heal"); pop(W / 2, H * 0.22, hooks.t("healed"), PINE, 26, 1.2); burst(40, 10, 24, true, 0.8);
  }
  function milestone() {
    if (st.streak > 0 && st.streak % 5 === 0) {
      const m = L.multiplier(st.streak);
      sfx.combo(m); pop(W / 2, H * 0.32, hooks.t("combo")(st.streak, m), RUST, 34, 1.1); burst(W / 2, H * 0.32, 26, true, 1.2);
      if (st.streak % 10 === 0) hooks.say("combo");
    }
  }
  function clearBoard() {
    for (const c of cards.slice()) {
      if (c.kind !== "mail") continue;
      if (c.item.s) slashCard(c, Math.random() * Math.PI, 1);
      else { const i = cards.indexOf(c); cards.splice(i, 1); const r = L.resolve(st, c.item, "land"); pop(c.x + c.w / 2, c.y + c.h / 2, `✓ +${r.points}`, PINE, 18, 0.6); }
    }
    hooks.hud(st);
  }
  function die() {
    if (dying) return;
    dying = true; dyingT = 1.3; sfx.explode(); doShake(26); doFlash("#FFFFFF", 0.8);
    burst(W - 40, 20, 70, true, 1.6); burst(W / 2, H / 2, 40, false, 1.4);
    hooks.vibrate([80, 40, 120, 40, 200]); hooks.boom();
  }
  function survive() {
    if (dying) return;
    st.survived = true; const bonus = L.surviveBonus(st); st.score += bonus;
    dying = true; dyingT = 1.6; sfx.win(); hooks.say("survive");
    pop(W / 2, H * 0.4, hooks.t("survived")(bonus), PINE, 30, 1.6);
    for (let i = 0; i < 4; i++) burst(W * (0.2 + i * 0.2), H * 0.3, 25, true, 1.3);
    hooks.hud(st);
  }

  // ---------- input ----------
  let down = false, swipeChain = 0, downAt = null, moved = 0;
  function pt(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: realT }; }
  function hitAt(x, y) {
    for (let i = cards.length - 1; i >= 0; i--) { const c = cards[i]; const pad = c.kind === "mail" ? 0 : 10; if (x >= c.x - pad && x <= c.x + c.w + pad && y >= c.y - pad && y <= c.y + c.h + pad) return c; }
    return null;
  }
  function onDown(e) {
    if (!running || dying) return;
    e.preventDefault(); try { canvas.setPointerCapture(e.pointerId); } catch {}
    down = true; swipeChain = 0; moved = 0; downAt = pt(e); trail.push(downAt);
  }
  function onMove(e) {
    if (!down || !running || dying) return;
    const p = pt(e), q = trail[trail.length - 1] || p;
    const dx = p.x - q.x, dy = p.y - q.y, dist = Math.hypot(dx, dy); moved += dist;
    trail.push(p);
    if (dist < 1) return;
    const steps = Math.ceil(dist / 8), ang = Math.atan2(dy, dx);
    for (let s = 1; s <= steps; s++) {
      const c = hitAt(q.x + dx * s / steps, q.y + dy * s / steps);
      if (c && moved > 14) { swipeChain++; slashCard(c, ang, swipeChain); if (!running || dying) break; }
    }
  }
  function onUp(e) {
    if (!down) return; down = false;
    if (moved < 14 && downAt && running && !dying) { const c = hitAt(downAt.x, downAt.y); if (c) slashCard(c, -0.6 + Math.random() * 0.3, 1); }
  }
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  function keySlash() { // desktop: slash the lowest card
    if (!running || dying) return;
    let low = null; for (const c of cards) if (!low || c.y + c.h > low.y + low.h) low = c;
    if (low) slashCard(low, -0.5, 1);
  }

  // ---------- loop ----------
  function update(gdt, dt) {
    st.t += gdt;
    if (st.t >= L.DAY_SECONDS) { st.t = L.DAY_SECONDS; survive(); return; }
    nextSpawn -= gdt;
    const lastCard = cards[cards.length - 1];
    if (nextSpawn <= 0 && (!lastCard || lastCard.y > 26)) {
      spawn(nextMail());
      nextSpawn = L.spawnGap(st.t) * (0.8 + rand() * 0.4);
    }
    nextPower -= gdt;
    if (nextPower <= 0) { spawn(makePower(powerCount++ % 2 === 0 ? "coffee" : "ooo")); nextPower = 13 + rand() * 8; }
    const v = L.fallSpeed(st.t) * k;
    for (const c of cards.slice()) {
      c.y += v * c.sp * gdt;
      c.x += c.vx * gdt; if (c.x < 6 || c.x + c.w > W - 6) { c.vx *= -1; c.x = Math.max(6, Math.min(W - 6 - c.w, c.x)); }
      c.rot += c.vr * gdt * 0.2; if (Math.abs(c.rot) > 0.12) c.vr *= -1;
      if (c.y + c.h * 0.55 > inboxY) land(c);
      if (dying) break;
    }
    const clock = L.clockText(st.t); if (clock !== lastClock) { lastClock = clock; hooks.clock(clock, st.t); }
    if (st.lives === 1) { heartT -= dt; if (heartT <= 0) { sfx.heart(); heartT = 0.9; } }
  }
  function updateFx(dt) {
    for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; } p.vy += 900 * dt; p.vx *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; }
    for (let i = halves.length - 1; i >= 0; i--) { const h = halves[i]; h.life -= dt; if (h.life <= 0 || h.y > H + 200) { halves.splice(i, 1); continue; } h.vy += 1100 * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.vr * dt; }
    for (let i = pops.length - 1; i >= 0; i--) { const p = pops[i]; p.life -= dt; p.y -= 40 * dt; if (p.life <= 0) pops.splice(i, 1); }
    while (trail.length && realT - trail[0].t > 0.12) trail.shift();
    if (!down && trail.length > 0 && realT - trail[trail.length - 1].t > 0.12) trail.length = 0;
    shake *= Math.pow(0.0015, dt); if (shake < 0.3) shake = 0;
    flash = Math.max(0, flash - dt * 2.2); trayGlow = Math.max(0, trayGlow - dt * 1.8);
  }
  function drawCard(c) {
    ctx.save(); ctx.translate(c.x + c.w / 2, c.y + c.h / 2); ctx.rotate(c.rot);
    ctx.drawImage(c.img, -c.w / 2 - 6, -c.h / 2 - 4, c.w + 12, c.h + 14);
    ctx.restore();
  }
  function drawHalf(h) {
    ctx.save(); ctx.globalAlpha = Math.min(1, h.life * 2); ctx.translate(h.x, h.y); ctx.rotate(h.rot);
    const d = { x: Math.cos(h.angle), y: Math.sin(h.angle) }, n = { x: -d.y * h.side, y: d.x * h.side }, B = 400;
    ctx.beginPath(); ctx.moveTo(d.x * B, d.y * B); ctx.lineTo(-d.x * B, -d.y * B); ctx.lineTo(-d.x * B + n.x * B, -d.y * B + n.y * B); ctx.lineTo(d.x * B + n.x * B, d.y * B + n.y * B); ctx.closePath(); ctx.clip();
    ctx.drawImage(h.img, -h.w / 2 - 6, -h.h / 2 - 4, h.w + 12, h.h + 14);
    ctx.restore();
  }
  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(bg, 0, 0, W, H);
    if (shake) ctx.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
    if (trayGlow) { ctx.globalAlpha = trayGlow * 0.55; ctx.fillStyle = trayColor; ctx.fillRect(0, inboxY - 6, W, H - inboxY + 6); ctx.globalAlpha = 1; }
    for (const c of cards) drawCard(c);
    for (const h of halves) drawHalf(h);
    for (const p of parts) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.life * 2); ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); }
    ctx.globalAlpha = 1;
    if (trail.length > 1) {
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = pass ? "#FFFFFF" : "rgba(160,58,32,.55)"; ctx.lineWidth = pass ? 3 : 10; ctx.stroke();
      }
    }
    for (const p of pops) {
      const a = p.life / p.max, s = 1 + (1 - a) * 0.15 + (a > 0.85 ? (a - 0.85) * 3 : 0);
      ctx.save(); ctx.translate(p.x, p.y); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, a * 2.5);
      ctx.font = `900 ${p.size}px ${sansFont()}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.lineWidth = 5; ctx.strokeStyle = PAPER; ctx.strokeText(p.text, 0, 0); ctx.fillStyle = p.color; ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (slowUntil > realT) { ctx.fillStyle = "rgba(58,110,165,.10)"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#3A6EA5"; ctx.font = `800 13px ${sansFont()}`; ctx.textAlign = "left"; ctx.fillText(`☕ ${Math.ceil(slowUntil - realT)}s`, 10, 20); }
    if (flash) { ctx.globalAlpha = flash; ctx.fillStyle = flashColor; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  }
  function frame(nowMs) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (nowMs - last) / 1000 || 0); last = nowMs;
    if (paused) return;
    fps.frames++; fps.acc += dt; if (fps.acc >= 1) { fps.samples.push(fps.frames / fps.acc); fps.frames = 0; fps.acc = 0; }
    realT += dt;
    if (hitstop > 0) { hitstop -= dt; updateFx(dt * 0.25); render(); return; }
    const scale = slowUntil > realT ? 0.45 : 1;
    if (!dying) update(dt * scale, dt);
    else { dyingT -= dt; for (const c of cards) { c.y += 40 * dt; } if (dyingT <= 0 && running) { running = false; cancelAnimationFrame(raf); hooks.over(st); return; } }
    updateFx(dt);
    render();
  }

  return {
    start(seed) {
      resize();
      rand = L.rng(seed);
      deck = L.shuffle(hooks.phrases, rand); deckIdx = 0;
      st = L.newState(); cards = []; halves = []; parts = []; pops = []; trail = [];
      nextSpawn = 0.3; nextPower = 14 + rand() * 4; powerCount = 0; realT = 0; slowUntil = 0; hitstop = 0; shake = 0; flash = 0; dying = false; ending = false; lastClock = ""; heartT = 0;
      fps.samples = []; fps.frames = 0; fps.acc = 0;
      running = true; paused = false; last = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
      hooks.hud(st); hooks.say("start");
    },
    stop() { running = false; cancelAnimationFrame(raf); },
    pause(p) { paused = p; last = performance.now(); },
    resize() { if (running) resize(); },
    keySlash,
    get state() { return st; },
    get cards() { return cards; },
    get fps() { return fps.samples; },
    debugSlash(card, chain = 1) { slashCard(card, -0.5, chain); },
    debugEnd() { if (st) { st.lives = 0; die(); } },
  };
}
