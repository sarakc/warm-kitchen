# Finder: one card per variation, and a new filter bar

Date: 2026-11-26. Finder only (`warm_kitchen_finder.html`); the book and `cookbook/` are unchanged.

## Why

- The five method recipes ("Roast: one tray, 20–35 min", "Sauté and stir-fry…", "Braise and simmer…", "Steam or blanch,
  then dress…", "Mash and purée…") have no ingredient list of their own, so the finder counts them as "0 missing" and
  they pass every pantry filter. With "Missing: None" you see "Roast" even when you can't make any roast.
- Browsing the book's way (chapter by chapter) is the most useful default, and tradition, order and chapter
  should be visible filters, not hidden behind "More filters". The rail's Contents list wasn't read as a filter, even
  on a laptop.

## Goals

1. The five method recipes are not cards in the finder. Their variations already exist as their own recipes (48
   records with `parent` set to the method), each with ingredients and a place chip; those are the cards.
   - The method page still opens from each variation's "Part of Roast: one tray…" link (it holds the oven temperature
     and the shared method).
   - Each variation card says which method it belongs to ("Vegetables · Roast"), and searching "roast" finds them.
   - A favorite already set on a method recipe still shows in Favorites.
2. The default order is the book's, grouped under chapter headings. Old links that omit `sort` now open in book
   order; `?sort=best` still works.
3. A visible filter bar: search, pantry match, chapter, tradition, jobs, and order. No "More filters" disclosure.
4. "Uses ingredient" folds into search: typing offers "Must include: Salmon" suggestions; a picked ingredient becomes a
   removable chip. Still `?uses=`.
5. Wording: no "Sort by book order" or "Book chapter". The order choice reads "As in the book".
6. A little more colour, still within the Warm Kitchen tokens: set filters tint in the accent; job toggles carry their
   own colour when off; the ready count is green.

## Non-goals

- No change to the book, the cookbook page, recipe ids or stored favorites/pantry.
- No change to Meal plans, Favorites grouping or the pantry page beyond shared styles.
- "Any green with any sauce" (a Steam variation with no recipe of its own) gets no card.

## Design

Filter area, top to bottom:

```
[ Search recipes, ingredients, traditions   / ]   MISSING FROM YOUR PANTRY [Any|None|Up to 1|Up to 2]
   (suggestions while typing:  MUST INCLUDE  Salmon · 9 recipes / Smoked salmon · 2 …)
[All chapters ▾] [All traditions ▾]  WARM OIL BUILD BLOOD PHLEGM CALM
All 228 recipes · 16 ready   [Must include salmon ×]   Clear filters          Order [As in the book ▾]
```

- Chapter and tradition are native `<select>`s styled as pills (native pickers on phones, no custom popover). A pill
  with a value set turns accent-tinted. The rail's Contents list stays on wide screens and stays in sync; on narrow
  screens it is hidden, since the chapter pill does the same job.
- Order options: As in the book (default; grouped under chapter headings), Ready to cook first (labelled "Best match"
  while searching; ranks matches, then readiness), By tradition, A to Z.
- Search suggestions: an ARIA combobox/listbox. Up to 5 ingredients whose name or other names start with what's typed
  (2+ characters), most-used first, not already chosen. Arrow keys move, Enter picks, Escape closes; picking clears
  the search text. Free-text search keeps working while the list is open.

## Left to the builder

Exact spacing, colours within the tokens, and test updates (`tests/filters.test.js` default sort).

## Follow-up: variations last (2026-11-26)

- A method's one-line variations (the dishes in its Variations list, `variationIds`) are lighter cards: a faint
  tint, a dashed border, a smaller title. Its full model recipes (Roasted Roots with Rosemary) stay normal cards.
- Browsing in the book's order, each chapter shows its full recipes first, then the variations under a heading per
  method ("Variations · Roast: one tray, 20–35 min", which opens the method). `bookOrder` does the reordering.
- Variation cards carry no method label. Their names say the method where it isn't obvious: the book now has
  "Sautéed carrots with ginger" and, under Mash and purée, "Carrot and ginger mash", "Cauliflower purée with ghee
  and nutmeg", "Kabocha mash with miso butter", "Parsnip and potato mash" and "Crushed peas with butter and mint".
  Ids are unchanged.
- With a chapter chosen, cards leave the chapter's name out, as they do under a chapter heading.
