<script setup lang="ts">
    import { computed, ref } from 'vue';
    import Popover from 'primevue/popover';
    import type { IMessageChat }  from '@/types/chat/chat.ts';
    import { useProfileStore } from '@/stores/userProfileStore';
    import { useChatStore } from '@/stores/chatStore';
    // props and emits
    interface IEmojiListProps {
        message: IMessageChat
    }

    const props = defineProps<IEmojiListProps>()

    // state
    const op = ref<InstanceType<typeof Popover> | null>(null);
    const activePopoverMessageId = ref<string | null>(null);
    const userProfile = useProfileStore();
    const chatStore = useChatStore();

    // actions
    const toggle = (event: Event) => {
        if(!op.value) return
        op.value.toggle(event);
    }

    const addEmojiToMessage = (emoji: any) => {
        if (!props.message._id || !userProfile.userProfile?._id) return;
        chatStore.handleSendReactedMessage(props.message._id, userProfile.userProfile?._id, emoji )
    };

    const removeEmoji = (emoji: any) => {
        if (!props.message._id || !userProfile.userProfile?._id) return;

        chatStore.handleRemoveReaction(props.message._id, userProfile.userProfile?._id, emoji )

    };

    // getters
    const visibleStatus = computed(() => {
        if(props.message.reactions) {
            return props.message.reactions?.length > 2
        } else {
            return false
        }
    })

    const reactionAdditionalLength = computed(() => {
        if(props.message.reactions) {
            return props.message.reactions?.length - 2
        } else {
            return 0
        }
    })
</script>

<template>
    <div class="flex absolute bottom-[-10px] left-[15px] cursor-pointer">
        <div v-for="(reaction, index) in message.reactions" :key="reaction.userId" @click="toggle">
            <div v-if="index < 2" :class="index > 0 ? 'ms-[-12px]' : ''">
            {{ reaction.emoji }}
            </div>
        </div>
        <div v-if="visibleStatus" class="bg-white p-0 pe-1 rounded-sm">
            +{{ reactionAdditionalLength }}
        </div>
        <Popover
            ref="op"
            class="p-3"
        >
            <div class="flex flex-col gap-2">
                <div v-for="reaction in message.reactions" :key="reaction.userId" class="flex items-center gap-2 pe-2 py-1">
                    <span>{{ reaction.emoji }}</span>
                    <div v-if="userProfile.userProfile.username !== reaction.username" class="flex gap-3 w-full justify-between items-center text-sm text-gray-500 ">{{ reaction.username }}
                        <button class="cursor-pointer" type="button" @click="addEmojiToMessage(reaction.emoji)">
                            <i class="pi pi-plus-circle" style="color: slateblue"></i>
                        </button>
                    </div>
                    <div v-else class="flex gap-3 w-full justify-between items-center text-sm text-gray-500">
                        You
                        <button class="cursor-pointer" type="button" @click="removeEmoji(reaction.emoji)">
                            <i class="pi pi-minus-circle" style="color: slateblue"></i>
                        </button>

                    </div>
                </div>
            </div>
        </Popover>

    </div>
</template>

<style scoped>

</style>