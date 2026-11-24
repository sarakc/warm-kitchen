const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFinder } = require("./load.js");

// The book's index (compound traditions included) and the chips it turns into.
const BOOK = ["India and Ayurveda", "Nepal", "China", "Taiwan", "Japan", "Korea", "Tibet", "Thailand, Vietnam and Southeast Asia",
  "Indonesia", "Persia and Unani", "Turkey", "Levant, Egypt and Maghreb", "Ethiopia", "East Africa (Swahili coast)", "Nigeria",
  "Georgia", "Russia and Ukraine", "Hungary", "Central Europe", "Nordic", "Northern Europe", "Greece", "Italy", "Spain", "Portugal",
  "Mediterranean", "Mexico", "Brazil", "Caribbean", "Andes", "Mesoamerica", "Native North America", "France",
  "New England and the Atlantic", "No single tradition"];
const { tradVocab } = loadFinder();
const TRADS = tradVocab(BOOK);

// Real origin / traditions pairs from the book.
const cases = [
  ["China", ["China"], ""],
  ["Ayurveda", ["Ayurveda"], ""],
  ["Scandinavia", ["Nordic"], ""],
  ["Maghreb / Levant", ["Levant", "Maghreb"], ""],
  ["Ayurveda / Unani", ["Ayurveda", "Unani"], ""],
  ["Tibet and Nepal", ["Nepal", "Tibet"], ""],
  ["New England", ["New England"], ""],
  ["New England / Atlantic", ["New England"], "Atlantic"], // the part the chip says goes
  ["Ayurveda / Middle East", ["Ayurveda", "Levant"], ""],
  ["Korea / Japan", ["Japan", "Korea"], ""],
  ["Xiaomi Nangua Zhou, China", ["China"], "Xiaomi Nangua Zhou"],
  ["Digua Zhou, Taiwan", ["Taiwan"], "Digua Zhou"],
  ["Bubur Manado, Indonesia", ["Indonesia"], "Bubur Manado"],
  ["Sweden, hovmästarsås", ["Nordic"], "Sweden, hovmästarsås"], // a country within a broader tradition adds to it
  ["Japan, furofuki daikon", ["Japan"], "furofuki daikon"],
  ["Ethiopian spiced butter", ["Ethiopia"], "Ethiopian spiced butter"],
  ["Korean pumpkin porridge", ["Korea"], "Korean pumpkin porridge"],
  ["Jamaica", ["Caribbean"], "Jamaica"],
  ["Canton", ["China"], "Canton"],
  ["Trinidad and Tobago", ["Caribbean"], "Trinidad and Tobago"], // one name, not two places
  ["Andean squash stew, Peru", ["Andes"], "Andean squash stew, Peru"],
  ["Levant and Turkey", ["Turkey", "Levant"], ""],
  ["Levant and Turkey", ["Levant"], "Turkey"],
  ["Iberia / Levant", ["Levant"], "Iberia"],
  ["Mexico", ["Mesoamerica"], "Mexico"],
  ["Mediterranean", ["Mediterranean"], ""],
  ["Egypt", ["Egypt"], ""],
  ["Morocco", ["Maghreb"], "Morocco"],
  ["", ["China"], ""],
];

test("originNote hides an origin that only restates the traditions, and keeps what adds to them", () => {
  const { originNote } = loadFinder();
  for (const [origin, traditions, want] of cases) assert.equal(originNote(origin, traditions, TRADS), want, origin);
});

test("tradAliasOf maps places and parts of tradition names to the tradition", () => {
  const { tradAliasOf } = loadFinder();
  assert.equal(tradAliasOf("ayurveda", TRADS), "Ayurveda");
  assert.equal(tradAliasOf("Swahili coast", TRADS), "East Africa (Swahili coast)");
  assert.equal(tradAliasOf("Egypt", TRADS), "Egypt");
  assert.equal(tradAliasOf("Scandinavia", TRADS), "Nordic");
  assert.equal(tradAliasOf("Middle East", TRADS), "Levant");
  assert.equal(tradAliasOf("Atlantic", TRADS), "");
  assert.equal(tradAliasOf("Canton", TRADS), "");
  assert.equal(tradAliasOf("constructor", TRADS), "");
});

test("tradVocab replaces each compound tradition with its parts, in the book's order", () => {
  assert.deepEqual([...TRADS.slice(0, 2)], ["India", "Nepal"]);
  assert.deepEqual([...TRADS.slice(7, 10)], ["Thailand", "Vietnam", "Southeast Asia"]);
  assert.deepEqual([...TRADS.slice(11, 16)], ["Persia", "Turkey", "Levant", "Egypt", "Maghreb"]);
  assert.ok(TRADS.includes("Russia") && TRADS.includes("Ukraine") && TRADS.includes("New England"));
  assert.deepEqual([...TRADS.slice(-2)], ["Ayurveda", "Unani"]); // healing traditions after the places
  assert.ok(!TRADS.includes("No single tradition") && !TRADS.includes("Many traditions"));
  assert.ok(!TRADS.some(t => / and |, /.test(t)), "no compound left");
});

