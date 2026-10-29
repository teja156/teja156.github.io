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

The site is hosted on Vercel, connected to this repo. Every push to `main` deploys automatically. There is no build step, and the output directory is the repo root. `.vercelignore` keeps repo-only files like this README from being served.

## Adding a project

Add an `<li>` to the `#repos` list in `index.html` with `data-tags` set to any of `security`, `automation`, `ai`, `infra`. The terminal's `projects` and `open` commands pick it up automatically.
