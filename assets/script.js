$(document).ready(function () {
    
    //This section allows me to retrieve the current date this will make it simple to parse, validate and maniuplate and display date/time.
    let nowMoment = moment().format("l");

    //This will allow me to add days to moment for the forecast cards(let declartion declares re-assignable, block scoped local variables).
    let day1 = moment().add(1, "days").format("l");
    let day2 = moment().add(2, "days").format("l");
    let day3 = moment().add(3, "days").format("l");
    let day4 = moment().add(4, "days").format("l");
    let day5 = moment().add(5, "days").format("l");

    //Global variable(These are declared outside of the the function in a program and can, therefore be accessed by any of the functions).
    let city;
    let cities;

    //The function below will allow me to load the most recently searched city from local storage.
    function loadMostRecent() {
        let lastSearch = localStorage.getItem("most recent");
        if (lastSearch) {
            city = lastSearch;
            search();
        } else {
            city = "London";
            search();
        }
    }

    loadMostRecent()

    //I have created this function so that it will load recently searched cities from local storage.

    function loadRecentCities() {
        let loadRecentCities = JSON.parse(localStorage.getItem("cities"));  

        if (loadRecentCities) {
            cities = loadRecentCities;
        } else {
            cities = [];
        }
    }

    loadRecentCities()

    //I have included an event handler for the search city button.
    $("#submit").on("click", (e) => {
        e.preventDefault();
        getCity();
        search();
        $("#city-input").val("");
        listCities();
});

//This function will allow me to save searched cities to local storage. 

function saveToLocalStorage() {
    localStorage.setItem("mostRecent", city);
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
}

//This function will allow me to retrieve user input e.g. The City name 
function getCity() {
    city = $("#city-input").val();
    if (city && cities.includes(city) === false) {
        saveToLocalStorage();
        return city;
    } else if (!city) {
      alert("Please enter a valid city name");
    }
}

//This function will allow me to search the API for the chosen City
function search() {

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=618e6c039d4af2e9290a98da5ec21d47";
    let coords = [];

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        //console.log(response.coord.lat, "lat -- lon", response.coord.lon);

        coords.push(response.coord.lat);
        coords.push(response.coord.lon);
        let cityName = response.name;
        let cityCond = response.weather[0].description.toUpperCase();
        let cityTemp = response.main.temp;
        let cityHum = response.main.humidity;
        let cityWind = response.wind.speed;
        let icon = response.weather[0].icon;
        $("#icon").html(
            `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
        );
        $("#city-name").html(cityName + " " + "(" + nowMoment + ")");
        $("#city-cond").text("Current Conditions: " + cityCond);    
        $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
        $("#humidity").text("Humidity: " + cityHum + "%");
        $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
        $("#date1").text(day1);
        $("#date2").text(day2);
        $("#date3").text(day3);
        $("#date4").text(day4);
        $("#date5").text(day5);

        getUV(response.coord.lat, response.coord.lon);
    }).fail(function (err) {
        //console.error("Error", err);
        alert("Could not obtain data")
    });

    function getUV(lat, lon) {


        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=618e6c039d4af2e9290a98da5ec21d47",
            method: "GET",
        }).then(function (response) {
            
            let uvIndex = response.current.uvi;
            $("#uv-index").text("UV Index:" + " " + uvIndex);
            if (uvIndex >= 8) {
                $("uv-index").css("color", "red");
            } else if (uvIndex > 4 && uvIndex < 8) {
                $("uv-index").css("color", "purple");
            } else {
                $("uv-index").css("color", "orange");
            }
            let cityHigh = response.daily[0].temp.max;
            $("#high").text("Expected high (F): " + " " + cityHigh);

            //These are my variables for temperature 
            let day1temp = response.daily[1].temp.max;
            let day2temp = response.daily[2].temp.max;
            let day3temp = response.daily[3].temp.max;
            let day4temp = response.daily[4].temp.max;
            let day5temp = response.daily[5].temp.max;
            //These are my variables for humidity   
            let day1hum = response.daily[1].humidity;
            let day2hum = response.daily[2].humidity;
            let day3hum = response.daily[3].humidity;
            let day4hum = response.daily[4].humidity;
            let day5hum = response.daily[5].humidity;
            //These are my icon variables for forecast weather
            let icon1 = response.daily[1].weather[0].icon
            let icon2 = response.daily[2].weather[0].icon
            let icon3 = response.daily[3].weather[0].icon
            let icon4 = response.daily[4].weather[0].icon
            let icon5 = response.daily[5].weather[0].icon

            $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1));
            $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1));
            $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1));
            $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1));
            $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1));

            $("#hum1").text("Hum:" + " " + day1hum + "%");
            $("#hum2").text("Hum:" + " " + day2hum + "%");
            $("#hum3").text("Hum:" + " " + day3hum + "%");
            $("#hum4").text("Hum:" + " " + day4hum + "%");
            $("#hum5").text("Hum:" + " " + day5hum + "%");

            $("#icon1").html(
                `<img src=http://openweathermap.org/img/wn/${icon1}@2x.png>`
            );
            $("#icon2").html(
                `<img src=http://openweathermap.org/img/wn/${icon2}@2x.png>`
            );
            $("#icon3").html(
                `<img src=http://openweathermap.org/img/wn/${icon3}@2x.png>`
            );
            $("#icon4").html(
                `<img src=http://openweathermap.org/img/wn/${icon5}@2x.png>`
            );
            $("#icon5").html(
                `<img src=http://openweathermap.org/img/wn/${icon5}@2x.png>`
            );
        });
    }
}

//This function will allow me to render recently searched cities to my page 

function listCities() {
    $("#cityList").text("");
    cities.forEach((city) => {
        $("#cityList").prepend("<tr><td>" + city + "</td></tr>");
    });
}

//This is an event handler for recently searched cities in my table 
$(document).on("click", "td", (e) => {
    e.preventDefault();
    let listedCity = $(e.target).text();
    city = listedCity;
    search();

});

//My final section of code in my script.js is an event handler for my clear/reset button in my HTML
$("#clr-btn").click(() => {
    localStorage.removeItem("cities");
    loadRecentCities();
    listCities();
});
});


