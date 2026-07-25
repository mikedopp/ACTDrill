// ============================================================
// ACT Pattern Drill — question bank
// ------------------------------------------------------------
// Original practice questions written in ACT English style.
// (Real ACT questions are copyrighted — use the official PDFs
// linked in the app for full-test practice.)
//
// To add a question: copy any object below, give it a unique id,
// set pattern to one of the ACT_PATTERNS keys, mark exactly one
// choice correct:true, and give every choice a one-line "why".
// |pipes| in the passage mark the underlined portion.
// The app pins "NO CHANGE" first and "DELETE..." last, and
// shuffles the rest unless fixedOrder:true.
// ============================================================

const ACT_PATTERNS = {
  runons: {
    name: "Run-ons & comma splices",
    rule: "A comma alone can't join two complete sentences. You need a period, a semicolon, or a comma + FANBOYS word (for, and, nor, but, or, yet, so).",
    cue: "Cover the underline. Is there a complete sentence on BOTH sides? If yes, a bare comma is illegal.",
    example: "Wrong: “It rained, we left.”  Right: “It rained, so we left.” or “It rained; we left.”"
  },
  svagree: {
    name: "Subject–verb agreement",
    rule: "The verb agrees with the subject, not with whatever noun happens to sit next to it. Prepositional phrases (of…, in…, with…) never contain the subject.",
    cue: "Cross out everything between the subject and the verb, then read it bare: “The box … was.”",
    example: "“The box of photographs WAS heavy” — box was, not photographs were."
  },
  apostrophe: {
    name: "Apostrophes & possessives",
    rule: "It's = it is. Its = belonging to it. Plural possessive: s' (drivers'). Irregular plurals: 's (children's). Who's = who is.",
    cue: "Expand the contraction out loud. If “it is” doesn't fit the sentence, there's no apostrophe.",
    example: "The dog wagged its tail. It's cold out. Both drivers' licenses."
  },
  commas: {
    name: "Comma pairs & comma traps",
    rule: "If a phrase can be lifted out without breaking the sentence, wrap it in TWO commas — or none. Never one. And never put a lone comma between a subject and its verb.",
    cue: "Read the sentence skipping the phrase. Still works? Two commas. Falls apart? Zero commas.",
    example: "Mount Rainier, which towers over Seattle, is huge. / Students who arrive late must sign in."
  },
  pronoun: {
    name: "Pronoun clarity & case",
    rule: "A pronoun needs one clear owner and the right case: I/he/she DO the action; me/him/her RECEIVE it. Collective nouns (committee, team) take “its.”",
    cue: "If a “she” could point at two people, the ACT wants it fixed. For case, drop the other person: “praised me.”",
    example: "“The committee released ITS report.” “He praised Luis and ME.”"
  },
  tense: {
    name: "Verb tense & timeline",
    rule: "Match the timeline. An action finished before another past event takes “had ___.” Don't jump tenses mid-sentence without a reason.",
    cue: "Find the time words — last summer, by the time, since, every morning. They dictate the verb.",
    example: "“By the time the storm hit, the crew HAD SECURED the boats.”"
  },
  concise: {
    name: "Wordiness & redundancy",
    rule: "If two options are both grammatical and mean the same thing, the SHORTEST one wins. Redundancy (“return back,” “annual … every year”) is always wrong.",
    cue: "Spot two words doing one job. And always audition “DELETE the underlined portion” — it's right more often than it feels.",
    example: "“She returned to the trailhead” — not “returned back.”"
  },
  transition: {
    name: "Transition logic",
    rule: "The transition word must match the LOGIC between the sentences: contrast (however), cause→effect (therefore), example (for instance), addition (moreover).",
    cue: "Ignore the word that's there. Say the relationship in your own words first — then pick the word that says that.",
    example: "Practiced for weeks → flawless speech = cause/effect → “As a result.”"
  },
  modifier: {
    name: "Misplaced modifiers",
    rule: "A describing phrase attaches to the nearest noun. Whoever is doing the “-ing” at the start of a sentence must be the very next noun after the comma.",
    cue: "Ask: who is actually doing this action? Is that word sitting right next to the phrase?",
    example: "“Running to catch the bus, I felt my strap snap” — I was running, not the strap."
  },
  whowhom: {
    name: "Who / whom / that / which",
    rule: "Who does the action; whom receives it (like he vs. him). “That” for essential info; “which” with commas for extra info; “who” for people, always.",
    cue: "Answer the clause with he/him: “HE organized it” → who. “to HIM” → whom.",
    example: "“The volunteer WHO organized it” / “To WHOM should I address it?”"
  },
  parallel: {
    name: "Parallel structure",
    rule: "Items in a list — or an either/or pair — must wear the same grammatical outfit: lifting, stocking, helping… not “to help.”",
    cue: "Read only the list items back-to-back. One sounds like it wandered in from a different sentence? Fix that one.",
    example: "smart, driven, and CREATIVE — not “has a lot of creativity.”"
  },
  rhetoric: {
    name: "Add, delete, or keep?",
    rule: "Every add/delete question is the same question: does this sentence serve THIS paragraph's one job? Loyal to the point = keep. Interesting but off-topic = cut.",
    cue: "State the paragraph's job in five words. Judge the sentence against that job — never against whether it's “good.”",
    example: "Essay about garden COSTS → the softball-sized-tomato story goes."
  }
};

const ACT_QUESTIONS = [

  // ---------------- Run-ons & comma splices ----------------
  {
    id: "runons-1", pattern: "runons",
    passage: "The hikers reached the summit at |noon, they ate| lunch while the clouds drifted below.",
    decode: "Look at the underlined join. Is there a complete sentence on BOTH sides? If so, a comma alone can't hold them together.",
    choices: [
      { text: "NO CHANGE", why: "Comma splice — there's a complete sentence on each side, and a comma alone can't hold them together." },
      { text: "noon, and they ate", correct: true, why: "Comma + “and” (a FANBOYS word) legally joins two complete sentences." },
      { text: "noon they ate", why: "Removing the comma makes a fused sentence — two sentences with nothing joining them at all." },
      { text: "noon, they had eaten", why: "Still a comma splice, and “had eaten” breaks the timeline on top of it." }
    ]
  },
  {
    id: "runons-2", pattern: "runons",
    passage: "Maya trains before school every |day, therefore, she| rarely misses a meet.",
    choices: [
      { text: "NO CHANGE", why: "“Therefore” is not a FANBOYS word — with only commas, this is still a comma splice." },
      { text: "day; therefore, she", correct: true, why: "A semicolon joins two complete sentences; “therefore,” after it is legal." },
      { text: "day, therefore she", why: "Moving the second comma doesn't fix the joint — it's the same splice." },
      { text: "day therefore, she", why: "Now nothing joins the two complete thoughts — a fused sentence." }
    ]
  },
  {
    id: "runons-3", pattern: "runons",
    passage: "The engine sputtered twice |then it went| silent.",
    choices: [
      { text: "NO CHANGE", why: "“Then” isn't a conjunction — this is a fused sentence with no joint at all." },
      { text: "and then went", correct: true, why: "“And” folds it into one clause: one subject, two verbs, no joint needed." },
      { text: ", then it went", why: "A comma before “then” just upgrades the run-on to a comma splice." },
      { text: "then, it went", why: "Still fused — that comma is decorating, not joining." }
    ]
  },
  {
    id: "runons-4", pattern: "runons",
    passage: "Volunteers cleared brush all |morning, by afternoon| the trail was open again.",
    choices: [
      { text: "NO CHANGE", why: "Comma splice — “Volunteers cleared brush all morning” and “by afternoon the trail was open” are both complete." },
      { text: "morning; by afternoon", correct: true, why: "A semicolon is the legal joint between two complete, closely related sentences." },
      { text: "morning by afternoon", why: "Fused — and now the two time phrases crash into each other." },
      { text: "morning, and, by afternoon", why: "“And” works, but the comma right after it is illegal." }
    ]
  },

  // ---------------- Subject–verb agreement ----------------
  {
    id: "svagree-1", pattern: "svagree",
    passage: "The box of old photographs |were| sitting in the attic.",
    choices: [
      { text: "NO CHANGE", why: "“Photographs” lives inside a prepositional phrase — it can't be the subject. The subject is “box.”" },
      { text: "was", correct: true, why: "Cross out “of old photographs”: The box … was sitting. Singular subject, singular verb." },
      { text: "have been", why: "Still a plural verb — same trap, different tense." },
      { text: "are", why: "Plural again, and present tense clashes with the scene." }
    ]
  },
  {
    id: "svagree-2", pattern: "svagree",
    passage: "Each of the players |bring| a water bottle to practice.",
    choices: [
      { text: "NO CHANGE", why: "The subject is “Each” — always singular. “Players” is trapped inside “of the players.”" },
      { text: "brings", correct: true, why: "Each … brings. Cross out the prepositional phrase and it's obvious." },
      { text: "have brought", why: "Plural verb — the interrupting phrase fooled it." },
      { text: "are bringing", why: "Plural again. “Each” never stops being singular." }
    ]
  },
  {
    id: "svagree-3", pattern: "svagree",
    passage: "There |is| three reasons the bridge failed.",
    choices: [
      { text: "NO CHANGE", why: "“There” is never the subject. The real subject comes after the verb: “reasons” — plural." },
      { text: "are", correct: true, why: "Flip it: “Three reasons ARE there.” Plural subject, plural verb." },
      { text: "was", why: "Still singular — changing the tense doesn't fix the agreement." },
      { text: "has been", why: "Singular again, and the tense shift has no reason to exist." }
    ]
  },
  {
    id: "svagree-4", pattern: "svagree",
    passage: "Neither the coach nor the players |was| ready for the schedule change.",
    choices: [
      { text: "NO CHANGE", why: "With neither/nor, the verb agrees with the CLOSER subject — “players,” which is plural." },
      { text: "were", correct: true, why: "“Players” sits next to the verb, so plural “were” wins." },
      { text: "is", why: "Singular — and the sentence is set in the past." },
      { text: "has been", why: "Singular again; the nearest subject “players” demands plural." }
    ]
  },

  // ---------------- Apostrophes ----------------
  {
    id: "apostrophe-1", pattern: "apostrophe",
    passage: "The company changed |it's| hiring policy after the merger.",
    choices: [
      { text: "NO CHANGE", why: "“It's” only ever means “it is.” “The company changed it is hiring policy” — no." },
      { text: "its", correct: true, why: "Possessive “its” has no apostrophe — the policy belongs to it." },
      { text: "its'", why: "“Its'” doesn't exist in English." },
      { text: "it is", why: "Read it back: “changed it is hiring policy” doesn't parse." }
    ]
  },
  {
    id: "apostrophe-2", pattern: "apostrophe",
    passage: "Both |drivers's| licenses had expired.",
    choices: [
      { text: "NO CHANGE", why: "’s after an s-plural is never right." },
      { text: "drivers'", correct: true, why: "“Both” means plural drivers; plural possessive = s + apostrophe." },
      { text: "driver's", why: "Singular possessive — but “both” tells you there are two drivers." },
      { text: "drivers", why: "No apostrophe means no possession — but the licenses belong to them." }
    ]
  },
  {
    id: "apostrophe-3", pattern: "apostrophe",
    passage: "|Whose| going to lock up tonight?",
    choices: [
      { text: "NO CHANGE", why: "“Whose” is possessive (whose keys). This sentence needs “who is.”" },
      { text: "Who's", correct: true, why: "“Who's” = who is. “Who is going to lock up” — reads perfectly." },
      { text: "Whos", why: "Not a word." },
      { text: "Whose's", why: "Also not a word — possessive “whose” can't take another ’s." }
    ]
  },
  {
    id: "apostrophe-4", pattern: "apostrophe",
    passage: "The |childrens'| section of the library reopens Saturday.",
    choices: [
      { text: "NO CHANGE", why: "“Children” is already plural — there's no such word as “childrens.”" },
      { text: "children's", correct: true, why: "Irregular plurals (children, men, women) take apostrophe + s." },
      { text: "childrens", why: "Still not a word, and the possession vanished." },
      { text: "childrens's", why: "Doubles down on a word that doesn't exist." }
    ]
  },

  // ---------------- Comma pairs & traps ----------------
  {
    id: "commas-1", pattern: "commas",
    passage: "The novel |that she wrote in college,| finally found a publisher.",
    choices: [
      { text: "NO CHANGE", why: "That lone comma separates the subject from its verb — illegal." },
      { text: "that she wrote in college", correct: true, why: "“That …” clauses are essential info — they take zero commas." },
      { text: ", that she wrote in college,", why: "“That” clauses never get wrapped in commas; that's “which's” job." },
      { text: "that, she wrote in college", why: "A comma splitting “that” from its own clause breaks the sentence." }
    ]
  },
  {
    id: "commas-2", pattern: "commas",
    passage: "Mount Rainier, |which dominates the skyline| is visible from a hundred miles away.",
    choices: [
      { text: "NO CHANGE", why: "The extra-info clause opened with a comma but never closed — lift-out phrases need TWO commas." },
      { text: "which dominates the skyline,", correct: true, why: "Now the clause is fully wrapped: lift it out and the sentence still stands." },
      { text: "that dominates the skyline", why: "“That” can't follow a comma — and the opening comma is still orphaned." },
      { text: "which dominates, the skyline", why: "The comma landed inside the clause, splitting the verb from its object." }
    ]
  },
  {
    id: "commas-3", pattern: "commas",
    passage: "Students who arrive |late,| must sign in at the front desk.",
    choices: [
      { text: "NO CHANGE", why: "That comma separates the subject from its verb — the one place a lone comma can never go." },
      { text: "late", correct: true, why: "“Who arrive late” is essential — it tells you WHICH students — so no commas anywhere." },
      { text: "late;", why: "A semicolon needs a complete sentence on both sides; “must sign in …” isn't one." },
      { text: "late —", why: "A dash here still severs the subject from its verb." }
    ]
  },
  {
    id: "commas-4", pattern: "commas",
    passage: "|In 1969, when the first crew landed on the Moon,| millions watched on live television.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "The “when” clause is extra info wrapped in two commas — lift it out and the sentence still stands." },
      { text: "In 1969 when the first crew landed on the Moon", why: "The lift-out clause lost both commas and now crashes into the main sentence." },
      { text: "In 1969, when the first crew landed on the Moon", why: "Opened the wrap but never closed it — one comma is worse than none." },
      { text: "In 1969 when the first crew landed on the Moon,", why: "Closed the wrap but never opened it." }
    ]
  },

  // ---------------- Pronoun clarity & case ----------------
  {
    id: "pronoun-1", pattern: "pronoun",
    passage: "When Jenna handed her sister the keys, |she smiled|.",
    choices: [
      { text: "NO CHANGE", why: "“She” could be Jenna or her sister — the ACT never tolerates a coin-flip pronoun." },
      { text: "her sister smiled", correct: true, why: "Names the actual smiler. Clarity beats brevity when a pronoun is ambiguous." },
      { text: "she grinned", why: "Swapping the verb doesn't fix who “she” is." },
      { text: "they smiled", why: "“They” is even vaguer — now it might be both of them." }
    ]
  },
  {
    id: "pronoun-2", pattern: "pronoun",
    passage: "The committee released |their| final report on Friday.",
    choices: [
      { text: "NO CHANGE", why: "“Committee” is one unit — a collective noun. It takes “its.”" },
      { text: "its", correct: true, why: "One committee, one report: “its final report.”" },
      { text: "it's", why: "“It's” = it is. “Released it is final report” — no." },
      { text: "there", why: "“There” is a place, not a possessive." }
    ]
  },
  {
    id: "pronoun-3", pattern: "pronoun",
    passage: "The manager praised Luis and |I| for the launch.",
    choices: [
      { text: "NO CHANGE", why: "Drop Luis: “praised I”? Never. Objects of a verb take “me.”" },
      { text: "me", correct: true, why: "“Praised me” — the drop-the-other-person test settles it instantly." },
      { text: "myself", why: "“Myself” only works when “I” already did the action (I taught myself)." },
      { text: "he", why: "Subject case in an object slot — same mistake as “I,” different word." }
    ]
  },
  {
    id: "pronoun-4", pattern: "pronoun",
    passage: "Between you and |I|, the new schedule isn't working.",
    choices: [
      { text: "NO CHANGE", why: "“Between” is a preposition — it takes object pronouns: between you and me." },
      { text: "me", correct: true, why: "“Between you and me” — after a preposition, always the object form." },
      { text: "myself", why: "“Myself” needs an “I” doing something to myself earlier in the sentence. There isn't one." },
      { text: "we", why: "“Between you and we” — a subject pronoun in an object slot." }
    ]
  },

  // ---------------- Verb tense & timeline ----------------
  {
    id: "tense-1", pattern: "tense",
    passage: "By the time the storm hit, the crew |secures| the boats.",
    choices: [
      { text: "NO CHANGE", why: "“By the time X happened” signals an action finished even earlier — that's “had” territory." },
      { text: "had secured", correct: true, why: "Past-before-past: the securing finished before the storm hit." },
      { text: "will secure", why: "Future tense inside a past-tense timeline." },
      { text: "secured", why: "Simple past loses the sequence — “by the time” demands the earlier-past “had secured.”" }
    ]
  },
  {
    id: "tense-2", pattern: "tense",
    passage: "Last summer she |interns| at a wildlife clinic.",
    choices: [
      { text: "NO CHANGE", why: "“Last summer” pins this in the past; present tense contradicts it." },
      { text: "interned", correct: true, why: "Past time word, past verb. Done." },
      { text: "has interned", why: "Present perfect is for past actions still echoing now — “last summer” closed that window." },
      { text: "will intern", why: "“Last summer” and “will” point in opposite directions." }
    ]
  },
  {
    id: "tense-3", pattern: "tense",
    passage: "The documentary |premiered| in 2019 and has drawn new fans every year since.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "“Premiered” (finished past event) + “has drawn … since” (still continuing) — the timeline is already right." },
      { text: "premieres", why: "A 2019 event isn't present tense." },
      { text: "had premiered", why: "“Had” needs a later past event to sit before — there isn't one." },
      { text: "has premiered", why: "Present perfect clashes with a specific date — dated events take simple past." }
    ]
  },
  {
    id: "tense-4", pattern: "tense",
    passage: "Every morning he stretches, eats breakfast, and |walked| the dog.",
    choices: [
      { text: "NO CHANGE", why: "The list runs stretches, eats … walked — one verb jumped to the past for no reason." },
      { text: "walks", correct: true, why: "Matches the habit tense of the rest of the list." },
      { text: "walking", why: "Breaks the pattern — the other verbs aren't “-ing.”" },
      { text: "had walked", why: "Past perfect inside a present-habit sentence." }
    ]
  },

  // ---------------- Wordiness & redundancy ----------------
  {
    id: "concise-1", pattern: "concise",
    passage: "The results were |completely and totally unexpected|.",
    choices: [
      { text: "NO CHANGE", why: "“Completely” and “totally” are the same word in different outfits." },
      { text: "unexpected", correct: true, why: "Shortest grammatical option that keeps the meaning — on the ACT, that wins." },
      { text: "totally unexpected in every way", why: "Now the redundancy is triple." },
      { text: "unexpected and surprising", why: "“Unexpected” and “surprising” repeat each other." }
    ]
  },
  {
    id: "concise-2", pattern: "concise",
    passage: "She returned |back| to the trailhead before dark.",
    choices: [
      { text: "NO CHANGE", why: "“Returned” already contains “back” — you can't return forward." },
      { text: "back again", why: "Doubles the redundancy." },
      { text: "backward", why: "Changes the meaning and keeps the clutter." },
      { text: "DELETE the underlined portion.", correct: true, why: "“She returned to the trailhead” says everything. When DELETE is offered, audition it first." }
    ]
  },
  {
    id: "concise-3", pattern: "concise",
    passage: "|The reason the flight was delayed is because of| fog.",
    choices: [
      { text: "NO CHANGE", why: "“The reason … is because” says “because” twice — classic ACT redundancy." },
      { text: "The flight was delayed because of", correct: true, why: "Same meaning, half the words, zero redundancy." },
      { text: "The reason for the flight being delayed is because of", why: "Even more padding on the same double-“because.”" },
      { text: "Due to the fact that there was", why: "“Due to the fact that” is a five-word way to say “because” — wordiness is the whole question." }
    ]
  },
  {
    id: "concise-4", pattern: "concise",
    passage: "The annual fundraiser takes place |each and every year| in June.",
    choices: [
      { text: "NO CHANGE", why: "“Annual” already means every year — the phrase repeats the adjective." },
      { text: "every single year", why: "Still redundant with “annual.”" },
      { text: "yearly", why: "“Annual … yearly” — same repeat, one word." },
      { text: "DELETE the underlined portion.", correct: true, why: "“The annual fundraiser takes place in June.” Nothing lost, clutter gone." }
    ]
  },

  // ---------------- Transition logic ----------------
  {
    id: "transition-1", pattern: "transition",
    passage: "The trail was washed out by spring floods. |For example,| we took the longer ridge route.",
    choices: [
      { text: "NO CHANGE", why: "The second sentence isn't an example of a washout — it's a consequence of one." },
      { text: "Therefore,", correct: true, why: "Washed-out trail → took another route: cause and effect." },
      { text: "Similarly,", why: "Nothing is being compared." },
      { text: "In contrast,", why: "The sentences don't oppose each other." }
    ]
  },
  {
    id: "transition-2", pattern: "transition",
    passage: "He rehearsed the speech for weeks. |However,| he delivered it flawlessly.",
    choices: [
      { text: "NO CHANGE", why: "“However” promises a contrast — but rehearsal leading to a flawless speech is exactly what you'd expect." },
      { text: "As a result,", correct: true, why: "Weeks of rehearsal → flawless delivery: straight cause and effect." },
      { text: "On the other hand,", why: "Same false contrast as “however.”" },
      { text: "Meanwhile,", why: "Nothing is happening at the same time." }
    ]
  },
  {
    id: "transition-3", pattern: "transition",
    passage: "The library is underfunded; |nevertheless,| it runs the best teen program in the county.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "Underfunded yet excellent — a true contrast, which is exactly what “nevertheless” signals." },
      { text: "consequently,", why: "Being underfunded doesn't cause excellence." },
      { text: "for instance,", why: "The program isn't an example of underfunding." },
      { text: "in other words,", why: "The second half doesn't restate the first — it pushes against it." }
    ]
  },
  {
    id: "transition-4", pattern: "transition",
    passage: "Inspectors rated the bridge safe last fall. |Accordingly,| this spring they found deep cracks in two support beams.",
    choices: [
      { text: "NO CHANGE", why: "“Accordingly” means “as you'd expect” — but cracks after a safe rating is the opposite of expected." },
      { text: "However,", correct: true, why: "Safe rating vs. deep cracks: contradiction, so the contrast word wins." },
      { text: "Therefore,", why: "The safe rating didn't cause the cracks." },
      { text: "For example,", why: "Cracks aren't an example of a safe rating." }
    ]
  },

  // ---------------- Misplaced modifiers ----------------
  {
    id: "modifier-1", pattern: "modifier",
    passage: "|Running to catch the bus, my backpack strap snapped.|",
    choices: [
      { text: "NO CHANGE", why: "As written, the backpack strap was the one running for the bus." },
      { text: "Running to catch the bus, I felt my backpack strap snap.", correct: true, why: "The runner (“I”) now sits right after the running phrase — that's the rule." },
      { text: "My backpack strap, running to catch the bus, snapped.", why: "The strap is still mid-sprint, just relocated." },
      { text: "Running to catch the bus, the snapping of my strap happened.", why: "Still no runner next to the phrase — “the snapping” can't run." }
    ]
  },
  {
    id: "modifier-2", pattern: "modifier", fixedOrder: true,
    prompt: "The best placement for the underlined phrase would be:",
    passage: "The bakery sold cinnamon rolls to commuters |dripping with icing|.",
    choices: [
      { text: "where it is now", why: "As placed, the commuters are the ones dripping with icing." },
      { text: "after the word bakery", why: "Now the whole bakery is glazed." },
      { text: "after the word sold", why: "“Sold dripping with icing to …” attaches the phrase to nothing." },
      { text: "after the word rolls", correct: true, why: "“Cinnamon rolls dripping with icing” — the phrase lands next to the thing it describes." }
    ]
  },
  {
    id: "modifier-3", pattern: "modifier",
    passage: "|After reviewing the footage, the penalty was reversed by the referees.|",
    choices: [
      { text: "NO CHANGE", why: "The penalty didn't review any footage — the referees did, and they're nowhere near the phrase." },
      { text: "After reviewing the footage, the referees reversed the penalty.", correct: true, why: "The reviewers now follow the phrase directly — and it's active voice as a bonus." },
      { text: "The penalty, after reviewing the footage, was reversed by the referees.", why: "The penalty is still doing the reviewing." },
      { text: "After the footage, being reviewed, the referees reversed the penalty.", why: "The commas turn it into word salad." }
    ]
  },
  {
    id: "modifier-4", pattern: "modifier", fixedOrder: true,
    prompt: "The best placement for the underlined word would be:",
    passage: "She |almost| ran every day of the month — 27 of 31.",
    choices: [
      { text: "where it is now", why: "“Almost ran” means she never actually ran — but she ran 27 times." },
      { text: "after the word ran", correct: true, why: "“Ran almost every day” — 27 of 31 — is exactly what happened." },
      { text: "after the word day", why: "“Every day almost of the month” doesn't parse." },
      { text: "after the word month", why: "Dangling at the dash, modifying nothing." }
    ]
  },

  // ---------------- Who / whom / that / which ----------------
  {
    id: "whowhom-1", pattern: "whowhom",
    passage: "The volunteer |which| organized the food drive won an award.",
    choices: [
      { text: "NO CHANGE", why: "“Which” is for things. A volunteer is a person: “who.”" },
      { text: "who", correct: true, why: "Person + doing the action (organized) = who." },
      { text: "whom", why: "“Whom” receives action. Test: “HE organized it” — he, so who." },
      { text: "whose", why: "Possessive — nothing here is owned." }
    ]
  },
  {
    id: "whowhom-2", pattern: "whowhom",
    passage: "To |who| should I address the letter?",
    choices: [
      { text: "NO CHANGE", why: "After a preposition (“to”), the pronoun is receiving: whom." },
      { text: "whom", correct: true, why: "Test with him: “address it to HIM” → whom." },
      { text: "whoever", why: "Still subject-case — same problem as “who.”" },
      { text: "who's", why: "“Who's” = who is. “To who is should I …” — no." }
    ]
  },
  {
    id: "whowhom-3", pattern: "whowhom",
    passage: "The last slice goes to |whoever| gets home first.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "“Whoever” is the subject of “gets home” — the whole clause follows “to,” not the pronoun alone." },
      { text: "whomever", why: "Feels formal, but “whomever gets home” puts object-case on a verb's subject." },
      { text: "whom", why: "“To whom gets home first” — broken." },
      { text: "who's", why: "“Who's” = who is; that's not what the sentence needs." }
    ]
  },
  {
    id: "whowhom-4", pattern: "whowhom",
    passage: "The laptop, |that| Mike repaired last week, is already acting up again.",
    choices: [
      { text: "NO CHANGE", why: "“That” never follows a comma — comma-wrapped extra info takes “which.”" },
      { text: "which", correct: true, why: "Nonessential clause between commas: “which” is its pronoun." },
      { text: "who", why: "A laptop isn't a person." },
      { text: "whom", why: "Wrong species and wrong case." }
    ]
  },

  // ---------------- Parallel structure ----------------
  {
    id: "parallel-1", pattern: "parallel",
    passage: "The job involves lifting boxes, stocking shelves, and |to help| customers.",
    choices: [
      { text: "NO CHANGE", why: "The list is wearing -ing: lifting, stocking … “to help” came dressed wrong." },
      { text: "helping", correct: true, why: "Lifting, stocking, helping — same shape, list closed." },
      { text: "helped", why: "Past tense doesn't match the -ing pattern either." },
      { text: "the helping of", why: "Still not parallel — and wordy on top of it." }
    ]
  },
  {
    id: "parallel-2", pattern: "parallel",
    passage: "She is smart, driven, and |has a lot of creativity|.",
    choices: [
      { text: "NO CHANGE", why: "Two adjectives, then a whole verb phrase — the third item broke the pattern." },
      { text: "creative", correct: true, why: "Smart, driven, creative. Three adjectives, one clean list." },
      { text: "with creativity", why: "A prepositional phrase still isn't an adjective." },
      { text: "she is creative", why: "Restarts the sentence in the middle of a list." }
    ]
  },
  {
    id: "parallel-3", pattern: "parallel",
    passage: "The coach told us to hydrate, to stretch, and |that we should sleep| eight hours.",
    choices: [
      { text: "NO CHANGE", why: "“To hydrate, to stretch, that we should sleep” — the third item switched grammar mid-list." },
      { text: "to sleep", correct: true, why: "To hydrate, to stretch, to sleep — matched." },
      { text: "sleeping", why: "-ing doesn't match the “to ___” pattern here." },
      { text: "we should sleep", why: "Still a clause sitting in a list of to-verbs." }
    ]
  },
  {
    id: "parallel-4", pattern: "parallel",
    passage: "You can pay either at the counter |or the app|.",
    choices: [
      { text: "NO CHANGE", why: "“Either at X or Y” — what follows “or” must mirror what follows “either.” “At the counter” vs. “the app” don't match." },
      { text: "or in the app", correct: true, why: "“Either at the counter or in the app” — a preposition phrase on both sides." },
      { text: "or app", why: "Even barer, even less parallel." },
      { text: "or, in the app", why: "Right shape, illegal comma." }
    ]
  },

  // ---------------- Add, delete, or keep? ----------------
  {
    id: "rhetoric-1", pattern: "rhetoric", fixedOrder: true,
    context: "Sea otters wrap themselves in strands of kelp before they sleep so the current doesn't carry them away from the group.",
    prompt: "The writer is considering adding this sentence: “Kelp is a large brown seaweed that grows in dense underwater forests.” Should the writer make this addition?",
    choices: [
      { text: "Yes, because it explains why otters sleep in groups.", why: "The sentence says nothing about otter behavior." },
      { text: "Yes, because it defines a term some readers may not know.", correct: true, why: "The paragraph leans on “kelp”; a one-line definition serves the reader without derailing the point." },
      { text: "No, because it repeats information already in the paragraph.", why: "Nothing earlier defines kelp." },
      { text: "No, because it contradicts the description of the otters.", why: "A definition can't contradict anything here." }
    ]
  },
  {
    id: "rhetoric-2", pattern: "rhetoric", fixedOrder: true,
    context: "The essay argues that community gardens cut families' grocery bills. This paragraph lists average savings per plot and per season.",
    prompt: "The writer is considering deleting this sentence from the paragraph: “My cousin once grew a tomato the size of a softball.” Should it be deleted?",
    choices: [
      { text: "No, because it provides a vivid supporting image.", why: "Vivid isn't the test — loyal-to-the-point is." },
      { text: "No, because it proves gardens can produce large vegetables.", why: "Large vegetables were never the claim." },
      { text: "Yes, because it strays from the paragraph's focus on measurable savings.", correct: true, why: "Fun detail, wrong job — the paragraph is about money, not trophy vegetables." },
      { text: "Yes, because tomatoes are not mentioned elsewhere in the essay.", why: "New details are fine; off-mission details are not. Right verdict, wrong reason — and on the ACT the reason is the answer." }
    ]
  },
  {
    id: "rhetoric-3", pattern: "rhetoric", fixedOrder: true,
    context: "After the storm destroyed the old pier, the town rebuilt it with solar lighting, wider walkways, and railings designed to hold fishing rods.",
    prompt: "Which sentence best concludes the paragraph by returning to its main idea?",
    choices: [
      { text: "The storm formed over unusually warm water in late August.", why: "Rewinds to the storm — the paragraph has moved on." },
      { text: "Solar panels convert sunlight directly into electricity.", why: "A science aside, not a conclusion." },
      { text: "Some residents still prefer the beach in winter.", why: "A brand-new topic in the final sentence." },
      { text: "The rebuilt pier now draws more evening visitors than the original ever did.", correct: true, why: "Lands the paragraph's actual story: the rebuild worked." }
    ]
  },
  {
    id: "rhetoric-4", pattern: "rhetoric", fixedOrder: true,
    context: "The writer wants to show that the library's teen program grew quickly in its first year.",
    prompt: "Which choice most effectively accomplishes the writer's goal?",
    choices: [
      { text: "The program meets in the recently renovated west wing.", why: "Location says nothing about growth." },
      { text: "Attendance tripled in nine months, from 40 teens to over 120.", correct: true, why: "Numbers showing speed and size of growth — exactly the stated goal." },
      { text: "The librarian who runs it holds two degrees.", why: "Credentials aren't growth." },
      { text: "Many towns now run similar programs.", why: "Other towns' programs don't show this one grew." }
    ]
  }
];

