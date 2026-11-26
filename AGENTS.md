# Repository agent guide

## What this repo is
The Warm Kitchen cookbook and its recipe finder, served by GitHub Pages from `main`'s root.
Pushing `main` deploys. See [README.md](README.md) for how the pieces fit.

- **The book** is a Google Doc and the source of truth for recipes, names and the pantry.
  `scripts/update-cookbook.mjs` exports it to `cookbook/index.html` every Monday (the
  `sync-cookbook.yml` workflow commits the result).
- **The finder** (`warm_kitchen_finder.html`) is one self-contained page. Its recipe data is
  JSON in `<script id="data" type="application/json">`; its code is the last `<script>`.

## Other readers depend on this repo
Sara's private apps read the finder's data from a local checkout, and share its pantry sync
file. Their tests check them against this repo, but a change here can still break them, so:

- **Keep the data block.** The tag stays `<script id="data" type="application/json">`, compact
  JSON with non-ASCII escaped (`scripts/finder-data.mjs` writes it that way).
- **Keep the shared fields** and their shapes: `recipes[]` (`id`, `title`, `origin`, `tags`,
  `chapter`, `section`, `traditions`, `places`, `lines`, `loose`, `names`, `parent`,
  `variations`, `lead`, `why`, `notes`, `steps`, `method`), `vocab`, `traditions`, `places`,
  `healing`, `everyday`, `plans`. Adding fields is fine; renaming or removing one is a change
  to coordinate.
- **Ids are stable.** Recipe and ingredient ids key favorites, the pantry, the sync gist and
  other apps' records. Fix a title, never an id.
- **Derived fields stay current.** After editing recipe data or the tradition rules
  (`TRAD_PARTS`, `PLACE_ADD`, `splitTraditions`), run `node scripts/finder-data.mjs`. The tests
  fail until you do.
- **Keep shared values in the data, not the script.** Anything another reader needs (chips, the
  starter pantry) goes in the data block. Keep display-only logic in the script.
- **The matcher** `evaluateLines(lines, have)` (a `@testable` block) is the reference other
  apps' matchers are tested against. Change what it returns only on purpose.
- **The sync format** (`mergeDocs` and the comment above it: `warm-kitchen-pantry.json`, keys
  `have:<id>` and `fav:<id>`, newest change wins) is shared. Don't change it on one side only.
- This repo is public. Don't name or describe the private apps in it.

## Working
- Tests: `node --test tests/*.test.js` (Node 20+, no dependencies). Pure functions in the
  finder sit between `/* @testable */` and `/* @end-testable */`; `tests/load.js` exports them.
- The finder works offline through `sw.js`; bump `CACHE` there when its `FILES` list changes.
- Interface: minimal and quiet, bordered cards, the cookbook's tokens and fonts. Plain labels,
  no marketing copy.
- Google Doc edits waiting to be made are in [docs/google-doc-edits.md](docs/google-doc-edits.md).
