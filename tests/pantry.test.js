const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFinder } = require("./load.js");

test("pantry limits are cumulative", () => {
  const { withinPantryLimit } = loadFinder();
  assert.equal(withinPantryLimit("any", 12), true);
  assert.equal(withinPantryLimit("0", 0), true);
  assert.equal(withinPantryLimit("0", 1), false);
  assert.equal(withinPantryLimit("1", 0), true);
  assert.equal(withinPantryLimit("1", 1), true);
  assert.equal(withinPantryLimit("1", 2), false);
  assert.equal(withinPantryLimit("2", 2), true);
  assert.equal(withinPantryLimit("2", 3), false);
});

test("pantry status uses the approved recipe-card copy", () => {
  const { pantryStatus } = loadFinder();
  const label = id => ({ ginger: "Fresh ginger", salmon: "Salmon", dill: "Dill" }[id]);

  assert.equal(pantryStatus({ needed: 0, missing: [] }, label).text, "Flexible");
  assert.equal(pantryStatus({ needed: 4, missing: [] }, label).text, "Ready to cook");
  assert.equal(pantryStatus({ needed: 4, missing: ["ginger"] }, label).text, "Missing: Fresh ginger");
  assert.equal(pantryStatus({ needed: 4, missing: ["salmon", "dill"] }, label).text, "Missing 2: Salmon, Dill");
  assert.equal(pantryStatus({ needed: 4, missing: ["ginger", "salmon", "dill"] }, label).text, "Missing 3");
});

const VOCAB = [
  { id: "ginger", label: "Fresh ginger", cat: "Spices" },
  { id: "cumin", label: "Cumin", cat: "Spices" },
  { id: "salmon", label: "Salmon", cat: "Fish and shellfish" },
  { id: "creme", label: "Crème fraîche", cat: "Eggs and dairy" },
  { id: "oats", label: "Rolled oats", cat: "Grains" },
];
const ids = groups => Array.from(groups, g => Array.from(g.items, i => i.id)).flat();
const cats = groups => Array.from(groups, g => g.cat);

test("visiblePantry groups by category, items sorted by label, with no filter", () => {
  const { visiblePantry } = loadFinder();
  const g = visiblePantry(VOCAB, new Set(), { search: "", show: "all" });
  assert.deepEqual(cats(g), ["Spices", "Fish and shellfish", "Eggs and dairy", "Grains"]);
  assert.deepEqual(ids([g[0]]), ["cumin", "ginger"]);
});

test("visiblePantry search matches word prefixes, ignoring case and accents", () => {
  const { visiblePantry } = loadFinder();
  const v = (search, have = new Set()) => ids(visiblePantry(VOCAB, have, { search, show: "all" }));
  assert.deepEqual(v("GIN"), ["ginger"]);
  assert.deepEqual(v("creme"), ["creme"]);
  assert.deepEqual(v("fra"), ["creme"]);
  assert.deepEqual(v("inger"), []);        // not mid-word
  assert.deepEqual(v("oat"), ["oats"]);
  assert.deepEqual(v("rolled oa"), ["oats"]);
  assert.deepEqual(v("  "), ids(visiblePantry(VOCAB, new Set(), { search: "", show: "all" })));
});

test("visiblePantry show filters by have/missing and drops empty groups", () => {
  const { visiblePantry } = loadFinder();
  const have = new Set(["ginger", "salmon"]);
  const h = visiblePantry(VOCAB, have, { search: "", show: "have" });
  assert.deepEqual(ids(h).sort(), ["ginger", "salmon"]);
  assert.deepEqual(cats(h), ["Spices", "Fish and shellfish"]);
  const m = visiblePantry(VOCAB, have, { search: "", show: "missing" });
  assert.deepEqual(ids(m).sort(), ["creme", "cumin", "oats"]);
  assert.equal(visiblePantry(VOCAB, have, { search: "salmon", show: "missing" }).length, 0);
});

