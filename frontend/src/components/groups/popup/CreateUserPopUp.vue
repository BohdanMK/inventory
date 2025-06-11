<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { set, z } from 'zod';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import { Form } from '@primevue/forms';
  import Button from 'primevue/button';
  import Select from 'primevue/select';
  import { useAuthStore } from '@/stores/authStore';

  // props+emits
  interface Props {
    role: string;
  }
  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  const toast = useToast();

  const initialValues = ref({
    password: '',
    email: '',
  });

  const resolver = ref(
    zodResolver(
      z.object({
        password: z
          .string()
          .min(3, { message: 'Minimum 3 characters.' })
          .max(8, { message: 'Maximum 8 characters.' })
          .refine(value => /d/.test(value), {
            message: 'Must have a number.',
          }),
        email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
      })
    )
  );

  // actions
  const onFormSubmit = async ({ valid, values }) => {
    if (!valid) return;
    profileStore.loadingCreating = true;
    const { success, message, data } = await authStore.register(values.email, values.password, isSuperAdmin.value);
    console.log(message);
    if (success) {
      toast.add({ severity: 'success', detail: message, life: 3000 });

      setTimeout(() => {
        profileStore.createSuperAdmin = false;
        profileStore.createUserPopUp = false;
        emit('updateData');
      }, 1000);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Creating falled',
        detail: message,
        life: 3000,
      });
    }

    setTimeout(() => {
      profileStore.loadingCreating = false;
    }, 1000);
  };

  // getters

  const isSuperAdmin = computed(() => {
    return props.role === 'super_admin';
  });

  // обгортаємо видимість у computed із setter/getter
  const dialogVisible = computed<boolean>({
    get() {
      return props.role === 'super_admin' ? profileStore.createSuperAdmin : profileStore.createUserPopUp;
    },
    set(val: boolean) {
      if (props.role === 'super_admin') {
        profileStore.createSuperAdmin = val;
      } else {
        profileStore.createUserPopUp = val;
      }
    },
  });
</script>

<template>
  <div class="card flex justify-center">
    <Toast />
    <Dialog v-model:visible="dialogVisible" modal header="Create user" :style="{ width: '25rem' }">
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues
        class="flex w-full flex-col gap-4 sm:w-[350px]"
        @submit="onFormSubmit"
      >
        {{ props.role }}
        <div class="flex flex-col gap-1">
          <InputText name="email" type="text" placeholder="Email" fluid />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
            $form.email.error?.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <Password name="password" placeholder="Password" :feedback="false" fluid toggleMask />
          <template v-if="$form.password?.invalid">
            <Message
              v-for="(error, index) of $form.password.errors"
              :key="index"
              severity="error"
              size="small"
              variant="simple"
              >{{ error.message }}</Message
            >
          </template>
        </div>
        <Button type="submit" severity="secondary" label="Submit" />
      </Form>
    </Dialog>
  </div>
</template>
