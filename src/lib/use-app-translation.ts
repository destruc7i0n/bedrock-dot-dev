import { useTranslation } from "react-i18next";

import { ensureI18n } from "@lib/i18n";

const i18n = ensureI18n();

export const useAppTranslation = () => {
  return useTranslation("common", { i18n });
};
