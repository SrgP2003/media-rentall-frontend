<script setup>
defineProps({
  align: {
    type: String,
    default: "left",
  },
});
</script>

<template>
  <td
    class="px-4 py-3"
    :class="{
      'text-right': align === 'right',
      'text-center': align === 'center',
    }"
  >
    <slot />
  </td>
</template>
