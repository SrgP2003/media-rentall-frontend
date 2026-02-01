<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";

import { Bars3Icon } from "@heroicons/vue/24/outline";

//  Composable de Auth
const { logout, user, fetchUser } = useAuth();

// Obtener el usuario al montar el componente
onMounted(async () => {
  await fetchUser();
});

const navigation = [
  { name: "Pantallas", href: "/media", current: false },
  { name: "Reservaciones", href: "/booking", current: false },
];
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex items-center gap-4">
            <!-- Login cuando no hay user -->
            <NuxtLink
              v-if="!user"
              to="/auth/login"
              class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
            >
              Iniciar sesión
            </NuxtLink>

            <Menu v-else as="div" class="relative ml-3">
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-40 rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5"
                >
                  <MenuItem v-slot="{ active }">
                    <NuxtLink
                      to="/profile"
                      class="block px-4 py-2 text-sm text-gray-300"
                      :class="active && 'bg-gray-700 text-white'"
                    >
                      Perfil
                    </NuxtLink>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <button
                      @click="logout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-300"
                      :class="active && 'bg-gray-700 text-white'"
                    >
                      Cerrar sesión
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Menu -->
          <div class="hidden sm:flex space-x-4 justify-between" v-if="user">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="rounded-md px-3 py-2 text-sm font-medium"
              :class="
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              "
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <Menu v-if="user" as="div" class="relative ml-3">
          <MenuButton
            class="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <img
              class="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="User"
            />
          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <MenuItems
              class="absolute right-0 z-10 mt-2 w-40 rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5"
            >
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-300"
                  :class="active && 'bg-gray-700 text-white'"
                >
                  Perfil
                </NuxtLink>
              </MenuItem>

              <MenuItem v-slot="{ active }">
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300"
                  :class="active && 'bg-gray-700 text-white'"
                >
                  Cerrar sesión
                </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>

        <!-- Boton en moviles -->
        <DisclosureButton
          class="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <Bars3Icon class="h-6 w-6" />
        </DisclosureButton>
      </div>
    </div>

    <!-- Menu en moviles -->
    <DisclosurePanel class="sm:hidden px-2 pt-2 pb-3 space-y-1" v-if="user">
      <NuxtLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        class="block rounded-md px-3 py-2 text-base font-medium"
        :class="
          item.current
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        "
      >
        {{ item.name }}
      </NuxtLink>
    </DisclosurePanel>
  </Disclosure>
</template>
