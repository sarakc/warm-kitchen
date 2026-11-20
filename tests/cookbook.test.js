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
  return vm.runInNewContext(m[1] + ";({ splitRecipeHeading, sanitizeSourceBody })", {});
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

test("the sanitizer strips quoted and unquoted event handlers", () => {
  const { sanitizeSourceBody } = loadCookbook();
  assert.equal(sanitizeSourceBody('<img src="a.png" onerror="alert(1)">'), '<img src="a.png">');
  assert.equal(sanitizeSourceBody("<img src=x onerror=alert(1)>"), "<img src=x>");
  assert.equal(sanitizeSourceBody("<img/onerror=alert(1) src=x>"), "<img src=x>");
  assert.equal(sanitizeSourceBody("<p ONCLICK='x()' class=\"c1\">Hi</p>"), '<p class="c1">Hi</p>');
});

test("the sanitizer strips javascript:, data: and vbscript: links and sources", () => {
  const { sanitizeSourceBody } = loadCookbook();
  assert.equal(sanitizeSourceBody('<a href="javascript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitizeSourceBody("<a href=javascript:alert(1)>x</a>"), "<a>x</a>");
  assert.equal(sanitizeSourceBody('<a href=" JaVa&#x09;Script&colon;alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitizeSourceBody('<a href="&#106;avascript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitizeSourceBody('<img src="data:text/html,x">'), "<img>");
  assert.equal(sanitizeSourceBody("<a href='vbscript:msgbox'>x</a>"), "<a>x</a>");
});

test("the sanitizer removes scripts and embeds, closed or not", () => {
  const { sanitizeSourceBody } = loadCookbook();
  assert.equal(sanitizeSourceBody("a<script>alert(1)</script>b"), "ab");
  assert.equal(sanitizeSourceBody("a<script src=//evil.example/x.js>b"), "ab");
  assert.equal(sanitizeSourceBody('a<iframe src="https://x"></iframe>b<embed src=x>c'), "abc");
});

test("the sanitizer leaves ordinary Google Docs markup alone", () => {
  const { sanitizeSourceBody } = loadCookbook();
  const doc = '<h2 class="c4" id="h.abc"><span class="c1">Congee — WARM</span></h2>' +
    '<p class="c2"><a class="c5" href="https://www.google.com/url?q=https://example.com&amp;sa=D">one</a> ' +
    '<a href="#h.abc">two</a> on=1 and onions = good, <img alt="" src="https://lh7-rt.googleusercontent.com/x" style="width: 10px;"></p>';
  assert.equal(sanitizeSourceBody(doc), doc);
});

test("the sanitizer reads quoted values like a browser and escapes tags it can't read", () => {
  const { sanitizeSourceBody } = loadCookbook();
  assert.equal(sanitizeSourceBody('<a title="1 > 0" onclick="x()">x</a>'), '<a title="1 > 0">x</a>');
  assert.equal(sanitizeSourceBody('<a title=">" onclick=x>x</a>'), '<a title=">">x</a>');
  assert.equal(sanitizeSourceBody('<a title="open onclick=x>x</a>'), '&lt;a title="open onclick=x>x</a>');
  assert.equal(sanitizeSourceBody("<br/><hr />"), "<br/><hr />");
});