// ============================================================
// MATH — the ACT math section recycles a small set of moves.
// Numeric choices are listed ascending (like the real test) with
// fixedOrder: true; expression choices shuffle like English ones.
// ============================================================

Object.assign(ACT_PATTERNS, {
  m_asked: {
    subject: "Math",
    name: "Answer the actual question",
    rule: "The #1 math trap isn't hard math — it's solving for x and picking it when they asked for 4x or n−5. The number you'd get from stopping early is ALWAYS sitting in the choices.",
    cue: "Circle what they actually ask for. After solving, reread the question's last line before touching an answer.",
    example: "If 3x + 5 = 20, what is 6x? x = 5, but the answer is 30 — and 5 will be there as a trap."
  },
  m_backsolve: {
    subject: "Math",
    name: "Backsolve from the choices",
    rule: "The answers are printed on the page — that's a gift. Plug choices into the problem until one works. Start in the middle: too big means go smaller.",
    cue: "'What is x / how many / what number' with plain numbers as choices? Audition the choices instead of doing algebra.",
    example: "√(x+7) = 5 → don't solve, test: try 18 → √25 = 5. Done."
  },
  m_plugin: {
    subject: "Math",
    name: "Plug in easy numbers",
    rule: "When the answer choices contain variables, invent easy numbers (2, 3, 10, 100), run the problem with them, and see which choice matches. It turns algebra into arithmetic.",
    cue: "Variables in the ANSWER choices — or the words 'in terms of' — means stop doing algebra and start plugging in.",
    example: "Discount problems 'in terms of d'? Let d = $100 and just compute."
  },
  m_translate: {
    subject: "Math",
    name: "Words → math",
    rule: "Word problems are translation: 'of' = multiply, 'per' = divide, 'is' = equals, and 'less than' FLIPS the order (5 less than x is x−5, not 5−x).",
    cue: "Underline the math words and convert phrase by phrase before computing. The flip-traps ('less than,' 'fewer than') are where the wrong answers live.",
    example: "'7 less than twice a number' → 2n − 7. The trap choice will be 7 − 2n."
  },
  m_lines: {
    subject: "Math",
    name: "Slope & lines",
    rule: "Slope = rise/run = (y₂−y₁)/(x₂−x₁). In y = mx + b, m is slope and b is the y-intercept. Parallel = same slope; perpendicular = negative reciprocal.",
    cue: "Two points, 'parallel,' 'perpendicular,' or y = mx + b anywhere in the question — it's the slope formula wearing a costume.",
    example: "Through (1,2) and (3,8): slope = (8−2)/(3−1) = 3."
  },
  m_geometry: {
    subject: "Math",
    name: "Geometry staples",
    rule: "Five formulas cover most ACT geometry: rectangle A = lw, triangle A = ½bh, circle A = πr² and C = 2πr, Pythagorean a² + b² = c².",
    cue: "Circle problem? FIRST ask: did they give the radius or the DIAMETER? Half the wrong answers come from mixing those up.",
    example: "Diameter 10 → r = 5 → area 25π, not 100π."
  },
  m_ratio: {
    subject: "Math",
    name: "Ratios & percents",
    rule: "Set proportions up as fractions and cross-multiply. Percent change = change ÷ ORIGINAL. Percents of different bases never add or cancel.",
    cue: "Before computing any percent, ask: percent of WHAT? The base is everything.",
    example: "Price 50→40 is a 20% drop; climbing back 40→50 is a 25% rise. Not symmetric."
  },
  m_average: {
    subject: "Math",
    name: "Averages & data",
    rule: "Average × count = total. Most average problems are secretly TOTAL problems — convert to totals, work there, divide once at the end. Median = middle AFTER sorting.",
    cue: "The word 'average' should make you immediately write total = avg × n. And never read a median off an unsorted list.",
    example: "Avg of 4 tests is 80 → total 320. Want avg 82 over 5 → total 410 → fifth test 90."
  }
});

