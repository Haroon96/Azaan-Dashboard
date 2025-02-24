<script setup>
import { ref } from 'vue';
import { prayerTimesStore } from '@/stores/PrayerTimes';
const { getPrayerTimesForDate } = prayerTimesStore();

const prayerTimes = ref({});
const fields = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Sunset", "Isha"];
getPrayerTimesForDate(new Date())
    .then(({ timings }) => {
        prayerTimes.value = timings;
    });

function formatTime(date) {
    if (date) {
        let minutes = date.getMinutes().toString();
        if (minutes.length == 1) {
            minutes = '0' + minutes;
        }
        let hours = date.getHours();
        let ampm = hours < 12 ? 'AM' : 'PM';
        if (hours > 12) {
            hours = hours % 12;
        }
        return `${hours}:${minutes} ${ampm}`;
    }
    return '';
}

</script>

<template>
    <div class="text-align-center">
        <h2>Prayer Times</h2>
    </div>
    <br>
    <div class="flex column">
        <div v-for="field in fields" class="flex row justify-content-space-between">
            <span class="text-align-left">{{ field }}</span>
            <span class="text-align-right">{{ formatTime(prayerTimes[field]) }}</span>
        </div>
    </div>
</template>

<style scoped>
.row {
  border-bottom: solid 1px rgba(0,0,0,0.5);
  padding: 4px;
}
</style>