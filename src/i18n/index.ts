// i18n entry point. Two locales, Spanish default at "/", English at "/en/".
// Dictionaries are typed off `en.ts` (see Dictionary in en.ts) so a missing or
// extra Spanish key fails typecheck instead of shipping silently.
import { en, type Dictionary } from "./en";
import { es } from "./es";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

const DICTIONARIES: Record<Locale, Dictionary> = { en, es };

export function t(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

// Directory-form path for a locale, matching Astro's default trailing-slash
// behaviour with `prefixDefaultLocale: false`.
export function localePath(locale: Locale): string {
  return locale === "es" ? "/" : "/en/";
}

// Absolute URL for a locale's home. `site` is `Astro.site` from the caller —
// this module has no access to the Astro global itself.
export function absUrl(locale: Locale, site: URL): URL {
  return new URL(localePath(locale), site);
}

export const LOCALE_META: Record<
  Locale,
  { htmlLang: string; ogLocale: string; ogImage: string }
> = {
  es: { htmlLang: "es", ogLocale: "es_CO", ogImage: "/og-image-es.jpg" },
  en: { htmlLang: "en", ogLocale: "en_US", ogImage: "/og-image-en.jpg" },
};

export type { Dictionary };
