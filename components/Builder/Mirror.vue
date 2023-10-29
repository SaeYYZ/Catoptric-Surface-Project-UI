<script lang="ts" setup>
const props = defineProps<{
  number: string;
  isSelected: boolean;
}>()
const { number, isSelected } = toRefs(props)
</script>
<template>
  <div
    :class="{
      'bg-orange-100 dark:bg-orange-800': isSelected,
      'bg-gray-200 dark:bg-gray-700': !isSelected
    }"
    class="flex items-center justify-center w-6 h-6 rounded-full"
  >
    <span class="text-gray-600 dark:text-gray-300">{{ number }}</span>
  </div>
</template>