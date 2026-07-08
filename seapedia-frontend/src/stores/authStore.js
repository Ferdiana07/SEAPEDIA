import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================
// AUTH STORE
// ============================================================
// Bertugas menyimpan data autentikasi user
// - User yang login
// - Token autentikasi
// - Role yang aktif
// - Fungsi login, logout, dll

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ======================================================
      // STATE (Data yang disimpan)
      // ======================================================
      
      /** @type {Object|null} User yang sedang login */
      user: null,
      
      /** @type {string|null} Token autentikasi */
      token: null,
      
      /** @type {string|null} Role yang sedang aktif */
      activeRole: null,
      
      /** @type {boolean} Apakah sedang loading */
      isLoading: false,
      
      // ======================================================
      // GETTERS (Fungsi untuk ambil data)
      // ======================================================
      
      /**
       * Cek apakah user sudah login
       * @returns {boolean}
       */
      isAuthenticated: () => !!get().token,
      
      /**
       * Cek apakah user punya role tertentu
       * @param {string} role - Role yang dicek
       * @returns {boolean}
       */
      hasRole: (role) => {
        const { user } = get()
        if (!user || !user.roles) return false
        return user.roles.some(r => r.role === role)
      },
      
      /**
       * Cek apakah role tertentu sedang aktif
       * @param {string} role - Role yang dicek
       * @returns {boolean}
       */
      isRoleActive: (role) => get().activeRole === role,
      
      // ======================================================
      // ACTIONS (Fungsi untuk mengubah state)
      // ======================================================
      
      /**
       * Set data user setelah login
       * @param {Object} userData - Data user dari API
       * @param {string} token - Token autentikasi
       */
      setAuth: (userData, authToken) => {
        set({
          user: userData,
          token: authToken,
          activeRole: userData.active_role,
          isLoading: false,
        })
      },
      
      /**
       * Update data user
       * @param {Object} userData - Data user baru
       */
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }))
      },
      
      /**
       * Set role yang aktif
       * @param {string} role - Role yang akan diaktifkan
       */
      setActiveRole: (role) => {
        set({ activeRole: role })
      },
      
      /**
       * Set loading state
       * @param {boolean} loading - Status loading
       */
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      /**
       * Logout - hapus semua data auth
       */
      logout: () => {
        set({
          user: null,
          token: null,
          activeRole: null,
          isLoading: false,
        })
      },
    }),
    {
      // Konfigurasi persist (simpan ke localStorage)
      name: 'seapedia-auth', // Nama key di localStorage
      partialize: (state) => ({
        // Hanya simpan field ini ke localStorage
        user: state.user,
        token: state.token,
        activeRole: state.activeRole,
      }),
    }
  )
)

export default useAuthStore