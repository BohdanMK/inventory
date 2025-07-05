<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
  import setFullImgPath from '@/helpers/fullPathImg';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import Tag from 'primevue/tag';
  import DataView from 'primevue/dataview';
  import InputText from 'primevue/inputtext';

  // props + emits
  interface Props {
    type?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'create',
  });

  /// state
  const goodsReceiptStore = useGoodsReceiptStore();
  const deletePopUpVisible = ref<boolean>(false);

  const deletedItemId = ref<string | number | null>(null);

  // actions
  const toggleDeleteModal = (id: string | number | null) => {
    deletedItemId.value = id;
    deletePopUpVisible.value = !deletePopUpVisible.value;
  };

  const deleteItem = async (id: string | number): Promise<void> => {
    goodsReceiptStore.deleteLocalItem(id);
    toggleDeleteModal(null);
  };

  /// getters

  const statusOfTypeProps = computed((): boolean => {
    return props.type === 'create';
  });
</script>

<template>
  <div v-if="goodsReceiptStore.productList" class="card">
    <DeleteItemPopUp
      :id="deletedItemId"
      v-model:dialogVisible="deletePopUpVisible"
      :title="$t('product_list.Are_you_sure_want_delete_this_product')"
      @deleteItem="deleteItem"
    />
    <DataView :value="goodsReceiptStore.productList" dataKey="_id">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div
              class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
              :class="{
                'border-surface-200 dark:border-surface-700 border-t': index !== 0,
              }"
            >
              <!--image block-->
              <div class="relative md:w-40">
                <img
                  class="mx-auto block w-full rounded xl:block"
                  :src="setFullImgPath(item.imagePath)"
                  :alt="item.name"
                />
                <div class="rounded-border absolute bg-black/70" style="left: 4px; top: 4px">
                  <template v-if="item.status.name || item.status">
                    <Tag :value="item.status.name || item.status"></Tag>
                  </template>
                </div>
              </div>
              <!--image block end-->
              <div class="flex flex-1 flex-col justify-between gap-6 md:flex-row md:items-center">
                <div class="flex flex-row items-start justify-between gap-2 md:flex-col">
                  <div>
                    <span class="text-surface-500 dark:text-surface-400 text-sm font-medium">{{
                      item.category.name || item.category
                    }}</span>
                    <div class="mt-2 text-lg font-medium">{{ item.name }}</div>
                  </div>
                  <div class="flex gap-3">
                    <div class="flex items-center gap-2">
                      <label class="font-medium"> Count: </label>
                      <InputText v-if="statusOfTypeProps" v-model="item.count" class="max-w-[70px] text-center" />
                      <span v-else>
                        {{ item.count }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="font-medium"> Price: </label>
                      <InputText v-if="statusOfTypeProps" v-model="item.price" class="max-w-[70px] text-center" />
                      <span v-else>
                        {{ item.price }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 font-medium">
                      <label class="font-medium"> Total: </label>
                      <span> {{ (item.count * item.price).toFixed(1) }} грн </span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-8 md:items-end">
                  <span class="text-xl font-medium">{{ item.warehouse }}</span>
                  <div v-if="statusOfTypeProps" class="flex flex-row-reverse gap-2 md:flex-row">
                    <Button icon="pi pi-trash" severity="danger" @click="toggleDeleteModal(item._id)"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="p-datatable-empty-message">{{ $t('default.no_data_available') }}</div>
      </template>
    </DataView>
  </div>
</template>

<style scoped></style>
