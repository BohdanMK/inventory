import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useActionsStore = defineStore('actionsStore', () => {
  // state
  const chatActionsVisible = ref<boolean>(false);
  // actions

  const toggleChatActionsStatus = () => {
    chatActionsVisible.value = !chatActionsVisible.value;
  };
  // getters

  return {
    chatActionsVisible,
    toggleChatActionsStatus
  };
});
