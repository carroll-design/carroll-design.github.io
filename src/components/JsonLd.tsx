// Shared JSON-LD serializer. JSON.stringify alone does not escape "<", so a
// content string containing "</script>" would terminate the inline script
// early (a classic stored-XSS vector if content ever came from outside).
// All content here is owner-authored, but escaping "<" to its unicode form
// costs nothing and makes the invariant structural instead of editorial.

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
