<script setup lang="ts">
import { ref, onUnmounted, onMounted, nextTick, computed, reactive  } from 'vue';
import type { IMessageChat }  from '@/types/chat/chat.ts';
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
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from "primevue/useconfirm";




/// state
const actionsStore = useActionsStore();
const chatStore = useChatStore();
const userProfile = useProfileStore();
const confirm = useConfirm();
const messages = ref<string[]>([]);
const newMessage = ref<string>("");
const showEmojiPicker = ref(false);
const isSending = ref(false);
const isLoadingMore = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const baseClasses = 'mb-2 w-[80%] px-2 py-4 flex flex-col gap-3 text-sm rounded-lg items-start';
const replyMesssage = ref<IMessageChat | null>(null);


const addEmoji = (emoji: any) => {
  newMessage.value += emoji.i;
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  const messageText = newMessage.value.trim();
  isSending.value = true;

  try {
    chatStore.sendMessage(messageText, userProfile.userProfile?._id || '', replyMesssage.value ? replyMesssage.value._id : null);

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
    replyMesssage.value = null
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    console.log(messagesContainer.value.scrollHeight);
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const confirm2 = (messageId: string, event: Event) => {
    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: 'Do you want to delete this message?',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
          console.log(event);
            // toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
            chatStore.deleteMessage(messageId, userProfile.userProfile?._id || '');
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};

const setReplyTo = (message: IMessageChat) => {
  replyMesssage.value = message;
};

const removeReplyTo = () => {
  replyMesssage.value = null;
}

  /// getters

  const otherClasses = (isMine: boolean) =>
    isMine
      ? 'ms-auto text-blue-800 bg-blue-50 dark:text-blue-400 dark:bg-gray-800'
      : 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800';

  const isMine = computed(() => {
    return (userId: string) => userId === userProfile.userProfile?._id;
  });

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
      <div class="h-[90vh] flex flex-col justify-between gap-0">

        <!-- messages -->
        <div ref="messagesContainer" class="card border border-gray-300 p-3 rounded-md flex-1 overflow-y-auto mb-3">
            <template
              v-for="message in chatStore.messagesList"
              :key="message._id"

            >

              <div v-if="!message.deleted" :class="`${baseClasses} ${otherClasses(message.userId === userProfile.userProfile?._id)}`">

                  <div
                    v-if="message.replyTo"
                    class="w-full p-1 bg-amber-50 m-[-5px]"
                  >
                    {{ message.replyTo.message }}
                  </div>
                  <div class="flex w-full gap-3 items-center">
                    <div class="flex-shrink-0 flex flex-col">
                      <img
                        :src="setFullImgPath(message.avatar)"
                        :alt="message.username"
                        class="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <div class="flex flex-col flex-auto">
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
                    <div class="flex flex-col" v-if="!message.deleted">
                      <template v-if="isMine(message.userId)">

                        <ConfirmPopup></ConfirmPopup>
                        <Button
                          v-tooltip.top="$t('button.delete')"
                          icon="pi pi-trash"
                          severity="danger"
                          variant="text"
                          class="p-0 m-0"
                          @click="confirm2(message._id, $event)"
                        />
                      </template>
                      <Button
                          v-if="!isMine(message.userId)"
                          v-tooltip.top="$t('button.reply')"
                          icon="pi pi-reply"
                          severity="warn"
                          variant="text"
                          class="p-0 m-0"
                          @click="setReplyTo(message)"
                      />
                    </div>
                  </div>
              </div>
            </template>
        </div>

        <!-- input + emoji -->
        <div class="flex  bg-lime-100 text-start text-sm text-gray-500 px-3 p-2 rounded-t-xl" v-if="replyMesssage">
          <div class="flex-auto">
              <div>
                <span class="font-medium">
                  {{ replyMesssage.username }}
                </span>
                <span>

                </span>
              </div>
              <div>
                {{ replyMesssage.message }}
              </div>

          </div>
          <Button
              icon="pi pi-trash"
              severity="danger"
              variant="text"
              class="p-0 m-0"
              @click="removeReplyTo()"
          />
        </div>
        <div class="flex gap-2 items-end">
          <Button icon="pi pi-face-smile" @click="showEmojiPicker = !showEmojiPicker" outlined />
          <div class="relative">
            <EmojiPicker
              v-if="showEmojiPicker"
              @select="addEmoji"
              class="absolute bottom-12 left-0 z-50"
            />
          </div>
          <div class="flex-auto flex items-center">

            <Textarea  v-model="newMessage" rows="1" autoResize  class="w-full"/>
          </div>
          <div class="flex gap-2">
              <Button icon="pi pi-send" aria-label="Filter" severity="success" @click="sendMessage" />
              <Button icon="pi pi-file-arrow-up" aria-label="Filter" severity="warn" />
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>
