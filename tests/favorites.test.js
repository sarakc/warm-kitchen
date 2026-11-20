const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { loadFinder, scriptSource } = require("./load.js");

const a = { id: "a", chapter: "1. A", traditions: ["Japan"] };
const b = { id: "b", chapter: "1. A", traditions: ["China", "Japan"] };
const c = { id: "c", chapter: "2. B", traditions: [] };
const d = { id: "d", chapter: "2. B", traditions: ["China"] };
const R = [a, b, c, d];
const byId = { a, b, c, d };
const NO_TRAD = "No single tradition";
const TRADS = ["China", "Japan", NO_TRAD];
const shape = groups => groups.map(g => ({ key: g.key, ids: g.recipes.map(r => r.id) }));

test("the finder's app script compiles", () => {
  assert.doesNotThrow(() => new vm.Script(scriptSource()));
});

test("cleanFavs keeps known ids once, in first-seen order", () => {
  const { cleanFavs } = loadFinder();
  assert.deepEqual([...cleanFavs(["b", "x", "b", 3, "a"], byId)], ["b", "a"]);
});

test("dict lookups don't see Object.prototype keys", () => {
  const { dict } = loadFinder();
  const d = dict([["plans", "plans"], ["favorites", "favs"]]);
  assert.equal(d.plans, "plans");
  for (const k of ["constructor", "toString", "__proto__", "hasOwnProperty", "valueOf"]) assert.equal(d[k], undefined, k);
});

test("cleanFavs turns anything that isn't an array into an empty list", () => {
  const { cleanFavs } = loadFinder();
  assert.deepEqual([...cleanFavs(null, byId)], []);
  assert.deepEqual([...cleanFavs("a", byId)], []);
  assert.deepEqual([...cleanFavs({ a: 1 }, byId)], []);
});

test("groupFavs by chapter follows book order and skips empty chapters", () => {
  const { groupFavs } = loadFinder();
  const g = groupFavs(R, new Set(["d", "a", "c"]), "chapter", TRADS, NO_TRAD);
  assert.deepEqual(JSON.parse(JSON.stringify(shape(g))), [{ key: "1. A", ids: ["a"] }, { key: "2. B", ids: ["c", "d"] }]);
});

test("groupFavs by tradition lists a two-tradition recipe under both, and none under No single tradition", () => {
  const { groupFavs } = loadFinder();
  const g = groupFavs(R, new Set(["a", "b", "c"]), "tradition", TRADS, NO_TRAD);
  assert.deepEqual(JSON.parse(JSON.stringify(shape(g))), [
    { key: "China", ids: ["b"] }, { key: "Japan", ids: ["a", "b"] }, { key: NO_TRAD, ids: ["c"] },
  ]);
});

test("groupFavs treats a missing traditions field like an empty one", () => {
  const { groupFavs } = loadFinder();
  const e = { id: "e", chapter: "3. C" };
  const g = groupFavs([e], new Set(["e"]), "tradition", TRADS, NO_TRAD);
  assert.deepEqual(JSON.parse(JSON.stringify(shape(g))), [{ key: NO_TRAD, ids: ["e"] }]);
});

test("groupFavs with no favorites returns no groups", () => {
  const { groupFavs } = loadFinder();
  assert.equal(groupFavs(R, new Set(), "chapter", TRADS, NO_TRAD).length, 0);
  assert.equal(groupFavs(R, new Set(), "tradition", TRADS, NO_TRAD).length, 0);
});
