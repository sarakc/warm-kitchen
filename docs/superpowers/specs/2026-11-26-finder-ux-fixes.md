# Finder: UX and style fixes after the variation-card pass

Date: 2026-11-26. Written after `af21df9` (variation cards carry the full method). Finder only
(`warm_kitchen_finder.html`), plus one test and a line in `docs/STYLE.md`. The book and `cookbook/` are unchanged.
Status: **not started.** Build it in a worktree; the open decisions are at the end.

Line numbers are as of `af21df9` and will drift; the function names are the stable reference.

## Review

The live finder was checked at 1400px and at 375px (headless Chrome won't go below 500px, so phone width was
rendered inside a 375px iframe). Views checked: Recipes, a variation card (Carrots with cumin and honey), a method
card (Roast), Pantry and Plans.

What already works: the cookbook look, the rail, the bordered cards, the pantry page and the new numbered steps
on variation cards. The problems are mostly small inconsistencies that add up.

| # | Where | Problem | Priority |
| --- | --- | --- | --- |
| 1 | Recipe page, variation cards | "You will need" is uppercase pills that look like job tags, has no amounts, and colours missing items in the accent instead of the missing colour | High |
| 2 | Recipe page and cards | Origin shown twice, in two styles ("Maghreb" chip, then *Morocco* in italic serif) | Medium |
| 3 | Method cards | The book's ○ ("cooks honey") prints after variation names and looks like the "Missing 3+" dot | High (small) |
| 4 | Method cards | Variation names aren't links to their own cards; "Model recipes for this method:" has no space above it | Medium |
| 5 | Recipe cards | Status reads before the title, in small spaced capitals ("MISSING 2: FENNEL SEED, GROUND GINGER") | Medium |
| 6 | Phone | The filters fill the whole first screen; the first recipe starts below the fold | High |
| 7 | Rail | Contents shows on Pantry, Favorites and Plans, where it doesn't apply | Low |
| 8 | Plans | "The Sunday batch" sits alone in a three-column grid | Low |
| 9 | Everywhere | WARM, OIL, BUILD, BLOOD, PHLEGM and CALM are never explained | Decision |

## 1. Variation cards get a real ingredient list

**Now.** Variation records (41, plus 3 method-only recipes) keep their ingredients in `lines` with
`hidden: true`. `renderSheet` (~line 1796) draws those as a "You will need" row of `.tag` pills: uppercase,
spaced, no amounts, inline `style` colours, `--good` for have and `--accent` for missing. That sits a few lines below
the job tags, which use the same pill shape, and next to the "Missing: Carrots" status, which uses `--warn`.
STYLE.md: `--warn` means missing. The model recipes (Roasted Roots etc.) already get a proper list: serif lines with
amounts, ingredient names that link to `?uses=`, and a "Need … · I have it" note on missing lines.

**Change.** Give the 44 records the model recipes' list, and remove the pills.

Data (in the data block, through the usual script; ids unchanged):

- Rewrite each hidden line's `text` as an ingredient phrase: amount plus ingredient, no method words, first letter
  capitalised like the model recipes. Carrots with cumin and honey becomes:
  `Carrots` · `2–3 tbsp oil or ghee` · `1 tsp cumin` · `1 tsp honey or maple` · `A squeeze of lemon`.
- Remove `hidden: true` from those lines.
- Keep each line's `groups` and `kind` exactly as they are. Where a fragment holds two ingredients
  ("coins in ghee with grated ginger and a pinch of cumin"), split it into one line per group, so the set of groups
  per recipe doesn't change. `evaluateLines` must return the same `needed`/`missing` for every recipe.
- Of the 159 hidden lines, about 18 hold method text that needs this rewrite, e.g. `wedges, 35–40 min`,
  `3 sliced garlic cloves for the last 8 min`, `toss hot with Miso Butter`, `Honey after it cools slightly.` The steps
  already carry those instructions, so nothing is lost. List them with:
  `node -e` over the data block, `lines.filter(l => l.hidden)`.