test("splitTraditions gives each recipe the parts its origin or title names", () => {
  const { splitTraditions } = loadFinder();
  const split = (trads, text) => [...splitTraditions(trads, text, TRADS)];
  assert.deepEqual(split(["Persia and Unani"], "Unani / Persia | Saffron-Cardamom Milk"), ["Persia", "Unani"]);
  assert.deepEqual(split(["Persia and Unani"], "Persian lentil rice | Adas Polo"), ["Persia"]);
  assert.deepEqual(split(["Persia and Unani"], " | Persian Advieh"), ["Persia"]); // from the title
  assert.deepEqual(split(["India and Ayurveda"], "Punjab | Mustard Greens and Mung Dal"), ["India"]);
  assert.deepEqual(split(["India and Ayurveda"], "Ayurveda | Kitchari"), ["Ayurveda"]);
  assert.deepEqual(split(["India and Ayurveda"], " | Golden Milk"), ["India", "Ayurveda"]); // names neither: both
  assert.deepEqual(split(["India and Ayurveda", "Persia and Unani"], "Ayurveda / Unani | Cream of Rice"), ["Ayurveda", "Unani"]);
  assert.deepEqual(split(["India and Ayurveda", "Nordic"], "Nordic / Ayurveda | Salmon"), ["Nordic", "Ayurveda"]); // place first
  assert.deepEqual([...splitTraditions(["India and Ayurveda"], "Ayurveda | Kitchari", TRADS, "kitchari")], ["India", "Ayurveda"]); // PLACE_ADD
  assert.deepEqual(split(["Thailand, Vietnam and Southeast Asia"], "Myanmar | Mohinga"), ["Southeast Asia"]);
  assert.deepEqual(split(["Thailand, Vietnam and Southeast Asia"], " | Thai Ginger Shrimp Stir-fry"), ["Thailand"]);
  assert.deepEqual(split(["Thailand, Vietnam and Southeast Asia"], "Vietnamese fish congee | Cháo Cá"), ["Vietnam"]);
  assert.deepEqual(split(["Levant, Egypt and Maghreb"], "Maghreb / Levant | Shakshuka"), ["Levant", "Maghreb"]);
  assert.deepEqual(split(["Levant, Egypt and Maghreb"], "pescatarian | Moroccan Harira"), ["Maghreb"]);
  assert.deepEqual(split(["Russia and Ukraine"], "Russia / Ukraine | Borscht"), ["Russia", "Ukraine"]);
  assert.deepEqual(split(["New England and the Atlantic"], "New England / Atlantic | Fish Chowder"), ["New England"]);
  assert.deepEqual(split(["Nepal", "Tibet"], "Tibet and Nepal | Momo"), ["Nepal", "Tibet"]);
  assert.deepEqual(split(["No single tradition"], " | Ginger Tea"), []);
  assert.deepEqual([...splitTraditions(["No single tradition"], " | Ghee", TRADS, "ghee")], ["India"]); // PLACE_ADD
  // a compound recipe that names none of its parts, and has no fallback, keeps the compound rather than losing its chip
  assert.deepEqual(split(["Levant, Egypt and Maghreb"], " | Something New"), ["Levant, Egypt and Maghreb"]);
});

test("every recipe in the finder gets chips from the vocabulary (none only under No single tradition), and no compound survives", () => {
  const fs = require("node:fs"), path = require("node:path");
  const h = fs.readFileSync(path.join(__dirname, "..", "warm_kitchen_finder.html"), "utf8");
  const tag = '<script id="data" type="application/json">', a = h.indexOf(tag) + tag.length;
  const D = JSON.parse(h.slice(a, h.indexOf("</script>", a)));
  const { splitTraditions } = loadFinder(), vocab = tradVocab(D.traditions);
  for (const r of D.recipes) {
    const chips = splitTraditions(r.traditions, r.origin + " | " + r.title, vocab, r.id);
    assert.ok(chips.length >= 1 || r.traditions.includes("No single tradition"), r.id);
    for (const c of chips) assert.ok(vocab.includes(c), `${r.id}: ${c}`);
  }
});

test("old ?trad= links: a compound means any of its parts; the old no-tradition value is dropped", () => {
  const { tradValue, tradHit, parseFilters } = loadFinder();
  assert.equal(tradValue("Persia", TRADS), "Persia");
  assert.equal(tradValue("Persia and Unani", TRADS), "Persia and Unani");
  assert.equal(tradValue("No single tradition", TRADS), "");
  assert.equal(tradValue("Many traditions", TRADS), "");
  // cards with no chip are found through the filter's "No particular place" entry
  assert.equal(tradValue("No particular place", TRADS), "No particular place");
  assert.ok(tradHit("No particular place", []) && !tradHit("No particular place", ["Ayurveda"]));
  assert.equal(tradValue("constructor", TRADS), "");
  assert.equal(tradValue("Atlantis", TRADS), "");
  assert.ok(tradHit("Persia and Unani", ["Unani"]) && tradHit("Persia and Unani", ["Persia", "Turkey"]));
  assert.ok(!tradHit("Persia and Unani", ["Turkey"]));
  assert.ok(tradHit("Thailand, Vietnam and Southeast Asia", ["Southeast Asia"]));
  assert.ok(tradHit("Ayurveda", ["Ayurveda", "Nordic"]) && !tradHit("Ayurveda", ["India"]));
  assert.ok(!tradHit("constructor", []));
  const ctx = { jobs: [], chapters: [], trads: TRADS, vocab: Object.create(null), sorts: [] };
  assert.equal(parseFilters("?trad=India+and+Ayurveda", ctx).trad, "India and Ayurveda");
  assert.equal(parseFilters("?trad=Levant,+Egypt+and+Maghreb", ctx).trad, "Levant, Egypt and Maghreb");
  assert.equal(parseFilters("?trad=Unani", ctx).trad, "Unani");
});
