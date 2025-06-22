<template>
  <main class="grid">
    <div class="m-auto grid grid-flow-col gap-4 p-4" @click="generatePDF">
      <Icon name="doc" css="fill-zinc-500" size="50" />
      <p class="text-md text-zinc-400">a</p>
      <Icon name="doc" css="fill-zinc-500" size="30" />
    </div>
  </main>
</template>
<script setup lang="ts">
import Icon from "@/components/Icon.vue";

import { document } from "@/utils/pdfMake/document";
import pdfMake from "@/utils/pdfMake/PdfWraper";

const generatePDF = () => {
  pdfMake.createPdf(document).open();
};
</script>
