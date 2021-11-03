import { locService } from "./services/loc.service.js";
import { mapService } from "./services/map.service.js";
import { storage } from "./services/storage.service.js";

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGoPlace=onGoPlace;

function onInit() {
  mapService
    .initMap()
    // .then((res) => {
    //   console.log("Map is ready",res);
    // })
    .then((gMap) => {
      gMap.addListener("click", (mapsMouseEvent) => {
        var placeName = prompt("Enter your place name");
        var location = mapsMouseEvent.latLng.toJSON();
        console.log(location);
        var lat = location.lat;
        var lng = location.lng;
        var createdAt = Date.now();
        locService.creatNewLocation(lat, lng, createdAt, placeName);
        locService.getLocs().then((places)=>{
            console.log(places)
            renderPlaces(places);
        })
      });
    })
    
    .catch(() => console.log("Error: cannot init map"));
  var key = locService.getKey();
  var places = storage.load(key);
  if (places) renderPlaces(places);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log("Adding a marker");
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log("Locations:", locs);
    document.querySelector(".locs").innerText = JSON.stringify(locs);
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log("User position is:", pos.coords);
      document.querySelector(
        ".user-pos"
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch((err) => {
      console.log("err!!!", err);
    });
}

function onPanTo() {
  console.log("Panning the Map");
  mapService.panTo(35.6895, 139.6917);
}

function renderPlaces(places) {
  var strHtmls = places.map(function (place) {
    return `<tr>
                <td><img class="icon" src="img/icon.png" ></td>
                <td>${place.name}</td>
                <td><button class="remove" onclick="onRemovePlace(${place.id})"> X </button>
                <td><button class="go" onclick="onGoPlace(${place.lat},${place.lng})"> Go! </button></td>
            </tr>`;
  });

  document.querySelector("tbody").innerHTML = strHtmls.join("");
}

function onRemovePlace(placeId) {
  removePlace(placeId);
  var places = loadFromStorage(PLACES_KEY);
  renderPlaces(places);
}

function onGoPlace(lat, lng) {
  mapService.panTo(lat, lng);
}
