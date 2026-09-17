from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import joblib
import os
from datetime import datetime

# ============================================================
# FLASK APP
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
FRONTEND_DIR = os.path.join(PROJECT_DIR, "frontend")

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)

CORS(app)


# ============================================================
# LOAD ML MODEL
# ============================================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "weather_model.pkl"
)

try:
    model = joblib.load(MODEL_PATH)
    print("ML model loaded successfully.")
except Exception as e:
    model = None
    print("ML model could not be loaded:", e)


# ============================================================
# WEATHER CODE FUNCTION
# ============================================================

def get_weather_description(code):

    weather_codes = {

        0: ("Clear Sky", "☀️"),

        1: ("Mainly Clear", "🌤️"),
        2: ("Partly Cloudy", "⛅"),
        3: ("Cloudy", "☁️"),

        45: ("Foggy", "🌫️"),
        48: ("Foggy", "🌫️"),

        51: ("Light Drizzle", "🌦️"),
        53: ("Moderate Drizzle", "🌦️"),
        55: ("Heavy Drizzle", "🌧️"),

        56: ("Freezing Drizzle", "🌧️"),
        57: ("Freezing Drizzle", "🌧️"),

        61: ("Light Rain", "🌦️"),
        63: ("Moderate Rain", "🌧️"),
        65: ("Heavy Rain", "🌧️"),

        66: ("Freezing Rain", "🌧️"),
        67: ("Heavy Freezing Rain", "🌧️"),

        71: ("Light Snow", "🌨️"),
        73: ("Moderate Snow", "❄️"),
        75: ("Heavy Snow", "❄️"),
        77: ("Snow Grains", "❄️"),

        80: ("Rain Showers", "🌦️"),
        81: ("Moderate Rain Showers", "🌧️"),
        82: ("Heavy Rain Showers", "⛈️"),

        85: ("Snow Showers", "🌨️"),
        86: ("Heavy Snow Showers", "❄️"),

        95: ("Thunderstorm", "⛈️"),
        96: ("Thunderstorm with Hail", "⛈️"),
        99: ("Heavy Thunderstorm", "⛈️")
    }

    return weather_codes.get(
        int(code),
        ("Unknown Weather", "🌤️")
    )


# ============================================================
# WEATHER THEME
# ============================================================

def get_weather_theme(code):

    code = int(code)

    if code == 0:
        return "clear"

    if code in [1, 2, 3]:
        return "cloudy"

    if 51 <= code <= 67:
        return "rainy"

    if 80 <= code <= 82:
        return "rainy"

    if 95 <= code <= 99:
        return "storm"

    return "default"


# ============================================================
# AI WEATHER INSIGHT
# ============================================================

def generate_weather_insight(
    temperature,
    humidity,
    rain_probability,
    weather_code
):

    if weather_code >= 95:

        return (
            "Thunderstorm conditions are possible. "
            "Avoid open areas and outdoor activities."
        )

    if rain_probability >= 70:

        return (
            "High chance of rain today. "
            "Carry an umbrella and avoid unnecessary outdoor activities."
        )

    if humidity >= 80:

        return (
            "High humidity is expected. "
            "Stay hydrated and take breaks during outdoor activities."
        )

    if temperature >= 35:

        return (
            "High temperature is expected. "
            "Avoid prolonged exposure to direct sunlight."
        )

    if temperature <= 15:

        return (
            "Cool weather is expected. "
            "Keep warm and plan outdoor activities accordingly."
        )

    return (
        "Weather conditions look comfortable today. "
        "Outdoor activities can be planned normally."
    )


# ============================================================
# AGRICULTURE ADVISORY
# ============================================================

def generate_agriculture_advice(
    temperature,
    humidity,
    rain_probability
):

    if rain_probability >= 70:

        return (
            "Rain is likely. Avoid unnecessary irrigation "
            "and ensure proper drainage in fields."
        )

    if temperature >= 35:

        return (
            "High temperature expected. "
            "Provide adequate irrigation and protect crops from heat stress."
        )

    if humidity >= 80:

        return (
            "High humidity may increase fungal disease risk. "
            "Monitor crops regularly."
        )

    return (
        "Weather conditions are suitable for routine field activities. "
        "Monitor soil moisture before irrigation."
    )


