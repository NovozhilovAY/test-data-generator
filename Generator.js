var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var FormData = require('form-data');
const axios = require('axios');

class Coordinate {
    constructor(lat, lon) {
        this.latitude = lat;
        this.longitude = lon;
    }

    getPoint(){
        let point = {}
        point.type = 'LineString';
        point.coordinates = [];
        point.coordinates.push(this.latitude);
        point.coordinates.push(this.longitude);
        return new Point(point);
    }

    static getArrayOfCoordinatesFromRoute(route){
        let result = [];
        for (let i = 0; i < route.coordinates.length; i++) {
                result.push(this.getCoordinateFromPoint(route.coordinates[i]));
        }

        return result;
    }

    static getCoordinateFromPoint(point){
        let coordinate = {}
        coordinate.latitude = point[1];
        coordinate.longitude = point[0];
        return coordinate;
    }
}

class Point{
    constructor(point) {
        this.type = point.type;
        this.coordinates = point.coordinates;
    }

    getCoordinate(){
        return new Coordinate(this.coordinates[0],this.coordinates[1])
    }

}

function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function start(id, arrayOfCoordinates, ms){
    for (let i = 0; i < arrayOfCoordinates.length; i++) {
        updateCoordinate(id, arrayOfCoordinates[i]);
        await timer(ms);
    }

}

function setCookies(login, password) {
    function reqListener(event) {
        authCookie = this.getResponseHeader('Set-Cookie')[0].split(';')[0];
    }
    let formData = new FormData();
    formData.append('username', login);
    formData.append('password', password);
    let urlEncodedData = "",
        urlEncodedDataPairs = [];
    urlEncodedDataPairs.push( encodeURIComponent( 'username' ) + '=' + encodeURIComponent( login ) );
    urlEncodedDataPairs.push( encodeURIComponent( 'password' ) + '=' + encodeURIComponent( password ) );
    urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );
    var http = new XMLHttpRequest();
    http.onload = reqListener;
    http.open("POST","http://localhost:8080/login", false, );
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.send(urlEncodedData);
}

function updateCoordinate(id, coordinate){
    function reqListener(event) {
        let data = JSON.parse(this.responseText);
        printResponse(data);
    }
    var http = new XMLHttpRequest();
    http.onload = reqListener;
    http.setDisableHeaderCheck(true);
    http.open("PATCH","http://localhost:8080/api/cars/coordinates/" + id, true);
    http.setRequestHeader('Content-Type', 'application/json;');
    http.setRequestHeader('Cookie', authCookie);
    http.send(JSON.stringify(coordinate));
}

function printResponse(car){
    console.log('id = ' + car.id +
                '    km = ' + car.kilometrage +
                '    lat = ' + car.latitude +
                '    lon = '+car.longitude);
}

async function getRoute(fromPt, toPt) {
    const fromCoords = fromPt.coordinates.join(',');
    const toCoords = toPt.coordinates.join(',');
    const directionsUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/' +
        fromCoords + ';' + toCoords + '?' +
        'geometries=geojson&' +"overview=full&" +
        'access_token=pk.eyJ1Ijoic2FzMjI4IiwiYSI6ImNrenlnY204NzAwMzUzY3BiZWdtbHo0OWkifQ.VlPEAiJAWNp24QivrT7b2w';

    const res = await axios.get(directionsUrl).then(res => res.data);

    return Coordinate.getArrayOfCoordinatesFromRoute(res.routes[0].geometry);
}

const from1 = { type: 'Point', coordinates: [43.937407852453845, 56.21990417154902] };
const to1 = { type: 'Point', coordinates: [44.07978608209069, 56.298770769412556] };

const from2 = { type: 'Point', coordinates: [43.98327933667687, 56.316663891500895] };
const to2 = { type: 'Point', coordinates: [43.8581641378961, 56.34519348329877] };

const from3 = { type: 'Point', coordinates: [44.00961905427317, 56.257559444121654] };
const to3 = { type: 'Point', coordinates: [44.03192750304271, 56.30026722780019] };

var authCookie;
setCookies('device', 'device');


getRoute(from1, to1).then(res => {
    start(1, res, 50);
});

getRoute(from2, to2).then(res => {
    start(3, res, 50);
});

getRoute(from3, to3).then(res => {
    start(4, res, 50);
});