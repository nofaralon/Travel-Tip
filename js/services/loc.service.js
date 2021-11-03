export const locService = {
    getLocs,
    creatNewLocation,
    saveLocations,
    getKey
}
import { storage } from './storage.service.js'

var gIdx = 1;


const locs = [
    // { id: 1, name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt: 1121255, updatedAt: 1121255 },
    // { id: 2, name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt: 1525255, updatedAt: 1525255 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

const LOCS_KEY = 'locationsDB'

function saveLocations() {
    storage.save(LOCS_KEY, locs)
}

function getKey() {
    return LOCS_KEY
}

function creatNewLocation(lat, lng, createdAt, name) {
    const loc = {
        id: gIdx++,
        name,
        lat,
        lng,
        createdAt,
        updatedAt: createdAt
    }
    locs.push(loc)
    console.log(locs)
    saveLocations()
}