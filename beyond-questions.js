// ============================================================
// BEYOND THE ACT — sourced practice for college-level subjects.
//
// Provenance, stated plainly:
//   * Every QUESTION here is original, written for this app. Nothing is
//     copied from a textbook, and no passage is reproduced.
//   * Every question names a SOURCE: a free, checkable reference where the
//     same idea is taught properly, by people who teach it for a living.
//     Citing a source is not copying it — that distinction is why this can
//     ship under the app's MIT licence while the references keep their own.
//   * Element data is not authored at all. It is the IUPAC/CIAAW standard
//     atomic weight table, read from the published source.
//
// Every URL below returned HTTP 200 when this file was written (2026-08-01).
// ============================================================

const BEYOND_BANK_VERSION = "beyond-v1 · 2026-08-01";

// ---------- the references themselves ----------
const BEYOND_SOURCES = {
  osCalcLimit: { book: "OpenStax, Calculus Volume 1", section: "2.2 The Limit of a Function",
    url: "https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function" },
  osCalcDeriv: { book: "OpenStax, Calculus Volume 1", section: "3.1 Defining the Derivative",
    url: "https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative" },
  osCalcRules: { book: "OpenStax, Calculus Volume 1", section: "3.3 Differentiation Rules",
    url: "https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules" },
  osCalcRates: { book: "OpenStax, Calculus Volume 1", section: "3.4 Derivatives as Rates of Change",
    url: "https://openstax.org/books/calculus-volume-1/pages/3-4-derivatives-as-rates-of-change" },
  osCalcChain: { book: "OpenStax, Calculus Volume 1", section: "3.6 The Chain Rule",
    url: "https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule" },
  osCalcRelated: { book: "OpenStax, Calculus Volume 1", section: "4.1 Related Rates",
    url: "https://openstax.org/books/calculus-volume-1/pages/4-1-related-rates" },
  osCalcIntegral: { book: "OpenStax, Calculus Volume 1", section: "5.2 The Definite Integral",
    url: "https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral" },
  osTrigAngles: { book: "OpenStax, Algebra and Trigonometry 2e", section: "7.1 Angles",
    url: "https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-1-angles" },
  osTrigRight: { book: "OpenStax, Algebra and Trigonometry 2e", section: "7.2 Right Triangle Trigonometry",
    url: "https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-2-right-triangle-trigonometry" },
  osTrigUnit: { book: "OpenStax, Algebra and Trigonometry 2e", section: "7.3 Unit Circle",
    url: "https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-3-unit-circle" },
  osTrigGraphs: { book: "OpenStax, Algebra and Trigonometry 2e", section: "8.1 Graphs of the Sine and Cosine Functions",
    url: "https://openstax.org/books/algebra-and-trigonometry-2e/pages/8-1-graphs-of-the-sine-and-cosine-functions" },
  osTrigSines: { book: "OpenStax, Algebra and Trigonometry 2e", section: "10.1 Non-right Triangles: Law of Sines",
    url: "https://openstax.org/books/algebra-and-trigonometry-2e/pages/10-1-non-right-triangles-law-of-sines" },
  osTrigCosines: { book: "OpenStax, Precalculus 2e", section: "8.2 Non-right Triangles: Law of Cosines",
    url: "https://openstax.org/books/precalculus-2e/pages/8-2-non-right-triangles-law-of-cosines" },
  osChemMole: { book: "OpenStax, Chemistry 2e", section: "3.1 Formula Mass and the Mole Concept",
    url: "https://openstax.org/books/chemistry-2e/pages/3-1-formula-mass-and-the-mole-concept" },
  osChemBalance: { book: "OpenStax, Chemistry 2e", section: "4.1 Writing and Balancing Chemical Equations",
    url: "https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations" },
  osChemPeriodic: { book: "OpenStax, Chemistry 2e", section: "6.5 Periodic Variations in Element Properties",
    url: "https://openstax.org/books/chemistry-2e/pages/6-5-periodic-variations-in-element-properties" },
  osChemCovalent: { book: "OpenStax, Chemistry 2e", section: "7.2 Covalent Bonding",
    url: "https://openstax.org/books/chemistry-2e/pages/7-2-covalent-bonding" },
  osChemPh: { book: "OpenStax, Chemistry 2e", section: "14.2 pH and pOH",
    url: "https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh" },
  osBioMendel: { book: "OpenStax, Biology 2e", section: "12.1 Mendel's Experiments and the Laws of Probability",
    url: "https://openstax.org/books/biology-2e/pages/12-1-mendels-experiments-and-the-laws-of-probability" },
  osBioTranscription: { book: "OpenStax, Biology 2e", section: "15.3 Eukaryotic Transcription",
    url: "https://openstax.org/books/biology-2e/pages/15-3-eukaryotic-transcription" },
  paulDerivatives: { book: "Paul's Online Math Notes, Lamar University", section: "Calculus I — Derivatives",
    url: "https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeIntro.aspx" },
  ciaaw: { book: "IUPAC Commission on Isotopic Abundances and Atomic Weights", section: "Standard Atomic Weights",
    url: "https://www.ciaaw.org/atomic-weights.htm" }
};

// Licence notes shown in the app, so the student knows what they're looking at.
const BEYOND_SOURCE_NOTES = [
  "OpenStax textbooks are free to read online and are written and reviewed by university faculty. They are published by Rice University under Creative Commons terms, which is why they are linked here rather than reproduced.",
  "Paul's Online Math Notes is a free calculus and algebra course written by Paul Dawkins at Lamar University, with worked practice problems for every section.",
  "Atomic weights come from IUPAC's CIAAW — the body that actually decides them. The values in the table below were read from their published list, not typed from memory."
];

