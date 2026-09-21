// Element styling for compiled MDX bodies (PLAN §2.2, §7). Passed to
// MDXRemote in src/lib/mdx.tsx. Each element is styled explicitly rather than
// pulling in the typography plugin, so the type rhythm matches the design
// tokens exactly.

import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { NppArchitectureDiagram } from "./figures/NppArchitectureDiagram";
import { NppResultsTable } from "./figures/NppResultsTable";
import { ElsaPipelineDiagram } from "./figures/ElsaPipelineDiagram";
import { AirbnbFeatureImportance } from "./figures/AirbnbFeatureImportance";
import { AirbnbModelTable } from "./figures/AirbnbModelTable";
import { CompilerSkillsFrame } from "./figures/CompilerSkillsFrame";
import { AggieArchitecture } from "./figures/AggieArchitecture";

function ProjectPhoto({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className="figure-wide my-10">
      <div className={`mx-auto ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-[6px] border border-line-strong bg-paper-raised p-2.5 shadow-[var(--shadow-print)]"
        />
        {caption && (
          <figcaption className="mt-3 w-full px-2.5 text-left text-sm text-ink-muted">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

// Plain-text extraction + slug for heading anchor ids (no client JS, no deps).
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function Heading({
  as: Tag,
  className,
  children,
}: {
  as: "h2" | "h3";
  className: string;
  children?: ReactNode;
}) {
  const id = slugify(textOf(children));
  return (
    <Tag id={id} className={`group scroll-mt-24 ${className}`}>
      {children}
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="ml-2 align-middle font-sans text-[0.8em] text-ink-faint no-underline opacity-0 transition-opacity duration-[--duration-fast] group-hover:opacity-100 hover:text-accent focus-visible:opacity-100"
      >
        #
      </a>
    </Tag>
  );
}

function Anchor({
  href = "",
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const internal = href.startsWith("/") || href.startsWith("#");
  const className =
    "text-accent underline decoration-1 underline-offset-2 transition-colors duration-[--duration-fast] hover:text-accent-strong";
  if (internal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <Heading
      as="h2"
      className="mt-12 mb-3 font-serif text-[1.65rem] font-medium tracking-tight text-ink-strong"
    >
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading
      as="h3"
      className="mt-8 mb-2 font-serif text-xl font-medium tracking-tight text-ink-strong"
    >
      {children}
    </Heading>
  ),
  p: (props) => <p className="my-4 leading-[1.75]" {...props} />,
  a: Anchor,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-5" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-5" {...props} />,
  li: (props) => <li className="pl-1 leading-[1.7]" {...props} />,
  strong: (props) => (
    <strong className="font-semibold text-ink-strong" {...props} />
  ),
  em: (props) => <em className="italic" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-4 text-ink-muted italic"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-sm bg-paper-sunken px-1.5 py-0.5 font-mono text-[0.9em] text-ink-strong"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-sm bg-paper-sunken p-4 text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-line" />,
  figure: (props) => <figure className="my-8" {...props} />,
  figcaption: (props) => (
    <figcaption className="mt-2 text-sm text-ink-muted" {...props} />
  ),
  // Content figures (see figures/): complex JSX lives in typechecked TSX,
  // not inline MDX, so markdown parsing can never corrupt it.
  NppArchitectureDiagram,
  NppResultsTable,
  ElsaPipelineDiagram,
  ProjectPhoto,
  AirbnbFeatureImportance,
  AirbnbModelTable,
  CompilerSkillsFrame,
  AggieArchitecture,
};
