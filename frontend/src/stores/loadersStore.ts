import { ref } from 'vue';
import { defineStore } from 'pinia';


export const useLoadersStore = defineStore('loadersStore', () => {
    // state
    const loadMoreStatus = ref<boolean>(false);


    // actions
    const resetChatLoaders = () => {
        loadMoreStatus.value = false;
    }

    return {
        loadMoreStatus,
        resetChatLoaders
    };
});
