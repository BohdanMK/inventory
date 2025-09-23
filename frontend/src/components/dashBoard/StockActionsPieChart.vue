<script setup lang="ts">
import { computed } from 'vue';
import { useDashBoardStore } from '@/stores/dashBoard';
import Skeleton from 'primevue/skeleton';
import Chart from 'primevue/chart';
import Button from 'primevue/button';

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'updateData'): void }>();

// store
const dashBoardStore = useDashBoardStore();

// actions
const updateData = () => {
  emit('updateData');
};

interface StockActionSummary {
  type: string;
  count: number;
}

// computed
const hasChartData = computed(
  () => !!dashBoardStore.stockActionsSummary?.length
);

const chartData = computed(() => {
  const data = dashBoardStore.stockActionsSummary as StockActionSummary[] | null;
  if (!data) return { labels: [], datasets: [] };

  return {
    labels: data.map(item => item.type),
    datasets: [
      {
        data: data.map(item => item.count),
      },
    ],
  };
});

const chartOptions = computed(() => ({
  plugins: {
    legend: { position: 'bottom' },
  },
}));

const barChartData = computed(() => {
  const data = dashBoardStore.stockActionsSummary as StockActionSummary[] | null;
  if (!data) return { labels: [], datasets: [] };

  return {
    labels: data.map(item => item.type),
    datasets: [
      {
        label: 'Stock Actions',
        data: data.map(item => item.count),
      },
    ],
  };
});

const barChartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  },
  scales: {
    y: { beginAtZero: true },
  },
}));
</script>

<template>
  <div
    class="m-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
    <Button
      :disabled="props.loading"
      :loading="props.loading"
      class="flex ms-auto"
      icon="pi pi-refresh"
      rounded
      raised
      @click="updateData"
    />

    <Transition name="fade" mode="out-in">
      <Skeleton
        v-if="props.loading"
        key="skeleton"
        width="100%"
        height="10rem"
      />
      <div v-else key="charts">
        <div class="flex flex-col xl:flex-row items-center  justify-around gap-8 xl:gap-2">
          <Chart
            v-if="hasChartData"
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
            class="w-full md:w-[30rem]"
            :style="{ width: '300px', height: '320px' }"
          />
          <Chart
            v-if="hasChartData"
            type="bar"
            :data="barChartData"
            :options="barChartOptions"
            class="w-full md:w-[30rem]"
            :style="{ width: '380px', height: '380px' }"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
