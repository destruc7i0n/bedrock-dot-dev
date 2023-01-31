import React, { FunctionComponent } from "react";
import { GetStaticProps } from "next";

import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import S3 from "aws-sdk/clients/s3";

import Log from "lib/log";
import { compareBedrockVersions } from "lib/util";
import { getLocale, Locale } from "lib/i18n";
import { getTags, Tags, TagsResponse } from "lib/tags";
import { listReleases } from "lib/github/api";
import { VERSION } from "lib/html/regex";

import Layout from "components/layout";
import Navbar from "components/homepage/navbar";
import Footer from "components/footer";
import PackCard from "components/packs/pack-card";

export type PackVersions = {
  [key: string]: Partial<{ b: boolean; r: boolean; t?: Tags; git: string }>;
};

type PacksPageProps = {
  versions: PackVersions;
  tags: TagsResponse;
};

const PacksPage: FunctionComponent<PacksPageProps> = ({ versions, tags }) => {
  const { t } = useTranslation("common");
  const versionsSorted = Object.keys(versions).sort(compareBedrockVersions);

  return (
    <Layout
      title={`${t("page.packs.website_title")} | bedrock.dev`}
      description={t("page.packs.website_description")}
    >
      <div className="h-screen">
        <Navbar />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-8 mb-10">
          <div className="max-w-screen-lg mx-auto space-y-4">
            <h4 className="text-4xl font-bold text-black dark:text-gray-200">
              {t("page.packs.title")}
            </h4>
            <p className="text-lg text-black dark:text-gray-200">
              <Trans
                i18nKey="page.packs.subtitle"
                t={t}
                components={[
                  <a
                    className="link"
                    href="https://github.com/bedrock-dot-dev/packs"
                    target="_blank"
                  />,
                  <a
                    className="link"
                    href="https://github.com/Mojang/bedrock-samples?ref=bedrock.dev"
                    target="_blank"
                  />,
                ]}
              />
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-normal">
              {versionsSorted.map((v, i) => (
                <PackCard
                  key={`packs-versions-${i}`}
                  versionName={v}
                  versionData={versions[v]}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Footer dark />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale: localeVal }) => {
  const locale = getLocale(localeVal);
  const tags = await getTags(Locale.English); // only english since chinese has not been updated

  const stableTag = tags[Tags.Stable].at(-1)!;
  const betaTag = tags[Tags.Beta].at(-1)!;

  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_BEDROCK,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_BEDROCK,
    region: "us-east-1",
  });

  let versions: PackVersions = {};
  let paths: string[] = [];

  try {
    const objects = await s3
      .listObjectsV2({ Bucket: process.env.AWS_BUCKET_NAME_BEDROCK || "" })
      .promise();
    if (objects.Contents)
      paths = objects.Contents.filter(
        (c) => c.Key && c.Key?.endsWith(".zip")
      ).map((c) => c.Key!);
  } catch (e) {
    Log.error("Could not list items from bucket!");
  }

  for (let path of paths) {
    const [folder, name] = path.split("/");
    if (folder && name) {
      const version = name.replace(".zip", "");
      if (!versions[version]) versions[version] = { b: false, r: false };
      if (folder === "behaviours") versions[version].b = true;
      if (folder === "resources") versions[version].r = true;
    }
  }

  // get the releases from the bedrock-samples repo
  const mojangBedrockSamples = await listReleases("Mojang/bedrock-samples");
  for (const release of mojangBedrockSamples) {
    const version = release.tag_name.match(VERSION)?.[0];
    if (version && !versions[version])
      versions[version] = { git: release.html_url };
  }

  // add the tags to the versions
  if (versions[stableTag]) versions[stableTag].t = Tags.Stable;
  if (versions[betaTag]) versions[betaTag].t = Tags.Beta;

  return {
    props: {
      versions,
      tags,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default PacksPage;
