const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFinder } = require("./load.js");

const ctx = { jobs: ["WARM", "OIL", "BUILD"], chapters: ["1. Foundations", "2. Porridges"], trads: ["China", "Japan"],
              vocab: Object.assign(Object.create(null), { ginger: {}, rice: {} }), sorts: ["book", "best", "az"] };
const plain = s => JSON.parse(JSON.stringify({ ...s, jobs: [...s.jobs], uses: [...s.uses] }));

test("parseFilters reads every filter from the query string", () => {
  const { parseFilters } = loadFinder();
  assert.deepEqual(plain(parseFilters("?q=soup&jobs=warm,OIL&ready=1&ch=2&trad=Japan&uses=ginger,rice&sort=az", ctx)), {
    q: "soup", jobs: ["WARM", "OIL"], ready: "1", chapter: "2. Porridges", trad: "Japan", uses: ["ginger", "rice"], sort: "az",
  });
});

test("parseFilters drops unknown values, inherited keys included", () => {
  const { parseFilters } = loadFinder();
  assert.deepEqual(plain(parseFilters("?jobs=HOT&ready=5&ch=9&trad=constructor&uses=constructor,__proto__,ginger&sort=toString", ctx)), {
    q: "", jobs: [], ready: "any", chapter: "", trad: "", uses: ["ginger"], sort: "book",
  });
});

test("filterQuery writes only what's set, and round-trips through parseFilters", () => {
  const { parseFilters, filterQuery } = loadFinder();
  const s = { q: " soup ", jobs: new Set(["WARM", "BUILD"]), ready: "any", chapter: "1. Foundations", trad: "China",
              uses: new Set(["ginger"]), sort: "book" };
  const qs = filterQuery(s);
  assert.equal(qs, "q=soup&jobs=WARM,BUILD&ch=1&trad=China&uses=ginger");
  assert.deepEqual(plain(parseFilters("?" + qs, ctx)), { ...plain(s), q: "soup" });
  assert.equal(filterQuery({ q: "", jobs: new Set(), ready: "any", chapter: "", trad: "", uses: new Set(), sort: "book" }), "");
  // book order is the default, so it isn't written; the old default still is
  assert.equal(filterQuery({ q: "", jobs: new Set(), ready: "any", chapter: "", trad: "", uses: new Set(), sort: "best" }), "sort=best");
});

test("toggleFilter turns a job, chapter, tradition or ingredient on, and off again", () => {
  const { toggleFilter } = loadFinder();
  const s = { jobs: new Set(["OIL"]), chapter: "", trad: "Japan", uses: new Set() };
  toggleFilter(s, "jobs", "WARM"); toggleFilter(s, "chapter", "2. Porridges"); toggleFilter(s, "trad", "China"); toggleFilter(s, "uses", "ginger");
  assert.deepEqual(plain({ ...s }), { jobs: ["OIL", "WARM"], chapter: "2. Porridges", trad: "China", uses: ["ginger"] });
  toggleFilter(s, "jobs", "WARM"); toggleFilter(s, "chapter", "2. Porridges"); toggleFilter(s, "trad", "China"); toggleFilter(s, "uses", "ginger");
  assert.deepEqual(plain({ ...s }), { jobs: ["OIL"], chapter: "", trad: "", uses: [] });
});

const NAMES = { sugar: ["Sugar, brown sugar or jaggery", "Sugar", "brown sugar", "jaggery"], onion: ["Onions"],
                bay: ["Bay leaves"], tomatoes: ["Tomatoes"], broth: ["Fish and Kombu Broth or Dashi", "Fish and Kombu Broth", "Dashi"] };
const wrap = (id, text) => `[${id}:${text}]`;

test("linkIngredients marks the first mention of each ingredient, plurals and longer names first", () => {
  const { linkIngredients } = loadFinder();
  const names = id => NAMES[id] || [];
  assert.equal(linkIngredients("¼ onion, chopped", ["onion"], names, wrap), "¼ [onion:onion], chopped");
  assert.equal(linkIngredients("2 tbsp brown sugar, or sugar", ["sugar"], names, wrap), "2 tbsp [sugar:brown sugar], or sugar");
  assert.equal(linkIngredients("1 bay leaf", ["bay"], names, wrap), "1 [bay:bay leaf]");
  assert.equal(linkIngredients("1 tomato, in wedges", ["tomatoes"], names, wrap), "1 [tomatoes:tomato], in wedges");
});

