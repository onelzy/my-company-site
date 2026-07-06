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
 */
export function renderMarkdown(md: string): string {
  if (!md) return '';
  return marked.parse(md, { async: false }) as string;
}
