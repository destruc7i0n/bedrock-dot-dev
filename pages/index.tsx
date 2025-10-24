import { FunctionComponent } from "react";
import { GetStaticProps } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "components/layout";
import Navbar from "components/homepage/navbar";
import Footer from "components/footer";
import VersionChooser from "components/version-chooser/version-chooser";
import DocSearch from "components/docsearch";

import { getTags, TagsResponse } from "lib/tags";
import { allFilesList } from "lib/versions";
import {
  transformInbound,
  TransformedOutbound,
  transformOutbound,
} from "lib/bedrock-versions-transformer";
import { getLocale } from "../lib/i18n";

type Props = {
  bedrockVersions: TransformedOutbound;
  tags: TagsResponse;
};

// const Donate = () => (
//   <form className='inline-block' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
//     <input type='hidden' name='cmd' value='_donations' />
//     <input type='hidden' name='business' value='9NZ66ET9MLMTN' />
//     <input type='hidden' name='currency_code' value='USD' />
//     <button
//       className='link'
//       type='submit'
//     >
//       Donate
//     </button>
//     <img alt='' style={{ border: 'none' }} src='https://www.paypal.com/en_CA/i/scr/pixel.gif' width='1' height='1' />
//   </form>
// )

const IndexPage: FunctionComponent<Props> = ({ bedrockVersions, tags }) => {
  const { t } = useTranslation("common");
  // transform to string representation
  const versions = transformInbound(bedrockVersions);

  return (
    <Layout
      title="bedrock.dev"
      description={t("page.home.website_description")}
    >
      <div className="bg-gray-50 dark:bg-dark-gray-950 border-b border-gray-200 dark:border-dark-gray-800">
        <Navbar />

        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 py-10 flex flex-wrap text-center">
          <h1 className="font-extrabold text-4xl md:text-5xl leading-10 text-gray-900 dark:text-white w-full">
            bedrock.dev
          </h1>
          <h2 className="mt-4 mb-6 sm:mt-5 font-medium text-xl md:text-2xl text-center leading-tight text-gray-900 dark:text-gray-200 w-full">
            {t("page.home.subtitle")}
          </h2>

          <DocSearch
            placeHolder={t("page.home.search_placeholder")}
            fullWidth
          />
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-10">
        <div className="w-full bg-white dark:bg-dark-gray-950 text-black dark:text-gray-200 rounded-lg outline-none appearance-none transition duration-150 ease-in-out">
          <div className="flex flex-wrap xl:items-center text-xl font-normal p-3">
            <h2 className="w-full pb-3 text-xl font-bold">
              {t("component.version_chooser.title")}
            </h2>
            <VersionChooser versions={versions} tags={tags} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Footer outline={false} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale: localeVal }) => {
  // transform to "compressed" version
  const locale = getLocale(localeVal);
  const bedrockVersions = transformOutbound(await allFilesList(locale));
  const tags = await getTags(locale);

  return {
    props: {
      bedrockVersions,
      tags,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default IndexPage;
