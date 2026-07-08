// ============================================================
// VALIDATION UTILITIES
// ============================================================

/**
 * Validasi email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validasi password minimal 8 karakter
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password.length >= 8
}

/**
 * Validasi nomor telepon Indonesia
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  // Contoh: 081234567890, +6281234567890
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Generate error message untuk form validation
 * @param {string} field - Nama field
 * @param {string} rule - Aturan validasi
 * @returns {string}
 */
export const getValidationMessage = (field, rule) => {
  const messages = {
    required: `${field} wajib diisi`,
    email: `${field} harus berupa email yang valid`,
    min: `${field} minimal 8 karakter`,
    same: `${field} harus sama dengan password`,
    phone: `${field} harus berupa nomor telepon yang valid`,
  }
  
  return messages[rule] || `${field} tidak valid`
}