<script setup lang="ts">
import { ref, onUnmounted, onMounted, nextTick, computed, watch  } from 'vue';
import type { IMessageChat }  from '@/types/chat/chat.ts';
import EmojiPicker from 'vue3-emoji-picker'
import "vue3-emoji-picker/css";
import Drawer from 'primevue/drawer';
import Textarea from 'primevue/textarea';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from "primevue/useconfirm";
import { useActionsStore } from '@/stores/actionsStore';
import { useChatStore } from '@/stores/chatStore';
import { useLoadersStore } from "@/stores/loadersStore";
import { useProfileStore } from '@/stores/userProfileStore';
import setFullImgPath from '@/helpers/fullPathImg.ts';
import { formatDataWithTime } from '@/composables/formatDate.ts';
import { useUnreadMessages } from "@/composables/useUnreadMessages";
import { useFileUpload } from "@/composables/uploadFiles.ts";
import MessageFileViewer from '@/components/chat/MessageFileViewer.vue';
import EmojiList  from '@/components/chat/EmojiList.vue';
import ImgItem from '@/components/ui/ImgItem.vue';
import { useI18n } from 'vue-i18n';

/// state
const { t } = useI18n();
const actionsStore = useActionsStore();
const chatStore = useChatStore();
const userProfile = useProfileStore();
const loadersStore = useLoadersStore();
const confirm = useConfirm();
const newMessage = ref<string>("");
const showEmojiPicker = ref<boolean>(false);
const showMessageEmoji = ref<boolean>(false);
const isSending = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const baseClasses = 'mb-3 w-[80%] flex flex-col text-sm  items-start rounded-xl  relative z-1';
const replyMesssage = ref<IMessageChat | null>(null);
const messageEmojiPicker = ref<HTMLElement | null>(null);
const idMessage = ref<string | null>(null);
const { reset } = useUnreadMessages();
const fileInput = ref<HTMLInputElement | null>(null);
const { uploadFiles } = useFileUpload();
const messageToEdit = ref<IMessageChat | null>(null);

// for files
const files = ref<File[]>([]);
const previewUrls = ref<string[]>([]);

const toggleEmojiForMessage = (id: string) => {
  showMessageEmoji.value = !showMessageEmoji.value;
  idMessage.value = id;
}

const addEmojiToMessage = (emoji: any) => {
  if (!idMessage.value || !userProfile.userProfile?._id) return;

  chatStore.handleSendReactedMessage(idMessage.value, userProfile.userProfile?._id, emoji.i );
  showMessageEmoji.value = !showMessageEmoji.value

};

const addEmoji = (emoji: any) => {
  newMessage.value += emoji.i;
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  let fileUrls;

  if (files.value.length) {

    fileUrls = await uploadFiles(files.value);
  }
  console.log(fileUrls)

  const messageText = newMessage.value.trim();
  isSending.value = true;

  try {
    chatStore.sendMessage(messageText, userProfile.userProfile?._id || '', replyMesssage.value ? replyMesssage.value._id : null, fileUrls);

      newMessage.value = "";
      files.value = [];
      fileUrls = null;
      showEmojiPicker.value = false;
      previewUrls.value = [];
      scrollBottom();

  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    isSending.value = false;
    replyMesssage.value = null
  }
};

const editMessage = async () => {
  if (!messageToEdit.value || !messageToEdit.value.message) return;
  isSending.value = true;
  try {
    chatStore.editMessage(messageToEdit.value?._id,  userProfile.userProfile?._id || '', messageToEdit.value.message );
    removeEditMessage();

  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    isSending.value = false;
  }
}


const confirm2 = (messageId: string, event: Event) => {
    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: t('chat.do_you_want_to_delete_this_message'),
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: t('button.cancel'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: t('button.delete'),
            severity: 'danger'
        },
        accept: async () => {
          console.log(event);
          await  chatStore.deleteMessage(messageId, userProfile.userProfile?._id || '');
          removeEditMessage()
        },
        reject: () => {
        }
    });
};