// ---------- IUPAC standard atomic weights (CIAAW) ----------
// [Z, symbol, name, mass, group, period, category, estimated]
// `estimated` marks the 34 elements with no stable isotope: CIAAW publishes no
// standard atomic weight for these, so the mass number of the most stable known
// isotope is shown instead, in brackets — the same convention printed tables use.
const ELEMENTS = [
  [1,"H","Hydrogen",1.008,1,1,"nonmetal",0],[2,"He","Helium",4.0026,18,1,"noble",0],
  [3,"Li","Lithium",6.9675,1,2,"alkali",0],[4,"Be","Beryllium",9.0122,2,2,"alkaline",0],
  [5,"B","Boron",10.8135,13,2,"metalloid",0],[6,"C","Carbon",12.0106,14,2,"nonmetal",0],
  [7,"N","Nitrogen",14.0069,15,2,"nonmetal",0],[8,"O","Oxygen",15.9994,16,2,"nonmetal",0],
  [9,"F","Fluorine",18.9984,17,2,"halogen",0],[10,"Ne","Neon",20.1797,18,2,"noble",0],
  [11,"Na","Sodium",22.9898,1,3,"alkali",0],[12,"Mg","Magnesium",24.3055,2,3,"alkaline",0],
  [13,"Al","Aluminium",26.9815,13,3,"metal",0],[14,"Si","Silicon",28.085,14,3,"metalloid",0],
  [15,"P","Phosphorus",30.9738,15,3,"nonmetal",0],[16,"S","Sulfur",32.0675,16,3,"nonmetal",0],
  [17,"Cl","Chlorine",35.4515,17,3,"halogen",0],[18,"Ar","Argon",39.8775,18,3,"noble",0],
  [19,"K","Potassium",39.0983,1,4,"alkali",0],[20,"Ca","Calcium",40.078,2,4,"alkaline",0],
  [21,"Sc","Scandium",44.9559,3,4,"transition",0],[22,"Ti","Titanium",47.867,4,4,"transition",0],
  [23,"V","Vanadium",50.9415,5,4,"transition",0],[24,"Cr","Chromium",51.9961,6,4,"transition",0],
  [25,"Mn","Manganese",54.938,7,4,"transition",0],[26,"Fe","Iron",55.845,8,4,"transition",0],
  [27,"Co","Cobalt",58.9332,9,4,"transition",0],[28,"Ni","Nickel",58.6934,10,4,"transition",0],
  [29,"Cu","Copper",63.546,11,4,"transition",0],[30,"Zn","Zinc",65.38,12,4,"transition",0],
  [31,"Ga","Gallium",69.723,13,4,"metal",0],[32,"Ge","Germanium",72.63,14,4,"metalloid",0],
  [33,"As","Arsenic",74.9216,15,4,"metalloid",0],[34,"Se","Selenium",78.971,16,4,"nonmetal",0],
  [35,"Br","Bromine",79.904,17,4,"halogen",0],[36,"Kr","Krypton",83.798,18,4,"noble",0],
  [37,"Rb","Rubidium",85.4678,1,5,"alkali",0],[38,"Sr","Strontium",87.62,2,5,"alkaline",0],
  [39,"Y","Yttrium",88.9058,3,5,"transition",0],[40,"Zr","Zirconium",91.222,4,5,"transition",0],
  [41,"Nb","Niobium",92.9064,5,5,"transition",0],[42,"Mo","Molybdenum",95.95,6,5,"transition",0],
  [43,"Tc","Technetium",98,7,5,"transition",1],[44,"Ru","Ruthenium",101.07,8,5,"transition",0],
  [45,"Rh","Rhodium",102.9055,9,5,"transition",0],[46,"Pd","Palladium",106.42,10,5,"transition",0],
  [47,"Ag","Silver",107.8682,11,5,"transition",0],[48,"Cd","Cadmium",112.414,12,5,"transition",0],
  [49,"In","Indium",114.818,13,5,"metal",0],[50,"Sn","Tin",118.71,14,5,"metal",0],
  [51,"Sb","Antimony",121.76,15,5,"metalloid",0],[52,"Te","Tellurium",127.6,16,5,"metalloid",0],
  [53,"I","Iodine",126.9045,17,5,"halogen",0],[54,"Xe","Xenon",131.293,18,5,"noble",0],
  [55,"Cs","Caesium",132.9055,1,6,"alkali",0],[56,"Ba","Barium",137.327,2,6,"alkaline",0],
  [57,"La","Lanthanum",138.9055,3,6,"lanthanide",0],[58,"Ce","Cerium",140.116,3,6,"lanthanide",0],
  [59,"Pr","Praseodymium",140.9077,3,6,"lanthanide",0],[60,"Nd","Neodymium",144.242,3,6,"lanthanide",0],
  [61,"Pm","Promethium",145,3,6,"lanthanide",1],[62,"Sm","Samarium",150.36,3,6,"lanthanide",0],
  [63,"Eu","Europium",151.964,3,6,"lanthanide",0],[64,"Gd","Gadolinium",157.249,3,6,"lanthanide",0],
  [65,"Tb","Terbium",158.9254,3,6,"lanthanide",0],[66,"Dy","Dysprosium",162.5,3,6,"lanthanide",0],
  [67,"Ho","Holmium",164.9303,3,6,"lanthanide",0],[68,"Er","Erbium",167.259,3,6,"lanthanide",0],
  [69,"Tm","Thulium",168.9342,3,6,"lanthanide",0],[70,"Yb","Ytterbium",173.045,3,6,"lanthanide",0],
  [71,"Lu","Lutetium",174.9667,3,6,"lanthanide",0],[72,"Hf","Hafnium",178.486,4,6,"transition",0],
  [73,"Ta","Tantalum",180.9479,5,6,"transition",0],[74,"W","Tungsten",183.84,6,6,"transition",0],
  [75,"Re","Rhenium",186.207,7,6,"transition",0],[76,"Os","Osmium",190.23,8,6,"transition",0],
  [77,"Ir","Iridium",192.217,9,6,"transition",0],[78,"Pt","Platinum",195.084,10,6,"transition",0],
  [79,"Au","Gold",196.9666,11,6,"transition",0],[80,"Hg","Mercury",200.592,12,6,"transition",0],
  [81,"Tl","Thallium",204.3835,13,6,"metal",0],[82,"Pb","Lead",207.04,14,6,"metal",0],
  [83,"Bi","Bismuth",208.9804,15,6,"metal",0],[84,"Po","Polonium",209,16,6,"metalloid",1],
  [85,"At","Astatine",210,17,6,"halogen",1],[86,"Rn","Radon",222,18,6,"noble",1],
  [87,"Fr","Francium",223,1,7,"alkali",1],[88,"Ra","Radium",226,2,7,"alkaline",1],
  [89,"Ac","Actinium",227,3,7,"actinide",1],[90,"Th","Thorium",232.0377,3,7,"actinide",0],
  [91,"Pa","Protactinium",231.0359,3,7,"actinide",0],[92,"U","Uranium",238.0289,3,7,"actinide",0],
  [93,"Np","Neptunium",237,3,7,"actinide",1],[94,"Pu","Plutonium",244,3,7,"actinide",1],
  [95,"Am","Americium",243,3,7,"actinide",1],[96,"Cm","Curium",247,3,7,"actinide",1],
  [97,"Bk","Berkelium",247,3,7,"actinide",1],[98,"Cf","Californium",251,3,7,"actinide",1],
  [99,"Es","Einsteinium",252,3,7,"actinide",1],[100,"Fm","Fermium",257,3,7,"actinide",1],
  [101,"Md","Mendelevium",258,3,7,"actinide",1],[102,"No","Nobelium",259,3,7,"actinide",1],
  [103,"Lr","Lawrencium",266,3,7,"actinide",1],[104,"Rf","Rutherfordium",267,4,7,"transition",1],
  [105,"Db","Dubnium",268,5,7,"transition",1],[106,"Sg","Seaborgium",269,6,7,"transition",1],
  [107,"Bh","Bohrium",270,7,7,"transition",1],[108,"Hs","Hassium",269,8,7,"transition",1],
  [109,"Mt","Meitnerium",278,9,7,"transition",1],[110,"Ds","Darmstadtium",281,10,7,"transition",1],
  [111,"Rg","Roentgenium",282,11,7,"transition",1],[112,"Cn","Copernicium",285,12,7,"transition",1],
  [113,"Nh","Nihonium",286,13,7,"metal",1],[114,"Fl","Flerovium",289,14,7,"metal",1],
  [115,"Mc","Moscovium",290,15,7,"metal",1],[116,"Lv","Livermorium",293,16,7,"metal",1],
  [117,"Ts","Tennessine",294,17,7,"halogen",1],[118,"Og","Oganesson",294,18,7,"noble",1]
];

