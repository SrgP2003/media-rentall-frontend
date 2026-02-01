<script setup>
const props = defineProps({
  modelValue: String,
  label: String,
  error: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <input
      type="date"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      class="w-full rounded-lg bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      :class="error && 'border-red-500 focus:ring-red-500'"
    />

    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
