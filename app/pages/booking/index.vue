<script setup>
const { bookings, meta, loading, fetchBookings, updateBookingStatus } = useBookings();

const statusFilter = ref("");
const page = ref(1);

const modal = reactive({
  open: false,
  type: "success",
  title: "",
  message: "",
});

const confirmModal = reactive({
  open: false,
  bookingId: null,
  newStatus: null,
});

const columns = [
  { key: "id", label: "ID" },
  { key: "customer", label: "Cliente" },
  { key: "media", label: "Media" },
  { key: "starts_at", label: "Inicio" },
  { key: "ends_at", label: "Fin" },
  { key: "status", label: "Estado" },
];

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "cancelled", label: "Cancelado" },
];

const loadBookings = () => {
  fetchBookings({
    page: page.value,
    status: statusFilter.value || null,
  });
};

const handlePageChange = (newPage) => {
  page.value = newPage;
  loadBookings();
};

const openConfirmModal = (bookingId, newStatus) => {
  confirmModal.bookingId = bookingId;
  confirmModal.newStatus = newStatus;
  confirmModal.open = true;
};

const closeConfirmModal = () => {
  confirmModal.open = false;
  confirmModal.bookingId = null;
  confirmModal.newStatus = null;
};

const confirmStatusChange = async () => {
  closeConfirmModal();

  const { success } = await updateBookingStatus(
    confirmModal.bookingId,
    confirmModal.newStatus
  );

  if (success) {
    modal.type = "success";
    modal.title = "Actualizado";
    modal.message = "El estado de la reservación se actualizó correctamente";
    loadBookings();
  } else {
    modal.type = "error";
    modal.title = "Error";
    modal.message = "No se pudo actualizar el estado";
  }

  modal.open = true;
};

const getStatusBadge = (status) => {
  const badges = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-400",
    cancelled: "bg-red-500/20 text-red-400",
    active: "bg-green-500/20 text-green-400",
    returned: "bg-gray-500/20 text-gray-400",
  };
  return badges[status] || badges.pending;
};

const viewDetail = (id) => {
  navigateTo(`/booking/${id}`);
};

watch(statusFilter, () => {
  page.value = 1;
  loadBookings();
});

onMounted(() => {
  loadBookings();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Reservaciones</h1>
    </div>

    <div class="flex gap-4">
      <UiSelectInput
        v-model="statusFilter"
        label="Filtrar por estado"
        :options="statusOptions"
        class="w-64"
      />
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">Cargando...</p>
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-12">
      <p class="text-gray-400">No hay reservaciones</p>
    </div>

    <div v-else>
      <UiTableWrapper>
        <UiTableHead :columns="columns" :actions="true" />

        <tbody>
          <UiTableRow v-for="booking in bookings" :key="booking.id">
            <UiTableCell>{{ booking.id }}</UiTableCell>
            <UiTableCell>{{ booking.customer?.name || "N/A" }}</UiTableCell>
            <UiTableCell>{{ booking.media?.name || "N/A" }}</UiTableCell>
            <UiTableCell>{{ booking.starts_at }}</UiTableCell>
            <UiTableCell>{{ booking.ends_at }}</UiTableCell>
            <UiTableCell>
              <span
                class="inline-block px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusBadge(booking.status)"
              >
                {{ booking.status }}
              </span>
            </UiTableCell>
            <UiTableCell align="right">
              <div class="flex items-center justify-end gap-2">
                <button
                  v-if="booking.status === 'pending'"
                  @click="openConfirmModal(booking.id, 'confirmed')"
                  class="px-3 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Confirmar
                </button>

                <button
                  v-if="['pending', 'confirmed'].includes(booking.status)"
                  @click="openConfirmModal(booking.id, 'cancelled')"
                  class="px-3 py-1 text-xs rounded-md bg-red-600 hover:bg-red-500 text-white"
                >
                  Cancelar
                </button>

                <button
                  @click="viewDetail(booking.id)"
                  class="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Ver
                </button>
              </div>
            </UiTableCell>
          </UiTableRow>
        </tbody>
      </UiTableWrapper>

      <UiPagination v-if="meta" :meta="meta" @change="handlePageChange" />
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