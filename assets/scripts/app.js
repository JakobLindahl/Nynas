'use strict';

function getElement(selector) {
    return document.querySelector(selector);
}

function TableRow(data) {
    this.data = data;
}

function Tbody(tbody) {
    this.container = getElement(tbody.container);
    this.rows = tbody.rows;
}

Tbody.prototype.printTbody = function () {
    this.container.innerHTML = "";
    this.rows.forEach((row) => {
        var tr = document.createElement('tr');
        for (let value in row.data) {
            let td = document.createElement('td');
            td.innerHTML = row.data[value];
            tr.appendChild(td);
        }
        this.container.appendChild(tr);
    });
}

function WeatherTbody(data) {
    Tbody.call(this, {
        container: '.weather_body',
        rows: data
    });
}

function TrainTbody(data) {
    Tbody.call(this, {
        container: '.train_body',
        rows: data
    });
}

WeatherTbody.prototype = Object.create(Tbody.prototype);
WeatherTbody.prototype.constructor = WeatherTbody;

TrainTbody.prototype = Object.create(Tbody.prototype);
TrainTbody.prototype.constructor = TrainTbody;



const KEY = '14e392b947d7270060ce0c117b7c838b';
const API_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=nynashamn&APPID=' + KEY;

function HttpGet(url) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
}

HttpGet.prototype.proceed = function (callback) {
    this.ajax.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.response);
        }
    }
    this.ajax.open('GET', this.url, true);
    this.ajax.send();
}

function fetch(url) {
    return new HttpGet(url);
}


fetch(API_URL).proceed(response => {
    var weatherData = JSON.parse(response);
    var weatherList = weatherData.list;

    let information = [];
    for (let index = 0; index < 5; index++) {
        var time = weatherList[index].dt_txt;
        var date = new Date(time);
        var hour = date.getHours() + ':00';
        if (hour.length === 4) {
            hour = "0" + hour;
        }
        var weather = weatherList[index].weather[0].description;
        var temperature = (weatherList[index].main.temp - 273.15).toFixed(1) + "°C";
        var speed = weatherList[index].wind.speed.toFixed(0) + "m/s";
        information.push(new TableRow([hour, weather, temperature, speed]));
    }
    var weatherTbody = new WeatherTbody(information);
    weatherTbody.printTbody();
});



function DOMElement(selector) {
    this.element = getElement(selector);
}

DOMElement.prototype.select = function (target) {
    this.selected = getElement(target);
    return this;
}

DOMElement.prototype.click = function (callback) {
    this.element.addEventListener('click', event => {
        event.selected = this.selected;
        callback(event);
    });
}

function find(selector) {
    return new DOMElement(selector);
}


find('.fetch-data').select('.train_body').click(event => {
    
    var input = getElement('#leaving_from').value;
    var information = [];
    information.push(new TableRow(["42", "10:25", "11:23"]));
    information.push(new TableRow(["42", "12:25", "13:23"]));
    information.push(new TableRow(["42", "14:25", "15:23"]));
    var trainTbody = new TrainTbody(information);
    trainTbody.printTbody();

    var capture = getElement('.train_capture');
    capture.innerHTML = "Åker från: " + input;
    event.preventDefault();
});