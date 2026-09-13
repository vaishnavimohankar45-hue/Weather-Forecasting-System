async function searchWeather() {

    const locationInput = document.getElementById("locationInput");
    const location = locationInput.value.trim();

    const errorMessage = document.getElementById("errorMessage");

    if (location === "") {
        errorMessage.textContent = "Please enter a location.";
        return;
    }

    errorMessage.textContent = "";

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/api/weather?location=${encodeURIComponent(location)}`
        );

        const data = await response.json();

        if (!response.ok) {
            errorMessage.textContent =
                data.error || "Location not found.";
            return;
        }

        // Location
        document.getElementById("locationName").textContent =
            data.location;

        document.getElementById("country").textContent =
            data.country;

        // Weather information
        document.getElementById("temperature").textContent =
            data.temperature + " °C";

        document.getElementById("humidity").textContent =
            data.humidity + " %";

        document.getElementById("windSpeed").textContent =
            data.wind_speed + " km/h";

        document.getElementById("currentRainfall").textContent =
            data.current_rainfall + " mm";

        document.getElementById("predictedRainfall").textContent =
            data.predicted_rainfall + " mm";

        document.getElementById("pressure").textContent =
            data.pressure + " hPa";

        // Coordinates
        document.getElementById("latitude").textContent =
            data.latitude;

        document.getElementById("longitude").textContent =
            data.longitude;

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to connect to the weather server. Please make sure the Python backend is running.";
    }
}


// Press Enter to search
document.getElementById("locationInput").addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            searchWeather();
        }

    }
);