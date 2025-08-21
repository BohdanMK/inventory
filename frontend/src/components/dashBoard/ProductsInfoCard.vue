<script setup lang="ts">
    import { useDashBoardStore } from '@/stores/dashBoard';
    import CountUp from 'vue-countup-v3'
    import Skeleton from 'primevue/skeleton';

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
</script>

<template>
    <div class="m-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Button :disabled="props.loading" class="flex ms-auto" icon="pi pi-refresh" rounded raised @click="updateData()" />

        <Skeleton v-if="props.loading"  width="100%" height="10rem"></Skeleton>
        <div v-else>
            <div v-if="dashBoardStore.productsInfo?.totalProducts">
                <count-up  :end-val="dashBoardStore.productsInfo?.totalProducts"></count-up>
                <div>
                    Total avalible products
                </div>
            </div>
            <div v-if="dashBoardStore.productsInfo?.totalPrice">
                <count-up  :end-val="dashBoardStore.productsInfo?.totalPrice"></count-up>
                <div>

                    Total price
                </div>
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