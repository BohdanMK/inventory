<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { z } from 'zod';
  import { useI18n } from 'vue-i18n';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { Form } from '@primevue/forms';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import type { IWarehouse } from '@/types/warehouse/warehouse';
  import type { FormSubmitEvent } from '@primevue/forms';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';

  //local types

  //props+ emits

  interface Props {
    dialogVisible: boolean;
    data: IWarehouse;
  }

  const props = withDefaults(defineProps<Props>(), {
    dialogVisible: false,
  });

  const emit = defineEmits<{
    (e: 'update:dialogVisible', value: boolean): void;
    (e: 'updateList'): void;
  }>();

  // state
  const { t } = useI18n();
  const toast = useToast();

  const warehouseStore = useWarehouseStore();
  const localLoadingCreate = ref<boolean>(false);

  const initialValues = ref<IWarehouse>({
    name: '',
    address: null,
    contact: null,
    contact_person: null,
  });

  const resolver = ref(
    zodResolver(
      z.object({
        name: z
          .string()
          .min(1, { message: 'Name is required.' })
          .max(50, { message: 'Name must be less than 50 characters.' }),
        address: z.string().nullable().optional(),
        contact_person: z.string().nullable().optional(),
        contact: z.string().nullable().optional(),
      })
    )
  );

  // actions

  const onFormSubmit = async ({ valid, values }: FormSubmitEvent<Record<string, any>>) => {
    if (valid) {
      const payload = {
        _id: initialValues.value._id,
        ...values,
      };
      await updateProductTemplate(payload as IWarehouse);
      console.log('SUBMIT PAYLOAD:', payload);
    }
  };

  const updateProductTemplate = async (dataItem: IWarehouse) => {
    localLoadingCreate.value = true;
    try {
      const { success, message } = await warehouseStore.editWarehouse(dataItem);

      if (success) {
        toast.add({ severity: 'success', detail: message, life: 3000 });
        emit('updateList');
        emit('update:dialogVisible', false);
      } else {
        toast.add({
          severity: t('notification.error'),
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
        initialValues.value = {
          ...props.data,
        };
      } else {

      }
    }
  );
</script>

<template>
  <Dialog v-model:visible="modelValue" :style="{ width: '550px' }" header="Create warehouse" modal>
    <Toast />
    <Form v-slot="$form" :initialValues :resolver class="grid w-full gap-4 lg:grid-cols-1" @submit="onFormSubmit">
      <div class="flex items-center justify-center gap-4">
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
          <div class="form-group relative pb-[20px] text-[14px]">
            <InputText name="address" type="text":placeholder="$t('fields.address')" class="w-full sm:w-56" />
          </div>
          <div class="form-group relative pb-[20px] text-[14px]">
            <InputText name="contact_person" type="text" :placeholder="$t('fields.contact_person')" class="w-full sm:w-56" />
          </div>
          <div class="form-group relative pb-[20px] text-[14px]">
            <InputText name="contact" type="text" :placeholder="$t('fields.contact')" class="w-full sm:w-56" />
          </div>
          <Button
            :loading="localLoadingCreate"
            type="submit"
            severity="secondary"
            :label="$t('button.submit')"
            v-tooltip.top="$t('button.submit')"
            class="w-full sm:w-56"
          />
        </div>
      </div>
    </Form>
  </Dialog>
</template>

<style scoped></style>
