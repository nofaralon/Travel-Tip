export const locService = {
    getLocs,
    creatNewLocation,
    saveLocations,
    getKey,
    removePlace
}
import { storage } from './storage.service.js'

var gIdx = 1;

const LOCS_KEY = 'locationsDB'

<<<<<<< HEAD
const locs = []
=======
const locs = storage.load(LOCS_KEY) || []
>>>>>>> 43eb9a878a56517e2bdf224e4a6327446d0fc90c

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 0)
    });
}


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

function removePlace(placeId) {
    var placeIdx = locs.findIndex(function(place) {
        return placeId === place.id
    })
    locs.splice(placeIdx, 1)
    saveToStorage(LOCS_KEY, locs)
}