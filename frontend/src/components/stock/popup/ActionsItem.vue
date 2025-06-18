<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Form } from '@primevue/forms';
  import type { DataFile } from '@/interfaces/index';
  import { z } from 'zod';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useProfileStore } from '@/stores/userProfileStore';
  import type { IProductInStock } from '@/types/product/product';
  import type { StoсksActionsType } from '@/constants/constants';
  import type { IActionData } from '@/types/index';
  import Dialog from 'primevue/dialog';
  import Textarea from 'primevue/textarea';
  import InputNumber from 'primevue/inputnumber';
  import Button from 'primevue/button';
  import FilesUploadItem from '@/components/files/FilesUploadItem.vue';

  // props + emits

  interface Props {
    title?: string;
    dialogVisible: boolean;
    typeAction: StoсksActionsType;
    dataItem: IProductInStock;
  }

  const props = withDefaults(defineProps<Props>(), {
    dialogVisible: false,
    title: 'Action',
  });

  const emit = defineEmits<{
    (e: 'update:dialogVisible', value: boolean): void;
    (e: 'saveAction', data: IActionData): void;
  }>();
  /// state
  const formRef = ref();
  const profile = useProfileStore();
  const localLoading = ref<boolean>(false);

  const dataFile = ref<DataFile>({
    fileName: '',
    filePath: '',
  });

  const statusCancelOfType = computed((): boolean => {
    return props.typeAction === 'CANCEL';
  });

  const initialValues = ref({
    count: 0,
    price: 0,
    comment: '',
  });

  const resolver = zodResolver(
    z.object({
      price: z.number().gt(0, { message: 'Price must be greater than 0' }),
      count: z.number().gt(0, { message: 'Quantity must be greater than 0' }),
      comment: z.string().min(15, { message: 'Comment must be at least 15 characters long' }),
    })
  );

  //actions

  const closeModal = async () => {
    emit('update:dialogVisible', false);
  };

  const updateFile = async (data: DataFile) => {
    console.log(data);
    dataFile.value.fileName = data.fileName;
    dataFile.value.filePath = data.filePath;
  };

  const onSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
    if (!valid) return;
    console.log(values);
    let product = {
      product: props.dataItem._id ?? '',
      count: props.typeAction === 'CANCEL' ? props.dataItem.count : values.count,
      price: props.typeAction === 'CANCEL' ? props.dataItem.price : values.price || 0,
    };
    let payloadData: IActionData = {
      typeAction: props.typeAction,
      warehouse: props.dataItem.warehouse?._id ?? '',
      products: [product],
      comment: values.comment,
      fileName: dataFile.value.fileName ?? '',
      filePath: dataFile.value.filePath ?? '',
      user: profile.userProfile?._id,
    };
    emit('saveAction', payloadData);
    emit('update:dialogVisible', false);
  };

  // getters
  const modelValue = computed({
    get: () => props.dialogVisible,
    set: (val: boolean) => emit('update:dialogVisible', val),
  });

  // lifecycle hooks and watchers
  watch(
    () => props.dialogVisible,
    newVal => {
      if (newVal) {
      } else {
        localLoading.value = false;
      }
    }
  );
</script>

<template>
  <Dialog v-model:visible="modelValue" :style="{ width: '450px' }" :header="`${title} ${typeAction} `" modal>
    <div class="relative">
      <div v-if="localLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
        <i class="pi pi-spinner pi-spin text-2xl" />
      </div>

      <Form
        v-slot="$form"
        ref="formRef"
        :resolver="resolver"
        :initialValues="initialValues"
        class="mt-0 mb-5 flex w-full flex-col gap-0"
        @submit="onSubmit"
      >
        <div v-if="statusCancelOfType" class="mb-3">
          Cancel this product - <b> {{ props.dataItem.name }} </b> existing in warehouse -
          <b> {{ props.dataItem.warehouse?.name }} </b>
        </div>

        <div class="relative flex flex-col gap-1 pb-[20px] font-medium">
          {{ props.dataItem.goodsReceiptName }}
        </div>
        <div class="relative flex flex-col gap-1 pb-[20px]">Avalible product quantity: {{ props.dataItem.count }}</div>
        <div class="relative flex flex-col gap-1 pb-[20px]">
          <InputNumber name="price" placeholder="*Price" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" />
          <Message
            v-if="$form.count?.invalid"
            class="absolute bottom-0 left-0 text-[14px] text-[red]"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.price.error?.message }}</Message
          >
        </div>
        <div v-if="!statusCancelOfType" class="relative flex flex-col gap-1 pb-[20px]">
          <InputNumber name="count" placeholder="*Quantity" :max="props.dataItem.count" />
          <Message
            v-if="$form.count?.invalid"
            class="absolute bottom-0 left-0 text-[14px] text-[red]"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.count.error?.message }}</Message
          >
        </div>
        <div class="relative mb-0 border-0 px-0 pb-[20px]">
          <Textarea name="comment" placeholder="*Comment of menagare" class="w-full max-w-[400px]" rows="3" cols="30" />
          <Message
            v-if="$form.comment?.invalid"
            class="absolute bottom-0 left-0 text-[14px] text-[red]"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.comment.error?.message }}</Message
          >
        </div>
        <div>
          <FilesUploadItem
            :saveBtn="true"
            acceptType=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
            justFile
            @updateData="updateFile"
          />
        </div>
      </Form>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="closeModal()" />
      <Button label="Yes" icon="pi pi-check" text :loading="localLoading" @click="formRef?.submit()" />
    </template>
  </Dialog>
</template>
