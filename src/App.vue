<script setup>
import Clock from '@/components/Clock.vue';
import PrayerTimes from '@/components/PrayerTimes.vue';
import SuhoorIftar from '@/components/SuhoorIftar.vue';
import { geolocationStore } from '@/stores/Geolocation';
const { addressLoaded } = geolocationStore();

</script>

<template>
  <div class="flex column">
    <div class="flex row justify-content-center widget">
      <Clock></Clock>
    </div>
    <div v-if="addressLoaded()">
      <div class="flex row justify-content-space-between equal-width">
        <div class="widget">
          <PrayerTimes></PrayerTimes>
        </div>
        <div class="widget">
          <suhoorIftar></suhoorIftar>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.equal-width>* {
  min-width: 0;
  flex-basis: 0;
  flex-grow: 1;
}

@media screen and (max-width: 769px) {
  .equal-width {
    flex-direction: column;
  }
}
</style>
