<template>
  <div>
    <slot name="app-before" />
    <div id="app-before"></div>
    <div class="flex-1 w-full flex flex-col min-h-screen">
      <slot />
    </div>
    <slot name="app-after" />
    <div id="app-after"></div>
  </div>
</template>