test("linkIngredients leaves tags and existing buttons alone", () => {
  const { linkIngredients } = loadFinder();
  const names = id => NAMES[id] || [];
  const html = '5 cups <button type="button" class="xref" data-open="broth">Fish and Kombu Broth</button> or dashi, <b>onions</b>';
  assert.equal(linkIngredients(html, ["broth", "onion"], names, wrap),
    '5 cups <button type="button" class="xref" data-open="broth">Fish and Kombu Broth</button> or [broth:dashi], <b>[onion:onions]</b>');
  assert.equal(linkIngredients('<i class="onion">x</i>', ["onion"], names, wrap), '<i class="onion">x</i>');
  assert.equal(linkIngredients("salt to taste", ["onion"], names, wrap), "salt to taste");
});

test("methodIds finds the method recipes whose variations are their own recipes", () => {
  const { methodIds } = loadFinder();
  const R = [
    { id: "roast", variations: [{ name: "Carrots" }], parent: null },
    { id: "carrots", variations: [], parent: "roast" },
    { id: "soup", variations: [{ name: "With miso" }], parent: null }, // variations with no records of their own
    { id: "rice", variations: [], parent: null },
  ];
  assert.deepEqual([...methodIds(R)], ["roast"]);
});

test("variationIds finds a method's one-line variations, not its full model recipes", () => {
  const { variationIds } = loadFinder();
  const R = [
    { id: "roast", variations: [{ name: "Carrots with cumin (Morocco) ○" }, { name: "Crème squash" }], parent: null },
    { id: "roots", title: "Roasted Roots", variations: [], parent: "roast" },
    { id: "carrots", title: "Carrots with cumin", variations: [], parent: "roast" },
    { id: "squash", title: "Creme squash", variations: [], parent: "roast" },
    { id: "rice", title: "Rice", variations: [], parent: null },
  ];
  assert.deepEqual([...variationIds(R, new Set(["roast"]))], ["carrots", "squash"]);
});

test("bookOrder puts each chapter's variations after its full recipes, keeping book order otherwise", () => {
  const { bookOrder } = loadFinder();
  const r = (id, chapter, v = false) => ({ id, chapter, v });
  const list = [r("a", 1), r("v1", 1, true), r("b", 1), r("v2", 1, true), r("c", 2), r("v3", 3, true), r("d", 3)];
  assert.deepEqual([...bookOrder(list, x => x.v).map(x => x.id)], ["a", "b", "v1", "v2", "c", "d", "v3"]);
});

test("ingSuggest offers ingredients with a word starting with what's typed, most-used first", () => {
  const { ingSuggest } = loadFinder();
  const vocab = [
    { id: "salmon", label: "Salmon" }, { id: "smoked-salmon", label: "Smoked salmon" },
    { id: "salt", label: "Salt" }, { id: "basil", label: "Basil", aka: ["tulsi"] }, { id: "unused", label: "Salsify" },
  ];
  const counts = { salmon: 9, "smoked-salmon": 2, salt: 30, basil: 4 };
  const ids = (q, ex = new Set()) => [...ingSuggest(vocab, q, ex, counts).map(v => v.id)];
  assert.deepEqual(ids("sal"), ["salt", "salmon", "smoked-salmon"]);
  assert.deepEqual(ids("salm"), ["salmon", "smoked-salmon"]);
  assert.deepEqual(ids("Tuls"), ["basil"]);
  // a one-off house item doesn't crowd out the everyday one
  assert.deepEqual([...ingSuggest([{ id: "ginger-tea", label: "Ginger Tea" }, { id: "ginger", label: "Fresh ginger" }], "gin", new Set(),
    { "ginger-tea": 1, ginger: 79 }).map(v => v.id)], ["ginger", "ginger-tea"]);
  assert.deepEqual(ids("s"), []); // too short
  assert.deepEqual(ids("salm", new Set(["salmon"])), ["smoked-salmon"]);
  assert.deepEqual(ids("salsify"), []); // no recipe uses it
});
