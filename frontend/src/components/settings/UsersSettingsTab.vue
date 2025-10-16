<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Form } from '@primevue/forms';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { useToastNotification } from '@/composables/useToastNotification';
  import { useI18n } from 'vue-i18n';
  import type { IUserProfile } from '@/interfaces';
  import Toast from 'primevue/toast';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { z } from 'zod';
  import debounce from '@/utils/debounce';
  import AutoComplete from 'primevue/autocomplete';
  import Button from 'primevue/button';
  import RadioButton from 'primevue/radiobutton';
  import Password from 'primevue/password';

  // state
  const userProfile = useProfileStore();
  const { t } = useI18n();
  const toastNotification = useToastNotification();

  const userList = ref<IUserProfile[]>([]);
  const setNewPassword = ref(false);
  const userType = ref<string>('all');
  const userName = ref<string>('');
  const selectedUser = ref<IUserProfile>({});
  const form = ref();
  const initialValues = ref({
    username: '',
    newPassword: null,
    confirmPassword: null,
  });
  const localBtnLoading = ref<boolean>(false);

  const passwordResolver = zodResolver(
    z
      .object({
        newPassword: z
          .string()
          .min(3, { message: t('validations.Minimum_3_characters') })
          .max(8, { message: t('validations.Maximum_8_characters') })
          .refine(value => /\d/.test(value), {
            message: t('validations.must_have_number'),
          }),
        confirmPassword: z.string(),
      })
      .refine(data => data.newPassword === data.confirmPassword, {
        message: t('validations.passwords_do_not_match'),
        path: ['confirmPassword'],
      })
  );

  // actions
  const fetchUsers = async () => {
    let typeUser: string = '';
    if (userType.value !== 'all') {
      typeUser = userType.value;
    }
    try {
      const { success, message, data } = await userProfile.fetchUsersList({
        role: typeUser,
        username: userName.value,
      });

      if (!success) {
        console.error('Failed to fetch profile:', message);
      } else {
        userList.value = [];
        userList.value = data.data;
        console.log(userList.value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onFormSubmit = async ({ valid, values }: any) => {
    if (!valid) return;
    let data: { id: string; password: string } = {
      id: selectedUser.value._id || '',
      password: values.newPassword,
    };
    localBtnLoading.value = true;
    try {
      const { success, message } = await userProfile.updateUserPassWord(data);

      if (success) {
        toastNotification.showSuccess(message || '');
        setTimeout(() => {
          resetStateAfterSubmit();
          form.value?.reset();
        }, 400);
      } else {
        toastNotification.showError(message || '');
      }
    } catch (err) {
      console.log(err);
    } finally {
      localBtnLoading.value = false;
    }
  };

  const debouncedFetchUsers = debounce(fetchUsers, 300);

  const resetStateAfterSubmit = () => {
    selectedUser.value = {};
    userName.value = '';
    setNewPassword.value = false;
  };

  //computed

  // hooks and watchers
  watch(userName, newVal => {
    if (typeof newVal === 'string') {
      debouncedFetchUsers();
    }
  });
</script>

<template>
  <div>
    <Toast />
    <h2 class="mb-4 text-xl font-medium">{{ $t('settings.update_users_passwords') }}</h2>
    <div class="card flex flex-col justify-start sm:w-90">
      <div class="card mb-4 flex justify-start">
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <RadioButton v-model="userType" inputId="ingredient1" name="userType" value="all" />
            <label for="ingredient1">{{ $t('settings.All') }}</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton v-model="userType" inputId="ingredient2" name="userType" value="super_admin" />
            <label for="ingredient2"> {{ $t('settings.Super_Admin') }}</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton v-model="userType" inputId="ingredient3" name="userType" value="user" />
            <label for="ingredient3">User{{ $t('settings.User') }}</label>
          </div>
        </div>
      </div>

      <div class="mb-4 flex flex-col gap-1">
        <AutoComplete
          v-model="userName"
          :suggestions="userList"
          optionLabel="username"
          placeholder="Username"
          :disabled="Object.keys(selectedUser).length > 0 && setNewPassword"
          dropdown
          fluid
          @complete="debouncedFetchUsers"
          @item-select="
            e => {
              selectedUser = e.value;
              userName = e.value.username;
            }
          "
        />
      </div>
      <div>
        <Button
          class="mb-4 w-full"
          :disabled="!Object.keys(selectedUser).length"
          type="button"
          severity="secondary"
          :label="setNewPassword ? t('settings.cancel_change') : t('settings.change_password')"
          @click="setNewPassword = !setNewPassword"
        />
        <Form
          v-slot="$form"
          :initialValues
          :resolver="passwordResolver"
          class="flex w-full flex-col gap-4 sm:w-90"
          @submit="onFormSubmit"
        >
          <Transition name="slide-fade">
            <div v-if="setNewPassword" class="flex w-full flex-col gap-4">
              <div class="flex flex-col gap-1">
                <Password
                  name="newPassword"
                  :placeholder="t('settings.new_password')"
                  :feedback="false"
                  fluid
                  toggleMask
                />
                <template v-if="$form.newPassword?.invalid">
                  <Message
                    v-for="(error, index) of $form.newPassword.errors"
                    :key="index"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ error.message }}</Message
                  >
                </template>
              </div>
              <div class="flex flex-col gap-1">
                <Password
                  name="confirmPassword"
                  :placeholder="t('settings.confirm_password')"
                  :feedback="false"
                  fluid
                  toggleMask
                />
                <template v-if="$form.confirmPassword?.invalid">
                  <Message
                    v-for="(error, index) of $form.confirmPassword.errors"
                    :key="index"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ error.message }}</Message
                  >
                </template>
              </div>
              <Button :loading="localBtnLoading" type="submit" severity="secondary" :label="t('button.Save')" />
            </div>
          </Transition>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
