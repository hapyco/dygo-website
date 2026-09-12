// @ts-check
import { defineConfig } from 'astro/config';
import lotus from '@prosefly/astro-theme-lotus';

// https://astro.build/config
export default defineConfig({
	site: 'https://dygo.dev',
	integrations: [lotus()],
});
