<template>
  <BuilderNavbar>
    <template #menu>
      <div class="relative hidden lg:flex items-center ml-auto">
        <div class="flex items-center">
          <img
            class="w-6 h-6 rounded-full mr-2"
            :src="userImage"
            alt="Avatar"
            v-if="userImage"
          />
          <span v-else class="font-medium text-gray-600 dark:text-white rounded-md p-0.5" :class="randomBackgroundColor()">{{ firstLastInitial() }}</span>
          <div class="text-right">
            <Menu as="div" class="relative contents text-left">
              <div>
                <MenuButton
                  class="inline-flex w-full justify-center rounded-md bg-opacity-0 px-4 pt-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 bg-inherit"
                >
                  <IconUil:angleDown
                    class="h-4 w-4 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[
                          active ? 'bg-rose-500 text-white' : 'text-gray-900',
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        ]"
                        @click.prevent="logOut()"
                      >
                        <IconUil:exit
                          :active="active"
                          class="mr-2 h-5 w-5 text-rose-400"
                          aria-hidden="true"
                        />
                        Logout
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div
          class="flex space-x-4 border-l ml-6 pl-6 border-gray-900/10 dark:border-gray-50/[0.2]"
        >
          <ThemeSwitcher />
        </div>
      </div>
    </template>
    <template #options="{ toggleOptions }">
      <ActionSheet @on-close="() => toggleOptions(false)">
        <ActionSheetBody>
          <ActionSheetHeader text="Menu" />
          <div class="mt-6 text-sm font-bold capitalize">Change Theme</div>
          <div class="mt-2">
            <ThemeSwitcher type="select-box" />
          </div>
        </ActionSheetBody>
        <MyButton 
          type="secondary"
          title="Logout"
          @click.prevent="logOut()"
        >
          <IconUil:exit class="mr-2 h-5 w-5 text-rose-400" aria-hidden="true" />
          <span class="ml-1">Logout</span>
        </MyButton>
        <MyButton
          text="Close"
          type="secondary"
          @click.prevent="toggleOptions(false)"
        />
      </ActionSheet>
    </template>
    <template #drawer>
      <slot name="drawer" />
    </template>
  </BuilderNavbar>
</template>
<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const client = useSupabaseAuthClient();
const user = useSupabaseUser();
const userImage = user.value?.user_metadata?.avatar_url || "";

const firstLastInitial = () => {
  const first = user.value?.user_metadata?.firstName || "";
  const last = user.value?.user_metadata?.lastName || "";
  return `${first[0]}${last[0]}`;
};

const randomBackgroundColor = () => {
  const colors = [
    "bg-violet-500",
    "bg-rose-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const logOut = async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    console.error(error);
  }
  else {
    navigateTo("/")
  }
};
</script>
