import { isVersionBefore, isVersionSince } from "../util";

export interface DocAlert {
  type: "info" | "success" | "warning" | "error";
  title: string;
  versions?: {
    since: string;
    until?: string;
  };
  message: string;
}

interface DocAlerts {
  [key: string]: DocAlert[];
}

const docAlerts: DocAlerts = {
  scripting: [
    {
      type: "warning",
      title: "Info",
      versions: {
        since: "1.18.30.4",
      },
      message:
        'The Scripting API has been removed as of March 2022 (1.18.30+). Check out the <a href="https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/">GameTest Framework</a> for the current JavaScript API.',
    },
  ],
  ui: [
    {
      type: "warning",
      title: "Info",
      versions: {
        since: "1.18.30.4",
      },
      message:
        'The Scripting API has been removed as of March 2022 (1.18.30+). Check out the <a href="https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/">GameTest Framework</a> for the current JavaScript API.',
    },
  ],
  item: [
    {
      type: "info",
      title: "Info",
      versions: {
        since: "1.16.100.4",
        until: "1.20.0.0",
      },
      message:
        "Items are <strong>experimental</strong> and may change in the future.",
    },
  ],
  blocks: [
    {
      type: "info",
      title: "Info",
      versions: {
        since: "1.16.100.4",
      },
      message:
        "Blocks are <strong>experimental</strong> and may change in the future.",
    },
  ],
  biomes: [
    {
      type: "info",
      title: "Info",
      message:
        "Biomes are <strong>experimental</strong> and may change in the future.",
    },
  ],
};

const getDocAlerts = (doc: string, version: string): DocAlert[] => {
  return (docAlerts[doc.toLowerCase()] ?? []).filter((alert) => {
    if (alert.versions) {
      const { since, until } = alert.versions;
      const isSince = isVersionSince(version, since);
      const isBefore = until && isVersionBefore(version, until);

      if (until) return isSince && isBefore;
      return isSince;
    }
    return true;
  });
};

export { getDocAlerts };