test("bulkPantry lists exactly the ids shown", () => {
  const { visiblePantry, bulkPantry } = loadFinder();
  const g = visiblePantry(VOCAB, new Set(), { search: "c", show: "all" });
  assert.deepEqual(Array.from(bulkPantry(g)).sort(), ["creme", "cumin"]);
  assert.deepEqual(Array.from(bulkPantry([])), []);
});

test("bulkApply changes only the ids given and counts what changed", () => {
  const { bulkApply } = loadFinder();
  const have = new Set(["ginger", "salmon", "x"]);
  const add = bulkApply(have, ["ginger", "cumin", "oats"], "select", []);
  assert.deepEqual([...add.have].sort(), ["cumin", "ginger", "oats", "salmon", "x"]);
  assert.equal(add.n, 2);
  const clr = bulkApply(have, ["ginger", "cumin"], "clear", []);
  assert.deepEqual([...clr.have].sort(), ["salmon", "x"]);
  assert.equal(clr.n, 1);
  // Everyday only adds: salmon and x are ticked but not everyday, and stay ticked.
  const eve = bulkApply(have, ["ginger", "salmon", "cumin"], "everyday", ["ginger", "cumin"]);
  assert.deepEqual([...eve.have].sort(), ["cumin", "ginger", "salmon", "x"]);
  assert.equal(eve.n, 1);
  assert.equal(bulkApply(have, ["salmon"], "everyday", ["ginger"]).n, 0);
  assert.deepEqual([...have].sort(), ["ginger", "salmon", "x"]); // input untouched
});

test("undoText words", () => {
  const { undoText } = loadFinder();
  assert.equal(undoText("clear", 142), "Cleared 142");
  assert.equal(undoText("select", 12), "Added 12");
  assert.equal(undoText("everyday", 30), "Added 30");
});

test("bulkApply no-ops report n = 0 and change nothing", () => {
  const { bulkApply } = loadFinder();
  const have = new Set(["ginger", "salmon"]);
  const sel = bulkApply(have, ["ginger", "salmon"], "select", []);
  assert.equal(sel.n, 0);
  assert.deepEqual([...sel.have].sort(), ["ginger", "salmon"]);
  const clr = bulkApply(have, ["cumin", "oats"], "clear", []);
  assert.equal(clr.n, 0);
  assert.deepEqual([...clr.have].sort(), ["ginger", "salmon"]);
});

test("search and Show combined, then select, change only what is shown", () => {
  const { visiblePantry, bulkPantry, bulkApply } = loadFinder();
  const have = new Set(["ginger"]);
  const shown = bulkPantry(visiblePantry(VOCAB, have, { search: "c", show: "missing" }));
  assert.deepEqual(Array.from(shown).sort(), ["creme", "cumin"]);
  const r = bulkApply(have, shown, "select", []);
  assert.deepEqual([...r.have].sort(), ["creme", "cumin", "ginger"]);
  assert.equal(r.n, 2);
});

test("any pantry change clears the undo; undo restores the exact previous set once", () => {
  const { pantryChange, pantryUndo, bulkApply, undoText } = loadFinder();
  let st = { have: new Set(["ginger", "salmon"]), undo: null };
  // Clear all, with an undo
  const cleared = bulkApply(st.have, ["ginger", "salmon"], "clear", []);
  st = pantryChange(st, cleared.have, undoText("clear", cleared.n));
  assert.equal(st.undo.text, "Cleared 2");
  assert.equal(st.have.size, 0);
  // "add all missing" on a recipe is a plain change: no undo label, so the undo is gone
  st = pantryChange(st, new Set([...st.have, "cumin", "oats"]));
  assert.equal(st.undo, null);
  // pressing Undo now does nothing; the new ticks stay
  const after = pantryUndo(st);
  assert.deepEqual([...after.have].sort(), ["cumin", "oats"]);
  // and a normal undo restores the exact old set, once
  let s2 = pantryChange({ have: new Set(["ginger", "salmon"]), undo: null }, new Set(), "Cleared 2");
  s2 = pantryUndo(s2);
  assert.deepEqual([...s2.have].sort(), ["ginger", "salmon"]);
  assert.equal(s2.undo, null);
  assert.deepEqual([...pantryUndo(s2).have].sort(), ["ginger", "salmon"]);
});
