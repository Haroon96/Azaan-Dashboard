<script setup>
import { computed, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { prayerTimesStore } from '@/stores/PrayerTimes';
import { clockStore } from '@/stores/Clock';
const { gregorianToHijri } = prayerTimesStore();
import Address from '@/components/Address.vue';
const { clock } = storeToRefs(clockStore());

const time = computed(() => {
  return clock.value.toLocaleTimeString();
});

const gregorianDate = computed(() => {
  const currentDate = clock.value;
  let day = currentDate.getDate().toString();
  if (day.length < 2) {
    day = '0' + day;
  }
  const month = toMonth(currentDate);
  return `${toDay(currentDate)}, ${day} ${month}, ${currentDate.getFullYear()}`;
});

const hijriDate = computed(() => {
  const hijri = gregorianToHijri(clock.value);
  if (hijri) {
    return `${hijri.day} ${hijri.month}, ${hijri.year}`
  }
  return '---';
});

onUnmounted(() => {
  clearInterval(interval);
});

function toMonth(date) {
  return date.toLocaleString('default', { month: 'long' });
}

function toDay(date) {
  return date.toLocaleString('default', { weekday: 'long' });
}

</script>

<template>
  <div class="flex align-items-center justify-content-space-between parent">
    <div class="text-align-left">
      <h3>{{ gregorianDate }}</h3>
    </div>
    <div class="text-align-center">
      <h2>{{ time }}</h2>
      <h5><Address></Address></h5>
    </div>
    <div class="text-align-right">
      <h3>{{ hijriDate }}</h3>
    </div>
  </div>
</template>

<style scoped>
h1,h2,h3,h4,h5 {
  margin: 0;
  padding: 0;
}
h5 {
  opacity: 0.5;
}
div.parent {
  width: 100%;
}

div.parent > div {
  min-width: 0;
  flex-basis: 0;
  flex-grow: 1;
}
</style>