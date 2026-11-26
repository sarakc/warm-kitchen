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
  `scripts/finder-data.mjs` keeps the data's derived fields (tradition chips) current.
- **Sync:** the Pantry page's Sync section keeps the pantry and favorites in a private gist
  in your GitHub account (a token with only the gist scope; Tempo's works), so connected
  devices share one pantry. Without it, each browser keeps its own.

Agents: see [AGENTS.md](AGENTS.md).

Run the cookbook export locally with `node scripts/update-cookbook.mjs`, and the tests with
`node --test tests/*.test.js` (Node 20+, no dependencies).

`_local/` is ignored by git and holds older local copies.
