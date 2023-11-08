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
        let loadRecentCities = JOSN.parse(localStorage.getItem("cities"));  

        if (loadRecentCities) {
            cities = recentCities;
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
    city = $("city-input").val();
    if (city && cities.includes(city) === false) {
        saveToLocalStorage();
        return city;
    } else if (!city) {
      alert("Please enter a valid city name");
    }
}

//This function will allow me to search the API for the chosen City
function search() {

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=0ecd6941b13b3aa52fd2d06126b3ff33";
    let coords = [];

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        coords.push(response.coord.lat);
        coords.push(response.coord.lon);
        let cityName = response.name;
        let cityCond = response.weath[0].description.toUpperCase();
        let cityTemp = response.main.temp;
        let cityHum = response.main.humidity;
        let cityWind = response.wind.speed;
        let icon = response.weather[0].icon;
        $("#icon").html(
            `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
        );
        $("#city-name").html(cityName + " " + "(" + NowMoment + ")");
        $("#city-cond").text("Current Conditions: " + cityCond);    
        $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
        $("#humidity").text("Humidity: " + cityHum + "%");
        $("wind-speed").text("Wind Speed: " + cityWind + "mph");
        $("#date1").text(day1);
        $("#date2").text(day2);
        $("#date3").text(day3);
        $("#date4").text(day4);
        $("#date5").text(day5);

        getUV(response.coord.lat, response.coord.lon);
    }).fail(function(){
        alert("Could not obtain data")
    });


