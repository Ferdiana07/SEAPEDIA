import { expect, test } from '@playwright/test'

const demoAccounts = [
  { label: 'Pembeli', destination: /\/buyer\/dashboard$/, heading: /Halo,/i, file: 'buyer-dashboard', pages: [['/cart', /Keranjang (Belanja|Kosong)/i], ['/buyer/orders', /Pesanan Saya/i], ['/buyer/wallet', /Dompet Digital/i], ['/buyer/addresses', /Alamat Pengiriman/i], ['/settings', /Pengaturan Akun/i]] },
  { label: 'Penjual', destination: /\/seller\/dashboard$/, heading: /Kelola tokomu,/i, file: 'seller-dashboard', pages: [['/seller/products', /Kelola Produk/i], ['/seller/store', /Pengaturan Toko/i], ['/seller/orders', /Pesanan Masuk/i]] },
  { label: 'Driver', destination: /\/driver\/dashboard$/, heading: /Siap mengantar,/i, file: 'driver-dashboard', pages: [['/driver/orders', /Pesanan Driver/i]] },
  { label: 'Admin', destination: /\/admin\/dashboard$/, heading: /Selamat datang,/i, file: 'admin-dashboard', pages: [['/admin/users', /Kelola Pengguna/i], ['/admin/discounts', /Voucher dan Promo/i]] },
  { label: 'Multi-role', destination: /\/select-role$/, heading: /Pilih peran untuk sesi ini/i, file: 'role-selection' },
]

test('public marketplace renders without overflow or broken visible images', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Marketplace Bahari Indonesia/i })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible()
  await expect(page.getByText('Nadia Puspita')).toBeVisible()

  const homeProductImages = page.locator('a[href^="/products/"] img')
  for (let index = 0; index < await homeProductImages.count(); index += 1) {
    const image = homeProductImages.nth(index)
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true)
  }

  if (process.env.QA_CAPTURE) {
    await page.screenshot({ path: '../tmp/qa/home-desktop.png', fullPage: true })
  }

  const brokenImages = await page.locator('img:visible').evaluateAll((images) =>
    images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.alt),
  )
  expect(brokenImages).toEqual([])

  await page.goto('/products')
  await expect(page.getByRole('heading', { name: /Semua Kebutuhan Laut/i })).toBeVisible()
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible()
})

test('beranda tetap rapi dan dapat dinavigasi pada layar mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Marketplace Bahari Indonesia/i })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible()
  await expect(page.getByText('Nadia Puspita')).toBeVisible()

  if (process.env.QA_CAPTURE) {
    await page.screenshot({ path: '../tmp/qa/home-mobile.png', fullPage: true })
  }

  await page.getByRole('button', { name: /Buka menu/i }).click()
  await expect(page.locator('header').getByRole('link', { name: /Jelajahi produk/i })).toBeVisible()
})

for (const account of demoAccounts) {
  test(`akun demo ${account.label} menuju alur yang benar`, async ({ page }) => {
    const runtimeErrors = []
    const serverErrors = []
    page.on('pageerror', (error) => runtimeErrors.push(error.message))
    page.on('response', (response) => {
      if (response.status() >= 500) serverErrors.push(`${response.status()} ${response.url()}`)
    })

    await page.goto('/login')
    await page.getByRole('button', { name: new RegExp(`^${account.label}`) }).click()
    await expect(page).toHaveURL(account.destination)
    await expect(page.getByRole('heading', { name: account.heading })).toBeVisible()
    for (const [path, heading] of account.pages || []) {
      await page.goto(path)
      await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible()
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    }
    expect(runtimeErrors).toEqual([])
    expect(serverErrors).toEqual([])
    if (process.env.QA_CAPTURE) {
      await page.screenshot({ path: `../tmp/qa/${account.file}.png`, fullPage: true })
    }
  })
}

test('login salah menampilkan feedback tanpa reload berulang', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('ani@seapedia.com')
  await page.getByLabel('Password').fill('password-salah')
  await page.getByRole('button', { name: /^Masuk$/ }).click()
  await expect(page.getByText(/Email atau password salah/i)).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})

test('buyer melihat ringkasan konfirmasi sebelum checkout diproses', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: /^Pembeli/ }).click()
  await expect(page).toHaveURL(/\/buyer\/dashboard$/)

  const token = await page.evaluate(() => JSON.parse(localStorage.getItem('seapedia-auth') || '{}').state?.token)
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  const productsResponse = await page.request.get('http://127.0.0.1:18000/api/products?per_page=1')
  const productId = (await productsResponse.json()).data[0].id
  await page.request.delete('http://127.0.0.1:18000/api/cart', { headers })
  const addResponse = await page.request.post('http://127.0.0.1:18000/api/cart/items', {
    headers,
    data: { product_id: productId, quantity: 1 },
  })
  expect(addResponse.ok()).toBe(true)

  await page.goto('/cart')
  const payButton = page.getByRole('button', { name: /^Bayar / })
  await expect(payButton).toBeEnabled()
  await payButton.click()

  const dialog = page.getByRole('dialog', { name: 'Konfirmasi pembayaran' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Total bayar')).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Bayar sekarang' })).toBeVisible()
  if (process.env.QA_CAPTURE) {
    await page.screenshot({ path: '../tmp/qa/checkout-confirmation.png', fullPage: true })
  }
  await dialog.getByRole('button', { name: 'Periksa lagi' }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/cart$/)
  await page.request.delete('http://127.0.0.1:18000/api/cart', { headers })
})

test('seller dapat memilih foto produk dan memeriksa preview sebelum submit', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: /^Penjual/ }).click()
  await expect(page).toHaveURL(/\/seller\/dashboard$/)

  await page.goto('/seller/products')
  await page.getByRole('button', { name: 'Tambah Produk' }).first().click()

  const formDialog = page.getByRole('dialog', { name: 'Tambah Produk Baru' })
  await formDialog.getByLabel('Nama Produk').fill('Produk Foto E2E')
  await formDialog.getByLabel('Harga (Rp)').fill('125000')
  await formDialog.getByLabel('Stok').fill('2')
  await formDialog.getByLabel('Foto produk').setInputFiles({
    name: 'foto-produk.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64'),
  })
  await expect(formDialog.getByText('foto-produk.png')).toBeVisible()
  await formDialog.getByRole('button', { name: 'Simpan' }).click()

  const confirmation = page.getByRole('dialog', { name: 'Publikasikan produk?' })
  await expect(confirmation.getByText('foto-produk.png')).toBeVisible()
  await confirmation.getByRole('button', { name: 'Periksa lagi' }).click()
  await expect(page.getByRole('dialog', { name: 'Tambah Produk Baru' })).toBeVisible()
})
