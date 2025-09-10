import { defineStore } from "pinia";
import { ref } from "vue";
import { socketService } from "@/socket/socketService";
import { useToastNotification } from '@/composables/useToastNotification';

export const useSocketStore = defineStore("socket", () => {
  const isConnected = ref(false);
  const toastNotification = useToastNotification();
  const lastError = ref<string | null>(null);

  function connect(userId: string) {
    socketService.connect("http://localhost:3001");

    socketService.on("connect", () => {
      isConnected.value = true;
      socketService.emit("register-user", { userId });
    });

    socketService.on("disconnect", () => {
      isConnected.value = false;
    });

    socketService.off("chat-error", handleChatError);
    socketService.on("chat-error", handleChatError);
  }

  function disconnect() {
    socketService.disconnect();
    isConnected.value = false;
  }

  function handleChatError(err: any) {
    lastError.value = err?.message || "Unknown socket error";
    toastNotification.showError(lastError.value || '');
  }

  return { isConnected, connect, disconnect };
});