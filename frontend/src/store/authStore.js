import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,
      setAuth: (user, token, profile) => set({ user, token, profile }),
      logout: () => set({ user: null, token: null, profile: null }),
    }),
    { name: 'codencampus-auth' }
  )
)

export default useAuthStore
