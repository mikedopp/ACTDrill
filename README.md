# ACT Pattern Drill

A local drill app for the ACT English section, built for a brain that does better
with one question at a time than with hour-long video lessons.

## Give him the app (Windows exe)

**`dist\ACTDrill.exe` is the whole thing** — self-contained, ~155 MB, no .NET or
install needed. Copy it to his laptop and run it. Progress (XP, levels, streaks,
mastery) saves to `%LOCALAPPDATA%\ACTDrill` automatically.

- First run: Windows SmartScreen may warn because the exe is unsigned →
  **More info → Run anyway**.
- Needs the Microsoft WebView2 Runtime (preinstalled on updated Windows 10/11).
  If it's somehow missing the app shows the download link.

### ⚠ Before you build/ship: edit `notes.js`

`notes.js` is **The Corner** — short notes from people in his corner, shown at
level-ups, daily-goal moments, and occasionally after a strong answer.
**Rewrite the examples in your own words** (specific beats generic), and get
mom/siblings/others to contribute lines. Then rebuild:

```powershell
dotnet publish F:\mikedopp\drop\ACTDrill\desktop\ACTDrill.Desktop.csproj -c Release -r win-x64 --self-contained -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o F:\mikedopp\drop\ACTDrill\dist
```

**Updating notes without rebuilding:** put a `web` folder next to `ACTDrill.exe`
containing `index.html`, `questions.js`, `notes.js` — a beside-the-exe folder
always wins over the embedded copies, and edits apply on next launch. (Or edit
`%LOCALAPPDATA%\ACTDrill\web\notes.js` on his laptop — that copy is never
overwritten by the app.)

## What's inside

- **One question at a time** — 96 original ACT-style questions: English (48,
  12 patterns), Math (32, 8 patterns), Reading (16, 4 patterns) — the three
  sections that make up the composite score. Subject picker on the Drill tab
  (All / English / Math / Reading). Keys 1–4 answer, Enter advances.
- **Science & Writing**: intentionally absent. Since 2025 the science section is
  optional and NOT part of the composite; the essay is optional and rarely
  required. Verify the target scholarship's requirements before spending any
  energy there.
- **Every wrong answer explains itself** — the traps are the curriculum.
- **Adaptive** — missed patterns quietly come back more often.
- **Rewards** — XP per question (showing up earns some, right answers more, combo
  streaks stack, 7% chance of a ×2 "sharp-eye" crit), 10 levels from Walk-on to
  The Standard, confetti + level-up moments, pattern mastery stars (80%+ over
  10+ reps), streaks and personal bests.
- **The Corner** — notes from `notes.js`, delivered at wins. The point of the app.
- **Break guard** — after ~20 minutes or ~25 straight questions the app calls a
  5-minute break (+5 XP for taking it — rest is part of the training). Two
  "one more set" snoozes allowed, then it stops offering that button. Stepping
  away on your own for 5+ minutes resets the counters quietly. Hyperfocus is
  fuel, but it burns the driver.
- **Rulebook tab** — the entire finite pattern list with 5-second spot cues.
- **Formulas tab** — all ~28 formulas the ACT requires (it provides no formula
  sheet), each with a worked micro-example, grouped in five families.
- **Real practice tab** — official free ACT tests + accommodations links, plus
  ACT's college readiness benchmarks (English 18 / Reading 22 / Math 22 /
  Science 23) mapped to the freshman courses they predict success in.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole web app (UI + logic, no dependencies; double-clickable in a browser too) |
| `questions.js` | Question bank (96 questions, 24 patterns across English/Math/Reading) — documented format at the top |
| `notes.js` | The Corner — **edit this** |
| `desktop\` | WinForms + WebView2 shell (net8.0-windows) |
| `dist\ACTDrill.exe` | The shippable executable |

## Adding questions

Copy any object in `questions.js`, unique `id`, one choice `correct: true`, a
one-line `why` for every choice. `|pipes|` mark the underlined portion. Questions
are original, ACT-style — real ACT items are copyrighted; official PDFs are in
the Real practice tab. Math patterns (backsolving, plug-in numbers, formula
drills) would slot straight in as new `ACT_PATTERNS` entries.

## Roadmap ideas

- Math pattern bank
- Timed mode (only after accuracy is solid — pace is the last skill, not the first)
- Export progress to JSON
