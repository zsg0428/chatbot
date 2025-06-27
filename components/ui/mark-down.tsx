"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";

export function Markdown({ content }: { content: string }) {
  // Convert markdown to HTML
  const rawHtml = marked(content);

  // Sanitize the HTML to prevent XSS
  // @ts-ignore
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  );
}
