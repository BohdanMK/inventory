<script setup lang="ts">
    import { useProductTemplateStore } from '@/stores/productTemplateStore';
    import setFullImgPath from '@/helpers/fullPathImg';
    import { formatDataWithTime } from '@/composables/formatDate.ts';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Paginator from 'primevue/paginator';


    // props + emits
    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

    // state
    const productTemplateStore = useProductTemplateStore();

    // actions

    const onPageChange = (event: any) => {
        productTemplateStore.currentPageProducts = event.page + 1;
        productTemplateStore.perPageProducts = event.rows;
        emit('updateData');
    };


</script>

<template>
    <DataTable
        :value="productTemplateStore.productTemplateList"
        dataKey="id"
        :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
    >
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column
            :header="$t('table.Image')">
            <template #body="slotProps">
                <img
                :src="setFullImgPath(slotProps.data.imagePath)"
                :alt="slotProps.data.image"
                class="rounded"
                style="width: 164px"
                />
            </template>
        </Column>
        <Column field="name"
            :header="$t('table.Name')"
            style="min-width: 16rem"></Column>

        <Column field="category"
            :header="$t('table.Category')" style="min-width: 10rem">
        <template #body="slotProps">
            <span>{{ slotProps.data.category.name }}</span>
        </template>
        </Column>
        <Column field="status"
            :header="$t('table.Status')"
            style="min-width: 10rem">
            <template #body="slotProps">
                <span>{{ slotProps.data.status.name }}</span>
            </template></Column
            >
        <Column field="createdAt"
            :header="$t('table.created_at')" style="min-width: 10rem">
            <template #body="slotProps">
                {{ formatDataWithTime(slotProps.data.createdAt) }}
            </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <slot name="actions" :data="slotProps.data" />
            </template>
            </Column>
            <template #empty>
            <div class="p-datatable-empty-message">{{ $t('default.no_data_available') }}</div>
        </template>
    </DataTable>
    <Paginator
        :rows="productTemplateStore.perPageProducts"
        :first="(productTemplateStore.currentPageProducts - 1) * productTemplateStore.perPageProducts"
        :totalRecords="productTemplateStore.totalProducts"
        :rowsPerPageOptions="[10, 20, 30]"
        @page="onPageChange"
    />
</template>

<style scoped>

</style>