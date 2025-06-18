<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { z } from 'zod';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import { Form } from '@primevue/forms';
  import Button from 'primevue/button';
  import type { FormSubmitEvent } from '@primevue/forms';

  // local types
  interface IEditItem {
    _id: number | string;
    name: string;
  }

  // props+emits

  interface Props {
    title: string;
    dialogVisible: boolean;
    data: IEditItem;
  }
  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'editData', data: IEditItem): void;
    (e: 'update:dialogVisible', value: boolean): void;
  }>();

  // state
  interface IFormData {
    name: string;
  }

  const initialValues = ref<IFormData>({
    name: '',
  });

  const resolver = ref(
    zodResolver(
      z.object({
        name: z
          .string()
          .min(1, { message: 'Name is required.' })
          .max(50, { message: 'Name must be less than 50 characters.' }),
      })
    )
  );

  const editLoading = ref<boolean>(false);

  // actions
  const onFormSubmit = ({ valid, values }: FormSubmitEvent<Record<string, any>>) => {
    if (!valid) return;
    editLoading.value = true;
    let data = {
      _id: props.data._id,
      name: values.name,
    };
    emit('editData', data);
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
        initialValues.value = props.data;
      } else {
        editLoading.value = false;
      }
    }
  );
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="modelValue" modal :header="props.title" :style="{ width: '25rem' }">
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="initialValues"
        class="flex w-full flex-col gap-4 sm:w-[350px]"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <InputText name="name" type="text" :placeholder="props.title" fluid />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}</Message>
        </div>
        <Button :loading="editLoading" type="submit" severity="secondary" label="Submit" />
      </Form>
    </Dialog>
  </div>
</template>
