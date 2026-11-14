import assert from "node:assert/strict";
import * as L from "./logic.js";
import { PHRASES } from "./data.js";
const d = new Date(2026, 10, 14, 12);
assert.equal(L.dailyNumber(d), 1);
assert.equal(L.dailyNumber(new Date(2026, 10, 25, 23)), 12);
assert.equal(L.localDateKey(d), 20261114);
const a = L.shuffle(PHRASES, L.rng(20261114)), b = L.shuffle(PHRASES, L.rng(20261114));
assert.deepEqual(a.map(x=>x.p), b.map(x=>x.p), "daily seed deterministic");
assert.notDeepEqual(a.map(x=>x.p), L.shuffle(PHRASES, L.rng(20261115)).map(x=>x.p));
assert.equal(new Set(a.map(x=>x.p)).size, PHRASES.length, "no dup / loss");
const s = L.newState();
const stiff = PHRASES.find(x=>x.s), fine = PHRASES.find(x=>!x.s);
for (let i=0;i<3;i++) assert.equal(L.answer(s, stiff, true).points, 10);
assert.equal(L.answer(s, fine, false).points, 20); // x2 after 3 streak
assert.equal(s.score, 50);
assert.equal(L.answer(s, fine, true).correct, false);
assert.equal(s.streak, 0); assert.equal(s.penalty, 2); assert.equal(s.bestStreak, 4);
assert.equal(L.accuracy(s), 80);
assert.equal(L.multiplier(100), 5);
assert.equal(L.rankFor(0).en, "Reply-All Menace");
assert.equal(L.rankFor(500).en, "Inbox Diplomat");
const t = L.shareText(s, {lang:"en", mode:"daily", day:1, url:"U"});
assert.match(t, /Daily #1/); assert.match(t, /🟩🟩🟩🟩🟥/);
assert.match(L.shareText(s,{lang:"ko",mode:"daily",day:3,url:"U"}), /데일리 #3/);
// data sanity
for (const p of PHRASES) { assert.ok(p.p && p.w && p.k); if (p.s) assert.ok(p.f); }
console.log("all logic tests passed");
