<script setup>
const { $api } = useNuxtApp();
const { createBooking } = useBookings();

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(["close", "success"]);

const form = reactive({
  media_id: "",
  customer_id: "",
  starts_at: "",
  ends_at: "",
  status: "pending",
});

const errors = ref({});
const loading = ref(false);
const medias = ref([]);
const customers = ref([]);

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "cancelled", label: "Cancelado" },
];

const fetchMedias = async () => {
  try {
    const response = await $api("/media");
    medias.value = response.data.map((m) => ({
      value: m.id,
      label: m.name,
    }));
  } catch (error) {
    console.error("Error al cargar medias:", error);
  }
};

const fetchCustomers = async () => {
  try {
    const response = await $api("/customers");
    customers.value = response.data.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
};

const resetForm = () => {
  form.media_id = "";
  form.customer_id = "";
  form.starts_at = "";
  form.ends_at = "";
  form.status = "pending";
  errors.value = {};
};

const handleClose = () => {
  resetForm();
  emit("close");
};

const handleSubmit = async () => {
  errors.value = {};
  loading.value = true;

  const { success, errors: apiErrors } = await createBooking(form);

  loading.value = false;

  if (success) {
    resetForm();
    emit("success");
    emit("close");
  } else {
    if (typeof apiErrors === "object") {
      errors.value = apiErrors;
    }
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      fetchMedias();
      fetchCustomers();
    }
  }
);
</script>

<template>
  <UiBaseModal :open="open" @close="handleClose">
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-white">Nueva Reservación</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiSelectInput
          v-model="form.media_id"
          label="Media"
          :options="medias"
          :error="errors.media_id?.[0]"
        />

        <UiSelectInput
          v-model="form.customer_id"
          label="Cliente"
          :options="customers"
          :error="errors.customer_id?.[0]"
        />

        <UiDateInput
          v-model="form.starts_at"
          label="Fecha de inicio"
          :error="errors.starts_at?.[0]"
        />

        <UiDateInput
          v-model="form.ends_at"
          label="Fecha de fin"
          :error="errors.ends_at?.[0]"
        />

        <UiSelectInput
          v-model="form.status"
          label="Estado"
          :options="statusOptions"
          :error="errors.status?.[0]"
        />

        <div class="flex gap-3 justify-end pt-2">
          <button
            type="button"
            @click="handleClose"
            :disabled="loading"
            class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
          >
            {{ loading ? "Guardando..." : "Crear Reservación" }}
          </button>
        </div>
      </form>
    </div>
  </UiBaseModal>
</template>
