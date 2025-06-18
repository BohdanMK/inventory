<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useStocksStore } from '@/stores/stocksStore';
  import setFullImgPath from '@/helpers/fullPathImg';
  import Tag from 'primevue/tag';
  import DataView from 'primevue/dataview';
  import InputText from 'primevue/inputtext';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import Button from 'primevue/button';

  // props + emits
  interface Props {
    type?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'create',
  });

  /// state
  const deletePopUpVisible = ref<boolean>(false);
  const stocksStore = useStocksStore();
  const deletedItemId = ref<string | number | null>(null);

  // actions
  const toggleDeleteModal = (id: string | number | null) => {
    deletedItemId.value = id;
    deletePopUpVisible.value = !deletePopUpVisible.value;
  };

  const deleteItem = async (id: string | number): Promise<void> => {
    stocksStore.deleteLocalItem(id);
    toggleDeleteModal(null);
  };

  /// getters

  const statusOfTypeProps = computed((): boolean => {
    return props.type === 'create';
  });
</script>

<template>
  <div v-if="stocksStore.productListForCreateAction" class="card">
    <DeleteItemPopUp
      :id="deletedItemId"
      v-model:dialogVisible="deletePopUpVisible"
      title="Are you sure want delete this product from list?"
      @deleteItem="deleteItem"
    />
    <DataView :value="stocksStore.productListForCreateAction" dataKey="_id">
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
                      <div class="flex flex-col">
                        <label v-if="statusOfTypeProps">Avalible: {{ item.count }}</label>
                        <label class="font-medium"> Count: </label>
                      </div>
                      <InputText v-if="statusOfTypeProps" v-model="item.countNew" class="max-w-[70px] text-center" />
                      <span v-else>
                        {{ item.count }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex flex-col">
                        <label v-if="statusOfTypeProps">Price of supply: {{ item.price }}</label>
                        <label class="font-medium"> Price: </label>
                      </div>
                      <InputText v-if="statusOfTypeProps" v-model="item.priceNew" class="max-w-[70px] text-center" />
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
                  <div v-if="statusOfTypeProps" class="flex items-center gap-3">
                    Склад:
                    <span class="text-xl font-medium">{{ item.warehouse?.name || item.warehouse }}</span>
                  </div>
                  <div v-if="statusOfTypeProps" class="flex flex-row-reverse gap-2 md:flex-row">
                    <Button icon="pi pi-trash" severity="danger" @click="toggleDeleteModal(item._id)"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<style scoped></style>
