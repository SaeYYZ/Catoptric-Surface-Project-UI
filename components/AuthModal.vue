<script lang="ts" setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

type AuthErrorInfo = "Invalid login credentials" | "User already registered" | "Check your email to reset your password";

const errors: Record<AuthErrorInfo, string> = {
  "Invalid login credentials":
    "Invalid login credentials (email or password is incorrect or does not exist or already linked to another account)",
  "User already registered":
    "User already registered (email already exists in the database, only one account per email is allowed)",
  "Check your email to reset your password":
    "Check your email to reset your password",
};

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  errorMessage: {
    type: String,
    default: "",
    required: true,
  },
});

const _isOpen = toRef(props, "isOpen");
const _errorMessage = toRef(props, "errorMessage");
const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close", false);
};

const errorDisplay = computed(() => {
  return errors[_errorMessage.value as AuthErrorInfo];
});
</script>
<template>
  <TransitionRoot appear :show="_isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl dark:bg-gray-700 bg:white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-red-600 flex items-center justify-center"
              >
                Auth Error
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm dark:text-white text-gray-500">
                  {{ errorDisplay }}
                </p>
              </div>
              <div class="mt-4">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Got it, thanks!
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
