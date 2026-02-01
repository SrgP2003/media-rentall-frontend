export const useBookings = () => {
  const { $api } = useNuxtApp();
  const config = useRuntimeConfig();

  const bookings = ref([]);
  const booking = ref(null);
  const meta = ref(null);

  const loading = ref(false);
  const errors = ref(null);

  // Obtener bookings con paginacion y filtros
  const fetchBookings = async ({
    page = 1,
    status = null,
    media_id = null,
  } = {}) => {
    loading.value = true;
    errors.value = null;

    try {
      const query = {
        page,
        ...(status && { status }),
        ...(media_id && { media_id }),
      };

      const response = await $api("/bookings", {
        params: query,
      });

      bookings.value = response.data;
      meta.value = response.meta;

      return response;
    } catch (error) {
      errors.value =
        error?.data?.message || "No se pudieron obtener las reservaciones";

      return null;
    } finally {
      loading.value = false;
    }
  };

  // Obtener una booking por ID
  const fetchBooking = async (id) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api(`/bookings/${id}`);
      booking.value = response.data;
      return booking.value;
    } catch (error) {
      errors.value =
        error?.data?.message || "No se pudo obtener la reservación";
      booking.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Crear booking
  const createBooking = async (payload) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api("/bookings", {
        method: "POST",
        body: payload,
      });

      return { success: true, data: response };
    } catch (error) {
      errors.value =
        error?.data?.errors ||
        error?.data?.message ||
        "No se pudo crear la reservación";

      return { success: false, errors: errors.value };
    } finally {
      loading.value = false;
    }
  };

  // Actualizar status
  const updateBookingStatus = async (id, status) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api(`/bookings/${id}/status`, {
        method: "PATCH",
        body: { status },
      });

      if (booking.value?.id === id) {
        booking.value.status = status;
      }

      const index = bookings.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        bookings.value[index].status = status;
      }

      return { success: true, data: response };
    } catch (error) {
      errors.value =
        error?.data?.errors ||
        error?.data?.message ||
        "No se pudo actualizar el estado";

      return { success: false, errors: errors.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    bookings,
    booking,
    meta,
    loading,
    errors,
    fetchBookings,
    fetchBooking,
    createBooking,
    updateBookingStatus,
  };
};
