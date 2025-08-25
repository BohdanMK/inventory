<script setup lang="ts">
import { ref, onUnmounted, onMounted, nextTick  } from 'vue';
import EmojiPicker from 'vue3-emoji-picker'
import "vue3-emoji-picker/css";
import Drawer from 'primevue/drawer';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import { useActionsStore } from '@/stores/actionsStore';
import { useChatStore } from '@/stores/chatStore';
import { useProfileStore } from '@/stores/userProfileStore';
// import { useSocket } from '@/composables/useSocket';
import setFullImgPath from '@/helpers/fullPathImg.ts';

/// state
const actionsStore = useActionsStore();
const chatStore = useChatStore();
const userProfile = useProfileStore();
// const { sendMessage: socketSendMessage, loadMoreMessages, isConnected } = useSocket({ includeChat: true });
const messages = ref<string[]>([]);
const newMessage = ref<string>("");
const showEmojiPicker = ref(false);
const isSending = ref(false);
const isLoadingMore = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const baseClasses = 'mb-2 w-[80%] px-2 py-4 flex gap-3 text-sm rounded-lg items-center';



const addEmoji = (emoji: any) => {
  newMessage.value += emoji.i;
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  const messageText = newMessage.value.trim();
  isSending.value = true;

  try {
    chatStore.sendMessage(messageText, userProfile.userProfile?._id || '');

      newMessage.value = "";
      showEmojiPicker.value = false;
      // Скролимо вниз після відправки
      // await nextTick();
      scrollToBottom();
    // } else {
    //   console.error('Failed to send message');
    // }
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    isSending.value = false;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    console.log(messagesContainer.value.scrollHeight);
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

/// getters

const otherClasses = (isMine: boolean) =>
  isMine
    ? 'ms-auto text-blue-800 bg-blue-50 dark:text-blue-400 dark:bg-gray-800'
    : 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800';


  // lifecycle hooks

  onMounted(() => {
      if (userProfile?.userProfile?._id) {
        chatStore.initChat(userProfile?.userProfile?._id || '');
      }
  });

  onUnmounted(() => {
    chatStore.stopChat();
  });
</script>

<template>
  <div>
    <Drawer
      v-model:visible="actionsStore.chatActionsVisible"
      header="Chat"
      position="right"
      :style="{ width: 500 + 'px' }"
    >
      <div class="h-[90vh] flex flex-col justify-between gap-3">

        <!-- messages -->
        <div ref="messagesContainer" class="card border border-gray-300 p-3 rounded-md flex-1 overflow-y-auto">
            <div
              v-for="message in chatStore.messagesList"
              :key="message._id"
              :class="`${baseClasses} ${otherClasses(message.userId === userProfile.userProfile?._id)}`"
            >
              <div class="flex-shrink-0 flex flex-col">
                <img
                  :src="setFullImgPath(message.avatar)"
                  :alt="message.username"
                  class="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <div class="flex flex-col ">
                <div>
                  <span class="font-medium">
                    {{ message.username }}
                  </span>
                  <span>

                  </span>
                </div>
                <div>
                  {{ message.message }}
                </div>
              </div>
            </div>
        </div>

        <!-- input + emoji -->
        <div class="flex gap-2 items-end">
          <Button icon="pi pi-face-smile" @click="showEmojiPicker = !showEmojiPicker" outlined />
          <div class="relative">
            <EmojiPicker
              v-if="showEmojiPicker"
              @select="addEmoji"
              class="absolute bottom-12 left-0 z-50"
            />
          </div>
          <Textarea class="flex-auto" v-model="newMessage" rows="1" autoResize />
          <div class="flex gap-2">
              <Button icon="pi pi-send" aria-label="Filter" severity="success" @click="sendMessage" />
              <Button icon="pi pi-file-arrow-up" aria-label="Filter" severity="warn" />
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>
