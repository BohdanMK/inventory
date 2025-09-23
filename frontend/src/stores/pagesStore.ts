import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { socketService } from "@/socket/socketService";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

  export interface IActivePage {
    id: string;
    route: string;
  }

  export const usePagesStore = defineStore("pagesStore", () => {
    const activePages = ref<IActivePage[]>([]);
    const countActivePages = computed(() => activePages.value.length);

    const initTabs = () => {
      socketService.on(SOCKET_EVENTS.TABS_UPDATE, setActivePages);
    };

    const setActivePages = (tabs: IActivePage[]) => {
      activePages.value = tabs;
    };

    const registerTab = (tabId: string, currentPage: string) => {
      socketService.emit(SOCKET_EVENTS.REGISTER_TAB, { tabId, currentPage });
    };

    const updateTab = (tabId: string, currentPage: string) => {
      socketService.emit(SOCKET_EVENTS.UPDATE_TAB, { tabId, currentPage });
    };

    const removeTab = (tabId: string) => {
      socketService.emit(SOCKET_EVENTS.REMOVE_TAB, { tabId });
    };

    return {
      activePages,
      countActivePages,
      initTabs,
      registerTab,
      updateTab,
      removeTab,
    };
});