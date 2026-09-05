# dygo.dev

This repository contains the source, documentation, and written content for the
official Dygo website.

## Contributing

Contributions to the website, documentation, examples, accessibility, and
developer experience are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Except where otherwise noted, this repository is licensed under the Creative
Commons Attribution 4.0 International License. See [LICENSE](LICENSE).

The Dygo framework itself is licensed separately under the O'Saasy License.
This website license does not change the license of the Dygo framework.

## Trademarks

The Dygo name, Dygo logo, and other Dygo marks and brand assets are reserved
and are not licensed under CC BY 4.0. See [TRADEMARKS.md](TRADEMARKS.md).

## Website development

The website uses Astro, Starlight, MDX content collections, and Tailwind CSS 4.

Install dependencies:

```sh
npm install
```

Start the local server in background mode:

```sh
npm run astro -- dev --background
```

Build the static site:

```sh
npm run build
```

## Cloudflare deployment

Use these Workers Builds settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

The `wrangler.jsonc` file deploys the static files in `dist/`. Keep this file
in version control. The site does not require the `@astrojs/cloudflare` server
adapter. Without an explicit config, Wrangler can install that adapter during
automatic setup and cause a version mismatch.

To check deployment packaging without publishing, run the build, then run
`npx wrangler deploy --dry-run`.

## Write documentation

Documentation files live in `src/content/docs/`. Use `.mdx` for new pages. Add
the page to the explicit sidebar in `astro.config.mjs` when it belongs in the
main reading path.

Use the product vocabulary from the framework repository. Describe current
behavior as current. Label unavailable behavior as `planned`, `proposed`, or
`coming soon`.

The landing page imports Astro components from `src/components/`. Shared theme
tokens and Starlight overrides live in `src/styles/global.css`.
