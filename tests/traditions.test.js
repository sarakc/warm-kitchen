const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFinder } = require("./load.js");

const TRADS = ["India and Ayurveda", "Nepal", "China", "Taiwan", "Japan", "Korea", "Tibet", "Thailand, Vietnam and Southeast Asia",
  "Indonesia", "Persia and Unani", "Turkey", "Levant, Egypt and Maghreb", "Ethiopia", "East Africa (Swahili coast)", "Nigeria",
  "Georgia", "Russia and Ukraine", "Hungary", "Nordic", "Greece", "Italy", "Spain", "Portugal", "Mexico", "Brazil", "Caribbean",
  "Andes", "Mesoamerica", "Native North America", "France", "New England and the Atlantic", "No single tradition"];

// Real origin / traditions pairs from the book.
const cases = [
  ["China", ["China"], ""],
  ["Ayurveda", ["India and Ayurveda"], ""],
  ["Scandinavia", ["Nordic"], ""],
  ["Maghreb / Levant", ["Levant, Egypt and Maghreb"], ""],
  ["Ayurveda / Unani", ["India and Ayurveda", "Persia and Unani"], ""],
  ["Tibet and Nepal", ["Nepal", "Tibet"], ""],
  ["New England / Atlantic", ["New England and the Atlantic"], ""],
  ["Ayurveda / Middle East", ["India and Ayurveda", "Levant, Egypt and Maghreb"], ""],
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
  ["Trinidad and Tobago", ["Caribbean"], "Trinidad and Tobago"],
  ["Andean squash stew, Peru", ["Andes"], "Andean squash stew, Peru"],
  ["Levant and Turkey", ["Levant, Egypt and Maghreb"], "Levant and Turkey"],
  ["Mexico", ["Mesoamerica"], "Mexico"],
  ["Mediterranean", ["No single tradition"], "Mediterranean"],
  ["", ["China"], ""],
];

test("originNote hides an origin that only restates the traditions, and keeps what adds to them", () => {
  const { originNote } = loadFinder();
  for (const [origin, traditions, want] of cases) assert.equal(originNote(origin, traditions, TRADS), want, origin);
});

test("tradAliasOf maps places and parts of tradition names to the tradition", () => {
  const { tradAliasOf } = loadFinder();
  assert.equal(tradAliasOf("ayurveda", TRADS), "India and Ayurveda");
  assert.equal(tradAliasOf("Swahili coast", TRADS), "East Africa (Swahili coast)");
  assert.equal(tradAliasOf("Egypt", TRADS), "Levant, Egypt and Maghreb");
  assert.equal(tradAliasOf("Scandinavia", TRADS), "Nordic");
  assert.equal(tradAliasOf("Atlantic", TRADS), "New England and the Atlantic");
  assert.equal(tradAliasOf("Canton", TRADS), "");
  assert.equal(tradAliasOf("constructor", TRADS), "");
});
