<template>
  <main class="text-center grid p-4 gap-4">
    <section class="grid gap-4 grid-flow-col w-full">
      <input
        type="text"
        id="search"
        placeholder="Buscar Producto..."
        name="search"
        v-model="searchTerm"
        class="py-2 px-4 border-1 border-zinc-700 text-zinc-400 rounded-md bg-zinc-900 focus:outline-none focus:border-zinc-500 ml-auto"
      />
      <button
        @click="isOpen = true"
        class="mr-auto rounded-md hover:scale-125 transform transition duration-200 ease-in-out"
        aria-label="Agregar producto"
      >
        <Icon name="add" size="34" css="fill-green-500" />
      </button>
    </section>
    <section class="flex flex-wrap justify-center gap-4 w-full">
      <table></table>
    </section>
  </main>
  <Modal :show="isOpen" title="Agregar Usuario" @close="closeModal">
    <form @submit.prevent="create" class="grid gap-4 max-w-96">
      <div class="grid grid-flow-col gap-4">
        <BaseInput
          label="Correo"
          name="gmail"
          v-model="form.gmail"
          :error="fieldState.gmail.error"
          :touched="fieldState.gmail.touched"
          @blur="() => markTouched('gmail')"
        />
        <div class="grid">
          <label for="role" class="text-zinc-400">Role</label>
          <select
            class="bg-zinc-900 text-zinc-400 rounded-2xl h-fit py-2.5 px-2 mt-auto font-bold"
            name="role"
            required
            size="1"
            v-model="form.role"
            :error="fieldState.role.error"
            :touched="fieldState.role.touched"
          >
            <option
              class="mx-auto bg-zinc-900 text-zinc-400"
              selected
              value="user"
            >
              User
            </option>
            <option class="mx-auto bg-zinc-900 text-zinc-400" value="admin">
              Admin
            </option>
          </select>
        </div>
      </div>
      <div class="grid grid-flow-col grid-cols-12 gap-2">
        <button
          type="button"
          @click="resetForm"
          :disabled="!isFormDirty"
          aria-label="Limpiar formulario"
          class="p-2 rounded-2xl outline outline-zinc-700 bg-zinc-900 transition-all active:scale-90 flex w-full justify-center col-span-2 hover:bg-blue-900 cursor-pointer disabled:bg-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Icon name="mop" size="24" css="fill-zinc-500" />
        </button>
        <button
          type="submit"
          :disabled="!isFormValid || loading"
          :class="[
            'text-gray-400 p-2 rounded-2xl outline outline-zinc-700 bg-green-900 transition-all active:scale-95 disabled:bg-zinc-900 disabled:opacity-20 col-span-10 w-full',
            loading
              ? 'cursor-wait animate-pulse'
              : isFormValid
                ? ''
                : 'cursor-not-allowed',
          ]"
        >
          <span
            v-if="loading"
            class="grid grid-flow-col text-center items-center gap-2"
          >
            <Icon
              name="spinner"
              size="20"
              css="fill-zinc-500 animate-spin ml-auto"
            />
            <p class="mr-auto">Guardando...</p>
          </span>
          <span v-else>Confirmar</span>
        </button>
      </div>
    </form>
  </Modal>
  <Notification
    :show="notification.show"
    :type="notification.type"
    :msg="notification.msg"
    @close="notification.show = false"
  />
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue";
import Icon from "@/components/Icon.vue";
import Modal from "@/components/Modal.vue";
import Notification from "@/components/Notification.vue";
import BaseInput from "@/components/BaseInput.vue";
import { NotificationType } from "@/utils/enums/NotificationType";
import { useUserStore } from "@/services/user";
import { Role } from "@/utils/enums/Role";

const userStore = useUserStore();
const searchTerm = ref("");
const isOpen = ref(false);
const loading = ref(false);

const fieldState = reactive({
  gmail: { error: false, touched: false },
  role: { error: false, touched: false },
});

const notification = ref({
  show: false,
  type: NotificationType.SUCCESS as NotificationType,
  msg: "Hola",
});

const form = reactive({
  gmail: "",
  role: Role.USER,
});

function showNotification(type: typeof notification.value.type, msg: string) {
  notification.value = { show: true, type, msg };
  setTimeout(() => (notification.value.show = false), 3000);
}

function markTouched(field: keyof typeof fieldState) {
  fieldState[field].touched = true;
}

function validateForm() {
  fieldState.gmail.error = !form.gmail;
  fieldState.role.error = !form.role;
  return !fieldState.gmail.error && !fieldState.role.error;
}

const isFormValid = computed(() => validateForm());
const isFormDirty = computed(() => form.gmail || form.role);

function resetFieldState() {
  (Object.keys(fieldState) as Array<keyof typeof fieldState>).forEach((k) => {
    fieldState[k].error = false;
    fieldState[k].touched = false;
  });
}

function resetForm() {
  Object.assign(form, {
    gmail: "",
    role: "",
  });
  resetFieldState();
}

const create = async () => {
  (Object.keys(fieldState) as Array<keyof typeof fieldState>).forEach(
    (k) => (fieldState[k].touched = true)
  );
  if (validateForm()) {
    loading.value = true;
    try {
      await userStore.create({
        gmail: form.gmail,
        role: form.role,
      });
      showNotification(
        NotificationType.SUCCESS,
        "Producto guardado correctamente"
      );
      resetForm();
      isOpen.value = false;
    } catch (err) {
      console.error("Error al guardar el producto:", err);
      showNotification(
        NotificationType.ERROR,
        "Hubo un error al guardar el producto"
      );
    } finally {
      loading.value = false;
    }
  } else {
    showNotification(
      NotificationType.WARNING,
      "Completa todos los campos correctamente"
    );
  }
};

onMounted(async () => {
  await userStore.load();
});

const filteredUsers = computed(() => {
  const users = userStore.users;
  if (!searchTerm.value) return users;
  return users.filter((p) =>
    p.gmail.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const closeModal = () => {
  isOpen.value = false;
  resetFieldState();
};
</script>
<style>
/* Disable spinners en inputs type number*/
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
