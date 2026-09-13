const API_URL = "http://127.0.0.1:5000/api/weather";

// -----------------------------
// Search Weather
// -----------------------------
async function searchWeather() {

    const input = document.getElementById("locationInput");
    const searchButton = document.querySelector(".search-btn");
    const errorMessage = document.getElementById("errorMessage");

    const location = input.value.trim();

    if (!location) {
        showError("Please enter a city or village name.");
        return;
    }

    // Loading
    if (searchButton) {
        searchButton.disabled = true;
        searchButton.innerText = "Searching...";
    }

    hideError();

    try {

        const response = await fetch(
            `${API_URL}?location=${encodeURIComponent(location)}`
        );

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(
                data.error || "Unable to fetch weather information."
            );
        }

        // Update dashboard
        updateWeatherDashboard(data);

    } catch (error) {

        console.error("Weather Error:", error);

        showError(
            "Location not found or backend is not running. Please try again."
        );

    } finally {

        if (searchButton) {
            searchButton.disabled = false;
            searchButton.innerText = "Search";
        }
    }
}


// -----------------------------
// Update Weather Dashboard
// -----------------------------
function updateWeatherDashboard(data) {

    // Location
    setText("locationName", data.location || "--");
    setText("country", data.country || "");
    setText("currentDate", getCurrentDate());

    // Temperature
    setText(
        "temperature",
        `${round(data.temperature)}°C`
    );

    setText(
        "feelsLike",
        `Feels like ${round(data.temperature)}°C`
    );

    // Weather condition
    const weatherInfo = getWeatherCondition(
        Number(data.weather_code)
    );

    setText("weatherCondition", weatherInfo.condition);
    setText("weatherIcon", weatherInfo.icon);

    // Sunrise / Sunset
    setText("sunrise", "--");
    setText("sunset", "--");

    // Weather Summary
    setText(
        "humidity",
        `${round(data.humidity)}%`
    );

    setText(
        "windSpeed",
        `${round(data.wind_speed)} km/h`
    );

    setText(
        "currentRainfall",
        `${round(data.current_rainfall)} mm`
    );

    setText(
        "predictedRainfall",
        `${round(data.predicted_rainfall)} mm`
    );

    // Weather Details
    setText(
        "detailHumidity",
        `${round(data.humidity)}%`
    );

    setText(
        "detailWind",
        `${round(data.wind_speed)} km/h`
    );

    setText(
        "pressure",
        `${round(data.pressure)} hPa`
    );

    setText(
        "detailRainfall",
        `${round(data.current_rainfall)} mm`
    );

    // Current backend does not provide these yet
    setText("uvIndex", "--");
    setText("visibility", "--");

    // Smart Alert
    createSmartAlert(data);

    // AI Weather Insight
    createAIInsight(data, weatherInfo);

    // Agriculture Advice
    createAgricultureAdvice(data);

    // Hourly forecast placeholder
    createHourlyPlaceholder();

    // 15 Day forecast placeholder
    create15DayPlaceholder();
}


// -----------------------------
// Set Text Helper
// -----------------------------
function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.innerText = value;
    }
}


// -----------------------------
// Round Number
// -----------------------------
function round(value) {

    const number = Number(value);

    if (isNaN(number)) {
        return "--";
    }

    return number.toFixed(1);
}


