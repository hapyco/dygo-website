import { defineCollection } from 'astro:content';
import { docsLoader, docsSchema } from '@prosefly/astro-theme-lotus/content';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
