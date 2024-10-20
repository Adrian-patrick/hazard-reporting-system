from flask import Flask, request, jsonify, render_template
from hazard_type_model import predict_hazard_type
from priority_model import fetch_features, priority_model, priority_mapping
import pandas as pd

app = Flask(__name__)

# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle predictions
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    description = data.get('description')
    latitude = float(data.get('latitude'))
    longitude = float(data.get('longitude'))

    # Predict hazard type using the description
    hazard_type = predict_hazard_type(description)

    # Fetch additional features from TomTom API
    features = fetch_features(latitude, longitude)

    if features:
        # Create a DataFrame for the features and predict the priority level
        feature_df = pd.DataFrame([features])
        predicted_priority = priority_model.predict(feature_df)[0]
        priority_level = priority_mapping.get(predicted_priority, "unknown")
    else:
        priority_level = "unknown"

    # Return the results as JSON
    return jsonify({
        'hazard_type': hazard_type,
        'priority_level': priority_level
    })

if __name__ == '__main__':
    app.run(debug=True)
