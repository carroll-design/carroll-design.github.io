import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";

/**
 * Compiles an MDX body (from src/lib/content.ts) inside a server component at
 * build time, with our typographic element map. No client-side MDX, no
 * runtime compilation. Wrap in <Prose> at the call site for measure + color.
 */
export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={mdxComponents} />;
}
