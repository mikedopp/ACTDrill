import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

function loadBank() {
  const context = {};
  vm.createContext(context);
  const source = read("questions.js") +
    "\n;globalThis.__bank = { patterns: ACT_PATTERNS, questions: ACT_QUESTIONS, version: BANK_VERSION };";
  new vm.Script(source, { filename: "questions.js" }).runInContext(context);
  return context.__bank;
}

test("question bank has valid structure and current counts", () => {
  const bank = loadBank();
  assert.equal(Object.keys(bank.patterns).length, 35);
  assert.equal(bank.questions.length, 280);
  assert.match(bank.version, /^v10 · 2026-07-29$/);

  const ids = new Set();
  for (const question of bank.questions) {
    assert.match(question.id, /^[A-Za-z0-9_-]{1,80}$/);
    assert.equal(ids.has(question.id), false, `duplicate id ${question.id}`);
    ids.add(question.id);
    assert.ok(bank.patterns[question.pattern], `${question.id} has unknown pattern`);
    assert.equal(question.choices.length, 4, `${question.id} must have four choices`);
    assert.equal(
      question.choices.filter(choice => choice.correct === true).length,
      1,
      `${question.id} must have one correct choice`
    );
    for (const choice of question.choices) {
      assert.equal(typeof choice.text, "string");
      assert.equal(typeof choice.why, "string");
    }
  }
});

test("web assets parse and are externalized", () => {
  new vm.Script(read("wwwroot/app.js"), { filename: "app.js" });
  new vm.Script(read("wwwroot/coaching.js"), { filename: "coaching.js" });
  new vm.Script(read("wwwroot/speech.js"), { filename: "speech.js" });
  const html = read("wwwroot/index.html");
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /media-src 'self' data:/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(html, /<script src="app\.js"><\/script>/);
  assert.match(html, /<script src="coaching\.js"><\/script>/);
  assert.match(html, /<script src="speech\.js"><\/script>/);
  assert.doesNotMatch(html, /<script(?!\s+src=)/);
  assert.doesNotMatch(html, /<style[\s>]/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-live="polite"/);
});

test("speech controller chunks long questions without dropping text", () => {
  const window = {};
  const context = {
    window,
    CustomEvent: class CustomEvent {},
    setTimeout,
    clearTimeout
  };
  vm.createContext(context);
  new vm.Script(read("wwwroot/speech.js"), { filename: "speech.js" }).runInContext(context);
  const controller = new window.ACTDrillSpeechController(() => ({
    on: true,
    rate: 0.9,
    volume: 1,
    voiceId: ""
  }));
  const original = ("Read the problem carefully, then identify the numbers and units. ").repeat(12).trim();
  const chunks = controller.split(original);
  assert.ok(chunks.length > 3);
  assert.ok(chunks.every(chunk => chunk.length <= 150));
  assert.equal(chunks.join(" ").replace(/\s+/g, " "), original.replace(/\s+/g, " "));
});

test("speech renderer translates ACT math into spoken language", () => {
  const window = {};
  const context = {
    window,
    CustomEvent: class CustomEvent {},
    setTimeout,
    clearTimeout
  };
  vm.createContext(context);
  new vm.Script(read("wwwroot/speech.js"), { filename: "speech.js" }).runInContext(context);
  const controller = new window.ACTDrillSpeechController(() => ({
    on: true,
    rate: 0.9,
    volume: 1,
    voiceId: ""
  }));

  assert.equal(
    controller.render("3⁻² = 1/9"),
    "3 to the negative 2 power equals 1 divided by 9"
  );
  assert.equal(
    controller.render("x² + √16 = 20"),
    "x squared + square root of 16 equals 20"
  );
});

test("desktop speech uses one native WAV request instead of browser utterance chunks", async () => {
  let synthRequest = null;
  let completed = false;
  const events = [];
  const window = {
    chrome: { webview: {} },
    dispatchEvent: event => events.push(event)
  };
  class FakeAudio {
    constructor(source) {
      this.source = source;
      this.volume = 1;
      this.played = false;
    }
    async play() { this.played = true; }
    pause() {}
    removeAttribute() {}
    load() {}
  }
  class CustomEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.detail = options.detail;
    }
  }
  const nativeBridge = async (method, params) => {
    if (method === "speechVoices") {
      return {
        ok: true,
        voices: [{ Id: "native:Test Voice", Name: "Test Voice", Culture: "en-US" }]
      };
    }
    if (method === "speechSynthesize") {
      synthRequest = params;
      return {
        ok: true,
        mimeType: "audio/wav",
        audioBase64: "UklGRg=="
      };
    }
    return { ok: false, error: "unexpected method" };
  };
  const context = { window, Audio: FakeAudio, CustomEvent, setTimeout, clearTimeout };
  vm.createContext(context);
  new vm.Script(read("wwwroot/speech.js"), { filename: "speech.js" }).runInContext(context);
  const controller = new window.ACTDrillSpeechController(
    () => ({ on: true, rate: 0.9, volume: 0.65, voiceId: "native:Test Voice" }),
    nativeBridge
  );

  await controller.refreshVoices();
  await controller.speak(
    ("3⁻² = 1/9. Work one step at a time. ").repeat(20),
    () => { completed = true; }
  );

  assert.ok(synthRequest);
  assert.match(synthRequest.text, /3 to the negative 2 power equals 1 divided by 9/);
  assert.equal(synthRequest.voice, "Test Voice");
  assert.equal(controller.currentAudio.played, true);
  assert.equal(controller.currentAudio.volume, 0.65);
  controller.currentAudio.onended();
  assert.equal(completed, true);
  assert.equal(events.some(event => event.type === "actdrill:speech-error"), false);
});

