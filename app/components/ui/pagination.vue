<script setup>
const props = defineProps({
  meta: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["change"]);

const goToPage = (page) => {
  if (!page || page === props.meta.current_page) return;
  emit("change", page);
};

const pageLinks = computed(() => {
  const links = props.meta.links?.filter(link => link && link.page !== null) || [];
  const uniquePages = new Map();
  
  links.forEach(link => {
    if (!uniquePages.has(link.page)) {
      uniquePages.set(link.page, link);
    }
  });
  
  return Array.from(uniquePages.values()).sort((a, b) => a.page - b.page);
});
</script>

<template>
  <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between mt-6">
    <p class="text-sm text-gray-600">
      Mostrando {{ meta.from }}–{{ meta.to }} de {{ meta.total }}
    </p>

    <div class="flex items-center gap-1">
      <button
        class="px-3 py-2 rounded-md border text-sm"
        :class="
          meta.current_page === 1
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:bg-gray-100 text-gray-700'
        "
        :disabled="meta.current_page === 1"
        @click="goToPage(meta.current_page - 1)"
      >
        ←
      </button>

      <button
        v-for="(link, index) in pageLinks"
        :key="`page-${link.page}-${index}`"
        @click="goToPage(link.page)"
        class="px-3 py-2 rounded-md border text-sm"
        :class="
          link.active
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'border-gray-300 hover:bg-gray-100 text-gray-700'
        "
      >
        {{ link.page }}
      </button>

      <button
        class="px-3 py-2 rounded-md border text-sm"
        :class="
          meta.current_page === meta.last_page
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:bg-gray-100 text-gray-700'
        "
        :disabled="meta.current_page === meta.last_page"
        @click="goToPage(meta.current_page + 1)"
      >
        →
      </button>
    </div>
  </div>
</template>
