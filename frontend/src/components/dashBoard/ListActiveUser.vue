<script setup lang="ts">
    import { useUsersStore } from "@/stores/usersStore";
    import setFullImgPath from '@/helpers/fullPathImg.ts';

    // state
    const usersStore = useUsersStore();

    // lifecycle hooks



</script>

<template>
    <div class="m-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ul class="divide-y divide-gray-200">
            <li
            v-for="user in usersStore.onlineUsers"
            :key="user.id"
            class="flex items-center gap-3 p-2"
            >
            <img
                v-if="user.avatar"
                :src="setFullImgPath(user.avatar)"
                alt="avatar"
                class="h-12 w-12 rounded-full"
            />
            <div v-else class="flex items-center h-12 w-12 rounded-full">
                <i  class=" pi pi-user-minus mx-auto text-2xl"></i>
            </div>
            <div>
                <p class="font-medium">{{ user.name }}</p>
                <p class="text-xs text-gray-700 font-bold">{{ user.email }}</p>
            </div>
            </li>
    </ul>
    </div>
</template>

