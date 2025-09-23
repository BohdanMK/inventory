// stores/chatStore.ts
import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue";
import { socketService } from "@/socket/socketService";
import type { IMessageChat } from "@/types/chat/chat";
import { useToastNotification } from '@/composables/useToastNotification';
import { useProfileStore } from '@/stores/userProfileStore';
import { useUnreadMessages } from "@/composables/useUnreadMessages";
import { useLoadersStore } from "@/stores/loadersStore";

export const useChatStore = defineStore("chat", () => {
  const messagesList = ref<IMessageChat[]>([]);
  const toastNotification = useToastNotification();
  const userProfile = useProfileStore();
  const isLoadingMore = ref<boolean>(false);
  const { increment } = useUnreadMessages();

  // state loaders
  const loadersStore = useLoadersStore();

  function initChat(userId: string) {
    socketService.emit("get-chat-history", { userId });
    socketService.on("chat-history", setMessages);
    socketService.on("new-message", addMessage);
    socketService.on("message-deleted", handleDeletedMessage);

    socketService.on("message-reacted", handleUpdateMessage);
    socketService.on("message-updated", handleUpdateMessage);
    socketService.on("more-messages", handlerAddMoreMessagess);
  }


  function stopChat() {
    socketService.off("chat-history", setMessages);
    socketService.off("new-message", addMessage);
    socketService.off("message-deleted", handleDeletedMessage);
  }


  function sendMessage(msg: string, userId: string, replyTo: string | null , files?: any | null ) {
    socketService.emit("send-message", { message: msg, userId, replyTo, files });
  }

  function editMessage(messageId: string, userId: string, msg: string) {
    socketService.emit("edit-message", {messageId, userId, newText: msg });
  }


  function setMessages(msgs: IMessageChat[]) {
    messagesList.value = msgs;
  }


  function addMessage(msg: IMessageChat) {
    if (!messagesList.value.find(m => m._id === msg._id)) {
      messagesList.value.push(msg);
      if(userProfile.userProfile?._id !== msg.userId) {
        increment();
        toastNotification.showSuccess(`${msg.username} - ${msg.message}` || '', 'New message')
      }
    }
  }

  function loadMoreMessages() {
    if (!messagesList.value.length || isLoadingMore.value) return;

    const oldestMessage = messagesList.value[0];
    loadersStore.loadMoreStatus = true;
    socketService.emit("load-more-messages", {
      before: oldestMessage.timestamp,
      limit: 20
    });
  }

  const handlerAddMoreMessagess = (msgs: IMessageChat[]) => {
      messagesList.value = [...msgs, ...messagesList.value];
      loadersStore.loadMoreStatus = false;
    };

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

  function handleUpdateMessage(updatedMsg: IMessageChat) {
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

  // getters

  const messagesListLength = computed(() => messagesList.value.length);


  return {
      messagesList,
      messagesListLength,
      initChat,
      stopChat,
      sendMessage,
      editMessage,
      deleteMessage,
      handleUpdateMessage,
      handleSendReactedMessage,
      handleRemoveReaction,
      loadMoreMessages,
      isLoadingMore
    };
});
