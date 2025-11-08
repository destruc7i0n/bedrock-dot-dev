import { ReactNode, useMemo } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18next, { createInstance } from "i18next";

type TranslationValue = string | Record<string, unknown>;

type Props = {
  children: ReactNode;
  translations: Record<string, TranslationValue> | string; // Allow string for JSON serialization
  locale?: string;
};

export const I18nProvider = ({
  children,
  translations,
  locale = "en",
}: Props) => {
  // Initialize i18next synchronously for SSR
  const i18n = useMemo(() => {
    if (!translations) {
      console.error("No translations available for i18next initialization");
      return i18next;
    }

    // Parse translations if they were serialized as JSON string
    const parsedTranslations =
      typeof translations === "string"
        ? JSON.parse(translations)
        : translations;

    // Create a new instance for this component tree
    const instance = createInstance();

    instance.use(initReactI18next).init({
      lng: locale,
      fallbackLng: "en",
      defaultNS: "common",
      resources: {
        [locale]: {
          common: parsedTranslations,
        },
      },
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      react: {
        useSuspense: false, // Disable suspense to avoid SSR issues
      },
    });

    return instance;
  }, [translations, locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
