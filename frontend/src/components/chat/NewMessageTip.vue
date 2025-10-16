<script setup lang="ts">
  import { useUnreadMessages } from '@/composables/useUnreadMessages';
  import { useActionsStore } from '@/stores/actionsStore';

  // state
  const { valueUnreadCount } = useUnreadMessages();
  const actionsStore = useActionsStore();
</script>

<template>
  <div
    class="relative z-1 cursor-pointer"
    v-if="valueUnreadCount && valueUnreadCount > 0"
    @click="() => actionsStore.toggleChatActionsStatus()"
  >
    <i class="pi pi-envelope" color="text-rose-200" style="font-size: 1.4rem"></i>
    <span
      class="absolute top-[-10px] left-[10px] flex h-[20px] w-[20px] items-center justify-center rounded-[50%] bg-red-500 text-sm text-amber-50"
    >
      {{ valueUnreadCount }}
    </span>
  </div>
</template>

<style scoped></style>
