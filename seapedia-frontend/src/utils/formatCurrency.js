// ============================================================
// FORMAT CURRENCY
// ============================================================

/**
 * Format angka menjadi mata uang Indonesia
 * @param {number} amount - Jumlah uang
 * @param {string} [currency='IDR'] - Mata uang
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format angka menjadi format Indonesia
 * @param {number} number - Angka
 * @returns {string}
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}

/**
 * Parse string currency menjadi number
 * @param {string} currencyString - String mata uang
 * @returns {number}
 */
export const parseCurrency = (currencyString) => {
  // Hapus karakter non-angka
  const cleaned = currencyString.replace(/[^0-9,-]/g, '')
  // Konversi ke number
  return parseFloat(cleaned.replace(',', '.'))
}