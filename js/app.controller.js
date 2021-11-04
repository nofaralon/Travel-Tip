import { locService } from "./services/loc.service.js";
import { mapService } from "./services/map.service.js";
import { storage } from "./services/storage.service.js";

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGoPlace = onGoPlace;
window.onRemovePlace = onRemovePlace;
window.onSearchAdd = onSearchAdd;
window.onGoUrlParams = onGoUrlParams;


function onInit() {
    console.log('hi')
    var url = window.location.href
    console.log(url);
    const newparam = new URLSearchParams(url)
    console.log(newparam.get('lat'))
    if (newparam.get('lat')) {
        var coords = {
            lat: newparam.get('lat'),
            lng: newparam.get('lng')
        }
        lat = coords.lat
        lng = coords.lng
        mapService
        .initMap(lat,lng)
        .then((gMap) => {
            gMap.addListener("click", (mapsMouseEvent) => {
                var placeName = prompt("Enter your place name");
                var location = mapsMouseEvent.latLng.toJSON();
                var lat = location.lat;
                var lng = location.lng;
                var createdAt = Date.now();
                locService.creatNewLocation(lat, lng, createdAt, placeName);
                onAddMarker(lat, lng)
                locService.getLocs().then((places) => {
                    renderPlaces(places);
                })
            });
        })

    .catch(() => console.log("Error: cannot init map"));
    var key = locService.getKey();
    var places = storage.load(key);
    if (places) renderPlaces(places);
    }else{
        mapService
        .initMap()
        .then((gMap) => {
            gMap.addListener("click", (mapsMouseEvent) => {
                var placeName = prompt("Enter your place name");
                var location = mapsMouseEvent.latLng.toJSON();
                var lat = location.lat;
                var lng = location.lng;
                var createdAt = Date.now();
                locService.creatNewLocation(lat, lng, createdAt, placeName);
                onAddMarker(lat, lng)
                locService.getLocs().then((places) => {
                    renderPlaces(places);
                })
            });
        })

    .catch(() => console.log("Error: cannot init map"));
    var key = locService.getKey();
    var places = storage.load(key);
    if (places) renderPlaces(places);
    }
    
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
}

function onAddMarker(lat, lng) {
    console.log("Adding a marker");
    mapService.addMarker({ lat, lng });
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        document.querySelector(".locs").innerText = JSON.stringify(locs);
    });
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            document.querySelector(".user-pos").innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
            mapService.panTo(pos.coords.latitude, pos.coords.longitude);
        })
        .catch((err) => {
            console.log("err!!!", err);
        });
}

function onPanTo() {
    mapService.panTo(35.6895, 139.6917);
}

function renderPlaces(places) {
    var strHtmls = places.map(function(place) {
        return `<tr>
                <td><img class="icon" src="img/icon.png" ></td>
                <td>${place.name}</td>
                <td><button class="remove btn" onclick="onRemovePlace(${place.id})"> X </button>
                <td><button class="go btn" onclick="onGoPlace(${place.lat},${place.lng})"> Go! </button></td>
            </tr>`;
    });

    document.querySelector("tbody").innerHTML = strHtmls.join("");
}

function onRemovePlace(placeId) {
    locService.removePlace(placeId)
    var key = locService.getKey()
    var places = storage.load(key)
    if (places) renderPlaces(places)
}

function onGoPlace(lat, lng) {
    onAddMarker(lat, lng)
    mapService.panTo(lat, lng);
}


function onSearchAdd() {
    var elInput = document.querySelector('.search')
    var value = elInput.value
    var searchVal = value.split(' ').join('+')
    mapService.geoCode(searchVal).then((coords) => {
        mapService.panTo(coords.locations.lat, coords.locations.lng)
        onAddMarker(coords.locations.lat, coords.locations.lng)
        locService.creatNewLocation(coords.locations.lat, coords.locations.lng, Date.now(), coords.name);
        locService.getLocs().then((places) => {
            renderPlaces(places);
        })
    })
}

function onGoUrlParams() {
    const str = 'lat=3.14&lng=3.14'
    const newUrl = new URLSearchParams(str)

    var coords = locService.getLocs().then((res) => {
        return res[res.length - 1]
    })

    .then((coords) => {
            newUrl.set('lat', coords.lat)
            newUrl.set('lng', coords.lng)
            return newUrl
        })
        .then((res) => {
            var NewStr = res.toString()
            return `http://nofaralon.github.io/Travel-Tip?${NewStr}`
        })
        .then((url) => {
            // console.log(url);
            window.location.assign(url);
        })



}


// var url = window.location.href
//     const newparam = new URLSearchParams(url)
//     console.log(newparam.get('lat'));
//     if (newparam.get('lat')) {
//         var coords = {
//             lat: newparam.get('lat'),
//             lng: newparam.get('lng')
//         }
//         lat = coords.lat
//         lng = coords.lng
//     }