// ============================================================
// WEATHERWISE - COMPLETE FRONTEND JAVASCRIPT
// ============================================================


// ============================================================
// ELEMENTS
// ============================================================

const locationInput =
    document.getElementById("locationInput");

const searchBtn =
    document.getElementById("searchBtn");

const searchForm =
    document.getElementById("searchForm");

const errorMessage =
    document.getElementById("errorMessage");


// ============================================================
// BACKEND API
// ============================================================

const API_URL =
    "http://127.0.0.1:5000/api/weather";


// ============================================================
// SEARCH BUTTON
// ============================================================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            const location =
                locationInput
                    ? locationInput.value.trim()
                    : "";

            if (!location) {

                showError(
                    "Please enter a city, town or village name."
                );

                return;
            }

            getWeather(location);
        }
    );
}


// ============================================================
// SEARCH FORM
// ============================================================

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const location =
                locationInput
                    ? locationInput.value.trim()
                    : "";

            if (!location) {

                showError(
                    "Please enter a city, town or village name."
                );

                return;
            }

            getWeather(location);
        }
    );
}


// ============================================================
// ENTER KEY SEARCH
// ============================================================

if (locationInput) {

    locationInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                const location =
                    locationInput.value.trim();

                if (!location) {

                    showError(
                        "Please enter a location."
                    );

                    return;
                }

                getWeather(location);
            }
        }
    );
}


// ============================================================
// GET WEATHER
// ============================================================

