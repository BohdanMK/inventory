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
    socketService.on("message-deleted", handleDeletedMessage);
  }


  function stopChat() {
    socketService.off("chat-history", setMessages);
    socketService.off("new-message", addMessage);
    socketService.off("message-deleted", handleDeletedMessage);
  }


  function sendMessage(msg: string, userId: string, replyTo: string | null) {
    socketService.emit("send-message", { message: msg, userId, replyTo });
  }


  function setMessages(msgs: IMessageChat[]) {
    messagesList.value = msgs;
  }


  function addMessage(msg: IMessageChat) {
    if (!messagesList.value.find(m => m._id === msg._id)) {
      messagesList.value.push(msg);
    }
  }

  const deleteMessage = (messageId: string, userId: string) => {
    socketService.emit("delete-message", { messageId, userId  });
    // messagesList.value = messagesList.value.filter(m => m._id !== messageId);
  };

  function handleDeletedMessage({ _id }: { _id: string }) {
    const msg = messagesList.value.find(m => m._id === _id);
    if (msg) {
      msg.deleted = true;
    }
  }

  return { messagesList, initChat, stopChat, sendMessage, deleteMessage };
});
