# ACTDrill Design Rules

## Visual system

The default theme is Arctic Steel: `#5ba4d9` on `#0b0e14`, with IBM Plex Mono
or an installed monospace fallback. Surfaces use full borders and restrained
depth. Color never carries meaning alone.

The student's own notes are the one decorated surface: the open note editor, the
notes review card, and the live tutor question box carry an animated gradient
border in Google's four colors, and the reveal button for an existing note
carries a static glow. Reduced motion holds the gradient still rather than
removing it, and Settings can switch the whole effect to Plain.

## Notes

- A note belongs to one question, is written by the student, and is never
  generated for them.
- Returning to a noted question reveals the note only on request, so it cannot
  spoil the retrieval.
- The notes drawer is complementary, not modal: the drill stays usable behind
  it, and the drill's keyboard shortcuts do not fire from inside it.
- Notes export as plain Markdown, grouped by subject and pattern; erasing them
  requires explicit confirmation and is offered next to the export.

## Layout

- The drill remains a single-column reading experience.
- Navigation may scroll horizontally on narrow screens; the document must not.
- Dialog headers and close controls remain visible at the 720×560 app minimum.
- Type scaling changes root text size; page zoom is not used.
- Controls are at least 44 CSS pixels high and wrap before they overflow.

## Interaction

- Tabs implement tab/list semantics and arrow-key navigation.
- Dialogs have a name, `aria-modal`, trapped focus, Escape close, and focus
  restoration.
- Answer and setup feedback uses polite live regions.
- Coached Math starts with one visible move before the answer choices; the
  student controls each subsequent reveal.
- Desktop read-aloud renders one complete native Windows WAV before playback,
  translates Math notation into spoken language, and exposes installed voice
  selection and preview in Settings.
- The WebView content policy explicitly permits `data:` audio through
  `media-src`; removing that directive breaks native WAV playback.
- Progress graphics expose numeric values to assistive technology.
- Reduced-motion preference disables celebration animation.
- Destructive local reset requires explicit confirmation.

## Security-facing UI

- External links are approved HTTPS resources only.
- Bank updates report rejection without replacing the current bank.
- Optional AI setup shows distinct download, signature verification, install,
  model download, and verification states.
- Diagnostics state the app version, bank version/counts, host, local storage,
  credentials, and optional Ollama dependency.

## Content

Question prompts and explanations are original. Pattern cues must apply to the
entire pattern family; a specialized reminder must not be presented as the
universal first step for unrelated shapes.
