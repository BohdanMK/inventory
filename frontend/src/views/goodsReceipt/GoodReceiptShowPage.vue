<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import Toast from 'primevue/toast';
  import { useRouter, useRoute } from 'vue-router';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
  import Skeleton from 'primevue/skeleton';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import ProductList from '@/components/goodsReceipt/ProductList.vue';
  import Textarea from 'primevue/textarea';
  import BreadcrumbItem from '@/components/ui/BreadcrumbItem.vue';

  ///state

  const goodsReceiptStore = useGoodsReceiptStore();
  const router = useRouter();
  const route = useRoute();
  const localPageLoading = ref<boolean>(false);

  // actions

  const fetchGoodsReceipt = async () => {
    try {
      localPageLoading.value = true;
      const { success, message, data } = await goodsReceiptStore.getGoodsReceipt(id.value);

      if (!success) {
        console.error('Failed to fetch profile:', message);
      } else {
        goodsReceiptStore.goodsReceipt = data;
        goodsReceiptStore.productList = data.products;
      }
    } catch (error) {
      console.log(error);
    } finally {
      localPageLoading.value = false;
    }
  };

  const moveBack = (): void => {
    router.push({ name: 'GoodsReceipt' });
  };

  /// getters
  const id = computed(() => route.params.id as string);

  onMounted(() => {
    fetchGoodsReceipt();
  });
</script>

<template>
  <div>
    <BreadcrumbItem />
    <Toast />
    <Skeleton v-if="localPageLoading" class="!h-[60vh] w-full" />
    <div v-else class="card">
      <div class="mt-0 mb-5 flex w-full flex-col gap-4">
        <Toolbar class="mb-6">
          <template #start>
            <h3 class="text-xl font-medium">{{ $t('goodsReceipt.goods_receipt_info') }}</h3>
          </template>
          <template #end>
            <Button type="submit" label="Back" icon="pi pi-arrow-left" class="mr-2" @click="moveBack()" />
          </template>
        </Toolbar>
        <Toolbar class="mb-0 border-0 px-0">
          <template #start>
            <div class="flex gap-1">
              <h3 class="text-xl font-medium">
                {{ goodsReceiptStore.goodsReceipt.name }}
              </h3>
            </div>
          </template>
          <template #end>
            <div class="flex items-center gap-1">
              <h3 class="text-xl font-medium">Cклад: {{ goodsReceiptStore.goodsReceipt.warehouse?.name }}</h3>
            </div>
          </template>
        </Toolbar>
        <div v-if="goodsReceiptStore.goodsReceipt.comment" class="mb-0 border-0 px-0">
          <Textarea
            :value="goodsReceiptStore.goodsReceipt.comment"
            name="comment"
            placeholder="Goods receipt info"
            class="w-full max-w-[400px]"
            rows="3"
            cols="30"
            readonly
          />
        </div>
      </div>
      <ProductList type="show" />
    </div>
  </div>
</template>

<style scoped></style>
