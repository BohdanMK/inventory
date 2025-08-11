<script setup lang="ts">
    import { computed, ref } from "vue";
    import { useI18n } from "vue-i18n";
    import Select from 'primevue/select';

    /// types and interfaces

    interface ILocalesList {
        name: string,
        code: string
    }

    const { t, locale, availableLocales } = useI18n()

    const selectedLanguage = locale;

    /// getters
    const availableLocalesList = computed<ILocalesList[]>(() =>
        availableLocales.map((item) => {
            const clean = item.replace(/;/g, "").trim();
            return { name: clean, code: clean };
        })
    );

    const selectedLocaleValue = computed<ILocalesList>({
        get: () => {
            const savedLang = localStorage.getItem('selectedLang');
            const lang = (savedLang || locale.value).replace(/;/g, "").trim();
            return { name: lang, code: lang };
        },
        set: (val) => {
            const clean = val.code.replace(/;/g, "").trim();
            locale.value = clean;
            localStorage.setItem('selectedLang', clean);
        },
    });

</script>

<template>
    <div>
        <Select v-model="selectedLocaleValue" :options="availableLocalesList" optionLabel="name" placeholder="Select a City" class="w-full md:w-26" />
    </div>
</template>

<style scoped>

</style>