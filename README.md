
# Lokryn Documentation

This folder contains the source for the **Lokryn Docs site**, built with [Docusaurus](https://docusaurus.io/).

## 📂 Structure

- `docs/` → All documentation pages (Markdown/MDX).
  - `intro.md` → Landing page for the docs.
  - `core/` → Core library reference (contracts, profiles, rules, logs).
  - `cli/` → CLI reference and quickstart.
  - `contributing/` → Contributor guides (validators, connectors, testing, docs).
- `static/` → Static assets (images, logos, CNAME).
- `src/pages/` → Custom site pages (homepage, 404, etc.).
- `docusaurus.config.ts` → Site configuration (title, navbar, footer, theme).

## 🚀 Local Development

Install dependencies:

```bash
npm install
```

Start a local dev server:

```bash
npm run start
```

This opens [http://localhost:3000](http://localhost:3000) with hot reload.

Build static site:

```bash
npm run build
```

Preview the build:

```bash
npm run serve
```

## 🌐 Deployment

Docs are deployed via **GitHub Pages** from the `gh-pages` branch.

1. Update `url` and `baseUrl` in `docusaurus.config.ts`.
2. Run:

   ```bash
   npm run deploy
   ```

3. GitHub Pages will serve the site at:  
   `https://developyrs.github.io/lokryn-pipe-audit-core/`  
  `https://docs.lokryn.com`

## 🛠 Contributing

- Add new pages under the appropriate folder (`core/`, `cli/`, `contributing/`).
- Use clear frontmatter with `id`, `title`, and `slug`.
- Run `npm run start` to preview changes locally.

## ✨ Notes

- Keep docs **modular and contributor‑friendly**.
- Every new validator or connector should include:
  - A doc page under `contributing/`.
  - Example TOML snippets.
  - Contributor notes in code comments.
- Treat docs as a **first‑class artifact** of the project.
```

