const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFinder } = require("./load.js");

const TITLES = ["The Sunday batch (about two hours)", "A day for a starting cold", "A day for building blood",
  "A day for a heavy, damp body", "A low-energy day", "A day for a period", "A deep-winter day",
  "Week one: broth and congee", "Week two: lentils and shellfish", "Week three: Taiwan", "Week four: around the world"];

test("planKind sorts the book's 11 plans into the batch, days and weeks", () => {
  const { planKind } = loadFinder();
  assert.deepEqual(TITLES.map(planKind), ["batch", "day", "day", "day", "day", "day", "day", "week", "week", "week", "week"]);
});

test("planKind puts a title it doesn't recognise with the day plans", () => {
  const { planKind } = loadFinder();
  assert.equal(planKind("A slow weekend"), "day");
  assert.equal(planKind(""), "day");
  assert.equal(planKind("Weekday lunches"), "day");
  assert.equal(planKind("the sunday batch, shorter"), "batch");
});

test("planSections keeps every plan, in book order, batch first, skipping empty sections", () => {
  const { planSections } = loadFinder();
  const plans = [...TITLES, "A slow weekend"].map(title => ({ title }));
  const s = JSON.parse(JSON.stringify(planSections(plans)));
  assert.deepEqual(s.map(x => [x.kind, x.title, x.plans.length]), [["batch", "", 1], ["day", "Day plans", 7], ["week", "Week plans", 4]]);
  assert.equal(s.flatMap(x => x.plans).length, plans.length);
  assert.deepEqual(JSON.parse(JSON.stringify(planSections([{ title: "Week one" }]))).map(x => x.kind), ["week"]);
});
