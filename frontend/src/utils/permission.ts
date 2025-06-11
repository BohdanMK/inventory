import type { App, DirectiveBinding } from 'vue';
import { watchEffect, onBeforeUnmount } from 'vue';
import { useProfileStore } from '@/stores/userProfileStore';

export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const profileStore = useProfileStore();

    // Спочатку приховуємо елемент
    el.style.display = 'none';

    // Використовуємо watchEffect для спостереження за змінами в profileStore
    const stopHandle = watchEffect(() => {
      const userRole = profileStore.getUserProfile?.role;
      const allowedRoles = Array.isArray(binding.value)
        ? binding.value
        : [binding.value];

      // Якщо немає ролі в користувача, нічого не робимо
      if (!userRole) return;

      // Якщо роль користувача є в allowedRoles, показуємо елемент, інакше видаляємо
      if (allowedRoles.includes(userRole)) {
        el.style.display = '';
      } else {
        el.remove();
      }
    });

    // Зупиняємо спостереження при видаленні елемента
    onBeforeUnmount(() => {
      stopHandle(); // Зупиняємо спостереження
    });
  },
};

export function registerPermissionDirective(app: App) {
  app.directive('permission', permissionDirective);
}
