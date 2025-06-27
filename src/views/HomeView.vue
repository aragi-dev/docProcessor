<template>
  <main class="grid place-items-center gap-4 h-svh">
    <!-- <input type="file" accept=".docx" @change="onFileChange" /> -->
    <Icon name="doc" size="20" css="fill-zinc-500 m-auto mt-auto" />
    <!-- <form @submit.prevent="createPdfs" class="grid gap-4">
      <section class="grid grid-cols-1 md:  grid-cols-2 gap-4">
        <BaseInput label="Division" name="division" v-model="form.division" :error="fieldState.division.error"
          :touched="fieldState.division.touched" @blur="() => markTouched('division')" />
        <BaseInput label="Carrera" name="race" v-model="form.race" :error="fieldState.race.error"
          :touched="fieldState.race.touched" @blur="() => markTouched('race')" />
        <BaseInput label="Asignatura" name="subject" v-model="form.subject" :error="fieldState.subject.error"
          :touched="fieldState.subject.touched" @blur="() => markTouched('subject')" />
        <BaseInput label="Grupo" name="grup" v-model="form.grup" :error="fieldState.grup.error"
          :touched="fieldState.grup.touched" @blur="() => markTouched('grup')" />
        <BaseInput label="Fecha de aplicación" name="date" v-model="form.date" :error="fieldState.date.error"
          :touched="fieldState.date.touched" @blur="() => markTouched('date')" />
        <BaseInput label="Profesor" name="professor" v-model="form.professor" :error="fieldState.professor.error"
          :touched="fieldState.professor.touched" @blur="() => markTouched('professor')" />
      </section>
      <section class="grid grid-flow-col gap-4">
        <button type="button" @click="resetForm" :disabled="!isFormDirty" aria-label="Limpiar formulario"
          class="p-2 rounded-2xl outline outline-zinc-700 bg-zinc-900 transition-all active:scale-90 flex w-full justify-center col-span-2 hover:bg-blue-900 cursor-pointer disabled:bg-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed">
          <Icon name="mop" size="24" css="fill-zinc-500" />
        </button>
        <button type="submit" :disabled="!isFormValid || loading" :class="[
          'text-zinc-900 p-2 rounded-2xl outline outline-zinc-700 bg-zinc-300 transition-all active:scale-95 disabled:bg-zinc-900 disabled:opacity-20 disabled:text-zinc-500 col-span-10 w-full',
          loading
            ? 'cursor-wait animate-pulse'
            : isFormValid
              ? ''
              : 'cursor-not-allowed',
        ]">
          <span v-if="loading" class="grid grid-flow-col text-center items-center gap-2">
            <Icon name="spinner" size="20" css="fill-zinc-500 animate-spin ml-auto" />
            <p class="mr-auto">Generando...</p>
          </span>
          <span v-else>Generar</span>
        </button>
      </section>
    </form> -->
  </main>
  <Notification :show="notification.show" :type="notification.type" :msg="notification.msg"
    @close="notification.show = false" />
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

import Icon from "@/components/Icon.vue";
import BaseInput from "@/components/BaseInput.vue";
import Notification from "@/components/Notification.vue";

import { utcLogo } from "@/assets/imgBase64/utcLogo";
import { utmLogo } from "@/assets/imgBase64/utmLogo";

import { NotificationType } from "@/utils/enums/NotificationType";
import { generaInformation } from "@/utils/pdfMake/generalInformation";
import { contentEvaluation } from "@/utils/pdfMake/contentEvaluation";
import { header } from "@/utils/pdfMake/header";

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

function resetFieldState() {
  for (const key in fieldState) {
    fieldState[key as keyof typeof fieldState].error = false;
    fieldState[key as keyof typeof fieldState].touched = false;
  }
}


const fieldState = reactive({
  division: { error: false, touched: false },
  race: { error: false, touched: false },
  subject: { error: false, touched: false },
  grup: { error: false, touched: false },
  date: { error: false, touched: false },
  professor: { error: false, touched: false },
});

const form = reactive({
  division: "",
  race: "",
  subject: "",
  grup: "",
  date: "",
  professor: "",
});

function validateForm(): boolean {
  let isValid = true;
  for (const key in form) {
    const value = form[key as keyof typeof form];
    const hasError = !value.toString().trim();
    fieldState[key as keyof typeof fieldState].error = hasError;
    isValid = isValid && !hasError;
  }
  return isValid;
}

const isFormValid = computed(() => validateForm());
const isFormDirty = computed(() =>
  Object.values(form).every((v) => v.toString().trim() !== "")
);

function resetForm() {
  for (const key in form) {
    form[key as keyof typeof form] = "";
  }
  resetFieldState();
}

const createPdfs = async () => {
  loading.value = true;
  try {
    const { default: pdfMake } = await import("@/utils/pdfMake/PdfWraper");

    const document: TDocumentDefinitions = {
      content: [header(utcLogo), ...generaInformation(form), contentEvaluation, header(utmLogo)],
    };
    await pdfMake.createPdf(document).open();
  } catch (e) {
    showNotification(NotificationType.ERROR, "Hubo un error al generar los documentos");
  } finally {
    loading.value = false;
  }
};

const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const jsonString = "hola"

  console.log(jsonString);
};

</script>
