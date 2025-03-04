<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { prayerTimesStore } from '@/stores/PrayerTimes';
import { clockStore } from '@/stores/Clock';
const { getPrayerTimesForDate } = prayerTimesStore();
const { registerNewDateListener } = clockStore();
const { clock } = storeToRefs(clockStore());

const prayerTimes = ref({});
const fields = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_QUEUE_SECONDS = 60 * 10;

registerNewDateListener(getTodaysTimes);
getTodaysTimes();
watch(clock, playAdhan);

async function getTodaysTimes() {
    const { timings } = await getPrayerTimesForDate(clock.value);
    prayerTimes.value = timings;
}

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
            break;
        }
    }
    return next;
});

function calculateTimeUntil(time) {
    return secondsToHMS((time - clock.value) / 1000);
}

function secondsToHMS(secs) {
    function keep(n, v) {
        n = parseInt(n);
        if (n == 0) {
            return '';
        }
        return n + v + ' ';
    }
    secs = secs;
    return keep(secs / 3600 | 0, 'h') + keep((secs % 3600) / 60 | 0, 'm') + keep(secs % 60, 's');
}

let prayerQueued = ref(null);
let audio = null;
let dismissedUntil = null;

function playAdhan() {
    const next = nextPrayer.value;
    if (!["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(next)) {
        return;
    }
    if (dismissedUntil && dismissedUntil > clock.value) {
        return;
    }
    if (next && (prayerTimes.value[next] - clock.value) / 1000 <= PRAYER_QUEUE_SECONDS && !prayerQueued.value) {
        prayerQueued.value = next;
        audio = new Audio('https://cdn.aladhan.com/audio/adhans/a4.mp3');
        setTimeout(() => {
            if (prayerQueued.value) {
                audio.play()
            }
        }, (prayerTimes.value[prayerQueued.value] - clock.value));
        audio.onended = () => {
            prayerQueued.value = null;
        };
    }
}

function stopAdhan() {
    dismissedUntil = prayerTimes.value[prayerQueued.value];
    prayerQueued.value = null;
    audio.pause();
    audio = null;
}

</script>

<template>
    <div class="text-align-center">
        <h2>Prayer Times</h2>
    </div>
    <div class="text-align-center">
        <h2 v-if="nextPrayer">{{ calculateTimeUntil(prayerTimes[nextPrayer]) }} until {{ nextPrayer }}</h2>
    </div>
    <br>
    <div class="flex prayertime-container justify-content-space-around">
        <div v-for="field in fields" class="flex column prayertime justify-content-space-around"
            :class="{ 'passed': clock > prayerTimes[field] }">
            <span class="text-align-center">{{ field }}</span>
            <span class="text-align-center">{{ formatTime(prayerTimes[field]) }}</span>
        </div>
    </div>
    <div class="adhan-modal widget text-align-center" v-if="prayerQueued">

        <h1>{{ prayerQueued }} Adhan</h1>
        <h2 v-if="prayerTimes[prayerQueued] > clock">Starts in {{ calculateTimeUntil(prayerTimes[prayerQueued]) }}</h2>
        <br>
        <button @click="stopAdhan()">Stop</button>

    </div>
</template>

<style scoped>
.prayertime-container {
    flex-wrap: wrap;
}

.prayertime {
    border: solid 1px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin-top: 8px;
    padding: 4px;
    width: 30%;
    font-size: 1.3em;
    text-align: center;
}

.passed {
    opacity: 0.5;
}

.adhan-modal {
    background: white;
    position: absolute;
    top: 48px;
    width: 50%;
    left: 24%;
}

.adhan-modal button {
    width: 100%;
    padding: 12px;
    font-size: 1em;
}
</style>