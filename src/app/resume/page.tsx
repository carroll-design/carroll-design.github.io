import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { getResume, getSite } from "@/lib/content";
import { formatMonthLong } from "@/lib/format";
import { Mdx } from "@/lib/mdx";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Prose } from "@/components/Prose";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Resume",
  description: "Resume of Cameron Carroll, viewable and downloadable.",
  path: "/resume",
});

export default function CvPage() {
  const resume = getResume();
  const site = getSite().meta;

  // The resume is the PDF itself, shown in an inline viewer with a download
  // action. Both render only when the redacted PDF actually exists, so the
  // site never ships a dead link or an empty frame while the file is
  // pending; until then the note from content/resume.mdx renders instead.
  const pdfExists = fs.existsSync(
    path.join(process.cwd(), "public", ...site.resumePdf.split("/")),
  );

  return (
    <>
      <PageHeader
        title="Resume"
        lead={
          resume.meta.updated
            ? `Updated ${formatMonthLong(resume.meta.updated)}`
            : undefined
        }
      />

      {pdfExists ? (
        <Reveal>
          <Section className="pb-20">
            {/* The resume is presented as a print on a mat, the same plate idiom the
              hero portrait and og-card use, rather than as a browser PDF
              widget dropped into the page. The column is capped at the true
              width of a Letter page (52rem, about 812px inside the mat), so
              the sheet renders near 1:1 instead of being blown up to the full
              measure of the site. */}
            <div className="sd-rise mx-auto max-w-[52rem]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4 print:hidden">
                <p className="text-xs text-ink-faint">
                  One page · PDF · Letter
                </p>
                <div className="flex items-baseline gap-6 text-sm">
                  <a
                    href={site.resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-external text-ink-muted transition-colors duration-[--duration-fast] hover:text-accent"
                  >
                    Open in new tab
                    <span
                      aria-hidden="true"
                      className="link-arrow ml-1 text-accent"
                    >
                      ↗
                    </span>
                  </a>
                  <a
                    href={site.resumePdf}
                    download
                    className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2 font-medium text-paper transition-colors duration-[--duration-fast] hover:bg-accent-strong"
                  >
                    Download PDF ↓
                  </a>
                </div>
              </div>

              {/* Aspect ratio comes from the page's own MediaBox (612x792pt), so
                the whole resume is visible at once rather than clipped inside a
                scrolling frame. toolbar=0 drops the viewer's grey chrome,
                which the two actions above already replace. */}
              <div className="rounded-[6px] border border-line-strong bg-paper-raised p-2.5 shadow-[var(--shadow-print)]">
                <iframe
                  src={`${site.resumePdf}#toolbar=0&navpanes=0&view=Fit`}
                  title="Cameron Carroll's Resume (PDF)"
                  className="aspect-[612/792] w-full rounded-[2px] border-0 bg-paper-raised"
                />
              </div>
            </div>
          </Section>
        </Reveal>
      ) : (
        <Reveal>
          <Section className="py-8">
            <div className="sd-rise">
              <Prose>
                <Mdx source={resume.body} />
              </Prose>
            </div>
          </Section>
        </Reveal>
      )}
    </>
  );
}
