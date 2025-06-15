<template>
  <main class="grid gap-4 p-4">
    <MainNav />
    <router-view />
  </main>
</template>
<script setup lang="ts">
import MainNav from "@/components/MainNav.vue";
</script>