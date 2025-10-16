<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useToastNotification } from '@/composables/useToastNotification';
  import { z } from 'zod';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import { Form } from '@primevue/forms';
  import type { FormSubmitEvent } from '@primevue/forms';
  import Button from 'primevue/button';
  import { useAuthStore } from '@/stores/authStore';
  import { useI18n } from 'vue-i18n'; // ✅ i18n

  type LoginFormValues = {
    email: string;
    password: string;
  };

  const { t, locale } = useI18n(); // ✅ t для перекладів
  const router = useRouter();
  const toastNotification = useToastNotification();
  const authStore = useAuthStore();

  const superAdminLogin = ref<boolean>(false);
  const loadingStatus = ref<boolean>(false);

  const initialValues = ref<LoginFormValues>({
    password: '',
    email: '',
  });

  const makeResolver = () =>
    zodResolver(
      z.object({
        password: z
          .string()
          .min(3, { message: t('validations.Minimum_3_characters') })
          .max(8, { message: t('validations.Maximum_8_characters') })
          .refine(value => /\d/.test(value), {
            message: t('validations.Must_have_a_number'),
          }),
        email: z
          .string()
          .min(1, { message: t('validations.Email_is_required') })
          .email({ message: t('validations.Invalid_email_address') }),
      })
    );

  const resolver = ref(makeResolver());
  watch(locale, () => {
    resolver.value = makeResolver();
  });

  const onFormSubmit = async ({ valid, values }: FormSubmitEvent<Record<string, any>>) => {
    if (!valid) return;

    loadingStatus.value = true;
    try {
      const { success, message, data } = await authStore.login(values.email, values.password, superAdminLogin.value);

      if (success) {
        toastNotification.showSuccess(message || t('notification.success'));
        localStorage.setItem('token', data.token || '');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toastNotification.showError(message || t('notification.error'));
      }
    } finally {
      loadingStatus.value = false;
    }
  };

  const titleByRole = computed((): string => {
    return superAdminLogin.value ? t('settings.Super_Admin') : t('settings.User');
  });

  const toggleLabel = computed((): string => {
    return superAdminLogin.value ? t('settings.User') : t('settings.Super_Admin');
  });
</script>

<template>
  <div
    class="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow-sm md:max-w-[1060px] md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
  >
    <img
      class="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-96 md:rounded-none md:rounded-s-lg"
      src="https://flowbite.com/docs/images/blog/image-4.jpg"
      alt=""
    />
    <div class="flex flex-col justify-between p-4 leading-normal">
      <Toast />
      <h3 class="mx-auto mb-2 text-2xl font-medium">{{ titleByRole }}</h3>

      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="initialValues"
        class="flex w-full flex-col gap-4 sm:w-[350px]"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <InputText name="email" type="text" :placeholder="t('fields.Email')" fluid />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <Password name="password" :placeholder="t('fields.Password')" :feedback="false" fluid toggleMask />
          <template v-if="$form.password?.invalid">
            <Message
              v-for="(error, index) of $form.password.errors"
              :key="index"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ error.message }}
            </Message>
          </template>
        </div>

        <Button type="submit" severity="secondary" :label="t('fields.Submit')" :loading="loadingStatus" />
      </Form>

      <Button
        :label="toggleLabel"
        variant="link"
        severity="secondary"
        class="text-black"
        @click="() => (superAdminLogin = !superAdminLogin)"
      />
    </div>
  </div>
</template>