// ---------- the bench: what these elements actually make ----------
// Keyed by the element symbols in alphabetical order, so dropping O on H finds the
// same entry as dropping H on O. Ratios are the real formula subscripts, which lets
// the bench compute molar mass from the IUPAC weights above rather than hardcoding it.
const COMPOUNDS = {
  "H,O": { formula: "H₂O", name: "Water", ratio: { H: 2, O: 1 }, kind: "covalent",
    note: "Two hydrogens share electrons with one oxygen. The molecule comes out bent, which leaves one end slightly negative — that small lopsidedness is why water dissolves so much and why ice floats." },
  "Cl,Na": { formula: "NaCl", name: "Table salt", ratio: { Na: 1, Cl: 1 }, kind: "ionic",
    note: "Sodium hands its single outer electron to chlorine. Now they're oppositely charged ions and they stick — that's an ionic bond, and it's why salt dissolves into pieces in water." },
  "C,O": { formula: "CO₂", name: "Carbon dioxide", ratio: { C: 1, O: 2 }, kind: "covalent",
    note: "What you breathe out and what plants breathe in. Straight-line molecule, no lopsided end, so unlike water it doesn't dissolve especially well." },
  "H,N": { formula: "NH₃", name: "Ammonia", ratio: { N: 1, H: 3 }, kind: "covalent",
    note: "Nitrogen needs three electrons, so it takes three hydrogens. Making this from air is arguably why the planet can feed eight billion people — it's how fertiliser starts." },
  "C,H": { formula: "CH₄", name: "Methane", ratio: { C: 1, H: 4 }, kind: "covalent",
    note: "Carbon's four bonds, all filled with hydrogen. Natural gas, and the simplest thing organic chemistry starts from." },
  "Cl,H": { formula: "HCl", name: "Hydrochloric acid", ratio: { H: 1, Cl: 1 }, kind: "covalent",
    note: "In water it lets go of its hydrogen ion completely, which is exactly what makes something a strong acid. Your stomach runs on it at about pH 2." },
  "H,O,S": { formula: "H₂SO₄", name: "Sulfuric acid", ratio: { H: 2, S: 1, O: 4 }, kind: "covalent",
    note: "The most-produced industrial chemical on Earth. Two hydrogens to give away, so it's diprotic — it can acidify twice." },
  "Ca,C,O": { formula: "CaCO₃", name: "Calcium carbonate", ratio: { Ca: 1, C: 1, O: 3 }, kind: "ionic",
    note: "Limestone, chalk, seashells, and the stuff in antacids. A calcium ion paired with a carbonate group that acts as a single unit." },
  "Fe,O": { formula: "Fe₂O₃", name: "Rust (iron oxide)", ratio: { Fe: 2, O: 3 }, kind: "ionic",
    note: "Iron losing electrons to oxygen. The reason bridges get painted and why the whole surface of Mars is red." },
  "H,S": { formula: "H₂S", name: "Hydrogen sulfide", ratio: { H: 2, S: 1 }, kind: "covalent",
    note: "Same shape idea as water, sulfur sitting where oxygen would. Smells like rotten eggs and is genuinely dangerous in quantity." },
  "Na,O": { formula: "Na₂O", name: "Sodium oxide", ratio: { Na: 2, O: 1 }, kind: "ionic",
    note: "Oxygen wants two electrons and sodium only has one to give, so it takes two sodiums. That's how you predict a formula: balance what each side needs." },
  "Ca,O": { formula: "CaO", name: "Quicklime", ratio: { Ca: 1, O: 1 }, kind: "ionic",
    note: "Calcium gives two electrons, oxygen wants two — a clean one-to-one trade. Used in cement, and it gets hot when it meets water." },
  "Mg,O": { formula: "MgO", name: "Magnesium oxide", ratio: { Mg: 1, O: 1 }, kind: "ionic",
    note: "Burning magnesium in air makes this, with a white light bright enough that it was once used for photography flashes." },
  "Cl,K": { formula: "KCl", name: "Potassium chloride", ratio: { K: 1, Cl: 1 }, kind: "ionic",
    note: "Same trade as table salt, one row down the table. Sold as a salt substitute and used as fertiliser." },
  "Al,O": { formula: "Al₂O₃", name: "Alumina", ratio: { Al: 2, O: 3 }, kind: "ionic",
    note: "Aluminium's own oxide forms a skin over the metal instantly and then protects it — which is why aluminium doesn't rust away like iron does." },
  "N,O": { formula: "NO₂", name: "Nitrogen dioxide", ratio: { N: 1, O: 2 }, kind: "covalent",
    note: "Brown, sharp-smelling, and a major component of smog. Forms in engines when air gets hot enough for nitrogen to stop minding its own business." },
  "C,N": { formula: "C₂N₂", name: "Cyanogen", ratio: { C: 2, N: 2 }, kind: "covalent",
    note: "Carbon triple-bonded to nitrogen at both ends. Highly toxic — an example of how a pair of ordinary elements can make something that isn't." },
  "H,Li": { formula: "LiH", name: "Lithium hydride", ratio: { Li: 1, H: 1 }, kind: "ionic",
    note: "Unusually, hydrogen is the one GAINING an electron here. It can go either way depending on what it's paired with." },
  "F,Na": { formula: "NaF", name: "Sodium fluoride", ratio: { Na: 1, F: 1 }, kind: "ionic",
    note: "The fluoride in toothpaste and drinking water. Same one-for-one trade as salt, with fluorine instead of chlorine." },
  "Cu,O": { formula: "CuO", name: "Copper(II) oxide", ratio: { Cu: 1, O: 1 }, kind: "ionic",
    note: "Black powder. Copper can form more than one kind of ion, which is why the (II) is part of the name — the Roman numeral says which one." },
  "H,I": { formula: "HI", name: "Hydroiodic acid", ratio: { H: 1, I: 1 }, kind: "covalent",
    note: "Bigger halogen, weaker grip on its hydrogen — which makes it an even stronger acid than HCl." },
  "O,Si": { formula: "SiO₂", name: "Silica (quartz, sand)", ratio: { Si: 1, O: 2 }, kind: "covalent",
    note: "Not really individual molecules — one giant connected network, which is why quartz is so hard and melts so high. It's also what glass and computer chips start as." },
  "H,P": { formula: "PH₃", name: "Phosphine", ratio: { P: 1, H: 3 }, kind: "covalent",
    note: "Phosphorus sits under nitrogen, so it copies ammonia's three-hydrogen pattern. Position on the table predicts the formula." },
  "Br,K": { formula: "KBr", name: "Potassium bromide", ratio: { K: 1, Br: 1 }, kind: "ionic",
    note: "Another group 1 with another group 17. Once you see the pattern, you can write dozens of these without looking anything up." },
  "Ba,O,S": { formula: "BaSO₄", name: "Barium sulfate", ratio: { Ba: 1, S: 1, O: 4 }, kind: "ionic",
    note: "So insoluble that patients drink it before an X-ray — barium is toxic, but this compound refuses to dissolve enough to matter." },
  "C,Cl": { formula: "CCl₄", name: "Carbon tetrachloride", ratio: { C: 1, Cl: 4 }, kind: "covalent",
    note: "Carbon's four bonds again, chlorine this time. Once a common solvent, now largely banned — it damages the ozone layer and the liver." },
  "He": { formula: "He", name: "Helium — and nothing else", ratio: { He: 1 }, kind: "noble",
    note: "A noble gas has a full outer shell already, so it has no reason to bond with anything. Dropping it on the bench on purpose teaches the rule: full shell, no chemistry." },
  "Ne": { formula: "Ne", name: "Neon — and nothing else", ratio: { Ne: 1 }, kind: "noble",
    note: "Same story as helium. It glows when you run electricity through it, but it won't combine with your other element." },
  "Ar": { formula: "Ar", name: "Argon — and nothing else", ratio: { Ar: 1 }, kind: "noble",
    note: "Used to fill welding shields and old light bulbs precisely BECAUSE it refuses to react with anything." }
};

