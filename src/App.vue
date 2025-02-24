<script setup>
import Clock from '@/components/Clock.vue';
import PrayerTimes from '@/components/PrayerTimes.vue';
import SuhoorIftar from './components/SuhoorIftar.vue';
import Loading from '@/components/Loading.vue';
import { geolocationStore } from '@/stores/Geolocation';
const { addressLoaded } = geolocationStore();

</script>

<template>
  <div class="flex column">
    <div class="flex row justify-content-center widget">  
      <Clock></Clock>
    </div>
    <div class="flex row justify-content-space-between equal-width">
      <div v-if="addressLoaded()" class="widget">
        <PrayerTimes></PrayerTimes>
      </div>
      <div v-else class="widget">
        <Loading></Loading>
      </div>
      
      <div v-if="addressLoaded()" class="widget">
        <suhoorIftar></suhoorIftar>
      </div>
      <div v-else class="widget">
        <Loading></Loading>
      </div>
    </div>
  </div>

</template>

<style scoped>
.widget {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin: 8px;
}

.equal-width > * {
  min-width: 0;
  flex-basis: 0;
  flex-grow: 1;
}
</style>
