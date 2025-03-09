import React from "react";
import Link from "next/link";

import { useTranslations } from "next-intl";

const HomepageNavbar = () => {
  const t = useTranslations("component.header");

  return (
    <div className="py-6">
      <nav className="mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 max-w-screen-lg lg:p-0">
        <Link href="/" className="flex items-center">
          <div className="font-normal text-gray-900 dark:text-white leading-tight text-2xl tracking-tight">
            bedrock.dev
          </div>
        </Link>
        <div className="flex items-center">
          <a
            className="ml-6 lg:ml-10 font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out"
            href="https://wiki.bedrock.dev"
            target="_blank"
            rel="noopener"
          >
            {t("wiki_link")}
          </a>
          <Link
            href="/packs"
            className="ml-6 lg:ml-10 font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out"
          >
            {t("packs_link")}
          </Link>
          <a
            className="ml-6 lg:ml-10 font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out"
            href="https://discord.gg/wAtvNQN"
            target="_blank"
            rel="noopener"
          >
            {t("discord_link")}
          </a>
        </div>
      </nav>
    </div>
  );
};

export default HomepageNavbar;
