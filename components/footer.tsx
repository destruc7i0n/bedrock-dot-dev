import React, { FunctionComponent } from "react";

import { useTranslations } from "next-intl";

import cn from "classnames";

import ModeSelect from "./mode-select";
import LanguageSelect from "./language-select";

type Props = {
  darkClassName?: string;
  dark?: boolean;
  outline?: boolean;
  showToggles?: boolean;
};

const Footer: FunctionComponent<Props> = ({
  darkClassName = "bg-dark-gray-950",
  dark = false,
  outline = true,
  showToggles = true,
}) => {
  const t = useTranslations("component.footer");
  const darkClass = "bg-gray-50 dark:" + darkClassName;

  return (
    <div
      className={cn(
        "w-full py-12 px-4 overflow-hidden sm:px-6 lg:px-8",
        { [darkClass]: dark },
        { "border-t border-gray-200 dark:border-dark-gray-800": outline },
      )}
    >
      <div className="max-w-screen-lg mx-auto space-y-3">
        <div className="flex flex-wrap justify-center font-medium">
          <div className="px-2 text-gray-500 dark:text-gray-300">
            {t("credits_prefix")}{" "}
            <a
              className="link"
              href="https://thedestruc7i0n.ca"
              target="_blank"
              rel="noopener"
            >
              destruc7i0n
            </a>
          </div>
          <div className="px-2">
            <a
              href="https://patreon.com/destruc7i0n"
              className="link"
              target="_blank"
              rel="noopener"
            >
              {t("donate")}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center font-medium">
          <div className="px-2">
            <a
              className="link"
              href="https://github.com/destruc7i0n/bedrock-dot-dev"
              target="_blank"
              rel="noopener"
            >
              {t("github")}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center text-gray-500 dark:text-gray-400 font-medium">
          <div className="px-2">
            <p>{t("legal_mojang")}</p>
          </div>
        </div>

        {showToggles && (
          <div className="!mt-9 grid grid-cols-2 gap-2">
            <div className="justify-self-end">
              <LanguageSelect />
            </div>
            <div className="justify-self-start">
              <ModeSelect />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;
