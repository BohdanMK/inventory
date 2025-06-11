// composables/useSocket.ts
import { onMounted, onUnmounted, ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { usePagesStore } from '@/stores/pagesStore';

interface IActivePage {
  id: string;
  route: string;
}

const socket = ref<Socket | null>(null);
const tabs = ref<IActivePage[]>([]);

export function useSocket() {
  const pagesStore = usePagesStore();
  const tabId = getOrCreateTabId();
  const luckyNumber = ref<number | null>(null);

  onMounted(() => {
    socket.value = io('http://localhost:3001');

    socket.value.on('connect', () => {
      console.log('✅ Connected to socket server');
      socket.value?.emit('register-tab', {
        tabId,
        currentPage: window.location.pathname,
      });
    });

    socket.value.on('luckyNumber', (num: number) => {
      console.log('🎲 Lucky Number:', num);
      luckyNumber.value = num;
    });

    socket.value.on('tabs-update', (updatedTabs: IActivePage[]) => {
      console.log('🔄 Received tabs-update:', updatedTabs);
      tabs.value = updatedTabs;
      pagesStore.activePages = updatedTabs;
    });

    socket.value.on('connect_error', error => {
      // console.error('❌ Socket connection error:', error);
    });
  });

  onUnmounted(() => {
    // Повідомляємо сервер, що вкладку слід видалити
    if (socket.value && socket.value.connected) {
      socket.value.emit('remove-tab', { tabId });
    }
    socket.value?.disconnect();
  });

  const requestLuckyNumber = () => {
    if (socket.value && socket.value.connected) {
      socket.value.emit('refresh-number');
    } else {
      // console.warn('⚠️ Socket is not connected');
    }
  };

  // console.log('Socket ref:', socket);

  return {
    luckyNumber,
    requestLuckyNumber,
    tabId,
    socket,
    tabs,
  };
}

function getOrCreateTabId() {
  const stored = sessionStorage.getItem('tabId');
  if (stored) return stored;

  const newId = uuidv4();
  sessionStorage.setItem('tabId', newId);
  return newId;
}
