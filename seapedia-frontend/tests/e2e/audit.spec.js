import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

test('rendered audit: public pages, all roles, desktop and mobile', async ({ page }) => {
  test.setTimeout(360_000)
  const directory = '../tmp/qa/audit-20261031'
  mkdirSync(directory, { recursive: true })
  const results = []
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 500) errors.push(`${response.status()} ${response.url()}`)
  })

  const inspect = async (route, width = 1440, screenshot = false, prepare) => {
    await page.setViewportSize({ width, height: 960 })
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    if (prepare) await prepare()
    await expect(page.locator('h1').first()).toBeVisible()
    // Scroll lazy images into view before checking real image failures.
    for (const image of await page.locator('.product-card img').all()) await image.scrollIntoViewIfNeeded()
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      unnamedButtons: [...document.querySelectorAll('button')].filter((button) => button.getBoundingClientRect().width && !button.textContent.trim() && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')).length,
    }))
    results.push({ route, width, ...metrics, violations: axe.violations.map(({ id, impact, help, helpUrl, nodes }) => ({ id, impact, help, helpUrl, nodes: nodes.map(({ target, failureSummary, html }) => ({ target, failureSummary, html })) })) })
    if (screenshot) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await page.screenshot({ path: `${directory}/${route.replaceAll('/', '-').replaceAll('?', '-') || 'home'}-${width}.png`, fullPage: true })
    }
    writeFileSync(`${directory}/results.json`, JSON.stringify({ results, errors }, null, 2))
  }

  for (const route of ['/', '/products', '/products/1', '/stores/1', '/login', '/register', '/help/keamanan-data']) await inspect(route, 1440, ['/', '/products'].includes(route))
  for (const width of [360, 390, 768]) await inspect('/products', width, true)
  await inspect('/', 390, true)
  for (const [label, routes] of [
    ['Pembeli', ['/buyer/dashboard', '/cart', '/buyer/orders', '/buyer/wallet', '/buyer/addresses', '/settings']],
    ['Penjual', ['/seller/dashboard', '/seller/products', '/seller/store', '/seller/orders']],
    ['Driver', ['/driver/dashboard', '/driver/orders']],
    ['Admin', ['/admin/dashboard', '/admin/users', '/admin/discounts']],
  ]) {
    await page.goto('/login')
    await page.getByRole('button', { name: new RegExp(`^${label}`) }).click()
    await expect(page).not.toHaveURL(/\/login$/)
    for (const route of routes) await inspect(route)
    for (const route of routes) await inspect(route, 390, route.endsWith('/dashboard'))
    if (label === 'Pembeli') await inspect('/settings', 1440, false, () => page.getByRole('button', { name: 'Keamanan Akun', exact: true }).click())
    await page.evaluate(() => localStorage.clear())
  }
  await inspect('/photo-credits.html', 390)
  const summary = results.map((row) => `${row.width} ${row.route}: ${row.violations.length} axe rules, overflow=${row.overflow}, broken=${row.brokenImages.length}`)
  console.log(summary.join('\n'))
  expect(errors).toEqual([])
  expect(results.filter((row) => row.overflow || row.brokenImages.length || row.unnamedButtons)).toEqual([])
  expect(results.flatMap((row) => row.violations.map((violation) => `${row.route} (${row.width}): ${violation.id}`))).toEqual([])
})
