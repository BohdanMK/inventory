import { SOCKET_EVENTS } from '@/constants/socketEvents';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { socketService } from '@/socket/socketService';
import { useToastNotification } from '@/composables/useToastNotification';
import { useLoadersStore } from '@/stores/loadersStore';

export const useSocketStore = defineStore('socket', () => {
  const isConnected = ref(false);
  const toastNotification = useToastNotification();
  const lastError = ref<string | null>(null);
  // state loaders
  const loadersStore = useLoadersStore();

  function connect(userId: string) {
    socketService.connect(import.meta.env.VITE_SOCKET_CONNECTION);

    socketService.on('connect', () => {
      isConnected.value = true;
      socketService.emit('register-user', { userId });
    });

    socketService.on('disconnect', () => {
      isConnected.value = false;
    });

    socketService.off(SOCKET_EVENTS.CHAT_ERROR, handleChatError);
    socketService.on(SOCKET_EVENTS.CHAT_ERROR, handleChatError);
  }

  function disconnect() {
    socketService.disconnect();
    isConnected.value = false;
  }

  function handleChatError(err: any) {
    lastError.value = err?.message || 'Unknown socket error';
    toastNotification.showError(lastError.value || '');
    loadersStore.resetChatLoaders();
  }

  return { isConnected, connect, disconnect };
});
