import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";

import { TEXTAREA_MATCH, MARKDOWN_CODE_MATCH } from "./regex";

// use prism to highlightHtml the code blocks
const highlightTextarea = (html: string, file: string) => {
  // highlightHtml JS pages accordingly
  const jsPages = ["Scripting", "UI"];
  const language = jsPages.includes(file) ? "javascript" : "json";

  // replace all textarea with the prism highlightHtml
  return html.replace(TEXTAREA_MATCH, (_, group) => {
    if (!Prism.languages || !Prism.languages[language]) {
      // Fallback if language not loaded
      return `<pre class="language-${language}"><code>${group}</code></pre>`;
    }
    try {
      const hl = Prism.highlight(group, Prism.languages[language], language);
      return `<pre class="language-${language}">${hl}</pre>`;
    } catch (error) {
      // Fallback on highlight error
      console.error(`Prism highlight error for ${language}:`, error);
      return `<pre class="language-${language}"><code>${group}</code></pre>`;
    }
  });
};

const highlightMarkdownCode = (html: string) => {
  return html.replace(MARKDOWN_CODE_MATCH, (_, content) => {
    content = content
      .replace(/<\/br>-+<\/br>/g, "\n") // remove the ----- lines
      .replace(/<\/?br ?\/?>/g, "\n"); // remove br and replace with newlines

    if (!Prism.languages || !Prism.languages.json) {
      // Fallback if language not loaded
      return '<pre class="language-json"><code>' + content + "</code></pre>";
    }
    try {
      const highlighted = Prism.highlight(
        content,
        Prism.languages.json,
        "json",
      );
      return '<pre class="language-json">' + highlighted + "</pre>";
    } catch (error) {
      // Fallback on highlight error
      console.error("Prism highlight error for json:", error);
      return '<pre class="language-json"><code>' + content + "</code></pre>";
    }
  });
};

export const highlightHtml = (html: string, file: string) => {
  switch (file) {
    case "Texture Sets": {
      // has both
      html = highlightMarkdownCode(html);
      html = highlightTextarea(html, file);
      break;
    }
    case "Schemas":
    case "Fogs": {
      html = highlightMarkdownCode(html);
      break;
    }
    default: {
      html = highlightTextarea(html, file);
      break;
    }
  }
  return html;
};
