import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';
import remarkTocDynamic from './src/plugins/remark-toc-dynamic';

// https://astro.build/config
export default defineConfig({
  site: 'https://barish.me',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkTocDynamic],
  },
});
