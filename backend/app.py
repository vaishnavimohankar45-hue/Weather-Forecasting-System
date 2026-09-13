from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import joblib

app = Flask(__name__)
CORS(app)

# ML model load karo
model = joblib.load("weather_model.pkl")


# Home route
@app.route("/")
def home():
    return jsonify({
        "message": "Weather Forecasting Backend is running!"
    })


# Weather route
@app.route("/api/weather", methods=["GET"])
def get_weather():

    location = request.args.get("location")

    if not location:
        return jsonify({
            "error": "Please enter a location"
        }), 400

    try:

        # -----------------------------------
        # 1. Location search
        # -----------------------------------

        geo_url = "https://geocoding-api.open-meteo.com/v1/search"

        geo_params = {
            "name": location,
            "count": 10,
            "language": "en",
            "format": "json"
        }

        geo_response = requests.get(
            geo_url,
            params=geo_params,
            timeout=10
        )

        geo_data = geo_response.json()

        if "results" not in geo_data:
            return jsonify({
                "error": "Location not found"
            }), 404

        # Best matching location
        place = geo_data["results"][0]

        latitude = place["latitude"]
        longitude = place["longitude"]


        # -----------------------------------
        # 2. Weather data
        # -----------------------------------

        weather_url = "https://api.open-meteo.com/v1/forecast"

        weather_params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,precipitation,weather_code",
            "timezone": "auto"
        }

        weather_response = requests.get(
            weather_url,
            params=weather_params,
            timeout=10
        )

        weather_data = weather_response.json()

        current = weather_data["current"]


        # -----------------------------------
        # 3. ML Rainfall Prediction
        # -----------------------------------

        temperature = current["temperature_2m"]
        humidity = current["relative_humidity_2m"]
        pressure = current["pressure_msl"]
        wind_speed = current["wind_speed_10m"]

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


        # -----------------------------------
        # 4. Send response
        # -----------------------------------

        return jsonify({

            "location": place["name"],

            "country": place.get(
                "country",
                ""
            ),

            "latitude": latitude,

            "longitude": longitude,

            "temperature": temperature,

            "humidity": humidity,

            "pressure": pressure,

            "wind_speed": wind_speed,

            "current_rainfall": current["precipitation"],

            "predicted_rainfall": predicted_rainfall,

            "weather_code": current["weather_code"]

        })


    except Exception as e:

        print("Error:", e)

        return jsonify({
            "error": "Unable to fetch weather data"
        }), 500


# -----------------------------------
# Start Flask server
# -----------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )