<script setup>
definePageMeta({
  layout: false,
});

// Composable de Auth
const { login, loading, errors } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  await login(form);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div
      class="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-12"
    >
      <!-- Titulo -->
      <h1 class="text-4xl font-semibold text-white text-center mb-6">
        Iniciar sesión
      </h1>

      <!-- Formulario -->
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="correo@ejemplo.com"
            class="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Error -->
        <div
          v-if="errors"
          class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3"
        >
          {{ errors }}
        </div>

        <!-- Boton Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          <span v-if="!loading">Iniciar sesión</span>
          <span v-else>Ingresando...</span>
        </button>
      </form>
    </div>
  </div>
</template>