ACT_QUESTIONS.push(
  // ---------------- Answer the actual question ----------------
  {
    id: "m_asked-1", pattern: "m_asked", fixedOrder: true,
    passage: "If 2x + 7 = 19, what is the value of 4x?",
    decode: "They give an equation to find x — but ask for 4x. Solve for x, then keep going one more step.",
    steps: [
      { do: "Read what they want: 4x — not x. Underline it.", why: "The whole trap is answering for x. Know the real target first." },
      { do: "Solve for x: 2x + 7 = 19 → subtract 7 → 2x = 12 → divide by 2 → x = 6.", why: "Peel off the +7, then the ×2 — undo it in reverse order." },
      { do: "Finish the real question: 4x = 4 × 6 = 24.", why: "Don't stop at x. They asked for 4x — one more step." }
    ],
    choices: [
      { text: "6", why: "That's x. They asked for 4x — the classic stop-early trap." },
      { text: "12", why: "That's 2x, the left side of your last step." },
      { text: "24", correct: true, why: "2x = 12 → x = 6 → 4x = 24. Reread the ask before answering." },
      { text: "48", why: "That's 8x — doubled one time too many." }
    ]
  },
  {
    id: "m_asked-2", pattern: "m_asked", fixedOrder: true,
    passage: "If 5(n − 3) = 40, what is n − 5?",
    choices: [
      { text: "3", why: "That's 8 − 5 — the 8 belongs to n − 3, not to n." },
      { text: "6", correct: true, why: "n − 3 = 8 → n = 11 → n − 5 = 6." },
      { text: "8", why: "That's n − 3, the intermediate step." },
      { text: "11", why: "That's n itself. They asked for n − 5." }
    ]
  },
  {
    id: "m_asked-3", pattern: "m_asked", fixedOrder: true,
    passage: "The perimeter of a square is 36. What is its area?",
    choices: [
      { text: "9", why: "That's the side length. They asked for area." },
      { text: "36", why: "That's the perimeter, recycled." },
      { text: "81", correct: true, why: "Perimeter 36 → side 9 → area 9² = 81." },
      { text: "324", why: "That's 18² — half the perimeter isn't the side; a quarter is." }
    ]
  },
  {
    id: "m_asked-4", pattern: "m_asked", fixedOrder: true,
    passage: "If y = 3x and x + y = 24, what is y?",
    choices: [
      { text: "6", why: "That's x. They asked for y." },
      { text: "8", why: "24 ÷ 3 — but x + 3x makes FOUR shares, not three." },
      { text: "18", correct: true, why: "x + 3x = 24 → x = 6 → y = 18." },
      { text: "24", why: "That's x + y, the total." }
    ]
  },

  // ---------------- Backsolve ----------------
  {
    id: "m_backsolve-1", pattern: "m_backsolve", fixedOrder: true,
    passage: "Which value of x satisfies √(x + 7) = 5 ?",
    decode: "The answers are plain numbers, so you can test them. Which x makes the square root come out to exactly 5?",
    choices: [
      { text: "−2", why: "Plug it in: √(−2 + 7) = √5 ≈ 2.2. Not 5." },
      { text: "2", why: "√9 = 3. Close, not 5." },
      { text: "18", correct: true, why: "√(18 + 7) = √25 = 5. Plugging in beats algebra here." },
      { text: "25", why: "Tempting because 25 = 5², but the +7 happens first: √32 ≈ 5.7." }
    ]
  },
  {
    id: "m_backsolve-2", pattern: "m_backsolve", fixedOrder: true,
    passage: "Marco has $3 more than twice what Jen has. Together they have $45. How much does Jen have?",
    choices: [
      { text: "$14", correct: true, why: "Jen 14 → Marco 2(14) + 3 = 31 → 14 + 31 = 45. ✓" },
      { text: "$17", why: "Test it: 17 + 37 = 54, not 45." },
      { text: "$21", why: "(45 − 3) ÷ 2 — but Marco holds TWO of Jen's shares plus 3, so it's three shares." },
      { text: "$31", why: "That's Marco's money — right system, wrong person." }
    ]
  },
  {
    id: "m_backsolve-3", pattern: "m_backsolve", fixedOrder: true,
    passage: "The product of two consecutive positive even integers is 48. What is the smaller one?",
    choices: [
      { text: "4", why: "4 × 6 = 24 — too small." },
      { text: "6", correct: true, why: "6 × 8 = 48, and 6 is the smaller. Testing choices takes seconds." },
      { text: "8", why: "That's the larger of the pair." },
      { text: "12", why: "12 × 4 = 48, but 4 and 12 aren't consecutive evens." }
    ]
  },
  {
    id: "m_backsolve-4", pattern: "m_backsolve", fixedOrder: true,
    passage: "A number n is doubled, then increased by 5, giving 33. What is n?",
    choices: [
      { text: "12", why: "Check: 2(12) + 5 = 29. Backsolving catches it instantly." },
      { text: "14", correct: true, why: "2(14) + 5 = 33. ✓" },
      { text: "19", why: "(33 + 5) ÷ 2 — added while undoing instead of subtracting." },
      { text: "28", why: "That's 2n — stopped one step early." }
    ]
  },

  // ---------------- Plug in easy numbers ----------------
  {
    id: "m_plugin-1", pattern: "m_plugin",
    passage: "If x is an even integer, which of the following must be odd?",
    decode: "The choices are expressions, not numbers. Pick an easy even value for x, run each one, and see which comes out odd.",
    choices: [
      { text: "3x", why: "Try x = 2 → 6. An even number times anything stays even." },
      { text: "x²", why: "2² = 4 — even squared is even." },
      { text: "2x + 2", why: "Both pieces are even, so the sum always is." },
      { text: "x + 5", correct: true, why: "Even + odd = odd, every time. Test x = 2 → 7." }
    ]
  },
  {
    id: "m_plugin-2", pattern: "m_plugin",
    passage: "A jacket costs d dollars. It is discounted 25%, and the sale price is then taxed 10%. Which expression gives the final cost?",
    choices: [
      { text: "0.675d", why: "That's 0.75 × 0.90 — you took the tax OFF instead of adding it." },
      { text: "0.75d", why: "That's the sale price with no tax — read to the end." },
      { text: "0.825d", correct: true, why: "0.75d × 1.10 = 0.825d. Let d = $100: $75, then +10% → $82.50." },
      { text: "0.85d", why: "Merging −25% and +10% into a flat −15% — percents of different bases never just add." }
    ]
  },
  {
    id: "m_plugin-3", pattern: "m_plugin",
    passage: "If m = 2n + 1, what is 4n in terms of m?",
    choices: [
      { text: "(m − 1)/2", why: "That's n itself, not 4n." },
      { text: "2m − 2", correct: true, why: "n = (m−1)/2, so 4n = 2(m−1) = 2m − 2. Test n = 3, m = 7: 4n = 12 = 2(7) − 2. ✓" },
      { text: "2m − 1", why: "Off by the −2: multiplying by 4 doubles the −1 too." },
      { text: "2m + 2", why: "Sign slip on the −1." }
    ]
  },
  {
    id: "m_plugin-4", pattern: "m_plugin",
    passage: "The average of five consecutive integers is k. What is the largest of the five in terms of k?",
    choices: [
      { text: "k + 2", correct: true, why: "Try 3, 4, 5, 6, 7: average 5, largest 7 = 5 + 2. The average IS the middle number." },
      { text: "k + 4", why: "That's if k were the SMALLEST — but the average sits in the middle." },
      { text: "k + 5", why: "Five integers means the largest sits 2 above the middle, not 5." },
      { text: "5k", why: "Average × count is the SUM, not the largest." }
    ]
  },

  // ---------------- Words → math ----------------
  {
    id: "m_translate-1", pattern: "m_translate",
    passage: "Which expression represents \"4 less than three times a number n\"?",
    decode: "Turn the words into symbols piece by piece — and watch the order: 'less than' flips it.",
    choices: [
      { text: "3(n − 4)", why: "That's 'three times the quantity n minus 4' — parentheses change everything." },
      { text: "3n − 4", correct: true, why: "'4 less than' means subtract 4 AFTER tripling." },
      { text: "4 − 3n", why: "The flip trap — 'less than' reverses the order." },
      { text: "4n − 3", why: "The numbers swapped jobs." }
    ]
  },
  {
    id: "m_translate-2", pattern: "m_translate",
    passage: "Tickets cost $8 for adults and $5 for kids. A family buys a adult tickets and k kid tickets for $47 total. Which equation represents this?",
    choices: [
      { text: "a + k = 47", why: "That counts people; $47 counts dollars." },
      { text: "5a + 8k = 47", why: "Prices swapped — adults are the $8 tickets." },
      { text: "8a + 5k = 47", correct: true, why: "$8 each for a adults, $5 each for k kids, totaling 47." },
      { text: "13(a + k) = 47", why: "Only works if every adult brings exactly one kid." }
    ]
  },
  {
    id: "m_translate-3", pattern: "m_translate",
    passage: "A car travels m miles in h hours. What is its speed in miles per hour?",
    choices: [
      { text: "m/h", correct: true, why: "'Miles per hour' = miles ÷ hours. 'Per' means divide by what follows it." },
      { text: "h/m", why: "That's hours per mile — upside down." },
      { text: "mh", why: "Multiplying gives 'mile-hours,' which is nothing." },
      { text: "m − h", why: "Subtracting different units means nothing here." }
    ]
  },
  {
    id: "m_translate-4", pattern: "m_translate",
    passage: "Which expression represents \"a number n increased by 20% of itself\"?",
    choices: [
      { text: "1.2n", correct: true, why: "n + 0.2n = 1.2n." },
      { text: "0.2n", why: "That's only the increase — they asked for the number AFTER increasing." },
      { text: "n + 20", why: "20 percent, not 20 units." },
      { text: "1.02n", why: "That's a 2% increase — decimal slip." }
    ]
  },

  // ---------------- Slope & lines ----------------
  {
    id: "m_lines-1", pattern: "m_lines", fixedOrder: true,
    passage: "What is the slope of the line through (2, 5) and (6, 13)?",
    formula: { key: "Slope", expr: "m = (y₂ − y₁) / (x₂ − x₁)", data: "(13 − 5) / (6 − 2) = 8 / 4", answer: "2" },
    plot: { points: [[2, 5, "A"], [6, 13, "B"]], segment: [0, 1], slope: [0, 1] },
    choices: [
      { text: "1/2", why: "Run over rise — flipped." },
      { text: "2", correct: true, why: "(13 − 5)/(6 − 2) = 8/4 = 2." },
      { text: "4", why: "That's just the run." },
      { text: "8", why: "That's just the rise." }
    ]
  },
  {
    id: "m_lines-2", pattern: "m_lines",
    passage: "Which line is parallel to y = 3x − 7?",
    formula: { key: "Parallel lines", expr: "parallel lines have the SAME slope m", data: "y = 3x − 7 has slope 3", answer: "any line with slope 3" },
    plot: { line: { m: 3, b: 2 } },
    choices: [
      { text: "y = 3x + 2", correct: true, why: "Parallel = same slope. Both are slope 3; the intercept doesn't matter." },
      { text: "y = −3x − 7", why: "Opposite slopes cross — matching the −7 doesn't help." },
      { text: "y = −(1/3)x + 1", why: "That's the PERPENDICULAR slope." },
      { text: "y = 7x − 3", why: "The numbers swapped seats; slope 7 ≠ slope 3." }
    ]
  },
  {
    id: "m_lines-3", pattern: "m_lines", fixedOrder: true,
    passage: "What is the y-intercept of the line 2y = 6x + 10?",
    formula: { key: "Slope-intercept form", expr: "y = mx + b  (b is where the line crosses the y-axis)", data: "2y = 6x + 10  →  y = 3x + 5", answer: "b = 5,  the point (0, 5)" },
    plot: { line: { m: 3, b: 5 }, answer: [0, 5, "y-int"] },
    choices: [
      { text: "3", why: "That's the slope, after dividing." },
      { text: "5", correct: true, why: "Divide everything by 2: y = 3x + 5. Intercept 5." },
      { text: "6", why: "The x-coefficient before dividing." },
      { text: "10", why: "Forgot to divide by 2." }
    ]
  },
  {
    id: "m_lines-4", pattern: "m_lines",
    passage: "A line with slope −2 passes through (3, 4). Which point is also on the line?",
    formula: { key: "Slope as rise over run", expr: "slope −2 = down 2 for every 1 right", data: "from (3, 4): right 1, down 2", answer: "(4, 2)" },
    plot: { points: [[3, 4, "start"]], line: { m: -2, b: 10 }, answer: [4, 2, "✓"] },
    choices: [
      { text: "(4, 2)", correct: true, why: "From (3, 4): right 1, down 2 — that's slope −2. ✓" },
      { text: "(4, 6)", why: "Right 1, UP 2 — that's slope +2." },
      { text: "(5, 3)", why: "That drop works out to slope −1/2 — the reciprocal trap." },
      { text: "(3, 2)", why: "Same x-value — straight down is vertical, not slope −2." }
    ]
  },

  // ---------------- Geometry staples ----------------
  {
    id: "m_geometry-1", pattern: "m_geometry", fixedOrder: true,
    passage: "A circle has diameter 12. What is its area?",
    formula: { key: "Circle area", expr: "A = πr²  (halve the diameter to get r first)", data: "d = 12 → r = 6 → π · 6²", answer: "36π" },
    diagram: { type: "circle", rLabel: "r = 6", dLabel: "d = 12", note: "A = πr² = 36π" },
    choices: [
      { text: "12π", why: "That's the circumference (πd), not the area." },
      { text: "24π", why: "That's 2πr with the diameter plugged in as r." },
      { text: "36π", correct: true, why: "Diameter 12 → radius 6 → area π(6²) = 36π." },
      { text: "144π", why: "Used the diameter as the radius — trap #1 on every circle question." }
    ]
  },
  {
    id: "m_geometry-2", pattern: "m_geometry", fixedOrder: true,
    passage: "A right triangle has legs of length 9 and 12. How long is the hypotenuse?",
    decode: "You're given the two legs of a right triangle. They want the longest side — the hypotenuse across from the right angle.",
    formula: { key: "Pythagorean theorem", expr: "a² + b² = c²", data: "9² + 12² = 81 + 144 = 225", answer: "c = √225 = 15" },
    diagram: { type: "rightTriangle", a: 9, b: 12, c: 15, aLabel: "9", bLabel: "12", cLabel: "c = 15", note: "9² + 12² = 15²" },
    choices: [
      { text: "√63", why: "Subtracted the squares — that finds a LEG when you already have the hypotenuse." },
      { text: "15", correct: true, why: "9² + 12² = 81 + 144 = 225 = 15²." },
      { text: "21", why: "Just added the legs — the hypotenuse is always shorter than that." },
      { text: "108", why: "9 × 12 — that's an area move, wrong formula." }
    ]
  },
  {
    id: "m_geometry-3", pattern: "m_geometry", fixedOrder: true,
    passage: "A rectangle has length 8 and perimeter 28. What is its area?",
    steps: [
      { do: "Write the perimeter rule: P = 2(l + w). Fill in what you know: 28 = 2(8 + w).", why: "Start from the rule that links what you have (perimeter, length) to what you need." },
      { do: "Divide both sides by 2: 14 = 8 + w. Then subtract 8: w = 6.", why: "Undo the ×2, then the +8, to get the width by itself." },
      { do: "Now the area: A = l × w = 8 × 6 = 48.", why: "They asked for area, not width — one more step with the width you just found." }
    ],
    formula: { key: "Rectangle", expr: "P = 2(l + w)   and   A = l · w", data: "28 = 2(8 + w) → w = 6", answer: "A = 8 · 6 = 48" },
    diagram: { type: "rectangle", w: 8, h: 6, wLabel: "l = 8", hLabel: "w = 6", area: "A = 48", note: "perimeter 28 → width 6" },
    choices: [
      { text: "28", why: "That's the perimeter they handed you." },
      { text: "48", correct: true, why: "2(8 + w) = 28 → w = 6 → area 8 × 6 = 48." },
      { text: "80", why: "Width 10 comes from subtracting only ONE length — there are two." },
      { text: "112", why: "8 × 14 — half the perimeter isn't the width." }
    ]
  },
  {
    id: "m_geometry-4", pattern: "m_geometry", fixedOrder: true,
    passage: "A triangle has base 10 and height 7. What is its area?",
    formula: { key: "Triangle area", expr: "A = ½ · base · height", data: "½ · 10 · 7", answer: "35" },
    diagram: { type: "rightTriangle", a: 10, b: 7, c: "", aLabel: "base 10", bLabel: "height 7", cLabel: "", note: "A = ½ · 10 · 7 = 35" },
    choices: [
      { text: "17", why: "Added base and height — area multiplies." },
      { text: "24.5", why: "½ × 7 × 7 — the height got used twice." },
      { text: "35", correct: true, why: "½ × 10 × 7 = 35." },
      { text: "70", why: "Forgot the ½ — that's the full rectangle." }
    ]
  },

  // ---------------- Ratios & percents ----------------
  {
    id: "m_ratio-1", pattern: "m_ratio", fixedOrder: true,
    passage: "A recipe uses 3 cups of flour for every 2 cups of sugar. How much flour goes with 8 cups of sugar?",
    formula: { key: "Proportion", expr: "set equal fractions, cross-multiply", data: "3/2 = x/8 → x = (3·8)/2", answer: "12 cups" },
    diagram: { type: "barModel", segments: [{ v: 3, label: "flour 3" }, { v: 2, label: "sugar 2" }], caption: "sugar ×4 (2→8), so flour ×4 (3→12)" },
    choices: [
      { text: "5⅓ cups", why: "Proportion set upside down." },
      { text: "9 cups", why: "Added 6 to both parts — ratios scale by multiplying, never adding." },
      { text: "12 cups", correct: true, why: "3/2 = x/8 → x = 12. Four times the sugar, four times the flour." },
      { text: "24 cups", why: "Multiplied by 8 instead of by 4." }
    ]
  },
  {
    id: "m_ratio-2", pattern: "m_ratio", fixedOrder: true,
    passage: "A $60 jacket is marked down 30%. What is the sale price?",
    decode: "A price and a percent off. They want what you actually PAY — not the size of the discount.",
    steps: [
      { do: "You KEEP 100% − 30% = 70% of the price.", why: "'Off' means you pay the rest — flip the discount to what stays." },
      { do: "Take 70% of 60: 0.70 × 60 = 42.", why: "'Of' means multiply, and 70% is 0.70." },
      { do: "Sale price = $42.", why: "That's what you hand over at the register — the actual question." }
    ],
    formula: { key: "Percent off", expr: "you PAY (100% − discount) of the price", data: "70% of $60 = 0.70 × 60", answer: "$42" },
    diagram: { type: "barModel", segments: [{ v: 70, label: "pay 70% = $42", color: "#3987e5" }, { v: 30, label: "−30% = $18", color: "#fab219" }], caption: "$60 whole → you keep 70%" },
    choices: [
      { text: "$18", why: "That's the DISCOUNT — they asked what you pay." },
      { text: "$30", why: "Subtracted the percent number itself, not 30% of 60." },
      { text: "$42", correct: true, why: "30% of 60 is 18; 60 − 18 = 42." },
      { text: "$78", why: "Added the discount instead." }
    ]
  },
  {
    id: "m_ratio-3", pattern: "m_ratio", fixedOrder: true,
    passage: "A town's population grows from 250 to 300. What is the percent increase?",
    formula: { key: "Percent change", expr: "change ÷ ORIGINAL", data: "50 ÷ 250", answer: "20%" },
    diagram: { type: "barModel", segments: [{ v: 250, label: "original 250", color: "#3987e5" }, { v: 50, label: "+50", color: "#fab219" }], caption: "the +50 is 20% of the original 250" },
    choices: [
      { text: "16.7%", why: "50/300 — divided by the NEW value. The base is always the original." },
      { text: "20%", correct: true, why: "Change 50 ÷ original 250 = 20%." },
      { text: "50%", why: "That's the raw change in people, not a percent." },
      { text: "83.3%", why: "That's the old population as a percent of the new — inverted." }
    ]
  },
  {
    id: "m_ratio-4", pattern: "m_ratio", fixedOrder: true,
    passage: "In a class of 32 students, the ratio of girls to boys is 5:3. How many girls are there?",
    formula: { key: "Ratio parts", expr: "add the parts, divide the total, then scale", data: "5+3 = 8 parts → 32 ÷ 8 = 4 per part", answer: "girls = 5 × 4 = 20" },
    diagram: { type: "barModel", segments: [{ v: 5, label: "girls 5" }, { v: 3, label: "boys 3" }], caption: "8 parts share 32 → 4 each → 20 girls, 12 boys" },
    choices: [
      { text: "5", why: "Ratio numbers aren't head counts until you scale them." },
      { text: "12", why: "That's the boys." },
      { text: "20", correct: true, why: "5 + 3 = 8 shares → 32 ÷ 8 = 4 per share → girls 5 × 4 = 20." },
      { text: "27", why: "32 − 5: ratios aren't subtraction." }
    ]
  },

  // ---------------- Averages & data ----------------
  {
    id: "m_average-1", pattern: "m_average", fixedOrder: true,
    passage: "Sam's first four test scores average 85. What must he score on the fifth test to raise his average to 87?",
    steps: [
      { do: "Turn the goal into a total: 5 tests averaging 87 need a total of 87 × 5 = 435.", why: "total = average × count. Totals are far easier to work with than averages." },
      { do: "Total he has so far: 4 tests averaging 85 = 85 × 4 = 340.", why: "Same rule, for the tests already taken." },
      { do: "The 5th test fills the gap: 435 − 340 = 95.", why: "Whatever's missing from the total he needs is exactly the score required." }
    ],
    formula: { key: "Averages via totals", expr: "total = avg × count", data: "need 5×87 = 435; have 4×85 = 340", answer: "435 − 340 = 95" },
    choices: [
      { text: "85", why: "His current average — matching it moves nothing." },
      { text: "87", why: "Scoring the target average won't PULL the average up to it." },
      { text: "89", why: "The +2 must cover all five tests: 2 × 5 = 10 extra points, not 4." },
      { text: "95", correct: true, why: "Needs 5 × 87 = 435 total; has 4 × 85 = 340; 435 − 340 = 95." }
    ]
  },
  {
    id: "m_average-2", pattern: "m_average", fixedOrder: true,
    passage: "What is the median of 3, 9, 4, 12, 8?",
    formula: { key: "Median", expr: "SORT the list first, then take the middle", data: "3, 4, [8], 9, 12", answer: "8" },
    diagram: { type: "numberLine", min: 2, max: 13, points: [{ x: 3 }, { x: 4 }, { x: 8, label: "median", color: "#fab219" }, { x: 9 }, { x: 12 }], caption: "sorted — the middle value is the median" },
    choices: [
      { text: "4", why: "That's the middle of the list as written — sort first." },
      { text: "7.2", why: "That's the MEAN. Median is the middle after sorting." },
      { text: "8", correct: true, why: "Sorted: 3, 4, 8, 9, 12 — the middle is 8." },
      { text: "9", why: "One spot off after sorting." }
    ]
  },
  {
    id: "m_average-3", pattern: "m_average", fixedOrder: true,
    passage: "The average of x and y is 14. The average of x, y, and z is 12. What is z?",
    formula: { key: "Work in totals", expr: "total = avg × count", data: "x+y = 2×14 = 28;  x+y+z = 3×12 = 36", answer: "z = 36 − 28 = 8" },
    choices: [
      { text: "2", why: "14 − 12 — averages don't subtract like that. Work in totals." },
      { text: "8", correct: true, why: "x + y = 2 × 14 = 28. x + y + z = 3 × 12 = 36. z = 8." },
      { text: "12", why: "That's the new average, not the new number." },
      { text: "13", why: "Averaged the averages — that's never how totals work." }
    ]
  },
  {
    id: "m_average-4", pattern: "m_average", fixedOrder: true,
    passage: "A store averages $200 in daily sales Monday–Friday and $340 on each weekend day. What is the average daily sales for the whole week?",
    formula: { key: "Weighted average", expr: "grand total ÷ total count (weekdays happen 5×)", data: "(5×200 + 2×340) ÷ 7 = 1680 ÷ 7", answer: "$240" },
    choices: [
      { text: "$240", correct: true, why: "(5 × 200 + 2 × 340) ÷ 7 = 1680 ÷ 7 = 240." },
      { text: "$270", why: "(200 + 340) ÷ 2 — the flat average ignores that weekdays happen five times." },
      { text: "$300", why: "Weights flipped: 2 weekday-days and 5 weekend-days." },
      { text: "$1680", why: "That's the weekly TOTAL — one step from done." }
    ]
  }
);

// ============================================================
// READING — mini-passages that train question-type recognition.
// (Full-passage stamina comes from the official PDFs in the
// Real practice tab; this trains the 4 question types.)
// ============================================================

Object.assign(ACT_PATTERNS, {
  r_mainidea: {
    subject: "Reading",
    name: "Main idea vs. detail",
    rule: "A main-idea answer covers the WHOLE passage; a detail answer is true but too small. Wrong answers here are usually real details promoted above their pay grade.",
    cue: "Ask of each choice: does this cover everything, or just one sentence I can point at?",
    example: "Passage about beavers reshaping rivers → 'beavers have sharp teeth' is true, small, and wrong."
  },
  r_inference: {
    subject: "Reading",
    name: "Inference — supported vs. too far",
    rule: "A right inference is ONE small step from the text. Wrong answers take two steps — adding opinions, predictions, or extremes ('always,' 'never,' 'only') the passage never earns.",
    cue: "Could you defend the choice by pointing at a specific line? If it needs a second assumption, it's out.",
    example: "Text: 'attendance doubled after the renovation.' Supported: growth followed the renovation. Too far: the renovation was the ONLY cause."
  },
  r_vocab: {
    subject: "Reading",
    name: "Vocab in context",
    rule: "The tested word always has a familiar meaning that's WRONG in this sentence. Cover the word, read the sentence, and pick what fits the blank — not the dictionary's first definition.",
    cue: "The most familiar meaning of the word is the trap. Substitute each choice into the sentence and reread.",
    example: "'The evidence was plain' → clear, obvious — not unattractive."
  },
  r_function: {
    subject: "Reading",
    name: "Why is this sentence here?",
    rule: "Function questions ask what a sentence DOES, not what it says: introduce, contrast, concede, illustrate, conclude. Name the job in your own words before reading the choices.",
    cue: "Reread the sentence BEFORE and AFTER the quoted line — its job is defined by its neighbors.",
    example: "A statistic right after a bold claim is there to SUPPORT the claim."
  }
});