// ---------- the questions ----------
const BEYOND_QUESTIONS = [
  // ===== Calculus =====
  { id: "bc_power-1", subject: "Calculus", topic: "Power rule", src: "osCalcRules",
    prompt: "What is the derivative of f(x) = x⁵?",
    choices: [
      { text: "5x⁴", why: "Bring the power down in front, then drop it by one.", correct: true },
      { text: "x⁴", why: "You dropped the power but forgot to bring the 5 down." },
      { text: "5x⁶", why: "The power goes DOWN by one, not up." },
      { text: "5x⁵", why: "The exponent has to change — otherwise nothing was differentiated." }
    ] },
  { id: "bc_power-2", subject: "Calculus", topic: "Power rule", src: "osCalcRules",
    prompt: "What is the derivative of f(x) = 7x³ − 4x + 9?",
    choices: [
      { text: "21x² − 4", why: "Each term separately: 7·3x² = 21x², the −4x gives −4, and a constant differentiates to 0.", correct: true },
      { text: "21x² − 4 + 9", why: "The constant 9 has a slope of zero — it disappears." },
      { text: "21x² − 4x", why: "The derivative of −4x is −4, not −4x." },
      { text: "7x² − 4", why: "You dropped the power without multiplying by it." }
    ] },
  { id: "bc_deriv-1", subject: "Calculus", topic: "What a derivative is", src: "osCalcDeriv",
    prompt: "A car's position is s(t) metres after t seconds. What does s′(3) tell you?",
    choices: [
      { text: "The car's speed at exactly 3 seconds", why: "The derivative of position with respect to time is velocity — the rate of change at that instant.", correct: true },
      { text: "How far the car travelled in 3 seconds", why: "That's s(3), the position itself, not its rate of change." },
      { text: "The car's average speed over 3 seconds", why: "Average speed is total distance over total time. The derivative is the rate at ONE instant." },
      { text: "How long the car took to go 3 metres", why: "The input is time, not distance." }
    ] },
  { id: "bc_limit-1", subject: "Calculus", topic: "Limits", src: "osCalcLimit",
    prompt: "Evaluate the limit of (x² − 9)/(x − 3) as x approaches 3.",
    choices: [
      { text: "6", why: "Factor the top: (x−3)(x+3)/(x−3) cancels to x+3, which heads to 6. The function is undefined AT 3, but the limit doesn't care what happens at the point — only near it.", correct: true },
      { text: "0", why: "The top does go to 0, but so does the bottom. 0/0 means factor and try again, not 'the answer is 0'." },
      { text: "Undefined", why: "The FUNCTION is undefined at x = 3. The LIMIT still exists, and that distinction is the whole point of limits." },
      { text: "3", why: "Close — that's the x-value you're approaching, not the value the function approaches." }
    ] },
  { id: "bc_chain-1", subject: "Calculus", topic: "Chain rule", src: "osCalcChain",
    prompt: "What is the derivative of f(x) = (3x + 1)⁴?",
    choices: [
      { text: "12(3x + 1)³", why: "Outside first: 4(3x+1)³. Then times the derivative of the inside, which is 3. 4 × 3 = 12.", correct: true },
      { text: "4(3x + 1)³", why: "That's the outside only. The chain rule says multiply by the derivative of the inside too." },
      { text: "12(3x + 1)⁴", why: "The power has to drop by one." },
      { text: "3(3x + 1)³", why: "You used the inside derivative but lost the 4 from the power." }
    ] },
  { id: "bc_product-1", subject: "Calculus", topic: "Product rule", src: "osCalcRules",
    prompt: "If f(x) = x²·sin(x), what is f′(x)?",
    choices: [
      { text: "2x·sin(x) + x²·cos(x)", why: "First times derivative of second, plus second times derivative of first. Derivatives do NOT distribute across multiplication.", correct: true },
      { text: "2x·cos(x)", why: "That's differentiating each piece and multiplying them — the most common product-rule error." },
      { text: "2x + cos(x)", why: "You differentiated each factor and added. That's not a rule." },
      { text: "x²·cos(x)", why: "Only half the product rule — the other term is missing." }
    ] },
  { id: "bc_rates-1", subject: "Calculus", topic: "Rates of change", src: "osCalcRates",
    prompt: "A tank's volume is V(t) = 100 − 2t² litres after t minutes. How fast is it draining at t = 3?",
    choices: [
      { text: "12 litres per minute", why: "V′(t) = −4t, so V′(3) = −12. The negative means draining; the rate is 12 L/min.", correct: true },
      { text: "82 litres per minute", why: "That's V(3) — how much is left, not how fast it's changing." },
      { text: "4 litres per minute", why: "That's V′ at t = 1. Substitute the actual time." },
      { text: "18 litres per minute", why: "That looks like 2t² at t = 3 — the amount drained so far, not the rate." }
    ] },
  { id: "bc_related-1", subject: "Calculus", topic: "Related rates", src: "osCalcRelated",
    prompt: "A balloon's radius grows at 2 cm/s. Which fact makes this a related-rates problem rather than a plain derivative?",
    choices: [
      { text: "Two quantities change with time, and a formula ties them together", why: "Volume depends on radius, and radius depends on time. Differentiating the link with respect to time is exactly what related rates does.", correct: true },
      { text: "The radius is increasing", why: "Something increasing is just a rate. The 'related' part is a SECOND quantity tied to it." },
      { text: "The shape is a sphere", why: "The shape supplies the formula, but any linked pair of quantities works." },
      { text: "The rate is constant", why: "Constant or not, that doesn't create the relationship between two changing quantities." }
    ] },
  { id: "bc_integral-1", subject: "Calculus", topic: "Definite integrals", src: "osCalcIntegral",
    prompt: "In plain terms, what does a definite integral of a positive function measure?",
    choices: [
      { text: "The area under the curve between the two limits", why: "It's the sum of infinitely many thin rectangles — accumulated total rather than instantaneous rate.", correct: true },
      { text: "The slope of the curve at the endpoints", why: "That's the derivative. The integral is the opposite move." },
      { text: "The highest value the function reaches", why: "That's a maximum, found with derivatives." },
      { text: "The average of the two limits", why: "The limits are where you start and stop, not what's measured." }
    ] },
  { id: "bc_deriv-2", subject: "Calculus", topic: "Derivative as slope", src: "paulDerivatives",
    prompt: "The graph of f has a horizontal tangent at x = 2. What must be true?",
    choices: [
      { text: "f′(2) = 0", why: "Horizontal means slope zero, and the derivative IS the slope. This is how maxima and minima get found.", correct: true },
      { text: "f(2) = 0", why: "That would mean the graph crosses the x-axis there — a different statement entirely." },
      { text: "f′(2) is undefined", why: "Undefined derivatives show up at corners and vertical tangents, not horizontal ones." },
      { text: "f is increasing at x = 2", why: "Increasing means positive slope. A horizontal tangent is momentarily neither." }
    ] },

  // ===== Trigonometry =====
  { id: "bt_soh-1", subject: "Trigonometry", topic: "Right triangles", src: "osTrigRight",
    prompt: "In a right triangle, the side opposite angle θ is 5 and the hypotenuse is 13. What is sin θ?",
    choices: [
      { text: "5/13", why: "Sine is opposite over hypotenuse — the S in SOH-CAH-TOA.", correct: true },
      { text: "13/5", why: "That's the reciprocal (cosecant). Sine of an acute angle is always less than 1." },
      { text: "12/13", why: "That's cosine — the adjacent side (12, from the 5-12-13 triple) over the hypotenuse." },
      { text: "5/12", why: "That's tangent: opposite over adjacent." }
    ] },
  { id: "bt_unit-1", subject: "Trigonometry", topic: "Unit circle", src: "osTrigUnit",
    prompt: "What is cos(π/3)?",
    choices: [
      { text: "1/2", why: "π/3 is 60°. On the unit circle that point is (1/2, √3/2), and cosine is the x-coordinate.", correct: true },
      { text: "√3/2", why: "That's the y-coordinate, which makes it sin(π/3)." },
      { text: "√2/2", why: "That's cos(π/4) — the 45° point, where x and y are equal." },
      { text: "0", why: "Cosine is 0 at π/2, straight up." }
    ] },
  { id: "bt_unit-2", subject: "Trigonometry", topic: "Unit circle", src: "osTrigUnit",
    prompt: "Why is sin²θ + cos²θ = 1 true for every angle?",
    choices: [
      { text: "It's the Pythagorean theorem on the unit circle", why: "The point (cos θ, sin θ) sits on a circle of radius 1, so x² + y² = 1. The identity is just that equation renamed.", correct: true },
      { text: "Because sine and cosine are always less than 1", why: "True but unrelated — being small doesn't make squares sum to exactly 1." },
      { text: "Because they're opposite functions", why: "They're co-functions, not opposites, and that wouldn't force the sum." },
      { text: "It's only true for acute angles", why: "It holds for every angle, which is what makes it worth memorising." }
    ] },
  { id: "bt_rad-1", subject: "Trigonometry", topic: "Radians", src: "osTrigAngles",
    prompt: "How many degrees is 3π/4 radians?",
    choices: [
      { text: "135°", why: "π radians = 180°, so 3π/4 = 3/4 of 180 = 135.", correct: true },
      { text: "60°", why: "That's π/3. Convert by replacing π with 180." },
      { text: "270°", why: "That's 3π/2. Watch the denominator." },
      { text: "45°", why: "That's π/4 — you dropped the 3." }
    ] },
  { id: "bt_graph-1", subject: "Trigonometry", topic: "Graphs", src: "osTrigGraphs",
    prompt: "What is the period of y = sin(3x)?",
    choices: [
      { text: "2π/3", why: "The coefficient inside squeezes the graph: period = 2π divided by that coefficient.", correct: true },
      { text: "2π", why: "That's the period of plain sin(x). The 3 compresses it." },
      { text: "3", why: "The 3 is a compression factor, not a period." },
      { text: "6π", why: "Multiplying stretches — but a coefficient inside compresses instead." }
    ] },
  { id: "bt_graph-2", subject: "Trigonometry", topic: "Graphs", src: "osTrigGraphs",
    prompt: "In y = 4·cos(x) − 2, what are the maximum and minimum values?",
    choices: [
      { text: "Max 2, min −6", why: "Cosine runs −1 to 1, so 4cos(x) runs −4 to 4, then the −2 shifts everything down.", correct: true },
      { text: "Max 4, min −4", why: "That ignores the vertical shift of −2." },
      { text: "Max 6, min −2", why: "The shift moves both ends DOWN by 2, not up." },
      { text: "Max 1, min −1", why: "That's plain cosine, before the amplitude and shift." }
    ] },
  { id: "bt_sines-1", subject: "Trigonometry", topic: "Law of sines", src: "osTrigSines",
    prompt: "You know two angles of a triangle and one side. Which tool finds a missing side?",
    choices: [
      { text: "Law of sines", why: "Angle-side pairs are exactly what a/sin A = b/sin B compares.", correct: true },
      { text: "Law of cosines", why: "That one is for two sides and the included angle, or all three sides." },
      { text: "The Pythagorean theorem", why: "Only works on right triangles, and nothing here says this is one." },
      { text: "SOH-CAH-TOA", why: "Also right-triangle only." }
    ] },
  { id: "bt_cosines-1", subject: "Trigonometry", topic: "Law of cosines", src: "osTrigCosines",
    prompt: "A triangle has sides 7 and 9 with a 40° angle between them. Which law finds the third side?",
    choices: [
      { text: "Law of cosines", why: "Two sides and the angle BETWEEN them (SAS) is exactly what c² = a² + b² − 2ab·cos C handles.", correct: true },
      { text: "Law of sines", why: "That needs an angle paired with its opposite side, and you don't have one yet." },
      { text: "The Pythagorean theorem", why: "It's the special case where the angle is 90°. This one is 40°." },
      { text: "Neither — there isn't enough information", why: "SAS pins a triangle down completely." }
    ] },
  { id: "bt_soh-2", subject: "Trigonometry", topic: "Right triangles", src: "osTrigRight",
    prompt: "A ladder leans against a wall at 70° to the ground and reaches 6 m up. Which equation finds the ladder's length L?",
    choices: [
      { text: "sin 70° = 6/L", why: "The 6 m is opposite the 70° angle and the ladder is the hypotenuse — opposite over hypotenuse is sine.", correct: true },
      { text: "cos 70° = 6/L", why: "Cosine uses the ADJACENT side — that's the distance along the ground." },
      { text: "tan 70° = 6/L", why: "Tangent never involves the hypotenuse, and L is the hypotenuse here." },
      { text: "sin 70° = L/6", why: "Right ratio, upside down. Opposite goes on top." }
    ] },
  { id: "bt_rad-2", subject: "Trigonometry", topic: "Radians", src: "osTrigAngles",
    prompt: "Why do calculus and physics use radians instead of degrees?",
    choices: [
      { text: "A radian is defined by the circle's own radius, so arc length and rotation come out clean", why: "Arc length is just rθ in radians, and the derivative of sin x is cos x only when x is in radians. Degrees drag a conversion factor through every formula.", correct: true },
      { text: "Radians are smaller than degrees", why: "One radian is about 57° — bigger, not smaller, and size isn't the reason anyway." },
      { text: "Calculators only accept radians", why: "Calculators do both. The convention comes from the mathematics." },
      { text: "Degrees are less accurate", why: "Both are exact. Radians are more convenient, not more precise." }
    ] },

  // ===== Chemistry =====
  { id: "bh_mole-1", subject: "Chemistry", topic: "Molar mass", src: "osChemMole",
    prompt: "What is the molar mass of water, H₂O? (H ≈ 1.008, O ≈ 15.999)",
    choices: [
      { text: "≈ 18.02 g/mol", why: "Two hydrogens (2 × 1.008 = 2.016) plus one oxygen (15.999). Add the atoms, don't average them.", correct: true },
      { text: "≈ 17.01 g/mol", why: "That counts only one hydrogen — the subscript 2 means two of them." },
      { text: "≈ 16.01 g/mol", why: "That's oxygen alone." },
      { text: "≈ 34.02 g/mol", why: "That's doubling the whole molecule rather than just the hydrogen." }
    ] },
  { id: "bh_mole-2", subject: "Chemistry", topic: "The mole", src: "osChemMole",
    prompt: "How many molecules are in 2 moles of carbon dioxide?",
    choices: [
      { text: "About 1.2 × 10²⁴", why: "One mole is 6.022 × 10²³ particles, so two moles is twice that. The mole is a count, like a dozen.", correct: true },
      { text: "About 6.022 × 10²³", why: "That's one mole. You have two." },
      { text: "88", why: "That's roughly the MASS in grams of 2 moles of CO₂, not a count of molecules." },
      { text: "2", why: "Two moles, yes — but the question asks how many molecules that is." }
    ] },
  { id: "bh_balance-1", subject: "Chemistry", topic: "Balancing equations", src: "osChemBalance",
    prompt: "Balance: __ H₂ + __ O₂ → __ H₂O",
    choices: [
      { text: "2, 1, 2", why: "4 hydrogens and 2 oxygens on each side. You may change how many molecules, never the subscripts inside them.", correct: true },
      { text: "1, 1, 1", why: "That leaves two oxygens on the left and one on the right. Atoms can't vanish." },
      { text: "2, 2, 2", why: "Now there are 4 oxygens on the left and only 2 on the right." },
      { text: "1, 1, 2", why: "Two waters need four hydrogens, but only two are supplied." }
    ] },
  { id: "bh_balance-2", subject: "Chemistry", topic: "Balancing equations", src: "osChemBalance",
    prompt: "Why can't you balance an equation by changing H₂O to H₂O₂?",
    choices: [
      { text: "That changes the substance itself, not the amount", why: "Subscripts define what the molecule IS. H₂O₂ is hydrogen peroxide — a different chemical. Only the coefficients out front may change.", correct: true },
      { text: "Because H₂O₂ doesn't exist", why: "It does exist — it's hydrogen peroxide. That's precisely the problem." },
      { text: "Because oxygen can't have a subscript of 2", why: "It can; O₂ is how oxygen gas is written." },
      { text: "Because the equation would have too many atoms", why: "The count isn't the issue — the identity of the substance is." }
    ] },
  { id: "bh_ph-1", subject: "Chemistry", topic: "pH", src: "osChemPh",
    prompt: "A solution at pH 3 compared with one at pH 5 is:",
    choices: [
      { text: "100 times more acidic", why: "pH is logarithmic — each whole step is a factor of 10, so two steps is 10 × 10.", correct: true },
      { text: "2 times more acidic", why: "That treats pH as a straight scale. It's a log scale." },
      { text: "10 times more acidic", why: "That's one step. This is two." },
      { text: "Less acidic", why: "Lower pH means MORE acidic, which trips people up constantly." }
    ] },
  { id: "bh_periodic-1", subject: "Chemistry", topic: "Periodic trends", src: "osChemPeriodic",
    prompt: "Why do sodium, potassium and the rest of group 1 behave so similarly?",
    choices: [
      { text: "They all have one electron in their outer shell", why: "A column shares its outer-electron count, and that outer shell is what does the reacting. Position on the table predicts behaviour.", correct: true },
      { text: "They all have the same mass", why: "Their masses differ a lot — sodium is 23, caesium is 133." },
      { text: "They all have the same number of protons", why: "Then they'd be the same element." },
      { text: "They're all found together in nature", why: "Where they're mined has nothing to do with how they react." }
    ] },
  { id: "bh_bond-1", subject: "Chemistry", topic: "Bonding", src: "osChemCovalent",
    prompt: "What makes a bond covalent rather than ionic?",
    choices: [
      { text: "The atoms share electrons instead of transferring them", why: "Similar pull on electrons means neither wins outright, so they share. Very different pull means one takes them and you get ions.", correct: true },
      { text: "It only happens between metals", why: "Metal-plus-nonmetal usually gives ionic. Covalent is typically nonmetal with nonmetal." },
      { text: "It's always stronger than an ionic bond", why: "Strength depends on the specific bond, not the category." },
      { text: "It dissolves in water", why: "Ionic compounds are the ones famous for dissolving into ions." }
    ] },
  { id: "bh_mole-3", subject: "Chemistry", topic: "Mass to moles", src: "osChemMole",
    prompt: "You have 36 g of water (molar mass ≈ 18 g/mol). How many moles is that?",
    choices: [
      { text: "2 moles", why: "Moles = mass ÷ molar mass = 36 ÷ 18. This single division is most of intro chemistry.", correct: true },
      { text: "648 moles", why: "You multiplied. Grams divided by grams-per-mole gives moles." },
      { text: "0.5 moles", why: "That's the division upside down." },
      { text: "18 moles", why: "18 is the molar mass, not the answer." }
    ] },

  // ===== Biology =====
  { id: "bb_dogma-1", subject: "Biology", topic: "DNA to protein", src: "osBioTranscription",
    prompt: "In transcription, what is actually produced?",
    choices: [
      { text: "An RNA copy of one gene", why: "DNA stays in the nucleus as the archive; RNA is the working copy carried out to the ribosome.", correct: true },
      { text: "A protein", why: "That's translation, the step after — the ribosome reads the RNA to build it." },
      { text: "A second copy of the whole DNA molecule", why: "That's replication, which happens before cell division." },
      { text: "An amino acid", why: "Amino acids are the beads; they get assembled during translation." }
    ] },
  { id: "bb_mendel-1", subject: "Biology", topic: "Inheritance", src: "osBioMendel",
    prompt: "Two carriers of a recessive trait (Aa × Aa) have a child. What is the chance the child shows the trait?",
    choices: [
      { text: "25%", why: "The four combinations are AA, Aa, aA, aa. Only aa shows a recessive trait — one of four.", correct: true },
      { text: "50%", why: "That's the chance of being a carrier (Aa), which shows nothing." },
      { text: "75%", why: "That's the chance of NOT showing it." },
      { text: "0%", why: "Two carriers can absolutely produce an affected child — that's why traits appear to skip generations." }
    ] }
];

if (typeof window !== "undefined") {
  window.ACTDrillBeyond = {
    version: BEYOND_BANK_VERSION,
    sources: BEYOND_SOURCES,
    sourceNotes: BEYOND_SOURCE_NOTES,
    elements: ELEMENTS,
    compounds: COMPOUNDS,
    questions: BEYOND_QUESTIONS
  };
}
