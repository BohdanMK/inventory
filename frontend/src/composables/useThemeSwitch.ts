// composables/useThemeSwitch.js
import { ref, onMounted, watch } from 'vue';

export function useThemeSwitch() {
  const isDark = ref(false);

  // Завантажуємо тему з localStorage при монтуванні
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    isDark.value = savedTheme === 'dark' || false;
    applyTheme();
  });

  // Синхронізуємо зміну isDark із темою
  watch(isDark, newValue => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    applyTheme();
  });

  // Функція для перемикання теми (опціонально, якщо потрібен ручний виклик)
  const toggleTheme = () => {
    isDark.value = !isDark.value; // Toggle перемикається автоматично через v-model
  };

  // Застосовуємо тему
  const applyTheme = () => {
    const html = document.documentElement;
    if (isDark.value) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  return { isDark, toggleTheme, applyTheme }; // Експортуємо applyTheme для дебагу
}
