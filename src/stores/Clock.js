import { defineStore } from 'pinia'
import { ref } from 'vue'

export const clockStore = defineStore('clockStore', () => {
    const clock = ref(new Date());
    let lastKnownDate = clock.value.getDate();
    setInterval(() => {
        clock.value = new Date();
        if (lastKnownDate != clock.value.getDate()) {
            location.reload();
        }
    }, 1000);
    return { clock };
});
