export const useAuth = () => {
  const { $api } = useNuxtApp();
  const config = useRuntimeConfig();

  const user = useState("user", () => null);
  const token = useState("token", () => {
    if (process.client) {
      return localStorage.getItem("token") || null;
    }
    return null;
  });
  const loading = ref(false);
  const errors = ref(null);

  // Login con token
  const login = async ({ email, password }) => {
    loading.value = true;
    errors.value = null;

    try {
      // Solicita el token al backend
      const response = await $fetch("/login", {
        baseURL: config.public.apiBase,
        method: "POST",
        body: { email, password },
      });

      token.value = response.token;

      if (process.client) {
        localStorage.setItem("token", response.token);
      }

      user.value = await $api("/user");

      await navigateTo("/media");

      return { success: true };
    } catch (error) {
      errors.value =
        error?.data?.errors ||
        error?.data?.message ||
        "Credenciales incorrectas";

      return { success: false, errors: errors.value };
    } finally {
      loading.value = false;
    }
  };

  // Metodo para obtener la informacion del usuario autenticado
  const fetchUser = async () => {
    if (!token.value) {
      user.value = null;
      return null;
    }
    loading.value = true;
    errors.value = null;
    try {
      user.value = await $api("/user");
      return user.value;
    } catch (error) {
      errors.value =
        error?.data?.errors ||
        error?.data?.message ||
        "No se pudo obtener la información del usuario";
      user.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    user.value = null;
    token.value = null;
    
    if (process.client) {
      localStorage.removeItem("token");
    }
    
    loading.value = false;
    await navigateTo("/auth/login");
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    user,
    token,
    loading,
    errors,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  };
};
