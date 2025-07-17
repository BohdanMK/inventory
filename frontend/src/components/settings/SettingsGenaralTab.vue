<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { DataFile } from '@/interfaces/index';
  import type { IUserProfile } from '@/interfaces';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { useToast } from 'primevue/usetoast';
  import { useToastNotification } from '@/composables/useToastNotification';
  import Toast from 'primevue/toast';
  import { z } from 'zod';
  import { Form } from '@primevue/forms';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Password from 'primevue/password';
  import Message from 'primevue/message';
  import FilesUploadItem from '@/components/files/FilesUploadItem.vue';
  import Select from 'primevue/select';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const setNewPassword = ref(false);
  const toast = useToast();
  const loadingAvatar = ref<boolean>(false);
  const userProfile = useProfileStore();
  const toastNotification = useToastNotification();

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

  const profileResolver = zodResolver(
    z.object({
      username: z.string().min(1, { message: t('validations.Username_is_required') }),
      email: z.string().min(1, { message: t('validations.Email_is_required') }).email({ message: t('validations.Invalid_email_address') }),
      role: z.any().optional(),
    })
  );

  const passwordResolver = zodResolver(
    z.object({
      newPassword: z
        .string()
        .min(3, { message: t('validations.Minimum_3_characters') })
        .max(8, { message: t('validations.Maximum_8_characters') })
        .refine(value => /\d/.test(value), {
          message: t('validations.Must_have_a_number'),
        }),
      confirmPassword: z.string(),
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: t('validations.Passwords_do_not_match') || 'Passwords do not match.',
      path: ['confirmPassword'],
    })
  );

  const onProfileSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
    if (!valid) return;

    const data: IUserProfile = {
      username: values.username,
      email: values.email,
      role: values.role?.code,
    };

    const { success, message } = await userProfile.updateProfile(data);

    if (success) {
      toastNotification.showSuccess(message || '');
      setTimeout(() => getProfile(), 1000);
    } else {
      toastNotification.showError(message || '');
    }

    loadingAvatar.value = false;
  };

  const onPasswordSubmit = async ({ valid, values }: any) => {
    if (!valid) return;

    const { success, message } = await userProfile.updateProfilePassWord(values.newPassword);

    if (success) {
      setTimeout(() => getProfile(), 1000);
      toastNotification.showSuccess(message || '');
    } else {
      toastNotification.showError(message || '');
    }

    loadingAvatar.value = false;
  };

  const updateUserProfileAvatar = async (data: DataFile) => {
    loadingAvatar.value = true;
    const { success, message } = await userProfile.updateProfileAvatar(data);

    if (success) {
      setTimeout(() => getProfile(), 1000);
    } else {
      toastNotification.showError(message || '');
    }

    loadingAvatar.value = false;
  };

  const removeAvatar = (data: DataFile) => {
    updateUserProfileAvatar(data);
  };

  const getProfile = async (): Promise<void> => {
    const { success, message } = await userProfile.fetchUserProfile();
    if (!success) {
      console.error('Failed to fetch profile:', message);
    } else {
      if (userProfile.userProfile.role && !localStorage.getItem('role')) {
        localStorage.setItem('role', userProfile.userProfile.role);
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
    <h3 class="mb-3 text-2xl font-medium">{{ t('settings.users_settings') }}</h3>
    <div class="flex items-start gap-[50px]">
      <div>
        <FilesUploadItem :saveBtn="true" :file="getAvatar" @updateData="updateUserProfileAvatar" />
        <Button
          v-if="userProfile.userProfile.avatarFullPath"
          class="mx-auto mt-2 block"
          type="button"
          severity="secondary"
          :label="t('button.Remove')"
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
            <InputText name="username" type="text" :placeholder="t('fields.Username')" fluid />
            <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
              {{ $form.username.error?.message }}
            </Message>
          </div>
          <div class="flex flex-col gap-1">
            <InputText name="email" type="text" :placeholder="t('fields.Email')" fluid />
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
              {{ $form.email.error?.message }}
            </Message>
          </div>
          <div class="flex flex-col gap-1">
            <Select name="role" :options="roles" optionLabel="name" :placeholder="t('fields.Select_role')" class="w-full" />
          </div>
          <Button type="submit" severity="secondary" :label="t('button.Save')" />
        </Form>

        <!-- Password change toggle -->
        <div class="w-full sm:w-[300px]">
          <Button
            class="mb-4 w-full"
            type="button"
            severity="secondary"
            :label="setNewPassword ? t('button.cancel') : t('fields.Password')"
            @click="setNewPassword = !setNewPassword"
          />
          <Transition name="slide-fade">
            <Form
              v-if="setNewPassword"
              v-slot="$formPassword"
              :resolver="passwordResolver"
              class="flex w-full flex-col gap-4"
              @submit="onPasswordSubmit"
            >
              <div class="flex flex-col gap-1">
                <Password name="newPassword" :placeholder="t('fields.Password')" :feedback="false" fluid toggleMask />
                <template v-if="$formPassword.newPassword?.invalid">
                  <Message
                    v-for="(error, index) of $formPassword.newPassword.errors"
                    :key="index"
                    severity="error"
                    size="small"
                    variant="simple"
                  >
                    {{ error.message }}
                  </Message>
                </template>
              </div>
              <div class="flex flex-col gap-1">
                <Password name="confirmPassword" :placeholder="t('fields.Password')" :feedback="false" fluid toggleMask />
                <template v-if="$formPassword.confirmPassword?.invalid">
                  <Message
                    v-for="(error, index) of $formPassword.confirmPassword.errors"
                    :key="index"
                    severity="error"
                    size="small"
                    variant="simple"
                  >
                    {{ error.message }}
                  </Message>
                </template>
              </div>
              <Button type="submit" severity="secondary" :label="t('button.Save')" />
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
