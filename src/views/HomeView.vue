<template>
  <main class="grid place-items-center gap-4 h-svh">
    <button>
      <input ref="fileInput" type="file" accept=".docx" @change="extract" class="hidden" />
      <Icon name="doc" size="30" css="fill-zinc-500 m-auto mt-auto" @click="triggerInput" />
    </button>
    <form @submit.prevent="createPdfs" class="grid gap-4">
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </form>
  </main>
  <Notification :show="notification.show" :type="notification.type" :msg="notification.msg"
    @close="notification.show = false" />
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

import Icon from "@/components/Icon.vue";
import Notification from "@/components/Notification.vue";
import BaseInput from "@/components/BaseInput.vue";

import { utcLogo } from "@/assets/imgBase64/utcLogo";
import { utmLogo } from "@/assets/imgBase64/utmLogo";

import { generaInformation } from "@/utils/pdfMake/generalInformation";
import { contentEvaluation } from "@/utils/pdfMake/contentEvaluation";
import { NotificationType } from "@/utils/enums/NotificationType";
import { extractInfo } from "@/utils/extractDocxText";
import { header } from "@/utils/pdfMake/header";

const loading = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

const triggerInput = () => {
  fileInput.value?.click();
};


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

const extract = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    const data = await extractInfo(file);
    console.log("Texto extraído:", data);
    await callGroqLLM(data);
  }
};

const systemPrompt = `
1. Primer parcial, proyecto (saber hacer)
2. Primer parcial, investigación (saber)
3. Segundo parcial, proyecto (saber hacer)
4. Segundo parcial, portafolio (saber)
5. Tercer parcial, proyecto (saber hacer)
6. Tercer parcial, portafolio (saber)
7. Ordinario 1, prueba_clave (saber)
8. Ordinario 1, prueba (saber)
9. Ordinario 2, informe (saber)
10. Ordinario 2, estudio_caso (saber hacer)
11. Ordinario 3, portafolio_tareas (saber)
12. Ordinario 3, proyecto (saber hacer)
13. Ordinario global, prueba_clave (saber)
14. Ordinario global, prueba (saber)
15. Ordinario global, proyecto (saber hacer)
16. Extraordinario 1, ensayo_informe (saber)
17. Extraordinario 1, estudio_caso (saber hacer)
18. Extraordinario 2, mapa_conceptual (saber)
19. Extraordinario 2, estudio_caso (saber hacer)`;

const parcialPrompt = `
Eres una inteligencia artificial especializada en diseño instruccional para nivel medio-superior y superior. Tu función es generar planeaciones académicas completas con actividades formativas y sumativas basadas en un texto académico de entrada.

Tu salida debe ser un objeto JSON válido con la siguiente estructura exacta. No generes texto adicional fuera del objeto. No uses comillas triples ni bloques de código.

Estructura esperada ejemplo:
{
  "data": [
    {
      "type": "parcial",
      "number": 1,
      "activity": "1",
      "name": "I.E.1 TRABAJO DE INVESTIGACIÓN (SABER)",
      "content": "Texto largo y detallado con instrucciones claras para el alumno. Incluye Instrucciones, procedimiento, guia procedimental, dicenia, mapa conseptual, requisitos de fondo.
      1. La actividad deberá realizarse en equipos integradores.
      2. La secuencia del trabajo deberá ser la siguiente: 	
        a. Portada Oficial. Deberá incluir el logo de la universidad, en el centro el nombre del informe, el nombre de la carrera, el grado y grupo, en orden alfabético el nombre del alumno que realizaron la investigación, los porcentajes de participación, el nombre del profesor y fecha de entrega.
        b. Hoja de criterio de evaluación (solo esa hoja)
        c. Índice
        d. Introducción (12 líneas)
        e. Desarrollo (antes de iniciar un ejercicio se debe emplear una hoja de guarda con el número y título)
        f. Conclusión (1 cuartilla)
        g. Referencias Bibliográficas: Deberás incluir al menos tres y se presentan en formato APA. Deberán presentarse de manera completa, incluyendo el autor, año de edición, título del libro, País, Editorial. Si fuera de internet deberá incluir todo lo anterior más el recuperado y la liga completa de acceso. No se acepta información encontrada en el rincón del vago, Wikipedia, blogs administrados por personas desconocidas y todas aquellas fuentes que carezcan de formalidad y profesionalidad. Cuidado con copiar y pegar pues equivale a la ANULACIÓN DEL TRABAJO y reporte a la coordinación.
        h. Anexos
      3. El trabajo deberá entregarse en la fecha y hora señalada por el profesor.
      B. Requisitos de forma.
        1. El trabajo deberá en formato digital
        2. Incluir portada oficial con sus nombres en orden alfabético de apellido, porcentajes de participación e incluir nombre de la actividad, carrera, grado y grupo.
        3. El documento deberá paginarse en el ángulo superior derecho.
        4. Usar letra Arial 8 a 12 
        5. El documento deberá estar justificado.
        6. Los márgenes del docto serán de 2.5 cm.
        7. El trabajo deberá estar redactado en tercera persona, cuidando la presentación y ortografía de este."
    },
    {
      "type": "parcial",
      "number": 1,
      "activity": "2",
      "name": "I.E.1 PROYECTO (SABER HACER)",
      "content": "Texto largo y detallado con estructura CANVAS, método NABC y propuesta de innovación. Incluye secciones, numeración, ejemplos y formato de entrega."
    },
    ...
  ]
}

Reglas que debes seguir estrictamente:

- Devuelve exactamente 6 objetos en el arreglo "data", dos por parcial (1 investigación, 1 proyecto).
- Usa solo caracteres compatibles con JSON. No uses caracteres de control, comillas sin escapar, saltos sin comillas dobles o formato inválido.
- Cada objeto debe contener:
  - type: "parcial"
  - number: número de parcial (1, 2, 3)
  - activity: "1" para investigación (saber), "2" para proyecto (saber hacer)
  - name: con prefijo "I.E.{n} ..." y el nombre del documento en mayúsculas
  - content: instrucciones claras, completas, realistas y bien estructuradas. Inicia con "Instrucciones:" y desarrolla contenido extenso similar a un trabajo escolar real.
  - required: lista de entregables o criterios de evaluación

Evita todo lo siguiente:
- No uses comillas triples ni bloques tipo json.
- No generes encabezados, títulos, comentarios, ni notas explicativas fuera del JSON.
- No incluyas saltos de línea sin estar dentro de strings.
- No cierres mal las comillas ni uses caracteres no estándar.

El texto académico que se te dará debe analizarse para generar las actividades correspondientes. Si no hay suficiente contexto, genera actividades completas siguiendo ejemplos previos.

`;

async function callGroqLLM(inputText: string): Promise<any> {
  const response = await fetch(import.meta.env.VITE_API_GROQ, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: import.meta.env.VITE_API_IA
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: parcialPrompt },
        { role: "user", content: `Texto extraído:\n\n${inputText}` }
      ],
      temperature: 0.2,
      max_tokens: 4096
    })
  });

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  console.log("Respuesta del LLM:", content);

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Error al parsear JSON:", e);
    return null;
  }
}
</script>
