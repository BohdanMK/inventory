<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { z } from 'zod';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import { Form } from '@primevue/forms';
  import type { FormSubmitEvent } from '@primevue/forms';
  import { useI18n } from 'vue-i18n';

  // props+emits
  interface Props {
    title: string;
    dialogVisible: boolean;
  }
  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'createData', value: string): void;
    (e: 'update:dialogVisible', value: boolean): void;
  }>();

  // state
  interface IFormData {
    name: string;
  }

  const { t } = useI18n();
  const initialValues = ref<IFormData>({
    name: '',
  });

  const resolver = ref(
    zodResolver(
      z.object({
        name: z
          .string()
          .min(1, { message: t('validations.name_required') })
          .max(50, { message: t('validations.nameMaxLength', { max: 50 }) }),
      })
    )
  );

  const createLoading = ref<boolean>(false);

  // actions
  const onFormSubmit = ({ valid, values }: FormSubmitEvent<Record<string, any>>) => {
    if (!valid) return;
    createLoading.value = true;
    emit('createData', values.name);
  };

  // getters
  const modelValue = computed({
    get: () => props.dialogVisible,
    set: (val: boolean) => emit('update:dialogVisible', val),
  });

  /// hooks and watchers

  watch(
    () => props.dialogVisible,
    newVal => {
      if (newVal) {
      } else {
        createLoading.value = false;
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
        <Button :loading="createLoading" type="submit" severity="secondary" :label="$t('button.submit')" />
      </Form>
    </Dialog>
  </div>
</template>
