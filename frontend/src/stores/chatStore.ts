// stores/chatStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { socketService } from "@/socket/socketService";
import type { IMessageChat } from "@/types/chat/chat";

export const useChatStore = defineStore("chat", () => {
  const messagesList = ref<IMessageChat[]>([]);


  function initChat(userId: string) {
    socketService.emit("get-chat-history", { userId });
    socketService.on("chat-history", setMessages);
    socketService.on("new-message", addMessage);
  }


  function stopChat() {
    socketService.off("chat-history", setMessages);
    socketService.off("new-message", addMessage);
  }


  function sendMessage(msg: string, userId: string) {
    socketService.emit("send-message", { message: msg, userId });
  }


  function setMessages(msgs: IMessageChat[]) {
    messagesList.value = msgs;
  }


  function addMessage(msg: IMessageChat) {
    if (!messagesList.value.find(m => m._id === msg._id)) {
      messagesList.value.push(msg);
    }
  }

  return { messagesList, initChat, stopChat, sendMessage };
});
