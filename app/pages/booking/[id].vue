<script setup>
const route = useRoute();
const { booking, loading, fetchBooking, updateBookingStatus } = useBookings();

const modal = reactive({
  open: false,
  type: "success",
  title: "",
  message: "",
});

const confirmModal = reactive({
  open: false,
  newStatus: null,
});

const openConfirmModal = (newStatus) => {
  confirmModal.newStatus = newStatus;
  confirmModal.open = true;
};

const closeConfirmModal = () => {
  confirmModal.open = false;
  confirmModal.newStatus = null;
};

const confirmStatusChange = async () => {
  const newStatus = confirmModal.newStatus;
  
  closeConfirmModal();

  const { success } = await updateBookingStatus(
    route.params.id,
    newStatus
  );

  if (success) {
    modal.type = "success";
    modal.title = "Actualizado";
    modal.message = "El estado se actualizó correctamente";
    await fetchBooking(route.params.id);
  } else {
    modal.type = "error";
    modal.title = "Error";
    modal.message = "No se pudo actualizar el estado";
  }

  modal.open = true;
};

const getStatusColor = (status) => {
  const colors = {
    pending: "text-yellow-400",
    confirmed: "text-blue-400",
    cancelled: "text-red-400",
    active: "text-green-400",
    returned: "text-gray-400",
  };
  return colors[status] || colors.pending;
};

const goBack = () => {
  navigateTo("/booking");
};

onMounted(() => {
  fetchBooking(route.params.id);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        @click="goBack"
        class="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white"
      >
        Volver
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Detalle de Reservación</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">Cargando...</p>
    </div>

    <div v-else-if="!booking" class="text-center py-12">
      <p class="text-red-400">No se encontró la reservación</p>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-white rounded-lg border border-gray-300 p-6 space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600 mb-1">ID</p>
            <p class="text-gray-900 font-medium">{{ booking.id }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-600 mb-1">Estado</p>
            <p class="text-lg font-semibold" :class="getStatusColor(booking.status)">
              {{ booking.status }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-600 mb-1">Cliente</p>
            <p class="text-gray-900 font-medium">
              {{ booking.customer?.name || "N/A" }}
            </p>
            <p v-if="booking.customer?.email" class="text-sm text-gray-600">
              {{ booking.customer.email }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-600 mb-1">Media</p>
            <p class="text-gray-900 font-medium">
              {{ booking.media?.name || "N/A" }}
            </p>
            <p v-if="booking.media?.type" class="text-sm text-gray-600">
              {{ booking.media.type }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-600 mb-1">Fecha de inicio</p>
            <p class="text-gray-900 font-medium">{{ booking.starts_at }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-600 mb-1">Fecha de fin</p>
            <p class="text-gray-900 font-medium">{{ booking.ends_at }}</p>
          </div>

          <div v-if="booking.total_price">
            <p class="text-sm text-gray-600 mb-1">Precio total</p>
            <p class="text-gray-900 font-medium">${{ booking.total_price }}</p>
          </div>

          <div v-if="booking.created_at">
            <p class="text-sm text-gray-600 mb-1">Creado</p>
            <p class="text-gray-900 font-medium">{{ booking.created_at }}</p>
          </div>
        </div>

        <div
          v-if="['pending', 'confirmed'].includes(booking.status)"
          class="flex gap-3 pt-4 border-t border-gray-300">
        >
          <button
            v-if="booking.status === 'pending'"
            @click="openConfirmModal('confirmed')"
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
          >
            Confirmar reservación
          </button>

          <button
            @click="openConfirmModal('cancelled')"
            class="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white"
          >
            Cancelar reservación
          </button>
        </div>
      </div>
    </div>

    <UiActionModal
      :open="modal.open"
      :type="modal.type"
      :title="modal.title"
      :message="modal.message"
      @close="modal.open = false"
    />

    <UiBaseModal :open="confirmModal.open" @close="closeConfirmModal">
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Confirmar acción</h3>
        <p class="text-sm text-gray-400">
          ¿Estás seguro de cambiar el estado a "{{ confirmModal.newStatus }}"?
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="closeConfirmModal"
            class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>
          <button
            @click="confirmStatusChange"
            class="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </UiBaseModal>
  </div>
</template>
