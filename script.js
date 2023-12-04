var searchButton = document.getElementById("search-btn");
var clearHistoryButton = document.getElementById("clear-history-btn");


searchButton.addEventListener("click", function () {
    handleSearch();
    
});

clearHistoryButton.addEventListener("click", function () {
    clearSearchHistory();
    displaySearchHistory();
});

function clearSearchHistory() {
    localStorage.removeItem("searchHistory");
}


function handleSearch() {
    var cityInput = document.getElementById("city").value;
    fetchWeatherData(cityInput);
    saveToLocalStorage(cityInput);
    displaySearchHistory();
}

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=dfb1bbc6193c13c32f550c45f737430e`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data && data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                console.log(lat);
                console.log(lon);                   
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=dfb1bbc6193c13c32f550c45f737430e`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (currentWeatherData) {
                        displayCurrentWeather(currentWeatherData);
                    })

                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=dfb1bbc6193c13c32f550c45f737430e`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (forecastData) {
                        display5DayForecast(forecastData);
                    });
            }
        });
}

function saveToLocalStorage(city) {
    var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(history));
}

function displaySearchHistory() {
    var historyDiv = document.getElementById("historycity");
    var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    historyDiv.innerHTML = "Search History: ";
    history.forEach(function (city) {
        var historyItem = document.createElement("div");
        historyItem.textContent = city;
        historyDiv.appendChild(historyItem);
    });
}



function displayCurrentWeather(weatherData) {
    var currentCityDiv = document.getElementById("currentcity");

    var temperatureCelsius = (weatherData.main.temp - 273.15).toFixed(2);
    var humidity = (weatherData.main.humidity);
    var currentDate = new Date();
    var windSpeed = (weatherData.wind.speed);
    var formattedDate = currentDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    currentCityDiv.innerHTML = `<h2>Current Weather in ${weatherData.name}</h2>
                                <p>Date: ${formattedDate}</p>
                                <p>Temperature: ${temperatureCelsius} &#8451;</p>
                                <p>Weather: ${weatherData.weather[0].description}</p>
                                <p>Humidity: ${humidity}</p>
                                <p>Wind Speed: ${windSpeed}</p>`;
}

function display5DayForecast(forecastData) {
    var future5DayDiv = document.getElementById("future5day");
    future5DayDiv.innerHTML = "<h2>5-Day Forecast</h2>";
    for (var i = 0; i < forecastData.list.length; i += 8) {
        var date = new Date(forecastData.list[i].dt * 1000);
        var formattedDate = date.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
        var humidity = (forecastData.list[i].main.humidity);
        var temperatureCelsius = (forecastData.list[i].main.temp - 273.15).toFixed(2);
        var windSpeed = (forecastData.list[i].wind.speed);
        
        var forecastItem = document.createElement("div");
        forecastItem.innerHTML = `<p>Date: ${formattedDate}</p>
                                    <p>Temperature: ${temperatureCelsius} &#8451;</p>
                                    <p>Weather: ${forecastData.list[i].weather[0].description}</p>
                                    <p>Humidity: ${humidity}</p>
                                    <p>Wind Speed: ${windSpeed}</p>`;
        future5DayDiv.appendChild(forecastItem);
        
    }
};