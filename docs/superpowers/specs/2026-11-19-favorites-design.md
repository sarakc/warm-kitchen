# Favorites in the Recipe Finder (design)

Date: 2026-11-19 · Size: small change · File: `warm_kitchen_finder.html`

## Why
While browsing, Sara wants to save a recipe that looks good with one tap. Later she wants to come
back and easily see her **current** favorites, grouped by **chapter** or by **tradition**, and switch
between the two.

## Goals
- A star on every recipe card and in the open recipe's sheet bar toggles a favorite.
- A **Favorites** tab next to Recipes and Day plans, with a count, shows only starred recipes.
- Inside the tab, a two-way switch **Chapter | Tradition** groups the cards under headings.
- Favorites survive reloads.

## Non-goals
- No sync across devices or browsers, no accounts, no backend.
- No notes, ratings or ordering within favorites.
- No "favorites only" filter or grouping on the Recipes tab.

## Anti-goals
- Clutter that breaks the minimal, cookbook-like look (see the Warm Kitchen UI taste).
- A favorite star that can be confused with the ingredient-chip "uses" star.
- Favorites lost when a recipe's title changes.

## Approaches considered
1. **Favorites tab** (chosen). It fits the existing tab pattern, keeps the Recipes view
   unchanged, and grouping only has to cover starred recipes.
2. "Favorites only" filter plus a Group-by setting on the Recipes tab. Rejected: grouping would
   have to cover all recipes, and it crowds an already busy filter bar.
3. A favorites list in the left rail. Rejected: the rail is narrow and already holds the kitchen.

## Design
- **Storage:** a `favs` array of recipe ids, added to the existing `warm-kitchen-finder-v1`
  localStorage object next to `have`. `load()` tolerates a missing key. The group mode
  (`chapter` or `tradition`) is stored there too. Ids are stable: the 2026-11-19 book sync keeps them.
- **Star button:** an outline/filled star icon (inline SVG, `currentColor`, accent when on) with
  `aria-pressed` and the label "Save to favorites" or "Remove from favorites". The card is a
  `<button>`, so the star is a sibling inside a wrapper, not nested in it. Clicking the star
  never opens the recipe.
- **Favorites tab:** `Favorites <n>`, with the URL hash `#favorites` like `#plans`. Groups and the
  cards within them follow book order. Chapter headings use the chapter name. A recipe with two
  traditions appears under both. A recipe with no tradition goes under "No single tradition".
  Unstarring a recipe in the tab removes it at once.
- **Empty state:** one plain line, e.g. "No favorites yet. Tap the star on any recipe to save it here."
- Cards in the tab reuse the existing card markup, so they show the same "ready / missing" status.

## Left to the builder
The exact star placement on the card, the spacing, and the switch styling, all within the existing
tokens and the `.seg` control pattern.