ACT_QUESTIONS.push(
  // ---------------- Main idea vs. detail ----------------
  {
    id: "r_mainidea-1", pattern: "r_mainidea",
    context: "For decades, city planners treated rain as a problem to be piped away as fast as possible: streets were crowned, gutters widened, storm drains enlarged. Today many of those same cities are ripping up pavement to let rain soak in where it falls, feeding underground aquifers instead of overwhelmed rivers. The hard lesson: water you rush away in spring is water you don't have in August.",
    decode: "They want the WHOLE passage's job in one sentence — not a true detail that only covers one line.",
    prompt: "The main purpose of the passage is to:",
    choices: [
      { text: "describe a shift in how cities manage rainwater.", correct: true, why: "Covers the whole arc: old approach → new approach → why." },
      { text: "explain how storm drains are engineered.", why: "One clause of one sentence — a detail promoted above its pay grade." },
      { text: "argue that aquifers are less important than rivers.", why: "The passage implies the opposite, and argues no ranking." },
      { text: "list the causes of summer droughts.", why: "August is mentioned once, as a consequence — not a catalog of causes." }
    ]
  },
  {
    id: "r_mainidea-2", pattern: "r_mainidea",
    context: "The violin's varnish was long rumored to be Stradivari's secret ingredient. Modern spectroscopy tells a duller story: the varnish is ordinary, chemically speaking. The extraordinary part is the wood — spruce grown during a stretch of unusually cold decades, its rings packed tight as pages in a closed book.",
    prompt: "The main idea of the passage is that:",
    choices: [
      { text: "analysis suggests the wood, not the varnish, explains the violins' quality.", correct: true, why: "That's the passage's whole turn: rumor debunked, real cause named." },
      { text: "Stradivari's varnish was chemically unusual.", why: "Directly contradicted — the varnish is 'ordinary.'" },
      { text: "spectroscopy is an unreliable tool.", why: "The passage treats its results as trustworthy." },
      { text: "cold weather damages spruce trees.", why: "The cold made the wood tighter — a benefit here, and a detail anyway." }
    ]
  },
  {
    id: "r_mainidea-3", pattern: "r_mainidea",
    context: "Hummingbirds remember every flower they visit and how long each takes to refill with nectar. Researchers tracking rufous hummingbirds found the birds returning to individual blossoms on schedules matched to refill rates — a mental map of thousands of moving targets, maintained by a brain lighter than a paper clip.",
    prompt: "Which choice best states the main idea?",
    choices: [
      { text: "Hummingbirds manage remarkably precise memories despite tiny brains.", correct: true, why: "Wraps both halves: the memory feat and the paper-clip brain." },
      { text: "Rufous hummingbirds migrate long distances.", why: "Never mentioned — imported from outside the passage." },
      { text: "Flowers refill with nectar at different rates.", why: "True and in the text, but it's the supporting detail, not the point." },
      { text: "Researchers find hummingbirds difficult to track.", why: "The passage says they DID track them — no difficulty claimed." }
    ]
  },
  {
    id: "r_mainidea-4", pattern: "r_mainidea",
    context: "The first bicycles terrified horses, scandalized editors, and delighted exactly one group: women, for whom the machine meant unchaperoned distance. Susan B. Anthony credited the bicycle with doing more to emancipate women than anything else in the world. Cheap, unsupervised mobility — and that made it political.",
    prompt: "The main point of the passage is that:",
    choices: [
      { text: "the bicycle's social impact reached far beyond transportation.", correct: true, why: "Every sentence feeds this: freedom, emancipation, politics." },
      { text: "early bicycles were dangerous to ride.", why: "Terrified horses ≠ endangered riders — and it's one clause regardless." },
      { text: "newspaper editors opposed most new inventions.", why: "One reaction from one group, stretched into a universal claim." },
      { text: "Susan B. Anthony was a famous cyclist.", why: "She's quoted about the bicycle; nothing says she rode one." }
    ]
  },

  // ---------------- Inference ----------------
  {
    id: "r_inference-1", pattern: "r_inference",
    context: "Lena checked the tide chart twice, then packed the kayak anyway. Her brother had called the crossing 'a beginner's mistake waiting to happen.' She left his text unanswered on the counter, next to the spare key he'd never asked to return.",
    prompt: "It can most reasonably be inferred that:",
    choices: [
      { text: "Lena is aware the trip carries risk.", correct: true, why: "One step from the text: she checked the chart twice and heard the warning." },
      { text: "Lena's brother has never kayaked.", why: "Nothing supports it — his opinion doesn't reveal his experience." },
      { text: "the crossing has caused accidents before.", why: "'Waiting to happen' is his prediction, not a history." },
      { text: "Lena is angry that the key was never returned.", why: "The key just sits there in the scene — the anger is imported." }
    ]
  },
  {
    id: "r_inference-2", pattern: "r_inference",
    context: "The bakery's ovens predate the neighborhood's name. Four owners have kept the starter alive, feeding it through blackouts, blizzards, and one small kitchen fire that the fire department still brings up at holiday parties.",
    prompt: "The passage most strongly supports which conclusion?",
    choices: [
      { text: "The bakery has operated for a long time.", correct: true, why: "Ovens older than the neighborhood, four owners — one small step." },
      { text: "The current owner caused the kitchen fire.", why: "No owner is tied to the fire at all." },
      { text: "The starter has been replaced several times.", why: "Contradicted — 'kept the starter alive' is the whole point." },
      { text: "The fire department resents the bakery.", why: "Teasing at holiday parties suggests affection, not resentment — and even that is a guess." }
    ]
  },
  {
    id: "r_inference-3", pattern: "r_inference",
    context: "The observatory's guest log for 1911 lists mostly astronomers, a few curious ranchers, and one name that appears every Thursday for eleven years without a single note beside it.",
    prompt: "Which inference does the passage best support?",
    choices: [
      { text: "One visitor returned with unusual regularity.", correct: true, why: "Every Thursday for eleven years — it's right there." },
      { text: "The Thursday visitor was a professional astronomer.", why: "The log doesn't say — that's a second assumption." },
      { text: "The observatory was closed to the public.", why: "Ranchers in the guest log suggest otherwise." },
      { text: "The visitor and the log keeper were friends.", why: "A blank margin proves nothing about friendship." }
    ]
  },
  {
    id: "r_inference-4", pattern: "r_inference",
    context: "After the league added a shot clock, scoring rose in every division. Coaches who had built careers on patient, low-scoring styles began attending offseason clinics in uptempo offense — some grumbling, all taking notes.",
    prompt: "It can most reasonably be inferred that:",
    choices: [
      { text: "some coaches adapted to the rule change despite disliking it.", correct: true, why: "'Some grumbling, all taking notes' — resistance plus adaptation, exactly one step." },
      { text: "the shot clock was added to punish defensive coaches.", why: "Motive is never given — that's invented." },
      { text: "low-scoring teams always lose under a shot clock.", why: "'Always' is the extreme the passage never earns." },
      { text: "the clinics were poorly attended.", why: "Contradicted — 'all taking notes' means they showed up." }
    ]
  },

  // ---------------- Vocab in context ----------------
  {
    id: "r_vocab-1", pattern: "r_vocab",
    context: "The negotiations were delicate, so the ambassador chose to table the proposal until tempers cooled.",
    prompt: "As used in the sentence, \"table\" most nearly means:",
    choices: [
      { text: "postpone", correct: true, why: "Delicate talks + waiting for tempers to cool = set it aside for now." },
      { text: "display", why: "The furniture meaning — the trap is always the familiar one." },
      { text: "reject", why: "Too far: she's delaying it, not killing it." },
      { text: "flatten", why: "Literal-object trap; nothing is being crushed." }
    ]
  },
  {
    id: "r_vocab-2", pattern: "r_vocab",
    context: "Even the coach's harshest critics allowed that the team's defense had improved.",
    prompt: "As used in the sentence, \"allowed\" most nearly means:",
    choices: [
      { text: "admitted", correct: true, why: "Critics conceding a point — 'even' signals a reluctant admission." },
      { text: "permitted", why: "The everyday meaning of 'allow' — and the trap. Critics don't grant permission for defense." },
      { text: "ignored", why: "Opposite direction: they acknowledged it." },
      { text: "denied", why: "Flat contradiction of the sentence." }
    ]
  },
  {
    id: "r_vocab-3", pattern: "r_vocab",
    context: "The senator's support for the bill was qualified: she praised its goals but questioned its funding.",
    prompt: "As used in the sentence, \"qualified\" most nearly means:",
    choices: [
      { text: "limited", correct: true, why: "Praise plus reservations = support with conditions." },
      { text: "competent", why: "The résumé meaning — familiar, and wrong here." },
      { text: "enthusiastic", why: "The colon says the opposite: she has doubts." },
      { text: "official", why: "Nothing about formality in the sentence." }
    ]
  },
  {
    id: "r_vocab-4", pattern: "r_vocab",
    context: "The trail was so faint that only a practiced eye could follow it.",
    prompt: "As used in the sentence, \"practiced\" most nearly means:",
    choices: [
      { text: "experienced", correct: true, why: "An eye trained by long use — that's what follows faint trails." },
      { text: "rehearsed", why: "The drama-club meaning — eyes don't run lines." },
      { text: "artificial", why: "Nothing suggests fakeness." },
      { text: "patient", why: "Plausible-sounding, but the sentence is about skill, not temperament." }
    ]
  },

  // ---------------- Function ----------------
  {
    id: "r_function-1", pattern: "r_function",
    context: "Everyone remembers the highlight-reel dunk. Fewer remember the four possessions before it, when Torres quietly won the rebounding battle that made the run possible. Basketball's box score has no column for that kind of work.",
    prompt: "The final sentence primarily serves to:",
    choices: [
      { text: "emphasize that Torres's contribution goes unmeasured.", correct: true, why: "It lands the point the middle sentence set up: real work, no statistic." },
      { text: "criticize Torres's rebounding technique.", why: "The passage praises the rebounding." },
      { text: "explain how box scores are compiled.", why: "The literal-reading trap — the box score is a symbol here, not a subject." },
      { text: "argue that dunks should count for more points.", why: "Nobody proposed rule changes." }
    ]
  },
  {
    id: "r_function-2", pattern: "r_function",
    context: "Antarctic fieldwork is often romanticized. To be fair, the sunsets do earn the postcards. But the day-to-day is closer to plumbing than poetry: thawing frozen valves, patching torn tents, coaxing balky generators.",
    prompt: "The sentence \"To be fair, the sunsets do earn the postcards\" functions as:",
    choices: [
      { text: "a concession before the author's contrasting point.", correct: true, why: "Grants the romantics one inch, then the 'But' takes the mile." },
      { text: "the passage's central claim.", why: "The central claim is the plumbing-not-poetry sentence it sets up." },
      { text: "evidence that fieldwork is glamorous.", why: "It's the one glamorous thing admitted before the unglamorous list." },
      { text: "a complaint about postcard photography.", why: "Literal-reading trap — no one is reviewing postcards." }
    ]
  },
  {
    id: "r_function-3", pattern: "r_function",
    context: "The library's card catalog sat untouched for years — a wooden relic in the smartphone age. Then the art students discovered it. Each drawer became a tiny gallery: one card painted per patron, ten thousand miniature portraits of a century of readers.",
    prompt: "The description of the drawers as \"tiny galleries\" primarily serves to:",
    choices: [
      { text: "illustrate the catalog's unexpected new purpose.", correct: true, why: "It shows the transformation the word 'Then' promised." },
      { text: "explain how card catalogs organize books.", why: "The catalog's original function is exactly what the passage moved past." },
      { text: "argue that the library should modernize.", why: "The passage celebrates the old object — no modernization case." },
      { text: "criticize the art students' project.", why: "The tone is admiring: 'ten thousand miniature portraits.'" }
    ]
  },
  {
    id: "r_function-4", pattern: "r_function",
    context: "Cast iron holds heat like a grudge. That is its virtue and its danger: the same pan that sears a steak evenly will hold a burn long after the flame is off.",
    prompt: "The phrase \"like a grudge\" primarily serves to:",
    choices: [
      { text: "make the pan's heat retention vivid through comparison.", correct: true, why: "A simile doing a simile's job: long-held heat, long-held grudge." },
      { text: "suggest the author dislikes cast iron.", why: "'Virtue' is in the very next sentence." },
      { text: "warn readers never to cook with cast iron.", why: "'Danger' is noted; 'never' is the too-far extreme." },
      { text: "explain the metallurgy of iron.", why: "No science appears anywhere in the passage." }
    ]
  }
);

// ============================================================
// WAVE 2 — second set of 4 questions per pattern (96 total)
// ============================================================

