import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Dataset load karo
data = pd.read_csv("data/weather_data.csv")

# Input features
X = data[
    [
        "temperature",
        "humidity",
        "pressure",
        "wind_speed"
    ]
]

# Target variable
y = data["rainfall"]

# Model create karo
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

# Model train karo
model.fit(X, y)

# Model save karo
joblib.dump(model, "weather_model.pkl")

print("Model training completed successfully!")
print("Model saved at: weather_model.pkl")