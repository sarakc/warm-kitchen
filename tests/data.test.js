// The finder's embedded data has readers besides the finder (see AGENTS.md), so its shared fields are checked here.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadFinder } = require("./load.js");

const FINDER = path.join(__dirname, "..", "warm_kitchen_finder.html");
const html = fs.readFileSync(FINDER, "utf8");
const data = JSON.parse(html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const vocab = new Set(data.vocab.map(v => v.id));

test("the derived fields are current (else run node scripts/finder-data.mjs)", async () => {
  const { update } = await import("../scripts/finder-data.mjs");
  assert.equal(update(html).changed, false);
});

test("every recipe has places from the chip vocabulary; healing traditions are among them", () => {
  for (const r of data.recipes) {
    assert.ok(Array.isArray(r.places), r.id);
    for (const p of r.places) assert.ok(data.places.includes(p), `${r.id}: ${p}`);
  }
  assert.deepEqual(data.healing, ["Ayurveda", "Unani"]);
  assert.ok(data.healing.every(h => data.places.includes(h)));
  assert.ok(!data.places.some(p => data.traditions.includes(p) && / and |, /.test(p)), "no compound chips");
});

test("a few known chips", () => {
  const places = id => data.recipes.find(r => r.id === id).places;
  assert.deepEqual(places("kitchari"), ["India", "Ayurveda"]);
  assert.ok(places("sahlab").includes("Turkey"));
});

test("everyday is a list of known ingredient ids, once each", () => {
  assert.ok(data.everyday.length > 0);
  assert.equal(new Set(data.everyday).size, data.everyday.length);
  for (const id of data.everyday) assert.ok(vocab.has(id), id);
});

test("evaluateLines: groups AND, alternatives OR, only main lines count", () => {
  const { evaluateLines } = loadFinder();
  const lines = [
    { kind: "main", text: "", groups: [[["ginger"]], [["rice"], ["oats"]]] },
    { kind: "optional", text: "", groups: [[["dill"]]] },
    { kind: "main", text: "salt", groups: [] },
  ];
  const ev = evaluateLines(lines, new Set(["oats"]));
  assert.equal(ev.needed, 2);
  assert.equal(ev.got, 1);
  assert.deepEqual([...ev.missing], ["ginger"]);
  assert.deepEqual(Array.from(ev.lineState, s => s.st), ["miss", "opt", "none"]);
  assert.deepEqual([...evaluateLines(lines, new Set(["ginger", "rice", "dill"])).missing], []);
});
