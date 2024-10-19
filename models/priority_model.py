import requests
import joblib
import pandas as pd

# TomTom API key
API_KEY = "PRfZyaNpBfEHm0GHdT4Dny2FOTn8euNq"

# Latitude and Longitude
latitude = 13.0242
longitude = 77.683

# Function to fetch features from TomTom API
def fetch_features(lat, lon):
    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={API_KEY}&point={lat},{lon}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        # Extract relevant features
        current_speed = data['flowSegmentData']['currentSpeed']
        free_flow_speed = data['flowSegmentData']['freeFlowSpeed']
        current_travel_time = data['flowSegmentData']['currentTravelTime']
        free_flow_travel_time = data['flowSegmentData']['freeFlowTravelTime']
        confidence = data['flowSegmentData']['confidence']
        
        return {
            'currentSpeed': current_speed,
            'freeFlowSpeed': free_flow_speed,
            'currentTravelTime': current_travel_time,
            'freeFlowTravelTime': free_flow_travel_time,
            'confidence': confidence
        }
    else:
        print(f"Error fetching data from TomTom API: {response.status_code} - {response.text}")
        return None

# Load the trained priority prediction model
model_path = "C:\\Users\\USER\\Desktop\\hazard-reporting-system\\models\\priority\\trained_model(priority).pkl"
priority_model = joblib.load(model_path)

# Fetch features from the TomTom API
features = fetch_features(latitude, longitude)

if features is not None:
    # Create a DataFrame for the features
    feature_df = pd.DataFrame([features])
    
    # Make a prediction
    predicted_priority = priority_model.predict(feature_df)
    
    # Decode the predicted priority
    priority_mapping = {
        0: "high",
        1: "low",
        2: "medium",
        3: "severe",
        4: "unknown"
    }
    decoded_priority = priority_mapping.get(predicted_priority[0], "unknown")  # Default to "unknown" if not in mapping
    
    print(f"Predicted Priority Level: {decoded_priority}")
