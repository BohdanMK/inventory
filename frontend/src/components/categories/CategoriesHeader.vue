<script setup lang="ts">
    import { ref } from 'vue';
    import { useCategoryStore } from '@/stores/categoryStore';
    import { useToast } from 'primevue/usetoast';
    import { useI18n } from 'vue-i18n';
    import Toolbar from 'primevue/toolbar';
    import Toast from 'primevue/toast';
    import CreateItemPopUp from '@/components/popup/CreateItem.vue';
    import CategoriesFilter from '@/components/categories/CategoriesFilter.vue';
    import Button from 'primevue/button';
    import TotalResultItem from '@/components/ui/TotalResultItem.vue';

     //emits + props

    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

    // state
    const toast = useToast();
    const categoryStore = useCategoryStore();
    const createPopUpVisible = ref<boolean>(false);

    /// updateData

    const updateData = () => {
        emit('updateData')
    };

    // actions
    const togglePopUpVisible = (): void => {
        createPopUpVisible.value = !createPopUpVisible.value;
    };

    const createCategory = async (value: string): Promise<void> => {
        try {
        const { success, message } = await categoryStore.createCategory(value);

        if (success) {
            createPopUpVisible.value = false;
            updateData();
            toast.add({ severity: t('notification.success'), detail: message, life: 3000 });
        } else {
            toast.add({
            severity: t('notification.error'),
            summary: t('error.creating_falled'),
            detail: message,
            life: 3000,
            });
        }
        } catch (error) {
        console.log(error);
        }

        createPopUpVisible.value = false;
    };


</script>

<template>
    <Toast />
    <Toolbar class="mb-6">
        <template #start
        ><span>
            <div class="flex items-center gap-3">
                <TotalResultItem :total="categoryStore.totalCategories" />
                    <CategoriesFilter
                    @updateData="updateData()" />
                </div>
        </span
        ></template>
        <template #end>
            <CreateItemPopUp
                v-model:dialogVisible="createPopUpVisible"
                :title="$t('popup.create_category')"
                @createData="createCategory"
            />
            <Button
                :label="$t('button.new')"
                icon="pi pi-plus" class="mr-2"
                v-tooltip.top="$t('popup.create_category')"
                @click="togglePopUpVisible"
            />
            <Button
                icon="pi pi-refresh"
                v-tooltip.top="$t('button.refresh')"
                rounded raised
                @click="updateData()"
            />
        </template>
    </Toolbar>
</template>

<style scoped>

</style>