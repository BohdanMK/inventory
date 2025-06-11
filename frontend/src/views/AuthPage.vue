<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { set, z } from 'zod';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import { Form } from '@primevue/forms';
  import Button from 'primevue/button';
  import { useAuthStore } from '@/stores/authStore';

  const router = useRouter();
  const toast = useToast();
  const authStore = useAuthStore();

  const superAdminLogin = ref<boolean>(false);
  const loadingStatus = ref<boolean>(false);

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
        email: z
          .string()
          .min(1, { message: 'Email is required.' })
          .email({ message: 'Invalid email address.' }),
      })
    )
  );

  const onFormSubmit = async ({ valid, values }) => {
    if (!valid) return;

    const { success, message, data } = await authStore.login(
      values.email,
      values.password,
      superAdminLogin.value
    );
    console.log(success);
    if (success) {
      toast.add({ severity: 'success', summary: message, life: 3000 });
      localStorage.setItem('token', data.token);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Login failed',
        detail: message,
        life: 3000,
      });
    }
  };

  // getters
  const textForSuperAdmin = computed((): string => {
    return superAdminLogin.value
      ? 'Login like Super Admin.'
      : 'Login like User.';
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
      <h3 class="mx-auto mb-2 text-2xl font-medium">{{ textForSuperAdmin }}</h3>
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues
        class="flex w-full flex-col gap-4 sm:w-[350px]"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <InputText name="email" type="text" placeholder="Email" fluid />
          <Message
            v-if="$form.email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.email.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1">
          <Password
            name="password"
            placeholder="Password"
            :feedback="false"
            fluid
            toggleMask
          />
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
        <Button
          type="submit"
          severity="secondary"
          label="Submit"
          :loading="loadingStatus"
        />
      </Form>
      <Button
        :label="
          !superAdminLogin ? 'Login like Super Admin.' : 'Login like User.'
        "
        variant="link"
        severity="secondary"
        class="text-black"
        @click="() => (superAdminLogin = !superAdminLogin)"
      />
    </div>
  </div>
</template>
