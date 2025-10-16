<script setup lang="ts">
  import { watch, ref, onMounted } from 'vue';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { z } from 'zod';
  import { Form } from '@primevue/forms';
  import Toast from 'primevue/toast';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';
  import Message from 'primevue/message';
  import { useI18n } from 'vue-i18n';
  import { useToastNotification } from '@/composables/useToastNotification';
  import { useProfileStore } from '@/stores/userProfileStore';

  // Props + Emits
  interface Props {
    id: string;
    data: {
      id: string;
      email: string;
      role: string;
      username: string;
    };
  }
  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // State
  const visible = ref<boolean>(false);
  const profileStore = useProfileStore();
  const { t } = useI18n();
  const toastNotification = useToastNotification();

  const roles = ref([
    { name: 'Super Admin', code: 'super_admin' },
    { name: 'User', code: 'user' },
  ]);

  const initialValues = ref({
    email: '',
    username: '',
    role: null as { name: string; code: string } | null,
  });

  const resolver = ref(
    zodResolver(
      z.object({
        email: z
          .string()
          .min(1, { message: t('validations.Email_is_required') })
          .email({ message: t('validations.Invalid_email_address') }),
        username: z.string().min(1, { message: t('validations.Username_is_required') }),
        role: z.object({
          name: z.string(),
          code: z.string(),
        }),
      })
    )
  );

  // Actions
  const onFormSubmit = async ({ valid, values }: any) => {
    if (!valid) return;

    profileStore.loadingCreating = true;

    const { success, message } = await profileStore.updateUser(props.id, {
      email: values.email,
      username: values.username,
      role: values.role.code,
    });

    if (success) {
      toastNotification.showSuccess(message || '');

      setTimeout(() => {
        visible.value = false;
        emit('updateData');
      }, 10);
    } else {
      toastNotification.showError(message || '');
    }

    profileStore.loadingCreating = false;
  };

  // Hooks
  onMounted(() => {
    const selectedRole = roles.value.find(r => r.code === props.data.role) || null;

    initialValues.value = {
      email: props.data.email || '',
      username: props.data.username || '',
      role: selectedRole,
    };
  });
  watch(
    () => [props.data.email, props.data.username, props.data.role],
    ([email, username, role]) => {
      const selectedRole = roles.value.find(r => r.code === role) || null;
      initialValues.value = {
        email: email || '',
        username: username || '',
        role: selectedRole,
      };
    }
  );
</script>

<template>
  <div class="inline">
    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="visible = !visible" />
    <Toast />
    <Dialog v-model:visible="visible" modal :header="$t('user.Edit_user')" :style="{ width: '25rem' }">
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initial-values="initialValues"
        class="flex w-full flex-col gap-4 sm:w-[350px]"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <InputText name="email" type="text" :placeholder="$t('fields.Email')" />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <InputText name="username" type="text" :placeholder="$t('fields.Username')" />
          <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
            {{ $form.username.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <Select
            name="role"
            :options="roles"
            optionLabel="name"
            :placeholder="$t('fields.Select_role')"
            class="w-full"
          />
        </div>

        <Button
          type="submit"
          severity="secondary"
          :label="$t('button.submit')"
          :loading="profileStore.loadingCreating"
        />
      </Form>
    </Dialog>
  </div>
</template>