const setReplyTo = (message: IMessageChat) => {
  replyMesssage.value = message;
};

const removeReplyTo = () => {
  replyMesssage.value = null;
};

const setEditMessage = (message: IMessageChat) => {
  messageToEdit.value = {...message};
};

const removeEditMessage = () => {
  messageToEdit.value = null;
};


const handleClickOutside = (event: MouseEvent) => {
  if (
    showMessageEmoji.value &&
    messageEmojiPicker.value &&
    !messageEmojiPicker.value.contains(event.target as Node)
  ) {
    showMessageEmoji.value = false;
  }
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    Array.from(target.files).forEach((file) => {
      files.value.push(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) previewUrls.value.push(e.target.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        previewUrls.value.push(file.name);
      }
    });

    target.value = '';
  };

  const removeFile = (index: number) => {
    files.value.splice(index, 1);
    previewUrls.value.splice(index, 1);
  };

  const triggerFileSelect = () => {
    fileInput.value?.click();
  };

  const scrollToMessage = (messageId: string) => {
    const el = document.getElementById(`message-${messageId}`);
    if (el && messagesContainer.value) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-yellow-100");
      setTimeout(() => el.classList.remove("bg-yellow-100"), 5000);
    }
  };

  const loadMoreMessages = () => {
    chatStore.loadMoreMessages();
  }

  const scrollTop = async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollBottom = async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({ top: messagesContainer.value.scrollHeight, behavior: "smooth" });
    }
  };

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

      document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    chatStore.stopChat();
    document.removeEventListener("click", handleClickOutside);
  });

  watch(() => actionsStore.chatActionsVisible, (newVal) => {
    if(newVal) {
      reset()
    }
  });

  watch(
    () => chatStore.messagesList.length,
      async () => {
        await nextTick();
        scrollBottom();
      }
  );
</script>

