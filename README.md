# HARP - Hazard Reporting System

HARP is a web-based hazard reporting platform that allows users to report real-world hazards like garbage dumps, water logging, and road damage. It uses AI to classify hazards, prioritize response based on external factors like traffic and weather, and enable authorities to take timely action. The platform supports both image-based and text-based submissions.

## 🚀 Features

- **Image Classification:** Classifies uploaded images into `Road Damage`, `Garbage`, or `Water Logging` using a fine-tuned CNN or EfficientNet model (PyTorch).
- **Text Classification:** Analyzes textual descriptions of the hazard using an ensemble of NLP models based on BERT for accurate category prediction.
- **Priority Classification:** Automatically ranks the urgency of the report (`Low`, `Medium`, `High`, `Severe`) based on:
  - Real-time traffic data from the Here Traffic API
  - Current weather conditions from the OpenWeather API
- **Smart Hazard Query System:** Uses a Gemini-based conversational agent for understanding and responding to hazard-related queries.
- **User Dashboard:** React.js-based frontend for citizens to report hazards, view statuses, and interact with the system.
- **Admin Interface:** Allows authorized personnel to track and respond to reported hazards.

## 🛠️ Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Django REST Framework, FastAPI (for ML model serving)
- **Machine Learning:** PyTorch, Scikit-learn, Transformers (BERT)
- **Database:** MongoDB
- **APIs:**
  - [Here Traffic API](https://developer.here.com/)
  - [OpenWeatherMap API](https://openweathermap.org/)
  - [Gemini API](https://deepmind.google/technologies/gemini/)
- **Deployment:** Render, GitHub Actions (CI/CD), Docker (optional)

## 📁 Structure

- `/frontend`: React frontend for users and admins
- `/backend`: Django project for handling APIs and database
- `/ml_models`: Contains training and deployment code for image and text classification models
- `/fastapi_endpoints`: Serves ML models as REST APIs

## 💡 Use Case

> A user takes a photo of a flooded road and adds a short description. HARP classifies it as “Water Logging” with “High” priority due to nearby traffic congestion and bad weather, notifying the appropriate authorities for fast action.

---

Let me know if you'd like to add architecture diagrams, setup instructions, or contribution guidelines too.
