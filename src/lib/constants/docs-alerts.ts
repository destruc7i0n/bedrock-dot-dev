import { isVersionBefore, isVersionSince } from "../util";

export interface DocAlert {
  type: "info" | "success" | "warning" | "error";
  title: string;
  versions?: {
    since?: string;
    until?: string;
  };
  message: string;
}

interface DocAlerts {
  [key: string]: DocAlert[];
}

const scriptingApiRemovedMessage =
  'The Scripting API was removed from Minecraft Bedrock in beta 1.18.20.21 (January 2022) and is not present in stable releases from 1.18.30 (April 2022) onwards. Check out the <a href="https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/">Script API</a> (@minecraft/server) for the current JavaScript API.';

const docAlerts: DocAlerts = {
  scripting: [
    {
      type: "warning",
      title: "Info",
      versions: {
        until: "1.18.20.21",
      },
      message: scriptingApiRemovedMessage,
    },
  ],
  ui: [
    {
      type: "warning",
      title: "Info",
      versions: {
        until: "1.18.20.21",
      },
      message: scriptingApiRemovedMessage,
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
        until: "1.19.40.0",
      },
      message:
        "Blocks are <strong>experimental</strong> and may change in the future.",
    },
  ],
  biomes: [
    {
      type: "info",
      title: "Info",
      versions: {
        until: "1.21.110.0",
      },
      message:
        "Biomes are <strong>experimental</strong> and may change in the future.",
    },
  ],
  features: [
    {
      type: "info",
      title: "Info",
      versions: {
        until: "1.20.20.22",
      },
      message:
        "Custom features and feature rules are <strong>experimental</strong> and may change in the future. They were released out of experiments in 1.20.30 (preview 1.20.20.22).",
    },
  ],
  volumes: [
    {
      type: "warning",
      title: "Info",
      versions: {
        until: "1.21.130.24",
      },
      message:
        'Volumes were deprecated and removed in Minecraft 1.21.20 (preview 1.21.10.22) and never left the <strong>Upcoming Creator Features</strong> experiment. This page stopped being updated after 1.21.10.21. Use the /fog command for fog regions, or the <a href="https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/">Script API</a> for entity enter and leave logic.',
    },
  ],
};

const getDocAlerts = (doc: string, version: string): DocAlert[] => {
  return (docAlerts[doc.toLowerCase()] ?? []).filter((alert) => {
    if (alert.versions) {
      const { since, until } = alert.versions;
      const isSince = !since || isVersionSince(version, since);
      const isBefore = !until || isVersionBefore(version, until);
      return isSince && isBefore;
    }
    return true;
  });
};

export { getDocAlerts };