- The 3 method-only recipes (`ghee`, `ginger-tea`, `roasted-sweet-potato`) get the same treatment; their `method`
  paragraph stays as the method. Ghee: `1 lb unsalted butter`. Ginger tea: `A thumb of ginger`,
  `A pinch of cinnamon or 2 cardamom pods`, `Honey`. Roasted sweet potato: `Whole sweet potatoes`,
  `Butter`.
- Salt and other untracked staples are not added; the steps say them.

Script:

- Delete the `hidden`/`needs` block in `renderSheet` (~lines 1796–1802) and the `!l.hidden` filter on `main`
  (~line 1794). With no hidden lines, every recipe's list goes through `li()`.
- Nothing else in the finder reads `l.hidden`.

Cross-repo: Sara's private apps also skip `hidden` lines when they draw a recipe, so after this change they show the
new lists too, which is intended. Run their tests against this worktree before pushing (the Projects-level notes say
how).

**Done when.**

- The carrot card shows a five-line ingredient column like Roasted Roots, with "Need Carrots · I have it" on the
  missing line.
- No uppercase pills remain under "You will need"; the label "You will need" is gone (the column needs no label,
  like the model recipes).
- A new test in `tests/data.test.js`: no recipe has a line with `hidden: true`.
- A before/after check (scratch script, not committed): `evaluateLines` returns the same result for every recipe
  with an empty pantry, the everyday pantry and a full pantry.

## 2. One origin line

**Now.** The page shows the tradition chips (`tradChips`), then `originNote` as its own italic serif paragraph
(`.origin`, ~line 1823). Carrots: a "Maghreb" chip, then *Morocco* underneath. Cards do the same (`.card .origin`,
line 288, serif 14.5px block).

**Change.** Put the note on the chips' line, after the chips: plain text in the chip font (Inter 500, 12–13px,
`--muted`), no border, no italics. Reads as `[Maghreb] Morocco`. Same on cards and on the recipe page. When there are
no chips, the note stands alone in that style.

**Done when.** Carrots shows one origin line on both card and page; Niter Kibbeh's English name ("Ethiopian spiced
butter") is unaffected (that's `names`, not the origin note).

## 3. Drop the ○ and ◇ marks from method lists

**Now.** A variation's name in the parent's `variations[]` ends with the book's mark ("Carrots with cumin and honey
(Morocco) ○"). The method card prints it as is. In the finder ○ means "Missing 3+" (cards, the Plans legend). The
variation's own page already turns the mark into a sentence ("Cooks honey. Ayurveda says…").

**Change.** When rendering `r.variations` in `renderSheet` (~line 1835), strip trailing ○/◇ from the shown name.
Keep the mark in the data (`marks` drives the sentence, and the name is how a variation record is matched to its
bullet, see `heading` ~line 1813). Item 4 replaces this rendering anyway; do them together.

## 4. Method cards link to their variations

**Now.** On Roast, each variation is a bold name with no link, though each has its own card. Below the list,
"Model recipes for this method: Roasted Roots with Rosemary" sits right against the last bullet (`.related`,
margin-top 18px but directly after the list's last item border).

**Change.**

- In the variations list, find the record for each bullet (`R.find(x => x.parent === r.id && heading(x) === v.name)`).
  If found, the name becomes `<button class="xref" data-open="…">Title</button> (Origin).`, with the mark dropped
  (item 3). If not found ("Any green with any sauce"), plain bold text as now.
- Restyle "Model recipes" to match the variation card's quiet `Method` link (`.from`, added in `af21df9`): a small
  label "Model recipes" and the links, `margin-top: 22px`. No sentence.

**Done when.** From Roast, every variation with a card opens it; from that card, "Method · Roast" goes back.

## 5. Card status under the title, in sentence case

**Now.** `.card-head` (lines 277–278) puts the chapter/method link left and the status right, all in 9.5px uppercase
with 0.14em tracking. In "By chapter" order the left side is empty, so the status floats alone top right, above the
title. Ingredient names in capitals are slow to read.

**Change.**

- `.card-head` keeps only the chapter · method kicker (uppercase is fine there). When it's empty (grouped by chapter,
  not a variation), don't render it.
- The status (`readyOf`, dot plus text) moves to its own line after the chips/origin and before the job tags:
  Inter 500, 12.5px, no uppercase, no tracking, colour by class as now.
