import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import remarkTocDynamic from "./src/plugins/remark-toc-dynamic";
import tercotta from "./src/styles/shiki-warm-tercotta-light.js";

// https://astro.build/config
export default defineConfig({
  site: "https://barish.me",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkTocDynamic],
    shikiConfig: {
      wrap: true,
      theme: tercotta,
    },
  },
  redirects: { "/blog/computing": "/lists/computing" },
});
