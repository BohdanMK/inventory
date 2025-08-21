import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface IActivePage {
  id: string;
  route: string;
}

export const usePagesStore = defineStore('pagesStore', () => {
  const activePages = ref<IActivePage[]>([]); 
  const countActivePages = computed(() => activePages.value.length);

  return {
    activePages,
    countActivePages,
  };
});