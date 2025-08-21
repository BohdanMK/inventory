<template>
    <div class="m-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ul class="divide-y divide-gray-200">
            <li
            v-for="user in onlineUsers"
            :key="user.id"
            class="flex items-center gap-3 p-2"
            >
            <img :src="user.avatar" alt="avatar" class="h-8 w-8 rounded-full" />
            <div>
                <p class="font-medium">{{ user.name }}</p>
                <p class="text-xs text-gray-700 font-bold">{{ user.email }}</p>
            </div>
            </li>
    </ul>
    </div>
</template>

<script setup lang="ts">
import { useSocket } from '@/composables/useSocket';

const { onlineUsers } = useSocket();
</script>