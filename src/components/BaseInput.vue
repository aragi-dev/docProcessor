<template>
  <div class="grid">
    <label :for="props.name" :class="['text-gray-400 ml-1 font-semibold', props.labelClass]">
      {{ props.label }}
    </label>
    <div class="relative">
      <input :type="props.type" :name="props.name" :id="props.name"
        :value="props.type === 'number' && typeof props.modelValue === 'number' ? String(props.modelValue) : props.modelValue"
        @input="onInput" @blur="props.onBlur"
        :class="['py-2 px-4 rounded-2xl text-white shadow-lg border border-white/20 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 transition w-full duration-300 focus:outline-none', props.inputClass]" />
      <span v-if="props.touched && props.error" class="absolute right-0 top-0 flex h-3 w-3 pointer-events-none">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
  label: string
  name: string
  type?: string
  modelValue: any
  error: boolean
  touched: boolean
  labelClass?: string
  inputClass?: string
  onBlur?: () => void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  let value: string | number = target ? target.value : '';
  if (!props.type || props.type === 'text') {
    value = typeof value === 'string' ? value.trim() : value;
  }
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value);
    emit('update:modelValue', value);
    return;
  }
  emit('update:modelValue', value);
}
</script>
