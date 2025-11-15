export enum Tag {
  Stable = "stable",
  Beta = "beta",
}

export const TagValues: string[] = Object.keys(Tag).map(
  (k) => Tag[k as keyof typeof Tag],
);

export type TagsResponse = {
  [tag in Tag]: string[];
};
