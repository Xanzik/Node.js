import {getKeyValue, TOKEN_DICTIONARY} from "./storage.service.js";

const getWeather = async (city) => {
    const token = await getKeyValue(TOKEN_DICTIONARY.token);
    if(!token) {
        throw new Error(`Token not found, try set the token using the -t [API_KEY]`);
    }
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('q', city);
    url.searchParams.set('appid', token);
    url.searchParams.set('units', 'metric');
    try {
        const response = await fetch(url);
        return await response.json();
    } catch(e) {
        throw new Error('HTTP Error');
    }
};

export { getWeather };