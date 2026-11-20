# Favorites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let Sara star recipes in the Recipe Finder and view her current favorites in a Favorites tab, grouped by chapter or tradition with a toggle.

**Architecture:** All changes go in the single static page `warm_kitchen_finder.html`: inline CSS, an inline vanilla-JS IIFE, and recipe data in `<script id="data">`. Pure helpers sit in a `/* @testable */` region that a Node test loader extracts and runs in a `vm` sandbox, the same pattern as `tempo/tests/load.js`. The UI wiring is checked in a real browser.

**Tech Stack:** HTML/CSS/vanilla JS with no build step, and `node --test` (Node 24, no packages).

**Spec:** `docs/superpowers/specs/2026-11-19-favorites-design.md`

## Global Constraints

- **Wait for the sync:** don't start until projects-c0 says its book-data sync of `warm_kitchen_finder.html` is committed and pushed. Then pull first.
- **No new dependencies or build step:** icons are inline SVG with `stroke="currentColor"`.
- **Styling:** use the existing Warm Kitchen tokens (`--accent`, `--line`, `--wash`, `--faint`, …) and the `.seg` control. Keep it minimal, with no cute copy.
- **Storage:** extend the localStorage object under `STORE = "warm-kitchen-finder-v1"` with `favs: string[]` (recipe ids) and `favGroup: "chapter" | "tradition"`. Existing saves without these keys must still load.
- **Copy:** tab `Favorites <n>`. Star labels: "Save to favorites" / "Remove from favorites". Empty state: "No favorites yet. Tap the star on any recipe to save it here." Switch labels: "Chapter" and "Tradition", with `aria-label="Group favorites by"`.
- **Never nest the star `<button>` inside the card `<button>`.**
- **Hash:** `#favorites` selects the tab, the same way `#plans` does.

## Review Focus

- **Old, corrupt or foreign saved data:** if `favs` is missing, not an array, or holds unknown or duplicate ids, the kitchen still loads and `favs` is cleaned. (Task 1 `cleanFavs` tests. Task 2: `load()` must read favs *before* its early `return`.)
- **Storage unavailable (private mode):** starring still works for the session and nothing throws. (Task 2 browser check.)
- **Starring from the open recipe:** the tab count, the card stars in both grids and the Favorites grid all update at once. (Task 3 browser check.)
- **Back from a recipe opened in Favorites:** closing it, or pressing Back, lands on the Favorites tab, not Recipes. (Task 3. `route()`'s `closing` branch only knows `plans` today.)
- **Pressing the star with Space or Enter:** it toggles without opening the recipe. (Task 2 browser check.)

---

### Task 1: Pure helpers and a test harness

**Files:**
- Modify: `warm_kitchen_finder.html` (the IIFE: add a `/* @testable */ … /* @end-testable */` region just after the `NO_TRAD` const)
- Create: `tests/load.js`, `tests/favorites.test.js`

**Interfaces:**
- Produces:
  - `cleanFavs(list: unknown, byId: Record<string, object>) -> string[]`: keeps only string ids that are in `byId`, with duplicates removed and first-seen order kept. Anything that isn't an array becomes `[]`.
  - `groupFavs(recipes: Recipe[], favs: Set<string>, mode: "chapter"|"tradition", tradOrder: string[], noTrad: string) -> {key: string, recipes: Recipe[]}[]`: `recipes` is in book order (the `R` array).
    - Chapter mode: groups are chapters in first-seen order.
    - Tradition mode: groups follow `tradOrder`. A recipe goes in every tradition it lists. A recipe with `traditions` empty or missing goes under `noTrad`.
    - Empty groups are omitted, and recipes stay in book order within each group.
  - `tests/load.js` exports `loadFinder() -> {cleanFavs, groupFavs}`. It takes the last `<script>` tag (the first is the JSON data), joins every `@testable` region, and runs it with `vm.runInNewContext`.

- [ ] **Step 1: Write `tests/favorites.test.js`** with `node:test` and `node:assert/strict`, using fixtures `a {chapter:"1. A", traditions:["Japan"]}`, `b {chapter:"1. A", traditions:["China","Japan"]}`, `c {chapter:"2. B", traditions:[]}`, `d {chapter:"2. B", traditions:["China"]}`, with `tradOrder = ["China","Japan","No single tradition"]`:
  - `cleanFavs(["b","x","b",3,"a"], byId)` → `["b","a"]`; `cleanFavs(null, byId)` → `[]`; `cleanFavs("a", byId)` → `[]`
  - chapter mode with favs `{d,a,c}` → `[{key:"1. A", ids:["a"]}, {key:"2. B", ids:["c","d"]}]` (compare `recipes.map(r=>r.id)`)
  - tradition mode with favs `{a,b,c}` → `China:[b]`, `Japan:[a,b]`, `No single tradition:[c]`, in that order
  - empty favs → `[]`
  - `parse`: the finder's main script compiles (`new vm.Script(src)` doesn't throw)
