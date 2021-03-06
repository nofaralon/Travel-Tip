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

const locs = storage.load(LOCS_KEY) || []

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
    saveLocations()
}

function removePlace(placeId) {
    var placeIdx = locs.findIndex(function(place) {
        return placeId === place.id
    })
    locs.splice(placeIdx, 1)
    saveLocations()
}