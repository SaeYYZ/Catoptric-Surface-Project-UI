<script lang="ts" setup>
import { useForm } from "vee-validate";
import * as Yup from "yup";

definePageMeta({
  layout: "auth",
});

const router = useRouter();
const client = useSupabaseAuthClient();
const isOpenRef = ref(false);
const errorMessage = ref("");

const emailSchema = Yup.string()
  .email()
  .required()
  .label("Email address")
  .matches(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    "Must be a valid email address"
  );

const { handleSubmit, isSubmitting, errors, setErrors } = useForm({
  validationSchema: Yup.object({
    email: emailSchema,
  }),
});

const onSubmit = handleSubmit(async (values, action) => {
  try {
    isSubmitting.value = true;
    const { email } = values;
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3000/auth/reset-password?email=${email}`,
    });
    action.resetForm();
    isSubmitting.value = false;
    if (error) {
      console.error(error);
    } else {
      errorMessage.value = "Check your email to reset your password";
      isOpenRef.value = true;
    }
  } catch(err) {
    console.error(err);
    action.resetForm();
  }
});
const onCloseHandler = {
  close: (value: boolean) => {
    isOpenRef.value = value;
  },
};
</script>
<template>
  <PageWrapper>
    <PageBody>
      <PageSection>
        <div class="max-w-4xl mx-auto mt-24">
          <div
            class="flex flex-col items-center justify-center p-4 space-y-4 antialiased text-gray-900 dark:text-white"
          >
            <div
              class="w-full px-8 max-w-lg space-y-6 bg-white dark:bg-gray-800 rounded-md py-16"
            >
              <h1 class="mb-6 text-3xl font-bold text-center title-text">Don't worry</h1>
              <p class="text-center mx-12">
                We are here to help you to recover your password. Enter the
                email address you used when you joined and we'll send you
                instructions to reset your password.
              </p>
              <form class="space-y-6 w-full" @submit="onSubmit">
                <InputTextWithValidation
                  label="Email address"
                  name="email"
                  :validation="emailSchema"
                  initialValue="quankhuc99@gmail.com"
                />
                <div>
                  <button
                    type="submit"
                    class="w-full px-4 py-2 font-medium text-center text-white bg-indigo-600 transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 hover:bg-blue-500"
                  >
                    Send
                  </button>
                </div>
              </form>
              <div
                class="text-sm text-gray-600 items-center flex justify-between"
              >
                <p
                  class="text-gray-800 cursor-pointer hover:text-blue-500 inline-flex items-center dark:text-white"
                  @click="() => router.push('/auth/login')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Back to login
                </p>
              </div>
            </div>
          </div>
        </div>
        <AuthModal
          :isOpen="isOpenRef"
          :errorMessage="errorMessage"
          v-on="onCloseHandler"
        />
        <!-- Spinner -->
        <div class="relative z-10">
          <div
            class="fixed inset-0 bg-black bg-opacity-60"
            v-if="isSubmitting"
          ></div>
          <div class="fixed inset-0 overflow-y-auto" v-if="isSubmitting">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
            >
              <div
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg:white p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="flex justify-center">
                  <div
                    class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 animate-spin"
                  >
                    <div class="h-9 w-9 rounded-full bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
