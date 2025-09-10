import { computed, ref, watchEffect } from "vue";

const STORAGE_KEY = "unreadCount";



const unreadCount = ref<number>(
  Number(localStorage.getItem(STORAGE_KEY)) || 0
);
export function useUnreadMessages() {

  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, unreadCount.value.toString());
  });

  const increment = () => {
    unreadCount.value = unreadCount.value + 1;
  };

  const reset = () => {
    unreadCount.value = 0;
  };

  const set = (val: number) => {
    unreadCount.value = val;
  };

  const valueUnreadCount = computed (() => {
    return unreadCount.value
  })

  return {
    valueUnreadCount,
    increment,
    reset,
    set,
  };
}
