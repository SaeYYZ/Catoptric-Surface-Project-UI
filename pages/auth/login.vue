<script lang="ts" setup>
import { useForm } from "vee-validate";
import * as Yup from "yup";
import _has from "lodash/has";
import { LogInFormValues } from "~~/types/allTypes";

definePageMeta({
  layout: "auth",
});

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

const passwordSchema = Yup.string()
  .label("Password")
  .min(8)
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  )
  .required();

const { handleSubmit, isSubmitting, errors, setErrors } =
  useForm<LogInFormValues>({
    validationSchema: Yup.object({
      email: emailSchema,
      password: passwordSchema,
    }),
  });

const onSubmit = handleSubmit(async (values, action) => {
  try {
    isSubmitting.value = true;
    const router = useRouter();
    const { email, password } = values;
    const { error } = await client.auth.signInWithPassword({
      email: email,
      password: password,
    });
    action.resetForm();
    if (error) {
      isOpenRef.value = true;
      errorMessage.value = error.message;
      isSubmitting.value = false;
      return;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resolvedRoute = router.resolve("/protected/dashboard");
      if (resolvedRoute.href) {
        isSubmitting.value = false;
        router.push(resolvedRoute.href);
      }
    }
  } catch (err) {
    console.error(err);
    isSubmitting.value = false;
    action.resetForm();
  }
});

const signInWithGoogle = async () => {
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error(error);
    }
  } catch (err) {
    console.error(err);
  }
};

const signInWithGitHub = async () => {
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) {
      console.error(error);
    }
  } catch (err) {
    console.error(err);
  }
};

const onCloseHandler = {
  close: (value: boolean) => {
    isOpenRef.value = value;
  },
};
</script>
<template>
  <PageWrapper>
    <div class="background-overlay">
      <div
        class="absolute top-0 left-0 transform translate-x-64 translate-y-4 h-14 w-14 rounded-full bg-gray-900 dark:bg-white hidden md:block"
      ></div>
      <div
        class="absolute hidden md:block top-0 left-0 transform translate-x-18 translate-y-20 h-28 w-28 rounded-full bg-blue-600 linear-wipe"
      ></div>
      <div
        class="absolute hidden md:block bottom-0 right-0 transform -translate-x-4 -translate-y-40 h-16 w-16 rounded bg-purple-600 linear-wipe z-10"
      ></div>
      <div class="absolute bottom-0 right-0 triangle-shape z-10"></div>
    </div>
    <PageBody>
      <PageSection>
        <div
          class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
        >
          <a
            href="/"
            class="flex items-center mb-6 text-4xl font-extrabold text-gray-900 dark:text-white uppercase title-text"
          >
            Catoptric project
          </a>
          <div
            class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1
                class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
              >
                Welcome back
              </h1>
              <div class="flex justify-between items-center mb-6">
                <button
                  class="hover:bg-rose-600 text-white font-bold p-2 rounded w-5/12 text-sm border flex items-center ml-1"
                  @click.prevent="signInWithGoogle()"
                >
                  <IconCarbon:logo-google class="w-5 h-5 flex-shrink-0" />
                  <span class="flex-1">Sign in with Google</span>
                </button>
                <button
                  class="hover:bg-dark-900 text-white font-bold p-2 rounded w-5/12 text-sm border flex items-center mr-1"
                  @click.prevent="signInWithGitHub()"
                >
                  <IconCarbon:logo-github class="w-5 h-5 flex-shrink-0" />
                  <span class="flex-1">Sign in with GitHub</span>
                </button>
              </div>
              <div class="flex flex-row justify-center mb-6 items-center">
                <div class="border-t border-gray-700 w-1/2"></div>
                <span class="mx-4 text-gray-500 font-bold">or</span>
                <div class="border-t border-gray-700 w-1/2"></div>
              </div>
              <form class="space-y-4 md:space-y-6" @submit="onSubmit">
                <InputTextWithValidation
                  label="Email address"
                  name="email"
                  :validation="emailSchema"
                />
                <InputTextWithValidation
                  label="Password"
                  name="password"
                  :validation="passwordSchema"
                  type="password"
                />
                <div class="flex items-center justify-start">
                  <a
                    href="/auth/forgot-password"
                    class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >Forgot password?</a
                  >
                </div>
                <Button
                  type="submit"
                  label="Sign in"
                  class="w-full !text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 !border-none"
                />
              </form>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Do not have an account yet?
                <a
                  href="/auth/register"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
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

<style lang="scss">
.title-text {
  background-image: linear-gradient(
    to right,
    #4f46e5,
    #00dbde,
    #fc00ff,
    #00dbde,
    #4f46e5
  );
  background-size: 200% 1px;
  background-position: 0 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 7s linear infinite;
  background-clip: text;
}

div.border-t {
  height: 5px;
}

div.border-t::before {
  content: "";
  display: block;
  height: 5px;
  background-color: #4f46e5;
  background-image: linear-gradient(
    to right,
    #4f46e5,
    #00dbde,
    #fc00ff,
    #00dbde,
    #4f46e5
  );
  background-size: 200% 1px;
  background-position: 0 0;
  animation: gradient 3s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>
