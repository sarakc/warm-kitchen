# Style guide

The look of the Warm Kitchen cookbook and its recipe finder. What every project shares is in
[STYLE-PRINCIPLES.md](../../STYLE-PRINCIPLES.md) (outside this repo). Being rebuilt section by
section; this file holds what is decided so far.

## Character

A quietly edited cookbook, not a productivity dashboard: warm, calm, tactile and restrained.
Generous paper-coloured space, a white reading surface, fine warm-grey rules, editorial serif
type and small sans-serif controls. No gradients, glossy effects, oversized marketing type or
new colours.

The finder looks like the published cookbook: a contents-style rail on the left and bordered
recipe cards.

## Colour

| Role | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--paper` / `--surface` / `--wash` | `#fbf8f3` / `#ffffff` / `#f4ede3` | `#1b1613` / `#241e1a` / `#2c241f` | the page; cards and the reading surface; tinted grounds |
| `--ink` / `--muted` / `--faint` | `#2b2420` / `#6d5a4c` / `#9a8573` | `#f0e7dc` / `#bfac9a` / `#95806d` | text, in three strengths |
| `--line` | `#e6dacb` | `#3b312a` | borders and rules |
| `--accent` / `--accent-ink` / `--accent-soft` | `#b5532c` / `#a2441f` / `#f4ddd0` | `#e3855c` / `#ef9b75` / `#46291c` | the accent |
| `--good` on `--good-soft` | `#4e6a2b` on `#e4ebd5` | `#a9c47e` on `#2e3622` | available; ready to cook |
| `--warn` on `--warn-soft` | `#9a6a12` on `#f5ead0` | `#e2b960` on `#3a2f17` | missing something |
| `--t-<job>` on `--t-<job>-bg` | | | one pair per recipe job: WARM, OIL, BUILD, BLOOD, PHLEGM, CALM |

Status colours and dots mean the same thing everywhere, always with a word beside them.

## Type

- Display and recipe titles: Fraunces, weight 300–400.
- Reading text: Source Serif 4, weight 400–600.
- Controls, counts, labels and metadata: Inter, weight 500–600.
- Uppercase labels stay small, with restrained tracking.

## Layout and shape

- Desktop: a 300px sticky rail (views, contents) beside a flexible recipe area capped
  around 1180px. The views are tabs, each with a count: Recipes, Meal plans, Favorites, Pantry.
  Below 900px the rail becomes a stacked top section, its tabs in one row and its groups
  folded; below 700px the toolbar stacks.
- Cards: a 1px warm border, 8px radius, white surface, no heavy shadow.
- Controls: 1px warm borders, 4–8px radii, heights about 28–44px. Tags 3px, chips 4px.
- Secondary filters fold behind "More filters".
- Healing traditions (Ayurveda, Unani) are chips in italic with a dashed border, apart from
  places.

## Writing

- Plain labels: "Recipe Finder", not a slogan. No marketing or cute headings.
- Say whether a control changes your pantry or narrows the recipe list.
- The pantry match has one vocabulary. The filter is "Missing from your pantry": Any, None,
  Up to 1, Up to 2. Cards say "Ready to cook" when nothing tracked is missing,
  "Missing: ginger" for one, "Missing 2: ginger, salmon" for two, and the count alone above
  that. Day-plan legends use the same words. The default recipe order is "By chapter"
  ("Best match" while searching). "Flexible" is only for recipes with no fixed
  tracked ingredients, never for a complete match.

## Behaviour

- Changing "Your kitchen" recalculates everything at once: results, counts, cards, plans,
  favorites and an open recipe.
- Filters live in the URL so they can be shared; the pantry stays in the browser.

## Implementation notes

Kept apart until we decide where implementation guidance lives.

- The finder's tokens are its `:root` block, with dark values under `prefers-color-scheme`
  and `data-theme`. The cookbook page carries the same tokens and fonts.
