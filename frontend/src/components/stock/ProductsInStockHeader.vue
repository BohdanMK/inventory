<script setup lang="ts">
  import { useStocksStore } from '@/stores/stocksStore';
  import { useAsyncState } from '@/composables/useAsyncState';
  import Toolbar from 'primevue/toolbar';
  import ProductsInStockFilter from '@/components/stock/ProductsInStockFilter.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

    //emits + props

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

  // state
  const asyncState = useAsyncState();
  const stoksStore = useStocksStore();

  // actions

const updateData = () => {
    emit('updateData')
};

  //getters

  //watch and hooks

</script>

<template>
    <div>
        <Toolbar class="mb-6">
            <template #start>
                <TotalResultItem :total="stoksStore.totalProducts" />
                <ProductsInStockFilter :loadingStatus="asyncState.loadingStatus.value" @updateData="updateData()" />
            </template>
            <template #end>
                <router-link to="/stock-activity/add">
                    <Button label="New group action" icon="pi pi-plus" class="mr-2" />
                </router-link>
                <Button icon="pi pi-refresh" rounded raised @click="updateData()" />
            </template>
        </Toolbar>
    </div>
</template>
