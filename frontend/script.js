// ============================================================
// WEATHERWISE JAVASCRIPT
// ============================================================

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");


// ============================================================
// SEARCH FORM
// ============================================================

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const location = cityInput.value.trim();

    if (!location) {

        showError(
            "Please enter a city, town or village name."
        );

        return;
    }

    getWeather(location);

});


// ============================================================
// GET WEATHER
// ============================================================

async function getWeather(location) {

    showLoading();

    try {

        const response = await fetch(
            `/api/weather?location=${encodeURIComponent(location)}`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Location not found."
            );

        }

        updateWeather(data);

    } catch (error) {

        console.error(
            "Weather error:",
            error
        );

        showError(
            error.message
        );

    }

}


// ============================================================
// UPDATE WEATHER
// ============================================================

function updateWeather(data) {

    // --------------------------------------------------------
    // Location
    // --------------------------------------------------------

    setText(
        "locationName",
        data.full_location
    );

    setText(
        "weatherDate",
        formatDate(
            data.weather_time
        )
    );


    // --------------------------------------------------------
    // Current weather
    // --------------------------------------------------------

    setText(
        "temperature",
        `${Math.round(data.temperature)}°C`
    );

    setText(
        "condition",
        data.weather_description
    );

    setText(
        "feelsLike",
        `Feels like ${Math.round(data.feels_like)}°C`
    );

    setText(
        "weatherIcon",
        data.weather_icon
    );


    // --------------------------------------------------------
    // Weather statistics
    // --------------------------------------------------------

    setText(
        "humidity",
        `${data.humidity}%`
    );

    setText(
        "windSpeed",
        `${Math.round(data.wind_speed)} km/h`
    );

    setText(
        "rainfall",
        `${data.precipitation_probability}%`
    );

    setText(
        "uvIndex",
        formatUV(data.uv_index)
    );


    // --------------------------------------------------------
    // AI Insight
    // --------------------------------------------------------

    setText(
        "aiInsight",
        data.ai_insight
    );


    // --------------------------------------------------------
    // Agriculture
    // --------------------------------------------------------

    setText(
        "agricultureAdvice",
        data.agriculture_advice
    );


    // --------------------------------------------------------
    // Alert
    // --------------------------------------------------------

    setText(
        "alertTitle",
        data.alert.title
    );

    setText(
        "alertMessage",
        data.alert.message
    );


    // --------------------------------------------------------
    // Change alert style
    // --------------------------------------------------------

    const alertCard =
        document.getElementById(
            "alertCard"
        );

    alertCard.className =
        `info-card alert ${data.alert.type}`;


    // --------------------------------------------------------
    // Hourly forecast
    // --------------------------------------------------------

    createHourlyForecast(
        data.hourly,
        data.weather_time
    );


    // --------------------------------------------------------
    // Daily forecast
    // --------------------------------------------------------

    createDailyForecast(
        data.daily
    );


// --------------------------------------------------------
// Weather background
// --------------------------------------------------------

updateWeatherBackground(
    data.weather_code
);

    // --------------------------------------------------------
    // Hide error
    // --------------------------------------------------------

    hideError();

}


// ============================================================
// HOURLY FORECAST
// ============================================================

function createHourlyForecast(
    hourly,
    currentTime
) {

    const container =
        document.getElementById(
            "hourlyContainer"
        );

    container.innerHTML = "";

    const times =
        hourly.time || [];

    const temperatures =
        hourly.temperature_2m || [];

    const probabilities =
        hourly.precipitation_probability || [];

    const codes =
        hourly.weather_code || [];


    let startIndex = 0;

    if (currentTime) {

        const currentHour =
            currentTime.substring(
                0,
                13
            );

        for (
            let i = 0;
            i < times.length;
            i++
        ) {

            if (
                times[i].substring(
                    0,
                    13
                ) >= currentHour
            ) {

                startIndex = i;

                break;
            }

        }

    }


    for (
        let i = startIndex;
        i < Math.min(
            startIndex + 6,
            times.length
        );
        i++
    ) {

        const code =
            codes[i] ?? 0;

        const weather =
            getWeatherIcon(code);

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "hour-card";


        const label =
            i === startIndex
                ? "Now"
                : formatHour(
                    times[i]
                );


        card.innerHTML = `

            <b>${label}</b>

            <span class="mini-icon">
                ${weather.icon}
            </span>

            <strong>
                ${Math.round(
                    temperatures[i]
                )}°
            </strong>

            <small>
                💧 ${probabilities[i] ?? 0}%
            </small>

        `;

        container.appendChild(
            card
        );

    }

}


// ============================================================
// DAILY FORECAST
// ============================================================

