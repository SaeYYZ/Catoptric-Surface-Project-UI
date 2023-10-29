<script lang="ts" setup>
import { useForm } from "vee-validate";
import * as Yup from "yup";
import { RegisterFormValues, UserResponse } from "~~/types/allTypes";

definePageMeta({
  layout: "auth",
});

const client = useSupabaseAuthClient();
const isOpenRef = ref(false);
const errorMessage = ref("");

const firstNameSchema = Yup.string()
  .label("First name")
  .required()
  .min(2, "Must have at least 2 characters");

const lastNameSchema = Yup.string()
  .label("Last name")
  .required()
  .min(2, "Must have at least 2 characters");

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

const confirmPassword = Yup.string()
  .label("Confirm password")
  .oneOf([Yup.ref("password")], "Passwords must match")
  .required();

const { handleSubmit, isSubmitting, errors, setErrors } =
  useForm<RegisterFormValues>({
    validationSchema: Yup.object({
      firstName: firstNameSchema,
      lastName: lastNameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword,
    }),
  });

const onSubmit = handleSubmit(async (values, action) => {
  try {
    isSubmitting.value = true;
    const router = useRouter();
    const { firstName, lastName, email, password } = values;
    const { data, error } = await client.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          firstName: firstName,
          lastName: lastName,
        },
      },
    });
    if (error) {
      isOpenRef.value = true;
      errorMessage.value = error.message;
      isSubmitting.value = false;
      return;
    }
    if (data) {
      isSubmitting.value = false;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resolvedRoute = router.resolve("/protected/dashboard");
      if (resolvedRoute.href) {
        isSubmitting.value = false;
        router.push(resolvedRoute.href);
      }
    }
  } catch (err) {
    console.error(err);
    action.resetForm();
    isSubmitting.value = false;
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
    <PageBody>
      <PageSection>
        <div
          class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
        >
          <a
            href="/"
            class="flex items-center mb-6 sm:m-6 text-4xl font-extrabold text-gray-900 dark:text-white uppercase title-text"
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
                Create an account
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
                  label="First name"
                  name="firstName"
                  :validation="firstNameSchema"
                />
                <InputTextWithValidation
                  label="Last name"
                  name="lastName"
                  :validation="lastNameSchema"
                />
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
                <InputTextWithValidation
                  label="Confirm password"
                  name="confirmPassword"
                  :validation="confirmPassword"
                  type="confirmPassword"
                />
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      for="terms"
                      class="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the
                      <a
                        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <Button
                  label="Create an account"
                  type="submit"
                  class="w-full !text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 !border-none"
                />
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?
                  <a
                    href="/auth/login"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
        <AuthModal
          :isOpen="isOpenRef"
          :errorMessage="errorMessage"
          v-on="onCloseHandler"
        />
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
<style lang="scss" scoped>
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
</style>
