# carroll-design.github.io

Personal academic and professional site of Cameron Carroll.

Fully static site built with Next.js (App Router), TypeScript, and Tailwind
CSS. All content lives in `content/` as Markdown/MDX with Zod-validated
frontmatter — none of it in components. See `PLAN.md` for architecture and
`CHECKLIST.md` for build progress.

## Development

```bash
npm install
npm run dev       # local dev server
npm run check     # lint + typecheck + format check + static build
npm run build     # static export to out/
```

## GitHub Pages

The repository is configured as a fully static Next.js export. The workflow in
`.github/workflows/deploy-pages.yml` builds `out/` and deploys it to GitHub
Pages on pushes to `main`.

In the repository settings, set **Pages > Build and deployment > Source** to
**GitHub Actions**. This repository uses the user-site URL
`https://carroll-design.github.io`, so no project subpath configuration is
needed.