test("every Math question has a usable start-here coaching path", () => {
  const bank = loadBank();
  const window = {};
  const context = { window };
  vm.createContext(context);
  new vm.Script(read("wwwroot/coaching.js"), { filename: "coaching.js" }).runInContext(context);

  const mathQuestions = bank.questions.filter(question =>
    bank.patterns[question.pattern]?.subject === "Math"
  );
  assert.equal(mathQuestions.length, 120);

  for (const question of mathQuestions) {
    const pattern = bank.patterns[question.pattern];
    const formula = question.formula || pattern.formula || null;
    const steps = window.ACTDrillCoaching.guidedMathSteps(question, pattern, formula);
    assert.ok(steps.length >= 3, `${question.id} needs at least three coaching steps`);
    assert.ok(
      steps.every(step => typeof step.do === "string" && step.do.trim()),
      `${question.id} has an empty coaching step`
    );
  }
});

test("release versions agree", () => {
  const files = [
    "desktop/ACTDrill.Desktop.csproj",
    "installer/ACTDrill.iss",
    "wwwroot/app.js",
    "wwwroot/index.html",
    "README.md"
  ];
  files.forEach(file => assert.match(read(file), /1\.13\.2/, file));
});

test("installer helper is versioned and referenced consistently", () => {
  const helpers = fs.readdirSync(path.join(root, "installer"))
    .filter(file => /^actdrill_Setup-AiTutor_v.+\.ps1$/.test(file));
  assert.equal(helpers.length, 1, "exactly one versioned installer helper");
  assert.match(helpers[0], /1\.13\.2/, "helper filename matches release version");
  assert.ok(read("installer/ACTDrill.iss").includes(helpers[0]),
    `ACTDrill.iss must reference ${helpers[0]}`);
});

test("drill shortcuts yield to text fields, so a space typed in a note stays a space", () => {
  const app = read("wwwroot/app.js");
  // Without this bail-out the global 1-4/Enter/space/n shortcuts fire while the student
  // is writing a note: the space is swallowed and the question is skipped mid-sentence.
  assert.match(app, /if \(isTyping\(e\.target\)\) return;/);

  const helper = app.match(/const isTyping = node =>[\s\S]*?\);\r?\n/);
  assert.ok(helper, "isTyping helper must exist");
  const context = { HTMLElement: class HTMLElement {} };
  vm.createContext(context);
  new vm.Script(helper[0] + ";globalThis.__isTyping = isTyping;", { filename: "isTyping.js" })
    .runInContext(context);
  const isTyping = context.__isTyping;
  const node = (tagName, isContentEditable = false) =>
    Object.assign(new context.HTMLElement(), { tagName, isContentEditable });

  for (const tag of ["TEXTAREA", "INPUT", "SELECT"]) {
    assert.equal(isTyping(node(tag)), true, `${tag} owns its own keys`);
  }
  assert.equal(isTyping(node("DIV", true)), true, "contenteditable owns its own keys");
  assert.equal(isTyping(node("DIV")), false);
  assert.equal(isTyping(node("BUTTON")), false, "shortcuts must still work from buttons");
  assert.equal(isTyping(null), false);
});

test("a day's correct count is persisted, so lifetime accuracy is a number", () => {
  const app = read("wwwroot/app.js");
  // dropping `right` here made renderProgress sum undefined and show "NaN%" after a reload
  assert.match(app, /base\.daily\[date\] = \{ n, right:/);
});

test("frontend contains typed bridge and no page zoom", () => {
  const app = read("wwwroot/app.js");
  assert.match(app, /type:\s*"micdrop-message"/);
  assert.match(app, /method,/);
  assert.match(app, /params/);
  assert.doesNotMatch(app, /\.style\.zoom/);
  assert.doesNotMatch(app, /postMessage\("updateBank"\)/);
});
