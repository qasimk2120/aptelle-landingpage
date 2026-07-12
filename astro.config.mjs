import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

// Aptelle landing page. Static output, multilingual (en default, fr, de, ar RTL).
export default defineConfig({
  site: "https://aptelle.com",
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "de", "ar"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    icon(),
    sitemap({
      // Keep noindex pages out of the sitemap so it does not contradict the
      // robots meta on /validate and /joined.
      filter: (page) => !/\/(validate|joined)\/?$/.test(page),
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", fr: "fr", de: "de", ar: "ar" },
      },
    }),
    robotsTxt({
      sitemap: "https://aptelle.com/sitemap-index.xml",
      policy: [{ userAgent: "*", allow: "/" }],
      // Content Signals (https://contentsignals.org/): allow search + AI citation, no training.
      transform(content) {
        return `${content}\n# Content Signals - https://contentsignals.org/\nContent-Signal: ai-train=no, search=yes, ai-input=yes\n`;
      },
    }),
  ],
});
