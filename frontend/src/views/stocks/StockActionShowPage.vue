<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import Toast from 'primevue/toast';
  import { useRouter, useRoute } from 'vue-router';
  import { useStocksStore } from '@/stores/stocksStore';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import Skeleton from 'primevue/skeleton';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import ProductList from '@/components/stock/ProductList.vue';
  import Textarea from 'primevue/textarea';
  import FilesDownLoader from '@/components/files/FilesDownLoader.vue';


  ///state

  const stocksStore = useStocksStore();
  const router = useRouter();
  const route = useRoute();
  const localPageLoading = ref<boolean>(false);

  // actions

  const fetchStockAction = async () => {
    try {
      localPageLoading.value = true;
      const { success, message, data } =
        await stocksStore.getStockAction(id.value);

      if (!success) {
        console.error('Failed to fetch profile:', message);
      } else {
        stocksStore.stockAction = data;
        console.log(data.products)
        stocksStore.productListForCreateAction = data.products;
      }
    } catch (error) {
      console.log(error);
    } finally {
      localPageLoading.value = false;
    }
  };

  const moveBack = (): void => {
    router.push({ name: 'StockActivity' });
  };

  /// getters
  const id = computed(() => route.params.id as string);

  onMounted(() => {
    fetchStockAction();
  });
</script>

<template>
  <div>
    <Toast />
    <Skeleton v-if="localPageLoading" class="!h-[60vh] w-full" />
    <div v-else class="card">
      <div class="mt-0 mb-5 flex w-full flex-col gap-4">
        <Toolbar class="mb-6">
          <template #start>
            <h3 class="text-xl font-medium">Goods receipt info</h3>
          </template>
          <template #end>
            <Button
              type="submit"
              label="Back"
              icon="pi pi-arrow-left"
              class="mr-2"
              @click="moveBack()"
            />
          </template>
        </Toolbar>
        <Toolbar class="mb-0 border-0 px-0">
          <template #start>
            <div class="flex gap-1">
              <h3 class="text-xl font-medium">
                {{ stocksStore.stockAction.typeAction }}
                from
                {{ formatDataWithTime(stocksStore.stockAction.createdAt) }}
              </h3>
            </div>
          </template>
          <template #end>
            <div class="flex items-center gap-1">
              <h3 class="text-xl font-medium">
                Cклад: {{ stocksStore.stockAction.warehouse?.name }}
              </h3>
            </div>
          </template>
        </Toolbar>
        <div
            v-if="stocksStore.stockAction.comment"
          class="flex  justify-between mb-0 border-0 px-0"
        >
          <Textarea
            :value="stocksStore.stockAction.comment"
            name="comment"
            placeholder="Goods receipt info"
            class="w-full max-w-[400px]"
            rows="3"
            cols="30"
            readonly
          />
          <div>
            <FilesDownLoader
              :file="stocksStore.stockAction.fileName"
              :filePath="stocksStore.stockAction.filePath"
            />

          </div>
        </div>
      </div>
      <ProductList type="show" />
    </div>
  </div>
</template>

<style scoped>
</style>
