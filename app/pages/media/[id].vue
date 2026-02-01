<script setup>
const route = useRoute()
const mediaId = route.params.id

const {
  currentMedia,
  loading,
  errors,
  fetchMediaById,
  checkAvailability,
} = useMedia()

const availability = ref(null)
const checking = ref(false)

const form = reactive({
  starts_at: '',
  ends_at: '',
})

const goBack = () => {
  navigateTo('/media')
}

onMounted(async () => {
  await fetchMediaById(mediaId)
})

const check = async () => {
  if (!form.starts_at || !form.ends_at) return

  checking.value = true
  availability.value = null

  const response = await checkAvailability(
    mediaId,
    form.starts_at,
    form.ends_at
  )

  availability.value = response
  checking.value = false
}

const getStatusBadge = (status) => {
  return status === 'active'
    ? 'bg-green-500/20 text-green-400'
    : 'bg-gray-500/20 text-gray-400'
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        @click="goBack"
        class="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white font-medium transition"
      >
        ← Volver
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Detalle del Medio</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">Cargando medio...</p>
    </div>

    <div
      v-else-if="errors"
      class="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4"
    >
      {{ errors }}
    </div>

    <div v-else-if="currentMedia" class="space-y-6">
      <div class="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">
              {{ currentMedia.name }}
            </h2>
            <p class="text-gray-500 mt-1">{{ currentMedia.location }}</p>
          </div>
          <span
            class="inline-block px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusBadge(currentMedia.status)"
          >
            {{ currentMedia.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500">Tipo de medio</p>
            <p class="text-lg text-gray-900 capitalize">{{ currentMedia.type }}</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500">Dimensiones</p>
            <p class="text-lg text-gray-900">{{ currentMedia.dimensions }}</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500">Precio por día</p>
            <p class="text-2xl font-bold text-indigo-600">
              ${{ currentMedia.price_per_day }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-300 rounded-xl p-6 shadow-sm space-y-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Consultar Disponibilidad
        </h3>

        <p class="text-sm text-gray-600">
          Selecciona las fechas para verificar si el medio está disponible y calcular el precio total.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Fecha de inicio
            </label>
            <input
              v-model="form.starts_at"
              type="date"
              class="w-full rounded-lg bg-white border border-gray-300 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Fecha de fin
            </label>
            <input
              v-model="form.ends_at"
              type="date"
              class="w-full rounded-lg bg-white border border-gray-300 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 opacity-0">
              Acción
            </label>
            <button
              @click="check"
              :disabled="checking || !form.starts_at || !form.ends_at"
              class="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {{ checking ? 'Consultando...' : 'Verificar' }}
            </button>
          </div>
        </div>

        <div v-if="availability" class="pt-4">
          <div
            v-if="availability.available"
            class="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-green-900">¡Disponible!</h4>
                <p class="text-sm text-green-700 mt-1">
                  El medio está disponible para las fechas seleccionadas.
                </p>
                <p class="text-lg font-bold text-green-900 mt-3">
                  Precio total: <span class="text-2xl">${{ availability.total_price }}</span>
                </p>
              </div>
            </div>
          </div>

          <div
            v-else
            class="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-red-900">No disponible</h4>
                <p class="text-sm text-red-700 mt-1">
                  El medio no está disponible para las fechas seleccionadas. Por favor, intenta con otras fechas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>