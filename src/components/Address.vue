<script setup>
import { geolocationStore } from '@/stores/Geolocation';
const { address, addressLoaded } = geolocationStore();
</script>

<template>
    <div v-if="addressLoaded()">{{ address.city }}, {{ address.state }}</div>
    <div v-else>&nbsp;</div>
</template>