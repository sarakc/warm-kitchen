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
