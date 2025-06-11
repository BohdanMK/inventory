<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import { Form } from '@primevue/forms';
  import { z } from 'zod';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useStocksStore } from '@/stores/stocksStore';
  import type { IProductInStock, ReplaceProduct } from '@/types/product/product';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import Dialog from 'primevue/dialog';
  import Select from 'primevue/select';
  import Textarea from 'primevue/textarea';
  import InputNumber from 'primevue/inputnumber';
  import Button from 'primevue/button';


  // props + emits

  interface Props {
    dataItem: IProductInStock;
    title: string;
    dialogVisible: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'updateData'): void;
    (e: 'update:dialogVisible', value: boolean): void;
  }>();
  /// state
  const toast = useToast();
  const formRef = ref()
  const warehouseStore = useWarehouseStore();
  const stoksStore = useStocksStore();
  const localLoading = ref<boolean>(false);

  const initialValues = ref({
    count: 0,
    warehouse: null,
    comment: '',
  });

  const resolver = zodResolver(
    z.object({
      count: z.number().gt(0, { message: 'Quantity must be greater than 0' }),
      warehouse: z.object({ name: z.string(), code: z.string() }),
      comment: z.string().optional(),
    })
  );

  //actions

  const closeModal = async () => {
    emit('update:dialogVisible', false);
  };

  const getWarehouseList = async (): Promise<void> => {
    if(warehouseStore.warehouseLength === 0) {

      const { success, message, data } = await warehouseStore.getWarehouseList();

      if (success) {
        warehouseStore.warehouseList = data.data;
      } else {
        console.log(data, message);
      }
    } else {
      console.log('2')
    }
  };

    const replaceProducts = async (id: string, dataItem: ReplaceProduct) => {
      localLoading.value = true;
      try {
        const { success, message, data } = await stoksStore.replaceProducts(id, dataItem);

        if (success) {
          toast.add({ severity: 'success', detail: message, life: 3000 });
          emit('updateData');
          emit('update:dialogVisible', false);
        } else {
          toast.add({
            severity: 'error',
            summary: 'Creating falled',
            detail: message,
            life: 3000,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        localLoading.value = false;
      }
  };

  const onSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
    if (!valid) return;

    const payload = {
      oldWarehouse: props.dataItem.warehouse?._id,
      ...values
    }
    console.log(payload)
    replaceProducts(props.dataItem._id as string, payload)
  };


  // getters
  const modelValue = computed({
    get: () => props.dialogVisible,
    set: (val: boolean) => emit('update:dialogVisible', val),
  });

  const getFillteredWhList = computed(() => {
    if(props.dataItem.warehouse?.name) {
      return warehouseStore.warehouseListForSelect.filter(item => item.name !== props.dataItem.warehouse?.name)
    } else {
      return warehouseStore.warehouseListForSelect
    }
  })


  // lifecycle hooks and watchers
  watch(
    () => props.dialogVisible,
    newVal => {
      if (newVal) {

        getWarehouseList();
      } else {
        localLoading.value = false;
      }
    }
  );
</script>

<template>
  <Toast/>
  <Dialog v-model:visible="modelValue" :style="{ width: '450px' }" :header="title" modal>
    <div class="relative">
      <div v-if="localLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
        <i class="pi pi-spinner pi-spin text-2xl" />
      </div>
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>Current warehouse:
          <span
            v-if="props.dataItem.warehouse"
            class="font-bold"
          >
            {{ props.dataItem.warehouse.name || '' }}
          </span>
        </span>
      </div>
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="initialValues"
        class="mt-0 mb-5 flex w-full flex-col gap-0"
        @submit="onSubmit"
        ref="formRef"
      >
        <div class="flex flex-col gap-1 relative  pb-[20px]">
              <Select
                name="warehouse"
                :options="getFillteredWhList"
                optionLabel="name"
                placeholder="*Select warehouse"
                class="w-full min-w-[230px]"
              />
              <Message class="absolute bottom-0 left-0 text-[14px] text-[red]" v-if="$form.warehouse?.invalid" severity="error" size="small" variant="simple">{{
                $form.warehouse.error?.message
              }}</Message>
        </div>
        <div class="flex flex-col gap-1 relative  pb-[20px]">
          Avalible product quantity: {{ props.dataItem.count }}
        </div>
        <div class="flex flex-col gap-1 relative  pb-[20px]">
            <InputNumber
              name="count"
              placeholder="*Quantity"
              :max="props.dataItem.count"
            />
            <Message class="absolute bottom-0 left-0 text-[14px] text-[red]" v-if="$form.count?.invalid" severity="error" size="small" variant="simple">{{
              $form.count.error?.message
            }}</Message>
        </div>
        <div class="mb-0 border-0 px-0 relative  pb-[20px]">
          <Textarea
            name="comment"
            placeholder="*Goods receipt info"
            class="w-full max-w-[400px]"
            rows="3"
            cols="30"
          />
          <Message class="absolute bottom-0 left-0 text-[14px] text-[red]" v-if="$form.comment?.invalid" severity="error" size="small" variant="simple">{{
            $form.comment.error?.message
          }}</Message>
        </div>
      </Form>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="closeModal()" />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        :loading="localLoading"
        @click="formRef?.submit()"
      />
    </template>
  </Dialog>
</template>
