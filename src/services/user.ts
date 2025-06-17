import { defineStore } from "pinia";
import api from "./api";

interface User {
  gmail: string;
  role: string;
}

interface UserState {
  users: User[];
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    users: [] as User[],
  }),

  actions: {
    async load() {
      try {
        const { data } = await api.get("/user");
        this.users = data.data;
      } catch (error) {
        console.error("Error al consultar usuarios:", error);
        throw error;
      }
    },
    async create(user: User) {
      try {
        const { data } = await api.post("/user", user);
        this.users.push(data.data);
      } catch (error) {
        console.error("Error al agregar usuario:", error);
        throw error;
      }
    },
  },
});
