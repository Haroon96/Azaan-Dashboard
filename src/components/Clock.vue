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
  const month = toMonth(currentDate);
  return `${toDay(currentDate)}, ${day} ${month}`;
});

const hijriDate = computed(() => {
  const hijri = gregorianToHijri(clock.value);
  if (hijri) {
    return `${hijri.day} ${hijri.month}`
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
      <h2>{{ gregorianDate }}</h2>
    </div>
    <div class="text-align-center">
      <h1>{{ time }}</h1>
      <h4><Address></Address></h4>
    </div>
    <div class="text-align-right">
      <h2>{{ hijriDate }}</h2>
    </div>
  </div>
</template>

<style scoped>
div.parent {
  width: 100%;
}

div.parent > div {
  min-width: 0;
  flex-basis: 0;
  flex-grow: 1;
}
</style>