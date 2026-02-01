<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // [{ key, label, align }]
  },
  actions: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <thead class="bg-gray-100">
    <tr>
      <th
        v-for="col in columns"
        :key="col.key"
        class="px-4 py-3 font-medium"
        :class="col.align === 'right' ? 'text-right' : 'text-left'"
      >
        {{ col.label }}
      </th>

      <th v-if="actions" class="px-4 py-3 text-right">Acciones</th>
    </tr>
  </thead>
</template>