ACT_QUESTIONS.push(
  // ---------------- English: run-ons ----------------
  {
    id: "runons-5", pattern: "runons",
    passage: "The ferry was full, |so we| waited for the next one.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "Comma + 'so' (a FANBOYS word) is a legal joint between two complete sentences." },
      { text: "so, we", why: "The comma belongs BEFORE the conjunction, never right after it." },
      { text: "; so we", why: "A semicolon replaces the comma-plus-FANBOYS joint — they don't stack." },
      { text: "we", why: "Removing 'so' leaves a comma splice." }
    ]
  },
  {
    id: "runons-6", pattern: "runons",
    passage: "Rain hammered the roof all |night, consequently, the| creek was over its banks by dawn.",
    choices: [
      { text: "NO CHANGE", why: "'Consequently' isn't a FANBOYS word — commas alone still make a splice." },
      { text: "night; consequently, the", correct: true, why: "Semicolon joins the sentences; 'consequently,' rides along legally." },
      { text: "night, consequently the", why: "Same splice — shuffling the second comma fixes nothing." },
      { text: "night consequently, the", why: "Now it's fused, with no joint at all." }
    ]
  },
  {
    id: "runons-7", pattern: "runons",
    passage: "I texted her twice |she never| answered.",
    choices: [
      { text: "NO CHANGE", why: "Two complete sentences, nothing joining them — fused." },
      { text: "twice, but she never", correct: true, why: "Comma + 'but' joins the clauses and keeps the contrast." },
      { text: "twice, she never", why: "A comma alone is a splice, not a joint." },
      { text: "twice, and, she never", why: "'And' works, but the comma after it is illegal." }
    ]
  },
  {
    id: "runons-8", pattern: "runons",
    passage: "The generator kicked on within |seconds, the lights| flickered back to life.",
    choices: [
      { text: "NO CHANGE", why: "Comma splice — both halves stand alone as sentences." },
      { text: "seconds, and the lights", correct: true, why: "Comma + 'and': the legal joint." },
      { text: "seconds the lights", why: "Fused — worse, not better." },
      { text: "seconds, the lights,", why: "Still a splice, now with a bonus stray comma." }
    ]
  },

  // ---------------- English: subject–verb ----------------
  {
    id: "svagree-5", pattern: "svagree",
    passage: "The bouquet of roses and lilies |smell| wonderful.",
    choices: [
      { text: "NO CHANGE", why: "'Roses and lilies' live inside the prepositional phrase — the subject is 'bouquet.'" },
      { text: "smells", correct: true, why: "Cross out 'of roses and lilies': the bouquet … smells." },
      { text: "have smelled", why: "Plural again — the flowers fooled the verb." },
      { text: "are smelling", why: "Plural and awkward." }
    ]
  },
  {
    id: "svagree-6", pattern: "svagree",
    passage: "Economics |are| his favorite subject.",
    choices: [
      { text: "NO CHANGE", why: "Words ending in -ics (economics, physics, mathematics) are singular subjects." },
      { text: "is", correct: true, why: "Economics IS — one field of study, one singular verb." },
      { text: "were", why: "Still plural, now also past tense for no reason." },
      { text: "have been", why: "Plural again." }
    ]
  },
  {
    id: "svagree-7", pattern: "svagree",
    passage: "Either of the routes |take| you downtown.",
    choices: [
      { text: "NO CHANGE", why: "The subject is 'Either' — always singular. 'Routes' is trapped in the prepositional phrase." },
      { text: "takes", correct: true, why: "Either … takes. Same trap as 'each,' same fix." },
      { text: "have taken", why: "Plural verb on a singular subject." },
      { text: "are taking", why: "Plural again." }
    ]
  },
  {
    id: "svagree-8", pattern: "svagree",
    passage: "The number of applicants |have doubled| since May.",
    choices: [
      { text: "NO CHANGE", why: "'THE number' is singular (while 'A number of' runs plural — the ACT loves this pair)." },
      { text: "has doubled", correct: true, why: "The number … has doubled. One number, one singular verb." },
      { text: "double", why: "Plural and loses the since-May timeline." },
      { text: "are doubling", why: "Plural again." }
    ]
  },

  // ---------------- English: apostrophes ----------------
  {
    id: "apostrophe-5", pattern: "apostrophe",
    passage: "|Whos'| jacket is on the bench?",
    choices: [
      { text: "NO CHANGE", why: "'Whos'' isn't a word in any direction." },
      { text: "Whose", correct: true, why: "Possession (whose jacket) → 'whose,' no apostrophe anywhere." },
      { text: "Who's", why: "'Who is jacket is on the bench' — expand it and it collapses." },
      { text: "Whos", why: "Still not a word." }
    ]
  },
  {
    id: "apostrophe-6", pattern: "apostrophe",
    passage: "Both |teams| buses arrived late.",
    choices: [
      { text: "NO CHANGE", why: "No apostrophe means no possession — but the buses belong to the teams." },
      { text: "teams'", correct: true, why: "'Both' = plural teams; plural possessive = s + apostrophe." },
      { text: "team's", why: "Singular possessive — 'both' says there are two teams." },
      { text: "teams's", why: "'s after an s-plural is never right." }
    ]
  },
  {
    id: "apostrophe-7", pattern: "apostrophe",
    passage: "|Its| been a long season for the crew.",
    choices: [
      { text: "NO CHANGE", why: "Possessive 'its' can't mean 'it has.'" },
      { text: "It's", correct: true, why: "'It's been' = it has been. The apostrophe carries the missing letters." },
      { text: "Its'", why: "Not a word." },
      { text: "Its's", why: "Definitely not a word." }
    ]
  },
  {
    id: "apostrophe-8", pattern: "apostrophe",
    passage: "My |grandparents's| cabin has no cell service.",
    choices: [
      { text: "NO CHANGE", why: "'s after an s-plural — never." },
      { text: "grandparents'", correct: true, why: "Plural owners ending in s → apostrophe after the s." },
      { text: "grandparent's", why: "One grandparent owns it now — 'grandparents' says both do." },
      { text: "grandparents", why: "The possession vanished entirely." }
    ]
  },

  // ---------------- English: commas ----------------
  {
    id: "commas-5", pattern: "commas",
    passage: "My oldest brother |a diesel mechanic| taught me to weld.",
    choices: [
      { text: "NO CHANGE", why: "The rename-phrase ('a diesel mechanic') needs commas on BOTH sides." },
      { text: ", a diesel mechanic,", correct: true, why: "Fully wrapped: lift it out and the sentence still works." },
      { text: ", a diesel mechanic", why: "Opened the wrap, never closed it." },
      { text: "a diesel mechanic,", why: "Closed the wrap, never opened it." }
    ]
  },
  {
    id: "commas-6", pattern: "commas",
    passage: "The storm that closed the airport|, was| the worst in a decade.",
    choices: [
      { text: "NO CHANGE", why: "A lone comma between the subject and its verb — the forbidden spot." },
      { text: " was", correct: true, why: "'That closed the airport' is essential info; no comma anywhere." },
      { text: "; was", why: "A semicolon needs complete sentences on both sides." },
      { text: ", was,", why: "Two bad commas instead of one." }
    ]
  },
  {
    id: "commas-7", pattern: "commas",
    passage: "Before the concert |began the| crowd was restless.",
    choices: [
      { text: "NO CHANGE", why: "An introductory clause needs a comma before the main sentence starts." },
      { text: "began, the", correct: true, why: "'Before the concert began,' — comma closes the intro clause." },
      { text: "began; the", why: "'Before the concert began' isn't a complete sentence — no semicolon allowed." },
      { text: "began — the", why: "The standard mark after an intro clause is a comma, not a dash." }
    ]
  },
  {
    id: "commas-8", pattern: "commas",
    passage: "We packed sandwiches, apples, |and, water| for the hike.",
    choices: [
      { text: "NO CHANGE", why: "A comma directly after 'and' in a list is always wrong." },
      { text: "and water", correct: true, why: "List closes cleanly: a, b, and c." },
      { text: "and — water", why: "A dash mid-list breaks the rhythm for no reason." },
      { text: ", and, water,", why: "Comma confetti." }
    ]
  },

  // ---------------- English: pronouns ----------------
  {
    id: "pronoun-5", pattern: "pronoun",
    passage: "Each backpack should have |their| owner's name inside.",
    choices: [
      { text: "NO CHANGE", why: "'Each backpack' is singular — and a thing, not people." },
      { text: "its", correct: true, why: "One backpack, one 'its.'" },
      { text: "it's", why: "'It is owner's name' — expand the contraction and it fails." },
      { text: "there", why: "'There' is a place." }
    ]
  },
  {
    id: "pronoun-6", pattern: "pronoun",
    passage: "The trophy goes to the team |that| scores the most points.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "'That' introducing essential info about a group — right as is." },
      { text: "whom", why: "Object case in a subject slot — the team SCORES." },
      { text: "which", why: "'Which' wants a comma and an extra-info clause; this info is essential." },
      { text: "who's", why: "'Who is scores the most points' — no." }
    ]
  },
  {
    id: "pronoun-7", pattern: "pronoun",
    passage: "Marcus and |him| built the deck in a weekend.",
    choices: [
      { text: "NO CHANGE", why: "Drop Marcus: 'him built the deck'? Subjects take 'he.'" },
      { text: "he", correct: true, why: "'He built the deck' — the drop-the-other-person test again." },
      { text: "himself", why: "'Himself' needs 'he' doing something to himself." },
      { text: "his", why: "Possessive — nothing is owned here." }
    ]
  },
  {
    id: "pronoun-8", pattern: "pronoun",
    passage: "When the driver argued with the referee, |he| ejected him from the match.",
    choices: [
      { text: "NO CHANGE", why: "Which one is 'he'? A pronoun that could point two ways always gets fixed." },
      { text: "the referee ejected him", correct: true, why: "Names the ejector; the ambiguity dies." },
      { text: "he ejected himself", why: "Grammatical, but now it means something absurd." },
      { text: "they ejected him", why: "'They' is even vaguer than 'he.'" }
    ]
  },

  // ---------------- English: tense ----------------
  {
    id: "tense-5", pattern: "tense",
    passage: "She |has worked| at the clinic since 2022.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "'Since 2022' + still true now = present perfect. Right as is." },
      { text: "worked", why: "Simple past says the job ended; 'since' says it continues." },
      { text: "works", why: "Loses the duration that 'since 2022' sets up." },
      { text: "had worked", why: "'Had' needs a later past event to anchor to." }
    ]
  },
  {
    id: "tense-6", pattern: "tense",
    passage: "By next June, he |will complete| his certification.",
    choices: [
      { text: "NO CHANGE", why: "'By next June' is a deadline — the completing finishes BEFORE it." },
      { text: "will have completed", correct: true, why: "Future perfect: done before the deadline arrives." },
      { text: "completed", why: "Past tense pointed at next June." },
      { text: "has completed", why: "Present perfect can't sit in the future." }
    ]
  },
  {
    id: "tense-7", pattern: "tense",
    passage: "Yesterday the interns |present| their findings to the board.",
    choices: [
      { text: "NO CHANGE", why: "'Yesterday' pins it in the past; the verb didn't get the memo." },
      { text: "presented", correct: true, why: "Past time word, past verb." },
      { text: "will present", why: "'Yesterday' and 'will' point opposite directions." },
      { text: "have presented", why: "Present perfect fights the specific time word." }
    ]
  },
  {
    id: "tense-8", pattern: "tense",
    passage: "If she |would have| studied the map, we wouldn't be lost.",
    choices: [
      { text: "NO CHANGE", why: "'Would have' never goes in the if-half — the classic conditional trap." },
      { text: "had", correct: true, why: "'If she HAD studied' — past conditionals take 'had' in the if-clause." },
      { text: "has", why: "Present perfect breaks the hypothetical." },
      { text: "will have", why: "Future perfect in a past hypothetical — no." }
    ]
  },

  // ---------------- English: concise ----------------
  {
    id: "concise-5", pattern: "concise",
    passage: "|In my opinion, I think| the fee is too high.",
    choices: [
      { text: "NO CHANGE", why: "'In my opinion' and 'I think' are the same statement twice." },
      { text: "I think", correct: true, why: "One opinion marker does the whole job." },
      { text: "In my personal opinion, I think", why: "Now it's triple — opinions are always personal." },
      { text: "It is my opinion and belief that", why: "Five words of throat-clearing." }
    ]
  },
  {
    id: "concise-6", pattern: "concise",
    passage: "The two roads |merge together| north of town.",
    choices: [
      { text: "NO CHANGE", why: "Merging is already 'together' — that's what the word means." },
      { text: "merge", correct: true, why: "One word, whole meaning." },
      { text: "merge together as one", why: "Triple redundancy." },
      { text: "come together and merge", why: "Says it twice in a trench coat." }
    ]
  },
  {
    id: "concise-7", pattern: "concise",
    passage: "She woke at |6 a.m. in the morning| to train.",
    choices: [
      { text: "NO CHANGE", why: "'a.m.' already means morning." },
      { text: "6 a.m.", correct: true, why: "Time stated once, cleanly." },
      { text: "6 o'clock a.m. in the morning", why: "Now morning is said three ways." },
      { text: "the morning hour of 6 a.m.", why: "Fancier, still redundant." }
    ]
  },
  {
    id: "concise-8", pattern: "concise",
    passage: "The committee reached a |consensus of opinion| after an hour.",
    choices: [
      { text: "NO CHANGE", why: "A consensus IS shared opinion — 'of opinion' adds nothing." },
      { text: "consensus", correct: true, why: "The whole meaning in one word." },
      { text: "general consensus of opinion", why: "Two redundancies stacked — consensus is already general." },
      { text: "consensus that everyone agreed on", why: "Agreement about the agreement." }
    ]
  },

  // ---------------- English: transitions ----------------
  {
    id: "transition-5", pattern: "transition",
    passage: "The recipe looked complicated. |Similarly,| it needed only five ingredients.",
    choices: [
      { text: "NO CHANGE", why: "Nothing is being compared — the two sentences pull against each other." },
      { text: "However,", correct: true, why: "Looked complicated vs. only five ingredients: contrast." },
      { text: "Therefore,", why: "Looking complicated doesn't cause simplicity." },
      { text: "For instance,", why: "The second sentence isn't an example of the first." }
    ]
  },
  {
    id: "transition-6", pattern: "transition",
    passage: "Cold-brew coffee is less acidic. |As a result,| many people with sensitive stomachs prefer it.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "Less acid → preferred by sensitive stomachs. Clean cause and effect." },
      { text: "However,", why: "There's no contrast to signal." },
      { text: "Meanwhile,", why: "Nothing is simultaneous here." },
      { text: "In contrast,", why: "The second sentence agrees with the first." }
    ]
  },
  {
    id: "transition-7", pattern: "transition",
    passage: "The bridge is a century old. |Therefore,| engineers rate it among the safest in the state.",
    choices: [
      { text: "NO CHANGE", why: "Being old doesn't cause safety — if anything you'd expect the opposite." },
      { text: "Nevertheless,", correct: true, why: "Old YET safest — a contrast word earns its keep." },
      { text: "For example,", why: "Safety ratings aren't an example of age." },
      { text: "Likewise,", why: "Nothing is being likened." }
    ]
  },
  {
    id: "transition-8", pattern: "transition",
    passage: "Some deserts freeze at night. |For instance,| the Gobi regularly drops below −20°F after dark.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "The Gobi is a specific example of the general claim. Exactly right." },
      { text: "However,", why: "The example supports the claim — no contrast." },
      { text: "As a result,", why: "The Gobi's cold isn't caused by the first sentence." },
      { text: "In conclusion,", why: "Nothing is being wrapped up." }
    ]
  },

  // ---------------- English: modifiers ----------------
  {
    id: "modifier-5", pattern: "modifier",
    passage: "|Covered in mud, Mom made the dog sleep in the garage.|",
    choices: [
      { text: "NO CHANGE", why: "As written, MOM is the muddy one." },
      { text: "Covered in mud, the dog was sent to the garage by Mom.", correct: true, why: "The muddy one now follows the phrase directly." },
      { text: "Covered in mud, the garage is where Mom sent the dog.", why: "Now the garage is muddy." },
      { text: "Mom, covered in mud, sent the dog to the garage.", why: "Grammatical — but it still says Mom was the muddy one. Placement IS meaning." }
    ]
  },
  {
    id: "modifier-6", pattern: "modifier", fixedOrder: true,
    prompt: "The best placement for the underlined phrase would be:",
    passage: "She served cake to the kids |on paper plates|.",
    choices: [
      { text: "where it is now", why: "The kids are standing on paper plates." },
      { text: "after the word She", why: "'She on paper plates served' — no." },
      { text: "after the word served", why: "'Served on paper plates cake to the kids' — tangled." },
      { text: "after the word cake", correct: true, why: "'Cake on paper plates' — the phrase touches what it describes." }
    ]
  },
  {
    id: "modifier-7", pattern: "modifier",
    passage: "|To qualify for the discount, a receipt must be shown at the counter.|",
    choices: [
      { text: "NO CHANGE", why: "Receipts don't qualify for discounts — people do, and no person is in the sentence." },
      { text: "To qualify for the discount, customers must show a receipt at the counter.", correct: true, why: "The qualifier ('customers') now follows the phrase." },
      { text: "To qualify for the discount, the counter requires a receipt.", why: "Now the counter is trying to qualify." },
      { text: "A receipt, to qualify for the discount, must be shown at the counter.", why: "The receipt is still doing the qualifying." }
    ]
  },
  {
    id: "modifier-8", pattern: "modifier", fixedOrder: true,
    prompt: "The best placement for the underlined phrase would be:",
    passage: "The guide spotted a moose |with high-powered binoculars|.",
    choices: [
      { text: "where it is now", why: "That's a moose carrying binoculars — quite a moose." },
      { text: "after the word The", why: "'The with high-powered binoculars guide' — word salad." },
      { text: "after the word guide", correct: true, why: "'The guide with high-powered binoculars spotted…' — the equipment belongs to the guide." },
      { text: "after the word a", why: "'A with high-powered binoculars moose' — no." }
    ]
  },

  // ---------------- English: who/whom ----------------
  {
    id: "whowhom-5", pattern: "whowhom",
    passage: "The customer |who| I helped yesterday left a five-star review.",
    choices: [
      { text: "NO CHANGE", why: "Test it: 'I helped HE'? No — 'I helped him,' so it's whom." },
      { text: "whom", correct: true, why: "'I helped him' → him → whom. The he/him test never misses." },
      { text: "which", why: "Customers are people." },
      { text: "whose", why: "Nothing is possessed." }
    ]
  },
  {
    id: "whowhom-6", pattern: "whowhom",
    passage: "She's the engineer |who| designed the ramp system.",
    choices: [
      { text: "NO CHANGE", correct: true, why: "'SHE designed it' — subject case, so 'who' is right as is." },
      { text: "whom", why: "The formal-sounding trap: 'him designed it'? No — she did the designing." },
      { text: "which", why: "Engineers are people." },
      { text: "whose", why: "Possessive with nothing possessed." }
    ]
  },
  {
    id: "whowhom-7", pattern: "whowhom",
    passage: "|Who's| turn is it to close the shop?",
    choices: [
      { text: "NO CHANGE", why: "'Who is turn is it' — expand the contraction and it collapses." },
      { text: "Whose", correct: true, why: "Possession (whose turn) → 'whose.'" },
      { text: "Whos", why: "Not a word." },
      { text: "Whom's", why: "Also not a word." }
    ]
  },
  {
    id: "whowhom-8", pattern: "whowhom",
    passage: "The startup, |who| raised two million dollars, hired nobody.",
    choices: [
      { text: "NO CHANGE", why: "A company isn't a 'who.'" },
      { text: "which", correct: true, why: "Thing + comma-wrapped extra info = 'which.'" },
      { text: "that", why: "'That' never follows a comma." },
      { text: "whom", why: "Wrong species and wrong case." }
    ]
  },

  // ---------------- English: parallel ----------------
  {
    id: "parallel-5", pattern: "parallel",
    passage: "The seminar covers budgeting, investing, and |how to negotiate|.",
    choices: [
      { text: "NO CHANGE", why: "Two -ing words, then a 'how to' phrase — the list broke stride." },
      { text: "negotiating", correct: true, why: "Budgeting, investing, negotiating — matched." },
      { text: "to negotiate", why: "Still doesn't match the -ing pattern." },
      { text: "negotiation skills that you learn", why: "A whole clause crashed the list." }
    ]
  },
  {
    id: "parallel-6", pattern: "parallel",
    passage: "He'd rather fix the engine himself than |paying| a shop.",
    choices: [
      { text: "NO CHANGE", why: "'Rather FIX … than PAYING' — the pair must match forms." },
      { text: "pay", correct: true, why: "Rather fix … than pay. Mirror shapes." },
      { text: "to pay", why: "'Than to pay' doesn't mirror bare 'fix.'" },
      { text: "he pays", why: "A clause where a verb should be." }
    ]
  },
  {
    id: "parallel-7", pattern: "parallel",
    passage: "The review praised the food, the service, and |said the prices were fair|.",
    choices: [
      { text: "NO CHANGE", why: "Two nouns, then a whole verb phrase — broken list." },
      { text: "the fair prices", correct: true, why: "The food, the service, the fair prices — three nouns, one clean list." },
      { text: "the prices being fair", why: "A '-being' phrase still isn't a plain noun." },
      { text: "that the prices were fair", why: "'Praised … that the prices were fair' — the verb can't take that clause." }
    ]
  },
  {
    id: "parallel-8", pattern: "parallel",
    passage: "Training for a marathon requires that you sleep well, that you eat enough, and |running| high mileage.",
    choices: [
      { text: "NO CHANGE", why: "Two 'that you ___' clauses, then a stray -ing — the pattern snapped." },
      { text: "that you run", correct: true, why: "That you sleep, that you eat, that you run — matched clauses." },
      { text: "to run", why: "An infinitive can't close a that-clause list." },
      { text: "you should run", why: "Dropped the 'that' the list established." }
    ]
  },

  // ---------------- English: rhetoric ----------------
  {
    id: "rhetoric-5", pattern: "rhetoric", fixedOrder: true,
    context: "A paragraph argues the school should add a bike-repair elective, citing strong student demand and low startup costs.",
    prompt: "The writer is considering adding this sentence: “The school's parking lot was repaved last summer.” Should the writer make this addition?",
    choices: [
      { text: "Yes, because it shows the school invests in its facilities.", why: "True-ish, but investment in pavement says nothing about the elective." },
      { text: "Yes, because parking relates to transportation.", why: "The surface-word trap: 'transportation' appears in both, relevance doesn't." },
      { text: "No, because it does nothing to support the case for the elective.", correct: true, why: "Demand and costs are the argument; pavement is furniture." },
      { text: "No, because the repaving was too expensive.", why: "Invents a fact the passage never gives." }
    ]
  },
  {
    id: "rhetoric-6", pattern: "rhetoric", fixedOrder: true,
    context: "An essay profiles a guitar maker; this paragraph details how she selects wood by tapping each plank and listening to its ring.",
    prompt: "The writer is considering deleting this sentence: “Her workshop also has a small refrigerator for glue.” Should it be deleted?",
    choices: [
      { text: "No, because glue is essential to building guitars.", why: "True — and irrelevant. The paragraph is about choosing wood." },
      { text: "Yes, because it interrupts the paragraph's focus on selecting wood.", correct: true, why: "Right verdict, right reason: it's off this paragraph's one job." },
      { text: "No, because it adds a vivid workshop detail.", why: "Vividness isn't the test; loyalty to the point is." },
      { text: "Yes, because refrigerators are not musical instruments.", why: "Right verdict, absurd reason — and on the ACT, the reason IS the answer." }
    ]
  },
  {
    id: "rhetoric-7", pattern: "rhetoric", fixedOrder: true,
    context: "The writer wants to convey how quiet the library becomes during finals week.",
    prompt: "Which choice most effectively accomplishes the writer's goal?",
    choices: [
      { text: "The library extends its hours during finals week.", why: "Hours say nothing about quiet." },
      { text: "Many students prefer studying at home.", why: "Points away from the library entirely." },
      { text: "Finals happen twice each academic year.", why: "A calendar fact, not an atmosphere." },
      { text: "Even the page-turns seemed to apologize for making noise.", correct: true, why: "One image that makes the silence audible — exactly the goal." }
    ]
  },
  {
    id: "rhetoric-8", pattern: "rhetoric", fixedOrder: true,
    context: "A paragraph traces how a family taco stand grew into a fleet of six trucks across the county.",
    prompt: "Which sentence best concludes the paragraph by returning to its main idea?",
    choices: [
      { text: "Tacos have a long history in Mexican cuisine.", why: "Rewinds to background the paragraph never covered." },
      { text: "What started as one borrowed griddle now feeds half the county.", correct: true, why: "Lands the growth story in one line — start to scale." },
      { text: "Food trucks must pass regular health inspections.", why: "A regulation aside." },
      { text: "The family also considered opening a car wash.", why: "New topic in the last sentence." }
    ]
  },

  // ---------------- Math: answer the actual question ----------------
  {
    id: "m_asked-5", pattern: "m_asked", fixedOrder: true,
    passage: "If 3(x − 2) = 21, what is x + 4?",
    choices: [
      { text: "7", why: "That's x − 2, the intermediate step." },
      { text: "9", why: "That's x. They asked for x + 4." },
      { text: "13", correct: true, why: "x − 2 = 7 → x = 9 → x + 4 = 13." },
      { text: "21", why: "The right-hand side, recycled." }
    ]
  },
  {
    id: "m_asked-6", pattern: "m_asked", fixedOrder: true,
    passage: "A rectangle has area 48 and length 8. What is its perimeter?",
    choices: [
      { text: "6", why: "That's the width — halfway there." },
      { text: "14", why: "8 + 6 — one of each side; the perimeter has two of each." },
      { text: "28", correct: true, why: "Width = 48 ÷ 8 = 6 → perimeter 2(8 + 6) = 28." },
      { text: "48", why: "The area, recycled." }
    ]
  },
  {
    id: "m_asked-7", pattern: "m_asked", fixedOrder: true,
    passage: "If 2y − 3 = 11, what is 2y + 3?",
    choices: [
      { text: "7", why: "That's y. Look again at what they asked." },
      { text: "11", why: "The right-hand side, recycled." },
      { text: "14", why: "That's 2y — one step short." },
      { text: "17", correct: true, why: "2y = 14 → 2y + 3 = 17. You never even needed y." }
    ]
  },
  {
    id: "m_asked-8", pattern: "m_asked", fixedOrder: true,
    passage: "The sum of three consecutive integers is 42. What is the largest of them?",
    choices: [
      { text: "13", why: "That's the smallest." },
      { text: "14", why: "That's the middle one — 42 ÷ 3 gives the average, not the largest." },
      { text: "15", correct: true, why: "13 + 14 + 15 = 42; the largest is 15." },
      { text: "42", why: "The sum, recycled." }
    ]
  },

  // ---------------- Math: backsolve ----------------
  {
    id: "m_backsolve-5", pattern: "m_backsolve", fixedOrder: true,
    passage: "For which value of n does 2ⁿ = 64 ?",
    choices: [
      { text: "5", why: "2⁵ = 32. One doubling short." },
      { text: "6", correct: true, why: "2·2·2·2·2·2 = 64. Testing choices beats logarithms here." },
      { text: "8", why: "2⁸ = 256." },
      { text: "32", why: "64 ÷ 2 — exponents aren't division." }
    ]
  },
  {
    id: "m_backsolve-6", pattern: "m_backsolve", fixedOrder: true,
    passage: "A number decreased by 40% equals 36. What is the number?",
    choices: [
      { text: "21.6", why: "That's 36 decreased by 40% — you decreased the RESULT." },
      { text: "50.4", why: "36 × 1.4 — adding 40% doesn't undo subtracting 40%." },
      { text: "60", correct: true, why: "Test it: 60 − 40% of 60 = 60 − 24 = 36. ✓" },
      { text: "90", why: "36 ÷ 0.4 — divided by the discount instead of what's left." }
    ]
  },
  {
    id: "m_backsolve-7", pattern: "m_backsolve", fixedOrder: true,
    passage: "Adult tickets cost $9 and kid tickets cost $4. Thirteen people paid $92 in total. How many kid tickets were sold?",
    choices: [
      { text: "4", why: "Test: 9 adults + 4 kids = 81 + 16 = $97. Too high." },
      { text: "5", correct: true, why: "8 adults + 5 kids = 72 + 20 = $92. ✓" },
      { text: "6", why: "7 adults + 6 kids = 63 + 24 = $87. Too low." },
      { text: "8", why: "That's the ADULT count from the right answer." }
    ]
  },
  {
    id: "m_backsolve-8", pattern: "m_backsolve", fixedOrder: true,
    passage: "If x² + 5 = 41 and x > 0, what is x?",
    choices: [
      { text: "4", why: "16 + 5 = 21. Not 41." },
      { text: "6", correct: true, why: "36 + 5 = 41. ✓" },
      { text: "18", why: "36 ÷ 2 — square roots aren't halving." },
      { text: "36", why: "That's x² — stopped one step early." }
    ]
  },

  // ---------------- Math: plug in ----------------
  {
    id: "m_plugin-5", pattern: "m_plugin",
    passage: "If p is an odd integer, which of the following must be even?",
    choices: [
      { text: "p + 2", why: "Odd + even = odd. Try p = 3 → 5." },
      { text: "2p", correct: true, why: "Two times ANYTHING is even. p = 3 → 6." },
      { text: "p²", why: "3² = 9 — odd squared stays odd." },
      { text: "3p", why: "3 × 3 = 9. Odd." }
    ]
  },
  {
    id: "m_plugin-6", pattern: "m_plugin", fixedOrder: true,
    passage: "A price is cut 30%, then the sale price is cut another 10%. The total discount off the original price is:",
    choices: [
      { text: "33%", why: "Splitting the difference isn't math." },
      { text: "37%", correct: true, why: "Try $100: → $70 → $63. You saved $37." },
      { text: "40%", why: "30 + 10 — percents of different bases never just add." },
      { text: "63%", why: "That's what you PAY, not what you saved." }
    ]
  },
  {
    id: "m_plugin-7", pattern: "m_plugin", fixedOrder: true,
    passage: "If a = b + 3, what is the value of (a − b)² ?",
    choices: [
      { text: "3", why: "That's a − b itself, not its square." },
      { text: "6", why: "Doubled instead of squared." },
      { text: "9", correct: true, why: "a − b is ALWAYS 3, so the square is always 9. Try b = 1: (4−1)² = 9." },
      { text: "Cannot be determined", why: "It can — plug in any b and a − b comes out 3 every time. This choice preys on variable-phobia." }
    ]
  },
  {
    id: "m_plugin-8", pattern: "m_plugin", fixedOrder: true,
    passage: "A stock's price doubled, then fell 50%. Compared with its starting price, it is now:",
    choices: [
      { text: "25% lower", why: "Plug in $100 and just follow it: 100 → 200 → 100." },
      { text: "exactly the same", correct: true, why: "$100 → $200 → $100. The fall erased the double — percent moves aren't symmetric, but this pair cancels." },
      { text: "25% higher", why: "Run the $100 test — no gain survives." },
      { text: "50% higher", why: "The 50% fall applied to the DOUBLED price, not the original." }
    ]
  },

  // ---------------- Math: translate ----------------
  {
    id: "m_translate-5", pattern: "m_translate",
    passage: "Which expression represents \"twice the sum of x and 5\"?",
    choices: [
      { text: "2x + 5", why: "That doubles x first — but 'the sum' happens before the doubling." },
      { text: "2(x + 5)", correct: true, why: "Sum first (x + 5), then twice it." },
      { text: "x + 10", why: "Added twice instead of doubling the sum." },
      { text: "2x · 5", why: "Multiplication invaded a sum." }
    ]
  },
  {
    id: "m_translate-6", pattern: "m_translate",
    passage: "A phone plan costs $30 per month plus $0.10 for each extra gigabyte g. Which expression gives the monthly cost?",
    choices: [
      { text: "30 + 0.10g", correct: true, why: "Flat fee once, dime per gig." },
      { text: "30g + 0.10", why: "That charges $30 per gigabyte." },
      { text: "30.10g", why: "Glued the two prices into one." },
      { text: "0.10(30 + g)", why: "Now the flat fee costs a dime on the dollar." }
    ]
  },
  {
    id: "m_translate-7", pattern: "m_translate",
    passage: "Which expression represents \"six fewer than half of n\"?",
    choices: [
      { text: "6 − n/2", why: "The flip trap — 'fewer than' reverses the order." },
      { text: "n/2 − 6", correct: true, why: "Half of n, THEN take six away." },
      { text: "(n − 6)/2", why: "That halves AFTER subtracting — order matters." },
      { text: "6 − 2n", why: "Flipped and doubled instead of halved." }
    ]
  },
  {
    id: "m_translate-8", pattern: "m_translate",
    passage: "A worker earns w dollars per hour plus a flat $50 weekly bonus. She worked 38 hours this week. Her pay is:",
    choices: [
      { text: "38w + 50", correct: true, why: "Hours × rate, bonus once." },
      { text: "50w + 38", why: "Rate and bonus swapped jobs." },
      { text: "88w", why: "Added hours to the bonus, then multiplied — units collided." },
      { text: "38(w + 50)", why: "That pays the bonus every single hour." }
    ]
  },

  // ---------------- Math: lines ----------------
  {
    id: "m_lines-5", pattern: "m_lines", fixedOrder: true,
    passage: "What is the slope of the line 3x + y = 12 ?",
    formula: { key: "Solve for y, then read m", expr: "get it into y = mx + b, then m is the slope", data: "3x + y = 12  →  y = −3x + 12", answer: "m = −3" },
    plot: { line: { m: -3, b: 12 } },
    choices: [
      { text: "−3", correct: true, why: "Solve for y: y = −3x + 12. The sign flips when 3x crosses over." },
      { text: "3", why: "Forgot the sign flip when moving 3x to the other side." },
      { text: "4", why: "That's 12 ÷ 3 — the x-intercept, not the slope." },
      { text: "12", why: "The constant — that's the y-intercept." }
    ]
  },
  {
    id: "m_lines-6", pattern: "m_lines",
    passage: "Which line is perpendicular to y = 2x + 1 ?",
    formula: { key: "Perpendicular slope", expr: "flip it and negate: m → −1/m", data: "slope 2  →  −1/2", answer: "y = −½x + 7" },
    plot: { line: { m: -0.5, b: 7 } },
    choices: [
      { text: "y = −(1/2)x + 7", correct: true, why: "Perpendicular = flip AND negate: 2 → −1/2." },
      { text: "y = 2x − 1", why: "Same slope — that's parallel." },
      { text: "y = −2x + 1", why: "Negated but didn't flip — that's a reflection, not perpendicular." },
      { text: "y = (1/2)x − 3", why: "Flipped but didn't negate." }
    ]
  },
  {
    id: "m_lines-7", pattern: "m_lines",
    passage: "A line has slope 5 and crosses the y-axis at (0, −4). Its equation is:",
    formula: { key: "Build y = mx + b", expr: "drop the slope in for m and the intercept in for b", data: "m = 5,  b = −4", answer: "y = 5x − 4" },
    plot: { line: { m: 5, b: -4 }, answer: [0, -4, "b"] },
    choices: [
      { text: "y = 5x − 4", correct: true, why: "m = 5, b = −4, straight into y = mx + b." },
      { text: "y = −4x + 5", why: "Slope and intercept swapped seats." },
      { text: "y = 5x + 4", why: "The intercept's sign flipped." },
      { text: "y = −5x − 4", why: "The slope's sign flipped." }
    ]
  },
  {
    id: "m_lines-8", pattern: "m_lines", fixedOrder: true,
    passage: "What is the midpoint of the segment from (1, 8) to (7, 2)?",
    decode: "You're given two endpoints. They want the point exactly halfway between them — so average the x's and average the y's.",
    formula: { key: "Midpoint", expr: "( (x₁ + x₂) / 2 ,  (y₁ + y₂) / 2 )", data: "( (1 + 7) / 2 ,  (8 + 2) / 2 )", answer: "(4, 5)" },
    plot: { points: [[1, 8, "A"], [7, 2, "B"]], segment: [0, 1], answer: [4, 5, "M"] },
    choices: [
      { text: "(3, 3)", why: "Half the differences — the midpoint AVERAGES, it doesn't subtract." },
      { text: "(4, 5)", correct: true, why: "Average each coordinate: (1+7)/2 = 4, (8+2)/2 = 5." },
      { text: "(6, −6)", why: "That's the displacement (7−1, 2−8), not a point between them." },
      { text: "(8, 10)", why: "Added the coordinates but forgot to divide by 2." }
    ]
  },

  // ---------------- Math: geometry ----------------
  {
    id: "m_geometry-5", pattern: "m_geometry", fixedOrder: true,
    passage: "A circle has circumference 10π. What is its radius?",
    formula: { key: "Circle circumference", expr: "C = 2πr,  so  r = C ÷ (2π)", data: "10π ÷ 2π", answer: "r = 5" },
    diagram: { type: "circle", rLabel: "r = 5", note: "C = 2πr = 10π" },
    choices: [
      { text: "5", correct: true, why: "C = 2πr → 10π = 2πr → r = 5." },
      { text: "10", why: "That's the diameter." },
      { text: "25", why: "That's r², already headed toward an area question nobody asked." },
      { text: "100", why: "10² — squared the wrong thing." }
    ]
  },
  {
    id: "m_geometry-6", pattern: "m_geometry", fixedOrder: true,
    passage: "A square with side 6 has the same area as a triangle with base 12. What is the triangle's height?",
    formula: { key: "Set the areas equal", expr: "square s² = triangle ½·b·h", data: "6² = 36 = ½·12·h → h = 72/12", answer: "h = 6" },
    diagram: { type: "rightTriangle", a: 12, b: 6, c: "", aLabel: "base 12", bLabel: "h = 6", cLabel: "", note: "½·12·6 = 36 = 6²" },
    choices: [
      { text: "3", why: "½ × 12 × 3 = 18 — half the square's 36." },
      { text: "6", correct: true, why: "Square area 36 = ½ × 12 × h → h = 6." },
      { text: "9", why: "Check it: ½ × 12 × 9 = 54, not 36." },
      { text: "12", why: "Matching the base isn't a rule." }
    ]
  },
  {
    id: "m_geometry-7", pattern: "m_geometry", fixedOrder: true,
    passage: "A rectangle measures 6 by 8. How long is its diagonal?",
    formula: { key: "Pythagorean (the diagonal)", expr: "the diagonal splits it into a right triangle: a² + b² = c²", data: "6² + 8² = 36 + 64 = 100", answer: "diagonal = √100 = 10" },
    diagram: { type: "rightTriangle", a: 8, b: 6, c: 10, aLabel: "8", bLabel: "6", cLabel: "diagonal = 10", note: "6² + 8² = 10²" },
    choices: [
      { text: "10", correct: true, why: "6² + 8² = 100 → 10. The 3-4-5 triangle, doubled." },
      { text: "14", why: "6 + 8 — walking the two sides instead of taking the shortcut." },
      { text: "28", why: "That's the perimeter." },
      { text: "48", why: "That's the area." }
    ]
  },
  {
    id: "m_geometry-8", pattern: "m_geometry", fixedOrder: true,
    passage: "The angles of a triangle measure x, 2x, and 3x. What is the largest angle?",
    formula: { key: "Triangle angle sum", expr: "all three angles add to 180°", data: "x + 2x + 3x = 6x = 180 → x = 30", answer: "largest = 3·30 = 90°" },
    choices: [
      { text: "30", why: "That's x — the SMALLEST angle." },
      { text: "60", why: "That's 2x, the middle one." },
      { text: "90", correct: true, why: "x + 2x + 3x = 180 → x = 30 → largest = 3(30) = 90." },
      { text: "180", why: "That's the whole triangle's total." }
    ]
  },

  // ---------------- Math: ratios ----------------
  {
    id: "m_ratio-5", pattern: "m_ratio", fixedOrder: true,
    passage: "On a map, 2 inches represents 15 miles. Two towns are 7 inches apart. How many miles apart are they?",
    formula: { key: "Proportion", expr: "2 in / 15 mi = 7 in / x mi", data: "x = 7 × (15 ÷ 2) = 7 × 7.5", answer: "52.5 miles" },
    choices: [
      { text: "30", why: "That's 4 inches' worth." },
      { text: "45", why: "That's 6 inches' worth — the proportion got rounded." },
      { text: "52.5", correct: true, why: "15 ÷ 2 = 7.5 miles per inch → 7 × 7.5 = 52.5." },
      { text: "105", why: "7 × 15 — skipped the ÷2." }
    ]
  },
  {
    id: "m_ratio-6", pattern: "m_ratio", fixedOrder: true,
    passage: "A punch recipe mixes juice and soda in a 3:5 ratio. How many cups of juice are in 40 cups of punch?",
    formula: { key: "Ratios", expr: "add the parts, divide the total, then scale", data: "3 + 5 = 8 parts → 40 ÷ 8 = 5 per part", answer: "juice = 3 × 5 = 15" },
    diagram: { type: "barModel", segments: [{ v: 3, label: "juice 3" }, { v: 5, label: "soda 5" }], caption: "8 parts share 40 cups → 5 cups per part" },
    choices: [
      { text: "8", why: "That's the number of SHARES, not cups of juice." },
      { text: "15", correct: true, why: "3 + 5 = 8 shares → 40 ÷ 8 = 5 per share → juice = 3 × 5 = 15." },
      { text: "24", why: "3/5 of 40 — but 5 is the soda's share, not the total. Totals use 8." },
      { text: "25", why: "That's the SODA." }
    ]
  },
  {
    id: "m_ratio-7", pattern: "m_ratio", fixedOrder: true,
    passage: "Sales tax is 8%. A receipt shows $64.80 total after tax. What was the pre-tax price?",
    formula: { key: "Undo a percent", expr: "total = price × 1.08,  so  price = total ÷ 1.08", data: "64.80 ÷ 1.08", answer: "$60.00" },
    diagram: { type: "barModel", segments: [{ v: 100, label: "price $60", color: "#3987e5" }, { v: 8, label: "tax $4.80", color: "#fab219" }], caption: "$60 + 8% of $60 = $64.80" },
    choices: [
      { text: "$5.18", why: "That's just 8% of the total — a piece, not the price." },
      { text: "$59.62", why: "64.80 minus 8% of 64.80 — undoing tax means dividing by 1.08, not subtracting from the wrong base." },
      { text: "$60.00", correct: true, why: "64.80 ÷ 1.08 = 60. Check: 60 × 1.08 = 64.80. ✓" },
      { text: "$69.98", why: "Added the tax again instead of removing it." }
    ]
  },
  {
    id: "m_ratio-8", pattern: "m_ratio", fixedOrder: true,
    passage: "In a survey, 3 out of every 8 students bike to school. Of 240 students surveyed, how many do NOT bike?",
    formula: { key: "Fraction of a whole", expr: "not-bikers = 5/8 of the total", data: "(5 ÷ 8) × 240", answer: "150" },
    diagram: { type: "barModel", segments: [{ v: 3, label: "bike 3" }, { v: 5, label: "don't 5" }], caption: "5 of 8 parts × 240 = 150 not biking" },
    choices: [
      { text: "30", why: "That's one share (240 ÷ 8), not five of them." },
      { text: "90", why: "That's the bikers — reread what they asked." },
      { text: "120", why: "Half — but the split is 3:5, not 4:4." },
      { text: "150", correct: true, why: "Non-bikers are 5 of 8 shares: (5/8) × 240 = 150." }
    ]
  },

  // ---------------- Math: averages ----------------
  {
    id: "m_average-5", pattern: "m_average", fixedOrder: true,
    passage: "What is the mean of 4, 7, 7, 10, and 12?",
    decode: "A list of numbers. They want the average: add them all up, then divide by how many there are.",
    formula: { key: "Mean (average)", expr: "mean = total ÷ count", data: "(4 + 7 + 7 + 10 + 12) ÷ 5 = 40 ÷ 5", answer: "8" },
    diagram: { type: "numberLine", min: 3, max: 13, points: [{ x: 4 }, { x: 7 }, { x: 7 }, { x: 10 }, { x: 12 }, { x: 8, label: "mean 8", color: "#fab219" }], caption: "the mean is the balance point" },
    choices: [
      { text: "7", why: "That's the median AND the mode — the mean adds and divides." },
      { text: "8", correct: true, why: "4+7+7+10+12 = 40 → 40 ÷ 5 = 8." },
      { text: "9", why: "Off by one on the divide." },
      { text: "40", why: "That's the total — one ÷5 from done." }
    ]
  },
  {
    id: "m_average-6", pattern: "m_average", fixedOrder: true,
    passage: "Through 6 games, Ana averages 12 points. After game 7 her average is 13. How many points did she score in game 7?",
    formula: { key: "Averages via totals", expr: "game 7 = new total − old total", data: "7×13 = 91;  6×12 = 72", answer: "91 − 72 = 19" },
    choices: [
      { text: "13", why: "Scoring the new average can't RAISE the average to it." },
      { text: "14", why: "The +1 must cover all seven games, not just one." },
      { text: "19", correct: true, why: "New total 7×13 = 91; old total 6×12 = 72; game 7 = 19." },
      { text: "91", why: "That's the season total." }
    ]
  },
  {
    id: "m_average-7", pattern: "m_average", fixedOrder: true,
    passage: "The median of five house prices is $200,000. The most expensive house rises $50,000 in value. What is the new median?",
    formula: { key: "Median ignores extremes", expr: "only the MIDDLE value sets the median", data: "the top house isn't the middle one", answer: "still $200,000" },
    choices: [
      { text: "$200,000", correct: true, why: "The middle value didn't move — the median ignores what happens at the extremes." },
      { text: "$210,000", why: "Spreading the raise across all five — that's how the MEAN would move." },
      { text: "$225,000", why: "Half the raise added — still treating the median like an average." },
      { text: "$250,000", why: "Added the raise to the median, but only the TOP house changed." }
    ]
  },
  {
    id: "m_average-8", pattern: "m_average", fixedOrder: true,
    passage: "A data set of 10 values has a mean of 20. One value, 65, is removed. What is the new mean?",
    formula: { key: "Averages via totals", expr: "new total ÷ new count", data: "(10×20 − 65) ÷ 9 = 135 ÷ 9", answer: "15" },
    choices: [
      { text: "13.5", why: "Divided by 10 — but only 9 values remain." },
      { text: "15", correct: true, why: "Total 10×20 = 200 → 200 − 65 = 135 → 135 ÷ 9 = 15." },
      { text: "20", why: "Removing a value far above the mean must PULL the mean down." },
      { text: "45", why: "65 − 20 — subtracting the mean from a value means nothing here." }
    ]
  },

  // ---------------- Reading: main idea ----------------
  {
    id: "r_mainidea-5", pattern: "r_mainidea",
    context: "For a century, the lighthouse keepers' logbooks were valued only as maritime records. Then climate scientists opened them: page after page of daily wind, fog, and temperature notes — an unbroken hundred-year weather dataset no instrument station could match.",
    prompt: "Which choice best states the main idea?",
    choices: [
      { text: "Old logbooks proved unexpectedly valuable as climate data.", correct: true, why: "Covers the turn the whole passage exists for." },
      { text: "Lighthouse keepers recorded the weather every day.", why: "True detail; the point is what that record became." },
      { text: "Instrument stations produce unreliable data.", why: "The passage says no station matches the logs' SPAN — not that stations are unreliable." },
      { text: "Historians have lost interest in maritime records.", why: "Never stated." }
    ]
  },
  {
    id: "r_mainidea-6", pattern: "r_mainidea",
    context: "The city's new bus lanes drew fury over the parking they removed — until the commute data arrived. Buses that had crawled at eight miles per hour now averaged nineteen, and ridership on the corridor jumped forty percent in six months.",
    prompt: "The main idea of the passage is that:",
    choices: [
      { text: "data showed the controversial bus lanes delivered real improvements.", correct: true, why: "Wraps the conflict and the payoff — the passage's whole arc." },
      { text: "buses previously averaged eight miles per hour.", why: "A before-number promoted above its pay grade." },
      { text: "removing parking always increases ridership.", why: "'Always' is an extreme one example can't earn." },
      { text: "the city should remove additional parking.", why: "A recommendation the passage never makes." }
    ]
  },
  {
    id: "r_mainidea-7", pattern: "r_mainidea",
    context: "Sourdough's tang comes not from a recipe but from geography: wild yeasts and bacteria drift in from the local air and settle into the starter. San Francisco's famous loaf, transplanted to Denver, slowly stops tasting like San Francisco.",
    prompt: "Which choice best states the main idea?",
    choices: [
      { text: "A sourdough's character comes from its local environment.", correct: true, why: "Both sentences serve exactly this claim." },
      { text: "Denver cannot produce good bread.", why: "The bread changes; nobody says it gets worse." },
      { text: "Recipes matter more than location.", why: "Directly contradicted — 'not from a recipe.'" },
      { text: "San Francisco bakers refuse to share their starters.", why: "Imported from outside the passage." }
    ]
  },
  {
    id: "r_mainidea-8", pattern: "r_mainidea",
    context: "Early flight recorders survived crashes but not investigators' questions: they captured too little. Each generation since has traded steel for memory — today's recorders log thousands of parameters, from flap angles to the pressure in a pilot's headset microphone.",
    prompt: "The main idea of the passage is that:",
    choices: [
      { text: "flight recorders evolved to capture vastly more information.", correct: true, why: "The whole passage is that trajectory: too little → thousands of parameters." },
      { text: "modern recorders no longer survive crashes.", why: "Nothing says durability was sacrificed." },
      { text: "early investigators asked too many questions.", why: "Twists the metaphor upside down." },
      { text: "headset microphones are the most important data source.", why: "One item from a list of thousands." }
    ]
  },

  // ---------------- Reading: inference ----------------
  {
    id: "r_inference-5", pattern: "r_inference",
    context: "The chess club met in the cafeteria until the vending machine's hum proved too much for tournament nerves. They now meet in the library, where the only complaint is that winning quietly is harder than it sounds.",
    prompt: "It can most reasonably be inferred that:",
    choices: [
      { text: "the club found the cafeteria environment disruptive.", correct: true, why: "They moved because the hum was 'too much' — one step." },
      { text: "the library has banned celebrations.", why: "The complaint is wry self-control, not a rule." },
      { text: "vending machines are prohibited near tournaments.", why: "An invented regulation." },
      { text: "the club plays worse in the library.", why: "No performance claim anywhere." }
    ]
  },
  {
    id: "r_inference-6", pattern: "r_inference",
    context: "Dana's rebuilt carburetor sat gleaming on the bench for three days before she finally bolted it in. \"Measure twice,\" she said, though everyone in the shop knew she'd already measured five times.",
    prompt: "The passage most strongly supports which conclusion?",
    choices: [
      { text: "Dana is exceptionally careful with her work.", correct: true, why: "Three days of waiting, five measurements — the text piles it on." },
      { text: "Dana doubts her own ability.", why: "One step too far — care is a habit here, not anxiety." },
      { text: "The carburetor was installed incorrectly.", why: "Nothing suggests a problem." },
      { text: "Dana's coworkers resent her pace.", why: "'Knew' shows familiarity, not resentment." }
    ]
  },
  {
    id: "r_inference-7", pattern: "r_inference",
    context: "The orchard's oldest trees produce small, tart apples nobody will buy whole — and every fall, the cider house buys the entire crop before anyone else can.",
    prompt: "It can most reasonably be inferred that:",
    choices: [
      { text: "the tart apples are valuable for making cider.", correct: true, why: "The cider house races to buy ALL of them — one step from the text." },
      { text: "the old trees should be replaced.", why: "The passage implies the opposite: their crop is wanted." },
      { text: "the cider house overpays for its apples.", why: "No price appears anywhere." },
      { text: "the orchard loses money every fall.", why: "Selling an entire crop suggests otherwise." }
    ]
  },
  {
    id: "r_inference-8", pattern: "r_inference",
    context: "The ladder manual's final page, in type smaller than the rest: \"The manufacturer is not responsible for damage caused by use on ice.\" Below it, three more lines cover mud, high wind, and \"the decks of moving boats.\"",
    prompt: "The passage most strongly suggests that:",
    choices: [
      { text: "the warnings reflect ways people have actually used the ladder.", correct: true, why: "Lawyers write warnings for things that happened — 'decks of moving boats' wasn't invented in a meeting." },
      { text: "the ladder is unsafe under normal conditions.", why: "Warnings about extreme use say nothing about normal use." },
      { text: "the manufacturer tests ladders on boats.", why: "Disclaiming ≠ testing." },
      { text: "small type is illegal in manuals.", why: "An invented rule." }
    ]
  },

  // ---------------- Reading: vocab ----------------
  {
    id: "r_vocab-5", pattern: "r_vocab",
    context: "The witness's account matched the footage, so the detective let the small contradictions about timing stand.",
    prompt: "As used in the sentence, \"stand\" most nearly means:",
    choices: [
      { text: "remain unchallenged", correct: true, why: "She chose not to dispute them — they were left as they were." },
      { text: "testify", why: "The courtroom trap — the setting whispers it, the sentence doesn't." },
      { text: "rise to their feet", why: "Contradictions don't have feet." },
      { text: "endure hardship", why: "'Can't stand it' is a different idiom entirely." }
    ]
  },
  {
    id: "r_vocab-6", pattern: "r_vocab",
    context: "The novel's plot is thin, but its characters are so rich that readers forgive everything else.",
    prompt: "As used in the sentence, \"rich\" most nearly means:",
    choices: [
      { text: "fully developed", correct: true, why: "Rich characters = deep, layered ones — the contrast with a 'thin' plot seals it." },
      { text: "wealthy", why: "The money meaning — familiar, and wrong here." },
      { text: "heavy and sweet", why: "The dessert meaning." },
      { text: "expensive to create", why: "Nothing about cost." }
    ]
  },
  {
    id: "r_vocab-7", pattern: "r_vocab",
    context: "He couched his criticism in praise, and half the room missed it entirely.",
    prompt: "As used in the sentence, \"couched\" most nearly means:",
    choices: [
      { text: "phrased", correct: true, why: "He wrapped the criticism in softer words — expressed it a particular way." },
      { text: "rested on furniture", why: "The living-room trap." },
      { text: "hid completely", why: "Half the room caught it — so it wasn't fully hidden." },
      { text: "withdrew", why: "The criticism was delivered, not taken back." }
    ]
  },
  {
    id: "r_vocab-8", pattern: "r_vocab",
    context: "The committee's approval was pointed: they praised the plan while noting, twice, exactly who had opposed it earlier.",
    prompt: "As used in the sentence, \"pointed\" most nearly means:",
    choices: [
      { text: "deliberately barbed", correct: true, why: "Praise with a message aimed at someone — approval with an edge." },
      { text: "sharp-tipped", why: "The physical meaning." },
      { text: "accidental", why: "'Twice' rules out accident." },
      { text: "unanimous", why: "Nothing about the vote count." }
    ]
  },

  // ---------------- Reading: function ----------------
  {
    id: "r_function-5", pattern: "r_function",
    context: "Marathon plans obsess over the long run. Yet ask coaches what actually breaks runners, and it's rarely Sunday's twenty miles — it's the Tuesday workout done too fast, week after week. The long run gets the glory; the easy days decide the race.",
    prompt: "The final sentence primarily serves to:",
    choices: [
      { text: "distill the passage's contrast into its central point.", correct: true, why: "It compresses glory-vs-substance into the takeaway line." },
      { text: "argue that long runs should be eliminated.", why: "The passage reassigns credit; it cancels nothing." },
      { text: "describe a typical training week.", why: "The literal-reading trap." },
      { text: "celebrate Sunday runners.", why: "Backwards — the glory is the misdirection." }
    ]
  },
  {
    id: "r_function-6", pattern: "r_function",
    context: "The seed vault sits in Arctic permafrost, built to outlast wars and centuries. Its first withdrawal came barely a decade in — not for apocalypse, but because a working seed bank in Aleppo needed its backups amid Syria's war.",
    prompt: "The phrase \"not for apocalypse\" primarily serves to:",
    choices: [
      { text: "correct the reader's likely assumption about the vault's use.", correct: true, why: "It anticipates what you expected and redirects to the real story." },
      { text: "argue that the vault was built prematurely.", why: "The withdrawal proves its worth, not its wastefulness." },
      { text: "downplay the seriousness of the war.", why: "The war is the reason — nothing is downplayed." },
      { text: "explain how permafrost preserves seeds.", why: "No science appears in the sentence." }
    ]
  },
  {
    id: "r_function-7", pattern: "r_function",
    context: "My grandfather never called it soccer, and never described it as anything but work: two buses to practice, boots resoled by hand, one orange shared at halftime. When today's players complain about grass length, he only smiles.",
    prompt: "The detail of \"one orange shared at halftime\" functions to:",
    choices: [
      { text: "illustrate the scarcity that shaped his experience of the game.", correct: true, why: "One concrete object carries the whole era's leanness." },
      { text: "show that players were poorly coached.", why: "Nutrition isn't coaching, and neither is the point." },
      { text: "criticize modern sports diets.", why: "The passage contrasts eras; it doesn't lecture." },
      { text: "explain why he stopped playing.", why: "Never stated or implied." }
    ]
  },
  {
    id: "r_function-8", pattern: "r_function",
    context: "To be clear, the telescope did not \"see\" the planet — none can, at that distance. What it recorded was a star's light dimming on schedule, eighty times, like a porch lamp winked by a moth with a calendar.",
    prompt: "The moth-and-porch-lamp comparison primarily serves to:",
    choices: [
      { text: "make an indirect detection method vivid and concrete.", correct: true, why: "A homely image for an abstract technique — that's the simile's whole job." },
      { text: "prove that the planet exists.", why: "Similes illustrate; they don't prove." },
      { text: "describe the telescope's optics.", why: "Nothing optical in the image." },
      { text: "suggest the discovery was accidental.", why: "'On schedule, eighty times' says exactly the opposite." }
    ]
  }
);

