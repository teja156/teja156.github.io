# tejaswaroop.com

Personal site of Teja Swaroop. Plain HTML, CSS and JavaScript with no build step, styled like a phosphor terminal.

## Layout

- `index.html` is the home page: interactive shell, about, history, projects (TubeMatic pinned), OSCP review and writeups.
- `writeups/` holds the pentest walkthroughs and notes.
- `assets/css/site.css` and `assets/js/site.js` hold all styling and behaviour.
- `404.html` handles unknown paths.

## Run locally

```bash
python -m http.server 8000
```

## Deploy

Pushing to `main` runs `.github/workflows/pages-deploy.yml`, which copies the static files to the `gh-pages` branch that GitHub Pages serves.

## Adding a project

Add an `<li>` to the `#repos` list in `index.html` with `data-tags` set to any of `security`, `automation`, `ai`, `infra`. The terminal's `projects` and `open` commands pick it up automatically.
