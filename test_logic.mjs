import assert from "node:assert/strict";
import * as L from "./logic.js";
import { PHRASES } from "./data.js";
assert.equal(L.dailyNumber(new Date(2026, 10, 14, 12)), 1);
assert.equal(L.dailyNumber(new Date(2026, 10, 25, 23)), 12);
assert.equal(L.localDateKey(new Date(2026, 10, 14)), 20261114);
const a = L.shuffle(PHRASES, L.rng(20261114)), b = L.shuffle(PHRASES, L.rng(20261114));
assert.deepEqual(a.map(x => x.p), b.map(x => x.p));
assert.notDeepEqual(a.map(x => x.p), L.shuffle(PHRASES, L.rng(20261115)).map(x => x.p));
assert.equal(new Set(a.map(x => x.p)).size, PHRASES.length);
const stiff = PHRASES.find(x => x.s), fine = PHRASES.find(x => !x.s);
const s = L.newState();
for (let i = 0; i < 5; i++) assert.equal(L.resolve(s, stiff, "slash").points, 10);
assert.equal(L.resolve(s, fine, "land").points, 10); // 5 * x2
assert.equal(L.resolve(s, stiff, "slash", 3).points, 60); // 10 * x2 * chain 3
assert.equal(s.slashed, 6);
let r = L.resolve(s, fine, "slash"); assert.equal(r.correct, false); assert.equal(s.lives, 2); assert.equal(s.streak, 0);
r = L.resolve(s, stiff, "land"); assert.equal(r.correct, false); assert.equal(s.lives, 1);
r = L.resolve(s, stiff, "land"); assert.equal(r.dead, true);
assert.equal(L.clockText(0), "9:00 AM"); assert.equal(L.clockText(30), "12:00 PM"); assert.equal(L.clockText(90), "6:00 PM");
assert.ok(L.fallSpeed(60) > L.fallSpeed(0)); assert.ok(L.spawnGap(90) >= 0.48);
assert.equal(L.rankFor(0).en, "Reply-All Menace"); assert.equal(L.rankFor(2200).en, "Inbox Diplomat"); assert.equal(L.rankFor(3600).en, "Email Whisperer");
{ const h = L.newState(); L.resolve(h, fine, "slash"); assert.equal(h.lives, 2); let healed = false;
  for (let i = 0; i < L.HEAL_EVERY; i++) healed = L.resolve(h, stiff, "slash").healed || healed;
  assert.equal(h.lives, 3); assert.ok(healed); assert.equal(h.heals, 1);
  for (let i = 0; i < 40; i++) L.resolve(h, stiff, "slash"); assert.equal(h.lives, 3); }
s.t = 47;
assert.match(L.shareText(s, { lang: "en", mode: "daily", day: 1, url: "U" }), /Daily #1[\s\S]*exploded at 1:42 PM[\s\S]*🟩/);
assert.match(L.shareText(s, { lang: "ko", mode: "daily", day: 3, url: "U" }), /데일리 #3/);
for (const p of PHRASES) { assert.ok(p.p && p.w && p.k); if (p.s) assert.ok(p.f); }
console.log("all logic tests passed");