- Wording stays as STYLE.md has it ("Ready to cook", "Missing: ginger", "Missing 2: ginger, salmon", "Missing 4").
  Vocabulary labels are capitalised ("Fennel seed"); lowercase them in this text so it reads
  "Missing 2: fennel seed, ground ginger". Check the vocab for proper names first (e.g. Scotch bonnet) and keep
  their capitals; a short list in the script is fine.

**Done when.** Cards read title first; tests in `tests/pantry.test.js` still pass (the `pantryStatus` wording
doesn't change, only its display).

## 6. Phone: fold the secondary filters

**Now.** At 375px the search, the pantry segmented control, chapter and tradition selects, two rows of job chips and
the order row take the whole first screen.

**History.** `2026-11-26-finder-filters-design.md` removed the old "More filters" disclosure on purpose: chapter,
tradition and jobs should be visible. That was judged on a laptop. `docs/STYLE.md` still says "Secondary filters
fold behind 'More filters'", which is now wrong either way.

**Change (proposed, needs Sara's OK, see Decisions).** Below 700px only, wrap `.filterbar` (chapter, tradition,
jobs) in a `<details class="fold">` whose summary reads "Filters" plus the number on (chapter, tradition and each job
count one). Above 700px it's always open with the summary hidden. That's the pattern the rail's folds already use
(lines 173–181, `syncFolds`). Search and "Missing from your pantry" stay visible. The active-filter chips in
`.summary` already show what's on when it's folded.

Then fix STYLE.md's Layout line to say what was decided.

**Done when.** At 375px the first card's title is visible without scrolling; at 1400px nothing changes.

## 7. Contents only with Recipes

`showTab` (~line 1977): set `$("contents-wrap").hidden = name !== "recipes"`. On phones it's already hidden
(line 181). Check first what a chapter click does from Plans today; if it jumps to Recipes filtered, that's a
shortcut Sara may want to keep (see Decisions).

## 8. Plans: the batch plan spans the row

`planSections` puts the Sunday batch in an untitled section. In `renderPlans`, give plans in an untitled section a
`wide` class: `.plan.wide { grid-column: 1 / -1; }` and, above 900px, `.plan.wide ul { display: block; columns: 2;
column-gap: 32px; }` with `break-inside: avoid` on its items.

## 9. Saying what the six jobs mean (decision only)

A visitor can't find out what BLOOD or PHLEGM means. A sentence would break the no-explanatory-text rule, so this
needs Sara's decision. The proposal is a link, not text: after the job chips, a quiet link "The six jobs ↗", styled
like the rail's "Google Doc ↗", to `cookbook/#h.u8vdqdvvju5p` (the book's "The six jobs" heading). If adopted, keep
the id in one constant and add a test that `cookbook/index.html` contains it, since Google Doc heading ids change if
the heading is recreated.

## Decisions for Sara

1. **Item 6:** fold chapter, tradition and jobs behind "Filters" on phones only? (Recommended: yes.)
2. **Item 7:** hide Contents on Pantry, Favorites and Plans, or keep it as a way back into a chapter?
   (Recommended: hide.)
3. **Item 9:** add the "The six jobs ↗" link, or leave the jobs unexplained?
4. **Item 1:** the ingredient lines will be written in the finder, not the book (the book's bullets stay as they
   are). Fine, or should matching edits go into `docs/google-doc-edits.md`?

## Order of work

1, 3 and 4 together (recipe and method pages), then 5 and 2 (cards), then 6, then 7 and 8; 9 if approved.
One commit per item group.

## Verify

- `node --test tests/*.test.js` and `node scripts/finder-data.mjs` (no diff after it runs).
- The before/after `evaluateLines` check from item 1.
- The private apps' tests against the worktree (item 1 changes data they read).
- Screenshots at 1400px and 375px (iframe) of: Recipes, Carrots with cumin and honey, Roast, Plans. Check dark mode
  too, since items 1, 2 and 5 change colours and type.
- Then merge, push (Pages deploys `main`), remove the worktree and branch, and update `Projects/TODO.md`.

## Out of scope

- The book and `cookbook/`; the Google Doc.
- The 7 model recipes' own wording (e.g. Roasted Roots' one-line method). Worth a separate pass like the variation
  cards had.
