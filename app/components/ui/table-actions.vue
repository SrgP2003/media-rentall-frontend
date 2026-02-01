<script setup>
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'

defineEmits(['edit', 'delete'])
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      class="rounded-md bg-gray-800 px-3 py-1 text-sm hover:bg-gray-700"
    >
      •••
    </MenuButton>

    <MenuItems
      class="absolute right-0 mt-2 w-32 rounded-md bg-gray-800
             shadow-lg ring-1 ring-black/5 z-10"
    >
      <MenuItem v-slot="{ active }">
        <button
          @click="$emit('edit')"
          class="block w-full px-4 py-2 text-left text-sm"
          :class="active && 'bg-gray-700'"
        >
          Editar
        </button>
      </MenuItem>

      <MenuItem v-slot="{ active }">
        <button
          @click="$emit('delete')"
          class="block w-full px-4 py-2 text-left text-sm text-red-400"
          :class="active && 'bg-gray-700'"
        >
          Eliminar
        </button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
