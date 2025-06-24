import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import axios from 'axios';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import { i18nInstance } from '@/i18n/index.ts'
import './style.css';
import 'primeicons/primeicons.css';
import { registerPermissionDirective } from '@/utils/permission';
import StyleClass from 'primevue/styleclass';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { registerGlobalComponents } from './globalComponents.ts';
import App from './App.vue';

library.add(fas);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const pinia = createPinia();
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
});
app.use(ToastService);
app.use(i18nInstance)
registerGlobalComponents(app);
app.directive('styleclass', StyleClass);
app.directive('tooltip', Tooltip);
registerPermissionDirective(app);
app.mount('#app');
