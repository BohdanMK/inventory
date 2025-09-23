import { defineStore } from "pinia";
import { ref } from "vue";
import { socketService } from "@/socket/socketService";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

  interface IUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }

  export const useUsersStore = defineStore("users", () => {
    const onlineUsers = ref<IUser[]>([]);
    const initialized = ref(false);

    const initUsersListeners = () => {
      if (initialized.value) return;
      initialized.value = true;

      socketService.on(SOCKET_EVENTS.USERS_UPDATE, (users: IUser[]) => {
        onlineUsers.value = users;
      });
    };

    const registerUser = (userId: string) => {
      socketService.emit(SOCKET_EVENTS.REGISTER_USER, { userId });
    };

    const logoutUser = (userId: string) => {
      socketService.emit(SOCKET_EVENTS.LOGOUT_USER, { userId });
      onlineUsers.value = onlineUsers.value.filter((u) => u.id !== userId);
    };

  return {
    onlineUsers,
    initUsersListeners,
    registerUser,
    logoutUser,
  };
});