// ============================================================
// WAVE 3 — Math content patterns (the gaps a 17 leaves on the table)
// ============================================================

Object.assign(ACT_PATTERNS, {
  m_exponents: {
    subject: "Math",
    name: "Exponent & radical rules",
    rule: "Same base: ADD exponents to multiply, SUBTRACT to divide, MULTIPLY for a power of a power. Negative exponent = flip it (reciprocal). Fractional exponent = a root.",
    cue: "Same base? Just add or subtract the little numbers — never multiply the bases out. (xᵃ)ᵇ is the only one where you multiply the exponents.",
    example: "x³·x² = x⁵ (add). (x³)² = x⁶ (multiply). 2⁻³ = 1/8 (flip).",
    formula: { key: "Exponent rules", expr: "xᵃ·xᵇ = xᵃ⁺ᵇ   ·   xᵃ/xᵇ = xᵃ⁻ᵇ   ·   (xᵃ)ᵇ = xᵃᵇ   ·   x⁻ᵃ = 1/xᵃ" }
  },
  m_quadratic: {
    subject: "Math",
    name: "Factoring & quadratics",
    rule: "To factor x²+bx+c, find two numbers that MULTIPLY to c and ADD to b. FOIL to expand. Difference of squares: a²−b² = (a+b)(a−b).",
    cue: "Factoring? Two numbers, multiply to the last term, add to the middle. To solve, set each factor equal to zero.",
    example: "x²+5x+6 = (x+2)(x+3), so x = −2 or −3."
  },
  m_functions: {
    subject: "Math",
    name: "Function notation",
    rule: "f(x) just means 'substitute the input for every x.' For f(g(x)), work INSIDE-OUT: do g first, then feed its answer into f.",
    cue: "See f( )? Whatever's in the parentheses replaces every x. Nested? Start with the innermost.",
    example: "f(x)=2x+1 → f(3)=7. f(g(x)): find g first, then plug into f.",
    formula: { key: "Function notation", expr: "f(input): swap the input in for every x. f(g(x)): do g first, then f." }
  },
  m_trig: {
    subject: "Math",
    name: "Right-triangle trig (SOHCAHTOA)",
    rule: "sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent. 'Opposite' and 'adjacent' are named from the angle you're looking at; the hypotenuse is always the longest side.",
    cue: "Label the three sides from the angle's point of view first. Then pick sin/cos/tan by which two sides the question gives or wants.",
    example: "Opposite 3, hypotenuse 5 → sin = 3/5. (The 3-4-5 triangle shows up constantly.)",
    formula: { key: "SOHCAHTOA", expr: "sin = opp/hyp   ·   cos = adj/hyp   ·   tan = opp/adj" }
  },
  m_probability: {
    subject: "Math",
    name: "Probability & counting",
    rule: "Probability = favorable ÷ total. Two events in a row (independent) → MULTIPLY. 'Or' (can't both happen) → ADD. Counting choices at each step → multiply them.",
    cue: "'Probability of' means favorable over total. 'And'/'both'/'in a row' → multiply. Count outfits/routes → multiply the options.",
    example: "2 red of 5 marbles → 2/5. Two coins both heads → ½·½ = ¼.",
    formula: { key: "Probability", expr: "P = favorable / total   ·   'and' → multiply   ·   count → multiply the choices" }
  },
  m_systems: {
    subject: "Math",
    name: "Systems of equations",
    rule: "Two equations, two unknowns. ELIMINATE: line them up and add or subtract to cancel one variable. Or SUBSTITUTE one equation into the other.",
    cue: "Two equations with x and y? If a variable matches, add/subtract to kill it. If one is already solved (y = …), substitute.",
    example: "x+y=10 and x−y=2 → add them: 2x=12, x=6, then y=4.",
    formula: { key: "Elimination / substitution", expr: "add or subtract the equations to cancel a variable — or plug one into the other" }
  }
});