# ============================================================
# WEATHER ALERT
# ============================================================

def generate_alert(
    weather_code,
    rain_probability,
    wind_speed
):

    if weather_code >= 95:

        return {
            "type": "danger",
            "title": "Storm Alert",
            "message": "Thunderstorm conditions may occur. Stay alert."
        }

    if rain_probability >= 80:

        return {
            "type": "danger",
            "title": "Heavy Rain Alert",
            "message": "Heavy rainfall may occur in your area."
        }

    if wind_speed >= 40:

        return {
            "type": "warning",
            "title": "Wind Alert",
            "message": "Strong winds are expected."
        }

    if rain_probability >= 50:

        return {
            "type": "warning",
            "title": "Rain Alert",
            "message": "Rain is possible. Carry rain protection."
        }

    return {
        "type": "safe",
        "title": "No Major Weather Alerts",
        "message": "Weather conditions are currently stable."
    }


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def home():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# ============================================================
# API STATUS
# ============================================================

@app.route("/api/status")
def status():

    return jsonify({
        "status": "running",
        "message": "WeatherWise Python Flask Backend is running"
    })


# ============================================================
# WEATHER API
# ============================================================

@app.route("/api/weather", methods=["GET"])
def get_weather():

    location = request.args.get(
        "location",
        ""
    ).strip()

    if not location:

        return jsonify({
            "error": "Please enter a city, town or village name."
        }), 400

    try:

        # ====================================================
        # 1. GEOCODING
        # ====================================================

        geo_url = (
            "https://geocoding-api.open-meteo.com/v1/search"
        )

        geo_params = {

            "name": location,

            "count": 10,

            "language": "en",

            "format": "json",

            "countryCode": "IN"
        }

        geo_response = requests.get(
            geo_url,
            params=geo_params,
            timeout=10
        )

        geo_response.raise_for_status()

        geo_data = geo_response.json()

        results = geo_data.get(
            "results",
            []
        )

        if not results:

            return jsonify({
                "error":
                    f"Location '{location}' was not found. "
                    "Try another spelling or nearby town/city."
            }), 404

        # First valid result
        place = results[0]

        latitude = place["latitude"]
        longitude = place["longitude"]

        place_name = place.get(
            "name",
            location
        )

        state = place.get(
            "admin1",
            ""
        )

        country = place.get(
            "country",
            "India"
        )

        full_location = ", ".join(
            filter(
                None,
                [
                    place_name,
                    state,
                    country
                ]
            )
        )

        # ====================================================
        # 2. WEATHER API
        # ====================================================

        weather_url = (
            "https://api.open-meteo.com/v1/forecast"
        )

        weather_params = {

            "latitude": latitude,

            "longitude": longitude,

            "current": ",".join([
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "pressure_msl",
                "wind_speed_10m",
                "precipitation",
                "weather_code"
            ]),

            "hourly": ",".join([
                "temperature_2m",
                "precipitation_probability",
                "precipitation",
                "weather_code",
                "visibility",
                "uv_index"
            ]),

            "daily": ",".join([
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_probability_max",
                "precipitation_sum",
                "weather_code",
                "sunrise",
                "sunset",
                "uv_index_max"
            ]),

            "forecast_days": 15,

            "timezone": "auto"
        }

        weather_response = requests.get(
            weather_url,
            params=weather_params,
            timeout=15
        )

        weather_response.raise_for_status()

        weather_data = weather_response.json()

        if "current" not in weather_data:

            return jsonify({
                "error": "Weather data unavailable."
            }), 500

        # ====================================================
        # 3. CURRENT WEATHER
        # ====================================================

        current = weather_data["current"]

        temperature = current.get(
            "temperature_2m"
        )

        humidity = current.get(
            "relative_humidity_2m"
        )

        feels_like = current.get(
            "apparent_temperature"
        )

        pressure = current.get(
            "pressure_msl"
        )

        wind_speed = current.get(
            "wind_speed_10m"
        )

        current_rainfall = current.get(
            "precipitation"
        )

        weather_code = current.get(
            "weather_code",
            0
        )

        description, icon = get_weather_description(
            weather_code
        )

        theme = get_weather_theme(
            weather_code
        )

        # ====================================================
        # 4. HOURLY
        # ====================================================

        hourly = weather_data.get(
            "hourly",
            {}
        )

        # ====================================================
        # 5. DAILY
        # ====================================================

        daily = weather_data.get(
            "daily",
            {}
        )

        # ====================================================
        # 6. FIND CURRENT HOURLY INDEX
        # ====================================================

        current_time = current.get(
            "time"
        )

        hourly_times = hourly.get(
            "time",
            []
        )

        hourly_index = 0

        if current_time and hourly_times:

            current_hour = current_time[:13]

            for i, time_value in enumerate(
                hourly_times
            ):

                if time_value[:13] >= current_hour:

                    hourly_index = i
                    break

        # ====================================================
        # 7. CURRENT UV / VISIBILITY
        # ====================================================

        uv_values = hourly.get(
            "uv_index",
            []
        )

        visibility_values = hourly.get(
            "visibility",
            []
        )

        current_uv = (
            uv_values[hourly_index]
            if hourly_index < len(uv_values)
            else None
        )

        current_visibility = (
            visibility_values[hourly_index]
            if hourly_index < len(visibility_values)
            else None
        )

        # ====================================================
        # 8. RAIN PROBABILITY
        # ====================================================

        precipitation_probability = 0

        probability_values = hourly.get(
            "precipitation_probability",
            []
        )

        if hourly_index < len(
            probability_values
        ):

            precipitation_probability = (
                probability_values[hourly_index]
            )

        # ====================================================
        # 9. ML PREDICTION
        # ====================================================

        predicted_rainfall = None

        if model is not None:

            try:

                prediction_input = [[
                    temperature,
                    humidity,
                    pressure,
                    wind_speed
                ]]

                predicted_rainfall = model.predict(
                    prediction_input
                )[0]

                predicted_rainfall = round(
                    float(predicted_rainfall),
                    2
                )

            except Exception as e:

                print(
                    "ML prediction error:",
                    e
                )

        # ====================================================
        # 10. INSIGHTS
        # ====================================================

        insight = generate_weather_insight(
            temperature,
            humidity,
            precipitation_probability,
            weather_code
        )

        agriculture = generate_agriculture_advice(
            temperature,
            humidity,
            precipitation_probability
        )

        alert = generate_alert(
            weather_code,
            precipitation_probability,
            wind_speed
        )

        # ====================================================
        # 11. RESPONSE
        # ====================================================

        return jsonify({

            "location": place_name,

            "state": state,

            "country": country,

            "full_location": full_location,

            "latitude": latitude,

            "longitude": longitude,

            # Current weather
            "temperature": temperature,

            "humidity": humidity,

            "feels_like": feels_like,

            "pressure": pressure,

            "wind_speed": wind_speed,

            "current_rainfall": current_rainfall,

            "predicted_rainfall":
                predicted_rainfall,

            "weather_code":
                weather_code,

            "weather_description":
                description,

            "weather_icon":
                icon,

            "weather_theme":
                theme,

            "precipitation_probability":
                precipitation_probability,

            "uv_index":
                current_uv,

            "visibility":
                current_visibility,

            "weather_time":
                current_time,

            # Sunrise / sunset
            "sunrise":
                daily["sunrise"][0]
                if daily.get("sunrise")
                else None,

            "sunset":
                daily["sunset"][0]
                if daily.get("sunset")
                else None,

            # Insights
            "ai_insight":
                insight,

            "agriculture_advice":
                agriculture,

            "alert":
                alert,

            # Forecast
            "hourly":
                hourly,

            "daily":
                daily

        })

    except requests.exceptions.RequestException as e:

        print(
            "API request error:",
            e
        )

        return jsonify({
            "error":
                "Unable to connect to weather service."
        }), 503

    except Exception as e:

        print(
            "Server error:",
            e
        )

        return jsonify({
            "error":
                "Unable to fetch weather data."
        }), 500


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )