// get the regex for the title
import type { SidebarStructure } from "@components/sidebar";

import { oneLine } from "@lib/util";

import { H_TITLE_MATCH, P_ID_MATCH } from "../regex";

const addAnchors = (html: string) => {
  return html.replace(H_TITLE_MATCH, (value, headerNumber) => {
    const [, id, title] = value.match(P_ID_MATCH)!;
    const encoded = encodeURIComponent(id);

    return oneLine(`
      <h${headerNumber} class="anchored-heading">
        <a aria-hidden="true" tabindex="-1" class="anchor" id="${id}"></a>
        ${title}
        <a href="#${encoded}" tabindex="-1" class="hash-link" aria-label="Anchor" aria-hidden="true" data-astro-reload>#</a>
      </h${headerNumber}>
    `);
  });
};

const getSection = (html: string, title: string) => {
  // match the title and everything up to the next title or eof
  // eslint-disable-next-line no-useless-escape
  const sectionRe = `<h1><p id="${title}">${title}<\/p><\/h1>([^]*?)(<h1>|$)`;
  const matchSection = new RegExp(sectionRe);

  const match = html.match(matchSection);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const getFromTitle = (section: string) => {
  const events: string[] = [];

  let match;
  while ((match = H_TITLE_MATCH.exec(section))) {
    if (match && match[2] && match[2].startsWith("minecraft:"))
      events.push(match[2]);
  }
  return events;
};

const getSections = (html: string, sections: string[]) => {
  const resp: SidebarStructure = {};

  for (const section of sections) {
    const sectionContent = getSection(html, section);
    if (sectionContent) {
      const content = getFromTitle(sectionContent);
      // make into the format for the sidebar
      resp[section] = {
        header: { title: section, id: section },
        elements: content.map((c) => ({ title: c, id: c })),
      };
    }
  }

  return resp;
};

export { getSections, addAnchors };
