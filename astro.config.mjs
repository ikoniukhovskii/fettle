// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.fettlelondon.com',
  trailingSlash: 'never',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/membership/welcome') && !page.includes('/insights') && !page.includes('/review') && !page.includes('/send-review') })]
});
