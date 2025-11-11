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
