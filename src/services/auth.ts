import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Role } from '@/utils/enums/Role'

interface User {
  id: string
  role: Role
}

interface AuthState { 
  token: string | null
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  }),

  actions: {
    async login(code: string) {
      const response = await api.post('/login', { code })
      const { token, user } = response.data.data

      this.token = token
      this.user = user

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role,

    hasRole: (state) => (roles: Role | Role[]) => {
      if (!state.user) return false;
      if (Array.isArray(roles)) {
        return roles.includes(state.user.role)
      }
      return state.user.role === roles
    }
  }
})
