<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg shadow-black flex items-center gap-2 outline text-zinc-300"
      :class="{
        'outline-green-500': type === NotificationType.SUCCESS,
        'outline-red-500': type === NotificationType.ERROR,
        'outline-yellow-500': type === NotificationType.WARNING,
        'outline-blue-500': type === NotificationType.INFO,
      }"
    >
      <span class="font-semibold">{{ msg }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { NotificationType } from "@/utils/enums/NotificationType";

defineProps<{
  show: boolean;
  type: NotificationType;
  msg: string;
}>();
defineEmits(["close"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
