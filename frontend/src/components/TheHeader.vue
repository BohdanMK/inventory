<script setup>
  import { useCurrentDateTime } from '@/composables/useCurrentDateTime';

  const { currentTime, currentDate } = useCurrentDateTime();
</script>
<template>
  <header class="w-full shadow-xl">
    <div class="container-fluid mx-[30px]">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img src="@/assets/main-logo.png" alt="logo" />
          <h4 class="font text-new-prime font-medium uppercase">Inventory</h4>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-[14px] font-medium">
            <div>Today</div>
            <div>
              {{ currentDate }}
            </div>
          </div>
          <div>
            <i class="pi pi-clock" style="font-size: 1rem"></i>
            <span class="ms-1">
              {{ currentTime }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
