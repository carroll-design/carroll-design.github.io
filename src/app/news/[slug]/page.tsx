import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/site";
import { getNews, getNewsItem } from "@/lib/content";
import { NewsJsonLd } from "@/components/NewsJsonLd";
import { Mdx } from "@/lib/mdx";
import { Section } from "@/components/Section";
import { Prose } from "@/components/Prose";
import { ArrowRightIcon } from "@/components/icons";

export function generateStaticParams() {
  return getNews().map((n) => ({ slug: n.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return {};
  return pageMetadata({
    title: item.meta.text,
    description: item.meta.text,
    path: `/news/${slug}`,
    publishedTime: item.meta.date,
  });
}

function fullDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const { meta, body } = item;
  const related = meta.href;
  const relatedLabel = meta.linkLabel ?? "Read more";
  const relatedInternal = related?.startsWith("/");

  return (
    <Section as="article" className="stagger pt-12 pb-8 sm:pt-16">
      <NewsJsonLd
        headline={meta.text}
        date={meta.date}
        path={`/news/${slug}`}
      />
      {/* The back arrow stays visible (it reads as one unit with the label)
          but pulls left on hover, the mirror of the forward slide above. */}
      <Link
        href="/news"
        className="group text-sm font-medium text-ink-muted transition-colors duration-[--duration-fast] hover:text-accent"
      >
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-[--duration-base] ease-[--ease-out-expo] group-hover:-translate-x-1"
        >
          ←
        </span>{" "}
        News
      </Link>

      <header className="mt-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
          News
        </p>
        <h1 className="mt-3 max-w-[30ch] font-serif text-3xl font-medium tracking-tight text-balance text-ink-strong sm:text-4xl">
          {meta.text}
        </h1>
        <time
          dateTime={meta.date}
          className="mt-4 block text-sm text-ink-muted"
        >
          {fullDate(meta.date)}
        </time>
      </header>

      {body && (
        <div className="mt-8">
          <Prose>
            <Mdx source={body} />
          </Prose>
        </div>
      )}

      {/* Press coverage is its own block ahead of "Related", not a trailing
          sentence in the prose. Each outlet is a named link, so the coverage
          is scannable and reads as a record rather than an aside. */}
      {meta.coverage.length > 0 && (
        <aside className="mt-10 max-w-[var(--measure)] rounded-md border border-line bg-paper-raised p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Press coverage
          </p>
          <ul className="mt-3 divide-y divide-line-strong">
            {meta.coverage.map((c) => (
              <li key={c.href} className="py-2 first:pt-0 last:pb-0">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-external text-sm font-medium text-ink transition-colors duration-[--duration-fast] hover:text-accent"
                >
                  {c.outlet}
                  <span
                    aria-hidden="true"
                    className="link-arrow ml-1 text-accent"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {related && (
        <aside className="mt-10 max-w-[var(--measure)] rounded-md border border-line bg-paper-raised p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">
            Related
          </p>
          {/* Two arrow idioms, deliberately: an internal destination keeps a
              visible arrow that slides forward (the FlagshipCard pattern),
              while an external one uses the reveal shared with the footer,
              press list and resume. */}
          {relatedInternal ? (
            <Link
              href={related}
              className="group mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong"
            >
              {relatedLabel}
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-[--duration-base] ease-[--ease-out-expo] group-hover:translate-x-1" />
            </Link>
          ) : (
            <a
              href={related}
              target="_blank"
              rel="noopener noreferrer"
              className="link-external mt-2 inline-flex items-baseline text-sm font-medium text-accent transition-colors duration-[--duration-fast] hover:text-accent-strong"
            >
              {relatedLabel}
              <span aria-hidden="true" className="link-arrow ml-1">
                ↗
              </span>
            </a>
          )}
        </aside>
      )}

      <footer className="mt-14 border-t border-line pt-8">
        <Link
          href="/news"
          className="group text-sm font-medium text-ink-muted transition-colors duration-[--duration-fast] hover:text-accent"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-[--duration-base] ease-[--ease-out-expo] group-hover:-translate-x-1"
          >
            ←
          </span>{" "}
          Back to News
        </Link>
      </footer>
    </Section>
  );
}
