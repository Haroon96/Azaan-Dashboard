<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { prayerTimesStore } from '@/stores/PrayerTimes';
import { clockStore } from '@/stores/Clock';
const { getPrayerTimesForDate } = prayerTimesStore();
const { clock } = storeToRefs(clockStore());

const prayerTimes = ref({});
const timeUntil = ref({});
const fields = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Sunset", "Isha"];
getPrayerTimesForDate(clock.value)
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

const nextPrayer = computed(() => {
    let next = null;
    const now = clock.value;
    for (let field of fields) {
        if (now < prayerTimes.value[field]) {
            next = field;
            timeUntil.value = secondsToHMS((prayerTimes.value[field] - now) / 1000);
            break;
        }
    }
    return next;
});

function secondsToHMS(secs) {
  function keep(n, v) {
    n = parseInt(n);
    if (n == 0) {
        return '';
    }
    return n + v + ' ';
  }
  secs = Math.abs(secs);
  return keep(secs/3600 |0, 'h') + keep((secs%3600) / 60 |0, 'm') + keep(secs%60, 's');
}


</script>

<template>
    <div class="text-align-center">
        <h2>Prayer Times</h2>
    </div>
    <br>
    <div class="flex column">
        <div v-for="field in fields" class="flex row justify-content-space-between" :class="{'passed': clock > prayerTimes[field]}">
            <span class="text-align-left">{{ field }}</span>
            <span class="text-align-right">{{ formatTime(prayerTimes[field]) }}</span>
        </div>
    </div>
    <div class="text-align-center">
        <h4 v-if="nextPrayer">{{ timeUntil }} until {{ nextPrayer }}</h4>
        <h4 v-else>Done for today!</h4>
    </div>
</template>

<style scoped>
.row {
  border-bottom: solid 1px rgba(0,0,0,0.5);
  padding: 4px;
}
.passed {
    opacity: 0.5;
}
</style>