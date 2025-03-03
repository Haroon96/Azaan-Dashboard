import { defineStore } from 'pinia'

export const prayerTimesStore = defineStore('prayerTimesStore', () => {
    const adhanTimes = {};

    let latitude = '';
    let longitude = '';
    
    function setLocation(_latitude, _longitude) {
        latitude = _latitude;
        longitude = _longitude;
    }

    function parseTime(timeStr) {
        const match = timeStr.match(/(\d{2}):(\d{2})\s\((\w+)\)/);
        let [_, hours, minutes, timezone] = match;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        // Get current date and set hours and minutes
        const now = new Date();
        now.setHours(hours, minutes, 0, 0); // Set time, keep the same date
        return now;
    }

    function gregorianToHijri(date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${month}/${year}`;
        if (adhanTimes[key] && adhanTimes[key][date.getDate()]) {
            return adhanTimes[key][date.getDate()]['hijriDate'];
        }
        return null;
    }

    const promises = {};
    async function getRequest(url) {
        const apiReq = await fetch(url);
        return await apiReq.json();
    }

    async function getPrayerTimesForDate(date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${month}/${year}`;
        if (adhanTimes[key]) {
            return adhanTimes[key][date.getDate()];
        }
        if (!promises[key]) {
            promises[key] = getRequest(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}`);
        }
        const response = await promises[key];
        if (adhanTimes[key]) {
            return adhanTimes[key][date.getDate()];
        }
        if (response.code && response.code == 200) {
            adhanTimes[key] = {};
            for (let row of response['data']) {
                const timings = {};
                for (let time in row['timings']) {
                    timings[time] = parseTime(row['timings'][time]);
                }
                const day = parseInt(row['date']['gregorian']['day']);
                const hijriDate = {
                    day: row['date']['hijri']['day'],
                    month: row['date']['hijri']['month']['en'],
                    year: row['date']['hijri']['year']
                };
                const gregorianDate = {
                    day: row['date']['gregorian']['day'],
                    month: row['date']['gregorian']['month']['en'],
                    year: row['date']['gregorian']['year']
                };
                adhanTimes[key][day] = {
                    timings,
                    hijriDate,
                    gregorianDate
                };
            }
        }
        return adhanTimes[key][date.getDate()];
    }

    return { setLocation, getPrayerTimesForDate, gregorianToHijri };
});