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
                       <i class="pi pi-spin pi-cog" style="font-size: 2rem"></i>
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
const ActionsBarChatItem = defineAsyncComponent(() => import('@/components/actions/ActionsBarChatItem.vue'));

const toast = useToast();
const router = useRouter();

// state
const actionsStore = useActionsStore();

const items = ref([
    {
        label: 'Chat',
        icon: 'pi pi-pencil',
        command: () => actionsStore.toggleChatActionsStatus()
    },
    {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
            toast.add({ severity: 'success', summary: 'Update', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
            toast.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
        }
    },
    {
        label: 'Upload',
        icon: 'pi pi-upload',
        command: () => {
            router.push('/fileupload');
        }
    },
    {
        label: 'Vue Website',
        icon: 'pi pi-external-link',
        command: () => {
            window.location.href = 'https://vuejs.org/'
        }
    }
])
</script>
