import api from './api'

// ============================================================
// ADDRESS SERVICE
// ============================================================

const addressService = {
  /**
   * Ambil semua alamat
   * @returns {Promise<Object>}
   */
  getAll: async () => {
    const response = await api.get('/addresses')
    return response.data
  },
  
  /**
   * Ambil satu alamat
   * @param {number} id - Address ID
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/addresses/${id}`)
    return response.data
  },
  
  /**
   * Tambah alamat baru
   * @param {Object} data - Address data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/addresses', data)
    return response.data
  },
  
  /**
   * Update alamat
   * @param {number} id - Address ID
   * @param {Object} data - Address data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/addresses/${id}`, data)
    return response.data
  },
  
  /**
   * Hapus alamat
   * @param {number} id - Address ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/addresses/${id}`)
    return response.data
  },
}

export default addressService