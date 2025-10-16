import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { BreadcrumbItem } from '@/types'; // або скопіюй інтерфейс

export function useBreadcrumbs() {
  const route = useRoute();

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    return (route.meta.breadcrumbs as BreadcrumbItem[]) || [];
  });

  return {
    breadcrumbs,
  };
}
