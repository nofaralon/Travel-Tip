import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storage } from './services/storage.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    var key = locService.getKey()
    var places = storage.load(key)
    if (places) renderPlaces(places)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}


function renderPlaces(places) {

    var strHtmls = places.map(function(place) {
        return `<tr>
                <td><img class="icon" src="img/icon.png" ></td>
                <td>${place.name}</td>
                <td><button class="remove" onclick="onRemovePlace(${place.id})"> X </button>
                <td><button class="go" onclick="onGoPlace(${place.id})"> Go! </button></td>
            </tr>`
    })

    document.querySelector('tbody').innerHTML = strHtmls.join('');
}

function onRemovePlace(placeId) {
    removePlace(placeId)
    var places = loadFromStorage(PLACES_KEY)
    renderPlaces(places)


}

function onGoPlace(placeId) {

}