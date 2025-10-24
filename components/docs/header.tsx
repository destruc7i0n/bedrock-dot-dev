import { FunctionComponent, memo, useContext } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Bars3Icon, Bars3CenterLeftIcon } from "@heroicons/react/20/solid";

import DocSearch from "../docsearch";

import { SidebarContext } from "../sidebar/sidebar-context";

const HeaderLink: FunctionComponent<{
  link: string;
  title: string;
}> = ({ link, title }) => (
  <li className="h-full">
    <a
      className="font-medium px-2 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out"
      href={link}
      target="_blank"
      rel="noopener"
    >
      {title}
    </a>
  </li>
);

const Header: FunctionComponent = () => {
  const router = useRouter();

  const { open, setOpen } = useContext(SidebarContext);

  const isDocsPage = router.pathname.startsWith("/docs");

  const IconClass = open ? Bars3CenterLeftIcon : Bars3Icon;

  return (
    <>
      <header className="navbar flex items-center justify-between mx-auto sticky w-full top-0 left-0 h-12 px-4 lg:pr-2 bg-gray-50 dark:bg-dark-gray-975 border-b border-gray-200 dark:border-dark-gray-800 text-gray-900 dark:text-gray-200">
        <div className="flex items-center">
          {isDocsPage && (
            <div className="flex mr-2">
              <button
                onClick={() => setOpen(!open)}
                className="no-double-tap-zoom"
                aria-label="Toggle navbar"
              >
                <IconClass className="w-6 h-6" />
              </button>
            </div>
          )}
          <h1 className="mr-3 text-2xl">
            <Link
              href="/"
              className="font-normal text-black dark:text-white dark:hover:text-white"
            >
              bedrock.dev
            </Link>
          </h1>
          <ul className="hidden md:flex">
            <HeaderLink link="https://wiki.bedrock.dev" title="Wiki" />
          </ul>
        </div>
        <DocSearch slim />
      </header>
    </>
  );
};

export default memo(Header);
