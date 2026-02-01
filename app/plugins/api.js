export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    // Interceptor de Request
    onRequest({ options }) {
      const token = useState("token").value;

      // Mandar headers apropiados
      if (!(options.body instanceof FormData)) {
        options.headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...options.headers,
        };
      } else {
        options.headers = {
          Accept: "application/json",
          ...options.headers,
        };
      }

      // Agregar Authorization si hay token
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
      }
    },

    // Manejo de errores
    onResponseError({ response }) {
      if (response.status === 401) {
        // Limpiar token en useState
        const token = useState("token");
        token.value = null;
        navigateTo("/login");
      }

      if (response.status === 403) {
        console.error("No tienes permisos para esta acción");
      }

      if (response.status === 422) {
        console.error("Errores de validación:", response._data.errors);
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
