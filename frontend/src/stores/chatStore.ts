// stores/chatStore.ts
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
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

  const loadersStore = useLoadersStore();

  const initChat = (userId: string) => {
    socketService.emit(SOCKET_EVENTS.GET_CHAT_HISTORY, { userId });
    socketService.on(SOCKET_EVENTS.CHAT_HISTORY, setMessages);
    socketService.on(SOCKET_EVENTS.NEW_MESSAGE, addMessage);
    socketService.on(SOCKET_EVENTS.MESSAGE_DELETED, handleDeletedMessage);
    socketService.on(SOCKET_EVENTS.MESSAGE_REACTED, handleUpdateMessage);
    socketService.on(SOCKET_EVENTS.MESSAGE_UPDATED, handleUpdateMessage);
    socketService.on(SOCKET_EVENTS.MORE_MESSAGES, handlerAddMoreMessagess);
  };

  const stopChat = () => {
    socketService.off(SOCKET_EVENTS.CHAT_HISTORY, setMessages);
    socketService.off(SOCKET_EVENTS.NEW_MESSAGE, addMessage);
    socketService.off(SOCKET_EVENTS.MESSAGE_DELETED, handleDeletedMessage);
  };

  const sendMessage = (msg: string, userId: string, replyTo: string | null, files?: any | null) => {
    socketService.emit(SOCKET_EVENTS.SEND_MESSAGE, { message: msg, userId, replyTo, files });
  };

  const editMessage = (messageId: string, userId: string, msg: string) => {
    socketService.emit(SOCKET_EVENTS.EDIT_MESSAGE, { messageId, userId, newText: msg });
  };

  const setMessages = (msgs: IMessageChat[]) => {
    messagesList.value = msgs;
  };

  const addMessage = (msg: IMessageChat) => {
    if (!messagesList.value.find(m => m._id === msg._id)) {
      messagesList.value.push(msg);
      if (userProfile.userProfile?._id !== msg.userId) {
        increment();
        toastNotification.showSuccess(`${msg.username} - ${msg.message}` || '', 'New message');
      }
    }
  };

  const loadMoreMessages = () => {
    if (!messagesList.value.length || isLoadingMore.value) return;

    const oldestMessage = messagesList.value[0];
    loadersStore.loadMoreStatus = true;
    socketService.emit(SOCKET_EVENTS.LOAD_MORE_MESSAGES, {
      before: oldestMessage.timestamp,
      limit: 20
    });
  };

  const handlerAddMoreMessagess = (msgs: IMessageChat[]) => {
    messagesList.value = [...msgs, ...messagesList.value];
    loadersStore.loadMoreStatus = false;
  };

  const deleteMessage = (messageId: string, userId: string) => {
    socketService.emit(SOCKET_EVENTS.DELETE_MESSAGE, { messageId, userId });
  };

  const handleDeletedMessage = ({ _id }: { _id: string }) => {
    const msg = messagesList.value.find(m => m._id === _id);
    if (msg) {
      msg.deleted = true;
    }
  };

  const handleUpdateMessage = (updatedMsg: IMessageChat) => {
    const index = messagesList.value.findIndex(m => m._id === updatedMsg._id);
    if (index !== -1) {
      messagesList.value[index] = updatedMsg;
    } else {
      messagesList.value.push(updatedMsg);
    }
  };

  const handleSendReactedMessage = (msgId: string, userId: string, emoji: string) => {
    socketService.emit(SOCKET_EVENTS.REACT_MESSAGE, { messageId: msgId, userId, emoji });
  };

  const handleRemoveReaction = (msgId: string, userId: string, emoji: string) => {
    socketService.emit(SOCKET_EVENTS.REMOVE_REACT_MESSAGE, { messageId: msgId, userId, emoji });
  };

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