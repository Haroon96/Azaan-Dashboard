import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { prayerTimesStore } from './PrayerTimes';

async function getAddress(latitude, longitude) {

    // get address information from openstreetmap
    const osmRequest = await fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&format=jsonv2&zoom=13`);
    const osmJson = await osmRequest.json();
    
    // extract values
    const displayName = osmJson.display_name;
    const name = osmJson.name;
    const road = osmJson.address.road;
    const city = osmJson.address.city;
    const county = osmJson.address.county;
    const state = osmJson.address.state;
    const postCode = osmJson.address.postcode;
    const country = osmJson.address.country;
    const countryCode = osmJson.address.country_code.toUpperCase();

    // return object
    return { coordinates: { latitude, longitude }, name, displayName, road, city, county, state, postCode, country, countryCode };
}

export const geolocationStore = defineStore('geolocationStore', () => {
    const { setLocation } = prayerTimesStore();
    const _address = ref({});
    const address = computed(() => _address);
    const watchId = navigator.geolocation.watchPosition(async ({ coords }) => {
        if (coords.latitude && coords.longitude) {
            setLocation(coords.latitude, coords.longitude);
            _address.value = await getAddress(coords.latitude, coords.longitude);
            navigator.geolocation.clearWatch(watchId);
        }
    });
    function addressLoaded() {
        return _address.value.coordinates ? true : false;
    }
    return { address, addressLoaded };
});