<script setup lang="ts">
import Icon from "@/components/Icon.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/services/auth";
import { Role } from "@/utils/enums/Role";

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  router.push({ name: "Login" });
};

</script>
<template>
  <nav class="flex items-center text-center text-white w-full px-6">
    <section>
      <select class="bg-zinc-900 text-zinc-500 outline-none border-none font-bold">
        <option class="mx-auto font-bold bg-zinc-900 text-zinc-500" selected value="es">ES</option>
        <option class="mx-auto font-bold bg-zinc-900 text-zinc-500" value="en">EN</option>
      </select>
    </section>
    <section class="grid grid-flow-col m-auto p-2 rounded-xl shadow-sm shadow-black">
      <router-link v-if="auth.hasRole([Role.ADMIN, Role.USER])" to="/home"
        class="py-2 px-3 rounded-lg transition-transform hover:cursor-pointer hover:scale-125">
        <Icon name="home" size="24" css="fill-zinc-500" />
      </router-link>
      <router-link v-if="auth.hasRole([Role.ADMIN])" to="/user"
        class="py-2 px-3 rounded-lg transition-transform hover:cursor-pointer hover:scale-125">
        <Icon name="user" size="24" css="fill-zinc-500" />
      </router-link>
    </section>
    <section>
      <Icon @click="logout" name="logut" size="24"
        css="fill-zinc-500 transition-color hover:cursor-pointer hover:scale-125 hover:fill-red-400" />
    </section>
  </nav>
</template>
