import { useSettings } from "./useSettings.js";
import { getTranslations, LanguageCode, Translations } from "../i18n/translations";

/**
 * Hook for using translations based on language setting
 */
export const useTranslation = (): Translations => {
  const { settings } = useSettings();
  return getTranslations(settings.language as LanguageCode);
};

export { getTranslations };
export type { LanguageCode, Translations };
