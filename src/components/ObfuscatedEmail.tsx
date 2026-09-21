// Server component. Obfuscates the address two ways (PLAN §2.5):
//   - visible text: HTML numeric character references (raw-HTML injected,
//     so the entities survive into the served markup);
//   - mailto href: the local part is percent-encoded per RFC 6068 (the "@"
//     must stay literal). Entities cannot be used in an href set via JSX:
//     React escapes "&", which turned the link into a relative URL and a 404.
// Browsers decode both transparently; regex scrapers reading the raw HTML
// see neither a plain address in the text nor one in the href. Not
// encryption, a deliberate, cheap deterrent.

function encodeText(str: string): string {
  return Array.from(str)
    .map((ch) => `&#${ch.codePointAt(0)};`)
    .join("");
}

function encodeHref(email: string): string {
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const host = email.slice(at + 1);
  const pct = Array.from(local)
    .map((ch) => `%${ch.codePointAt(0)!.toString(16).padStart(2, "0")}`)
    .join("");
  return `mailto:${pct}@${host}`;
}

export function ObfuscatedEmail({
  email,
  className,
  children,
}: {
  email: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={encodeHref(email)}
      dangerouslySetInnerHTML={
        children ? undefined : { __html: encodeText(email) }
      }
    >
      {children}
    </a>
  );
}
