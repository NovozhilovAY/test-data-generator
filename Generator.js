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

function getToken(login, password) {
    function reqListener(event) {
        console.log(this.responseText);
        jwtToken = JSON.parse(this.responseText).token;
    }
    let user = JSON.stringify({username: login, password: password});

    var http = new XMLHttpRequest();
    http.onload = reqListener;
    http.open("POST","http://localhost:8080/api/auth/login", false);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(user);
}

function updateCoordinate(id, coordinate){
    function reqListener(event) {
        let data = JSON.parse(this.responseText);
        printResponse(data);
    }
    var http = new XMLHttpRequest();
    http.onload = reqListener;
    http.open("PATCH","http://localhost:8080/api/cars/coordinates/" + id, true);
    http.setRequestHeader('Content-Type', 'application/json;');
    http.setRequestHeader('Authorization', "Bearer "+ jwtToken);
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

const from4 = { type: 'Point', coordinates: [44.057927, 56.352712] };
const to4 = { type: 'Point', coordinates: [43.851628, 56.293964] };

const from5 = { type: 'Point', coordinates: [43.892313, 56.288791] };
const to5 = { type: 'Point', coordinates: [44.102454, 56.209763] };

const from6 = { type: 'Point', coordinates: [43.768631, 56.309760] };
const to6 = { type: 'Point', coordinates: [43.950451, 56.325273] };

const from7 = { type: 'Point', coordinates: [43.890134, 56.200315] };
const to7 = { type: 'Point', coordinates: [43.936946, 56.218987] };

const from8 = { type: 'Point', coordinates: [44.085328, 56.243411] };
const to8 = { type: 'Point', coordinates: [44.049560, 56.276179] };

const from9 = { type: 'Point', coordinates: [44.066605, 56.299817] };
const to9 = { type: 'Point', coordinates: [44.100259, 56.238347] };

const from10 = { type: 'Point', coordinates: [43.924463, 56.339637] };
const to10 = { type: 'Point', coordinates: [43.804546, 56.382661] };

//

let jwtToken;
getToken('device', 'device');


getRoute(from1, to1).then(res => {
    start(1, res, 2000);
});

getRoute(from2, to2).then(res => {
    start(2, res, 2000);
});

getRoute(from3, to3).then(res => {
    start(3, res, 2000);
});

getRoute(from4, to4).then(res => {
    start(4, res, 2000);
});

getRoute(from5, to5).then(res => {
    start(5, res, 2000);
});

getRoute(from6, to6).then(res => {
    start(6, res, 2000);
});

getRoute(from7, to7).then(res => {
    start(7, res, 2000);
});

getRoute(from8, to8).then(res => {
    start(8, res, 2000);
});

getRoute(from9, to9).then(res => {
    start(9, res, 2000);
});

getRoute(from10, to10).then(res => {
    start(10, res, 2000);
});