async function getWeather(location) {

    showLoading();

    hideError();

    try {

        const response =
            await fetch(
                `${API_URL}?location=${encodeURIComponent(location)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Location not found."
            );
        }


        updateWeather(data);


    } catch (error) {

        console.error(
            "Weather error:",
            error
        );


        showError(
            error.message ||
            "Unable to fetch weather data."
        );


    } finally {

        stopLoading();
    }
}


// ============================================================
// UPDATE WEATHER
// ============================================================

function updateWeather(data) {


    // --------------------------------------------------------
    // LOCATION
    // --------------------------------------------------------

    setText(
        "locationName",
        data.full_location ||
        data.location ||
        "--"
    );


    setText(
        "country",
        data.country ||
        ""
    );


    setText(
        "currentDate",
        formatDate(
            data.weather_time
        )
    );


    // --------------------------------------------------------
    // CURRENT WEATHER
    // --------------------------------------------------------

    setText(
        "weatherIcon",
        data.weather_icon ||
        "🌤️"
    );


    setText(
        "weatherCondition",
        data.weather_description ||
        "--"
    );


    setText(
        "temperature",
        data.temperature !== undefined
            ? `${Math.round(data.temperature)}°C`
            : "--"
    );


    setText(
        "feelsLike",
        data.feels_like !== undefined
            ? `Feels like ${Math.round(data.feels_like)}°C`
            : "--"
    );


    // --------------------------------------------------------
    // SUNRISE / SUNSET
    // --------------------------------------------------------

    setText(
        "sunrise",
        formatTime(
            data.sunrise
        )
    );


    setText(
        "sunset",
        formatTime(
            data.sunset
        )
    );


    // --------------------------------------------------------
    // WEATHER STATS
    // --------------------------------------------------------

    setText(
        "humidity",
        data.humidity !== undefined
            ? `${data.humidity}%`
            : "--"
    );


    setText(
        "windSpeed",
        data.wind_speed !== undefined
            ? `${Math.round(data.wind_speed)} km/h`
            : "--"
    );


    setText(
        "rainfall",
        data.current_rainfall !== undefined
            ? `${data.current_rainfall} mm`
            : "--"
    );


    setText(
        "uvIndex",
        formatUV(
            data.uv_index
        )
    );


    // --------------------------------------------------------
    // EXTRA DETAILS
    // --------------------------------------------------------

    setText(
        "currentRainfall",
        data.current_rainfall !== undefined
            ? `${data.current_rainfall} mm`
            : "--"
    );


    setText(
        "predictedRainfall",
        data.predicted_rainfall !== undefined
            ? `${Number(data.predicted_rainfall).toFixed(1)} mm`
            : "--"
    );


    setText(
        "detailHumidity",
        data.humidity !== undefined
            ? `${data.humidity}%`
            : "--"
    );


    setText(
        "detailWind",
        data.wind_speed !== undefined
            ? `${Math.round(data.wind_speed)} km/h`
            : "--"
    );


    setText(
        "visibility",
        formatVisibility(
            data.visibility
        )
    );


    setText(
        "pressure",
        data.pressure !== undefined
            ? `${data.pressure} hPa`
            : "--"
    );


    setText(
        "detailRainfall",
        data.precipitation_probability !== undefined
            ? `${data.precipitation_probability}%`
            : "--"
    );


    // --------------------------------------------------------
    // AI INSIGHT
    // --------------------------------------------------------

    setText(
        "aiInsight",
        data.ai_insight ||
        "Weather insight is currently unavailable."
    );


    // --------------------------------------------------------
    // AGRICULTURE
    // --------------------------------------------------------

    setText(
        "agricultureAdvice",
        data.agriculture_advice ||
        "Agriculture advice is currently unavailable."
    );


    // --------------------------------------------------------
    // WEATHER ALERT
    // --------------------------------------------------------

    updateAlert(
        data.alert
    );


    // --------------------------------------------------------
    // HOURLY FORECAST
    // --------------------------------------------------------

    createHourlyForecast(
        data.hourly,
        data.weather_time
    );


    // --------------------------------------------------------
    // 7-DAY FORECAST
    // --------------------------------------------------------

    createDailyForecast(
        data.daily
    );


    // --------------------------------------------------------
    // 15-DAY FORECAST
    // --------------------------------------------------------

    create15DayForecast(
        data.daily
    );


    // --------------------------------------------------------
    // DYNAMIC BACKGROUND
    // --------------------------------------------------------

    updateWeatherBackground(
        data.weather_code,
        data.weather_time,
        data.sunrise,
        data.sunset
    );


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


    if (
        !container ||
        !hourly
    ) {

        return;
    }


    container.innerHTML = "";


    const times =
        hourly.time || [];


    const temperatures =
        hourly.temperature_2m || [];


    const probabilities =
        hourly.precipitation_probability || [];


    const codes =
        hourly.weather_code || [];


    if (!times.length) {

        container.innerHTML =
            "<p>No hourly forecast available.</p>";

        return;
    }


    let startIndex = 0;


    // Find current hour
    if (
        currentTime &&
        times.length > 0
    ) {

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


    const endIndex =
        Math.min(
            startIndex + 6,
            times.length
        );


    for (
        let i = startIndex;
        i < endIndex;
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
                    temperatures[i] ?? 0
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
// 7-DAY FORECAST
// ============================================================

function createDailyForecast(
    daily
) {

    const container =
        document.getElementById(
            "dailyContainer"
        );


    if (
        !container ||
        !daily
    ) {

        return;
    }


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


    const daysToShow =
        Math.min(
            7,
            times.length
        );


    for (
        let i = 0;
        i < daysToShow;
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

            dayName =
                "Today";

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
                    maxTemps[i] ?? 0
                )}°
                /
                ${Math.round(
                    minTemps[i] ?? 0
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
// 15-DAY FORECAST
// ============================================================

function create15DayForecast(
    daily
) {

    /*
     * IMPORTANT:
     * Cards go inside forecast15Grid.
     * Do NOT use forecast15 itself because
     * forecast15 is the complete section.
     */

    const container =
        document.getElementById(
            "forecast15Grid"
        );


    if (
        !container ||
        !daily
    ) {

        return;
    }


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


    const daysToShow =
        Math.min(
            15,
            times.length
        );


    for (
        let i = 0;
        i < daysToShow;
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

            dayName =
                "Today";

        } else {

            dayName =
                new Date(
                    times[i]
                ).toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short",
                        day: "numeric",
                        month: "short"
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
                    maxTemps[i] ?? 0
                )}°
                /
                ${Math.round(
                    minTemps[i] ?? 0
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
// WEATHER ICONS
// ============================================================

function getWeatherIcon(
    code
) {

    const weather = {

        0: [
            "Clear Sky",
            "☀️"
        ],

        1: [
            "Mainly Clear",
            "🌤️"
        ],

        2: [
            "Partly Cloudy",
            "⛅"
        ],

        3: [
            "Cloudy",
            "☁️"
        ],

        45: [
            "Foggy",
            "🌫️"
        ],

        48: [
            "Foggy",
            "🌫️"
        ],

        51: [
            "Light Drizzle",
            "🌦️"
        ],

        53: [
            "Drizzle",
            "🌦️"
        ],

        55: [
            "Heavy Drizzle",
            "🌧️"
        ],

        61: [
            "Light Rain",
            "🌦️"
        ],

        63: [
            "Rain",
            "🌧️"
        ],

        65: [
            "Heavy Rain",
            "🌧️"
        ],

        71: [
            "Light Snow",
            "🌨️"
        ],

        73: [
            "Snow",
            "❄️"
        ],

        75: [
            "Heavy Snow",
            "❄️"
        ],

        80: [
            "Rain Showers",
            "🌦️"
        ],

        81: [
            "Rain Showers",
            "🌧️"
        ],

        82: [
            "Heavy Rain",
            "⛈️"
        ],

        95: [
            "Thunderstorm",
            "⛈️"
        ],

        96: [
            "Thunderstorm",
            "⛈️"
        ],

        99: [
            "Thunderstorm",
            "⛈️"
        ]
    };


    const result =
        weather[code] ||
        [
            "Weather",
            "🌤️"
        ];


    return {

        description:
            result[0],

        icon:
            result[1]
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


    showLoading();


    navigator.geolocation.getCurrentPosition(

        async function (
            position
        ) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            try {

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
                        place.name ||
                        place.city ||
                        place.town ||
                        place.village;


                    if (location) {

                        if (locationInput) {

                            locationInput.value =
                                location;
                        }


                        await getWeather(
                            location
                        );

                    } else {

                        showError(
                            "Unable to identify your location."
                        );
                    }

                } else {

                    showError(
                        "Unable to identify your location."
                    );
                }


            } catch (error) {

                console.error(
                    error
                );


                showError(
                    "Unable to get your current location."
                );


            } finally {

                stopLoading();
            }
        },


        function (error) {

            console.error(
                "Geolocation error:",
                error
            );


            showError(
                "Please allow location permission."
            );


            stopLoading();
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}


// ============================================================
// WEATHER ALERT
// ============================================================

function updateAlert(
    alert
) {

    const alertCard =
        document.getElementById(
            "alerts"
        );


    if (!alert) {

        setText(
            "alertTitle",
            "No Major Weather Alerts"
        );


        setText(
            "alertMessage",
            "Weather conditions are currently stable."
        );


        if (alertCard) {

            alertCard.className =
                "info-card alert safe";
        }


        return;
    }


    setText(
        "alertTitle",
        alert.title ||
        "Weather Alert"
    );


    setText(
        "alertMessage",
        alert.message ||
        "Weather conditions are currently stable."
    );


    let alertType =
        alert.type ||
        "safe";


    if (
        alertType !== "warning" &&
        alertType !== "danger" &&
        alertType !== "safe"
    ) {

        alertType =
            "safe";
    }


    if (alertCard) {

        alertCard.className =
            `info-card alert ${alertType}`;
    }
}


// ============================================================
// DYNAMIC WEATHER BACKGROUND
// DAY + NIGHT
// ============================================================

function updateWeatherBackground(
    weatherCode,
    weatherTime,
    sunrise,
    sunset
) {

    const body =
        document.body;


    body.classList.remove(

        "weather-default",

        "weather-sunny",

        "weather-cloudy",

        "weather-rain",

        "weather-storm",

        "weather-fog",

        "weather-snow",

        "weather-night",

        "weather-night-clear",

        "weather-night-rain",

        "weather-night-storm",

        "weather-night-fog"
    );


    let isNight =
        false;


    if (
        weatherTime &&
        sunrise &&
        sunset
    ) {

        const currentTime =
            new Date(
                weatherTime
            );


        const sunriseTime =
            new Date(
                sunrise
            );


        const sunsetTime =
            new Date(
                sunset
            );


        isNight =
            currentTime < sunriseTime ||
            currentTime > sunsetTime;
    }


    // ========================================================
    // NIGHT
    // ========================================================

    if (isNight) {


        if (
            weatherCode >= 95 &&
            weatherCode <= 99
        ) {

            body.classList.add(
                "weather-night-storm"
            );

            return;
        }


        if (
            weatherCode >= 51 &&
            weatherCode <= 82
        ) {

            body.classList.add(
                "weather-night-rain"
            );

            return;
        }


        if (
            weatherCode >= 45 &&
            weatherCode <= 48
        ) {

            body.classList.add(
                "weather-night-fog"
            );

            return;
        }


        body.classList.add(
            "weather-night-clear"
        );

        return;
    }


    // ========================================================
    // DAY
    // ========================================================

    let weatherClass =
        "weather-default";


    if (
        weatherCode === 0
    ) {

        weatherClass =
            "weather-sunny";

    } else if (
        weatherCode >= 1 &&
        weatherCode <= 3
    ) {

        weatherClass =
            "weather-cloudy";

    } else if (
        weatherCode >= 45 &&
        weatherCode <= 48
    ) {

        weatherClass =
            "weather-fog";

    } else if (
        weatherCode >= 51 &&
        weatherCode <= 67
    ) {

        weatherClass =
            "weather-rain";

    } else if (
        weatherCode >= 71 &&
        weatherCode <= 77
    ) {

        weatherClass =
            "weather-snow";

    } else if (
        weatherCode >= 80 &&
        weatherCode <= 82
    ) {

        weatherClass =
            "weather-rain";

    } else if (
        weatherCode >= 85 &&
        weatherCode <= 86
    ) {

        weatherClass =
            "weather-snow";

    } else if (
        weatherCode >= 95 &&
        weatherCode <= 99
    ) {

        weatherClass =
            "weather-storm";
    }


    body.classList.add(
        weatherClass
    );
}


// ============================================================
// 15-DAY FORECAST UI
// ============================================================

function show15DayForecast() {

    const forecast15 =
        document.getElementById(
            "forecast15"
        );


    const dailyForecast =
        document.getElementById(
            "dailyForecast"
        );


    const sevenDayTab =
        document.getElementById(
            "sevenDayTab"
        );


    const fifteenDayTab =
        document.getElementById(
            "fifteenDayTab"
        );


    if (!forecast15) {
        return;
    }


    forecast15.hidden =
        false;


    if (dailyForecast) {

        dailyForecast.hidden =
            true;
    }


    if (sevenDayTab) {

        sevenDayTab.classList.remove(
            "active"
        );
    }


    if (fifteenDayTab) {

        fifteenDayTab.classList.add(
            "active"
        );
    }


    forecast15.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ============================================================
// SHOW 7-DAY FORECAST
// ============================================================

function show7DayForecast() {

    const forecast15 =
        document.getElementById(
            "forecast15"
        );


    const dailyForecast =
        document.getElementById(
            "dailyForecast"
        );


    const sevenDayTab =
        document.getElementById(
            "sevenDayTab"
        );


    const fifteenDayTab =
        document.getElementById(
            "fifteenDayTab"
        );


    if (forecast15) {

        forecast15.hidden =
            true;
    }


    if (dailyForecast) {

        dailyForecast.hidden =
            false;
    }


    if (fifteenDayTab) {

        fifteenDayTab.classList.remove(
            "active"
        );
    }


    if (sevenDayTab) {

        sevenDayTab.classList.add(
            "active"
        );
    }


    if (dailyForecast) {

        dailyForecast.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        item.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        !targetId.startsWith("#")
                    ) {

                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });


                    navItems.forEach(
                        function (nav) {

                            nav.classList.remove(
                                "active"
                            );
                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    /*
                     * Temporary focus effect
                     */

                    target.classList.remove(
                        "navigation-focus"
                    );


                    setTimeout(
                        function () {

                            target.classList.add(
                                "navigation-focus"
                            );

                        },
                        50
                    );


                    setTimeout(
                        function () {

                            target.classList.remove(
                                "navigation-focus"
                            );

                        },
                        1200
                    );
                }
            );
        }
    );


    // --------------------------------------------------------
    // NEXT 6 HOURS
    // --------------------------------------------------------

    const nextHoursBtn =
        document.getElementById(
            "nextHoursBtn"
        );


    if (nextHoursBtn) {

        nextHoursBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const forecast =
                    document.getElementById(
                        "forecast"
                    );


                if (forecast) {

                    forecast.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    }


    // --------------------------------------------------------
    // AI CARD
    // --------------------------------------------------------

    const aiCard =
        document.getElementById(
            "aiInsights"
        );


    if (aiCard) {

        aiCard.addEventListener(
            "click",
            function () {

                aiCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        );
    }


    // --------------------------------------------------------
    // AGRICULTURE CARD
    // --------------------------------------------------------

    const agricultureCard =
        document.getElementById(
            "agriculture"
        );


    if (agricultureCard) {

        agricultureCard.addEventListener(
            "click",
            function () {

                agricultureCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        );
    }


    // --------------------------------------------------------
    // ALERT CARD
    // --------------------------------------------------------

    const alertCard =
        document.getElementById(
            "alerts"
        );


    if (alertCard) {

        alertCard.addEventListener(
            "click",
            function () {

                alertCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        );
    }
}


// ============================================================
// FORECAST BUTTONS
// ============================================================

function setupForecastButtons() {

    const fullForecast =
        document.getElementById(
            "fullForecast"
        );


    const sevenDayTab =
        document.getElementById(
            "sevenDayTab"
        );


    const fifteenDayTab =
        document.getElementById(
            "fifteenDayTab"
        );


    const close15Day =
        document.getElementById(
            "close15Day"
        );


    if (fullForecast) {

        fullForecast.addEventListener(
            "click",
            function () {

                show15DayForecast();

            }
        );
    }


    if (fifteenDayTab) {

        fifteenDayTab.addEventListener(
            "click",
            function () {

                show15DayForecast();

            }
        );
    }


    if (sevenDayTab) {

        sevenDayTab.addEventListener(
            "click",
            function () {

                show7DayForecast();

            }
        );
    }


    if (close15Day) {

        close15Day.addEventListener(
            "click",
            function () {

                show7DayForecast();

            }
        );
    }
}


// ============================================================
// LOADING
// ============================================================

function showLoading() {

    if (!searchBtn) {
        return;
    }


    searchBtn.disabled =
        true;


    if (
        !searchBtn.dataset.originalText
    ) {

        searchBtn.dataset.originalText =
            searchBtn.innerHTML;
    }


    searchBtn.innerHTML =
        "⏳";
}


function stopLoading() {

    if (!searchBtn) {
        return;
    }


    searchBtn.disabled =
        false;


    searchBtn.innerHTML =
        searchBtn.dataset.originalText ||
        "⌕";
}


// ============================================================
// ERROR
// ============================================================

function showError(
    message
) {

    stopLoading();


    if (!errorMessage) {
        return;
    }


    errorMessage.textContent =
        message;


    errorMessage.classList.add(
        "show"
    );
}


function hideError() {

    if (!errorMessage) {
        return;
    }


    errorMessage.classList.remove(
        "show"
    );
}


// ============================================================
// SET TEXT
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


// ============================================================
// UV FORMAT
// ============================================================

function formatUV(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "--";
    }


    let level =
        "Low";


    if (
        value >= 8
    ) {

        level =
            "Very High";

    } else if (
        value >= 6
    ) {

        level =
            "High";

    } else if (
        value >= 3
    ) {

        level =
            "Moderate";
    }


    return `${Number(value).toFixed(1)} (${level})`;
}


// ============================================================
// VISIBILITY FORMAT
// ============================================================

function formatVisibility(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "--";
    }


    return `${(
        Number(value) / 1000
    ).toFixed(1)} km`;
}


// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(
    time
) {

    if (!time) {
        return "--";
    }


    const date =
        new Date(
            time
        );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );
}


// ============================================================
// HOUR FORMAT
// ============================================================

function formatHour(
    time
) {

    if (!time) {
        return "--";
    }


    const date =
        new Date(
            time
        );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            hour12: true
        }
    );
}


// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(
    time
) {

    if (!time) {
        return "--";
    }


    const date =
        new Date(
            time
        );


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
// MAKE FUNCTIONS AVAILABLE TO HTML
// ============================================================

window.getWeather =
    getWeather;


window.useMyLocation =
    useMyLocation;


window.show15DayForecast =
    show15DayForecast;


window.show7DayForecast =
    show7DayForecast;


// ============================================================
// INITIALIZE
// ============================================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        setupNavigation();

        setupForecastButtons();

        getWeather(
            "Pune"
        );

    }
);