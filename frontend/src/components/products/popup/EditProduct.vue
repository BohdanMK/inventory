<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { z } from 'zod';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { Form } from '@primevue/forms';
  import { useToast } from 'primevue/usetoast';
  import { useCategoryStore } from '@/stores/categoryStore';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { useStatusStore } from '@/stores/statusStore';
  import { useProductTemplateStore } from '@/stores/productTemplateStore';
  import type { DataFile } from '@/interfaces/index';
  import type { IProductTemplate } from '@/types/product/product';
  import type { FormSubmitEvent } from '@primevue/forms';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import FilesUploadItem from '@/components/files/FilesUploadItem.vue';
  import Select from 'primevue/select';

  //local types

  //props+ emits

  interface Props {
    dialogVisible: boolean;
    data: IProductTemplate;
  }

  const props = withDefaults(defineProps<Props>(), {
    dialogVisible: false,
  });

  const emit = defineEmits<{
    (e: 'update:dialogVisible', value: boolean): void;
    (e: 'updateProducts'): void;
  }>();

  // state
  const toast = useToast();
  const categoryStore = useCategoryStore();
  const statusStore = useStatusStore();
  const productTemplateStore = useProductTemplateStore();
  const localLoadingCreate = ref<boolean>(false);

  const initialValues = ref<IProductTemplate>({
    name: '',
    image: null,
    imagePath: null,
    category: '',
    status: '',
  });

  const resolver = ref(
    zodResolver(
      z.object({
        name: z
          .string()
          .min(1, { message: 'Name is required.' })
          .max(50, { message: 'Name must be less than 50 characters.' }),
        category: z.string().min(1, { message: 'Category is required.' }),
        status: z.string().min(1, { message: 'Status is required.' }),
      })
    )
  );

  // actions
  const getListCategory = async (): Promise<void> => {
    const { success, message, data } = await categoryStore.getCategoryList();
    if (success) {
      categoryStore.categoryList = data.data;
    } else {
      console.log(data, message);
    }
  };

  const getListStatuses = async (): Promise<void> => {
    const { success, message, data } = await statusStore.getStatusList();

    if (success) {
      statusStore.statusesList = data.data;
    } else {
      console.log(data, message);
    }
  };

  const onFormSubmit = async ({ valid, values }: FormSubmitEvent<Record<string, any>>) => {
    if (valid) {
      const payload = {
        _id: initialValues.value._id,
        ...values,
        image: initialValues.value.image,
        imagePath: initialValues.value.imagePath,
      };
      await updateProductTemplate(payload as IProductTemplate);
      console.log('SUBMIT PAYLOAD:', payload);
    }
  };

  const updateProductImg = async (data: DataFile) => {
    console.log(data);
    initialValues.value.image = data.fileName;
    initialValues.value.imagePath = data.filePath;
  };

  const updateProductTemplate = async (productData: IProductTemplate) => {
    localLoadingCreate.value = true;
    try {
      const { success, message } = await productTemplateStore.editProductTemplate(productData);

      if (success) {
        toast.add({ severity: 'success', detail: message, life: 3000 });
        emit('updateProducts');
        emit('update:dialogVisible', false);
      } else {
        toast.add({
          severity: 'error',
          summary: message,
          detail: message,
          life: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      localLoadingCreate.value = false;
    }
  };

  // getters
  const modelValue = computed({
    get: () => props.dialogVisible,
    set: (val: boolean) => emit('update:dialogVisible', val),
  });

  watch(
    () => props.dialogVisible,
    newVal => {
      if (newVal) {
        getListCategory();
        getListStatuses();
        initialValues.value = {
          ...props.data,
          category: typeof props.data.category === 'object' ? props.data.category._id : props.data.category,
          status: typeof props.data.status === 'object' ? props.data.status._id : props.data.status,
        };
      } else {
        console.log('Dialog closed');
      }
    }
  );
</script>

<template>
  <Dialog v-model:visible="modelValue" :style="{ width: '550px' }" header="Edit product" modal>
    <Form v-slot="$form" :initialValues :resolver class="grid w-full gap-4 lg:grid-cols-1" @submit="onFormSubmit">
      <div class="flex items-center justify-center gap-4">
        <div>
          <FilesUploadItem
            :saveBtn="false"
            :file="setFullImgPath(initialValues.imagePath as string)"
            @updateData="updateProductImg"
          />
          <input type="hidden" name="image" :value="initialValues.image ?? ''" />
          <input type="hidden" name="imagePath" :value="initialValues.imagePath ?? ''" />
          <Message v-if="$form.image?.invalid" severity="error" size="small" variant="simple">{{
            $form.image.error?.message
          }}</Message>
        </div>
        <div class="flex flex-col items-center justify-center gap-0">
          <div class="form-group relative pb-[20px] text-[14px]">
            <InputText name="name" type="text" placeholder="*Name" class="w-full sm:w-56" />
            <Message
              v-if="$form.name?.invalid"
              severity="error"
              class="absolute bottom-0 left-0 text-[red]"
              size="small"
              variant="simple"
              >{{ $form.name.error?.message }}</Message
            >
          </div>
          <div class="form-group relative pb-[20px]">
            <Select
              name="category"
              :options="categoryStore.categoryListForSelect"
              optionLabel="name"
              optionValue="code"
              placeholder="*Select a Category"
              class="w-full md:w-56"
            />
            <Message
              v-if="$form.category?.invalid"
              severity="error"
              class="absolute bottom-0 left-0 text-[14px] text-[red]"
              size="small"
              variant="simple"
              >{{ $form.category.error?.message }}</Message
            >
          </div>
          <div class="form-group relative pb-[20px]">
            <Select
              name="status"
              :options="statusStore.statusListForSelect"
              optionLabel="name"
              optionValue="code"
              placeholder="*Select a Status"
              class="w-full md:w-56"
            />
            <Message
              v-if="$form.status?.invalid"
              severity="error"
              class="absolute bottom-0 left-0 text-[14px] text-[red]"
              size="small"
              variant="simple"
              >{{ $form.status.error?.message }}</Message
            >
          </div>
          <Button
            :loading="localLoadingCreate"
            type="submit"
            severity="secondary"
            label="Submit"
            class="w-full sm:w-56"
          />
        </div>
      </div>
    </Form>
  </Dialog>
</template>

<style scoped></style>
