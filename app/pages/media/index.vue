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
  <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold text-white">Medios publicitarios</h1>
            <h1 class="text-2xl font-bold text-gray-900">LIstado de medios disponibles para renta</h1>
      </div>

      <div
        class="bg-white border border-gray-300 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nombre o ubicación"
          class="col-span-1 md:col-span-2 rounded-lg bg-white border border-gray-300 text-gray-900 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <select
          v-model="filters.type"
          class="rounded-lg bg-white border border-gray-300 text-gray-900 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Todos los tipos</option>
          <option value="billboard">Billboard</option>
          <option value="screen">Pantalla</option>
          <option value="mupi">Mupi</option>
        </select>

        <select
          v-model="filters.status"
          class="rounded-lg bg-white border border-gray-300 text-gray-900 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
          class="bg-white border border-gray-300 rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="space-y-3">
            <div class="flex justify-between items-start gap-3">
              <h2 class="text-lg font-bold text-gray-900 leading-tight">
                {{ item.name }}
              </h2>
              <span
                class="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                :class="
                  item.status === 'active'
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-gray-500/20 text-gray-600'
                "
              >
                {{ item.status }}
              </span>
            </div>

            <div class="space-y-2">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {{ item.location }}
                </p>
              </div>

              <div class="pt-2 border-t border-gray-200 space-y-1.5">
                <p class="text-sm text-gray-700">
                  <span class="font-medium text-gray-900">Tipo:</span> 
                  <span class="capitalize">{{ item.type }}</span>
                </p>

                <p class="text-sm text-gray-700">
                  <span class="font-medium text-gray-900">Dimensiones:</span> 
                  {{ item.dimensions }}
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-200">
              <p class="text-2xl font-bold text-indigo-600">
                ${{ item.price_per_day }}
                <span class="text-sm font-normal text-gray-500">/ día</span>
              </p>
            </div>
          </div>

          <NuxtLink
            :to="`/media/${item.id}`"
            class="mt-5 inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-semibold transition"
          >
            Ver detalle
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
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
          class="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
        >
          Anterior
        </button>

        <span class="text-gray-600 font-medium">
          Página {{ pagination.page }} de {{ pagination.lastPage }}
        </span>

        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.lastPage"
          class="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
        >
          Siguiente
        </button>
      </div>
  </div>
</template>