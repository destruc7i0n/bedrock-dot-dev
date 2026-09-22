import { mkdir, rm, writeFile } from "fs/promises";
import { dirname } from "path";

import { PROCESSED_DOCS_PATH } from "@lib/docs/constants";
import { getProcessedDocPath } from "@lib/docs/paths";
import { processDoc } from "@lib/docs/process";
import { readDocSource } from "@lib/docs/read";
import { Locale } from "@lib/i18n";
import { bedrockVersionsInOrder } from "@lib/versions/helpers";
import { readDocsManifest } from "@lib/versions/list";

const main = async () => {
  const manifest = await readDocsManifest();
  await rm(PROCESSED_DOCS_PATH, { recursive: true, force: true });

  const docs = Object.values(Locale).flatMap((locale) =>
    [...bedrockVersionsInOrder(manifest.versions[locale] ?? {})].flatMap(
      ([major, minor, files]) =>
        files.map((file) => ({ locale, major, minor, file })),
    ),
  );

  for (let i = 0; i < docs.length; i += 4) {
    await Promise.all(
      docs.slice(i, i + 4).map(async ({ locale, ...doc }) => {
        const processed = processDoc(await readDocSource(doc), doc);
        const filePath = getProcessedDocPath(doc, locale);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, JSON.stringify(processed));
      }),
    );
  }

  console.log(`processed ${docs.length} documentation files`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
