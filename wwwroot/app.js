(() => {
  "use strict";

  // ---------- state ----------
  const KEY = "actdrill-v1";
  const APP_VERSION = "1.16.0";
  const DEFAULT_GOAL = 10;
  const goal = () => S.dailyGoal || DEFAULT_GOAL;   // the daily target is the student's to set — small is fine

  const LEVELS = [
    { xp: 0,    name: "Walk-on" },
    { xp: 100,  name: "Spotter" },
    { xp: 250,  name: "Trap Hunter" },
    { xp: 450,  name: "Grinder" },
    { xp: 700,  name: "Editor" },
    { xp: 1000, name: "Sharpshooter" },
    { xp: 1400, name: "Veteran" },
    { xp: 1900, name: "Closer" },
    { xp: 2500, name: "Ace" },
    { xp: 3200, name: "The Standard" }
  ];
  const MASTERY_ACC = 0.8, MASTERY_REPS = 10;

  function blankState() {
    return { v: 1, patt: {}, q: {}, daily: {}, recent: [], introSeen: false,
             xp: 0, combo: 0, bestCombo: 0, sinceNote: 99, lastNote: -1, subj: "All",
             audio: { on: true, rate: 0.9, autoRead: true, volume: 1, voiceId: "" }, coach: "auto",
             theme: "dark", fontScale: 1, dailyGoal: 10, memos: {}, glow: true };
  }
  const isRecord = value => value && typeof value === "object" && !Array.isArray(value);
  const finite = (value, fallback, min, max) =>
    Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
  function statMap(value) {
    if (!isRecord(value)) return {};
    const clean = {};
    Object.entries(value).slice(0, 5000).forEach(([key, item]) => {
      if (!/^[A-Za-z0-9_-]{1,80}$/.test(key) || !isRecord(item)) return;
      const seen = Math.round(finite(item.seen, 0, 0, 1000000));
      const right = Math.round(finite(item.right, 0, 0, seen));
      clean[key] = { seen, right };
    });
    return clean;
  }
  function normalizeState(value) {
    const base = blankState();
    if (!isRecord(value)) return base;
    base.patt = statMap(value.patt);
    base.q = statMap(value.q);
    if (isRecord(value.daily)) {
      Object.entries(value.daily).slice(-730).forEach(([date, item]) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date) && isRecord(item)) {
          // keep the day's correct count too — dropping it made lifetime accuracy NaN
          const n = Math.round(finite(item.n, 0, 0, 10000));
          base.daily[date] = { n, right: Math.round(finite(item.right, 0, 0, n)) };
        }
      });
    }
    base.recent = Array.isArray(value.recent)
      ? value.recent.filter(x => typeof x === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(x)).slice(-50)
      : [];
    base.introSeen = value.introSeen === true;
    base.xp = Math.round(finite(value.xp, 0, 0, 10000000));
    base.combo = Math.round(finite(value.combo, 0, 0, 100000));
    base.bestCombo = Math.round(finite(value.bestCombo, 0, 0, 100000));
    base.sinceNote = Math.round(finite(value.sinceNote, 99, 0, 100000));
    base.lastNote = Math.round(finite(value.lastNote, -1, -1, 100000));
    base.subj = ["All", "English", "Math", "Reading"].includes(value.subj) ? value.subj : "All";
    base.coach = ["auto", "on", "off"].includes(value.coach) ? value.coach : "auto";
    base.theme = value.theme === "light" ? "light" : "dark";
    base.fontScale = [0.9, 1, 1.2, 1.45].includes(Number(value.fontScale))
      ? Number(value.fontScale)
      : 1;
    base.dailyGoal = [3, 5, 10, 15].includes(Number(value.dailyGoal))
      ? Number(value.dailyGoal)
      : DEFAULT_GOAL;
    if (isRecord(value.audio)) {
      base.audio.on = value.audio.on !== false;
      base.audio.autoRead = value.audio.autoRead !== false;
      base.audio.rate = finite(value.audio.rate, 0.9, 0.5, 2);
      base.audio.volume = finite(value.audio.volume, 1, 0, 1);
      base.audio.voiceId = typeof value.audio.voiceId === "string"
        ? value.audio.voiceId.slice(0, 300)
        : "";
    }
    base.glow = value.glow !== false;
    if (isRecord(value.memos)) {
      Object.entries(value.memos).slice(0, 1000).forEach(([id, text]) => {
        if (/^[A-Za-z0-9_-]{1,80}$/.test(id) && typeof text === "string" && text.trim())
          base.memos[id] = text.slice(0, 600);
      });
    }
    return base;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (e) { /* corrupted store — start fresh */ }
    return blankState();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(normalizeState(S))); }
    catch { announce("Progress could not be saved on this device."); }
  }
  let S = load();

  // ---------- appearance: theme + text size ----------
  function applyTheme() { document.documentElement.setAttribute("data-theme", S.theme === "light" ? "light" : "dark"); }
  function applyFontScale() {
    document.documentElement.style.fontSize = (16 * finite(S.fontScale, 1, 0.9, 1.45)) + "px";
  }
  // the moving gradient on note surfaces — some people find motion distracting, so it's optional
  function applyGlow() { document.documentElement.setAttribute("data-glow", S.glow ? "on" : "off"); }
  // diagram/plot colors that follow the current theme (SVGs are rebuilt each render)
  function vizColors() {
    return S.theme === "light"
      ? { blue: "#2269a5", gold: "#805100", ink: "#242a31", ink2: "#4f5964", grid: "#d8dee5", axis: "#8b96a2", good: "#146b2e", surf: "#ffffff", aqua: "#16674f" }
      : { blue: "#5ba4d9", gold: "#ffc857", ink: "#f3f7fb", ink2: "#c6d0da", grid: "#27313d", axis: "#657383", good: "#57d879", surf: "#121821", aqua: "#66d9b3" };
  }

  const todayKey = () => new Date().toLocaleDateString("sv");
  const dayKeyOffset = (n) => {
    const d = new Date(); d.setDate(d.getDate() - n);
    return d.toLocaleDateString("sv");
  };
  const todayCount = () => (S.daily[todayKey()] || { n: 0 }).n;

  function streak() {
    let n = 0, start = todayCount() > 0 ? 0 : 1;
    for (let i = start; ; i++) {
      const d = S.daily[dayKeyOffset(i)];
      if (d && d.n > 0) n++; else break;
    }
    return n;
  }

  // ---------- levels & mastery ----------
  function levelIndex(xp) {
    let li = 0;
    LEVELS.forEach((l, i) => { if (xp >= l.xp) li = i; });
    return li;
  }
  function levelProgress(xp) {
    const li = levelIndex(xp);
    if (li >= LEVELS.length - 1) return 1;
    const lo = LEVELS[li].xp, hi = LEVELS[li + 1].xp;
    return (xp - lo) / (hi - lo);
  }
  function isMastered(pid) {
    const p = S.patt[pid];
    return !!p && p.seen >= MASTERY_REPS && p.right / p.seen >= MASTERY_ACC;
  }
  function masteredCount() {
    return Object.keys(ACT_PATTERNS).filter(isMastered).length;
  }
  function patternMastery(pid) {
    const p = S.patt[pid];
    if (!p || p.seen === 0) return null;
    return p.right / p.seen;
  }

  // ---------- adaptive picker ----------
  function pickQuestion() {
    let pids = Object.keys(ACT_PATTERNS);
    if (S.subj && S.subj !== "All") pids = pids.filter(pid => ACT_PATTERNS[pid].subject === S.subj);
    if (!pids.length) pids = Object.keys(ACT_PATTERNS);
    const weights = pids.map(pid => {
      const p = S.patt[pid] || { seen: 0, right: 0 };
      if (p.seen < 4) return 1.0;
      const miss = 1 - p.right / p.seen;
      return Math.min(1.15, Math.max(0.15, miss + 0.15));
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total, pid = pids[0];
    for (let i = 0; i < pids.length; i++) { r -= weights[i]; if (r <= 0) { pid = pids[i]; break; } }

    const inSubj = q => !S.subj || S.subj === "All" || ACT_PATTERNS[q.pattern].subject === S.subj;
    let pool = ACT_QUESTIONS.filter(q => q.pattern === pid && !S.recent.includes(q.id));
    if (pool.length === 0) pool = ACT_QUESTIONS.filter(q => inSubj(q) && !S.recent.includes(q.id));
    if (pool.length === 0) pool = ACT_QUESTIONS.filter(inSubj);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ---------- rendering helpers ----------
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  // a field the student is typing into — it owns every key it receives
  const isTyping = node =>
    node instanceof HTMLElement &&
    (node.isContentEditable || /^(input|textarea|select)$/i.test(node.tagName));
  // surfaces the drill shortcuts must keep their hands off: text fields, and the notes
  // drawer, whose buttons answer to Enter and space on their own
  const ownsKeys = node =>
    node instanceof HTMLElement && (isTyping(node) || !!node.closest("#notespanel"));
  function announce(message) {
    const region = document.getElementById("app-status");
    if (!region) return;
    region.textContent = "";
    requestAnimationFrame(() => { region.textContent = message; });
  }
  function mountModal(overlay, panel, titleElement, initialFocus) {
    const priorFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const titleId = "dialog-" + Math.random().toString(36).slice(2);
    titleElement.id = titleId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", titleId);
    panel.tabIndex = -1;
    const app = document.querySelector(".wrap");
    if (app) app.inert = true;
    document.body.append(overlay);

    const close = () => {
      overlay.removeEventListener("keydown", trap);
      overlay.remove();
      if (app) app.inert = false;
      if (priorFocus?.isConnected) priorFocus.focus();
    };
    const focusable = () => [...panel.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )].filter(node => node instanceof HTMLElement && node.offsetParent !== null);
    function trap(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    overlay.addEventListener("keydown", trap);
    requestAnimationFrame(() => (initialFocus || focusable()[0] || panel).focus());
    return close;
  }
  function renderPassage(p) {
    return esc(p).replace(/\|([^|]+)\|/g, '<span class="u">$1</span>');
  }
  function orderedChoices(q) {
    const items = q.choices.map((c, i) => ({ ...c, origIndex: i }));
    if (q.fixedOrder) return items;
    const pinFirst = items.filter(c => c.text === "NO CHANGE");
    const pinLast = items.filter(c => c.text.startsWith("DELETE"));
    const mid = items.filter(c => !pinFirst.includes(c) && !pinLast.includes(c));
    for (let i = mid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mid[i], mid[j]] = [mid[j], mid[i]];
    }
    return [...pinFirst, ...mid, ...pinLast];
  }

  const QUIPS_RIGHT = [
    "Clean read.",
    "That's the pattern.",
    "You saw the trap coming.",
    "Textbook.",
    "That one pays points on test day.",
    "Automatic. That's the goal."
  ];
  const QUIPS_WRONG = [
    "Logged. This pattern will cycle back until it's automatic.",
    "Good miss — better here than on test day.",
    "That's the trap doing its job. Now you've seen it.",
    "Every miss becomes a pattern you own. Read the why below."
  ];
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // ---------- the corner (notes) ----------
  function pickNote() {
    if (typeof VAULT_NOTES === "undefined" || !VAULT_NOTES.length) return null;
    if (VAULT_NOTES.length === 1) return VAULT_NOTES[0];
    let idx;
    do { idx = Math.floor(Math.random() * VAULT_NOTES.length); } while (idx === S.lastNote);
    S.lastNote = idx;
    return VAULT_NOTES[idx];
  }
  function noteCard(note) {
    const c = el("div", "cornernote");
    c.append(
      el("div", "clabel", "From your corner"),
      el("div", "ctext", esc(note.text)),
      el("div", "cfrom", "— " + esc(note.from))
    );
    return c;
  }

  // ---------- confetti ----------
  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#3987e5", "#fab219", "#0ca30c", "#9085e9", "#e66767"];
    const cv = el("canvas"); cv.id = "confetti";
    document.body.append(cv);
    const ctx = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    const parts = Array.from({ length: 130 }, () => ({
      x: Math.random() * cv.width,
      y: -20 - Math.random() * cv.height * 0.4,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      s: 4 + Math.random() * 5,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
    const t0 = performance.now();
    (function tick(t) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      });
      if (t - t0 < 1800) requestAnimationFrame(tick); else cv.remove();
    })(t0);
  }

  // ---------- level-up overlay ----------
  function showLevelUp(li, note) {
    const ov = el("div", "overlay");
    const panel = el("div", "panel");
    const title = el("div", "lvname", esc(LEVELS[li].name));
    panel.append(
      el("div", "lvlabel", "Level up"),
      title,
      el("div", "lvnum", "Level " + (li + 1) + " of " + LEVELS.length + " · " + S.xp + " XP")
    );
    if (note) panel.append(noteCard(note));
    const b = el("button", "btn", "Back to work");
    panel.append(b);
    ov.append(panel);
    const close = mountModal(ov, panel, title, b);
    b.onclick = close;
    confetti();
  }

  // ---------- break guard (hyperfocus protection) ----------
  const BREAK_Q = 25, BREAK_MIN = 20, SNOOZE_Q = 12, SNOOZE_MIN = 10, IDLE_RESET_MIN = 5;
  const brk = {
    qSince: 0, dueQ: BREAK_Q, dueAt: Date.now() + BREAK_MIN * 60e3,
    snoozes: 0, lastAnswerAt: 0, timer: null
  };

  function breakDue() { return brk.qSince >= brk.dueQ || Date.now() >= brk.dueAt; }
  function resetBreak() {
    brk.qSince = 0; brk.dueQ = BREAK_Q; brk.dueAt = Date.now() + BREAK_MIN * 60e3; brk.snoozes = 0;
    if (brk.timer) { clearInterval(brk.timer); brk.timer = null; }
  }

  const BREAK_MSGS = [
    "Solid block of reps. Here's the part most people skip: the patterns get filed into long-term memory during the break, not during the grind. Water, window, five minutes — that's part of the training, not a pause from it.",
    "Still going? That's the hyperfocus talking. Past this point accuracy usually slides, and tomorrow-you pays for it. Five real minutes — stand up, walk somewhere, come back sharp.",
    "Third call. Burnout is how good streaks die — champions rest on schedule. Take the five."
  ];

  function renderBreakCard() {
    current = null;
    viewDrill.innerHTML = "";
    const card = el("div", "card");
    card.append(el("div", "pill", "Break time · " + brk.qSince + " reps this block"));
    card.append(el("p", "prompt", BREAK_MSGS[Math.min(brk.snoozes, BREAK_MSGS.length - 1)]));
    const a = el("div", "actions");
    const take = el("button", "btn", "Take 5 (+5 XP)");
    take.onclick = startBreakCountdown;
    a.append(take);
    if (brk.snoozes < 2) {
      const more = el("button", "btn ghost", "One more set");
      more.onclick = () => {
        brk.snoozes++;
        brk.dueQ = brk.qSince + SNOOZE_Q;
        brk.dueAt = Date.now() + SNOOZE_MIN * 60e3;
        nextQuestion();
      };
      a.append(more);
    }
    a.append(el("span", "hint", "Enter takes the break"));
    card.append(a);
    viewDrill.append(card);
    take.focus();
  }

  function startBreakCountdown() {
    S.xp += 5; save(); renderChips(); // recovery bonus — the rest is part of the training
    viewDrill.innerHTML = "";
    const card = el("div", "card");
    card.append(el("div", "pill", "On break — recovery bonus +5 XP banked"));
    const clock = el("div", "bigclock", "5:00");
    card.append(clock);
    card.append(el("p", "prompt", "Stand up. Water. Look at something farther away than a screen. The XP will still be here."));
    const a = el("div", "actions");
    const back = el("button", "btn ghost", "Back early");
    a.append(back);
    card.append(a);
    viewDrill.append(card);
    let left = 5 * 60;
    const done = () => { resetBreak(); nextQuestion(); };
    back.onclick = done;
    brk.timer = setInterval(() => {
      left--;
      if (left <= 0) {
        clearInterval(brk.timer); brk.timer = null;
        clock.textContent = "0:00";
        back.className = "btn"; back.textContent = "Back — fresh eyes"; back.focus();
      } else {
        clock.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
      }
    }, 1000);
  }

  // ---------- read-aloud (installed Windows speech — no API key) ----------
  const speech = new ACTDrillSpeechController(
    () => S.audio,
    (method, params, timeoutMs) => bridge(method, params, timeoutMs)
  );
  window.addEventListener("actdrill:speech-error", event => {
    announce("Voice error: " + event.detail);
  });
  const speechOK = () => speech.available;
  const stopSpeech = () => speech.stop();
  const speak = (text, onDone) => speech.speak(text, onDone);
  const spokenPassage = p => p.replace(/\|([^|]+)\|/g, ", $1, ");
  function questionSpeech(q, choices) {
    const parts = [];
    if (q.context) parts.push(q.context);
    if (q.passage) parts.push(spokenPassage(q.passage));
    parts.push(q.prompt || (q.passage && q.passage.includes("|") ? "Choose the best version of the underlined portion." : "Choose the best answer."));
    choices.forEach((c, i) => parts.push("Option " + "ABCD"[i] + ". " + c.text + "."));
    return parts.filter(Boolean).join(". ");
  }
  function explanationSpeech(q, choices) {
    const correct = choices.find(c => c.correct);
    const pat = ACT_PATTERNS[q.pattern];
    const f = questionFormula(q);
    const lead = f ? "Using the " + f.key + " formula. " : "";
    return lead + "The answer is " + correct.text + ". " + correct.why +
           " The pattern is " + pat.name + ". " + pat.cue;
  }
  const SPEEDS = [{ r: 0.7, n: "Slow" }, { r: 0.9, n: "Normal" }, { r: 1.1, n: "Fast" }];
  function refreshSpeakButtons() {
    const show = speechOK() && S.audio.on;
    document.querySelectorAll("#view-drill .speakbtn").forEach(b => b.classList.toggle("hidden", !show));
  }
  function speakerButton(label, getText) {
    const b = el("button", "speakbtn" + (speechOK() && S.audio.on ? "" : " hidden"));
    b.innerHTML = "<span class='ic'>🔊</span> " + esc(label);
    b.onclick = () => {
      if (b.classList.contains("speaking")) { stopSpeech(); b.classList.remove("speaking"); return; }
      document.querySelectorAll(".speakbtn.speaking").forEach(x => x.classList.remove("speaking"));
      b.classList.add("speaking");
      speak(getText(), () => b.classList.remove("speaking"));
    };
    return b;
  }
  function audioBar() {
    const bar = el("div", "audiobar");
    if (!speechOK()) return bar; // no text-to-speech on this device
    const toggle = el("button", S.audio.on ? "on" : "");
    const paint = () => { toggle.className = S.audio.on ? "on" : ""; toggle.innerHTML = (S.audio.on ? "🔊" : "🔇") + " Voice " + (S.audio.on ? "on" : "off"); };
    paint();
    toggle.onclick = () => { S.audio.on = !S.audio.on; if (!S.audio.on) stopSpeech(); save(); paint(); refreshSpeakButtons(); };
    bar.append(toggle);

    let si = Math.max(0, SPEEDS.findIndex(s => s.r === S.audio.rate));
    if (si < 0) si = 1;
    const speed = el("button", "", "Speed: " + SPEEDS[si].n);
    speed.onclick = () => { si = (si + 1) % SPEEDS.length; S.audio.rate = SPEEDS[si].r; save(); speed.textContent = "Speed: " + SPEEDS[si].n; };
    bar.append(speed);

    const auto = el("button", S.audio.autoRead ? "on" : "", "Auto-read answer: " + (S.audio.autoRead ? "on" : "off"));
    auto.onclick = () => { S.audio.autoRead = !S.audio.autoRead; save(); auto.className = S.audio.autoRead ? "on" : ""; auto.textContent = "Auto-read answer: " + (S.audio.autoRead ? "on" : "off"); };
    bar.append(auto);
    return bar;
  }

  // ---------- formula "key" box + coordinate-plane plot ----------
  // A math question can carry:  formula: { key, expr, data?, answer? }  and/or  plot: {...}
  function formulaBox(f) {
    const box = el("div", "fbox");
    box.append(el("div", "fkey", "🔑 " + esc(f.key) + " — the formula (the key)"));
    box.append(el("div", "fexpr", esc(f.expr)));
    if (f.data) box.append(el("div", "fstep", "<b>Your numbers:</b> " + esc(f.data)));
    if (f.answer) box.append(el("div", "fstep", "<b>Answer:</b> " + esc(f.answer)));
    return box;
  }

  function niceStep(min, max) {
    const raw = (max - min) / 6;
    const pow = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const n = raw / pow;
    const nice = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
    return Math.max(1, nice * pow);
  }
  // Draw a small xy-plane: points, an optional segment, an optional line, rise/run, and a gold answer point.
  function coordPlot(spec) {
    const P = spec.points || [];
    const all = P.slice();
    if (spec.answer) all.push(spec.answer);
    if (spec.line && spec.line.through) spec.line.through.forEach(p => all.push(p));
    const xs = all.map(p => p[0]).concat(0), ys = all.map(p => p[1]).concat(0);
    let minX = Math.min(...xs) - 1, maxX = Math.max(...xs) + 1;
    let minY = Math.min(...ys) - 1, maxY = Math.max(...ys) + 1;
    const W = 300, H = 240, M = 24;
    const sx = x => M + (x - minX) / (maxX - minX) * (W - 2 * M);
    const sy = y => (H - M) - (y - minY) / (maxY - minY) * (H - 2 * M);
    const _c = vizColors(), gA = _c.grid, axis = _c.axis, blue = _c.blue, gold = _c.gold, ink = _c.ink;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:340px" xmlns="http://www.w3.org/2000/svg">`;
    const stepX = niceStep(minX, maxX), stepY = niceStep(minY, maxY);
    for (let x = Math.ceil(minX / stepX) * stepX; x <= maxX; x += stepX)
      s += `<line x1="${sx(x)}" y1="${sy(minY)}" x2="${sx(x)}" y2="${sy(maxY)}" stroke="${gA}" stroke-width="1"/>`;
    for (let y = Math.ceil(minY / stepY) * stepY; y <= maxY; y += stepY)
      s += `<line x1="${sx(minX)}" y1="${sy(y)}" x2="${sx(maxX)}" y2="${sy(y)}" stroke="${gA}" stroke-width="1"/>`;
    if (minY <= 0 && maxY >= 0) s += `<line x1="${sx(minX)}" y1="${sy(0)}" x2="${sx(maxX)}" y2="${sy(0)}" stroke="${axis}" stroke-width="1.5"/>`;
    if (minX <= 0 && maxX >= 0) s += `<line x1="${sx(0)}" y1="${sy(minY)}" x2="${sx(0)}" y2="${sy(maxY)}" stroke="${axis}" stroke-width="1.5"/>`;
    if (spec.line) {
      let m, b;
      if (spec.line.m !== undefined) { m = spec.line.m; b = spec.line.b; }
      else { const [p, q] = spec.line.through; m = (q[1] - p[1]) / (q[0] - p[0]); b = p[1] - m * p[0]; }
      s += `<line x1="${sx(minX)}" y1="${sy(m * minX + b)}" x2="${sx(maxX)}" y2="${sy(m * maxX + b)}" stroke="${blue}" stroke-width="2"/>`;
    }
    if (spec.segment && P.length >= 2) {
      const a = P[spec.segment[0]], b = P[spec.segment[1]];
      s += `<line x1="${sx(a[0])}" y1="${sy(a[1])}" x2="${sx(b[0])}" y2="${sy(b[1])}" stroke="${blue}" stroke-width="2"/>`;
    }
    if (spec.slope && P.length >= 2) {
      const a = P[spec.slope[0]], b = P[spec.slope[1]];
      s += `<line x1="${sx(a[0])}" y1="${sy(a[1])}" x2="${sx(b[0])}" y2="${sy(a[1])}" stroke="${gold}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      s += `<line x1="${sx(b[0])}" y1="${sy(a[1])}" x2="${sx(b[0])}" y2="${sy(b[1])}" stroke="${gold}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      s += `<text x="${(sx(a[0]) + sx(b[0])) / 2}" y="${sy(a[1]) + 13}" fill="${gold}" font-size="10" text-anchor="middle">run ${b[0] - a[0]}</text>`;
      s += `<text x="${sx(b[0]) + 4}" y="${(sy(a[1]) + sy(b[1])) / 2}" fill="${gold}" font-size="10">rise ${b[1] - a[1]}</text>`;
    }
    P.forEach(p => {
      s += `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="4" fill="${blue}"/>`;
      s += `<text x="${sx(p[0]) + 6}" y="${sy(p[1]) - 6}" fill="${ink}" font-size="11">${esc(p[2] || "")} (${p[0]}, ${p[1]})</text>`;
    });
    if (spec.answer) {
      const p = spec.answer;
      s += `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="5.5" fill="${gold}" stroke="#0d0d0d" stroke-width="1"/>`;
      s += `<text x="${sx(p[0]) + 7}" y="${sy(p[1]) + 4}" fill="${gold}" font-size="11" font-weight="bold">${esc(p[2] || "")} (${p[0]}, ${p[1]})</text>`;
    }
    s += `</svg>`;
    const wrap = el("div", "plotwrap"); wrap.innerHTML = s; return wrap;
  }
  function questionFormula(q) { return q.formula || (ACT_PATTERNS[q.pattern] && ACT_PATTERNS[q.pattern].formula) || null; }

  // ---------- math diagrams: show WHY the numbers work ----------
  // A question can carry  diagram: { type, ... }.  One SVG per type, theme colors baked in (dark app).
  function mathDiagram(spec) {
    const W = 300, H = 240;
    const _c = vizColors(), blue = _c.blue, gold = _c.gold, ink = _c.ink, ink2 = _c.ink2,
          grid = _c.grid, axis = _c.axis, good = _c.good, surf = _c.surf, aqua = _c.aqua;
    const T = (x, y, t, fill, size, anchor, weight) =>
      `<text x="${x}" y="${y}" fill="${fill || ink}" font-size="${size || 12}" text-anchor="${anchor || 'start'}"${weight ? ` font-weight="${weight}"` : ''}>${t}</text>`;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:340px" xmlns="http://www.w3.org/2000/svg">`;
    s += `<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${ink2}"/></marker></defs>`;

    if (spec.type === "rightTriangle") {
      const a = spec.a, b = spec.b, maxL = Math.max(a, b);
      const base = a / maxL * 150, hei = b / maxL * 130, blx = 72, bly = 195;
      const brx = blx + base, tlx = blx, tly = bly - hei;
      if (spec.note) s += T(150, 24, spec.note, gold, 12.5, "middle", "bold");
      s += `<polygon points="${blx},${bly} ${brx},${bly} ${tlx},${tly}" fill="rgba(57,135,229,0.12)" stroke="${blue}" stroke-width="2"/>`;
      s += `<path d="M ${blx + 12},${bly} L ${blx + 12},${bly - 12} L ${blx},${bly - 12}" fill="none" stroke="${axis}" stroke-width="1.3"/>`;
      s += T((blx + brx) / 2, bly + 18, spec.aLabel || ("" + a), ink, 12, "middle");
      s += T(blx - 8, (bly + tly) / 2, spec.bLabel || ("" + b), ink, 12, "end");
      s += T((brx + tlx) / 2 + 6, (bly + tly) / 2 - 6, spec.cLabel || ("" + spec.c), gold, 12, "start", "bold");
      if (spec.angle) {
        s += `<path d="M ${brx - 26},${bly} A 26 26 0 0 1 ${brx - 26 * Math.cos(Math.atan2(hei, base))},${bly - 26 * Math.sin(Math.atan2(hei, base))}" fill="none" stroke="${gold}" stroke-width="1.4"/>`;
        s += T(brx - 34, bly - 9, "θ", gold, 13, "middle", "bold");
      }
    }

    else if (spec.type === "rectangle") {
      const w = spec.w, h = spec.h, mx = Math.max(w, h);
      const pw = w / mx * 170, ph = h / mx * 130, x0 = 70, y0 = 55;
      if (spec.note) s += T(150, 24, spec.note, gold, 12.5, "middle", "bold");
      s += `<rect x="${x0}" y="${y0}" width="${pw}" height="${ph}" fill="rgba(57,135,229,0.12)" stroke="${blue}" stroke-width="2"/>`;
      s += T(x0 + pw / 2, y0 + ph + 18, spec.wLabel || ("" + w), ink, 12, "middle");
      s += T(x0 - 8, y0 + ph / 2, spec.hLabel || ("" + h), ink, 12, "end");
      if (spec.area) s += T(x0 + pw / 2, y0 + ph / 2 + 4, spec.area, gold, 13, "middle", "bold");
    }

    else if (spec.type === "areaModel") {
      // 2x2 box method for (top0+top1)(left0+left1)
      const gx = 90, gy = 55, gw = 170, gh = 130, cw = gw / 2, ch = gh / 2;
      if (spec.note) s += T(180, 24, spec.note, gold, 12.5, "middle", "bold");
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
        s += `<rect x="${gx + c * cw}" y="${gy + r * ch}" width="${cw}" height="${ch}" fill="rgba(57,135,229,0.08)" stroke="${blue}" stroke-width="1.5"/>`;
        s += T(gx + c * cw + cw / 2, gy + r * ch + ch / 2 + 5, spec.cells[r][c], gold, 14, "middle", "bold");
      }
      s += T(gx + cw / 2, gy - 8, spec.top[0], ink, 12.5, "middle");
      s += T(gx + cw + cw / 2, gy - 8, spec.top[1], ink, 12.5, "middle");
      s += T(gx - 8, gy + ch / 2 + 4, spec.left[0], ink, 12.5, "end");
      s += T(gx - 8, gy + ch + ch / 2 + 4, spec.left[1], ink, 12.5, "end");
    }

    else if (spec.type === "circle") {
      const cx = 150, cy = 118, r = 68;
      if (spec.note) s += T(150, 24, spec.note, gold, 12.5, "middle", "bold");
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(57,135,229,0.10)" stroke="${blue}" stroke-width="2"/>`;
      s += `<circle cx="${cx}" cy="${cy}" r="3" fill="${ink}"/>`;
      s += `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${gold}" stroke-width="1.8"/>`;
      s += T(cx + r / 2, cy - 6, spec.rLabel || "r", gold, 12, "middle", "bold");
      if (spec.dLabel) { s += `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${ink2}" stroke-width="1" stroke-dasharray="4 3"/>`; s += T(cx, cy + 16, spec.dLabel, ink2, 11, "middle"); }
    }

    else if (spec.type === "barModel") {
      const segs = spec.segments, total = segs.reduce((n, x) => n + x.v, 0);
      const x0 = 34, x1 = 272, y = 96, h = 40, wpx = x1 - x0, cols = [blue, gold, "#4a3aa7", aqua];
      let cx = x0;
      segs.forEach((sg, i) => {
        const w = sg.v / total * wpx;
        s += `<rect x="${cx}" y="${y}" width="${w}" height="${h}" fill="${sg.color || cols[i % cols.length]}" opacity="0.85" stroke="${surf}" stroke-width="2"/>`;
        s += T(cx + w / 2, y + h / 2 + 5, sg.label, "#fff", 12, "middle", "bold");
        cx += w;
      });
      if (spec.caption) s += T(150, y + h + 26, spec.caption, ink, 12.5, "middle");
    }

    else if (spec.type === "numberLine") {
      const min = spec.min, max = spec.max, x0 = 34, x1 = 274, y = 128, map = v => x0 + (v - min) / (max - min) * (x1 - x0);
      s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${axis}" stroke-width="2"/>`;
      for (let v = Math.ceil(min); v <= max; v++) { s += `<line x1="${map(v)}" y1="${y - 4}" x2="${map(v)}" y2="${y + 4}" stroke="${ink2}" stroke-width="1"/>`; s += T(map(v), y + 18, v, ink2, 10, "middle"); }
      if (spec.distance) {
        const a = map(spec.distance.from), b = map(spec.distance.to), by = y - 34;
        s += `<line x1="${a}" y1="${by}" x2="${b}" y2="${by}" stroke="${gold}" stroke-width="1.6"/>`;
        s += `<line x1="${a}" y1="${by}" x2="${a}" y2="${y}" stroke="${gold}" stroke-width="1" stroke-dasharray="3 2"/>`;
        s += `<line x1="${b}" y1="${by}" x2="${b}" y2="${y}" stroke="${gold}" stroke-width="1" stroke-dasharray="3 2"/>`;
        s += T((a + b) / 2, by - 6, spec.distance.label, gold, 12.5, "middle", "bold");
      }
      (spec.points || []).forEach(p => { s += `<circle cx="${map(p.x)}" cy="${y}" r="5" fill="${p.color || blue}"/>`; if (p.label) s += T(map(p.x), y - 12, p.label, p.color || ink, 11, "middle", "bold"); });
      if (spec.caption) s += T(150, y + 40, spec.caption, ink, 12.5, "middle");
    }

    else if (spec.type === "functionMachine") {
      s += T(60, 82, "input", ink2, 11, "middle");
      s += `<rect x="30" y="92" width="60" height="46" rx="8" fill="rgba(57,135,229,0.15)" stroke="${blue}" stroke-width="1.5"/>`;
      s += T(60, 121, spec.input, ink, 16, "middle", "bold");
      s += `<line x1="92" y1="115" x2="118" y2="115" stroke="${ink2}" stroke-width="2" marker-end="url(#arr)"/>`;
      s += T(165, 80, "the rule (formula)", gold, 11, "middle");
      s += `<rect x="120" y="88" width="92" height="66" rx="10" fill="rgba(250,178,25,0.12)" stroke="${gold}" stroke-width="1.5"/>`;
      s += T(166, 128, spec.rule, ink, 15, "middle", "bold");
      s += `<line x1="214" y1="115" x2="240" y2="115" stroke="${ink2}" stroke-width="2" marker-end="url(#arr)"/>`;
      s += T(270, 82, "output", ink2, 11, "middle");
      s += `<rect x="240" y="92" width="60" height="46" rx="8" fill="rgba(12,163,12,0.15)" stroke="${good}" stroke-width="1.5"/>`;
      s += T(270, 121, spec.output, ink, 16, "middle", "bold");
    }

    else if (spec.type === "probGrid") {
      let cells = spec.cells;
      if (!cells) {
        const fav = spec.favIdx || [];
        cells = [];
        for (let i = 0; i < spec.count; i++)
          cells.push({ color: fav.includes(i) ? (spec.favColor || grid) : (spec.otherColor || grid), fav: fav.includes(i) });
      }
      const per = spec.perRow || Math.min(cells.length, 6);
      const rows = Math.ceil(cells.length / per), cell = Math.min(34, 190 / per, 150 / rows);
      const gw = per * cell, ox = (W - gw) / 2, oy = 42;
      cells.forEach((cc, i) => {
        const r = Math.floor(i / per), c = i % per;
        s += `<rect x="${ox + c * cell}" y="${oy + r * cell}" width="${cell - 3}" height="${cell - 3}" rx="4" fill="${cc.color || grid}" opacity="0.9"/>`;
        if (cc.fav) s += `<rect x="${ox + c * cell - 1}" y="${oy + r * cell - 1}" width="${cell - 1}" height="${cell - 1}" rx="4" fill="none" stroke="${gold}" stroke-width="2.5"/>`;
      });
      if (spec.caption) s += T(150, oy + rows * cell + 22, spec.caption, ink, 12.5, "middle", "bold");
    }

    else if (spec.type === "systemLines") {
      const L = spec.lines, sol = spec.solution, M = 24;
      const minX = sol[0] - 6, maxX = sol[0] + 6, minY = sol[1] - 6, maxY = sol[1] + 6;
      const sx = x => M + (x - minX) / (maxX - minX) * (W - 2 * M), sy = y => (H - M) - (y - minY) / (maxY - minY) * (H - 2 * M);
      for (let g = Math.ceil(minX); g <= maxX; g += 2) s += `<line x1="${sx(g)}" y1="${sy(minY)}" x2="${sx(g)}" y2="${sy(maxY)}" stroke="${grid}" stroke-width="1"/>`;
      for (let g = Math.ceil(minY); g <= maxY; g += 2) s += `<line x1="${sx(minX)}" y1="${sy(g)}" x2="${sx(maxX)}" y2="${sy(g)}" stroke="${grid}" stroke-width="1"/>`;
      if (minY <= 0 && maxY >= 0) s += `<line x1="${sx(minX)}" y1="${sy(0)}" x2="${sx(maxX)}" y2="${sy(0)}" stroke="${axis}" stroke-width="1.3"/>`;
      if (minX <= 0 && maxX >= 0) s += `<line x1="${sx(0)}" y1="${sy(minY)}" x2="${sx(0)}" y2="${sy(maxY)}" stroke="${axis}" stroke-width="1.3"/>`;
      L.forEach((ln, i) => { const c = i === 0 ? blue : aqua; s += `<line x1="${sx(minX)}" y1="${sy(ln.m * minX + ln.b)}" x2="${sx(maxX)}" y2="${sy(ln.m * maxX + ln.b)}" stroke="${c}" stroke-width="2"/>`; });
      s += `<circle cx="${sx(sol[0])}" cy="${sy(sol[1])}" r="6" fill="${gold}" stroke="#0d0d0d" stroke-width="1"/>`;
      s += T(sx(sol[0]) + 8, sy(sol[1]) + 4, `(${sol[0]}, ${sol[1]})`, gold, 12, "start", "bold");
      s += T(150, 22, spec.note || "where the two lines cross = the solution", gold, 11.5, "middle", "bold");
    }

    s += `</svg>`;
    const wrap = el("div", "plotwrap"); wrap.innerHTML = s; return wrap;
  }

  // ---------- "why this, not that?" reasoning guide (always offline) ----------
  const WHY_GUIDE = {
    m_asked: { whyThis: "This tests whether you read to the end — the math is usually easy. Circle exactly what's asked before you touch an answer.", whyNot: "The number from stopping early (x when they wanted 4x) is planted in the choices on purpose. 'It fits' isn't the test — 'it's what they asked for' is." },
    m_backsolve: { whyThis: "When the answers are plain numbers, they're a gift: plug each into the problem and see which one works. A check-it problem is safer than a solve-it problem.", whyNot: "Full algebra isn't wrong, just slower with more places to slip. Reach for it only when the choices aren't numbers you can test." },
    m_plugin: { whyThis: "When the choices contain variables (or it says 'in terms of'), invent easy numbers, run the problem, and match. It turns abstract algebra into arithmetic you can trust.", whyNot: "Pushing the letters around directly works, but one sign slip and you're lost with nothing to check against. Real numbers catch your mistakes." },
    m_translate: { whyThis: "Word problems are English that needs converting: 'of'=×, 'per'=÷, 'is'==, 'less than' flips the order. Translate phrase by phrase, then compute.", whyNot: "Guessing the equation from the 'feel' of the sentence is where the flip-traps live — '5 less than x' is x−5, never 5−x." },
    m_lines: { whyThis: "Two points, a graph, 'parallel/perpendicular', or y=mx+b all point to slope. Slope = rise/run is the master key for the whole coordinate plane.", whyNot: "Don't grab distance or midpoint just because there are points — the question names its own tool: steepness→slope, exact middle→midpoint, length→distance." },
    m_geometry: { whyThis: "A handful of formulas cover it, and the picture tells you which: sides of a right triangle→Pythagorean, a round thing→circle formulas, a flat shape→its area formula.", whyNot: "The classic circle trap: they hand you a diameter and you plug it in as the radius. Same formula, wrong number in, wrong answer — read what you're actually given." },
    m_ratio: { whyThis: "Ratios and percents are all 'part vs. whole.' Set them up as fractions and scale; percent change is always change ÷ the ORIGINAL.", whyNot: "You can't add or subtract percents of different amounts — a 30% drop then a 30% rise doesn't return you to start, because the base changed. Use proportion, not addition." },
    m_average: { whyThis: "The move is 'total = average × count.' Convert to totals, work there, divide once at the end — almost every average problem cracks open this way.", whyNot: "Averaging the averages feels right but usually isn't: groups of different sizes don't share equally. And median ignores the extremes, so it's not the mean." },
    m_exponents: { whyThis: "Same base? The exponents combine by four rules: add to multiply, subtract to divide, multiply for a power-of-a-power, flip for a negative.", whyNot: "The tempting shortcut — multiplying the bases, or multiplying exponents when you should add — is the #1 slip. x³·x² is x⁵, not x⁶ and not 2x⁵." },
    m_quadratic: { whyThis: "Factoring hunts for two numbers that multiply to the last term and add to the middle. The area-model box shows exactly why those two terms appear.", whyNot: "The quadratic formula always works but is slower and error-prone — save it for when factoring won't go. And solving x²=k, don't drop the negative root; squaring hides the sign." },
    m_functions: { whyThis: "f(x) is a machine: whatever's in the parentheses replaces every x. For f(g(x)), run the inner machine first, then feed its output to the outer one.", whyNot: "Doing the functions in the wrong order gives a different answer — f(g(2)) ≠ g(f(2)). The parentheses set the order; you don't get to rearrange them." },
    m_trig: { whyThis: "SOHCAHTOA picks the ratio for you: name the sides from the angle's point of view, then choose sin/cos/tan by which two sides you actually have.", whyNot: "This is the real 'circle in the square hole': all three ratios fit the same triangle, but only the one matching your two sides is right. Using sin when you have adjacent+hypotenuse (that's cosine) is the trap." },
    m_probability: { whyThis: "Probability is favorable ÷ total. Two things happening together ('and') multiply; counting how many ways multiplies the options at each step.", whyNot: "Adding when you should multiply is the classic error — two coins both heads is ½×½=¼, not ½+½. 'And' is almost never addition." },
    m_systems: { whyThis: "Two equations, two unknowns: add/subtract to cancel a variable, or substitute one into the other. On a graph, the answer is where the two lines cross.", whyNot: "One equation alone can't pin it down — one equation with two unknowns has infinite solutions. You need both, combined, to find the single crossing point." },
    m_rates: { whyThis: "Build the rate (a division with units), then multiply — and make the units cancel. For unit changes, multiply by the conversion written as a fraction so the old unit cancels out.", whyNot: "Don't just multiply the two numbers you're given. If the units don't line up (minutes vs seconds, yards vs feet), you'll get an answer that's off by a factor. Let the units tell you whether to multiply or divide." }
  };

  // ---------- local AI bridge (the student's OWN Ollama, via the C# host — nothing leaves the machine) ----------
  const hasBridge = () => !!(window.chrome && window.chrome.webview);
  let _ollama = { checked: false, ok: false, model: "", models: [], warm: false };
  const _pending = {};
  let _aiProgressCb = null;
  let _updateProgressCb = null;
  if (hasBridge()) {
    window.chrome.webview.addEventListener("message", ev => {
      let d; try { d = typeof ev.data === "string" ? JSON.parse(ev.data) : ev.data; } catch { return; }
      if (!d || typeof d !== "object") return;
      if (d.type === "micdrop-response" && _pending[d.id]) _pending[d.id](d);
      else if (d.type === "micdrop-event" && d.method === "aiSetupProgress" && _aiProgressCb)
        _aiProgressCb(d.payload || {});
      else if (d.type === "micdrop-event" && d.method === "appUpdateProgress" && _updateProgressCb)
        _updateProgressCb(d.payload || {});
    });
  }
  function bridge(method, params = {}, timeoutMs = 120000) {
    return new Promise(resolve => {
      if (!hasBridge()) { resolve({ ok: false, error: "nobridge" }); return; }
      const id = "b" + Math.random().toString(36).slice(2);
      const timer = setTimeout(() => {
        if (_pending[id]) {
          delete _pending[id];
          resolve({ ok: false, error: "Desktop request timed out." });
        }
      }, timeoutMs);
      _pending[id] = response => {
        clearTimeout(timer);
        delete _pending[id];
        resolve(response.ok
          ? { ok: true, ...(response.result || {}) }
          : { ok: false, error: response.error || "Desktop request failed." });
      };
      window.chrome.webview.postMessage(JSON.stringify({
        type: "micdrop-message",
        id,
        method,
        params
      }));
    });
  }
  speech.refreshVoices();

  async function ollamaCheck() {
    if (_ollama.checked) return _ollama;
    const r = await bridge("ollamaPing", {}, 6000);
    _ollama = {
      checked: true,
      ok: !!(r.ok && r.ready),
      running: !!r.running,
      model: r.model || "",
      models: Array.isArray(r.models) ? r.models : [],
      warm: false
    };
    return _ollama;
  }
  const ollamaAsk = (system, prompt) => bridge("ollamaChat", { model: _ollama.model, system, prompt }, 120000);
  // awaited warm-up: resolves { ready } once the model is actually loaded into memory
  const ollamaWarm = () => bridge("ollamaWarm", {}, 200000);

  function buildChatContext(q, correct, pat) {
    let c = "PATTERN: " + pat.name + " — " + pat.rule + "\n";
    if (q.context) c += "PASSAGE: " + q.context + "\n";
    if (q.passage) c += "QUESTION: " + q.passage.replace(/\|/g, "") + "\n";
    if (q.prompt) c += "PROMPT: " + q.prompt + "\n";
    c += "CHOICES: " + q.choices.map(ch => ch.text).join(" | ") + "\n";
    c += "CORRECT ANSWER: " + correct.text + " — because " + correct.why + "\n";
    const f = questionFormula(q);
    if (f) c += "FORMULA USED: " + f.key + ": " + f.expr + (f.data ? (" ; plugging in: " + f.data) : "") + (f.answer ? (" ; = " + f.answer) : "") + "\n";
    return c;
  }

  const CHAT_SYSTEM =
    "You are a patient ACT tutor for a student with ADHD and a processing disability. You are GIVEN the question, its correct answer, the formula used, and the pattern. Explain the REASONING in plain, warm, encouraging language — especially WHY this approach is the right tool and WHY a tempting alternative would not work. Do NOT solve a different problem, do NOT contradict the given correct answer, and never invent a formula. If you are unsure, say so honestly. Keep it under 120 words.";

  async function openWhyChat(q) {
    stopSpeech();
    const pat = ACT_PATTERNS[q.pattern];
    const correct = q.choices.find(c => c.correct);
    const guide = WHY_GUIDE[q.pattern] || null;

    const ov = el("div", "chatoverlay");
    const panel = el("div", "chatpanel");
    const hd = el("div", "chd");
    const title = el("h3", null, "Why this answer?");
    hd.append(title);
    const x = el("button", "btn ghost", "Close");
    hd.append(x);
    panel.append(hd);

    const body = el("div", "cbody");
    if (guide) {
      const r = el("div", "chatreason");
      r.append(el("div", "lbl", "Why this approach"), el("p", null, esc(guide.whyThis)),
               el("div", "lbl", "Why not something else"), el("p", null, esc(guide.whyNot)));
      body.append(r);
    }
    const log = el("div", "chatlog"); body.append(log);
    panel.append(body);

    const status = el("div", "chatstatus", "Checking for your local AI…");
    status.setAttribute("aria-live", "polite");
    panel.append(status);
    const ft = el("div", "chatft");
    const input = el("input"); input.type = "text";
    input.setAttribute("aria-label", "Ask the local tutor a follow-up question");
    input.placeholder = "Ask a follow-up — e.g. why not use the other formula?";
    input.disabled = true;
    const send = el("button", "btn", "Ask"); send.disabled = true;
    ft.append(input, send); panel.append(ft);
    ov.append(panel);
    const close = mountModal(ov, panel, title, x);
    x.onclick = close;

    const addMsg = (cls, text) => { const d = el("div", "chatmsg " + cls, esc(text)); log.append(d); body.scrollTop = body.scrollHeight; return d; };
    const ctx = buildChatContext(q, correct, pat);
    async function ask(userQ) {
      addMsg("user", userQ);
      input.value = ""; input.disabled = true; send.disabled = true;
      const thinking = addMsg("ai", "…thinking… (the very first answer can take a few seconds while the model warms up)");
      const r = await ollamaAsk(CHAT_SYSTEM, ctx + "\nStudent's question: " + userQ);
      thinking.remove();
      if (r.ok && r.text) addMsg("ai", r.text);
      else addMsg("sys", "Couldn't reach the local AI just now — the reasoning guide above still answers the big one, and you can try again once Ollama is running.");
      input.disabled = false; send.disabled = false; input.focus();
    }
    send.onclick = () => { const v = input.value.trim(); if (v) ask(v); };
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); const v = input.value.trim(); if (v) ask(v); } });

    const oll = await ollamaCheck();
    if (!hasBridge())
      status.textContent = "Live Q&A runs in the desktop app with Ollama. The reasoning guide above is always here.";
    else if (oll.ok) {
      input.disabled = false; send.disabled = false; input.focus();
      if (!guide) addMsg("sys", "Ask me why this works — or why another method wouldn't.");
      if (_ollama.warm) {
        status.textContent = "🟢 Ready (" + oll.model + ") — warmed up, answers are quick.";
      } else {
        status.innerHTML = "🟡 <span class=\"warming\">Warming up the tutor…</span> first time only (~20–40s). Type your question now — it answers the moment it's ready.";
        ollamaWarm().then(r => {
          _ollama.warm = !!(r && r.ready);
          status.innerHTML = _ollama.warm
            ? "🟢 Ready (" + esc(oll.model) + ") — warmed up, answers are quick now."
            : "🟢 Ready (" + esc(oll.model) + "). The first answer may still take a moment.";
        });
      }
    } else if (oll.running)
      status.textContent = "Ollama is running but has no model yet. In a terminal run:  ollama pull qwen3:8b  — then reopen this.";
    else
      status.textContent = "Live Q&A is off. Start the Ollama app to chat — meanwhile the reasoning guide above still helps.";
  }

  // ---------- step-by-step: reveal ONE small move at a time (beats panic) ----------
  function stepPanel(q) {
    stopSpeech();
    const ov = el("div", "chatoverlay");
    const panel = el("div", "chatpanel");
    const hd = el("div", "chd");
    const title = el("h3", null, "Break it down — one step at a time");
    hd.append(title);
    const x = el("button", "btn ghost", "Close");
    hd.append(x); panel.append(hd);
    const body = el("div", "cbody");
    const qline = q.passage ? q.passage.replace(/\|/g, "") : (q.prompt || "");
    if (qline) body.append(el("div", "stepq", esc(qline)));
    const list = el("div", "steplist"); body.append(list);
    panel.append(body);
    const ft = el("div", "chatft");
    const nextBtn = el("button", "btn", "Show first step ▶");
    ft.append(nextBtn); panel.append(ft);
    ov.append(panel);
    const close = mountModal(ov, panel, title, nextBtn);
    x.onclick = close;

    // the picture that goes with it, drawn in as the work starts
    if (q.plot) { const p = coordPlot(q.plot); p.classList.add("workviz"); body.append(p); }
    else if (q.diagram) { const d = mathDiagram(q.diagram); d.classList.add("workviz"); body.append(d); }

    const steps = guidedMathSteps(q);
    let i = 0, playing = false, timer = null;

    // "2x + 7 = 19 → subtract 7 → 2x = 12" is the equation being worked. Split it on the
    // arrows and let each state land one at a time — the move it took shown between them.
    function equationReel(text) {
      const parts = text.split("→").map(p => p.trim()).filter(Boolean);
      if (parts.length < 2) return null;
      const reel = el("div", "eqreel");
      parts.forEach((part, idx) => {
        // a piece with a relational operator is a state of the equation; the rest is the move
        const isState = /[=<>≤≥]/.test(part) || /^[-+]?[\d(]/.test(part);
        const delay = (idx * 0.42) + "s";
        if (idx) {
          const arrow = el("span", "eqarrow", "→");
          arrow.style.animationDelay = delay; // the arrow arrives with the move it introduces
          reel.append(arrow);
        }
        const seg = el("span", isState ? "eqstate" : "eqop", esc(part));
        seg.style.animationDelay = delay;
        reel.append(seg);
      });
      return reel;
    }

    function reveal() {
      if (i >= steps.length) { stopPlay(); close(); return; }
      const s = steps[i]; i++;
      const it = el("div", "stepitem");
      it.append(el("div", "stepnum", "Step " + i + " of " + steps.length));
      const reel = equationReel(s.do);
      // the reel already carries the opening state, so don't print the line twice
      if (reel) it.append(reel);
      else it.append(el("div", "stepdo", esc(s.do)));
      if (s.why) it.append(el("div", "stepwhy", esc(s.why)));
      list.append(it); body.scrollTop = body.scrollHeight;
      if (i >= steps.length) {
        nextBtn.textContent = "Done ✓";
        stopPlay();
        list.append(el("div", "stepdone", "That's the whole thing — " + steps.length + " small moves, no scary leap. None of them was the monster it looked like all together."));
      } else nextBtn.textContent = "Next step ▶";
      if (!playing) nextBtn.focus();
    }

    // play it through: the whole solution works itself, at a pace you can read
    function stopPlay() {
      playing = false;
      if (timer) { clearTimeout(timer); timer = null; }
      playBtn.textContent = i >= steps.length ? "↻ Play again" : "▶ Play it through";
      playBtn.setAttribute("aria-pressed", "false");
    }
    function tick() {
      if (!playing) return;
      if (i >= steps.length) { stopPlay(); return; }
      reveal();
      timer = setTimeout(tick, 2600);
    }
    const playBtn = el("button", "btn ghost", "▶ Play it through");
    playBtn.setAttribute("aria-pressed", "false");
    playBtn.onclick = () => {
      if (playing) { stopPlay(); return; }
      if (i >= steps.length) { i = 0; list.innerHTML = ""; nextBtn.textContent = "Show first step ▶"; }
      playing = true;
      playBtn.textContent = "⏸ Pause";
      playBtn.setAttribute("aria-pressed", "true");
      announce("Playing the worked solution.");
      tick();
    };
    ft.append(playBtn);

    nextBtn.onclick = () => { stopPlay(); reveal(); };
    x.onclick = () => { stopPlay(); close(); };
    nextBtn.focus();
  }

  // ---------- settings: theme + text size ----------
  function openSettings() {
    stopSpeech();
    const ov = el("div", "chatoverlay");
    const panel = el("div", "chatpanel");
    const hd = el("div", "chd");
    const title = el("h3", null, "Settings");
    hd.append(title);
    const x = el("button", "btn ghost", "Close");
    hd.append(x); panel.append(hd);
    const body = el("div", "cbody");

    // Theme
    const tg = el("div", "setgroup");
    tg.append(el("div", "setlabel", "Appearance"));
    const topts = el("div", "setopts");
    [["dark", "🌙 Dark"], ["light", "☀ Light"]].forEach(([val, label]) => {
      const b = el("button", "setbtn" + (S.theme === val ? " on" : ""), label);
      b.setAttribute("aria-pressed", String(S.theme === val));
      b.onclick = () => {
        S.theme = val; save(); applyTheme();
        topts.querySelectorAll(".setbtn").forEach(x => {
          x.classList.remove("on"); x.setAttribute("aria-pressed", "false");
        });
        b.classList.add("on");
        b.setAttribute("aria-pressed", "true");
      };
      topts.append(b);
    });
    tg.append(topts);
    body.append(tg);

    // Text size
    const sg = el("div", "setgroup");
    sg.append(el("div", "setlabel", "Text size"));
    const sopts = el("div", "setopts");
    [["Small", 0.9], ["Normal", 1], ["Large", 1.2], ["Extra large", 1.45]].forEach(([label, val]) => {
      const b = el("button", "setbtn" + (Math.abs((S.fontScale || 1) - val) < 0.001 ? " on" : ""), label);
      b.setAttribute("aria-pressed", String(Math.abs((S.fontScale || 1) - val) < 0.001));
      b.onclick = () => {
        S.fontScale = val; save(); applyFontScale();
        sopts.querySelectorAll(".setbtn").forEach(x => {
          x.classList.remove("on"); x.setAttribute("aria-pressed", "false");
        });
        b.classList.add("on");
        b.setAttribute("aria-pressed", "true");
      };
      sopts.append(b);
    });
    sg.append(sopts);
    sg.append(el("div", "setnote", "Makes everything — including the Reference formulas — bigger or smaller. Your choice is remembered."));
    body.append(sg);

    // Read-aloud volume (+ on/off)
    const vg = el("div", "setgroup");
    vg.append(el("div", "setlabel", "Read-aloud voice"));
    const vrow = el("div", "setopts");
    const voiceToggle = el("button", "setbtn" + (S.audio.on ? " on" : ""), S.audio.on ? "🔊 On" : "🔇 Off");
    voiceToggle.setAttribute("aria-pressed", String(S.audio.on));
    voiceToggle.onclick = () => {
      S.audio.on = !S.audio.on; if (!S.audio.on) stopSpeech(); save();
      voiceToggle.className = "setbtn" + (S.audio.on ? " on" : "");
      voiceToggle.textContent = S.audio.on ? "🔊 On" : "🔇 Off";
      voiceToggle.setAttribute("aria-pressed", String(S.audio.on));
    };
    vrow.append(voiceToggle);
    vg.append(vrow);

    const voiceLabel = el("label", "setlabel", "Windows voice");
    const voiceSelect = el("select", "voicesel");
    const voiceSelectId = "voice-" + Math.random().toString(36).slice(2);
    voiceSelect.id = voiceSelectId;
    voiceLabel.htmlFor = voiceSelectId;
    const previewVoice = el("button", "setbtn", "Preview voice");
    const voiceRow = el("div", "voiceopts");
    voiceRow.append(voiceSelect, previewVoice);
    vg.append(voiceLabel, voiceRow);

    const populateVoiceOptions = () => {
      const voices = speech.voices();
      voiceSelect.innerHTML = "";
      if (!voices.length) {
        const option = el("option", null, "Windows is still loading its installed voices…");
        option.value = "";
        voiceSelect.append(option);
        voiceSelect.disabled = true;
        previewVoice.disabled = true;
        return;
      }

      const chosen = speech.selectedVoice();
      voices.forEach(voice => {
        const option = el("option", null, esc(voice.name + " (" + voice.lang + ")"));
        option.value = speech.voiceId(voice);
        option.selected = chosen && option.value === speech.voiceId(chosen);
        voiceSelect.append(option);
      });
      voiceSelect.disabled = false;
      previewVoice.disabled = false;
    };
    populateVoiceOptions();
    window.addEventListener("actdrill:voices-changed", populateVoiceOptions, { once: true });
    voiceSelect.onchange = () => {
      S.audio.voiceId = voiceSelect.value;
      S.audio.on = true;
      save();
      voiceToggle.className = "setbtn on";
      voiceToggle.textContent = "🔊 On";
      voiceToggle.setAttribute("aria-pressed", "true");
      speak("This is your ACTDrill voice. I will read the whole question without dropping out.");
    };
    previewVoice.onclick = () => {
      if (voiceSelect.value) S.audio.voiceId = voiceSelect.value;
      S.audio.on = true;
      save();
      speak("Start with one small move. We can work the rest together.");
    };
    vg.append(el(
      "div",
      "setnote",
      "The desktop app renders one complete Windows audio file before playback. " +
      "Math symbols are translated into spoken language first."
    ));

    vg.append(el("div", "setlabel", "Volume"));
    const volrow = el("div", "setopts");
    [["Quiet", 0.3], ["Medium", 0.65], ["Full", 1]].forEach(([label, val]) => {
      const b = el("button", "setbtn" + (Math.abs((S.audio.volume == null ? 1 : S.audio.volume) - val) < 0.001 ? " on" : ""), label);
      b.onclick = () => {
        S.audio.volume = val; save();
        volrow.querySelectorAll(".setbtn").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
        if (S.audio.on) speak("Volume set."); // hear the change immediately
      };
      volrow.append(b);
    });
    vg.append(volrow);
    body.append(vg);

    // Daily goal — small is allowed; the point is to START
    const gg = el("div", "setgroup");
    gg.append(el("div", "setlabel", "Daily goal"));
    const grow = el("div", "setopts");
    [3, 5, 10, 15].forEach(n => {
      const b = el("button", "setbtn" + (goal() === n ? " on" : ""), n + " a day");
      b.onclick = () => {
        S.dailyGoal = n; save(); renderChips();
        grow.querySelectorAll(".setbtn").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
      };
      grow.append(b);
    });
    gg.append(grow);
    gg.append(el("div", "setnote", "Rough day? Set it to 3. Doing even ONE question still counts as a win — starting is the whole battle."));
    body.append(gg);

    // Your notes — the study sheet he writes himself
    const ng = el("div", "setgroup");
    ng.append(el("div", "setlabel", "Your notes"));
    const nrow = el("div", "setopts");
    const noteCount = Object.keys(S.memos || {}).filter(id => S.memos[id]).length;
    const openPanel = el("button", "setbtn", "📓 Open notes panel");
    openPanel.onclick = () => { close(); toggleNotesPanel(true); };
    const mdBtn = el("button", "setbtn", "Save as Markdown (.md)");
    mdBtn.disabled = noteCount === 0;
    mdBtn.onclick = saveNotesMarkdown;
    const wipeBtn = el("button", "setbtn", "Erase all notes");
    wipeBtn.disabled = noteCount === 0;
    wipeBtn.onclick = () => {
      if (!confirm("Erase all " + noteCount + " of your notes? This can't be undone — save them as a Markdown file first if you want to keep them.")) return;
      S.memos = {}; save();
      wipeBtn.disabled = true; mdBtn.disabled = true;
      refreshNotesPanel();
      if (!document.getElementById("view-progress").classList.contains("hidden")) renderProgress();
      announce("All notes erased.");
    };
    nrow.append(openPanel, mdBtn, wipeBtn);
    ng.append(nrow);
    ng.append(el("div", "setnote", noteCount
      ? noteCount + (noteCount === 1 ? " note" : " notes") + " saved. The Markdown file is a plain study sheet — it opens anywhere, and printing it makes a decent review page."
      : "No notes yet. On any answered question, hit 📝 Add a note and write the thing you keep forgetting."));
    body.append(ng);

    // App updates — check GitHub, verify the download, hand it to the installer
    const ug = el("div", "setgroup");
    ug.append(el("div", "setlabel", "App updates"));
    const ustat = el("div", "aistat", hasBridge()
      ? "You're running ACTDrill " + APP_VERSION + "."
      : "Updates arrive with the desktop app — this is the browser preview.");
    ug.append(ustat);
    if (hasBridge()) {
      const uprogWrap = el("div", "aiprogwrap hidden");
      const ubar = el("i");
      const uprog = el("div", "aiprog"); uprog.append(ubar);
      uprog.setAttribute("role", "progressbar");
      uprog.setAttribute("aria-label", "Update download");
      uprog.setAttribute("aria-valuemin", "0");
      uprog.setAttribute("aria-valuemax", "100");
      uprog.setAttribute("aria-valuenow", "0");
      const ulabel = el("div", "aiproglabel", "");
      uprogWrap.append(uprog, ulabel);

      const urow = el("div", "setopts");
      const checkBtn = el("button", "setbtn", "Check for updates");
      const installBtn = el("button", "setbtn hidden", "Download & install");
      urow.append(checkBtn, installBtn);
      ug.append(urow, uprogWrap);

      checkBtn.onclick = async () => {
        checkBtn.disabled = true; checkBtn.textContent = "Checking…";
        const r = await bridge("appUpdateCheck", {}, 30000);
        checkBtn.disabled = false; checkBtn.textContent = "Check for updates";
        if (!r.ok) { ustat.textContent = r.error || "Could not check for updates."; return; }
        const info = r.result || {};
        if (!info.newer) {
          ustat.textContent = "You're on the latest version (" + info.current + ").";
          announce("ACTDrill is up to date.");
          return;
        }
        ustat.innerHTML = "<b>Version " + esc(info.latest) + " is out</b> — you have " + esc(info.current) + "." +
          (info.notes ? "<br>" + esc(info.notes) : "");
        if (info.installable) {
          installBtn.classList.remove("hidden");
          ug.querySelector(".setnote").textContent =
            "The download is checked against its published checksum before anything runs. ACTDrill closes so the installer can replace it — your progress and notes stay put.";
        } else {
          ustat.innerHTML += "<br>Grab it from the releases page — this one can't be installed automatically.";
        }
        announce("An update is available.");
      };

      installBtn.onclick = async () => {
        installBtn.disabled = true; checkBtn.disabled = true;
        uprogWrap.classList.remove("hidden");
        _updateProgressCb = (d) => {
          const percent = Math.max(0, Math.min(100, Number(d.percent) || 0));
          ubar.style.width = percent + "%";
          uprog.setAttribute("aria-valuenow", String(percent));
          ulabel.textContent = d.label || "";
        };
        const r = await bridge("appUpdateInstall", {}, 1800000);
        _updateProgressCb = null;
        if (!r.ok) {
          installBtn.disabled = false; checkBtn.disabled = false;
          ulabel.textContent = r.error || "The update could not be installed.";
          announce("The update did not install.");
        }
      };
    }
    ug.append(el("div", "setnote", hasBridge()
      ? "Checks GitHub for a newer ACTDrill. Nothing is downloaded until you ask for it."
      : "In the desktop app this checks GitHub for a newer version."));
    body.append(ug);

    // Highlights — the moving gradient on note surfaces
    const hg = el("div", "setgroup");
    hg.append(el("div", "setlabel", "Note highlights"));
    const hrow = el("div", "setopts");
    [[true, "✨ On"], [false, "Plain"]].forEach(([val, label]) => {
      const b = el("button", "setbtn" + (S.glow === val ? " on" : ""), label);
      b.setAttribute("aria-pressed", String(S.glow === val));
      b.onclick = () => {
        S.glow = val; save(); applyGlow();
        hrow.querySelectorAll(".setbtn").forEach(x => {
          x.classList.remove("on"); x.setAttribute("aria-pressed", "false");
        });
        b.classList.add("on");
        b.setAttribute("aria-pressed", "true");
      };
      hrow.append(b);
    });
    hg.append(hrow);
    hg.append(el("div", "setnote", "The colored border that circles the note box and the question chat. Set it to Plain if the movement pulls your eye off the question."));
    body.append(hg);

    // AI tutor (optional) — status + one-click install with progress
    const ag = el("div", "setgroup");
    ag.append(el("div", "setlabel", "AI tutor — the 'Why this?' chat (optional)"));
    const stat = el("div", "aistat", "Checking…");
    ag.append(stat);
    const setupBtn = el("button", "setbtn", "Set up the AI tutor");
    const progWrap = el("div", "aiprogwrap hidden");
    const progBar = el("i");
    const progInner = el("div", "aiprog"); progInner.append(progBar);
    progInner.setAttribute("role", "progressbar");
    progInner.setAttribute("aria-label", "AI tutor setup");
    progInner.setAttribute("aria-valuemin", "0");
    progInner.setAttribute("aria-valuemax", "100");
    progInner.setAttribute("aria-valuenow", "0");
    const progLabel = el("div", "aiproglabel", "");
    progLabel.setAttribute("aria-live", "polite");
    progWrap.append(progInner, progLabel);
    ag.append(setupBtn, progWrap);
    ag.append(el("div", "setnote", "One click downloads Ollama + a ~2 GB tutor model and shows progress. Everything then runs on THIS computer — no account, no internet, no cost. The app works fully without it; this only powers the live chat."));
    body.append(ag);

    (async () => {
      if (!hasBridge()) { stat.innerHTML = "Live AI runs in the installed desktop app (it's off in this browser preview). The written reasoning guide works everywhere."; setupBtn.classList.add("hidden"); return; }
      const oll = await ollamaCheck();
      if (oll.ok) { stat.innerHTML = "<span class='aiok'>✓ Ready</span> — model <b>" + esc(oll.model) + "</b>. Open <b>🤔 Why this?</b> on any question."; setupBtn.textContent = "Add the smaller/faster model"; }
      else if (oll.running) stat.innerHTML = "Ollama is installed and running, but <b>no model</b> yet. Click below to download one.";
      else stat.innerHTML = "Not set up yet. The app works fully without it — this just turns on the live chat.";
    })();

    setupBtn.onclick = async () => {
      if (!hasBridge()) return;
      setupBtn.disabled = true;
      progWrap.classList.remove("hidden");
      progBar.style.width = "2%";
      progLabel.textContent = "Starting…";
      _ollama.checked = false; _ollama.warm = false; // re-detect after we're done
      _aiProgressCb = (d) => {
        if (typeof d.percent === "number") {
          const percent = Math.max(2, Math.min(100, d.percent));
          progBar.style.width = percent + "%";
          progInner.setAttribute("aria-valuenow", String(percent));
        }
        if (d.label) progLabel.textContent = d.label;
      };
      const result = await bridge("aiSetup", {}, 60 * 60 * 1000);
      _aiProgressCb = null;
      setupBtn.disabled = false;
      if (result.ok) {
        progBar.style.width = "100%";
        progInner.setAttribute("aria-valuenow", "100");
        progLabel.innerHTML = "<span class='aiok'>✓ Done — the AI tutor is ready. Try 'Why this?'</span>";
        stat.innerHTML = "<span class='aiok'>✓ Ready</span>";
      } else {
        progLabel.innerHTML = "<span class='aibad'>Couldn't finish: " +
          esc(result.error || "unknown error") +
          ". You can retry, or install Ollama manually from ollama.com.</span>";
      }
    };

    const dg = el("div", "setgroup");
    dg.append(el("div", "setlabel", "Diagnostics"));
    const diagnosticText = [
      "ACTDrill " + APP_VERSION,
      "Bank " + (typeof BANK_VERSION !== "undefined" ? BANK_VERSION : "unknown"),
      ACT_QUESTIONS.length + " questions / " + Object.keys(ACT_PATTERNS).length + " patterns",
      "Host: " + (hasBridge() ? "Windows desktop" : "browser preview"),
      "Storage: local device only",
      "Credentials: none",
      "Voice: " + speech.selectedVoiceName(),
      "Voice renderer: " + speech.rendererName(),
      "Optional dependency: Ollama on localhost:11434"
    ].join("\n");
    const diagnosticBlock = el("pre", "diagnostics", esc(diagnosticText));
    const copyDiagnostics = el("button", "setbtn", "Copy diagnostics");
    copyDiagnostics.onclick = async () => {
      try {
        await navigator.clipboard.writeText(diagnosticText);
        copyDiagnostics.textContent = "Copied";
        announce("Diagnostics copied.");
      } catch {
        announce("Diagnostics could not be copied.");
      }
    };
    dg.append(diagnosticBlock, copyDiagnostics);
    body.append(dg);

    panel.append(body);
    ov.append(panel);
    const close = mountModal(ov, panel, title, x);
    x.onclick = close;
  }

  // ---------- drill view ----------
  const viewDrill = document.getElementById("view-drill");
  let current = null;
  let pinnedId = null; // set when a note sends you back to its question

  function showIntro() {
    viewDrill.innerHTML = "";
    const c = el("div", "card intro");
    c.append(
      el("div", "pill", "Hey"),
      el("p", null, "This isn't homework and it isn't a test. It's a game where the ACT is the boss — and you're learning its moves one at a time. It repeats the same handful of tricks forever; once you see them, they're basically free points."),
      el("p", null, "<b>Here's the whole deal: you only have to do ONE.</b> Do a single question and you've won today — no joke. Most days you'll keep going because it's kind of satisfying. But the bar is one."),
      el("p", "introquiet", "Stuck on any question? Every one has a <b>🪜 Break it down</b> (one step at a time) and a <b>🤔 Why this?</b>. Rather listen than read? There's a voice. Want it bigger, or light mode? <b>⚙ Settings</b>, top-right. That's it — poke around, nothing here can break.")
    );
    const a = el("div", "actions");
    const b = el("button", "btn", "Start — just one question");
    b.onclick = () => { S.introSeen = true; save(); nextQuestion(); };
    a.append(b);
    c.append(a);
    viewDrill.append(c);
    b.focus();
  }

  const SUBJECTS = ["All", "English", "Math", "Reading"];
  function subjectBar() {
    const bar = el("div", "subjbar");
    SUBJECTS.forEach(sub => {
      const b = el("button", sub === (S.subj || "All") ? "active" : "", sub);
      b.onclick = () => { S.subj = sub; save(); nextQuestion(); };
      bar.append(b);
    });
    return bar;
  }

  // ---------- coaching: scaffold now, fade as mastery grows ----------
  const COACH = { full: "Full", auto: "Auto-fade", off: "Off" };
  const COACH_ORDER = ["auto", "full", "off"];
  function coachBar() {
    const bar = el("div", "coachbar");
    const b = el("button", "on", "🎓 Coaching: " + COACH[S.coach || "auto"]);
    b.title = "Full = always show hints · Auto-fade = hints until you master a pattern · Off = test mode";
    b.onclick = () => {
      const i = COACH_ORDER.indexOf(S.coach || "auto");
      S.coach = COACH_ORDER[(i + 1) % COACH_ORDER.length];
      save(); nextQuestion();
    };
    bar.append(b);
    return bar;
  }
  function shouldCoach(q) {
    if (S.coach === "off") return false;
    if (S.coach === "full") return true;
    return !isMastered(q.pattern); // auto: help until this pattern is mastered, then fade
  }
  function guidedMathSteps(q) {
    const pattern = ACT_PATTERNS[q.pattern];
    const formula = questionFormula(q);
    return ACTDrillCoaching.guidedMathSteps(q, pattern, formula);
  }

  function guidedMathWork(q) {
    const steps = guidedMathSteps(q);
    if (!steps.length) return null;
    const work = el("div", "coachwork");
    work.append(el("div", "coachwork-title", "Start here: one small move"));
    const list = el("div", "coachwork-list");
    list.setAttribute("aria-live", "polite");
    const next = el("button", "setbtn coach-next", "Show next small step");
    let index = 0;

    const reveal = () => {
      if (index >= steps.length) {
        document.querySelector(".choice")?.focus();
        document.querySelector(".choices")?.scrollIntoView({ block: "nearest" });
        return;
      }
      const step = steps[index++];
      const item = el("div", "coachstep");
      const heading = el("div", "coachstep-num", "Step " + index + " of " + steps.length);
      const action = el("div", "coachstep-do", esc(step.do));
      item.append(heading, action);
      if (step.why) item.append(el("div", "coachstep-why", esc(step.why)));
      item.append(speakerButton("Hear this step", () =>
        "Step " + index + ". " + step.do + ". " + (step.why || "")));
      list.append(item);
      item.scrollIntoView({ block: "nearest" });

      if (index >= steps.length) {
        next.textContent = "Go to answer choices";
        announce("The worked start is complete. Choose the matching answer.");
      } else {
        next.textContent = "Show next small step";
      }
    };
    next.onclick = reveal;
    work.append(list, next);
    reveal();
    return work;
  }

  function scaffoldBox(q) {
    const pat = ACT_PATTERNS[q.pattern];
    const f = questionFormula(q);
    const box = el("div", "scaffold");
    box.append(el("div", "slabel", "Before you answer"));
    if (q.decode) box.append(el("div", "srow", "<b>What they're asking:</b> " + esc(q.decode)));
    box.append(el("div", "srow", "<b>The move:</b> " + esc(pat.cue)));
    if (f) box.append(el("div", "srow", "<b>Reach for:</b> <span class='sform'>" + esc(f.key + " — " + f.expr) + "</span>"));
    const workedStart = guidedMathWork(q);
    if (workedStart) box.append(workedStart);
    return box;
  }

  function nextQuestion() {
    stopSpeech();
    // stepped away on their own? counters reset quietly — no nagging someone who already rested
    if (brk.lastAnswerAt && Date.now() - brk.lastAnswerAt > IDLE_RESET_MIN * 60e3) resetBreak();
    if (breakDue()) { renderBreakCard(); return; }

    // jumped here from a note? show that exact question instead of a fresh draw
    const pinned = pinnedId ? ACT_QUESTIONS.find(x => x.id === pinnedId) : null;
    pinnedId = null;
    const q = pinned || pickQuestion();
    current = { q, choices: orderedChoices(q), answered: false };
    viewDrill.innerHTML = "";
    viewDrill.append(subjectBar());
    viewDrill.append(coachBar());
    viewDrill.append(audioBar());

    const card = el("div", "card");
    let pillHtml = esc(ACT_PATTERNS[q.pattern].subject) + " · today " + todayCount() + " / " + goal();
    if (S.combo >= 2) pillHtml += " · <span class='combo'>combo ×" + S.combo + "</span>";
    if (S.memos[q.id]) pillHtml += " · <span class='notetag'>📝 you left a note</span>";
    card.append(el("div", "pill", pillHtml));
    if (q.context) card.append(el("p", "context", esc(q.context)));
    if (q.passage) card.append(el("p", "passage", renderPassage(q.passage)));
    const promptText = q.prompt ||
      (q.passage && q.passage.includes("|") ? "Choose the best version of the underlined portion." : "");
    if (promptText) card.append(el("p", "prompt", esc(promptText)));
    // read-question button, always available — math problems live in the passage, not a prompt
    const rqRow = el("div", "readrow");
    rqRow.append(speakerButton("Read question", () => questionSpeech(q, current.choices)));
    card.append(rqRow);
    // scaffold (coaching): decode the question + point at the formula, before answering
    if (shouldCoach(q)) card.append(scaffoldBox(q));
    // a note you left yourself on this one — collapsed so it doesn't spoil the retrieval
    if (S.memos[q.id]) {
      const mrow = el("div", "readrow");
      const rb = el("button", "speakbtn noteglowbtn", "📝 Your note");
      rb.setAttribute("aria-expanded", "false");
      const mtext = el("div", "memo collapsible hidden");
      mtext.innerHTML = "<b>Your note:</b> " + esc(S.memos[q.id]);
      rb.onclick = () => { const hidden = mtext.classList.toggle("hidden"); rb.setAttribute("aria-expanded", String(!hidden)); };
      mrow.append(rb);
      card.append(mrow, mtext);
    }

    const list = el("div", "choices");
    current.choices.forEach((c, idx) => {
      const btn = el("button", "choice");
      btn.dataset.idx = idx;
      btn.append(
        el("span", "letter", "ABCD"[idx]),
        el("span", "body", "<span>" + esc(c.text) + "</span><span class='why'>" + esc(c.why) + "</span>"),
        el("span", "mark", c.correct ? "✓ right" : "✗")
      );
      btn.onclick = () => answer(idx);
      list.append(btn);
    });
    card.append(list);

    const foot = el("div", "actions");
    foot.append(el("span", "hint", "Keys 1–4 to answer"));
    card.append(foot);
    viewDrill.append(card);
  }

  // ---------- per-question study notes ("your note for this one") ----------
  function refreshMemoBox(card, q) {
    let box = card.querySelector(".memo.answered-memo");
    if (S.memos[q.id]) {
      if (!box) { box = el("div", "memo answered-memo"); card.insertBefore(box, card.querySelector(".actions")); }
      box.innerHTML = "<b>Your note:</b> " + esc(S.memos[q.id]);
    } else if (box) { box.remove(); }
    // keep the card's "you left a note" tag honest while he adds or deletes one
    const pill = card.querySelector(".pill");
    if (pill) {
      const tag = pill.querySelector(".notetag");
      if (S.memos[q.id] && !tag) {
        pill.append(document.createTextNode(" · "));
        pill.append(el("span", "notetag", "📝 you left a note"));
      } else if (!S.memos[q.id] && tag) {
        if (tag.previousSibling && tag.previousSibling.nodeType === 3) tag.previousSibling.remove();
        tag.remove();
      }
    }
  }
  // ---------- notes as Markdown: a study sheet in his own words ----------
  function noteEntries() {
    return Object.keys(S.memos || {})
      .filter(id => S.memos[id])
      .map(id => {
        const q = ACT_QUESTIONS.find(x => x.id === id);
        const pat = q ? ACT_PATTERNS[q.pattern] : null;
        const raw = q ? (q.passage ? q.passage.replace(/\|/g, "") : (q.context || q.prompt || id)) : id;
        return {
          id,
          note: S.memos[id],
          subject: pat ? pat.subject : "Other",
          pattern: pat ? pat.name : "",
          question: raw
        };
      })
      .sort((a, b) => (a.subject + a.pattern).localeCompare(b.subject + b.pattern));
  }
  function notesMarkdown() {
    const entries = noteEntries();
    const lines = ["# ACTDrill notes — " + todayKey(), "",
      entries.length + (entries.length === 1 ? " note" : " notes") + " · ACTDrill " + APP_VERSION, ""];
    let subject = null;
    entries.forEach(entry => {
      if (entry.subject !== subject) { subject = entry.subject; lines.push("## " + subject, ""); }
      // the id is the link back: it's what "Open this question" uses inside the app
      lines.push("### " + (entry.pattern || "Question") + " · `" + entry.id + "`", "");
      lines.push("> " + entry.question.replace(/\s+/g, " ").trim(), "", entry.note, "", "---", "");
    });
    if (!entries.length) lines.push("_No notes yet — write one on any question you want to remember._", "");
    return lines.join("\n");
  }
  function saveNotesMarkdown() {
    const blob = new Blob([notesMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = el("a");
    a.href = url;
    a.download = "actdrill-notes-" + todayKey() + ".md";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    announce("Notes saved as a Markdown file.");
  }
  async function copyNotesMarkdown(btn) {
    try {
      await navigator.clipboard.writeText(notesMarkdown());
      btn.textContent = "Copied ✓";
      announce("Markdown copied to the clipboard.");
    } catch {
      btn.textContent = "Couldn't copy";
      announce("Copying is not available here — use Save as .md instead.");
    }
    setTimeout(() => { btn.textContent = "Copy markdown"; }, 2200);
  }
  function renderNotesPanel() {
    const body = document.querySelector("#notespanel .npbody");
    if (!body) return;
    body.innerHTML = "";
    const entries = noteEntries();
    document.querySelector("#notespanel .npcount").textContent =
      entries.length ? entries.length + (entries.length === 1 ? " note" : " notes") : "";
    if (!entries.length) {
      body.append(el("p", "npempty",
        "Nothing here yet. On any question you've answered, hit <b>📝 Add a note</b> and tell yourself the thing you keep forgetting. It shows up here, and you can save the whole set as a Markdown study sheet."));
      return;
    }
    let subject = null;
    entries.forEach(entry => {
      if (entry.subject !== subject) {
        subject = entry.subject;
        body.append(el("div", "npsub", esc(subject)));
      }
      const item = el("div", "npitem");
      if (entry.pattern) item.append(el("div", "nppat", esc(entry.pattern)));
      const snippet = entry.question.replace(/\s+/g, " ").trim();
      item.append(
        el("blockquote", "npq", esc(snippet.length > 120 ? snippet.slice(0, 120) + "…" : snippet)),
        el("div", "npnote", esc(entry.note))
      );
      // the note points back at the question that earned it
      const jump = el("button", "btn ghost npjump", "Open this question →");
      jump.onclick = () => openNoteQuestion(entry.id);
      item.append(jump);
      body.append(item);
    });
  }
  function openNoteQuestion(id) {
    if (!ACT_QUESTIONS.some(q => q.id === id)) { announce("That question isn't in this bank anymore."); return; }
    pinnedId = id;
    document.getElementById("tab-drill").click(); // the tab handler owns view switching
    nextQuestion();
    announce("Opened the question this note belongs to.");
  }
  function buildNotesPanel() {
    const panel = el("aside", "notespanel");
    panel.id = "notespanel";
    panel.setAttribute("role", "complementary");
    panel.setAttribute("aria-label", "Your notes");
    const hd = el("div", "nphd");
    hd.append(el("h3", null, "Your notes"), el("span", "npcount", ""));
    const close = el("button", "btn ghost", "Close");
    close.onclick = () => toggleNotesPanel(false);
    hd.append(close);
    panel.append(hd, el("div", "npbody"));
    const ft = el("div", "npft");
    const saveBtn = el("button", "btn", "Save as .md");
    saveBtn.onclick = saveNotesMarkdown;
    const copyBtn = el("button", "btn ghost", "Copy markdown");
    copyBtn.onclick = () => copyNotesMarkdown(copyBtn);
    ft.append(saveBtn, copyBtn);
    panel.append(ft);
    document.body.append(panel);
    return panel;
  }
  function toggleNotesPanel(force) {
    const panel = document.getElementById("notespanel") || buildNotesPanel();
    const open = force === undefined ? !panel.classList.contains("open") : !!force;
    panel.classList.toggle("open", open);
    const btn = document.getElementById("notesbtn");
    btn.setAttribute("aria-expanded", String(open));
    if (open) { renderNotesPanel(); panel.querySelector(".nphd button").focus(); }
    else btn.focus();
  }
  const refreshNotesPanel = () => {
    const panel = document.getElementById("notespanel");
    if (panel && panel.classList.contains("open")) renderNotesPanel();
  };

  function memoEditor(q, mountBtn, card) {
    const existing = card.querySelector(".memoedit");
    if (existing) { existing.remove(); mountBtn.focus(); return; }
    const wrap = el("div", "memoedit");
    wrap.append(el("label", null, "Your note — a reminder to yourself for this one"));
    const ta = el("textarea");
    ta.value = S.memos[q.id] || "";
    ta.setAttribute("placeholder", "e.g. I keep forgetting to divide by 3 at the very end.");
    ta.setAttribute("aria-label", "Your note for this question");
    ta.setAttribute("maxlength", "600"); // matches the cap normalizeState() enforces on save
    ta.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); wrap.remove(); mountBtn.focus(); }
    });
    wrap.append(ta);
    const acts = el("div", "memoacts");
    // the answer is the thing worth remembering — let him drop it in instead of retyping it
    const correct = (q.choices || []).find(c => c.correct);
    if (correct) {
      const grab = el("button", "btn ghost", "➕ Add the answer");
      grab.title = "Paste the correct answer, and why, into this note";
      grab.onclick = () => {
        const answer = "Answer: " + correct.text + (correct.why ? " — " + correct.why : "");
        ta.value = ta.value.trim() ? ta.value.replace(/\s*$/, "\n") + answer : answer;
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
        announce("Answer added to your note.");
      };
      acts.append(grab);
    }
    const saveBtn = el("button", "btn", "Save note");
    saveBtn.onclick = () => {
      const t = ta.value.trim();
      if (t) S.memos[q.id] = t; else delete S.memos[q.id];
      save();
      wrap.remove();
      mountBtn.textContent = S.memos[q.id] ? "📝 Edit note" : "📝 Add a note";
      refreshMemoBox(card, q);
      refreshNotesPanel();
      announce(S.memos[q.id] ? "Note saved." : "Note removed.");
      mountBtn.focus();
    };
    const cancelBtn = el("button", "btn ghost", "Cancel");
    cancelBtn.onclick = () => { wrap.remove(); mountBtn.focus(); };
    acts.append(saveBtn, cancelBtn);
    if (S.memos[q.id]) {
      const del = el("button", "btn ghost", "Delete note");
      del.onclick = () => { delete S.memos[q.id]; save(); wrap.remove(); mountBtn.textContent = "📝 Add a note"; refreshMemoBox(card, q); refreshNotesPanel(); announce("Note removed."); mountBtn.focus(); };
      acts.append(del);
    }
    wrap.append(acts);
    card.insertBefore(wrap, card.querySelector(".actions"));
    ta.focus();
  }

  function answer(idx) {
    if (!current || current.answered) return;
    current.answered = true;
    const { q, choices } = current;
    const chosen = choices[idx];
    const right = !!chosen.correct;

    // record accuracy
    const p = S.patt[q.pattern] || (S.patt[q.pattern] = { seen: 0, right: 0 });
    p.seen++; if (right) p.right++;
    const qs = S.q[q.id] || (S.q[q.id] = { seen: 0, right: 0 });
    qs.seen++; if (right) qs.right++;
    const d = S.daily[todayKey()] || (S.daily[todayKey()] = { n: 0, right: 0 });
    d.n++; if (right) d.right++;
    S.recent.push(q.id);
    while (S.recent.length > 18) S.recent.shift();
    brk.qSince++;
    brk.lastAnswerAt = Date.now();

    // rewards
    const prevLevel = levelIndex(S.xp);
    S.combo = right ? S.combo + 1 : 0;
    if (S.combo > S.bestCombo) S.bestCombo = S.combo;
    let gained = 2; // showing up counts
    let crit = false;
    if (right) {
      gained += 8;
      gained += Math.min(2 * (S.combo - 1), 10);
      if (Math.random() < 0.07) { crit = true; gained *= 2; }
    }
    S.xp += gained;
    const newLevel = levelIndex(S.xp);
    S.sinceNote++;

    const goalJustHit = d.n === goal();
    const leveledUp = newLevel > prevLevel;
    let note = null;
    if ((goalJustHit || leveledUp || (right && Math.random() < 0.08)) && S.sinceNote >= 8) {
      note = pickNote();
      if (note) S.sinceNote = 0;
    }
    save();
    renderChips();

    // paint
    const card = viewDrill.querySelector(".card");
    card.classList.add("answered");
    card.querySelectorAll(".choice").forEach((btn, i) => {
      btn.disabled = true;
      if (choices[i].correct) btn.classList.add("right");
      else if (i === idx) btn.classList.add("wrong-picked");
    });

    const verdict = el("div", "verdict " + (right ? "good" : "bad"));
    verdict.setAttribute("role", "status");
    verdict.setAttribute("aria-live", "polite");
    verdict.append(
      el("span", "word", right ? "✓ Right." : "✗ Not this one."),
      el("span", "xp", "+" + gained + " XP")
    );
    if (crit) verdict.append(el("span", "crit", "×2 sharp-eye bonus!"));
    if (right && S.combo >= 3) verdict.append(el("span", "xp", "combo ×" + S.combo));
    verdict.append(el("span", "quip", pick(right ? QUIPS_RIGHT : QUIPS_WRONG)));
    card.append(verdict);

    const qf = questionFormula(q);
    if (qf) card.append(formulaBox(qf));
    if (q.plot) card.append(coordPlot(q.plot));
    if (q.diagram) card.append(mathDiagram(q.diagram));

    const pat = ACT_PATTERNS[q.pattern];
    const pb = el("div", "patternbox");
    const pname = el("div", "pname", "Pattern: " + esc(pat.name));
    pname.append(speakerButton("Hear why", () => explanationSpeech(q, choices)));
    pb.append(
      pname,
      el("div", "pcue", "Spot it in 5 seconds: " + esc(pat.cue))
    );
    card.append(pb);
    if (S.audio.on && S.audio.autoRead) speak(explanationSpeech(q, choices));

    if (goalJustHit) {
      card.append(el("div", "milestone",
        "<b>That's a full day — " + goal() + " focused reps.</b> That beats three hours of zoning out at a video. Keep going or stop here; both count as a win."));
      confetti();
    }

    if (note && !leveledUp) card.append(noteCard(note));
    if (S.memos[q.id]) { const mb = el("div", "memo answered-memo"); mb.innerHTML = "<b>Your note:</b> " + esc(S.memos[q.id]); card.append(mb); }

    const a = el("div", "actions");
    const nextBtn = el("button", "btn", "Next question");
    nextBtn.onclick = nextQuestion;
    const whyBtn = el("button", "btn ghost", "🤔 Why this?");
    whyBtn.onclick = () => openWhyChat(q);
    a.append(nextBtn, whyBtn);
    if (ACT_PATTERNS[q.pattern].subject === "Math") {
      const sb = el("button", "btn ghost", "🪜 Work it step by step");
      sb.onclick = () => stepPanel(q);
      a.append(sb);
    }
    const noteBtn = el("button", "btn ghost", S.memos[q.id] ? "📝 Edit note" : "📝 Add a note");
    noteBtn.onclick = () => memoEditor(q, noteBtn, card);
    a.append(noteBtn);
    a.append(el("span", "hint", "Enter for next"));
    card.append(a);

    if (leveledUp) showLevelUp(newLevel, note);
    else nextBtn.focus();
  }

  // keyboard
  document.addEventListener("keydown", (e) => {
    // Modal dialogs own their keyboard events, including Escape and focus trapping.
    if (document.querySelector('[role="dialog"]')) return;
    // Writing a note is not answering a question: a space stays a space, Enter stays
    // a new line, and "n" stays a letter. Without this, the first space typed into a
    // note swallowed the character and skipped to the next question.
    if (ownsKeys(e.target)) return;
    if (!document.getElementById("view-drill").classList.contains("hidden")) {
      if (current && !current.answered) {
        const k = e.key.toLowerCase();
        const map = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3 };
        if (k in map && map[k] < current.choices.length) { answer(map[k]); e.preventDefault(); }
      } else if (current && current.answered && (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "n")) {
        // preventDefault stops the focused Next button from also firing a click (double-advance)
        e.preventDefault();
        nextQuestion();
      }
    }
  });

  // ---------- rulebook ----------
  function renderRulebook() {
    const v = document.getElementById("view-rulebook");
    v.innerHTML = "";
    v.append(el("div", "card intro",
      "<div class='pill'>The whole rulebook</div><p>This is it — the finite list for all three scored sections (your composite is English + Math + Reading). Every question you'll ever see is one of these wearing a costume. Master a pattern (80%+ over 10+ reps) and it earns a star.</p>"));
    ["English", "Math", "Reading"].forEach(sub => {
      v.append(el("div", "subhead", sub));
      Object.entries(ACT_PATTERNS)
        .filter(([, pat]) => pat.subject === sub)
        .forEach(([pid, pat]) => renderRuleCard(v, pid, pat));
    });
  }
  function renderRuleCard(v, pid, pat) {
      const m = patternMastery(pid);
      const seen = (S.patt[pid] || { seen: 0 }).seen;
      const c = el("div", "card rule-card");
      const h = el("h3", null, esc(pat.name));
      if (isMastered(pid)) h.append(el("span", "mastered-badge", "★ mastered"));
      c.append(
        h,
        el("p", null, esc(pat.rule)),
        el("div", "lbl", "How to spot it in 5 seconds"),
        el("p", null, esc(pat.cue)),
        el("div", "lbl", "Example"),
        el("p", "ex", esc(pat.example))
      );
      const row = el("div", "meter-row");
      const meter = el("div", "meter" + (isMastered(pid) ? " gold" : ""));
      meter.append(el("i", null));
      meter.firstChild.style.width = (m === null ? 0 : Math.round(m * 100)) + "%";
      row.append(
        el("span", "mlabel", ""),
        meter,
        el("span", "mval", seen < 3 ? "warming up · " + seen + " reps" : Math.round(m * 100) + "% · " + seen + " reps")
      );
      c.append(row);

      // "same pattern, different words — it always works" expander
      const demoQs = ACT_QUESTIONS.filter(x => x.pattern === pid);
      if (demoQs.length >= 2) {
        const wrap = el("div", "workwrap hidden");
        let built = false;
        const toggle = el("button", "worktoggle", "▶ See it work on 3 questions");
        toggle.onclick = () => {
          const show = wrap.classList.contains("hidden");
          wrap.classList.toggle("hidden");
          toggle.textContent = show ? "▼ Hide worked examples" : "▶ See it work on 3 questions";
          if (show && !built) { built = true; buildWorked(wrap, demoQs); }
        };
        c.append(toggle, wrap);
      }
      v.append(c);
  }
  function buildWorked(wrap, qs) {
    const withVisual = qs.filter(q => q.diagram || q.plot || q.formula);
    const pick = (withVisual.length >= 2 ? withVisual : qs).slice(0, 3);
    const anyFormula = pick.some(q => questionFormula(q));
    wrap.append(el("div", "workbanner", anyFormula
      ? "🔑 Same formula every time — the words and numbers change, the key doesn't."
      : "Same pattern every time — different words, same move."));
    pick.forEach(q => {
      const w = el("div", "worked");
      if (q.context) w.append(el("div", "wctx", esc(q.context)));
      w.append(el("div", "wq", q.passage ? renderPassage(q.passage) : esc(q.prompt || "")));
      if (q.passage && q.prompt) w.append(el("div", "wctx", esc(q.prompt)));
      const qf = questionFormula(q);
      if (qf) w.append(formulaBox(qf));
      if (q.plot) w.append(coordPlot(q.plot));
      if (q.diagram) w.append(mathDiagram(q.diagram));
      const correct = q.choices.find(c => c.correct);
      w.append(el("div", "wans", "✓ " + esc(correct.text)));
      w.append(el("div", "wwhy", esc(correct.why)));
      wrap.append(w);
    });
  }

  // ---------- progress ----------
  function renderProgress() {
    const v = document.getElementById("view-progress");
    v.innerHTML = "";

    let total = 0, bestDay = 0;
    Object.values(S.daily).forEach(dd => { total += dd.n; if (dd.n > bestDay) bestDay = dd.n; });
    // accuracy comes from the per-pattern tallies: they were always persisted intact,
    // so the number stays right even for history saved while the day's count was dropped
    let seenAll = 0, rightAll = 0;
    Object.values(S.patt).forEach(p => { seenAll += p.seen; rightAll += p.right; });
    const li = levelIndex(S.xp);

    const tiles = el("div", "tiles");
    const tile = (val, lab, gold) => {
      const t = el("div", "tile" + (gold ? " gold" : ""));
      t.append(el("div", "tv", val), el("div", "tl", lab));
      return t;
    };
    tiles.append(
      tile(String(li + 1) + " <small>" + esc(LEVELS[li].name) + "</small>", S.xp + " XP · level", true),
      tile(streak(), "day streak"),
      tile(todayCount() + "<small> / " + goal() + "</small>", "today"),
      tile(total, "total reps"),
      tile(seenAll ? Math.round(100 * rightAll / seenAll) + "%" : "—", "accuracy"),
      tile(S.bestCombo, "best combo"),
      tile(masteredCount() + "<small> / " + Object.keys(ACT_PATTERNS).length + "</small>", "patterns mastered", masteredCount() > 0)
    );
    v.append(tiles);

    // XP progress to next level
    const xcard = el("div", "card");
    const nextName = li < LEVELS.length - 1 ? LEVELS[li + 1].name : null;
    xcard.append(el("h3", "sect", nextName
      ? "Next level: " + esc(nextName) + " at " + LEVELS[li + 1].xp + " XP"
      : "Top level reached — " + esc(LEVELS[li].name)));
    const xrow = el("div", "meter-row");
    const xmeter = el("div", "meter gold"); xmeter.append(el("i", null));
    xmeter.firstChild.style.width = Math.round(levelProgress(S.xp) * 100) + "%";
    xrow.append(el("span", "mlabel", "XP"), xmeter,
      el("span", "mval", S.xp + (nextName ? " / " + LEVELS[li + 1].xp : "")));
    xcard.append(xrow);
    v.append(xcard);

    // 14-day chart (single series — the title names it, no legend needed)
    const chart = el("div", "card chart");
    chart.append(el("h3", null, "Questions per day — last 14 days" + (bestDay ? " · personal best " + bestDay : "")));
    const days = [];
    for (let i = 13; i >= 0; i--) days.push(dayKeyOffset(i));
    const counts = days.map(k => (S.daily[k] || { n: 0 }).n);
    const max = Math.max(goal(), ...counts);
    const bars = el("div", "bars");
    days.forEach((k, i) => {
      const col = el("div", "barcol" + (counts[i] === 0 ? " empty" : ""));
      const bar = el("div", "bar");
      bar.style.height = counts[i] === 0 ? "2px" : Math.max(4, Math.round(counts[i] / max * 100)) + "%";
      const dd = S.daily[k] || { n: 0, right: 0 };
      col.title = k + " — " + dd.n + " questions" + (dd.right ? ", " + dd.right + " right" : "");
      if (i === 13 && counts[i] > 0) col.append(el("span", "blab", String(counts[i])));
      col.append(bar);
      bars.append(col);
    });
    chart.append(bars);
    const labs = el("div", "daylabels");
    days.forEach(k => labs.append(el("span", null, "SMTWTFS"[new Date(k + "T12:00:00").getDay()])));
    chart.append(labs);
    v.append(chart);

    // mastery meters, weakest first
    const mcard = el("div", "card");
    mcard.append(el("h3", "sect", "Pattern mastery — weakest first (these get served more often)"));
    ["English", "Math", "Reading"].forEach(sub => {
      mcard.append(el("div", "subhead", sub));
      const rows = Object.entries(ACT_PATTERNS)
        .filter(([, pat]) => pat.subject === sub)
        .map(([pid, pat]) => {
          const st = S.patt[pid] || { seen: 0, right: 0 };
          return { pid, name: pat.name, seen: st.seen, m: patternMastery(pid) };
        }).sort((a, b) => {
          const av = a.seen < 3 ? 2 : a.m, bv = b.seen < 3 ? 2 : b.m;
          return av - bv;
        });
      rows.forEach(r => {
        const row = el("div", "meter-row");
        const meter = el("div", "meter" + (isMastered(r.pid) ? " gold" : "")); meter.append(el("i", null));
        const percent = r.m === null ? 0 : Math.round(r.m * 100);
        meter.firstChild.style.width = percent + "%";
        meter.setAttribute("role", "progressbar");
        meter.setAttribute("aria-label", r.name + " mastery");
        meter.setAttribute("aria-valuemin", "0");
        meter.setAttribute("aria-valuemax", "100");
        meter.setAttribute("aria-valuenow", String(percent));
        row.append(
          el("span", "mlabel", esc(r.name) + (isMastered(r.pid) ? " <span class='mastered-badge'>★</span>" : "")),
          meter,
          el("span", "mval", r.seen < 3 ? "warming up" : Math.round(r.m * 100) + "% · " + r.seen + " reps")
        );
        mcard.append(row);
      });
    });
    v.append(mcard);

    // Your notes — a review list for memorization
    const noteIds = Object.keys(S.memos || {}).filter(id => S.memos[id]);
    if (noteIds.length) {
      const ncard = el("div", "card notecard");
      ncard.append(el("h3", "sect", "Your notes (" + noteIds.length + ")"));
      ncard.append(el("p", "note", "Reminders you left yourself, straight from the questions. Skim these before a session — that's memorization doing its job."));
      const ul = el("ul", "memolist");
      noteIds.forEach(id => {
        const q = ACT_QUESTIONS.find(x => x.id === id);
        const patName = q && ACT_PATTERNS[q.pattern] ? ACT_PATTERNS[q.pattern].name : "";
        const raw = q ? (q.passage ? q.passage.replace(/\|/g, "") : (q.context || q.prompt || id)) : id;
        const snippet = raw.length > 90 ? raw.slice(0, 90) + "…" : raw;
        const li = el("li");
        li.append(
          el("div", "memoq", esc((patName ? patName + " — " : "") + snippet)),
          el("div", "memot", esc(S.memos[id]))
        );
        ul.append(li);
      });
      ncard.append(ul);
      v.append(ncard);
    }

    const rcard = el("div", "card");
    const actions = el("div", "actions");
    if (window.chrome && window.chrome.webview) {
      // running inside the desktop shell — it handles the download and reloads on success
      const ub = el("button", "btn", "Update question bank");
      ub.onclick = async () => {
        ub.disabled = true; ub.textContent = "Updating…";
        const result = await bridge("updateBank", {}, 45000);
        if (result.ok) {
          ub.textContent = "Updated — reloading…";
          announce("Question bank updated and verified.");
          location.reload();
          return;
        }
        ub.disabled = false;
        ub.textContent = "Update question bank";
        announce(result.error || "Question bank update failed.");
      };
      actions.append(ub);
    }
    const rb = el("button", "btn ghost", "Reset all progress");
    rb.onclick = () => {
      if (confirm("Wipe all drill history, XP, and levels? This can't be undone.")) {
        S = blankState(); S.introSeen = true; save();
        renderChips(); renderProgress();
      }
    };
    actions.append(rb,
      el("span", "hint", "Bank " + (typeof BANK_VERSION !== "undefined" ? BANK_VERSION : "v1") + " · " + ACT_QUESTIONS.length + " questions"));
    rcard.append(actions);
    v.append(rcard);
  }

  // ---------- formulas ----------
  const FORMULAS = [
    { group: "Lines & coordinate geometry", items: [
      ["Slope", "m = (y₂ − y₁) / (x₂ − x₁)", "(2,5) to (6,13): 8/4 = 2"],
      ["Slope-intercept", "y = mx + b", "m is the slope; b is the y-intercept"],
      ["Point-slope", "y − y₁ = m(x − x₁)", "build a line from one point and a slope"],
      ["Standard → slope", "from Ax + By = C, slope = −A/B", "3x + y = 12 → slope −3"],
      ["Parallel / perpendicular", "same slope / negative reciprocal", "slope 2 ⟂ slope −½"],
      ["Midpoint", "( (x₁+x₂)/2 , (y₁+y₂)/2 )", "(2,4) and (6,10) → (4, 7)"],
      ["Distance", "√( (Δx)² + (Δy)² )", "(0,0) to (3,4): √(9+16) = 5"]
    ]},
    { group: "Exponents & radicals", items: [
      ["Multiply powers", "xᵃ · xᵇ = xᵃ⁺ᵇ", "x³ · x² = x⁵ — add exponents"],
      ["Divide powers", "xᵃ / xᵇ = xᵃ⁻ᵇ", "x⁵ / x² = x³ — subtract"],
      ["Power of a power", "(xᵃ)ᵇ = xᵃᵇ", "(x³)² = x⁶ — multiply them"],
      ["Zero & negative", "x⁰ = 1   ·   x⁻ᵃ = 1/xᵃ", "2⁻³ = 1/8"],
      ["Fractional power", "x^(a/b) = ᵇ√(xᵃ)", "8^(2/3) = (∛8)² = 4"],
      ["Radicals multiply", "√a · √b = √(ab)", "√2 · √8 = √16 = 4"]
    ]},
    { group: "Algebra & quadratics", items: [
      ["Square of a sum", "(a+b)² = a² + 2ab + b²", "never just a² + b² — the middle term is the trap"],
      ["Square of a difference", "(a−b)² = a² − 2ab + b²", "the middle term turns negative"],
      ["Difference of squares", "(a+b)(a−b) = a² − b²", "21² − 19² = (40)(2) = 80, no calculator"],
      ["Quadratic formula", "x = (−b ± √(b²−4ac)) / 2a", "solves ax² + bx + c = 0 when factoring won't"],
      ["Discriminant", "b² − 4ac", ">0 two roots · =0 one · <0 none"],
      ["Parabola vertex", "x = −b/2a   ·   y = a(x−h)²+k", "(h,k) is the turning point"],
      ["Absolute value", "|x| = a → x = a or x = −a", "|x| = 3 → x = ±3"]
    ]},
    { group: "Functions", items: [
      ["Evaluate", "plug the number in for x", "f(x)=2x+1 → f(3)=7"],
      ["Composition", "f(g(x)) — inner one first", "f(x)=x+1, g(x)=2x → f(g(3))=7"],
      ["Domain", "the inputs allowed", "no dividing by 0, no √ of a negative"]
    ]},
    { group: "Plane geometry — area & perimeter", items: [
      ["Rectangle", "A = lw   ·   P = 2(l+w)", "8 × 6 → area 48, perimeter 28"],
      ["Square", "A = s²   ·   P = 4s", "side 5 → area 25, perimeter 20"],
      ["Parallelogram", "A = bh", "base × the straight-up height"],
      ["Triangle", "A = ½bh", "base 10, height 7 → 35"],
      ["Trapezoid", "A = ½(b₁+b₂)h", "average the parallel sides, times the height"],
      ["Circle", "A = πr²   ·   C = 2πr = πd", "given a DIAMETER? Halve it first"],
      ["Circle equation", "(x−h)² + (y−k)² = r²", "center (h,k), radius r"],
      ["Arc & sector", "(θ/360) × C   or   (θ/360) × A", "a 90° slice is one quarter"]
    ]},
    { group: "Angles & polygons", items: [
      ["Triangle angles", "add to 180°", "straight line 180° · full turn 360°"],
      ["Polygon interior sum", "(n−2) · 180°", "pentagon: 3 × 180 = 540°"],
      ["One regular angle", "(n−2)·180 / n", "regular pentagon: 540 ÷ 5 = 108°"],
      ["Exterior angles", "always sum to 360°", "true for any polygon"],
      ["Vertical & parallel", "vertical angles equal; cut parallels → equal angles", "look for the Z and F shapes"]
    ]},
    { group: "Triangles & trig", items: [
      ["Pythagorean", "a² + b² = c²", "know 3-4-5 and 5-12-13 on sight"],
      ["45-45-90 triangle", "x : x : x√2", "legs equal, hypotenuse is a leg × √2"],
      ["30-60-90 triangle", "x : x√3 : 2x", "the short leg sits opposite the 30°"],
      ["SOHCAHTOA", "sin=opp/hyp · cos=adj/hyp · tan=opp/adj", "label sides from the angle's point of view"],
      ["Trig identities", "sin²θ + cos²θ = 1   ·   tanθ = sinθ/cosθ", "the two the ACT actually uses"],
      ["Similar figures", "sides ×k → area ×k², volume ×k³", "double the sides, quadruple the area"]
    ]},
    { group: "Solid geometry", items: [
      ["Box (rectangular prism)", "V = lwh   ·   SA = 2(lw+lh+wh)", "volume is base area × height"],
      ["Cylinder", "V = πr²h   ·   SA = 2πr² + 2πrh", "circle base × height"],
      ["Sphere", "V = (4/3)πr³   ·   SA = 4πr²", "given when needed, good to know"],
      ["Cone", "V = (1/3)πr²h", "one third of the matching cylinder"]
    ]},
    { group: "Numbers, statistics & probability", items: [
      ["Mean", "total ÷ count   (total = mean × count)", "the reverse form solves most problems"],
      ["Median & mode", "middle after sorting · most frequent", "SORT before you read the middle"],
      ["Weighted average", "Σ(value × weight) ÷ Σ(weights)", "when groups are different sizes"],
      ["Percent of", "part = % × whole", "30% of 60 = 0.30 × 60 = 18"],
      ["Percent change", "change ÷ ORIGINAL", "250 → 300: 50/250 = 20%"],
      ["Probability", "favorable ÷ total", "2 red of 5 marbles → 2/5"],
      ["And / or", "P(A and B)=P(A)·P(B) · P(A or B)=P(A)+P(B)−P(both)", "'and' multiplies, 'or' adds"],
      ["Counting principle", "multiply the choices", "3 shirts × 4 pants = 12 outfits"],
      ["Combinations / permutations", "ₙCᵣ = n!/(r!(n−r)!) · ₙPᵣ = n!/(n−r)!", "order matters? use P; if not, C"],
      ["Arithmetic sequence", "aₙ = a₁ + (n−1)d", "start 5, add 3: 20th = 5 + 19·3 = 62"],
      ["Geometric sequence", "aₙ = a₁ · rⁿ⁻¹", "start 2, triple: 5th = 2 · 3⁴ = 162"],
      ["Distance-rate-time", "d = r · t", "60 mph for 2.5 h → 150 miles"],
      ["Scientific notation", "a × 10ⁿ", "move the decimal n places"],
      ["Imaginary unit", "i² = −1", "√(−9) = 3i"]
    ]}
  ];

  // Where each ACT subject leads — the college bridge (motivational + genuinely useful reference)
  const REF_SECTIONS = [
    { group: "College math — where this leads",
      blurb: "Everything above is the foundation the next floor is built on. You don't need any of this for the ACT — it's here to show the ACT is the on-ramp, not the ceiling.",
      items: [
        ["Logarithms", "log_b(x) = y  ⟺  bʸ = x", "the inverse of the exponents you just learned — log₂8 = 3"],
        ["Log rules", "log(ab) = log a + log b", "turns multiplication into addition"],
        ["Function transforms", "f(x−h) + k shifts right h, up k", "the same (h,k) idea as a parabola's vertex"],
        ["Limit (calculus)", "what f(x) approaches near a point", "the very first idea in Calculus I"],
        ["Derivative (calculus)", "instant rate of change = slope of the curve", "the slope you know, made continuous"],
        ["Systems & matrices", "solve many equations at once", "linear algebra — engineering, data science, AI"]
      ]},
    { group: "Science — the approach (and where it leads)",
      blurb: "ACT Science is optional now and not in the composite — but the skill it tests, reading data fast, IS the college science skill. It's about 90% graph-and-table reading, not memorizing facts.",
      notes: [
        "**Find the variables first** — the independent variable is what the experimenter CHANGED; the dependent is what they MEASURED; the control is what stayed fixed.",
        "**Trends beat numbers** — most questions only want 'as X goes up, Y goes ___.' Read the direction, not every digit.",
        "**Live in the axes** — check what each axis measures and its units before you read a single point.",
        "**Conflicting Viewpoints** — two scientists disagree; name the ONE thing they disagree about, then answer from each one's logic, not your own opinion.",
        "**Trust the passage** — it gives you everything. Believe the data over what you think you remember."
      ],
      items: [
        ["Density", "D = mass ÷ volume", "floats if it's less dense than the liquid"],
        ["Speed", "speed = distance ÷ time", "the d = rt you already know"],
        ["College physics", "F = ma   ·   d = ½at²", "force and motion — Physics I"],
        ["College chemistry", "PV = nRT", "the ideal gas law"],
        ["pH scale", "0 acidic — 7 neutral — 14 basic", "each step is ten times stronger"]
      ]},
    { group: "Writing — the essay blueprint",
      blurb: "The ACT essay is optional and many colleges ignore it — check the scholarship. If he takes it, it isn't about being a great writer; it's one repeatable 4-part structure, scored on ideas, support, organization, and language.",
      notes: [
        "**Intro** — state your position in a sentence, then show you understand all three given perspectives. Pick a clear side; graders reward a definite stance over a fence-sitter.",
        "**Body 1** — your strongest reason, then a specific example (real or realistic). One idea per paragraph.",
        "**Body 2** — engage the other perspectives: where they're partly right, and why yours still wins. This analysis is what separates a 4 from an 8.",
        "**Conclusion** — restate your position in fresh words and zoom out to why it matters.",
        "**Language** — vary sentence length, sprinkle transitions (however, therefore, for instance). Clear beats fancy, every time.",
        "**College writing** is the same skeleton grown up: a thesis, topic sentences, evidence followed by YOUR analysis, and cited sources."
      ]},
    { group: "Reading — the attack plan",
      blurb: "Reading rewards a method, not raw speed. The four question types live in the Rulebook; this is how to run the passage itself.",
      notes: [
        "**Map, don't memorize** — read for what each paragraph DOES, not every detail. Details can always be looked back up.",
        "**Answer in your head first** — predict before you read the choices, so the wrong ones can't tempt you.",
        "**Proof or it's wrong** — the right answer can be pointed to in the text. Defending a choice with 'it feels right' usually means it's the trap.",
        "**Line references** — read the sentence before and after the cited line; the answer often hides in the neighbors.",
        "**Extreme words** (always, never, only, all) are usually wrong; **soft words** (often, some, suggests) are usually safe.",
        "**College reading** is this scaled up: annotating, finding an author's argument and evidence, comparing sources — exactly what 'map the passage' trains."
      ]},
    { group: "Test-day game plan",
      blurb: "Knowing the material is half of it; running the clock well is the other half. These habits protect the points you've earned.",
      notes: [
        "**Never leave a blank** — there's no penalty for a wrong guess on the ACT. With one minute left, bubble something for every remaining question. A guess is worth more than a blank, always.",
        "**Answer easy first, flag the rest** — do a pass grabbing every question you know fast, mark the hard ones, and come back. Don't let one brutal question eat the time of five easy ones.",
        "**On math, use your tools** — plug in the answer choices (backsolve) or plug in easy numbers when you're stuck. You don't have to solve it the 'official' way; you have to get it right.",
        "**Extended time changes the math** — with 50% more time, slow-and-accurate beats rushed-and-sloppy. Use the extra minutes to double-check, not to grind on one problem.",
        "**Bubble in batches, carefully** — fill answers a page at a time and check the number matches. A single mis-bubble can shift every answer after it.",
        "**When two choices feel equal, name the difference** — the ACT rarely has two right answers. Find the exact word or number that separates them; that's the thing being tested."
      ]}
  ];

  const boldMd = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  function renderRefCard(v, sec) {
    const c = el("div", "card");
    c.append(el("h3", "sect", sec.group));
    if (sec.blurb) c.append(el("p", "blurb", esc(sec.blurb)));
    (sec.items || []).forEach(([name, form, ex]) => {
      const row = el("div", "frow");
      row.append(el("span", "fname", esc(name)), el("span", "fform", esc(form)), el("span", "fex", esc(ex)));
      c.append(row);
    });
    (sec.notes || []).forEach(n => c.append(el("div", "rnote", boldMd(n))));
    v.append(c);
  }
  function renderFormulas() {
    const v = document.getElementById("view-formulas");
    v.innerHTML = "";
    const mathCount = FORMULAS.reduce((n, g) => n + g.items.length, 0);
    v.append(el("div", "card intro",
      "<div class='pill'>Reference</div>" +
      "<p>The ACT hands out <b>no formula sheet</b> — so here is the entire list it can test, " + mathCount + " entries, " +
      "grouped so you can chip away a few at a time. Memorize these and there's no math on the test you haven't already been handed. " +
      "Five a week in <b>Anki</b> (Real practice tab) clears the list in a couple of months.</p>" +
      "<p>Below the math is a look at <b>where each subject leads in college</b> — proof that mastering the ACT version isn't the ceiling, it's the on-ramp.</p>"));

    v.append(el("div", "subhead", "ACT Math — the complete list"));
    FORMULAS.forEach(g => renderRefCard(v, g));

    v.append(el("div", "subhead", "Where each subject leads"));
    REF_SECTIONS.forEach(s => renderRefCard(v, s));
  }

  // ---------- links ----------
  function renderLinks() {
    const v = document.getElementById("view-links");
    v.innerHTML = `
      <div class="card linklist">
        <h3 class="sect">The real thing — official & free</h3>
        <ul>
          <li><a href="https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/free-act-test-prep.html" target="_blank" rel="noopener">ACT.org free test prep</a> — two full Enhanced-ACT practice tests (PDF, with answer keys and score tables), two interactive online tests, the QuizMe subject quizzes, and a daily Question of the Day via a free MyACT account. This is the source of truth.</li>
          <li><a href="https://blog.prepscholar.com/complete-official-act-practice-tests-free-links" target="_blank" rel="noopener">PrepScholar's roundup of every free official test</a> — includes the older-format tests, which are still great drill material.</li>
          <li><a href="https://schoolhouse.world/live-help" target="_blank" rel="noopener">Schoolhouse.world free live help</a> — free small-group tutoring from Sal Khan's nonprofit. Live humans, not videos. The math help covers exactly what ACT math tests.</li>
          <li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — free, open-source flashcards with spaced repetition. Perfect for the rulebook in this app plus the ~30 math formulas the ACT recycles.</li>
        </ul>
        <h3 class="sect" style="margin-top:20px">Extended time — do this first</h3>
        <ul>
          <li><a href="https://blog.prepscholar.com/the-complete-guide-to-act-accommodations" target="_blank" rel="noopener">Complete guide to ACT accommodations</a> — ADHD plus a documented learning disability typically qualifies for 50% extended time.</li>
          <li><a href="https://www.act.org/content/act/en/products-and-services/the-act/registration/accommodations/policy-for-accommodations-documentation/criteria-for-diagnostic-documentation.html" target="_blank" rel="noopener">ACT's official documentation criteria</a> — what paperwork is needed.</li>
        </ul>
        <p class="note">Heads-up on timing: accommodations decisions can take up to <b>7 weeks</b>, and the request goes through the school counselor after you check "accommodations" during registration. Start that clock before picking a test date. Also: since 2025 the ACT itself is shorter, gives 12–27% more time per question, and the science section is optional — the composite is just English + Math + Reading.</p>
      </div>
      <div class="card">
        <h3 class="sect">What college actually expects</h3>
        <p style="color:var(--ink2);font-size:0.9063rem;margin:0 0 4px">
          ACT publishes official <b style="color:var(--ink)">college readiness benchmarks</b> — the section score where
          students have about a <b style="color:var(--ink)">75% chance of a C or better</b> (and ~50% chance of a B or better)
          in the matching first-year college course:</p>
        <table class="bench">
          <tr><th>ACT section</th><th>Benchmark</th><th>What it maps to in freshman year</th></tr>
          <tr><td>English</td><td class="score">18</td><td>English Composition I — essays, grammar, editing</td></tr>
          <tr><td>Reading</td><td class="score">22</td><td>History, psychology &amp; other reading-heavy courses</td></tr>
          <tr><td>Math</td><td class="score">22</td><td>College Algebra — the same algebra this app drills</td></tr>
          <tr><td>Science</td><td class="score">23</td><td>Intro Biology — mostly chart &amp; data reading (section now optional)</td></tr>
        </table>
        <p class="note">Read the middle column again: <b>college-ready is 18–23, not 30-something.</b> Nobody needs a
        perfect score — most scholarship cutoffs sit near these numbers. For perspective, about <b>43% of all
        test-takers meet none of these benchmarks</b>, so clearing even two of them puts you ahead of most of the room.
        These are targets, and targets this size are hit with exactly what this app does: ten reps a day.</p>
      </div>`;
  }

  function renderBasics() {
    const v = document.getElementById("view-basics");
    v.innerHTML = `
      <div class="card">
        <h3 class="sect">The bricks under the math</h3>
        <p>This isn't dummy stuff. It's the handful of pieces the ACT quietly assumes you already have — the ones school moved past on a day you happened to miss. When a math question feels impossible, the missing piece is almost always one of these. Skim it once; come back to any brick when a question trips it.</p>
      </div>

      <div class="card">
        <h3 class="sect">Fractions — a fraction is just "out of"</h3>
        <p>The bottom number says how many equal pieces the whole is cut into. The top says how many you have. <b>3/4</b> = the whole is cut in 4, you've got 3 of them.</p>
        <p class="note">To compare or add fractions, the bottoms have to match first (same-size pieces). To turn a fraction into a decimal, just do top ÷ bottom: 3/4 = 3 ÷ 4 = 0.75.</p>
      </div>

      <div class="card">
        <h3 class="sect">Multiplying &amp; dividing fractions</h3>
        <p><b>Multiply:</b> straight across — tops together, bottoms together. <b>½ × ½</b> → tops 1×1 = 1, bottoms 2×2 = 4 → <b>1/4</b>. It means "a part of a part": half of a half is a quarter.</p>
        <p><b>Divide:</b> flip the second one and multiply. <b>½ ÷ ¼</b> → ½ × 4/1 = <b>2</b> (how many quarters fit in a half? two). "Keep, change, flip."</p>
      </div>

      <div class="card">
        <h3 class="sect">Negative numbers — below zero</h3>
        <p>Picture a number line: 0 in the middle, positives to the right, negatives to the left. <b>−5</b> is five steps left of zero (owing 5, not having 5).</p>
        <p><b>The rule that saves you:</b> a negative times or divided by a negative turns <b>positive</b> (two "opposites" cancel). Negative times positive stays negative. So (−3)(−4) = <b>12</b>, but (−3)(4) = <b>−12</b>.</p>
        <p class="note">Subtracting a negative is adding: 5 − (−2) = 5 + 2 = 7.</p>
      </div>

      <div class="card">
        <h3 class="sect">Percent — "per 100"</h3>
        <p><b>Percent just means "out of 100."</b> 30% = 30/100 = 0.30. To take a percent <b>of</b> something, "of" means multiply: 30% of 60 = 0.30 × 60 = <b>18</b>.</p>
        <p><b>Percent off:</b> you pay the rest. 30% off means you keep 70%, so a $60 jacket costs 0.70 × 60 = <b>$42</b>.</p>
        <p class="note">Percent change is always change ÷ the <b>original</b>: 250 → 300 is 50 ÷ 250 = 20% up.</p>
      </div>

      <div class="card">
        <h3 class="sect">Exponents — repeated multiplying</h3>
        <p>A little raised number means "multiply the base by itself that many times." <b>2³</b> = 2 × 2 × 2 = <b>8</b>. It is <em>not</em> 2 × 3.</p>
        <p><b>Same base?</b> Multiplying → add the little numbers (2³ × 2⁴ = 2⁷). Dividing → subtract them. A power of a power → multiply them ((2³)² = 2⁶).</p>
      </div>

      <div class="card">
        <h3 class="sect">Order of operations — what to do first</h3>
        <p>Work in this order so everyone gets the same answer: <b>P</b>arentheses, <b>E</b>xponents, <b>M</b>ultiply/<b>D</b>ivide (left to right), <b>A</b>dd/<b>S</b>ubtract (left to right). "PEMDAS."</p>
        <p class="note">2 + 3 × 4 is <b>14</b>, not 20 — the ×4 happens before the +2. Parentheses jump the line: (2 + 3) × 4 = 20.</p>
      </div>

      <div class="card">
        <h3 class="sect">Solving for x — undo it, in reverse</h3>
        <p>To get x alone, peel off whatever's attached, using the <b>opposite</b> operation, doing the same thing to both sides so it stays balanced.</p>
        <p>Opposites: <b>+</b> ↔ <b>−</b>, <b>×</b> ↔ <b>÷</b>. So for <b>3x + 2 = 11</b>: undo the + 2 (subtract 2 → 3x = 9), then undo the × 3 (divide by 3 → <b>x = 3</b>). Note: 3x means 3 <em>times</em> x, so you divide by 3 — not 3 ÷ x.</p>
        <p class="note">Check it by putting your answer back in: 3(3) + 2 = 11. ✓ If both sides match, you're right.</p>
      </div>`;
  }

  // ---------- Arcade: games you earn by studying ----------
  let activeGame = null;
  function stopActiveGame() { if (activeGame && activeGame.stop) { try { activeGame.stop(); } catch (e) { /* ignore */ } } activeGame = null; }

  const ARCADE = [
    { id: "runner", name: "Blaster Run", tag: "run-and-gun", unlock: 1,
      blurb: "A side-scrolling run-and-gun. Move, jump, and blast the shapes rushing you down. Earned by studying, not handed over.",
      start: startRunner },
    { id: "corridor", name: "Corridor", tag: "first-person maze", unlock: 3,
      blurb: "A first-person crawl through a maze you can only see one wall at a time. Find the five data cores and get to the exit before the drones do. Built here, not borrowed.",
      start: startCorridor }
  ];

  function renderArcade() {
    stopActiveGame();
    const v = document.getElementById("view-arcade");
    v.innerHTML = "";
    const lvl = levelIndex(S.xp);
    const head = el("div", "card");
    head.append(
      el("h3", "sect", "Arcade — you earned this"),
      el("p", "note", "Not a distraction from studying — the payoff FOR it. Each game unlocks when your XP hits a level, and only moves once you press play.")
    );
    v.append(head);
    ARCADE.forEach(g => {
      const c = el("div", "card");
      c.append(el("h3", "sect", g.name + "  ·  " + g.tag));
      c.append(el("p", "note", g.blurb));
      if (g.comingSoon) {
        c.append(el("p", "gamelock", "Coming soon · unlocks at Level " + (g.unlock + 1) + " (" + LEVELS[g.unlock].name + ")"));
      } else if (lvl >= g.unlock) {
        const play = el("button", "btn", "▶ Play " + g.name);
        const mount = el("div", "gamemount");
        play.onclick = () => { stopActiveGame(); activeGame = g.start(mount); };
        const row = el("div", "actions"); row.append(play);
        c.append(row, mount);
      } else {
        c.append(el("p", "gamelock", "🔒 Unlocks at Level " + (g.unlock + 1) + " — " + LEVELS[g.unlock].name + ", " + LEVELS[g.unlock].xp + " XP. Keep drilling."));
      }
      v.append(c);
    });
  }

  // Game 1 — original run-and-gun. Returns { stop } for cleanup on tab change.
  function startRunner(mount) {
    mount.innerHTML = "";
    const W = 640, H = 360;
    const canvas = el("canvas");
    canvas.width = W; canvas.height = H;
    canvas.className = "gamecanvas";
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "Blaster Run game. Arrow keys move and jump, space shoots, P pauses.");
    mount.append(canvas);
    mount.append(el("p", "gamehelp", "← → move · ↑ jump · Space shoot · P pause"));
    const ctx = canvas.getContext("2d");
    const C = vizColors();
    const RED = "#e0555f";
    const ground = H - 40;
    const player = { x: 90, y: ground - 28, w: 18, h: 28, vy: 0, onGround: true, facing: 1 };
    let bullets = [], enemies = [], parts = [], score = 0, lives = 3, over = false, paused = false, t = 0, spawnT = 60, speed = 2.2;
    const keys = {};

    function shoot() { if (!over && !paused) bullets.push({ x: player.x + player.w, y: player.y + 9, vx: 8 }); }
    function reset() { bullets = []; enemies = []; parts = []; score = 0; lives = 3; over = false; paused = false; t = 0; spawnT = 60; speed = 2.2; player.x = 90; player.y = ground - 28; player.vy = 0; player.onGround = true; }
    function onKey(e) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) e.preventDefault();
      if (e.type === "keydown") {
        keys[e.key] = true;
        if (e.key === " ") { over ? reset() : shoot(); }
        if (e.key === "p" || e.key === "P") paused = !paused;
      } else { keys[e.key] = false; }
    }
    function spawn() {
      const flyer = Math.random() < 0.35;
      enemies.push({ x: W + 20, y: flyer ? ground - 74 - Math.random() * 26 : ground - 22, w: 22, h: 22, v: speed + Math.random() * 1.2, flyer });
    }
    function burst(x, y, col) { for (let i = 0; i < 10; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 20, col }); }
    function update() {
      t++;
      if (keys["ArrowLeft"]) { player.x -= 3; player.facing = -1; }
      if (keys["ArrowRight"]) { player.x += 3; player.facing = 1; }
      player.x = Math.max(10, Math.min(W * 0.6, player.x));
      if (keys["ArrowUp"] && player.onGround) { player.vy = -8.6; player.onGround = false; }
      player.vy += 0.5; player.y += player.vy;
      if (player.y >= ground - player.h) { player.y = ground - player.h; player.vy = 0; player.onGround = true; }
      bullets.forEach(b => b.x += b.vx);
      bullets = bullets.filter(b => b.x < W + 10 && !b.hit);
      if (--spawnT <= 0) { spawn(); spawnT = Math.max(22, 70 - t / 120); }
      speed = 2.2 + t / 1400;
      enemies.forEach(en => {
        en.x -= en.v;
        bullets.forEach(b => { if (!b.hit && b.x > en.x && b.x < en.x + en.w && b.y > en.y && b.y < en.y + en.h) { b.hit = true; en.dead = true; score += 10; burst(en.x + en.w / 2, en.y + en.h / 2, C.gold); } });
        if (!en.dead && player.x < en.x + en.w && player.x + player.w > en.x && player.y < en.y + en.h && player.y + player.h > en.y) { en.dead = true; lives--; burst(player.x + player.w / 2, player.y, RED); if (lives <= 0) over = true; }
      });
      enemies = enemies.filter(en => !en.dead && en.x > -30);
      parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; });
      parts = parts.filter(p => p.life > 0);
    }
    function banner(text) {
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, H / 2 - 26, W, 52);
      ctx.fillStyle = "#fff"; ctx.font = "18px monospace"; ctx.textAlign = "center";
      ctx.fillText(text, W / 2, H / 2 + 6); ctx.textAlign = "left";
    }
    function draw() {
      ctx.fillStyle = C.surf; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = C.grid;
      for (let i = 0; i < 22; i++) { const x = ((i * 53 - t * 0.6) % W + W) % W; ctx.fillRect(x, 34 + ((i * 37) % (ground - 60)), 2, 2); }
      ctx.strokeStyle = C.axis; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, ground); ctx.lineTo(W, ground); ctx.stroke();
      ctx.fillStyle = C.blue; ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillStyle = C.surf; ctx.fillRect(player.x + (player.facing > 0 ? player.w - 5 : 1), player.y + 6, 4, 4);
      ctx.fillStyle = C.gold; bullets.forEach(b => ctx.fillRect(b.x, b.y, 6, 3));
      enemies.forEach(en => { ctx.fillStyle = en.flyer ? C.aqua : RED; ctx.fillRect(en.x, en.y, en.w, en.h); ctx.fillStyle = C.surf; ctx.fillRect(en.x + 4, en.y + 6, 3, 3); });
      parts.forEach(p => { ctx.globalAlpha = Math.max(0, p.life / 20); ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, 3, 3); }); ctx.globalAlpha = 1;
      ctx.fillStyle = C.ink; ctx.font = "14px monospace";
      ctx.fillText("Score " + score, 12, 22);
      ctx.fillText("Lives " + Math.max(0, lives), W - 92, 22);
      if (paused) banner("Paused — press P");
      else if (over) banner("Game over · " + score + " · press Space");
    }
    let raf = 0;
    function loop() { if (!paused && !over) update(); draw(); raf = requestAnimationFrame(loop); }
    canvas.addEventListener("keydown", onKey);
    canvas.addEventListener("keyup", onKey);
    canvas.focus();
    loop();
    return { stop() { cancelAnimationFrame(raf); canvas.removeEventListener("keydown", onKey); canvas.removeEventListener("keyup", onKey); mount.innerHTML = ""; } };
  }

  // Game 2 — Corridor: an original first-person maze crawl on a raycaster.
  // One column of pixels per screen x: march a ray until it hits a wall, and how far it
  // travelled decides how tall that slice of wall is. That's the whole trick.
  function startCorridor(mount) {
    mount.innerHTML = "";
    const W = 640, H = 360, HALF = H / 2;
    const canvas = el("canvas");
    canvas.width = W; canvas.height = H;
    canvas.className = "gamecanvas";
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label",
      "Corridor game. Arrow keys or W A S D to move and turn, P pauses. Collect five cores and reach the exit.");
    mount.append(canvas);
    mount.append(el("p", "gamehelp", "↑ ↓ walk · ← → turn (A/D strafe) · P pause · R restart"));
    const ctx = canvas.getContext("2d");
    const C = vizColors();
    const RED = "#e0555f";

    // 1 = wall, 0 = floor. Hand-built so it reads as rooms and corridors, not noise.
    const MAP = [
      "1111111111111111",
      "1000000010000021",
      "1011111010111101",
      "1010002010100101",
      "1010111011100101",
      "1010100000000101",
      "1000101111110101",
      "1111101000010001",
      "1000201011010111",
      "1011111010010001",
      "1010000010111101",
      "1010111110100001",
      "1010100000102111",
      "1000101111100001",
      "1211100000011101",
      "1111111111111111"
    ].map(row => row.split("").map(Number));
    const MH = MAP.length, MW = MAP[0].length;
    const at = (x, y) => (MAP[y] && MAP[y][x] !== undefined ? MAP[y][x] : 1);
    const solid = (x, y) => at(Math.floor(x), Math.floor(y)) === 1;

    let px, py, dir, cores, taken, drones, over, won, paused, tick, message;
    function reset() {
      px = 1.5; py = 1.5; dir = 0;
      taken = 0; over = false; won = false; paused = false; tick = 0; message = "";
      cores = [];
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === 2) cores.push({ x: x + 0.5, y: y + 0.5, got: false });
      drones = [{ x: 8.5, y: 8.5, t: 0 }, { x: 12.5, y: 3.5, t: 1.6 }, { x: 4.5, y: 12.5, t: 3.1 }];
    }
    reset();

    const keys = {};
    function onKey(e) {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d", "p", "r"].includes(k)) e.preventDefault();
      keys[k] = e.type === "keydown";
      if (e.type !== "keydown") return;
      if (k === "p" && !over) paused = !paused;
      if (k === "r") reset();
    }

    // keep a body's width away from the wall, or you end up with your nose in the texture
    const blocked = (x, y) => solid(x + 0.18, y) || solid(x - 0.18, y) || solid(x, y + 0.18) || solid(x, y - 0.18);
    function move(step, strafe) {
      const nx = px + Math.cos(dir) * step - Math.sin(dir) * strafe;
      const ny = py + Math.sin(dir) * step + Math.cos(dir) * strafe;
      if (!blocked(nx, py)) px = nx;   // slide along walls instead of sticking to them
      if (!blocked(px, ny)) py = ny;
    }

    function update() {
      tick++;
      const speed = 0.055, turn = 0.045;
      if (keys.arrowleft) dir -= turn;
      if (keys.arrowright) dir += turn;
      if (keys.arrowup || keys.w) move(speed, 0);
      if (keys.arrowdown || keys.s) move(-speed, 0);
      if (keys.a) move(0, -speed);
      if (keys.d) move(0, speed);

      cores.forEach(c => {
        if (!c.got && Math.hypot(c.x - px, c.y - py) < 0.5) {
          c.got = true; taken++;
          message = taken >= cores.length ? "All cores — get to the exit!" : "Core " + taken + " of " + cores.length;
        }
      });

      drones.forEach(d => {
        d.t += 0.012;
        const stepX = Math.cos(d.t * 1.7) * 0.03, stepY = Math.sin(d.t * 1.1) * 0.03;
        if (!solid(d.x + stepX, d.y)) d.x += stepX;
        if (!solid(d.x, d.y + stepY)) d.y += stepY;
        if (Math.hypot(d.x - px, d.y - py) < 0.45) { over = true; message = "A drone got you."; }
      });

      // the exit is the far corner, and it only opens once every core is in hand
      if (taken >= cores.length && Math.hypot(px - (MW - 2.5), py - (MH - 2.5)) < 0.7) { won = true; over = true; }
    }

    function column(x) {
      // one ray per screen column, fanned across a 66° field of view
      const angle = dir + Math.atan(((2 * x) / W - 1) * 0.66);
      const sin = Math.sin(angle), cos = Math.cos(angle);
      let distance = 0, hitSide = 0;
      while (distance < 20) {
        distance += 0.02;
        const rx = px + cos * distance, ry = py + sin * distance;
        if (solid(rx, ry)) {
          // which face did we hit? compare how far into the cell each axis is
          const fx = Math.abs(rx - Math.round(rx)), fy = Math.abs(ry - Math.round(ry));
          hitSide = fx < fy ? 0 : 1;
          // where along that face — the seam between panels falls at the cell edges
          const along = hitSide === 0 ? ry : rx;
          return { distance, hitSide, seam: Math.abs(along - Math.round(along)) > 0.47 };
        }
      }
      return { distance, hitSide, seam: false };
    }

    function draw() {
      ctx.fillStyle = C.surf; ctx.fillRect(0, 0, W, HALF);
      ctx.fillStyle = C.grid; ctx.fillRect(0, HALF, W, HALF);
      const depth = new Array(W);
      for (let x = 0; x < W; x++) {
        const { distance, hitSide, seam } = column(x);
        depth[x] = distance;
        const height = H / (distance * Math.cos(Math.atan(((2 * x) / W - 1) * 0.66)) || 0.01);
        const shade = Math.max(0.18, 1 - distance / 12) * (hitSide ? 0.72 : 1) * (seam ? 0.55 : 1);
        ctx.fillStyle = hitSide ? C.blue : C.aqua;
        // panel bands, so a wall an inch from your face still reads as a wall
        const top = HALF - height / 2, band = height / 6;
        for (let b = 0; b < 6; b++) {
          const y = top + b * band;
          if (y > H || y + band < 0) continue;
          ctx.globalAlpha = shade * (b % 2 ? 0.82 : 1);
          ctx.fillRect(x, y, 1, band + 1);
        }
      }
      ctx.globalAlpha = 1;

      // sprites: cores and drones, painted back to front and hidden behind nearer walls
      const sprites = cores.filter(c => !c.got).map(c => ({ x: c.x, y: c.y, col: C.gold, size: 0.42 }))
        .concat(drones.map(d => ({ x: d.x, y: d.y, col: RED, size: 0.6 })));
      if (taken >= cores.length) sprites.push({ x: MW - 2.5, y: MH - 2.5, col: C.good, size: 0.8 });
      sprites
        .map(s => ({ ...s, d: Math.hypot(s.x - px, s.y - py) }))
        .sort((a, b) => b.d - a.d)
        .forEach(s => {
          let a = Math.atan2(s.y - py, s.x - px) - dir;
          while (a > Math.PI) a -= Math.PI * 2;
          while (a < -Math.PI) a += Math.PI * 2;
          if (Math.abs(a) > 0.8 || s.d < 0.15) return;
          const sx = Math.round(W / 2 + Math.tan(a) / 0.66 * (W / 2));
          const size = Math.min(H, (H / s.d) * s.size);
          if (sx < 0 || sx >= W || depth[Math.max(0, Math.min(W - 1, sx))] < s.d) return;
          ctx.globalAlpha = Math.max(0.25, 1 - s.d / 12);
          ctx.fillStyle = s.col;
          ctx.fillRect(sx - size / 2, HALF - size / 2, size, size);
          ctx.globalAlpha = 1;
        });

      ctx.fillStyle = C.ink; ctx.font = "14px monospace";
      ctx.fillText("Cores " + taken + " / " + cores.length, 12, 22);
      if (message) { ctx.fillStyle = C.gold; ctx.fillText(message, 12, H - 14); }
      if (paused) banner("Paused — press P");
      else if (won) banner("You made it out · press R");
      else if (over) banner(message + " · press R");
    }

    function banner(text) {
      ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(0, HALF - 34, W, 68);
      ctx.fillStyle = C.ink; ctx.font = "18px monospace"; ctx.textAlign = "center";
      ctx.fillText(text, W / 2, HALF + 6); ctx.textAlign = "left";
    }

    let raf = 0;
    function loop() { if (!paused && !over) update(); draw(); raf = requestAnimationFrame(loop); }
    canvas.addEventListener("keydown", onKey);
    canvas.addEventListener("keyup", onKey);
    canvas.focus();
    loop();
    return { stop() { cancelAnimationFrame(raf); canvas.removeEventListener("keydown", onKey); canvas.removeEventListener("keyup", onKey); mount.innerHTML = ""; } };
  }

  // ---------- chrome ----------
  function renderChips() {
    const s = streak();
    const li = levelIndex(S.xp);
    const lvl = document.getElementById("chip-level");
    lvl.innerHTML = "<b>Lv " + (li + 1) + "</b> " + esc(LEVELS[li].name) +
      " <span class='mini'><i style='width:" + Math.round(levelProgress(S.xp) * 100) + "%'></i></span>";
    document.getElementById("chip-streak").innerHTML = "🔥 <b>" + s + "</b> day" + (s === 1 ? "" : "s");
    document.getElementById("chip-today").innerHTML = "today <b>" + todayCount() + "</b> / " + goal();
  }

  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    stopSpeech();
    stopActiveGame();
    document.querySelectorAll("#tabs button").forEach(b => {
      const selected = b === btn;
      b.classList.toggle("active", selected);
      b.setAttribute("aria-selected", String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
    ["drill", "rulebook", "formulas", "basics", "progress", "links", "arcade"].forEach(name => {
      const panel = document.getElementById("view-" + name);
      const hidden = name !== btn.dataset.view;
      panel.classList.toggle("hidden", hidden);
      panel.hidden = hidden;
    });
    if (btn.dataset.view === "rulebook") renderRulebook();
    if (btn.dataset.view === "formulas") renderFormulas();
    if (btn.dataset.view === "basics") renderBasics();
    if (btn.dataset.view === "progress") renderProgress();
    if (btn.dataset.view === "links") renderLinks();
    if (btn.dataset.view === "arcade") renderArcade();
  });
  document.getElementById("tabs").addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...document.querySelectorAll("#tabs button")];
    let index = tabs.indexOf(document.activeElement);
    if (event.key === "Home") index = 0;
    else if (event.key === "End") index = tabs.length - 1;
    else index = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    tabs[index].focus();
    tabs[index].click();
  });

  // dev/test hook — harmless in normal use
  window.__drill = {
    sim(n, acc = 0.8) {
      for (let i = 0; i < n; i++) {
        if (!current || current.answered) nextQuestion();
        if (!current) return "break card showing after " + i + " answers"; // break guard interrupted the run
        const ci = current.choices.findIndex(c => c.correct);
        const wrongs = current.choices.map((c, j) => j).filter(j => !current.choices[j].correct);
        answer(Math.random() < acc ? ci : wrongs[Math.floor(Math.random() * wrongs.length)]);
      }
      return "answered " + n;
    },
    state: () => JSON.parse(JSON.stringify(S)),
    speechChunks: text => speech.split(text),
    guideFor: id => {
      const question = ACT_QUESTIONS.find(item => item.id === id);
      return question ? guidedMathSteps(question) : [];
    }
  };

  // ---------- boot ----------
  applyTheme();
  applyFontScale();
  applyGlow();
  document.getElementById("gearbtn").onclick = openSettings;
  document.getElementById("notesbtn").onclick = toggleNotesPanel;
  renderChips();
  if (S.introSeen) nextQuestion(); else showIntro();
})();
