---
name: testing-jekyll-site
description: How to run and test the nullstellensatz Jekyll static blog locally (glassmorphism theme, MathJax, light/dark toggle).
---

# Testing the nullstellensatz Jekyll site

## Run locally
- Ruby 3.0 + Bundler are installed. Gems are installed via `bundle install` (global bundle path configured).
- Add the gem bin to PATH: `export PATH="$HOME/.gem/ruby/3.0.0/bin:$PATH"`
- From repo root: `bundle exec jekyll serve --livereload --host 127.0.0.1 --port 4000`
- Site: http://127.0.0.1:4000 . If gems missing, run `bundle install` first.
- No backend, no auth, no secrets needed. Generated HTML lands in `_site/`.

## Key pages / selectors
- Home `/`, blog index `/blog/`, about `/about/`, RSS `/feed.xml`.
- Posts permalink pattern: `/blog/:title/` (e.g. `/blog/combinatorial-nullstellensatz/`).
- Theme toggle: bottom-right circular glass button (`.theme-toggle`); it flips `data-theme` on `<html>` and persists to `localStorage`. Verify via `document.documentElement.getAttribute('data-theme')`.
- Math: MathJax 3 CDN; typeset math appears as `<mjx-container>`/`<math>` in the DOM (not raw `$...$`).

## Known gotcha (kramdown GFM + inline math with pipes) — FIXED as of commit 8c70c8f
If `_config.yml` sets `kramdown: input: GFM`, a **paragraph line** with inline math containing pipe chars, e.g. `... with $|C| = |A| + |B| - 2$ ...`, is mis-parsed as a GFM **table** — rendering a bordered table with literal `$` instead of typeset math. This was fixed by (1) dropping `input: GFM` from `_config.yml` and (2) escaping bars to `\lvert ... \rvert` in the post. When testing posts, a fast regression check is: `grep -rc '<table' _site --include='*.html'` should be **0** (no post/page legitimately uses tables). Display math `$$...$$` blocks with `|` were never affected. Note: raw served HTML contains `$...$` delimiters (typeset client-side by MathJax); the browser DOM shows `<mjx-container>`/`<math>` after JS runs.

## Devin Secrets Needed
None.
