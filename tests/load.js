const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const EXPORTS = ["cleanFavs", "groupFavs", "withinPantryLimit", "pantryStatus"];

// The page has two <script> tags: the first is the recipe JSON, the last is the app.
function scriptSource() {
  const h = fs.readFileSync(path.join(__dirname, "..", "warm_kitchen_finder.html"), "utf8");
  const a = h.lastIndexOf("<script>") + "<script>".length;
  return h.slice(a, h.indexOf("</script>", a));
}

function loadFinder() {
  const re = /\/\* @testable \*\/([\s\S]*?)\/\* @end-testable \*\//g;
  const src = scriptSource();
  let code = "", m;
  while ((m = re.exec(src))) code += m[1] + "\n";
  code += `;({ ${EXPORTS.join(", ")} })`;
  return vm.runInNewContext(code, {});
}

module.exports = { loadFinder, scriptSource };
