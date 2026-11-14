// Tiny WebAudio synth. No audio files.
let ac = null, master = null, noiseBuf = null, muted = false;
export function initAudio() {
  if (ac) { if (ac.state === "suspended") ac.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ac = new AC();
  master = ac.createGain(); master.gain.value = muted ? 0 : 0.55; master.connect(ac.destination);
  noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
export function setMuted(m) { muted = m; if (master) master.gain.value = m ? 0 : 0.55; }
export function isMuted() { return muted; }
const now = () => ac.currentTime;
function env(g, t, a, peak, dur) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}
function tone(type, f0, f1, dur, peak = 0.3, when = 0) {
  if (!ac || muted) return;
  const t = now() + when, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, 0.005, peak, dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, f0, f1, peak = 0.4, q = 1.2, type = "bandpass", when = 0) {
  if (!ac || muted) return;
  const t = now() + when, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuf; f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, 0.004, peak, dur);
  s.connect(f).connect(g).connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}
export const sfx = {
  slash(chain = 1) { noise(0.13, 5200, 900, 0.5, 1.4); tone("sawtooth", 520 + chain * 80, 110, 0.09, 0.12); },
  ding(step = 0) { const f = 784 * Math.pow(2, Math.min(step, 12) / 12); tone("sine", f, f, 0.18, 0.22); tone("sine", f * 1.5, f * 1.5, 0.22, 0.12, 0.05); },
  land() { tone("triangle", 660, 660, 0.12, 0.12); },
  buzz() { tone("square", 92, 80, 0.32, 0.22); tone("square", 97, 84, 0.32, 0.18); noise(0.25, 400, 200, 0.2, 0.8, "lowpass"); },
  combo(n) { [0, 4, 7, 12].forEach((s, i) => tone("triangle", 523 * Math.pow(2, (s + Math.min(n, 6)) / 12), 0, 0.14, 0.18, i * 0.06)); },
  power() { tone("sine", 300, 1400, 0.35, 0.25); tone("triangle", 600, 2000, 0.35, 0.1, 0.05); },
  explode() { noise(1.2, 2400, 60, 0.8, 0.7, "lowpass"); tone("sine", 90, 30, 0.9, 0.5); },
  win() { [0, 4, 7, 12, 16].forEach((s, i) => tone("triangle", 523 * Math.pow(2, s / 12), 0, 0.25, 0.2, i * 0.09)); },
  heart() { tone("sine", 70, 50, 0.12, 0.35); tone("sine", 70, 50, 0.12, 0.25, 0.16); },
};
