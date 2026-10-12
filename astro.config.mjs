import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://decentinvesting.tradeinsight.info',
  integrations: [svelte(), mdx(), tailwind()],
  output: 'static',
});