ACT_QUESTIONS.push(
  // ---------------- Exponent & radical rules ----------------
  {
    id: "m_exponents-1", pattern: "m_exponents",
    passage: "x⁵ · x³ = ?",
    decode: "Same base multiplied together. They want it written as one power of x.",
    formula: { key: "Multiply like bases", expr: "xᵃ · xᵇ = xᵃ⁺ᵇ  (add the exponents)", data: "x⁵⁺³", answer: "x⁸" },
    choices: [
      { text: "x⁸", correct: true, why: "Same base, multiplying: ADD the exponents. 5 + 3 = 8." },
      { text: "x¹⁵", why: "Multiplied the exponents — that's only for a power raised to a power." },
      { text: "x²", why: "Subtracted — that's the rule for dividing, not multiplying." },
      { text: "2x⁸", why: "There's no 2: you don't add the bases, only combine the exponents." }
    ]
  },
  {
    id: "m_exponents-2", pattern: "m_exponents", fixedOrder: true,
    passage: "3⁻² = ?",
    formula: { key: "Negative exponent", expr: "x⁻ᵃ = 1 / xᵃ  (flip it)", data: "1 / 3²", answer: "1/9" },
    choices: [
      { text: "−9", why: "A negative exponent doesn't make a negative number — it flips to a fraction." },
      { text: "−6", why: "Negative exponents aren't multiplication by −1; they mean reciprocal." },
      { text: "1/9", correct: true, why: "3⁻² = 1/3² = 1/9. The negative flips it into the denominator." },
      { text: "6", why: "That's 3·2. The exponent means 3², then reciprocal." }
    ]
  },
  {
    id: "m_exponents-3", pattern: "m_exponents",
    passage: "(2x²)³ = ?",
    formula: { key: "Power of a product", expr: "cube EVERYTHING inside", data: "2³ · (x²)³ = 8 · x⁶", answer: "8x⁶" },
    choices: [
      { text: "8x⁶", correct: true, why: "Cube everything inside: 2³ = 8, and (x²)³ = x⁶." },
      { text: "2x⁶", why: "Forgot to cube the 2 — the exponent hits the whole thing inside." },
      { text: "6x⁶", why: "Multiplied 2·3 instead of raising 2 to the 3rd power." },
      { text: "8x⁵", why: "Added the exponents (2+3) instead of multiplying them." }
    ]
  },
  {
    id: "m_exponents-4", pattern: "m_exponents",
    passage: "x⁷ / x³ = ?",
    formula: { key: "Divide like bases", expr: "xᵃ / xᵇ = xᵃ⁻ᵇ  (subtract)", data: "x⁷⁻³", answer: "x⁴" },
    choices: [
      { text: "x⁴", correct: true, why: "Same base, dividing: SUBTRACT the exponents. 7 − 3 = 4." },
      { text: "x¹⁰", why: "Added — that's for multiplying, not dividing." },
      { text: "x²", why: "Divided the exponents (7÷3 ≈ 2); the rule is subtraction." },
      { text: "x²¹", why: "Multiplied the exponents." }
    ]
  },
  {
    id: "m_exponents-5", pattern: "m_exponents", fixedOrder: true,
    passage: "√50 in simplest form is:",
    formula: { key: "Simplify a radical", expr: "pull out the biggest perfect square", data: "√50 = √(25 · 2) = √25 · √2", answer: "5√2" },
    choices: [
      { text: "5√2", correct: true, why: "50 = 25·2, and √25 = 5, so √50 = 5√2." },
      { text: "2√5", why: "That's √20 (4·5). You need the biggest perfect-square factor of 50, which is 25." },
      { text: "10√5", why: "10² = 100, not 50 — this is far too big." },
      { text: "25√2", why: "Pulled out 25 instead of its square root, 5." }
    ]
  },
  {
    id: "m_exponents-6", pattern: "m_exponents", fixedOrder: true,
    passage: "8^(2/3) = ?",
    formula: { key: "Fractional exponent", expr: "bottom = root, top = power", data: "(∛8)² = 2²", answer: "4" },
    choices: [
      { text: "2", why: "That's just the cube root of 8. The '2' on top means square it too." },
      { text: "4", correct: true, why: "Denominator = root, numerator = power: (∛8)² = 2² = 4." },
      { text: "16", why: "That's 8²  then... no — the 3 on the bottom is a cube root, which shrinks it." },
      { text: "24", why: "That's 8·3. Fractional exponents are roots and powers, not multiplication." }
    ]
  },
  {
    id: "m_exponents-7", pattern: "m_exponents",
    passage: "(x⁴)³ = ?",
    formula: { key: "Power of a power", expr: "(xᵃ)ᵇ = xᵃᵇ  (multiply)", data: "x⁴ˣ³", answer: "x¹²" },
    choices: [
      { text: "x¹²", correct: true, why: "Power of a power: MULTIPLY the exponents. 4 · 3 = 12." },
      { text: "x⁷", why: "Added the exponents — that's the rule for multiplying like bases, not nesting." },
      { text: "x⁶⁴", why: "That's 4³ as an exponent; you multiply 4·3, not raise 4 to the 3rd." },
      { text: "x", why: "Subtracted (4−3) — that's the dividing rule." }
    ]
  },
  {
    id: "m_exponents-8", pattern: "m_exponents", fixedOrder: true,
    passage: "2³ · 2⁴ = ?",
    formula: { key: "Multiply like bases", expr: "add exponents, keep the base", data: "2³⁺⁴ = 2⁷", answer: "128" },
    choices: [
      { text: "16", why: "That's 2⁴ alone — you have to combine both factors." },
      { text: "128", correct: true, why: "Add exponents: 2³⁺⁴ = 2⁷ = 128." },
      { text: "512", why: "That's 2⁹ (added an extra) — 3+4 is 7, not 9." },
      { text: "4096", why: "That's 2¹² — multiplied the exponents instead of adding." }
    ]
  },

  // ---------------- Factoring & quadratics ----------------
  {
    id: "m_quadratic-1", pattern: "m_quadratic",
    passage: "Factor: x² + 7x + 12",
    formula: { key: "Factoring", expr: "two numbers that MULTIPLY to 12 and ADD to 7", data: "3 and 4  (3·4 = 12, 3+4 = 7)", answer: "(x + 3)(x + 4)" },
    diagram: { type: "areaModel", top: ["x", "+4"], left: ["x", "+3"], cells: [["x²", "4x"], ["3x", "12"]], note: "(x+3)(x+4) = x² + 7x + 12" },
    choices: [
      { text: "(x + 3)(x + 4)", correct: true, why: "3 and 4 multiply to 12 and add to 7. That's the whole trick." },
      { text: "(x + 2)(x + 6)", why: "2·6 = 12, but 2+6 = 8, not 7." },
      { text: "(x + 1)(x + 12)", why: "1·12 = 12, but they add to 13." },
      { text: "(x + 5)(x + 2)", why: "5+2 = 7, but 5·2 = 10, not 12 — both conditions have to hold." }
    ]
  },
  {
    id: "m_quadratic-2", pattern: "m_quadratic", fixedOrder: true,
    passage: "Solve: x² − 5x + 6 = 0",
    steps: [
      { do: "Find two numbers that multiply to +6 and add to −5.", why: "That's the whole game for factoring x² + bx + c." },
      { do: "−2 and −3 work: (−2)(−3) = 6 and (−2) + (−3) = −5. So it factors to (x − 2)(x − 3) = 0.", why: "Those two numbers drop straight into the parentheses." },
      { do: "Set each factor to zero: x − 2 = 0  or  x − 3 = 0.", why: "If two things multiply to zero, at least one of them must BE zero." },
      { do: "Solve each: x = 2  or  x = 3.", why: "Two answers — a quadratic can cross zero twice." }
    ],
    formula: { key: "Factor, then zero each part", expr: "(x − 2)(x − 3) = 0", data: "x − 2 = 0  or  x − 3 = 0", answer: "x = 2 or 3" },
    choices: [
      { text: "x = −2 or −3", why: "Sign flip: the factors are (x−2)(x−3), so the roots that make them zero are +2 and +3." },
      { text: "x = 2 or 3", correct: true, why: "Factors (x−2)(x−3): the roots are the values that make each factor zero." },
      { text: "x = 2 or −3", why: "Mixed signs give −6 for the product, not +6." },
      { text: "x = 1 or 6", why: "1·6 = 6 but they add to 7, not 5." }
    ]
  },
  {
    id: "m_quadratic-3", pattern: "m_quadratic",
    passage: "Expand: (x + 4)(x − 2)",
    decode: "Two binomials multiplied. They want the expanded form — every part of the first times every part of the second.",
    formula: { key: "FOIL / area model", expr: "multiply every part by every part", data: "x·x + x·(−2) + 4·x + 4·(−2)", answer: "x² + 2x − 8" },
    diagram: { type: "areaModel", top: ["x", "−2"], left: ["x", "+4"], cells: [["x²", "−2x"], ["4x", "−8"]], note: "(x+4)(x−2) = x² + 2x − 8" },
    choices: [
      { text: "x² + 2x − 8", correct: true, why: "FOIL: x² −2x +4x −8 = x² + 2x − 8." },
      { text: "x² − 2x − 8", why: "Sign slip on the middle: +4x and −2x give +2x, not −2x." },
      { text: "x² + 2x + 8", why: "The last term is 4·(−2) = −8, negative." },
      { text: "x² − 8", why: "Dropped the middle term — the outer and inner products don't cancel here." }
    ]
  },
  {
    id: "m_quadratic-4", pattern: "m_quadratic",
    passage: "Factor: x² − 9",
    formula: { key: "Difference of squares", expr: "a² − b² = (a + b)(a − b)", data: "x² − 3² = (x + 3)(x − 3)", answer: "(x + 3)(x − 3)" },
    diagram: { type: "areaModel", top: ["x", "−3"], left: ["x", "+3"], cells: [["x²", "−3x"], ["3x", "−9"]], note: "middle −3x + 3x cancels → x² − 9" },
    choices: [
      { text: "(x + 3)(x − 3)", correct: true, why: "Difference of squares: a²−b² = (a+b)(a−b), with b = 3." },
      { text: "(x − 3)²", why: "That expands to x² − 6x + 9 — it has a middle term this doesn't." },
      { text: "(x + 3)²", why: "That's x² + 6x + 9, also with a middle term." },
      { text: "(x − 9)(x + 1)", why: "Multiplies to −9 but adds to −8x — there's no middle term to match." }
    ]
  },
  {
    id: "m_quadratic-5", pattern: "m_quadratic", fixedOrder: true,
    passage: "Solve: x² = 16",
    formula: { key: "Square-root both sides", expr: "x = ±√16  (keep BOTH signs)", data: "4² = 16 and (−4)² = 16", answer: "x = ±4" },
    choices: [
      { text: "x = 4 only", why: "Missed a solution — a negative squared is also positive." },
      { text: "x = ±4", correct: true, why: "Both 4² and (−4)² equal 16. Squaring hides the sign, so keep both." },
      { text: "x = 8", why: "That's 16÷2. Undoing a square is a square root, not halving." },
      { text: "x = ±8", why: "8² = 64, not 16." }
    ]
  },
  {
    id: "m_quadratic-6", pattern: "m_quadratic", fixedOrder: true,
    passage: "Solve: x² + x − 12 = 0",
    formula: { key: "Factor, then zero each part", expr: "(x + 4)(x − 3) = 0", data: "−4·3 = −12,  −4 + 3 = +1", answer: "x = −4 or 3" },
    choices: [
      { text: "x = −4 or 3", correct: true, why: "Factors (x+4)(x−3): −4·3 = −12 and −4+3 = +1. ✓" },
      { text: "x = 4 or −3", why: "That gives a middle term of −1x, not +1x — signs are flipped." },
      { text: "x = 3 or 4", why: "3·4 = 12 (positive), but we need −12." },
      { text: "x = −3 or −4", why: "That multiplies to +12, wrong sign." }
    ]
  },
  {
    id: "m_quadratic-7", pattern: "m_quadratic",
    passage: "Expand: (x − 5)²",
    formula: { key: "Square of a difference", expr: "(a − b)² = a² − 2ab + b²", data: "x² − 2·5·x + 5²", answer: "x² − 10x + 25" },
    diagram: { type: "areaModel", top: ["x", "−5"], left: ["x", "−5"], cells: [["x²", "−5x"], ["−5x", "25"]], note: "(x−5)² = x² − 10x + 25" },
    choices: [
      { text: "x² − 10x + 25", correct: true, why: "(a−b)² = a² − 2ab + b²: x² − 2(5)x + 25." },
      { text: "x² − 25", why: "That's (x−5)(x+5). A square keeps the middle term." },
      { text: "x² + 25", why: "Missing the −10x middle term entirely." },
      { text: "x² − 10x − 25", why: "The last term is (−5)² = +25, positive." }
    ]
  },
  {
    id: "m_quadratic-8", pattern: "m_quadratic",
    passage: "Factor: 2x² + 7x + 3",
    formula: { key: "Factoring (lead ≠ 1)", expr: "guess factors, then FOIL to check", data: "(2x + 1)(x + 3) = 2x² + 6x + x + 3", answer: "2x² + 7x + 3" },
    diagram: { type: "areaModel", top: ["x", "+3"], left: ["2x", "+1"], cells: [["2x²", "6x"], ["x", "3"]], note: "(2x+1)(x+3) = 2x² + 7x + 3" },
    choices: [
      { text: "(2x + 1)(x + 3)", correct: true, why: "Check by FOIL: 2x² + 6x + x + 3 = 2x² + 7x + 3. ✓" },
      { text: "(2x + 3)(x + 1)", why: "FOILs to 2x² + 5x + 3 — the middle term is wrong." },
      { text: "(2x − 1)(x − 3)", why: "Gives 2x² − 7x + 3 — right numbers, wrong signs." },
      { text: "(x + 1)(x + 3)", why: "That's only x² + 4x + 3 — it forgets the leading 2." }
    ]
  },

  // ---------------- Function notation ----------------
  {
    id: "m_functions-1", pattern: "m_functions", fixedOrder: true,
    passage: "If f(x) = 3x − 2, what is f(4)?",
    decode: "A rule and an input. They want the output — put 4 wherever x appears in the rule.",
    formula: { key: "Substitute the input", expr: "replace every x with the input", data: "3 · 4 − 2", answer: "10" },
    diagram: { type: "functionMachine", input: "4", rule: "3x − 2", output: "10" },
    choices: [
      { text: "2", why: "That's 3 − ... no: substitute 4 for x, don't subtract from 3." },
      { text: "10", correct: true, why: "f(4) = 3(4) − 2 = 12 − 2 = 10." },
      { text: "12", why: "That's just 3·4 — you still subtract the 2." },
      { text: "14", why: "Added 2 instead of subtracting it." }
    ]
  },
  {
    id: "m_functions-2", pattern: "m_functions", fixedOrder: true,
    passage: "If f(x) = x² + 1, what is f(−3)?",
    formula: { key: "Substitute", expr: "replace every x with −3", data: "(−3)² + 1 = 9 + 1", answer: "10" },
    diagram: { type: "functionMachine", input: "−3", rule: "x² + 1", output: "10" },
    choices: [
      { text: "−8", why: "Treated (−3)² as −9. A negative squared is POSITIVE 9." },
      { text: "8", why: "Subtracted instead of adding: 9 − 1. The function adds 1." },
      { text: "10", correct: true, why: "(−3)² + 1 = 9 + 1 = 10." },
      { text: "−10", why: "Kept the whole thing negative — squaring removes the sign." }
    ]
  },
  {
    id: "m_functions-3", pattern: "m_functions", fixedOrder: true,
    passage: "If f(x) = 2x and g(x) = x + 5, what is f(g(2))?",
    formula: { key: "Composition (inside-out)", expr: "do g first, then feed it into f", data: "g(2) = 7,  then f(7) = 2·7", answer: "14" },
    choices: [
      { text: "9", why: "That's g(f(2)) — you did f first. Inside-out means g first." },
      { text: "12", why: "Used g(2) then added instead of multiplying by 2." },
      { text: "14", correct: true, why: "Inner first: g(2) = 7. Then f(7) = 2·7 = 14." },
      { text: "24", why: "That's f(g(2)) with g(2) mistaken as 12." }
    ]
  },
  {
    id: "m_functions-4", pattern: "m_functions", fixedOrder: true,
    passage: "If f(x) = x² and g(x) = x − 1, what is g(f(3))?",
    formula: { key: "Composition (inside-out)", expr: "do f first, then feed it into g", data: "f(3) = 9,  then g(9) = 9 − 1", answer: "8" },
    choices: [
      { text: "4", why: "That's f(g(3)) = (3−1)² — wrong order. Do f first here." },
      { text: "6", why: "Did 3² then... 9−1 is 8, not 6. This mixes up the steps." },
      { text: "8", correct: true, why: "Inner first: f(3) = 9. Then g(9) = 9 − 1 = 8." },
      { text: "9", why: "That's just f(3) — you still have to apply g." }
    ]
  },
  {
    id: "m_functions-5", pattern: "m_functions", fixedOrder: true,
    passage: "If f(x) = 5x + 3 and f(a) = 23, what is a?",
    formula: { key: "Work backward", expr: "set the rule equal to 23 and solve", data: "5a + 3 = 23 → 5a = 20", answer: "a = 4" },
    choices: [
      { text: "4", correct: true, why: "5a + 3 = 23 → 5a = 20 → a = 4." },
      { text: "5", why: "Forgot the +3: 25÷5. Subtract 3 first." },
      { text: "20", why: "That's 5a, one step early — divide by 5." },
      { text: "26", why: "Added 3 instead of subtracting it before dividing." }
    ]
  },
  {
    id: "m_functions-6", pattern: "m_functions", fixedOrder: true,
    passage: "If f(x) = x² − 4x, what is f(5)?",
    formula: { key: "Substitute", expr: "replace every x with 5", data: "5² − 4·5 = 25 − 20", answer: "5" },
    diagram: { type: "functionMachine", input: "5", rule: "x² − 4x", output: "5" },
    choices: [
      { text: "−5", why: "Reversed the subtraction: it's 25 − 20, not 20 − 25." },
      { text: "5", correct: true, why: "5² − 4(5) = 25 − 20 = 5." },
      { text: "21", why: "Subtracted 4 instead of 4x: 25 − 4. The 4 is multiplied by x." },
      { text: "45", why: "Added instead of subtracted: 25 + 20." }
    ]
  },
  {
    id: "m_functions-7", pattern: "m_functions", fixedOrder: true,
    passage: "If h(x) = |x − 3|, what is h(−2)?",
    formula: { key: "Absolute value = distance", expr: "|x − 3| = how far x is from 3", data: "from −2 to 3 on the number line", answer: "5" },
    diagram: { type: "numberLine", min: -4, max: 5, points: [{ x: -2, label: "−2", color: "#3987e5" }, { x: 3, label: "3", color: "#0ca30c" }], distance: { from: -2, to: 3, label: "5" }, caption: "|−2 − 3| = distance = 5" },
    choices: [
      { text: "−5", why: "Absolute value can't be negative — the bars make it positive." },
      { text: "−1", why: "That's |−2| − 3 = 2 − 3. The subtraction happens INSIDE the bars." },
      { text: "1", why: "Computed 3 − 2 instead of |−2 − 3|." },
      { text: "5", correct: true, why: "|−2 − 3| = |−5| = 5." }
    ]
  },
  {
    id: "m_functions-8", pattern: "m_functions", fixedOrder: true,
    passage: "If f(x) = x/2 + 6, what is f(8)?",
    formula: { key: "Substitute", expr: "replace every x with 8 (only x is halved)", data: "8/2 + 6 = 4 + 6", answer: "10" },
    diagram: { type: "functionMachine", input: "8", rule: "x/2 + 6", output: "10" },
    choices: [
      { text: "4", why: "That's just 8/2 — you still add 6." },
      { text: "7", why: "Divided the whole thing: (8+6)/2. Only the x is halved." },
      { text: "10", correct: true, why: "8/2 + 6 = 4 + 6 = 10." },
      { text: "14", why: "Added first, forgot to halve: 8 + 6." }
    ]
  },

  // ---------------- Right-triangle trig ----------------
  {
    id: "m_trig-1", pattern: "m_trig", fixedOrder: true,
    passage: "In a right triangle, the side opposite angle θ is 3, the adjacent side is 4, and the hypotenuse is 5. What is sin θ?",
    decode: "A right triangle with all three sides labeled. They want one specific ratio — sine — so you only need two of the sides.",
    formula: { key: "SOHCAHTOA", expr: "sin = opposite / hypotenuse", data: "opposite 3, hypotenuse 5", answer: "3/5" },
    diagram: { type: "rightTriangle", a: 4, b: 3, c: 5, aLabel: "adj 4", bLabel: "opp 3", cLabel: "hyp 5", angle: true, note: "sin θ = opp / hyp = 3/5" },
    choices: [
      { text: "3/5", correct: true, why: "SOH: sine = opposite / hypotenuse = 3/5." },
      { text: "3/4", why: "That's tangent (opposite/adjacent), not sine." },
      { text: "4/5", why: "That's cosine (adjacent/hypotenuse)." },
      { text: "5/3", why: "Flipped — sine is opposite OVER hypotenuse, not the reverse." }
    ]
  },
  {
    id: "m_trig-2", pattern: "m_trig", fixedOrder: true,
    passage: "Same triangle (opposite 3, adjacent 4, hypotenuse 5). What is tan θ?",
    formula: { key: "SOHCAHTOA", expr: "tan = opposite / adjacent", data: "opposite 3, adjacent 4", answer: "3/4" },
    diagram: { type: "rightTriangle", a: 4, b: 3, c: 5, aLabel: "adj 4", bLabel: "opp 3", cLabel: "hyp 5", angle: true, note: "tan θ = opp / adj = 3/4" },
    choices: [
      { text: "3/4", correct: true, why: "TOA: tangent = opposite / adjacent = 3/4." },
      { text: "3/5", why: "That's sine (opposite/hypotenuse)." },
      { text: "4/3", why: "Flipped — tangent is opposite over adjacent." },
      { text: "4/5", why: "That's cosine." }
    ]
  },
  {
    id: "m_trig-3", pattern: "m_trig", fixedOrder: true,
    passage: "Same triangle (opposite 3, adjacent 4, hypotenuse 5). What is cos θ?",
    formula: { key: "SOHCAHTOA", expr: "cos = adjacent / hypotenuse", data: "adjacent 4, hypotenuse 5", answer: "4/5" },
    diagram: { type: "rightTriangle", a: 4, b: 3, c: 5, aLabel: "adj 4", bLabel: "opp 3", cLabel: "hyp 5", angle: true, note: "cos θ = adj / hyp = 4/5" },
    choices: [
      { text: "3/5", why: "That's sine — cosine uses the ADJACENT side." },
      { text: "3/4", why: "That's tangent." },
      { text: "4/5", correct: true, why: "CAH: cosine = adjacent / hypotenuse = 4/5." },
      { text: "5/4", why: "Flipped — cosine is adjacent over hypotenuse." }
    ]
  },
  {
    id: "m_trig-4", pattern: "m_trig", fixedOrder: true,
    passage: "A right triangle has legs 5 and 12 and hypotenuse 13. What is the sine of the angle opposite the side of length 5?",
    formula: { key: "SOHCAHTOA", expr: "sin = opposite / hypotenuse", data: "opposite 5, hypotenuse 13", answer: "5/13" },
    diagram: { type: "rightTriangle", a: 12, b: 5, c: 13, aLabel: "adj 12", bLabel: "opp 5", cLabel: "hyp 13", angle: true, note: "sin θ = opp / hyp = 5/13" },
    choices: [
      { text: "5/13", correct: true, why: "Opposite that angle is 5, hypotenuse is 13: sin = 5/13." },
      { text: "12/13", why: "12 is ADJACENT to that angle, so 12/13 is its cosine." },
      { text: "5/12", why: "That's the tangent (opposite/adjacent)." },
      { text: "13/5", why: "Flipped the sine ratio." }
    ]
  },
  {
    id: "m_trig-5", pattern: "m_trig", fixedOrder: true,
    passage: "A ladder leans against a wall, reaching 12 ft up, with its base 5 ft from the wall (hypotenuse 13 ft). What is the tangent of the angle the ladder makes with the ground?",
    formula: { key: "SOHCAHTOA", expr: "tan = opposite / adjacent", data: "opposite (height) 12, adjacent (base) 5", answer: "12/5" },
    diagram: { type: "rightTriangle", a: 5, b: 12, c: 13, aLabel: "base 5", bLabel: "height 12", cLabel: "ladder 13", angle: true, note: "tan θ = opp / adj = 12/5" },
    choices: [
      { text: "5/13", why: "That's the cosine (adjacent/hypotenuse) of the ground angle." },
      { text: "5/12", why: "Flipped — tangent is opposite (height) over adjacent (base)." },
      { text: "12/5", correct: true, why: "From the ground angle, opposite = 12 (up the wall), adjacent = 5 (the base). tan = 12/5." },
      { text: "12/13", why: "That's the sine (opposite/hypotenuse), not the tangent." }
    ]
  },
  {
    id: "m_trig-6", pattern: "m_trig", fixedOrder: true,
    passage: "In a right triangle, one leg (opposite θ) is 6 and the hypotenuse is 10. What is sin θ?",
    formula: { key: "SOHCAHTOA", expr: "sin = opposite / hypotenuse", data: "opposite 6, hypotenuse 10 → 6/10", answer: "3/5" },
    diagram: { type: "rightTriangle", a: 8, b: 6, c: 10, aLabel: "adj 8", bLabel: "opp 6", cLabel: "hyp 10", angle: true, note: "sin θ = 6/10 = 3/5" },
    choices: [
      { text: "3/5", correct: true, why: "sin = opposite/hypotenuse = 6/10 = 3/5." },
      { text: "3/4", why: "That's the tangent (the adjacent side is 8, so 6/8 = 3/4)." },
      { text: "4/5", why: "That's cosine — the adjacent side (8) over 10." },
      { text: "5/3", why: "Flipped the sine ratio." }
    ]
  },
  {
    id: "m_trig-7", pattern: "m_trig", fixedOrder: true,
    passage: "What is sin 30°?",
    formula: { key: "Special angle", expr: "memorize the big three: sin 30° = 1/2", answer: "1/2  (sin 45° = √2/2, sin 60° = √3/2)" },
    choices: [
      { text: "1/2", correct: true, why: "A memorized special angle: sin 30° = 1/2. Worth knowing cold." },
      { text: "√3/2", why: "That's sin 60° (or cos 30°)." },
      { text: "√2/2", why: "That's sin 45°." },
      { text: "1", why: "That's sin 90°." }
    ]
  },
  {
    id: "m_trig-8", pattern: "m_trig", fixedOrder: true,
    passage: "In SOHCAHTOA, which ratio equals adjacent ÷ hypotenuse?",
    formula: { key: "SOHCAHTOA", expr: "CAH: Cosine = Adjacent / Hypotenuse", answer: "cosine" },
    choices: [
      { text: "sine", why: "Sine is OPPOSITE over hypotenuse (the SOH)." },
      { text: "cosine", correct: true, why: "CAH: Cosine = Adjacent / Hypotenuse." },
      { text: "tangent", why: "Tangent is opposite over adjacent (the TOA)." },
      { text: "none of these", why: "It's exactly cosine — that's what CAH stands for." }
    ]
  },

  // ---------------- Probability & counting ----------------
  {
    id: "m_probability-1", pattern: "m_probability", fixedOrder: true,
    passage: "A bag holds 3 red and 5 blue marbles. What is the probability of drawing a red one?",
    formula: { key: "Probability", expr: "favorable ÷ TOTAL (not red-to-blue)", data: "3 red ÷ 8 marbles", answer: "3/8" },
    diagram: { type: "probGrid", count: 8, favIdx: [0, 1, 2], favColor: "#fab219", otherColor: "#3987e5", perRow: 8, caption: "3 red (gold) of 8 total = 3/8" },
    choices: [
      { text: "1/3", why: "That's red-to-blue as a ratio (3:5 ≈ ...), not the probability. Use the TOTAL, 8." },
      { text: "3/8", correct: true, why: "Favorable ÷ total = 3 red out of 8 marbles." },
      { text: "3/5", why: "That compares red to blue, not red to the whole bag." },
      { text: "5/8", why: "That's the probability of BLUE." }
    ]
  },
  {
    id: "m_probability-2", pattern: "m_probability", fixedOrder: true,
    passage: "A fair coin is flipped twice. What is the probability of getting heads both times?",
    formula: { key: "Independent events", expr: "P(A and B) = P(A) × P(B)", data: "½ × ½  (outcomes: HH, HT, TH, TT)", answer: "1/4" },
    diagram: { type: "probGrid", count: 4, favIdx: [0], perRow: 4, caption: "HH is 1 of the 4 outcomes = 1/4" },
    choices: [
      { text: "1/4", correct: true, why: "Independent events in a row: multiply. ½ · ½ = ¼." },
      { text: "1/2", why: "That's one flip — two flips in a row multiply." },
      { text: "1/3", why: "There are 4 equally likely outcomes (HH, HT, TH, TT), not 3." },
      { text: "3/4", why: "That's the chance of NOT getting two heads." }
    ]
  },
  {
    id: "m_probability-3", pattern: "m_probability", fixedOrder: true,
    passage: "A standard die is rolled once. What is the probability of an even number?",
    formula: { key: "Probability", expr: "favorable ÷ total", data: "evens {2, 4, 6} = 3 of 6", answer: "1/2" },
    diagram: { type: "probGrid", count: 6, favIdx: [1, 3, 5], perRow: 6, caption: "3 favorable of 6 = 1/2" },
    choices: [
      { text: "1/6", why: "That's the chance of one specific number, not all three evens." },
      { text: "1/3", why: "Only counted... there are three evens (2,4,6) out of six." },
      { text: "1/2", correct: true, why: "Evens are 2, 4, 6 — that's 3 of 6 = 1/2." },
      { text: "2/3", why: "That would be 4 of 6; there are only three even faces." }
    ]
  },
  {
    id: "m_probability-4", pattern: "m_probability", fixedOrder: true,
    passage: "A café offers 4 kinds of bread and 3 kinds of filling. How many different sandwiches (one bread, one filling) are possible?",
    formula: { key: "Counting principle", expr: "multiply the choices at each step", data: "4 breads × 3 fillings", answer: "12" },
    diagram: { type: "probGrid", count: 12, favIdx: [], perRow: 3, caption: "4 rows × 3 columns = 12 combinations" },
    choices: [
      { text: "7", why: "Added the choices. Counting combinations means MULTIPLY." },
      { text: "12", correct: true, why: "Counting principle: 4 breads × 3 fillings = 12." },
      { text: "1", why: "There are many possible sandwiches, not one." },
      { text: "43", why: "That just glued the two numbers together." }
    ]
  },
  {
    id: "m_probability-5", pattern: "m_probability", fixedOrder: true,
    passage: "A jar has 5 red, 3 green, and 2 blue marbles. What is the probability of drawing a marble that is NOT blue?",
    formula: { key: "Probability", expr: "favorable ÷ total (not-blue = red + green)", data: "(5 + 3) ÷ 10", answer: "8/10 = 4/5" },
    diagram: { type: "probGrid", count: 10, favIdx: [0, 1, 2, 3, 4, 5, 6, 7], favColor: "#fab219", otherColor: "#3987e5", perRow: 10, caption: "8 not-blue (gold) of 10 = 4/5" },
    choices: [
      { text: "1/5", why: "That's the chance it IS blue (2/10) — the question asks for not blue." },
      { text: "3/10", why: "That's green only. 'Not blue' means red AND green together." },
      { text: "1/2", why: "That's red only (5/10). 'Not blue' also includes the 3 green." },
      { text: "4/5", correct: true, why: "Not blue = 5 + 3 = 8 marbles of 10 = 4/5." }
    ]
  },
  {
    id: "m_probability-6", pattern: "m_probability", fixedOrder: true,
    passage: "A spinner is divided into 8 equal sections numbered 1–8. What is the probability of landing on a number greater than 5?",
    formula: { key: "Probability", expr: "favorable ÷ total", data: "greater than 5 = {6, 7, 8} = 3 of 8", answer: "3/8" },
    diagram: { type: "probGrid", count: 8, favIdx: [5, 6, 7], perRow: 8, caption: "3 sections (6,7,8) of 8 = 3/8" },
    choices: [
      { text: "3/8", correct: true, why: "Greater than 5 means 6, 7, 8 — three sections of eight." },
      { text: "1/2", why: "That would be 4 of 8; 'greater than 5' doesn't include 5 itself." },
      { text: "5/8", why: "That counts 1 through 5, the opposite set." },
      { text: "3/5", why: "Used 5 as the total instead of 8." }
    ]
  },
  {
    id: "m_probability-7", pattern: "m_probability", fixedOrder: true,
    passage: "Two standard dice are rolled. What is the probability that both show a 6?",
    decode: "Two dice at once. They want the chance BOTH land on 6 — an 'and', so the two chances multiply.",
    formula: { key: "Independent events", expr: "P(A and B) = P(A) × P(B)", data: "1/6 × 1/6", answer: "1/36" },
    diagram: { type: "probGrid", count: 36, favIdx: [35], favColor: "#fab219", perRow: 6, caption: "1 favorable of 36 = 1/36" },
    choices: [
      { text: "1/36", correct: true, why: "Independent: (1/6) · (1/6) = 1/36." },
      { text: "1/6", why: "That's one die — two dice multiply." },
      { text: "1/12", why: "Added the denominators (6+6) instead of multiplying." },
      { text: "2/6", why: "You don't add the two 1/6 chances for an 'and' event." }
    ]
  },
  {
    id: "m_probability-8", pattern: "m_probability", fixedOrder: true,
    passage: "A class has 12 girls and 8 boys. One student is chosen at random. What is the probability the student is a boy?",
    formula: { key: "Probability", expr: "favorable ÷ TOTAL (not the other group)", data: "8 boys ÷ 20 students", answer: "8/20 = 2/5" },
    diagram: { type: "probGrid", count: 20, favIdx: [0, 1, 2, 3, 4, 5, 6, 7], favColor: "#3987e5", otherColor: "#4a3aa7", perRow: 10, caption: "8 boys of 20 total = 2/5" },
    choices: [
      { text: "2/5", correct: true, why: "8 boys out of 20 total = 8/20 = 2/5." },
      { text: "2/3", why: "That's boys-to-girls as a ratio (8:12), not out of the whole class." },
      { text: "8/12", why: "Compared boys to girls instead of to the total of 20." },
      { text: "3/5", why: "That's the probability of a GIRL (12/20)." }
    ]
  },

  // ---------------- Systems of equations ----------------
  {
    id: "m_systems-1", pattern: "m_systems", fixedOrder: true,
    passage: "x + y = 10 and x − y = 2. What is x?",
    decode: "Two equations sharing x and y. They want the single x that makes BOTH true at once.",
    steps: [
      { do: "Line the two up: x + y = 10, and x − y = 2.", why: "Stacked, the matching pieces can cancel." },
      { do: "Add them straight down: +y and −y cancel, leaving 2x = 12.", why: "Adding kills y in one move — that's elimination." },
      { do: "Divide both sides by 2: x = 6.", why: "Undo the 'times 2' to free x." },
      { do: "Back-substitute: 6 + y = 10, so y = 4. Check: 6 − 4 = 2. ✓", why: "Find the other letter and confirm both equations hold." }
    ],
    formula: { key: "Elimination", expr: "add the equations to cancel a variable", data: "(x+y) + (x−y) = 10 + 2 → 2x = 12", answer: "x = 6  (then y = 4)" },
    diagram: { type: "systemLines", lines: [{ m: -1, b: 10 }, { m: 1, b: -2 }], solution: [6, 4], note: "x+y=10 and x−y=2 cross at (6, 4)" },
    choices: [
      { text: "4", why: "That's y. Adding the equations solves for x first." },
      { text: "5", why: "That's just 10÷2 — the two equations don't split evenly like that." },
      { text: "6", correct: true, why: "Add the equations: 2x = 12, so x = 6 (and y = 4)." },
      { text: "8", why: "That's x + ... check: if x were 8, x−y=2 gives y=6, but 8+6 ≠ 10." }
    ]
  },
  {
    id: "m_systems-2", pattern: "m_systems", fixedOrder: true,
    passage: "2x + y = 11 and y = x + 2. What is x?",
    steps: [
      { do: "Write both down: 2x + y = 11, and y = x + 2.", why: "See exactly what you've got before touching anything." },
      { do: "The second one already says y = x + 2. Put (x + 2) in place of y in the first: 2x + (x + 2) = 11.", why: "Substitution — trade y for what it equals, so there's only ONE letter left to deal with." },
      { do: "Add the x's: 2x + x = 3x. Now it reads 3x + 2 = 11.", why: "2x and x are like terms — same letter, so they just combine. (This is the exact step you got right.)" },
      { do: "Subtract 2 from both sides: 3x = 9.", why: "Peel off everything sitting around x. Do the same to both sides so it stays balanced." },
      { do: "Divide both sides by 3: x = 3.", why: "3x means 3 times x, so divide by 3 to set x free — divide by 3, not 3 ÷ x." },
      { do: "Check: y = 3 + 2 = 5, and 2(3) + 5 = 11. ✓", why: "Plug back in — when both equations are happy, you nailed it." }
    ],
    formula: { key: "Substitution", expr: "y is already solved — plug it in", data: "2x + (x + 2) = 11 → 3x = 9", answer: "x = 3  (y = 5)" },
    diagram: { type: "systemLines", lines: [{ m: -2, b: 11 }, { m: 1, b: 2 }], solution: [3, 5], note: "the two lines cross at (3, 5)" },
    choices: [
      { text: "2", why: "Substitute and check: 2(2) + (4) = 8, not 11." },
      { text: "3", correct: true, why: "Substitute y: 2x + (x + 2) = 11 → 3x = 9 → x = 3." },
      { text: "4", why: "Gives 2(4) + 6 = 14, too big." },
      { text: "5", why: "Gives 2(5) + 7 = 17 — way over 11." }
    ]
  },
  {
    id: "m_systems-3", pattern: "m_systems", fixedOrder: true,
    passage: "x + y = 7 and 2x + y = 11. What is y?",
    formula: { key: "Elimination", expr: "subtract to cancel y", data: "(2x+y) − (x+y) = 11 − 7 → x = 4", answer: "y = 7 − 4 = 3" },
    diagram: { type: "systemLines", lines: [{ m: -1, b: 7 }, { m: -2, b: 11 }], solution: [4, 3], note: "the two lines cross at (4, 3)" },
    choices: [
      { text: "1", why: "If y were 1, then x = 6, but 2(6) + 1 = 13, not 11." },
      { text: "3", correct: true, why: "Subtract the first from the second: x = 4, so y = 3." },
      { text: "4", why: "That's x, not y." },
      { text: "7", why: "That's the first equation's total, not y alone." }
    ]
  },
  {
    id: "m_systems-4", pattern: "m_systems", fixedOrder: true,
    passage: "3x − y = 5 and x + y = 7. What is y?",
    formula: { key: "Elimination", expr: "add to cancel y", data: "(3x−y) + (x+y) = 5 + 7 → 4x = 12 → x = 3", answer: "y = 7 − 3 = 4" },
    diagram: { type: "systemLines", lines: [{ m: 3, b: -5 }, { m: -1, b: 7 }], solution: [3, 4], note: "the two lines cross at (3, 4)" },
    choices: [
      { text: "2", why: "That's not consistent: if y=2 then x=5 from the first, but 5+2 ≠ 7." },
      { text: "3", why: "That's x. Add the equations to get x first, then solve for y." },
      { text: "4", correct: true, why: "Add them: 4x = 12 → x = 3, then y = 7 − 3 = 4." },
      { text: "7", why: "That's the second equation's total." }
    ]
  },
  {
    id: "m_systems-5", pattern: "m_systems", fixedOrder: true,
    passage: "Two apples and one banana cost $5. One apple and one banana cost $3. How much is one apple?",
    formula: { key: "Elimination", expr: "subtract the two equations", data: "(2a + b) − (a + b) = 5 − 3", answer: "a = $2" },
    choices: [
      { text: "$1", why: "That's the banana. Subtract the equations to isolate the apple." },
      { text: "$2", correct: true, why: "Subtract: (2a + b) − (a + b) = 5 − 3 → a = 2." },
      { text: "$2.50", why: "That's just 5÷2 — it ignores the banana in the first equation." },
      { text: "$3", why: "That's the second total, not the apple's price." }
    ]
  },
  {
    id: "m_systems-6", pattern: "m_systems", fixedOrder: true,
    passage: "x = 2y and x + y = 12. What is x?",
    formula: { key: "Substitution", expr: "x is already solved — plug it in", data: "2y + y = 12 → 3y = 12 → y = 4", answer: "x = 2·4 = 8" },
    diagram: { type: "systemLines", lines: [{ m: 0.5, b: 0 }, { m: -1, b: 12 }], solution: [8, 4], note: "x = 2y and x + y = 12 cross at (8, 4)" },
    choices: [
      { text: "4", why: "That's y. Once you find y = 4, x = 2y = 8." },
      { text: "6", why: "That's 12÷2, but x and y aren't equal here — x is twice y." },
      { text: "8", correct: true, why: "Substitute: 2y + y = 12 → y = 4 → x = 8." },
      { text: "12", why: "That's the total x + y, not x by itself." }
    ]
  },
  {
    id: "m_systems-7", pattern: "m_systems", fixedOrder: true,
    passage: "4x + 3y = 18 and x = 3. What is y?",
    formula: { key: "Substitution", expr: "x is given — plug it in", data: "4·3 + 3y = 18 → 12 + 3y = 18 → 3y = 6", answer: "y = 2" },
    choices: [
      { text: "2", correct: true, why: "Substitute x = 3: 12 + 3y = 18 → 3y = 6 → y = 2." },
      { text: "3", why: "That's x, which was already given." },
      { text: "6", why: "That's 3y, one step short — divide by 3." },
      { text: "10", why: "Forgot to subtract the 12 before dividing." }
    ]
  },
  {
    id: "m_systems-8", pattern: "m_systems", fixedOrder: true,
    passage: "Two numbers add to 20 and differ by 6. What is the larger number?",
    formula: { key: "Set up a system", expr: "x + y = 20,  x − y = 6,  then add", data: "2x = 26", answer: "x = 13  (y = 7)" },
    diagram: { type: "systemLines", lines: [{ m: -1, b: 20 }, { m: 1, b: -6 }], solution: [13, 7], note: "the two conditions cross at (13, 7)" },
    choices: [
      { text: "7", why: "That's the smaller number." },
      { text: "10", why: "That's half of 20 — the two numbers aren't equal, they differ by 6." },
      { text: "13", correct: true, why: "Add the system (x+y=20, x−y=6): 2x = 26 → x = 13." },
      { text: "14", why: "Close, but 14 + 6... the pair would be 14 and 8, which sum to 22, not 20." }
    ]
  }
);

const BANK_VERSION = "v8 · 2026-07-25";

// original 12 patterns are the English section
Object.values(ACT_PATTERNS).forEach(p => { if (!p.subject) p.subject = "English"; });
