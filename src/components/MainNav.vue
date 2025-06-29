x
<script setup lang="ts">
import Icon from "@/components/Icon.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/services/auth";

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  router.push({ name: "Login" });
};

</script>
<template>
  <nav class="fixed top-0 left-0 right-0 z-50 grid-flow-col items-center p-4 grid">
    <Icon @click="logout" name="logout" size="24"
      css="fill-zinc-500 transition hover:cursor-pointer hover:scale-125 hover:fill-red-400 rotate-180 mr-auto" />
    <Icon name="config" size="24"
      css="fill-zinc-500 transition hover:cursor-pointer hover:scale-125 hover:fill-violet-500 active:opacity-40 active:rotate-90 ml-auto" />
  </nav>
</template>
