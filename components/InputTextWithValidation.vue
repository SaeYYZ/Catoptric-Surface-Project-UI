<template>
  <div class="field">
    <label
      :for="name"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >{{ label }}
    </label>
    <InputText
      class="bg-gray-50 text-gray-900 sm:text-sm rounded-lg w-full dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
      v-model="value"
      :aria-describedby="`${name}-help`"
      :class="{ 'p-invalid': errorMessage }"
      :type="type"
      v-if="type !== 'password' && type !== 'confirmPassword'"
    />
    <Password
      toggleMask
      class="bg-gray-50 text-gray-900 sm:text-sm rounded-lg w-full dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
      v-model="value"
      :aria-describedby="`${name}-help`"
      :class="{ 'p-invalid': errorMessage }"
      :type="type"
      :feedback="type === 'password'"
      v-if="type === 'password' || type === 'confirmPassword'"
      id="password"
    />
    <small :id="`${name}-help`" class="p-error">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  validation: {
    type: yup.StringSchema<any>,
    default: () => ({}),
    required: true,
  },
  initialValue: {
    type: String,
    default: "",
  },
});

// give it initial values
const { errorMessage, value } = useField(() => props.name, props.validation, {
  initialValue: props.initialValue,
});

if (props.type === "password") {
  value.value = props.initialValue;
}
</script>
<style lang="scss">
#password {
  &>input {
    width: 100%;
    background-color: inherit;
    color: inherit;
  }
}
</style>