<template>
    <div class="fixed z-40 bottom-10 right-0">
        <div :style="{ position: 'relative', height: '350px' }">
            <SpeedDial
                :model="items"
                direction="up"
                :style="{ position: 'absolute', right: '20px', bottom: 0 }"
                :buttonProps="{ severity: 'help', rounded: true }"
                :tooltipOptions="{ position: 'left' }"
            >
                <template #button="{ toggleCallback }">
                    <Button variant="outlined" class="border" @click="toggleCallback">
                        <i class="pi pi-list" style="font-size: 2rem"></i>
                    </Button>
                </template>
            </SpeedDial>

            <Toast />
        </div>
    </div>
    <Suspense>
        <template #default>
            <ActionsBarChatItem />
        </template>
        <template #fallback>
            <div class="p-4 text-center">Loading chat...</div>
        </template>
    </Suspense>
</template>

<script setup ts>
import { ref, defineAsyncComponent } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useActionsStore } from '@/stores/actionsStore';
import SpeedDial from 'primevue/speeddial';
import { useI18n } from 'vue-i18n';
const ActionsBarChatItem = defineAsyncComponent(() => import('@/components/actions/ActionsBarChatItem.vue'));



// state
const toast = useToast();
const router = useRouter();
const { t } = useI18n();
const actionsStore = useActionsStore();

const items = ref([
    {
        label: t('chat.chat'),
        icon: 'pi pi-envelope',
        command: () => actionsStore.toggleChatActionsStatus()
    }
])
</script>