function createDailyForecast(
    daily
) {

    const container =
        document.getElementById(
            "dailyContainer"
        );

    container.innerHTML = "";

    const times =
        daily.time || [];

    const maxTemps =
        daily.temperature_2m_max || [];

    const minTemps =
        daily.temperature_2m_min || [];

    const probabilities =
        daily.precipitation_probability_max || [];

    const codes =
        daily.weather_code || [];


    for (
        let i = 0;
        i < Math.min(
            7,
            times.length
        );
        i++
    ) {

        const weather =
            getWeatherIcon(
                codes[i] ?? 0
            );

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "day-card";


        let dayName;

        if (i === 0) {

            dayName = "Today";

        } else {

            dayName =
                new Date(
                    times[i]
                ).toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );

        }


        card.innerHTML = `

            <b>${dayName}</b>

            <span>
                ${weather.icon}
            </span>

            <strong>
                ${Math.round(
                    maxTemps[i]
                )}° /
                ${Math.round(
                    minTemps[i]
                )}°
            </strong>

            <small>
                💧 ${probabilities[i] ?? 0}%
            </small>

        `;

        container.appendChild(
            card
        );

    }

}


// ============================================================
// WEATHER ICON
// ============================================================

function getWeatherIcon(
    code
) {

    const weather = {

        0: ["Clear Sky", "☀️"],

        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Cloudy", "☁️"],

        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],

        51: ["Light Drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy Drizzle", "🌧️"],

        61: ["Light Rain", "🌦️"],
        63: ["Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],

        71: ["Light Snow", "🌨️"],
        73: ["Snow", "❄️"],
        75: ["Heavy Snow", "❄️"],

        80: ["Rain Showers", "🌦️"],
        81: ["Rain Showers", "🌧️"],
        82: ["Heavy Rain", "⛈️"],

        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm", "⛈️"],
        99: ["Thunderstorm", "⛈️"]

    };

    const result =
        weather[code] ||
        ["Weather", "🌤️"];

    return {
        description: result[0],
        icon: result[1]
    };

}


// ============================================================
// USE MY LOCATION
// ============================================================

function useMyLocation() {

    if (
        !navigator.geolocation
    ) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            showLoading();


            try {

                // Reverse geocoding
                const response =
                    await fetch(
                        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
                    );


                const data =
                    await response.json();


                if (
                    data.results &&
                    data.results.length > 0
                ) {

                    const place =
                        data.results[0];

                    const location =
                        place.name;

                    cityInput.value =
                        location;

                    getWeather(
                        location
                    );

                } else {

                    showError(
                        "Unable to identify your location."
                    );

                }

            } catch (error) {

                showError(
                    "Unable to get your location."
                );

            }

        },

        function () {

            showError(
                "Please allow location permission."
            );

        }

    );

}


// ============================================================
// LOADING
// ============================================================

function showLoading() {

    const button =
        document.getElementById(
            "searchButton"
        );

    button.innerHTML =
        "⏳";

    button.disabled =
        true;

}


function stopLoading() {

    const button =
        document.getElementById(
            "searchButton"
        );

    button.innerHTML =
        "⌕";

    button.disabled =
        false;

}


// ============================================================
// ERROR
// ============================================================

function showError(
    message
) {

    stopLoading();

    const error =
        document.getElementById(
            "errorMessage"
        );

    error.textContent =
        message;

    error.classList.add(
        "show"
    );

}


function hideError() {

    stopLoading();

    const error =
        document.getElementById(
            "errorMessage"
        );

    error.classList.remove(
        "show"
    );

}


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );

    if (element) {

        element.textContent =
            value ?? "--";

    }

}


function formatUV(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "--";

    }

    let level = "Low";

    if (value >= 8) {

        level = "Very High";

    } else if (value >= 6) {

        level = "High";

    } else if (value >= 3) {

        level = "Moderate";

    }

    return `${value} (${level})`;

}


function formatHour(
    time
) {

    const date =
        new Date(time);

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            hour12: true
        }
    );

}


function formatDate(
    time
) {

    if (!time) {

        return "";

    }

    const date =
        new Date(time);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ============================================================
// INITIAL WEATHER
// ============================================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        getWeather(
            "Pune"
        );

    }
);
// ============================================================
// DYNAMIC WEATHER BACKGROUND
// ============================================================

function updateWeatherBackground(weatherCode) {

    const body = document.body;

    body.classList.remove(
        "weather-default",
        "weather-sunny",
        "weather-cloudy",
        "weather-rain",
        "weather-storm",
        "weather-fog",
        "weather-snow"
    );


    let weatherClass = "weather-default";


    if (weatherCode === 0) {

        weatherClass = "weather-sunny";

    }

    else if (
        weatherCode >= 1 &&
        weatherCode <= 3
    ) {

        weatherClass = "weather-cloudy";

    }

    else if (
        weatherCode >= 45 &&
        weatherCode <= 48
    ) {

        weatherClass = "weather-fog";

    }

    else if (
        weatherCode >= 51 &&
        weatherCode <= 67
    ) {

        weatherClass = "weather-rain";

    }

    else if (
        weatherCode >= 71 &&
        weatherCode <= 77
    ) {

        weatherClass = "weather-snow";

    }

    else if (
        weatherCode >= 80 &&
        weatherCode <= 82
    ) {

        weatherClass = "weather-rain";

    }

    else if (
        weatherCode >= 85 &&
        weatherCode <= 86
    ) {

        weatherClass = "weather-snow";

    }

    else if (
        weatherCode >= 95 &&
        weatherCode <= 99
    ) {

        weatherClass = "weather-storm";

    }


    body.classList.add(weatherClass);
}