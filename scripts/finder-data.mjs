// The finder's embedded data (<script id="data"> in warm_kitchen_finder.html): read, derive, write.
//
// The data mirrors the book. Two kinds of field are derived from it here, so that every reader (the finder,
// the hub) gets the same values without re-running the finder's rules:
//   - `places` on each recipe: its tradition chips (single places, then healing traditions), from the book's
//     traditions, origin and title through the finder's splitTraditions rules (TRAD_PARTS, PLACE_ADD).
//   - top-level `places` (the chip vocabulary in index order) and `healing` (the chips that are healing
//     traditions, not places).
// `everyday` (the starter pantry) is hand-kept data and is left alone.
//
//   node scripts/finder-data.mjs           rewrite the derived fields in the finder
//   node scripts/finder-data.mjs --check   exit 1 if they are out of date (the tests run this)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const FINDER = fileURLToPath(new URL('../warm_kitchen_finder.html', import.meta.url));
const DATA_RE = /(<script id="data" type="application\/json">)([\s\S]*?)(<\/script>)/;

/** The data JSON in a finder page. */
export function readData(html) {
  const m = html.match(DATA_RE);
  if (!m) throw new Error('No <script id="data"> block in the finder');
  return JSON.parse(m[2]);
}

// The file's own style: compact, every non-ASCII character escaped (so no "</script>" or encoding surprises).
const serialize = (data) => JSON.stringify(data)
  .replace(/[\u007f-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));

/** The page with its data block replaced. */
export function writeData(html, data) {
  return html.replace(DATA_RE, (_, open, __, close) => open + serialize(data) + close);
}

/** The finder's pure functions (its @testable blocks). */
export function finderCode(html) {
  const a = html.lastIndexOf('<script>') + '<script>'.length;
  const src = html.slice(a, html.indexOf('</script>', a));
  const re = /\/\* @testable \*\/([\s\S]*?)\/\* @end-testable \*\//g;
  let code = '';
  let m;
  while ((m = re.exec(src))) code += m[1] + '\n';
  return vm.runInNewContext(code + ';({ splitTraditions, tradVocab, SYSTEMS })', { URLSearchParams });
}

// Copy `obj` with `key: value` placed right after `after` (or at the end), replacing any old `key`.
function placeAfter(obj, after, key, value) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === key) continue;
    out[k] = v;
    if (k === after) out[key] = value;
  }
  if (!(key in out)) out[key] = value;
  return out;
}

/** The data with its derived fields brought up to date. */
export function derive(data, { splitTraditions, tradVocab, SYSTEMS }) {
  const places = tradVocab(data.traditions);
  let out = placeAfter(data, 'traditions', 'places', places);
  out = placeAfter(out, 'places', 'healing', SYSTEMS.filter((s) => places.includes(s)));
  out.recipes = data.recipes.map((r) =>
    placeAfter(r, 'traditions', 'places', splitTraditions(r.traditions, r.origin + ' | ' + r.title, places, r.id)));
  return out;
}

/** `{ html, changed }`: the finder page with derived fields current. */
export function update(html) {
  const next = writeData(html, derive(readData(html), finderCode(html)));
  return { html: next, changed: next !== html };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const html = readFileSync(FINDER, 'utf8');
  const { html: next, changed } = update(html);
  if (process.argv.includes('--check')) {
    if (changed) {
      console.error('The finder data is out of date: run node scripts/finder-data.mjs');
      process.exit(1);
    }
  } else if (changed) {
    writeFileSync(FINDER, next);
    console.log('Updated the derived fields in warm_kitchen_finder.html');
  } else {
    console.log('Already up to date');
  }
}
