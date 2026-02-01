<script setup>
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  open: Boolean,
  type: {
    type: String,
    default: "success",
  },
  title: String,
  message: String,
});

const emit = defineEmits(["close"]);

const styles = {
  success: {
    icon: CheckCircleIcon,
    color: "text-green-500",
  },
  error: {
    icon: XCircleIcon,
    color: "text-red-500",
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: "text-yellow-500",
  },
  info: {
    icon: InformationCircleIcon,
    color: "text-blue-500",
  },
};

const current = styles[props.type];
</script>

<template>
  <UiBaseModal :open="open" @close="emit('close')">
    <div class="text-center space-y-4">
      <component
        :is="current.icon"
        class="mx-auto h-12 w-12"
        :class="current.color"
      />

      <h3 class="text-lg font-semibold text-white">
        {{ title }}
      </h3>

      <p class="text-sm text-gray-400">
        {{ message }}
      </p>

      <button
        class="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
        @click="emit('close')"
      >
        Aceptar
      </button>
    </div>
  </UiBaseModal>
</template>
