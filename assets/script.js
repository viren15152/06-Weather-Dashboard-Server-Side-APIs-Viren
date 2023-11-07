$(document).ready(function () {
    
    //Allows me to retrieve the current date this will make it simple to parse, validate and maniuplate and display date/time
    let nowMoment = moment().format("l");

    //This will allow me to add days to moment for the forecast cards(let declartion declares re-assignable, block scoped local variables)
    let day1 = moment().add(1, "days").format("l");
    let day2 = moment().add(2, "days").format("l");
    let day3 = moment().add(3, "days").format("l");
    let day4 = moment().add(4, "days").format("l");
    let day5 = moment().add(5, "days").format("l");

    //Global variable(These are declared outside of the the function in a program and can, therefore be accessed by any of the functions)
    let city;
    let cities;

    //The function below will allow me to load the latest searched city from local storage.
    function loadMostRecent() {
        let lastSearch = localStorage.getItem("most recent");
        if (lastSearch) {
            city = lastSearch;
            search();
        }else {
            city = "London";
            search();
        }
    }
});


   

