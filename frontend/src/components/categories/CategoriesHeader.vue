<script setup lang="ts">
    import { ref } from 'vue';
    import { useCategoryStore } from '@/stores/categoryStore';
    import { useToastNotification } from '@/composables/useToastNotification';
    import Toolbar from 'primevue/toolbar';
    import CreateItemPopUp from '@/components/popup/CreateItem.vue';
    import CategoriesFilter from '@/components/categories/CategoriesFilter.vue';
    import TotalResultItem from '@/components/ui/TotalResultItem.vue';

     //emits + props

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

    // state
    const toastNotification = useToastNotification();
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
            toastNotification.showSuccess(message || '');
        } else {
            toastNotification.showError(message || '');
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