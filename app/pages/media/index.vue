<script setup>
const { media, filters, pagination, loading, errors, fetchMedia } = useMedia();
onMounted(() => {
  fetchMedia();
});
// Reactividad de filtros
watch(
  filters,
  () => {
    fetchMedia(1);
  },
  { deep: true },
);
const changePage = (page) => {
  if (page >= 1 && page <= pagination.lastPage) {
    fetchMedia(page);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 px-6 py-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 class="text-3xl font-semibold text-white">Medios publicitarios</h1>
        <p class="text-gray-400 mt-1">
          Listado de medios disponibles para renta
        </p>
      </div>

      <div
        class="bg-gray-800 border border-gray-700 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nombre o ubicación"
          class="col-span-1 md:col-span-2 rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        <select
          v-model="filters.type"
          class="rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2"
        >
          <option value="">Todos los tipos</option>
          <option value="billboard">Billboard</option>
          <option value="screen">Pantalla</option>
          <option value="mupi">Mupi</option>
        </select>

        <select
          v-model="filters.status"
          class="rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      <div v-if="loading" class="text-center text-gray-400 py-12">
        Cargando medios...
      </div>

      <div
        v-else-if="errors"
        class="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4"
      >
        {{ errors }}
      </div>

      <div
        v-else-if="media.length === 0"
        class="text-center text-gray-400 py-12"
      >
        No se encontraron medios con los filtros aplicados.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in media"
          :key="item.id"
          class="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col justify-between"
        >
          <div class="space-y-2">
            <div class="flex justify-between items-start">
              <h2 class="text-lg font-semibold text-white">
                {{ item.name }}
              </h2>
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="
                  item.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                "
              >
                {{ item.status }}
              </span>
            </div>

            <p class="text-sm text-gray-400">
              {{ item.location }}
            </p>

            <p class="text-sm text-gray-300">
              Tipo: <span class="font-medium">{{ item.type }}</span>
            </p>

            <p class="text-sm text-gray-300">
              Dimensiones: {{ item.dimensions }}
            </p>

            <p class="text-lg font-semibold text-indigo-400">
              ${{ item.price_per_day }} / día
            </p>
          </div>

          <NuxtLink
            :to="`/media/${item.id}`"
            class="mt-4 inline-flex justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-medium transition"
          >
            Ver detalle
          </NuxtLink>
        </div>
      </div>

      <!-- Paginación -->
      <div
        v-if="pagination.lastPage > 1"
        class="flex justify-center items-center gap-4 pt-6"
      >
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white disabled:opacity-40"
        >
          Anterior
        </button>

        <span class="text-gray-400">
          Página {{ pagination.page }} de {{ pagination.lastPage }}
        </span>

        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.lastPage"
          class="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>