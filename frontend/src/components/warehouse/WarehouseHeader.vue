<script setup lang="ts">
    import { ref } from 'vue';
    import { useWarehouseStore } from '@/stores/warehouseStore';
    import Toolbar from 'primevue/toolbar';
    import Toast from 'primevue/toast';
    import AddWarehouseItemPopUp from '@/components/warehouse/popup/AddWarehouseItem.vue';
    import Button from 'primevue/button';
    import TotalResultItem from '@/components/ui/TotalResultItem.vue';

     //emits + props

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

    // state
    const warehouseStore = useWarehouseStore();
    const createPopUpVisible = ref<boolean>(false);

    /// updateData

    const updateData = () => {
        emit('updateData')
    };

    // actions
    const togglePopUpVisible = (): void => {
        createPopUpVisible.value = !createPopUpVisible.value;
    };

</script>

<template>
    <Toast />
    <Toolbar class="mb-6">
        <template #start>
            <TotalResultItem :total="warehouseStore.totalWarehouses" />
            <AddWarehouseItemPopUp v-model:dialogVisible="createPopUpVisible" title="Create category" @updateList="updateData()" />
        </template>
        <template #end>
        <Button
            :label="$t('button.new')"
            icon="pi pi-plus" class="mr-2"
            v-tooltip.top="$t('popup.create_warehouse')"
            @click="togglePopUpVisible" />
        <Button
            icon="pi pi-refresh" rounded raised
            v-tooltip.top="$t('button.refresh')"
            @click="updateData()" />
        </template>
    </Toolbar>
</template>

<style scoped>

</style>