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

// original 12 patterns are the English section
Object.values(ACT_PATTERNS).forEach(p => { if (!p.subject) p.subject = "English"; });
