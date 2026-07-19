# pi625.github.io

My personal website — a minimalist Jekyll site with a glassmorphism theme.
Sections: Home, Blog, Mathematics, Linguistics, Philosophy, Etc., and CV.

## Local preview

```bash
bundle install
bundle exec jekyll serve --livereload   # http://127.0.0.1:4000
```

## Build

```bash
bundle exec jekyll build
```

## Notes

- Math is typeset with MathJax (see `_includes/math.html`).
- Styling lives in `_sass/moonwalk.scss`; theme tokens (colors, glass, blobs)
  are at the top of that file.
- Navigation tabs are defined in `_data/home.yml`.
- Blog posts go in `_posts/`; standalone pages use `layout: page`.
- Deploys to GitHub Pages via `.github/workflows/pages.yml` on push to `main`.
  Enable **Settings → Pages → Build and deployment → GitHub Actions** once.