// -----------------------------
// Current Date
// -----------------------------
function getCurrentDate() {

    const date = new Date();

    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// -----------------------------
// Weather Code Information
// WMO Weather Codes
// -----------------------------
function getWeatherCondition(code) {

    const weatherCodes = {

        0: {
            condition: "Clear Sky",
            icon: "☀️"
        },

        1: {
            condition: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            condition: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            condition: "Overcast",
            icon: "☁️"
        },

        45: {
            condition: "Foggy",
            icon: "🌫️"
        },

        48: {
            condition: "Foggy",
            icon: "🌫️"
        },

        51: {
            condition: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            condition: "Drizzle",
            icon: "🌦️"
        },

        55: {
            condition: "Heavy Drizzle",
            icon: "🌧️"
        },

        61: {
            condition: "Light Rain",
            icon: "🌦️"
        },

        63: {
            condition: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            condition: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            condition: "Light Snow",
            icon: "🌨️"
        },

        73: {
            condition: "Snow",
            icon: "❄️"
        },

        75: {
            condition: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            condition: "Rain Showers",
            icon: "🌦️"
        },

        81: {
            condition: "Rain Showers",
            icon: "🌧️"
        },

        82: {
            condition: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            condition: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            condition: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            condition: "Heavy Thunderstorm",
            icon: "⛈️"
        }
    };

    return weatherCodes[code] || {
        condition: "Weather Information",
        icon: "🌤️"
    };
}


// -----------------------------
// Smart Weather Alert
// -----------------------------
function createSmartAlert(data) {

    const temperature = Number(data.temperature);
    const rainfall = Number(data.predicted_rainfall);
    const wind = Number(data.wind_speed);
    const humidity = Number(data.humidity);

    let title = "Weather is Normal";
    let message = "Weather conditions look normal. Have a safe day.";
    let level = "Normal";

    // RED ALERT
    if (
        rainfall >= 30 ||
        wind >= 50 ||
        temperature >= 42
    ) {

        title = "Red Alert";
        level = "High Risk";

        if (rainfall >= 30) {
            message =
                "Heavy rainfall is predicted. Avoid unnecessary travel and stay in a safe place.";
        }
        else if (wind >= 50) {
            message =
                "Very strong winds are expected. Stay away from trees and unsafe structures.";
        }
        else {
            message =
                "Very high temperature detected. Stay hydrated and avoid direct sunlight.";
        }

    }

    // ORANGE ALERT
    else if (
        rainfall >= 15 ||
        wind >= 35 ||
        temperature >= 38
    ) {

        title = "Orange Alert";
        level = "Moderate Risk";

        if (rainfall >= 15) {
            message =
                "Moderate to heavy rain may occur. Carry an umbrella and take care while travelling.";
        }
        else if (wind >= 35) {
            message =
                "Strong winds are possible. Be careful near trees and temporary structures.";
        }
        else {
            message =
                "High temperature detected. Drink enough water and avoid prolonged outdoor activity.";
        }

    }

    // YELLOW ALERT
    else if (
        rainfall >= 5 ||
        wind >= 25 ||
        temperature >= 35 ||
        humidity >= 85
    ) {

        title = "Yellow Alert";
        level = "Be Careful";

        if (rainfall >= 5) {
            message =
                "Rain is possible. Keep an umbrella with you while travelling.";
        }
        else if (temperature >= 35) {
            message =
                "The temperature is high. Stay hydrated and avoid excessive heat.";
        }
        else {
            message =
                "Weather conditions may change. Stay updated before travelling.";
        }

    }

    // Update UI
    setText("alertTitle", title);
    setText("alertMessage", message);
    setText("alertLevel", level);
}


// -----------------------------
// AI Weather Insight
// -----------------------------
function createAIInsight(data, weatherInfo) {

    const temperature = Number(data.temperature);
    const humidity = Number(data.humidity);
    const rainfall = Number(data.predicted_rainfall);
    const wind = Number(data.wind_speed);

    let insight = "";

    if (rainfall >= 20) {

        insight =
            `AI Weather Insight: ${weatherInfo.condition} conditions are observed. ` +
            `The model predicts around ${rainfall.toFixed(1)} mm rainfall. ` +
            `Rain protection is recommended for outdoor activities.`;

    }
    else if (temperature >= 35) {

        insight =
            `AI Weather Insight: The temperature is ${temperature.toFixed(1)}°C ` +
            `with ${humidity.toFixed(0)}% humidity. ` +
            `It may feel hot, so stay hydrated and avoid direct sunlight.`;

    }
    else if (wind >= 30) {

        insight =
            `AI Weather Insight: Wind speed is around ${wind.toFixed(1)} km/h. ` +
            `Outdoor activities should be planned carefully.`;

    }
    else if (humidity >= 80) {

        insight =
            `AI Weather Insight: Humidity is high at ${humidity.toFixed(0)}%. ` +
            `Cloudy or rainy conditions may be possible.`;

    }
    else {

        insight =
            `AI Weather Insight: Current weather is ${weatherInfo.condition} ` +
            `with a temperature of ${temperature.toFixed(1)}°C. ` +
            `Conditions are generally suitable for normal outdoor activities.`;
    }

    setText("aiInsight", insight);
}


// -----------------------------
// Agriculture / Village Advisory
// -----------------------------
function createAgricultureAdvice(data) {

    const temperature = Number(data.temperature);
    const rainfall = Number(data.predicted_rainfall);
    const humidity = Number(data.humidity);

    let advice = "";

    if (rainfall >= 20) {

        advice =
            "🌧️ Heavy rain is expected. Farmers should avoid unnecessary irrigation " +
            "and ensure proper drainage in agricultural fields.";

    }
    else if (rainfall >= 5) {

        advice =
            "🌦️ Rain may occur. Farmers can plan irrigation carefully and protect " +
            "harvested crops from excess moisture.";

    }
    else if (temperature >= 35) {

        advice =
            "☀️ High temperature detected. Crops may require sufficient water. " +
            "Regular irrigation and moisture monitoring are recommended.";

    }
    else if (humidity >= 80) {

        advice =
            "💧 High humidity is present. Farmers should monitor crops for " +
            "fungal diseases and maintain proper field ventilation.";

    }
    else {

        advice =
            "🌱 Weather conditions are generally suitable for routine agricultural " +
            "activities. Continue monitoring weather changes before major field work.";
    }

    setText("agricultureAdvice", advice);
}


// -----------------------------
// Hourly Forecast Placeholder
// -----------------------------
function createHourlyPlaceholder() {

    for (let i = 1; i <= 8; i++) {

        setText(`hourTemp${i}`, "--");
        setText(`hourRain${i}`, "--");
    }
}


// -----------------------------
// 15-Day Forecast Placeholder
// -----------------------------
function create15DayPlaceholder() {

    for (let i = 1; i <= 15; i++) {

        setText(`dayTemp${i}`, "--");
    }
}


// -----------------------------
// Error Message
// -----------------------------
function showError(message) {

    const error = document.getElementById("errorMessage");

    if (error) {
        error.innerText = message;
        error.style.display = "block";
    }
}


function hideError() {

    const error = document.getElementById("errorMessage");

    if (error) {
        error.innerText = "";
        error.style.display = "none";
    }
}


// -----------------------------
// Enter Key Search
// -----------------------------
document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("locationInput");

    if (input) {

        input.addEventListener("keypress", function (event) {

            if (event.key === "Enter") {
                searchWeather();
            }

        });
    }
// -----------------------------
// Use Current Location
// -----------------------------
function getCurrentLocation() {

    if (!navigator.geolocation) {

        showError(
            "Location service is not supported by your browser."
        );

        return;
    }

    showError("Getting your current location...");

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {

                // Reverse geocoding
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
                );

                const data = await response.json();

                if (!data.results || data.results.length === 0) {

                    hideError();

                    // Direct coordinate weather request
                    await getWeatherByCoordinates(
                        latitude,
                        longitude
                    );

                    return;
                }

                const place = data.results[0];

                const locationName =
                    place.name ||
                    place.city ||
                    place.town ||
                    place.village ||
                    "Current Location";

                // Put location name inside search box
                document.getElementById(
                    "locationInput"
                ).value = locationName;

                // Search using location name
                await searchWeather();

            } catch (error) {

                console.error(error);

                showError(
                    "Unable to detect your current location."
                );
            }
        },

        function(error) {

            if (error.code === 1) {

                showError(
                    "Location permission denied. Please allow location access."
                );

            } else if (error.code === 2) {

                showError(
                    "Your location could not be determined."
                );

            } else {

                showError(
                    "Unable to get your current location."
                );
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// -----------------------------
// Weather using Coordinates
// -----------------------------
async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    try {

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,precipitation,weather_code&timezone=auto`
        );

        const weather = await response.json();

        if (!weather.current) {

            throw new Error(
                "Weather data not available."
            );
        }

        const current = weather.current;

        const data = {

            location: "Current Location",

            country: "",

            temperature:
                current.temperature_2m,

            humidity:
                current.relative_humidity_2m,

            pressure:
                current.pressure_msl,

            wind_speed:
                current.wind_speed_10m,

            current_rainfall:
                current.precipitation,

            predicted_rainfall:
                current.precipitation,

            weather_code:
                current.weather_code
        };

        hideError();

        updateWeatherDashboard(data);

    } catch (error) {

        console.error(error);

        showError(
            "Unable to fetch current weather."
        );
    }
}


// -----------------------------
// Add Location
// -----------------------------
function addLocation() {

    const input =
        document.getElementById("locationInput");

    const location =
        input.value.trim();

    if (!location) {

        showError(
            "Please enter a city or village first."
        );

        return;
    }

    let locations =
        JSON.parse(
            localStorage.getItem("weatherLocations")
        ) || [];

    // Avoid duplicate location
    if (!locations.includes(location)) {

        locations.push(location);

        localStorage.setItem(
            "weatherLocations",
            JSON.stringify(locations)
        );
    }

    hideError();

    alert(
        `${location} added successfully!`
    );
}
});