import { defineAsyncComponent } from 'vue';
import type { App } from '@vue/runtime-core';

const Button = defineAsyncComponent(() => import('primevue/button'));
const Toast = defineAsyncComponent(() => import('primevue/toast'));

export function registerGlobalComponents(app: App) {
  app.component('Button', Button);
  app.component('Toast', Toast);
}
