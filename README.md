# 🌦️ WeatherWise – Weather Forecasting System

WeatherWise is a weather forecasting web application that helps users check current weather conditions and forecasts through an interactive and user-friendly dashboard.

## ✨ Features

- 🌍 **Location Search:** Search for weather by city, town, or village.
- 📍 **Use My Location:** Get weather information using browser location permission.
- 🌡️ **Current Weather:** View temperature, feels-like temperature, humidity, wind speed, and weather conditions.
- 🕒 **Hourly Forecast:** View upcoming hourly weather using navigation arrows.
- 📅 **7-Day Forecast:** View daily maximum and minimum temperatures.
- 🗓️ **15-Day Forecast View:** Open the extended forecast section using the View 15 Days option, depending on the data provided by the backend.
- 🌅 **Sunrise and Sunset:** View sunrise and sunset times.
- 🌧️ **Rainfall Information:** Check rainfall and precipitation probability.
- ☀️ **UV Index:** View the UV index and its category.
- ⚠️ **Weather Alerts:** Display weather alert messages and status information.
- 🎨 **Dynamic Interface:** Enjoy weather icons, changing backgrounds, and a clean dashboard design.

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask
- Machine Learning model (`weather_model.pkl`)

### Data Processing
- Pandas
- NumPy
- Scikit-learn
- Joblib

## 📁 Project Structure

```text
Weather-Forecasting-System/
│
├── backend/
│   ├── app.py
│   ├── create_dataset.py
│   ├── predict.py
│   ├── train.py
│   ├── weather_model.pkl
│   └── data/
│       └── weather_data.csv
│
├── frontend/
│   ├── images/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── requirements.txt
└── README.md
```

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/vaishnavimohankar45-hue/Weather-Forecasting-System.git
```

### 2. Open the Project Folder

```bash
cd Weather-Forecasting-System
```

### 3. Set Up the Python Environment

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

### 4. Install Dependencies

Run this command from the main project folder:

```bash
pip install -r requirements.txt
```

### 5. Start the Backend

```bash
cd backend
python app.py
```

The backend API is configured at:

```text
http://127.0.0.1:5000/api/weather
```

Keep the backend terminal running while using the application.

### 6. Start the Frontend

1. Open the `frontend` folder in Visual Studio Code.
2. Open `index.html`.
3. Run it using the **Live Server** extension.
4. Search for a city and explore its weather information.

## 🤖 Machine Learning

The project contains a trained machine learning model (`weather_model.pkl`) and Python scripts for dataset creation, model training, and prediction.

The model's functionality depends on the implementation in the backend scripts.

## 🎯 Project Objective

The objective of WeatherWise is to present weather information in a simple and accessible format, helping users explore current conditions and upcoming forecasts through an interactive dashboard.

## 🔮 Future Enhancements

- Improve extended forecast coverage and presentation.
- Add weather charts and visualizations.
- Improve mobile responsiveness and accessibility.
- Enhance weather alert information.
- Deploy the application online for public access.