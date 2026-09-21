import Link from "next/link";
import { Section } from "@/components/Section";

const suggestion =
  "text-sm font-medium text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong";

export default function NotFound() {
  return (
    <Section className="flex min-h-[55vh] flex-col justify-center py-24">
      <div className="stagger max-w-[38rem]">
        <p
          aria-hidden="true"
          className="font-serif text-sm text-accent italic tabular-nums"
        >
          404
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink-strong sm:text-5xl">
          This page isn&rsquo;t in the archive.
          <span
            aria-hidden="true"
            className="draw-underline mt-3 block h-[3px] w-24 rounded-full bg-accent"
          />
        </h1>
        <p className="mt-5 text-lg text-pretty text-ink-muted">
          The address may have moved, or it never existed. The work, however, is
          exactly where it should be:
        </p>
        <nav
          aria-label="Suggestions"
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <Link href="/" className={suggestion}>
            ← Back home
          </Link>
          <Link href="/experience" className={suggestion}>
            Professional Experience
          </Link>
          <Link href="/projects" className={suggestion}>
            Projects
          </Link>
          <Link href="/news" className={suggestion}>
            News
          </Link>
        </nav>
      </div>
    </Section>
  );
}
