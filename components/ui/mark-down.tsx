"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";

export function Markdown({ content }: { content: string }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
}
