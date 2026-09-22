import type { Heading } from "../html/scrape/headings";

export interface SidebarStructureElement {
  title: string;
  id: string;
}

export interface SidebarStructureGroup {
  header: SidebarStructureElement;
  elements: SidebarStructureElement[];
}

export type SidebarStructure = {
  [key: string]: SidebarStructureGroup;
};

export interface DocIdentity {
  major: string;
  minor: string;
  file: string;
}

export interface ProcessedDoc extends DocIdentity {
  html: string;
  headings: Heading[];
  sidebar: SidebarStructure;
  title: {
    title?: string;
    version?: string;
  };
}