- [ ] **Step 2: Run** `node --test tests/*.test.js`. Expected: FAIL (the helpers aren't defined).
- [ ] **Step 3: Implement** both helpers in the testable region. They may only use their arguments.
- [ ] **Step 4: Run** `node --test tests/*.test.js`. Expected: all pass.
- [ ] **Step 5: Commit** `git add tests warm_kitchen_finder.html && git commit -m "Favorites: grouping and cleanup helpers with tests"`

### Task 2: Saving favorites and the star button

**Files:** Modify `warm_kitchen_finder.html` (the `S` state, `load()`, `save()`, `renderResults()`, the CSS after `.card` rules, and the sheet bar markup `.sheet-actions`)

**Interfaces:**
- Consumes: `cleanFavs`
- Produces:
  - `S.favs: Set<string>` and `S.favGroup: "chapter"|"tradition"` (default `"chapter"`)
  - `toggleFav(id: string) -> void`: flips membership, calls `save()`, then `favsChanged()`
  - `favsChanged() -> void`: re-renders every place that shows favorites. Task 3 adds `renderFavs()` to it.
  - `cardHTML(r, ev, m, qw) -> string`: the card markup moved out of `renderResults` and wrapped as `<div class="cardbox"><button class="card" data-open=…>…</button>${starHTML(r.id)}</div>`
  - `starHTML(id) -> string`: `<button type="button" class="fav" data-fav="${id}" aria-pressed="${on}" aria-label="…">svg</button>`

- [ ] **Step 1: Load and save.** In `load()`, read `favs` and `favGroup` (validate against the two modes) before the early `return`, so a kitchen-only save still loads. In `save()`, write `{ have, favs: [...S.favs], favGroup }`.
- [ ] **Step 2: Star markup and toggling.**
  - Extract `cardHTML`; `renderResults` calls it.
  - Add a star button `#sheet-fav` (class `fav`) at the start of `.sheet-actions`. `renderSheet` sets its `data-fav`, `aria-pressed` and label.
  - One document click handler on `[data-fav]` calls `toggleFav` and returns before the `[data-open]` check.
  - `favsChanged()` updates `aria-pressed`, `aria-label` and the icon fill on every `[data-fav]` button. It doesn't re-render the Recipes grid, so focus stays on the star.
- [ ] **Step 3: CSS.**
  - `.cardbox { position: relative; }`, with `.cardbox > .card { height: 100%; }`.
  - `.fav` is a 32×32 button at bottom 8px, right 8px of the card. It has no border and no background, with color `var(--faint)`. On hover the color is `var(--accent-ink)`. When `[aria-pressed=true]`, the color is `var(--accent)` and the SVG `fill: currentColor`.
  - `.card .tags { padding-right: 36px; }`.
  - In the sheet bar, `.fav` is static (not absolute).
  - Star SVG: a 24-unit star path at `width/height 18`, with `fill="none" stroke="currentColor" stroke-width="1.8"`.
- [ ] **Step 4: Verify in a browser** (`python3 -m http.server` in the repo, then open `/warm_kitchen_finder.html`):
  - [ ] Clicking a card's star fills it and doesn't open the recipe. Tab to it and press Space; it toggles.
  - [ ] Starring in the open recipe updates the card behind it.
  - [ ] After a reload, stars persist and the kitchen is unchanged.
  - [ ] Set `localStorage["warm-kitchen-finder-v1"] = '{"have":["ghee"],"favs":"junk"}'` and reload. There are no errors, ghee is in the kitchen, and nothing is starred.
  - [ ] In a private window, starring works with no console errors.
- [ ] **Step 5: Check and commit.** `node --test tests/*.test.js` passes. Commit "Favorites: star on cards and in the recipe".

### Task 3: The Favorites tab

**Files:** Modify `warm_kitchen_finder.html` (the `.views` tablist, a new `<section id="view-favs">` after `view-plans`, `showTab`/`showRecipes`/`route`, `hideSheet`, the delegated `[data-open]` click handler, `kitchenChanged`, and the start block)

**Interfaces:**
- Consumes: `groupFavs`, `cardHTML`, `S.favs`, `S.favGroup`, `favsChanged`
- Produces:
  - `renderFavs() -> void`: fills `#fav-grid` and sets `#n-favs`
  - `favIds: string[]`: the order shown, used for prev/next

- [ ] **Step 1: Markup.**
  - Add `<button role="tab" id="tab-favs" aria-selected="false" aria-controls="view-favs">Favorites <span class="n" id="n-favs"></span></button>` after `tab-plans`.
  - The section has `<h2 class="plans-head">Favorites</h2>`, then a `.seg` `#fav-group` (`role="group"`, `aria-label="Group favorites by"`) with buttons `data-v="chapter"` and `data-v="tradition"`, then `<div class="grid" id="fav-grid"></div>`.
- [ ] **Step 2: `renderFavs()`.**
  - It calls `groupFavs(R, S.favs, S.favGroup, D.traditions, NO_TRAD)`.
  - Each group gets the existing `h2.group` heading. Chapter mode shows `chapNum`/`chapName`; tradition mode shows the plain name. Both show the count.
  - Then `cardHTML(r, evaluate(r), null, [])` for each recipe.
  - `favIds` is the flattened, deduplicated order.
  - With no favorites, show `<p class="no-results" style="grid-column:1/-1">` with the empty-state copy and hide the switch.
  - `#fav-group` clicks set `S.favGroup`, `save()`, `renderFavs()` and sync `aria-pressed`.
  - Call `renderFavs()` from `favsChanged()`, from `kitchenChanged()` and at start-up.
  - Unstarring inside `#fav-grid` removes the card. Move focus to the next card's star, or to the switch if none is left.
- [ ] **Step 3: Tabs, hash and navigation.**
  - Generalize `showTab(name)` over `recipes|plans|favs`.
  - Clicking the tab sets `location.hash = "favorites"`. `showRecipes()` clears `#plans` or `#favorites`.
  - In `route()`, `favorites` gets the same treatment as `plans`, in both the `closing` branch and the normal branch.
  - The `[data-open]` handler passes `nav: "favs"` for clicks inside `#fav-grid`, and `openRecipe` then sets `navIds = favIds.slice()`.
  - `hideSheet` looks for the focus target with `#grid [data-open=…], #fav-grid [data-open=…]`, preferring the visible view.
- [ ] **Step 4: Verify in a browser:**
  - [ ] Star three recipes from different chapters, including one with two traditions (for example, check the `traditions` of recipes in `D.recipes` in the console). The tab count reads 3.
  - [ ] Chapter mode shows the chapters in book order. Tradition mode shows the two-tradition recipe under both headings. After a reload the chosen mode is kept.
  - [ ] Open a recipe from Favorites. Prev/next walks the favorites. Close it and you're back on Favorites. Back from `#favorites` returns to Recipes.
  - [ ] Load `…/warm_kitchen_finder.html#favorites` directly; the tab is selected.
  - [ ] Unstar in the tab; the card disappears. Unstar the last one; the empty state shows and the switch is hidden.
  - [ ] Removing an ingredient from the kitchen updates the Favorites cards' "ready" status.
  - [ ] On a phone-width window (390px), the tab row, the switch and the stars fit without horizontal scroll.
- [ ] **Step 5: Check and commit.** `node --test tests/*.test.js` passes. Commit "Favorites: tab grouped by chapter or tradition", including `docs/superpowers/`.
