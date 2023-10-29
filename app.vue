<script lang="ts" setup>
import { AppConfigInput } from '@nuxt/schema';
import { AppSetup } from './utils/app';
import { ITheme } from './utils/theme';
AppSetup();
const theme = useState<ITheme>('theme.current');
const locale = useState<string>('locale.setting');
const app = useAppConfig() as AppConfigInput
useHead({
  title: app.name,
  meta: [
    {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    {hid: 'description', name: 'description', content: app.description}
  ],
  link: [
    {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
  ]
})
</script>
<template>
  <Html :class="`${theme === 'dark' ? 'dark' : ''}`" :lang="locale">
    <Body class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 bg-gradient-to-r from-blue-600/10 bg-gradient-to-l from-green-600/10">
      <NuxtLayout>
        <NuxtLoadingIndicator />
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
