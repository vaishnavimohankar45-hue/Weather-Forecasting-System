import joblib
import numpy as np

# Trained model load karo
model = joblib.load("weather_model.pkl")


def predict_rainfall(
    temperature,
    humidity,
    pressure,
    wind_speed
):

    # Input data
    input_data = np.array([
        [
            temperature,
            humidity,
            pressure,
            wind_speed
        ]
    ])

    # Prediction
    prediction = model.predict(input_data)

    return round(float(prediction[0]), 2)


# Test prediction
if __name__ == "__main__":

    result = predict_rainfall(
        temperature=25,
        humidity=70,
        pressure=1010,
        wind_speed=15
    )

    print(
        "Predicted Rainfall:",
        result,
        "mm"
    )