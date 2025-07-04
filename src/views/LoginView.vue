<template>
  <main class="h-svh grid place-items-center gap-4">
    <h1 class="text-4xl text-zinc-300 font-bold mx-auto mt-auto">
      Iniciar Sesión
    </h1>
    <div class="grid mb-auto">
      <form @submit.prevent="login" class="grid gap-4 grid-flow-row">
        <BaseInput label="Correo" name="email" v-model="form.email" :error="fieldState.email.error"
          :touched="fieldState.email.touched" @blur="() => markTouched('email')" />
        <InputCode v-model="form.code" name="code" :disabled="false" />
        <!-- <InputNumber :disable="isFormValid" label="Code" name="code" maxlength="6" v-model="form.code"
          :error="fieldState.code.error" :touched="fieldState.code.touched" @blur="() => markTouched('code')" /> -->
        <button type="submit" :disabled="!isFormValid" :class="[
          'relative px-4 py-2 mt-4 rounded-2xl text-white shadow-lg border border-white/20 backdrop-blur-sm bg-gradient-to-br from-white/30 to-white/5 transition-all duration-300 disabled:opacity-0 hover:from-white/40 hover:to-white/10 focus:outline-none focus:border-white/30',
        ]">
          <samp class="flex gap-2" v-if="loading">
            <Icon name="spinner" size="24" css="z-10 fill-white animate-spin ml-auto" />
            <span class="relative z-10 mr-auto">Procesando</span>
          </samp>
          <span class="relative z-10" v-else>Confirmar</span>
        </button>
      </form>
      <Notification :show="notification.show" :type="notification.type" :msg="notification.msg"
        @close="notification.show = false" />
    </div>
  </main>
</template>
<script lang="ts" setup>
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import Icon from "@/components/Icon.vue";
import BaseInput from "@/components/BaseInput.vue";
import Notification from "@/components/Notification.vue";
import InputNumber from "@/components/InputNumber.vue";
import { NotificationType } from "@/utils/enums/NotificationType";
import { useAuthStore } from "@/services/auth";
import axios from "axios";
import { ErrorMessagesMap } from "@/utils/ErrorMessages";
import InputCode from "@/components/inputCode.vue";

const router = useRouter();
const auth = useAuthStore();

const loading = ref(false);

const notification = ref({
  show: false,
  type: NotificationType.SUCCESS as NotificationType,
  msg: "Hola",
});

function showNotification(type: typeof notification.value.type, msg: string) {
  notification.value = { show: true, type, msg };
  setTimeout(() => (notification.value.show = false), 3000);
}

function markTouched(field: keyof typeof fieldState) {
  fieldState[field].touched = true;
}

const fieldState = reactive({
  email: { error: false, touched: false },
  code: { error: false, touched: false },
});

const form = reactive({
  email: "",
  code: "",
});

function validateForm() {
  const email = form.email.trim();
  const code = form.code.trim();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isCodeValid = /^\d{6}$/.test(code);

  fieldState.email.error = !isEmailValid;
  fieldState.code.error = !isCodeValid;

  return isEmailValid && isCodeValid;
}

const isFormValid = computed(() => validateForm());

const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
);

const login = async () => {
  (Object.keys(fieldState) as Array<keyof typeof fieldState>).forEach(
    (k) => (fieldState[k].touched = true)
  );
  if (validateForm()) {
    loading.value = true;
    try {
      await auth.login({ email: form.email, code: form.code });
      router.push({ name: "Home" });
    } catch (error: unknown) {
      let mensaje = "Conectate a internet";

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status && ErrorMessagesMap[status]) {
          mensaje = ErrorMessagesMap[status].message;
        }
      }

      showNotification(NotificationType.ERROR, mensaje);
    } finally {
      loading.value = false;
    }
  }
};
</script>
