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

    socketService.on("message-reacted", handleReactedMessage);
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
  };

  function handleReactedMessage(updatedMsg: IMessageChat) {
    const index = messagesList.value.findIndex(m => m._id === updatedMsg._id);
    if (index !== -1) {
      messagesList.value[index] = updatedMsg;
    } else {
      messagesList.value.push(updatedMsg);
    }
  }

  function handleSendReactedMessage(msgId: string, userId: string, emoji: string) {
    socketService.emit("react-message", { messageId: msgId, userId, emoji })
  }

  function handleRemoveReaction(msgId: string, userId: string, emoji: string) {
    socketService.emit("remove-react-message", { messageId: msgId, userId, emoji });
  }

  return { messagesList, initChat, stopChat, sendMessage, deleteMessage, handleReactedMessage, handleSendReactedMessage, handleRemoveReaction };
});