<template>
  <div>
    <Drawer
      v-model:visible="actionsStore.chatActionsVisible"
      position="right"
      :style="{ width: 500 + 'px' }"
    >
      <template #header>
        <div class="flex items-center w-full">
          <h3 class="text-xl font-semibold">
            {{ t('chat.chat') }} <span class="text-blue-500">{{ chatStore.messagesListLength }}</span>   {{ t('chat.messages') }}
          </h3>
          <Button
            icon="pi pi-sync"
            severity="info"
            variant="text"
            v-tooltip.top="$t('button.load_more')"
            :loading="loadersStore.loadMoreStatus"
            @click="loadMoreMessages()"
          />
          <Button
            icon="pi pi-arrow-up"
            severity="Warn"
            variant="text"
            v-tooltip.top="$t('button.scroll_top')"
            @click="scrollTop()"
          />
          <Button
            icon="pi pi-arrow-down"
            severity="info"
            variant="text"
            v-tooltip.top="$t('button.scroll_bottom')"
            @click="scrollBottom()"
          />
        </div>
      </template>
      <div class="h-[90vh] flex flex-col justify-between gap-0" ref="messageEmojiPicker">
        <EmojiPicker
          v-if="showMessageEmoji"
          class="absolute top-0 left-0 z-50"
          @select="addEmojiToMessage"
        />

        <!-- messages -->
        <div ref="messagesContainer" class="card border border-gray-300 p-3 rounded-md flex-1 overflow-y-auto mb-3">
            <template
              v-for="message in chatStore.messagesList"
              :key="message._id"
            >
              <div
                v-if="!message.deleted" :class="`${baseClasses} ${otherClasses(message.userId === userProfile.userProfile?._id)}`"
                :id="`message-${message._id}`"
                >
                <Button
                  v-tooltip.top="$t('button.reaction')"
                  severity="secondary"
                  variant="text"
                  class="p-0 m-0 absolute bottom-[-10px] left-[10px]"
                  @click="toggleEmojiForMessage(message._id)"
                >
                  <i class="pi pi-face-smile" style="color: slateblue"></i>
                </Button>
                  <div class="w-full flex gap-2 bg-sky-100 p-3 rounded-t-xl" v-if="message.files && message.files.length > 0">

                    <MessageFileViewer
                    v-for="file in message.files" :key="file.fileName"
                      :file="file"
                    />
                  </div>
                  <div
                    v-if="message.replyTo"
                    class="w-full flex p-1 bg-amber-50 px-2"
                  >
                    <div class="flex flex-col flex-auto">
                      <h3 class="font-medium">
                        {{ message.replyTo.username }}
                      </h3>
                      <h4>
                        {{ message.replyTo.message }}
                      </h4>
                    </div>
                    <button
                      class="cursor-pointer"
                      @click="scrollToMessage(message.replyTo._id)">
                      <font-awesome-icon icon="fa-solid fa-reply" />
                    </button>
                  </div>
                  <div class="w-full px-3 py-3">
                    <div class="flex gap-3 items-center">
                      <div class="flex-shrink-0 flex flex-col">
                        <ImgItem
                          v-if="message.avatar"
                          :src="setFullImgPath(message.avatar)"
                          :alt="message.username"
                          class="w-8 h-8 rounded-full object-cover"
                          />
                        <i v-else class="pi pi-user-minus mx-auto text-2xl"></i>
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
                      <div class="flex gap-0.5" v-if="!message.deleted">


                        <template v-if="isMine(message.userId)">
                          <Button
                            v-tooltip.top="$t('button.edit')"
                            icon="pi pi-pencil"
                            severity="warn"
                            variant="text"
                            class="w-[20px] p-0 m-0"
                            @click="setEditMessage(message)"
                          />
                          <ConfirmPopup></ConfirmPopup>
                          <Button
                            v-tooltip.top="$t('button.delete')"
                            icon="pi pi-trash"
                            severity="danger"
                            variant="text"
                            class="w-[20px] p-0 m-0"
                            @click="confirm2(message._id, $event)"
                          />
                        </template>
                        <Button
                            v-if="!isMine(message.userId)"
                            v-tooltip.top="$t('button.reply')"
                            icon="pi pi-reply"
                            severity="warn"
                            variant="text"
                            class="w-[20px] p-0 m-0"
                            @click="setReplyTo(message)"
                        />

                      </div>
                    </div>
                    <div class="w-full text-end text-[10px] leading-none">{{ formatDataWithTime(message.timestamp) }}</div>
                  </div>

                  <EmojiList
                    :message="message"
                  />
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
              icon="pi pi-times"
              severity="danger"
              variant="text"
              class="w-[20px] p-0 m-0"
              @click="removeReplyTo()"
          />
        </div>
        <div v-if="previewUrls.length" class="flex gap-2 mb-2 flex-wrap">
          <div v-for="(url, i) in previewUrls" :key="i" class="relative">
            <img v-if="url.startsWith('data:image/')" :src="url" class="w-20 h-20 object-cover rounded-md" />
            <div v-else class="w-20 h-20 flex items-center justify-center border rounded-md overflow-hidden">
              <div>
                {{ url }}
              </div>
            </div>
            <Button icon="pi pi-times" severity="danger" class="absolute top-0 right-0 p-1" @click="removeFile(i)" />
        </div>
        </div>
        <div class="flex gap-2 items-end">

          <!--edits message fields-->
          <template v-if="messageToEdit">
            <div class="flex-auto flex items-center" >
              <Textarea  v-model="messageToEdit.message" rows="1" autoResize  class="w-full"/>
            </div>
            <div class="flex gap-2">
                <Button icon="pi pi-check" aria-label="Filter" severity="success" @click="editMessage" />
                <Button icon="pi pi-times" aria-label="Filter" severity="danger" @click="removeEditMessage" />
            </div>
          </template>
          <!--new message fields-->
          <template v-else>
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

                <label class="cursor-pointer">
                  <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileChange" />
                  <Button icon="pi pi-file-arrow-up" severity="warn" @click="triggerFileSelect"/>
                </label>
            </div>
          </template>
        </div>
      </div>
    </Drawer>
  </div>
</template>
