import { FunctionComponent } from "react";
import { GetStaticProps } from "next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getLocale } from "../lib/i18n";

import Layout from "components/layout";
import Navbar from "components/homepage/navbar";
import Footer from "components/footer";

const Custom404Page: FunctionComponent = () => {
  return (
    <Layout title={`404 | bedrock.dev`} description={""}>
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-8 mb-10 text-center">
          <h4 className="text-6xl font-bold text-black dark:text-gray-200">
            404
          </h4>
        </div>

        <Footer />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale: localeVal }) => {
  const locale = getLocale(localeVal);

  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
};

export default Custom404Page;
