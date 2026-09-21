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
