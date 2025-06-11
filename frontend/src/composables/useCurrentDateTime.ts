import { ref, onMounted, onUnmounted } from 'vue';

export function useCurrentDateTime() {
  const currentTime = ref('');
  const currentDate = ref('');
  let intervalId: number;

  const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    currentDate.value = now
      .toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase();
  };

  onMounted(() => {
    updateTime();
    intervalId = window.setInterval(updateTime, 1000);
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });

  return { currentTime, currentDate };
}
