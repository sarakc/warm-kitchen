// Pantry and favorites sync: the pure parts (the format is shared with other apps; see mergeDocs in the finder).
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFinder } = require("./load.js");
const { mergeDocs, remoteDocs, localDocs, stampClock } = loadFinder();
const plain = o => JSON.parse(JSON.stringify(o));

test("newest change wins per key; a tie goes to the remote copy; one-sided keys are kept", () => {
  const local = { "have:rice": { t: 5, d: true }, "have:miso": { t: 1, del: true }, "fav:ghee": { t: 3, d: true }, "have:lime": { t: 2, d: true } };
  const remote = { "have:rice": { t: 4, del: true }, "have:miso": { t: 2, d: true }, "have:gin": { t: 9, d: true }, "have:lime": { t: 2, del: true } };
  const { out, toLocal, remoteDirty } = plain(mergeDocs(local, remote));
  assert.deepEqual(out["have:rice"], { t: 5, d: true });
  assert.deepEqual(out["have:miso"], { t: 2, d: true });
  assert.deepEqual(out["have:gin"], { t: 9, d: true }); // an id from another app passes through
  assert.deepEqual(out["have:lime"], { t: 2, del: true });
  assert.deepEqual(out["fav:ghee"], { t: 3, d: true });
  assert.deepEqual(Object.keys(toLocal).sort(), ["have:gin", "have:lime", "have:miso"]);
  assert.equal(remoteDirty, true);
});

test("nothing to push when the remote already agrees", () => {
  const docs = { "have:rice": { t: 1, d: true } };
  assert.equal(mergeDocs(docs, plain(docs)).remoteDirty, false);
});

test("a bad or partial read throws instead of merging as empty", () => {
  for (const txt of ["", "{", "null", "[]", '{"docs":[]}', '{"app":"warm-kitchen"}']) {
    assert.throws(() => remoteDocs(txt), e => e.code === "badread", txt);
  }
  assert.deepEqual(plain(remoteDocs('{"app":"warm-kitchen","format":1,"docs":{}}')), {});
});

test("local docs: unstamped keys have t 0, removals come from the clock", () => {
  const docs = plain(localDocs(new Set(["rice"]), new Set(["ghee"]), { "have:miso": 7, "fav:ghee": 3 }));
  assert.deepEqual(docs, { "have:rice": { t: 0, d: true }, "fav:ghee": { t: 3, d: true }, "have:miso": { t: 7, del: true } });
});

test("stampClock stamps only what changed", () => {
  const base = { have: new Set(["rice", "miso"]), favs: new Set() };
  const cur = { have: new Set(["rice", "lime"]), favs: new Set(["ghee"]) };
  assert.deepEqual(plain(stampClock({ "have:rice": 1 }, base, cur, 9)), { "have:rice": 1, "have:lime": 9, "have:miso": 9, "fav:ghee": 9 });
});
