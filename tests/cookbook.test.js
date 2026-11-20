const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// The generator runs on import, so load just its marked pure helpers.
function loadCookbook() {
  const src = fs.readFileSync(path.join(__dirname, "..", "scripts", "update-cookbook.mjs"), "utf8");
  const m = src.match(/\/\/ @testable\n([\s\S]*?)\/\/ @end-testable/);
  assert.ok(m, "update-cookbook.mjs has a @testable section");
  return vm.runInNewContext(m[1] + ";({ splitRecipeHeading })", {});
}
const plain = v => JSON.parse(JSON.stringify(v));

test("a recipe heading splits into title and job tags", () => {
  const { splitRecipeHeading } = loadCookbook();
  assert.deepEqual(plain(splitRecipeHeading("Congee — WARM · OIL")), { title: "Congee", tags: ["WARM", "OIL"] });
  assert.deepEqual(plain(splitRecipeHeading("Congee")), { title: "Congee", tags: [] });
});

test("an em dash inside the title keeps the whole title and the tags", () => {
  const { splitRecipeHeading } = loadCookbook();
  assert.deepEqual(plain(splitRecipeHeading("Fish — the long way — WARM · OIL")), { title: "Fish — the long way", tags: ["WARM", "OIL"] });
});

test("an en dash also separates the tags", () => {
  const { splitRecipeHeading } = loadCookbook();
  assert.deepEqual(plain(splitRecipeHeading("Tea – CALM")), { title: "Tea", tags: ["CALM"] });
  assert.deepEqual(plain(splitRecipeHeading("Rice – the plain way – WARM")), { title: "Rice – the plain way", tags: ["WARM"] });
});

test("a dash with no job tags after it stays part of the title", () => {
  const { splitRecipeHeading } = loadCookbook();
  assert.deepEqual(plain(splitRecipeHeading("Fish — the long way")), { title: "Fish — the long way", tags: [] });
  assert.deepEqual(plain(splitRecipeHeading("Broth, 20–25 min")), { title: "Broth, 20–25 min", tags: [] });
});
