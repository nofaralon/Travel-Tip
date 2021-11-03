export const locService = {
    getLocs
}
import {storage} from './storage.service'

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

const LOCS_KEY='locationsDB'
function saveLocations(){
    storage.save(LOCS_KEY,locs)
}


