<script setup lang="ts">
    import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
    import Toolbar from 'primevue/toolbar';
    import GoodsReceiptFilter from '@/components/goodsReceipt/GoodsReceiptFilter.vue';
    import TotalResultItem from '@/components/ui/TotalResultItem.vue';

    //emits + props

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

    // state
    const goodsReceiptStore = useGoodsReceiptStore();

    // actions

    const updateData = () => {
        emit('updateData')
    };

    //getters

</script>

<template>
     <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="goodsReceiptStore.totalReceipts" />
          <GoodsReceiptFilter
            @updateData="updateData()"
          />
        </template>
        <template #end>
          <router-link to="/goods-receipt/add">
            <Button :label="$t('button.new')" icon="pi pi-plus" class="mr-2" />
          </router-link>
          <Button icon="pi pi-refresh" rounded raised :aria-label="$t('goodsReceiptList.refresh')" @click="updateData()" />
        </template>
      </Toolbar>
</template>
