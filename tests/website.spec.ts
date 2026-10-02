import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

const routes = readdirSync('src/content/docs', { recursive: true })
  .filter((file) => String(file).endsWith('.mdx'))
  .map((file) => file === 'index.mdx' ? '/' : `/${String(file).replace(/\.mdx$/, '')}/`);

async function noPageOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), page.url()).toBe(true);
}

test('every documentation route has working local links and anchors', async ({ page, request, baseURL }) => {
  const checked = new Set<string>();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.dygo-wordmark').first()).toHaveText('Dygo');
    expect(await page.locator('.dygo-wordmark img, .dygo-wordmark svg').count()).toBe(0);
    await noPageOverflow(page);
    const links = await page.locator('a[href]').evaluateAll((elements) => elements.map((el) => el.getAttribute('href')!));
    for (const href of links) {
      if (href.startsWith('#')) {
        if (href.length > 1) expect(await page.locator(`[id=${JSON.stringify(decodeURIComponent(href.slice(1)))}]`).count(), `${route}${href}`).toBeGreaterThan(0);
      } else if (href.startsWith('/') && !href.startsWith('//') && !checked.has(href)) {
        checked.add(href);
        const target = await request.get(new URL(href, baseURL).href);
        expect(target.status(), `${route} → ${href}`).toBeLessThan(400);
        const hash = new URL(href, baseURL).hash;
        if (hash) expect(await target.text(), `${route} → ${href}`).toContain(`id="${decodeURIComponent(hash.slice(1))}"`);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('every page fits a narrow mobile viewport in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const mode of ['light', 'dark']) {
    await page.addInitScript((theme) => localStorage.setItem('lotus-theme', theme), mode);
    for (const route of routes) {
      await page.goto(route);
      await noPageOverflow(page);
    }
  }
});

test('theme switching persists, keyboard focus is visible, and pages meet WCAG AA checks', async ({ page }) => {
  await page.goto('/start-here/quickstart/');
  for (const theme of ['Dark', 'Light', 'Dark', 'Light']) {
    await page.getByRole('button', { name: `${theme} theme`, exact: true }).first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.toLowerCase());
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.toLowerCase());
  }
  for (const theme of ['light', 'dark']) {
    await page.addInitScript((mode) => localStorage.setItem('lotus-theme', mode), theme);
    for (const route of ['/', '/start-here/quickstart/', '/reference/cli/', '/reference/record-api/']) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), `${theme} ${route}`).toEqual([]);
    }
  }
  await page.goto('/start-here/quickstart/');
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => {
    const el = document.activeElement!;
    return { tag: el.tagName, width: getComputedStyle(el).outlineWidth, style: getComputedStyle(el).outlineStyle };
  });
  expect(focus.tag).toBe('A');
  expect(focus.width).not.toBe('0px');
  expect(focus.style).not.toBe('none');
});

test('search can be opened repeatedly, navigated by keyboard, and dismissed', async ({ page }) => {
  await page.goto('/start-here/quickstart/');
  for (let repeat = 0; repeat < 2; repeat++) {
    await page.getByRole('button', { name: /^Search docs/ }).click();
    await page.locator('[data-search-input]').fill('database');
    await expect(page.locator('[data-search-results] a').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-search-dialog]')).not.toBeVisible();
  }
  await page.keyboard.press('Control+k');
  await expect(page.locator('[data-search-input]')).toBeFocused();
  await page.locator('[data-search-input]').fill('installation');
  await expect(page.locator('[data-search-results] a').first()).toBeVisible();
  const selected = await page.locator('[data-search-input]').getAttribute('aria-activedescendant');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-search-input]')).not.toHaveAttribute('aria-activedescendant', selected!);
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/installation/);
});

test('code and page copy preserve the actual content on repeated use', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/start-here/quickstart/');
  const code = page.locator('.expressive-code').first();
  const expected = await code.locator('code').innerText();
  for (let repeat = 0; repeat < 2; repeat++) {
    await code.getByRole('button', { name: 'Copy to clipboard' }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  }
  await page.getByRole('button', { name: 'Copy page', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('# Quickstart');
});

test('mobile navigation and contents support repeated open, close, and navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/start-here/quickstart/');
  const trigger = page.getByRole('button', { name: 'Open documentation menu', exact: true });
  const menu = page.locator('[data-mobile-sidebar]');
  for (let repeat = 0; repeat < 2; repeat++) {
    await trigger.click();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await trigger.click();
  await menu.getByRole('link', { name: 'Installation', exact: true }).click();
  await expect(page).toHaveURL(/installation/);
  await expect(menu).not.toBeVisible();
  await page.locator('summary').filter({ hasText: 'On this page' }).click();
  const anchor = page.locator('nav[aria-label="On this page"]:visible a').first();
  await anchor.click();
  await expect(page).toHaveURL(/#/);
  await noPageOverflow(page);
});
