"use client";

import { useEffect, useRef } from "react";

type DocsContentProps = {
  htmlId: string;
};

const docsContentClass = "docs-content text-gray-900 dark:text-gray-200";

export default function DocsContent({ htmlId }: DocsContentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const template = document.getElementById(htmlId) as HTMLTemplateElement;
      if (template && template.content) {
        // Clear existing content and append template content
        divRef.current.innerHTML = '';
        divRef.current.appendChild(template.content.cloneNode(true));
      }
    }
  }, [htmlId]);

  return <div ref={divRef} className={docsContentClass} />;
}
