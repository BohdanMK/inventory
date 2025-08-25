<script setup lang="ts">
    import { computed } from 'vue';
    import { useDashBoardStore } from '@/stores/dashBoard';
    import Skeleton from 'primevue/skeleton';
    import Chart from 'primevue/chart';

    //emits + props

    interface Props {
        loading: boolean;
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

    //state
    const dashBoardStore = useDashBoardStore();

     // actions

    const updateData = () => {
        emit('updateData')
    };

    //getters

    const chartData = computed(() => {
        if (!dashBoardStore.stockActionsSummary) return { labels: [], datasets: [] };

        return {
            labels: dashBoardStore.stockActionsSummary.map(item => item.type),
            datasets: [
                {
                    data: dashBoardStore.stockActionsSummary.map(item => item.count)
                }
            ]
        };
    });

    const chartOptions = {
        plugins: {
            legend: {
            position: 'bottom'
            }
        }
    };

    const barChartData = computed(() => {
        if (!dashBoardStore.stockActionsSummary) return { labels: [], datasets: [] };

        return {
            labels: dashBoardStore.stockActionsSummary.map(item => item.type),
            datasets: [
                {
                    label: 'Stock Actions',
                    data: dashBoardStore.stockActionsSummary.map(item => item.count)
                }
            ]
        };
    });

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
</script>

<template>
    <div class="m-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Button :disabled="props.loading" class="flex ms-auto" icon="pi pi-refresh" rounded raised @click="updateData()" />

        <Skeleton v-if="props.loading"  width="100%" height="10rem"></Skeleton>
        <div v-else>
            <div class="flex justify-around">
                <Chart
                    v-if="chartData?.datasets?.length"
                    type="doughnut"
                    :style="{ width: '380px', height: '380px' }"
                    :data="chartData"
                    :options="chartOptions"
                    class="w-full md:w-[30rem]" />
                <Chart
                    v-if="barChartData?.datasets?.length"
                    type="bar"
                    :data="barChartData"
                    :width="380"
                    :height="380"
                    :options="barChartOptions"
                />
            </div>
        </div>

    </div>
</template>

<style scoped>
    .countup-wrap {
        font: 4em sans-serif;
        font-weight: bold;
    }
</style>