// import { onMounted, onUnmounted } from 'vue';
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from 'vue-router';
// import { usePagesStore } from '@/stores/pagesStore';
// import { useProfileStore } from '@/stores/userProfileStore';
// import { useChatStore } from '@/stores/chatStore';
// import type { IMessageChat } from '@/types/chat/chat';
// import {
//   connectSocket,
//   initChat,
//   socketAPI,
//   socketGetters,
//   onSocketEvent,
//   offAllSocketEvents
// } from '@/socket/socketService';

// interface IActivePage {
//   id: string;
//   route: string;
// }

// // Глобальний лічильник компонентів та tabId
// let componentCounter = 0;
// let globalTabId: string | null = null;

// export function useSocket(options: { includeChat?: boolean } = {}) {
//   const router = useRouter();
//   const pagesStore = usePagesStore();
//   const userProfile = useProfileStore();
//   const chatStore = options.includeChat ? useChatStore() : null;

//   const componentId = `component_${++componentCounter}`;
//   let routeUnwatch: (() => void) | null = null;

//   // Ініціалізуємо tabId лише один раз
//   if (!globalTabId) {
//     globalTabId = getOrCreateTabId();
//   }

//   onMounted(() => {
//     // Підключаємося до сокета
//     connectSocket();

//     // Якщо потрібен чат - ініціалізуємо чат listeners (лише один раз глобально)
//     if (options.includeChat) {
//       initChat();
//     }

//     // Налаштовуємо обробники подій
//     setupEventHandlers();

//     // Відстежуємо зміни маршруту
//     routeUnwatch = router.afterEach((to) => {
//       if (globalTabId) {
//         socketAPI.updateTab(globalTabId, to.path);
//       }
//     });
//   });

//   onUnmounted(() => {
//     // Очищуємо всі підписки цього компонента
//     offAllSocketEvents(componentId);

//     // Відписуємося від маршрутів
//     if (routeUnwatch) {
//       routeUnwatch();
//     }
//   });

//   function setupEventHandlers() {
//     // Обробник підключення
//     onSocketEvent('connect', handleConnection, componentId);

//     // Обробник оновлення табів
//     onSocketEvent('tabs-update', (tabs: IActivePage[]) => {
//       pagesStore.activePages = tabs;
//     }, componentId);

//     // Обробники для чату (тільки для компонентів з чатом)
//     if (chatStore && options.includeChat) {
//       onSocketEvent('chat-history', (messages: IMessageChat[]) => {
//         console.log(`Component ${componentId} received chat history`);
//         chatStore.setMessages(messages);
//       }, componentId);

//       onSocketEvent('new-message', (message: IMessageChat) => {
//         console.log(`Component ${componentId} received new message`);
//         // chatStore.addNewMessage(message);
//       }, componentId);

//       onSocketEvent('chat-error', (error: { message: string }) => {
//         console.log(`Component ${componentId} received chat error`);
//         chatStore.errorFromChat = error.message;
//       }, componentId);
//     }

//     // Якщо вже підключені, відразу викликаємо обробник
//     if (socketGetters.isConnected.value) {
//       handleConnection();
//     }
//   }

//   function handleConnection() {
//     if (globalTabId) {
//       socketAPI.registerTab(globalTabId, router.currentRoute.value.path);
//     }

//     if (userProfile.userProfile?._id) {
//       socketAPI.registerUser(userProfile.userProfile._id);
//     }
//   }

//   // Методи для взаємодії
//   const sendMessage = (message: string) => {
//     if (userProfile.userProfile?._id) {
//       return socketAPI.sendMessage(message, userProfile.userProfile._id);
//     }
//     return false;
//   };

//   const loadMoreMessages = (before?: string, limit: number = 20) => {
//     return socketAPI.loadMoreMessages(before, limit);
//   };

//   const requestLuckyNumber = () => {
//     return socketAPI.requestLuckyNumber();
//   };

//   return {
//     // Стан
//     onlineUsers: socketGetters.onlineUsers,
//     activeTabs: socketGetters.activeTabs,
//     isConnected: socketGetters.isConnected,
//     luckyNumber: socketGetters.luckyNumber,
//     tabId: globalTabId,

//     // Методи
//     sendMessage,
//     loadMoreMessages,
//     requestLuckyNumber,
//   };
// }

// function getOrCreateTabId(): string {
//   const stored = sessionStorage.getItem('tabId');
//   if (stored) return stored;

//   const newId = uuidv4();
//   sessionStorage.setItem('tabId', newId);
//   return newId;
// }
