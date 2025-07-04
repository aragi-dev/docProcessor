<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  label: string;
  name: string;
  error: boolean;
  touched: boolean;
  modelValue: string | number;
  labelClass?: string;
  inputClass?: string;
  inputmode?: any;
  maxlength?: string;
  onBlur?: () => void;
}>();

const inputValue = computed({
  get: () => String(props.modelValue ?? ""),
  set: (val: string) => {
    const cleaned = val.replace(/\D+/g, "");
    emit("update:modelValue", cleaned);
  },
});
</script>

<template>
  <div class="grid">
    <label :for="props.name" :class="['text-gray-400 ml-1 font-semibold', props.labelClass]">
      {{ props.label }}
    </label>
    <div class="relative">
      <input type="text" :id="props.name" :name="props.name" v-model="inputValue" :maxlength="props.maxlength"
        inputmode="numeric" pattern="\d*" @blur="props.onBlur" :class="[
          'py-2 px-4 rounded-2xl text-white shadow-lg border border-white/20 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 transition w-full focus:outline-none',
          props.inputClass,
        ]" />
      <span v-if="props.touched && props.error" class="absolute right-0 top-0 flex h-3 w-3 pointer-events-none">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
      </span>
    </div>
  </div>
</template>
