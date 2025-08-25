import { defineStore } from "pinia";
import { ref } from "vue";
import { socketService } from "@/socket/socketService";

export const useSocketStore = defineStore("socket", () => {
  const isConnected = ref(false);

  function connect(userId: string) {
    socketService.connect("http://localhost:3001");

    socketService.on("connect", () => {
      isConnected.value = true;
      socketService.emit("register-user", { userId });
    });

    socketService.on("disconnect", () => {
      isConnected.value = false;
    });
  }

  function disconnect() {
    socketService.disconnect();
    isConnected.value = false;
  }

  return { isConnected, connect, disconnect };
});