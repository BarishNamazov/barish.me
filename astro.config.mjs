import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import remarkTocDynamic from "./src/plugins/remark-toc-dynamic";
import tercotta from "./src/styles/shiki-warm-tercotta-light.js";
import { transformerDiff } from "./src/plugins/shiki-transformer-diff.js";
import { transformerFontSize } from "./src/plugins/shiki-transformer-fontsize.js";

// https://astro.build/config
export default defineConfig({
  site: "https://barish.me",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkTocDynamic],
    shikiConfig: {
      wrap: true,
      theme: tercotta,
      transformers: [transformerDiff(), transformerFontSize()],
    },
  },
  redirects: { "/blog/computing": "/lists/computing" },
});
