const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFinder } = require("./load.js");

// Sample native names in the shape the book data may gain: { native, lang, romanized, english }, any of them missing.
const millet = { title: "Millet and Kabocha Porridge", origin: "Xiaomi Nangua Zhou, China",
  names: { native: "小米南瓜粥", lang: "zh-Hant", romanized: "xiaomi nangua zhou", english: "millet and kabocha porridge" } };
const chao = { title: "Cháo Cá", origin: "Vietnamese fish congee", names: { native: "Cháo cá", lang: "vi", english: "fish congee" } };
const ash = { title: "Persian Ash-e Reshteh", origin: "herb and noodle soup",
  names: { native: "آش رشته", lang: "fa", romanized: "ash-e reshteh", english: "herb and noodle soup" } };
const plain = v => JSON.parse(JSON.stringify(v));

test("cardNames shows the native name and a romanisation the title and origin don't already have", () => {
  const { cardNames } = loadFinder();
  assert.deepEqual(plain(cardNames(millet.names, millet.title, "Xiaomi Nangua Zhou")),
    [{ text: "小米南瓜粥", lang: "zh-Hant", dir: "auto" }]);
  assert.deepEqual(plain(cardNames(millet.names, millet.title, "")),
    [{ text: "小米南瓜粥", lang: "zh-Hant", dir: "auto" }, { text: "xiaomi nangua zhou" }]);
  assert.deepEqual(plain(cardNames(chao.names, chao.title, "Vietnamese fish congee")), []); // native = title
  assert.deepEqual(plain(cardNames(ash.names, ash.title, "herb and noodle soup")), [{ text: "آش رشته", lang: "fa", dir: "rtl" }]);
  assert.deepEqual(plain(cardNames(undefined, "Ghee", "")), []);
  assert.deepEqual(plain(cardNames({ romanized: "jat-juk" }, "Pine Nut Porridge", "Korean pine nut porridge")), [{ text: "jat-juk" }]);
});

test("pageNames shows native, romanised and English, skipping only a repeat of the title", () => {
  const { pageNames } = loadFinder();
  // the English name is the title here, so it isn't repeated
  assert.deepEqual(plain(pageNames(millet.names, millet.title)), [{ text: "小米南瓜粥", lang: "zh-Hant", dir: "auto" }, { text: "xiaomi nangua zhou" }]);
  assert.deepEqual(plain(pageNames(ash.names, ash.title)), [
    { text: "آش رشته", lang: "fa", dir: "rtl" }, { text: "ash-e reshteh" }, { text: "herb and noodle soup", english: true }]);
  assert.deepEqual(plain(pageNames(chao.names, chao.title)), [{ text: "fish congee", english: true }]);
  assert.deepEqual(plain(pageNames({}, "X")), []);
});

test("search folds diacritics and finds words inside CJK names", () => {
  const { fold, words, wordHit } = loadFinder();
  assert.equal(fold("Cháo cá"), "chao ca");
  assert.equal(fold("Đậu phụ"), "dau phu");
  assert.deepEqual([...words("Cháo cá")], ["chao", "ca"]);
  assert.ok(wordHit("南瓜", words("小米南瓜粥")[0]) > 0);
  assert.equal(wordHit("南瓜", words("南瓜")[0]), 1);
  assert.equal(wordHit("瓜粥饭", words("小米南瓜粥")[0]), 0);
  assert.deepEqual([...words("दाल भात")], ["दाल", "भात"]); // vowel signs stay inside the word
  assert.ok(wordHit("oat", "oats") === 1 && wordHit("oat", "boat") === 0);
});
