import { create } from 'zustand'
import addressService from '../services/addressService'

// ============================================================
// ADDRESS STORE
// ============================================================
// Bertugas menyimpan data alamat pengiriman

const useAddressStore = create((set, get) => ({
  // ======================================================
  // STATE
  // ======================================================
  
  /** @type {Array} Daftar alamat */
  addresses: [],
  
  /** @type {Object|null} Alamat default */
  defaultAddress: null,
  
  /** @type {boolean} Loading state */
  isLoading: false,
  
  /** @type {string|null} Error message */
  error: null,
  
  // ======================================================
  // GETTERS
  // ======================================================
  
  /**
   * Get alamat berdasarkan ID
   * @param {number} id - Address ID
   * @returns {Object|undefined}
   */
  getById: (id) => {
    return get().addresses.find(addr => addr.id === id)
  },
  
  /**
   * Cek apakah ada alamat
   * @returns {boolean}
   */
  hasAddresses: () => get().addresses.length > 0,
  
  // ======================================================
  // ACTIONS
  // ======================================================
  
  /**
   * Ambil semua alamat
   */
  fetchAddresses: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.getAll()
      
      if (response.success) {
        const addresses = response.data
        
        // Cari alamat default
        const defaultAddr = addresses.find(addr => addr.is_default) || null
        
        set({ 
          addresses,
          defaultAddress: defaultAddr 
        })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil alamat' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Tambah alamat baru
   * @param {Object} data - Data alamat
   */
  addAddress: async (data) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.create(data)
      
      if (response.success) {
        // Tambah ke list
        const newAddress = response.data
        const addresses = [...get().addresses, newAddress]
        
        // Update default jika ini alamat pertama atau default
        const defaultAddr = newAddress.is_default 
          ? newAddress 
          : get().defaultAddress
        
        set({ addresses, defaultAddress: defaultAddr })
        
        return response
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal menambah alamat' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Update alamat
   * @param {number} id - Address ID
   * @param {Object} data - Data update
   */
  updateAddress: async (id, data) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.update(id, data)
      
      if (response.success) {
        // Update di list
        const addresses = get().addresses.map(addr =>
          addr.id === id ? response.data : addr
        )
        
        // Update default jika perlu
        let defaultAddr = get().defaultAddress
        if (response.data.is_default) {
          defaultAddr = response.data
          // Update is_default di yang lain
          addresses.map(addr => addr.id !== id ? { ...addr, is_default: false } : addr)
        }
        
        set({ addresses, defaultAddress: defaultAddr })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal update alamat' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Hapus alamat
   * @param {number} id - Address ID
   */
  deleteAddress: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.delete(id)
      
      if (response.success) {
        // Hapus dari list
        const addresses = get().addresses.filter(addr => addr.id !== id)
        
        // Update default jika yang dihapus adalah default
        let defaultAddr = get().defaultAddress
        if (defaultAddr?.id === id) {
          defaultAddr = addresses[0] || null
        }
        
        set({ addresses, defaultAddress: defaultAddr })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal hapus alamat' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Set alamat default
   * @param {number} id - Address ID
   */
  setDefault: async (id) => {
    try {
      await get().updateAddress(id, { is_default: true })
    } catch (err) {
      throw err
    }
  },
}))

export default useAddressStore