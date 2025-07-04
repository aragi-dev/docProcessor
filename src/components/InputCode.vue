<template>
  <div>
    <label v-if="!props.disabled" class="text-gray-400 ml-1 font-semibold"> {{ props.name }}</label>
    <div class="flex space-x-1 justify-center">
      <input v-for="(_digit, index) in code" :key="index" type="text" inputmode="numeric" maxlength="1"
        :disabled="props.disabled"
        class="rounded-xl text-gray-400 shadow-lg border border-white/20 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 transition  duration-300 focus:outline-none focus:from-white/20 focus:to-white/10 focus:border-white/30 disabled:opacity-0 w-8 h-10 text-center focus:text-white"
        v-model="code[index]" @input="onInput($event, index)" @keydown.backspace="onBackspace($event, index)"
        ref="inputs" />
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'

const code = reactive(Array(6).fill(''))
const inputs = ref([])

const onInput = (event, index) => {
  const value = event.target.value
  if (!/^\d$/.test(value)) {
    code[index] = ''
    return
  }
  if (index < 5) {
    inputs.value[index + 1].focus()
  }
}

const onBackspace = (event, index) => {
  if (code[index] === '') {
    if (index > 0) {
      inputs.value[index - 1].focus()
    }
  }
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "name"
  }
})

onMounted(() => {
  inputs.value[0].focus()
})
</script>
