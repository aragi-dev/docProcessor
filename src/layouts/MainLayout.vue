<template>
  <main>
    <Analytics />
    <SpeedInsights />
    <MainNav />
    <router-view />
  </main>
</template>
<script setup lang="ts">
import MainNav from "@/components/MainNav.vue";
import { SpeedInsights } from "@vercel/speed-insights/vue"
import { Analytics } from '@vercel/analytics/vue';
</script>
