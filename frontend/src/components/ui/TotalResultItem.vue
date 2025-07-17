<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

interface Props {
  title?: string;
  total: string | number;
}

const { t } = useI18n();

const props = defineProps<Props>();

const titleText = computed(() => props.title ?? t('default.Results'));
</script>

<template>
  <div class="me-4 flex gap-3 text-xl font-bold">
    <h4>{{ titleText }}</h4>
    <p>{{ total }}</p>
  </div>
</template>

