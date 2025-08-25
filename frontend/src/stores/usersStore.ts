import { defineStore } from "pinia";
import { ref } from "vue";
import { socketService } from "@/socket/socketService";

interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const useUsersStore = defineStore("users", () => {
  const onlineUsers = ref<IUser[]>([]);
  const initialized = ref(false);

  function initUsersListeners() {
    if (initialized.value) return;
    initialized.value = true;

    socketService.on("users-update", (users: IUser[]) => {
      onlineUsers.value = users;
    });
  }

  function registerUser(userId: string) {
    socketService.emit("register-user", { userId });
  }

  function logoutUser(userId: string) {
    socketService.emit("logout-user", { userId });
    onlineUsers.value = onlineUsers.value.filter((u) => u.id !== userId);
  }

  return {
    onlineUsers,
    initUsersListeners,
    registerUser,
    logoutUser,
  };
});
