<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useToastNotification } from '@/composables/useToastNotification';
  import Toast from 'primevue/toast';
  import { z } from 'zod';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import { Form } from '@primevue/forms';
  import { useAuthStore } from '@/stores/authStore';
  import { useI18n } from 'vue-i18n';
  import type { FormSubmitEvent } from '@primevue/forms';

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
  const toastNotification = useToastNotification();
  const { t } = useI18n();

  const initialValues = ref({
    password: '',
    email: '',
  });

  const resolver = ref(
    zodResolver(
      z.object({
        password: z
          .string()
          .min(3, { message: t('validations.Minimum_3_characters') })
          .max(8, { message: t('validations.Maximum_8_characters') })
          .refine(value => /d/.test(value), {
            message: t('validations.Must_have_a_number'),
          }),
        email: z
          .string()
          .min(1, { message: t('validations.Email_is_required') })
          .email({ message: t('validations.Invalid_email_address') }),
      })
    )
  );

  // actions
  const onFormSubmit = async ({ valid, values }: FormSubmitEvent<Record<string, any>>) => {
    if (!valid) return;
    profileStore.loadingCreating = true;
    const { success, message } = await authStore.register(values.email, values.password, isSuperAdmin.value);

    if (success) {
      toastNotification.showSuccess(message || '');
      setTimeout(() => {
        profileStore.createSuperAdmin = false;
        profileStore.createUserPopUp = false;
        emit('updateData');
      }, 1000);
    } else {
      toastNotification.showError(message || '');
    }

    setTimeout(() => {
      profileStore.loadingCreating = false;
    }, 1000);
  };

  // getters

  const isSuperAdmin = computed(() => {
    return props.role === 'super_admin';
  });

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
    <Dialog v-model:visible="dialogVisible" modal :header="$t('user.Create_user')" :style="{ width: '25rem' }">
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues
        class="flex w-full flex-col gap-4 sm:w-[350px]"
        @submit="onFormSubmit"
      >
        {{ props.role }}
        <div class="flex flex-col gap-1">
          <InputText name="email" type="text" :placeholder="$t('fields.Email')" fluid />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
            $form.email.error?.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <Password name="password" :placeholder="$t('fields.Password')" :feedback="false" fluid toggleMask />
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
        <Button type="submit" severity="secondary" :placeholder="$t('fields.Submit')" />
      </Form>
    </Dialog>
  </div>
</template>
