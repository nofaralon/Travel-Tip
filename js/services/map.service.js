export const mapService = {
    initMap,
    addMarker,
    panTo,
    geoCode
}

import { locService } from './loc.service.js'

var gMap;

function initMap(lat = 30.0749831, lng = 30.9120554) {
    console.log('hi')
    var url = window.location[0].href
    console.log(url);
    const newparam = new URLSearchParams(url)
    if (newparam.get('lat')) {
        var coords = {
            lat: newparam.get('lat'),
            lng: newparam.get('lng')
        }
        lat = coords.lat
        lng = coords.lng
    }
    return _connectGoogleApi()
        .then(() => {
            console.log('hi')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            return gMap
        })

}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDrGxjwMxqLAnKCpNpxhGFAHBGxXXtZFuE';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}



function geoCode(searchVal) {
    const API_KEY = 'AIzaSyCs-QKtNa_l3qyNxdpxi7YM7rRgpKvTJU8';
    const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchVal}&key=${API_KEY}`)
        .then(res => {
            console.log(res)
            return {
                locations:res.data.results[0].geometry.location,
                name:res.data.results[0].formatted_address
            }
        })
        .catch(err => {
            console.log('Had issues talking to server', err);
        })
    return prm
}