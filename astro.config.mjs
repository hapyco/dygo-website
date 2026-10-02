// @ts-check
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import lotus from '@prosefly/astro-theme-lotus';
import { focusableCode, focusableTables } from './src/plugins/keyboard-content.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://dygo.dev',
	markdown: { processor: unified({ rehypePlugins: [focusableTables] }) },
	integrations: [lotus({ markdown: { expressiveCode: { plugins: [focusableCode] } } })],
});
