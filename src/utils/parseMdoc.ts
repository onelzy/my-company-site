/**
 * parseMdoc.ts — Parse .mdoc files (YAML frontmatter + Markdown body)
 * Used as fallback when Content Layer API is unavailable (e.g. Cloudflare Workers)
 */

import { load as yamlLoad } from 'js-yaml';
import { marked } from 'marked';

export interface ParsedMdoc<T = Record<string, unknown>> {
  data: T;
  body: string;
}

export function parseMdoc(raw: string): ParsedMdoc {
  // .mdoc format: ---\nYAML\n---\nMarkdown body
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid .mdoc format: missing YAML frontmatter');
  }
  const data = yamlLoad(match[1]) as Record<string, unknown>;
  const body = match[2].trim();
  return { data, body };
}

/**
 * Render Markdown to HTML (for detail page body content).
 * opts.headingOffset (default 0): shift all heading levels down by N (clamped at h6).
 * Product pages pass 1 so in-body `##` sections render as `<h3>` (18px) instead of
 * colliding with the page's own 24px `<h2>` section headings.
 */
export function renderMarkdown(md: string, opts: { headingOffset?: number } = {}): string {
  if (!md) return '';
  const offset = opts.headingOffset ?? 0;
  if (offset === 0) {
    return marked.parse(md, { async: false }) as string;
  }
  const renderer = new marked.Renderer();
  const origHeading = renderer.heading.bind(renderer);
  renderer.heading = ({ tokens, depth }) => origHeading({ tokens, depth: Math.min(6, depth + offset) });
  return marked.parse(md, { async: false, renderer }) as string;
}
