<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { prayerTimesStore } from '@/stores/PrayerTimes';
const { getPrayerTimesForDate } = prayerTimesStore();

import { clockStore } from '@/stores/Clock';
const { registerNewDateListener } = clockStore();
const { clock } = storeToRefs(clockStore());

const suhoorIftarTimes = ref({});
const dates = ref([]);

registerNewDateListener(getTimings);
getTimings();

async function getTimings() {
    dates.value = [];
    suhoorIftarTimes.value = {};
    for (let i = 0; i <= 10; ++i) {
        const newDate = new Date();
        newDate.setDate(clock.value.getDate() + i);
        dates.value.push(newDate);
        const { hijriDate, timings } = await getPrayerTimesForDate(newDate);
        if (hijriDate['month'] != 'Ramaḍān') {
            continue
        }
        suhoorIftarTimes.value[newDate] = {
            hijriDate,
            suhoor: timings['Fajr'],
            iftar: timings['Maghrib']
        };
    }
}

const ramadanDates = computed(() => {
    const ramadanDates = [];
    for (let date of dates.value) {
        if (getHijriDate(date)['month'] == 'Ramaḍān') {
            ramadanDates.push(date);
        }
    }
    return ramadanDates.slice(0, 5);
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

function toMonth(date) {
  return date.toLocaleString('default', { month: 'short' });
}

function toDay(date) {
  return date.toLocaleString('default', { weekday: 'short' });
}

function getHijriDate(date) {
    if (date && suhoorIftarTimes.value[date] && suhoorIftarTimes.value[date]['hijriDate']) {
        return suhoorIftarTimes.value[date]['hijriDate'];
    }
    return {};
}

function getsuhoorIftarTimes(date) {
    if (date && suhoorIftarTimes.value[date]) {
        return { 
            'suhoor': formatTime(suhoorIftarTimes.value[date]['suhoor']), 
            'iftar': formatTime(suhoorIftarTimes.value[date]['iftar'])
        };
    }
    return {};
}

</script>

<template>
    <div class="text-align-center">
        <h2>Suhoor and Iftar Times</h2>
    </div>
    <br>
    <div class="flex column">
        <div class="flex row justify-content-space-between table-row">
            <span class="text-align-left">Date</span>
            <span class="text-align-center">Ramadan</span>
            <span class="text-align-center">Suhoor</span>
            <span class="text-align-right">Iftar</span>
        </div>
        <div v-for="date in ramadanDates" class="flex row justify-content-space-between table-row">
            <span class="text-align-left">{{ toDay(date) }}, {{ date.getDate() }} {{ toMonth(date) }}</span>
            <span class="text-align-center">{{ getHijriDate(date)['day'] }}</span>
            <span class="text-align-center">{{ getsuhoorIftarTimes(date)['suhoor'] }}</span>
            <span class="text-align-right">{{ getsuhoorIftarTimes(date)['iftar'] }}</span>
        </div>
    </div>
</template>

<style scoped>
.table-row > * {
  min-width: 0;
  flex-basis: 0;
  flex-grow: 1;
  border-bottom: solid 1px rgba(0,0,0,0.5);
  padding: 4px;
}

.table-row {
    opacity: 0.5;
}

.table-row:first-child {
    border-bottom: solid 1px black;
    opacity: 1;
}

.table-row:nth-child(2) {
    opacity: 1;
}
</style>