import type { ImgHTMLAttributes } from "react";

export function ProjectPhoto({
  src,
  alt,
  caption,
  className = "",
  ...imageProps
}: ImgHTMLAttributes<HTMLImageElement> & {
  caption?: string;
}) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...imageProps}
        className={`h-auto w-full rounded-sm border border-line ${className}`}
      />
      {caption && (
        <figcaption className="mt-3 max-w-[var(--measure)] text-sm text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
