<template>
  <main class="grid gap-4 p-4">
    <SpeedInsights />
    <MainNav />
    <router-view />
  </main>
</template>
<script setup lang="ts">
import MainNav from "@/components/MainNav.vue";
import { SpeedInsights } from "@vercel/speed-insights/next"
</script>