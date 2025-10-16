<template>
    <img :src="src" :alt="alt" :class="customClass" @error="(e) => ((e.target as HTMLImageElement).src = fallbackImage)" />
</template>

<script setup lang="ts">
    import { fallbackImage } from '@/helpers/fallbackImage';

    const props = defineProps<{
        src: string;
        alt?: string;
        customClass?: string;
    }>();
</script>

<style scoped>

</style>