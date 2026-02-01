export const useMedia = () => {
  const { $api } = useNuxtApp();

  // Estados
  const media = ref([]);
  const currentMedia = ref(null);

  const loading = ref(false);
  const errors = ref(null);

  // Paginación
  const pagination = reactive({
    page: 1,
    perPage: 10,
    lastPage: 1,
    total: 0,
  });

  // Filtros
  const filters = reactive({
    type: "",
    status: "",
    search: "",
  });

  // Obtener lista de medios con paginación y filtros
  const fetchMedia = async (page = 1) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api("/media", {
        params: {
          page,
          ...filters,
        },
      });

      media.value = response.data;

      pagination.page = response.meta.current_page;
      pagination.lastPage = response.meta.last_page;
      pagination.total = response.meta.total;

      return media.value;
    } catch (error) {
      errors.value =
        error?.data?.errors ||
        error?.data?.message ||
        "Los medios no fueron cargados correctamente";
      media.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Obtener un medio por ID
  const fetchMediaById = async (id) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api(`/media/${id}`);
      currentMedia.value = response.data;
      return currentMedia.value;
    } catch (error) {
      errors.value =
        error?.data?.errors ||
        error?.data?.message ||
        "El medio no fue encontrado o no ha sido creado";
      currentMedia.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

 //Creacion de un medio haciendo uso de la ruta protegida
  const createMedia = async (payload) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api("/media", {
        method: "POST",
        body: payload,
      });

      return { success: true, data: response.data };
    } catch (error) {
      errors.value = error?.data?.errors || error?.data?.message;
      return { success: false, errors: errors.value };
    } finally {
      loading.value = false;
    }
  };

  //Actualizacion del medio
  const updateMedia = async (id, payload) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api(`/media/${id}`, {
        method: "PUT",
        body: payload,
      });

      return { success: true, data: response.data };
    } catch (error) {
      errors.value = error?.data?.errors || error?.data?.message;
      return { success: false, errors: errors.value };
    } finally {
      loading.value = false;
    }
  };

  //Desactivacion del medio
  const deleteMedia = async (id) => {
    loading.value = true;
    errors.value = null;

    try {
      await $api(`/media/${id}`, {
        method: "DELETE",
      });

      return { success: true };
    } catch (error) {
      errors.value = error?.data?.message || "El medio no ha sido desactivado";
      return { success: false, errors: errors.value };
    } finally {
      loading.value = false;
    }
  };

  //Verificacion de la disponibilidad del medio
  const checkAvailability = async (mediaId, startsAt, endsAt) => {
    loading.value = true;
    errors.value = null;

    try {
      const response = await $api(`/media/${mediaId}/availability`, {
        params: {
          starts_at: startsAt,
          ends_at: endsAt,
        },
      });

      return response;
    } catch (error) {
      errors.value =
        error?.data?.message || "No se pudo verificar la disponibilidad del medio";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    // estados
    media,
    currentMedia,
    filters,
    pagination,
    loading,
    errors,

    // acciones
    fetchMedia,
    fetchMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
    checkAvailability,
  };
};
