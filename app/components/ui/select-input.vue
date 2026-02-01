<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  options: {
    type: Array,
    required: true,
  },
  error: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <select
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
      class="w-full rounded-lg bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      :class="error && 'border-red-500 focus:ring-red-500'"
    >
      <option value="" disabled>Selecciona una opción</option>

      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
