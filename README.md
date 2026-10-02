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

The website uses Astro, the Lotus documentation theme, and MDX content collections.

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
the page to the relevant `docsNav` section in `theme.config.json` when it belongs
in the main reading path.

Use the product vocabulary from the framework repository. Describe current
behavior as current. Label unavailable behavior as `planned`, `proposed`, or
`coming soon`.

The landing page uses Lotus's native splash layout. Site identity, navigation,
appearance, source links, and footer links live in `theme.config.json`.

## Theme and browser verification

The website keeps the Lotus shell and its routing, sidebar, table of contents,
search index, and theme controls. `src/styles/dygo.css` owns the website's color,
spacing, and typography tokens. Component overrides in `src/components/` provide
the text-only wordmark, article heading, and keyboard search behavior. Framework
and Studio branding are outside this repository's scope.

The reading layout was informed by the official Astro, SvelteKit, and Django
documentation sites. The Dygo palette, typography, and landing-page composition
are original. Keep code and tables usable with a keyboard and at narrow widths.

Run the static build and browser checks before a visual or navigation change:

```sh
npm ci
npx playwright install chromium
npm run build
npm run test:browser
```

The checks cover every MDX route, local links and anchors, mobile overflow in
both themes, WCAG AA automated checks on representative pages, repeated search
and menu interactions, theme persistence, and clipboard content. They use the
built output through Astro's preview API. Inspect desktop and phone screenshots
as well; automated checks do not replace visual review.

Set `CHROMIUM_PATH` to use an existing Chromium installation. Set `QA_BASE_URL`
to test a deployed site instead of starting the local preview. If your execution
environment requires an HTTP proxy for Node fetches, build with
`NODE_USE_ENV_PROXY=1` (Node 24+). Lotus fetches its icon collections at build time.
