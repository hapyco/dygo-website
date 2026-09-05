// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://dygo.dev',
	integrations: [
		starlight({
			title: 'dygo',
			description: 'The opinionated Go framework for serious business software.',
			favicon: '/favicon.svg',
			logo: {
				src: './src/assets/dygo-mark.svg',
				alt: 'dygo',
			},
			social: [
				{ icon: 'github', label: 'dygo on GitHub', href: 'https://github.com/hapyco/dygo' },
			],
			customCss: ['./src/styles/global.css'],
			components: { ThemeSelect: './src/components/ThemeToggle.astro' },
			editLink: {
				baseUrl: 'https://github.com/hapyco/dygo-website/edit/main/',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Quickstart', slug: 'start-here/quickstart' },
						{ label: 'Installation', slug: 'start-here/installation' },
						{ label: 'Core concepts', slug: 'start-here/core-concepts' },
					],
				},
				{
					label: 'Build apps',
					items: [
						{ label: 'App model', slug: 'build-apps/app-model' },
						{ label: 'Entities', slug: 'build-apps/entities' },
						{ label: 'Access and permissions', slug: 'build-apps/access' },
						{ label: 'Fixtures', slug: 'build-apps/fixtures' },
						{ label: 'Record Hooks', slug: 'build-apps/hooks' },
					],
				},
				{
					label: 'Run dygo',
					items: [
						{ label: 'Database', slug: 'run/database' },
						{ label: 'Server and Studio', slug: 'run/server-and-studio' },
						{ label: 'Encrypted secrets', slug: 'run/secrets' },
					],
				},
				{
					label: 'Background work',
					items: [
						{ label: 'Jobs and Workers', slug: 'background/jobs-and-workers' },
						{ label: 'Schedules', slug: 'background/schedules' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'CLI', slug: 'reference/cli' },
						{ label: 'Record API', slug: 'reference/record-api' },
						{ label: 'Project structure', slug: 'reference/project-structure' },
						{ label: 'Framework status', slug: 'reference/status' },
					],
				},
				{
					label: 'Principles',
					items: [{ label: 'Doctrine', slug: 'concepts/doctrine' }],
				},
			],
		}),
	],
	vite: { plugins: [tailwindcss()] },
});
