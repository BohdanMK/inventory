import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { socketService } from "@/socket/socketService";

export interface IActivePage {
  id: string;
  route: string;
}

export const usePagesStore = defineStore('pagesStore', () => {
  const activePages = ref<IActivePage[]>([]);
  const countActivePages = computed(() => activePages.value.length);

  function initTabs() {
    socketService.on("tabs-update", setActivePages);
  }

  function setActivePages(tabs: IActivePage[]) {
    activePages.value = tabs;
  }

  function registerTab(tabId: string, currentPage: string) {
    socketService.emit("register-tab", { tabId, currentPage });
  }

  function updateTab(tabId: string, currentPage: string) {
    socketService.emit("update-tab", { tabId, currentPage });
  }

  function removeTab(tabId: string) {
    socketService.emit("remove-tab", { tabId });
  }

  return {
    activePages,
    countActivePages,
    initTabs,
    registerTab,
    updateTab,
    removeTab
  };
});
