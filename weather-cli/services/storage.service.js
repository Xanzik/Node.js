import { homedir } from 'os';
import { join, basename } from 'path';
import { promises } from 'fs';

const filePath = join(homedir(), 'weather-data.json');

const TOKEN_DICTIONARY = {
    token: 'token',
    city: 'city',
};

const saveKeyValue = async (key, value) => {
    const data = readJsonFile(filePath);
    data[key] = value;
    await promises.writeFile(filePath, JSON.stringify(data));
};

const getKeyValue = async (key) => {
    const data = await readJsonFile(filePath);
    return data[key];
};

const readJsonFile = async (filePath) => {
    let data = {};
    if(await isExist(filePath)) {
        const file = await promises.readFile(filePath);
        data = JSON.parse(file);
    }
    return data;
};

const isExist = async (path) => {
    try {
        await promises.stat(path);
        return true;
    } catch (e) {
        return false;
    }
};

export { saveKeyValue, getKeyValue, TOKEN_DICTIONARY };