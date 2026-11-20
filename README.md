# Warm kitchen

The Warm Kitchen cookbook and its recipe finder, served by GitHub Pages from `main`'s root.

- Finder: https://sarakc.github.io/warm-kitchen/warm_kitchen_finder.html
- Cookbook: https://sarakc.github.io/warm-kitchen/cookbook/

## How it fits together

- **The book** is a Google Doc, the source of truth for recipes, names and the pantry.
  `scripts/update-cookbook.mjs` exports it to `cookbook/index.html`. The
  `sync-cookbook.yml` workflow runs it every Monday (or by hand from the Actions tab) and
  commits the result. That commit is the deploy.
- **The finder** (`warm_kitchen_finder.html`) is one self-contained page with the recipe
  data embedded as JSON in `<script id="data">`. Its titles, pantry and recipes follow the
  book. Edit it here, commit and push.

Run the sync locally with `node scripts/update-cookbook.mjs` (Node 20+, no dependencies).

`_local/` is ignored by git and holds older local copies.
