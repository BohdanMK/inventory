<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { DataFile } from '@/interfaces/index';
  import type { IUserProfile } from '@/interfaces';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { z } from 'zod';
  import { Form } from '@primevue/forms';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Password from 'primevue/password';
  import Message from 'primevue/message';
  import FilesUploadItem from '@/components/files/FilesUploadItem.vue';
  import Select from 'primevue/select';

  // State
  const setNewPassword = ref(false);
  const toast = useToast();
  const loadingAvatar = ref<boolean>(false);

  const userProfile = useProfileStore();

  const roles = ref([
    { name: 'Super Admin', code: 'super_admin' },
    { name: 'User', code: 'user' },
  ]);

  const emptyAvatar = ref<DataFile>({
    fileName: '',
    filePath: '',
  });

  const initialValues = ref({
    username: '',
    email: '',
    role: null as { name: string; code: string } | null,
  });

  // Resolvers
  const profileResolver = zodResolver(
    z.object({
      username: z.string().min(1, { message: 'Username is required.' }),
      email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
      role: z.any().optional(),
    })
  );

  const passwordResolver = zodResolver(
    z
      .object({
        newPassword: z
          .string()
          .min(3, { message: 'Minimum 3 characters.' })
          .max(8, { message: 'Maximum 8 characters.' })
          .refine(value => /\d/.test(value), {
            message: 'Must contain at least one number.',
          }),
        confirmPassword: z.string(), // Без додаткових обмежень, лише базовий тип
      })
      .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      })
  );

  // actions
  const onProfileSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
    console.log();
    if (!valid) return;

    const data: IUserProfile = {
      username: values.username,
      email: values.email,
      role: values.role?.code,
    };

    const { success, message } = await userProfile.updateProfile(data);

    if (success) {
      toast.add({ severity: 'success', detail: message, life: 3000 });
      setTimeout(() => {
        getProfile();
      }, 1000);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Update failed',
        detail: message,
        life: 3000,
      });
    }
    loadingAvatar.value = false;
  };

  const onPasswordSubmit = async ({ valid, values }: any) => {
    if (!valid) return;
    console.log(values);

    const { success, message } = await userProfile.updateProfilePassWord(values.newPassword);

    if (success) {
      toast.add({ severity: 'success', detail: message, life: 3000 });
      setTimeout(() => {
        getProfile();
      }, 1000);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Update failed',
        detail: message,
        life: 3000,
      });
    }
    loadingAvatar.value = false;
  };

  const updateUserProfileAvatar = async (data: DataFile) => {
    console.log(data);
    loadingAvatar.value = true;
    const { success, message } = await userProfile.updateProfileAvatar(data);

    if (success) {
      toast.add({ severity: 'success', detail: message, life: 3000 });

      setTimeout(() => {
        getProfile();
      }, 1000);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Update failed',
        detail: message,
        life: 3000,
      });
    }
    loadingAvatar.value = false;
  };

  const removeAvatar = (data: DataFile) => {
    updateUserProfileAvatar(data);
  };

  const getProfile = async (): Promise<void> => {
    const { success, message, data } = await userProfile.fetchUserProfile();
    if (!success) {
      console.error('Failed to fetch profile:', message);
    } else {
      // profileStore.userProfile = data
      if (userProfile.userProfile.role) {
        if (!localStorage.getItem('role')) {
          localStorage.setItem('role', userProfile.userProfile.role);
        }
        console.log(localStorage.getItem('role'));
      }
      updataInitialValues();
    }
  };

  const updataInitialValues = () => {
    const selectedRole = roles.value.find(r => r.code === userProfile.userProfile.role) || null;
    initialValues.value.username = userProfile.userProfile.username ?? '';
    initialValues.value.email = userProfile.userProfile.email ?? '';
    initialValues.value.role = selectedRole;
  };

  /// getters

  const getAvatar = computed(() => {
    return userProfile.userProfile.avatarFullPath
      ? `${import.meta.env.VITE_API_URL}${userProfile.userProfile.avatarFullPath}`
      : 'https://fakeimg.pl/300x300';
  });

  updataInitialValues();
</script>

<template>
  <div class="card flex flex-col justify-start">
    <Toast />
    <h3 class="mb-3 text-2xl font-medium">Profile Settings</h3>
    <div class="flex items-start gap-[50px]">
      <div>
        <FilesUploadItem :saveBtn="true" :file="getAvatar" @updateData="updateUserProfileAvatar" />
        <Button
          v-if="userProfile.userProfile.avatarFullPath"
          class="mx-auto mt-2 block"
          type="button"
          severity="secondary"
          label="Remove avatar"
          @click="removeAvatar(emptyAvatar)"
        />
      </div>
      <div>
        <!-- Main form -->
        <Form
          v-slot="$form"
          :resolver="profileResolver"
          :initialValues="initialValues"
          class="mt-0 mb-5 flex w-full flex-col gap-4 sm:w-[300px]"
          @submit="onProfileSubmit"
        >
          <div class="flex flex-col gap-1">
            <InputText name="username" type="text" placeholder="Username" fluid />
            <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
              $form.username.error?.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <InputText name="email" type="text" placeholder="Email" fluid />
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
              $form.email.error?.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <Select name="role" :options="roles" optionLabel="name" placeholder="Select role" class="w-full" />
          </div>
          <Button type="submit" severity="secondary" label="Update" />
        </Form>

        <!-- Password change toggle -->
        <div class="w-full sm:w-[300px]">
          <Button
            class="mb-4 w-full"
            type="button"
            severity="secondary"
            :label="setNewPassword ? 'Cancel change' : 'Change password'"
            @click="setNewPassword = !setNewPassword"
          />

          <!-- Password form -->
          <Transition name="slide-fade">
            <Form
              v-if="setNewPassword"
              v-slot="$formPassword"
              :resolver="passwordResolver"
              class="flex w-full flex-col gap-4"
              @submit="onPasswordSubmit"
            >
              <div class="flex flex-col gap-1">
                <Password name="newPassword" placeholder="New password" :feedback="false" fluid toggleMask />
                <template v-if="$formPassword.newPassword?.invalid">
                  <Message
                    v-for="(error, index) of $formPassword.newPassword.errors"
                    :key="index"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ error.message }}</Message
                  >
                </template>
              </div>
              <div class="flex flex-col gap-1">
                <Password name="confirmPassword" placeholder="Confirm password" :feedback="false" fluid toggleMask />
                <template v-if="$formPassword.confirmPassword?.invalid">
                  <Message
                    v-for="(error, index) of $formPassword.confirmPassword.errors"
                    :key="index"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ error.message }}</Message
                  >
                </template>
              </div>
              <Button type="submit" severity="secondary" label="Save" />
            </Form>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
