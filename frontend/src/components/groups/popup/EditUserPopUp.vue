<script setup lang="ts">
  import { watch, ref, onMounted } from 'vue';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { z } from 'zod';
  import { Form } from '@primevue/forms';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Select from 'primevue/select';
  import Message from 'primevue/message';

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
  const toast = useToast();

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
        email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
        username: z.string().min(1, { message: 'Username is required.' }),
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
      toast.add({ severity: 'success', detail: message, life: 3000 });

      setTimeout(() => {
        visible.value = false;
        emit('updateData');
      }, 10);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Update failed',
        detail: message,
        life: 3000,
      });
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
    <Dialog v-model:visible="visible" modal header="Edit user" :style="{ width: '25rem' }">
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initial-values="initialValues"
        class="flex w-full flex-col gap-4 sm:w-[350px]"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <InputText name="email" type="text" placeholder="Email" />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <InputText name="username" type="text" placeholder="Username" />
          <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
            {{ $form.username.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <Select name="role" :options="roles" optionLabel="name" placeholder="Select role" class="w-full" />
        </div>

        <Button type="submit" severity="secondary" label="Submit" :loading="profileStore.loadingCreating" />
      </Form>
    </Dialog>
  </div>
</template>
