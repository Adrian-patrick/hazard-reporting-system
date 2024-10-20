# Hazard Reporting System

This project is a web-based platform that allows users to submit hazard reports (e.g., potholes, drainage issues, garbage). The system predicts both the hazard type and its priority using pre-trained machine learning models and traffic data from the TomTom API.

## Features

- **Hazard Classification:** Classifies hazards into `road damage`, `garbage`, or `drainage` using a BERT model.
- **Priority Prediction:** Predicts hazard urgency (low, medium, high, severe) using traffic data fetched from the TomTom API.
- **Web Interface:** Flask-powered frontend for submitting reports and displaying predictions.

## Technologies

- **Backend:** Python, Flask
- **ML Models:** BERT (PyTorch), Scikit-learn
- **API:** TomTom Traffic API

