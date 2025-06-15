import type { Role } from '@/utils/enums/Role';
import { defineStore } from 'pinia';

interface User {
  id: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),
  actions: {
    setAuth(token: string, user: User) {
      this.token = token;
      this.user = user;
    },
    logout() {
      this.token = null;
      this.user = null;
    },
  },
});
