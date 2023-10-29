import { defineNuxtPlugin } from "#app";
import VueTippy from "vue-tippy";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueTippy, {
        directive: "tippy",
        component: "Tippy",
        componentSingleton: "TippySingleton",
        defaultProps: {
          placement: 'auto-end',
          allowHTML: true,
        }
    });
});