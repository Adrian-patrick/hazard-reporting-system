import os
import io
import json
import torch
import base64
import requests
import joblib
import numpy as np
from PIL import Image
from datetime import datetime
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field
from torchvision import models, transforms

# === ✅ Load Environment Variables === #
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HERE_API_KEY = os.getenv("HERE_API_KEY")
OWM_API_KEY = os.getenv("OWM_API_KEY")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

# === ✅ FastAPI Initialization === #
app = FastAPI()

# === ✅ Enable CORS (for development & Render) === #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === ✅ MongoDB Setup === #
client = MongoClient(MONGO_URL)
db = client["sample-db"]
collection = db["hazards"]
classification_collection = db["classifications"]

# === ✅ Load Image Classification Model === #
image_model_path = Path("models/finalimageclass.pth")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
image_model = models.efficientnet_b0(pretrained=False)
image_model.classifier[1] = torch.nn.Linear(image_model.classifier[1].in_features, 3)

try:
    image_model.load_state_dict(torch.load(image_model_path, map_location=device))
    image_model.to(device).eval()
except Exception as e:
    print(f"❌ Error loading image classification model: {e}")

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# === ✅ Load Text Classification Model === #
text_model_path = Path("models/finaltextclass.pkl")
vectorizer_path = Path("models/text_vectorizer.pkl")

try:
    text_model = joblib.load(text_model_path)
    vectorizer = joblib.load(vectorizer_path)
except Exception as e:
    print(f"❌ Error loading text classification model/vectorizer: {e}")

# === ✅ Priority Score to Label === #
def get_priority_label(score):
    return "Low" if score < 40 else "Medium" if score < 70 else "High"

# === ✅ MongoDB Model Schema === #
class HazardModel(BaseModel):
    id: str = Field(alias="_id")
    title: str
    type: str
    createdAt: str

    @classmethod
    def from_mongo(cls, data):
        data["_id"] = str(data["_id"])
        data["createdAt"] = data["createdAt"].isoformat() if isinstance(data.get("createdAt"), datetime) else str(data.get("createdAt"))
        return cls(**data)

# === ✅ Gemini Chat Input Model === #
class ChatRequest(BaseModel):
    message: str

# === 🚀 Get Latest Hazards === #
def get_latest_hazards(limit=3):
    try:
        hazards = list(collection.find().sort("createdAt", -1).limit(limit))
        return [HazardModel.from_mongo(h).dict() for h in hazards]
    except Exception as e:
        print(f"❌ Error fetching latest hazards: {e}")
        return []

# === 🚀 Gemini API Chat Response === #
def generate_response(user_message):
    recent = get_latest_hazards()
    if not recent:
        return "No recent hazards found."

    prompt = f"""
    You are a hazard assistant. Based on recent hazard reports, provide helpful advice.
    Recent Hazards:
    {json.dumps(recent, indent=2)}
    User: {user_message}
    AI:
    """
    try:
        res = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
            headers={"Content-Type": "application/json"}
        )
        return res.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"❌ Gemini API error: {str(e)}"

# === 📷 Base64 Image Classification Endpoint === #
@app.post("/classify/image_base64/")
async def classify_image_base64(image_base64: str = Form(...), title: str = Form("Untitled")):
    try:
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        image_tensor = image_transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = image_model(image_tensor)
            _, predicted = torch.max(output, 1)
            predicted_class = ["Garbage", "Road", "Water"][predicted.item()]

        classification_collection.insert_one({
            "type": "image",
            "title": title,
            "predicted_class": predicted_class,
            "createdAt": datetime.utcnow()
        })
        return {"predicted_class": predicted_class}
    except Exception as e:
        return {"error": str(e)}

# === 📝 Text Classification Endpoint === #
@app.post("/classify/text/")
async def classify_text(description: str = Form(...), title: str = Form("Untitled")):
    try:
        transformed = vectorizer.transform([description])
        prediction = text_model.predict(transformed)[0]
        predicted_class = ["Garbage", "Road", "Water"][prediction]

        classification_collection.insert_one({
            "type": "text",
            "title": title,
            "description": description,
            "predicted_class": predicted_class,
            "createdAt": datetime.utcnow()
        })
        return {"predicted_class": predicted_class}
    except Exception as e:
        return {"error": str(e)}

# === 📍 Priority Scoring Endpoint === #
@app.post("/priority/")
async def get_priority(lat: float = Form(...), lon: float = Form(...), title: str = Form("Untitled")):
    try:
        bbox = f"{lon-0.002},{lat-0.002},{lon+0.002},{lat+0.002}"
        traffic_data = requests.get(
            f"https://data.traffic.hereapi.com/v7/flow?in=bbox:{bbox}&apiKey={HERE_API_KEY}"
        ).json()
        segments = traffic_data.get("results", [])
        traffic_score = sum(seg.get("currentFlow", {}).get("jamFactor", 0) * 10 for seg in segments) / max(len(segments), 1)

        weather_data = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OWM_API_KEY}&units=metric"
        ).json()
        weather_desc = weather_data.get("weather", [{}])[0].get("description", "").lower()
        weather_score = 30 if "clear" in weather_desc else 80

        priority_score = round(0.6 * traffic_score + 0.4 * weather_score, 2)
        priority_label = get_priority_label(priority_score)

        classification_collection.insert_one({
            "type": "priority",
            "title": title,
            "location": {"lat": lat, "lon": lon},
            "priority_score": priority_score,
            "priority_label": priority_label,
            "createdAt": datetime.utcnow()
        })
        return {"priority_score": priority_score, "priority_label": priority_label}
    except Exception as e:
        return {"error": str(e)}

# === 💬 Chat Endpoint === #
@app.post("/chat/")
async def chat(request: ChatRequest):
    return {"response": generate_response(request.message)}

# === 🧠 Unified Classify & Score Endpoint === #
@app.post("/classify_and_score/")
async def classify_and_score(description: str = Form(...), image_url: str = Form(...), lat: float = Form(...), lon: float = Form(...)):
    try:
        # Text Classification
        text_transformed = vectorizer.transform([description])
        text_pred = text_model.predict(text_transformed)[0]
        predicted_text_class = ["Garbage", "Road", "Water"][text_pred]

        # Image Classification
        response = requests.get(image_url)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        transformed_image = image_transform(image).unsqueeze(0).to(device)
        with torch.no_grad():
            outputs = image_model(transformed_image)
            _, image_pred = torch.max(outputs, 1)
        predicted_image_class = ["Garbage", "Road", "Water"][image_pred.item()]

        # Priority Scoring
        bbox = f"{lon-0.002},{lat-0.002},{lon+0.002},{lat+0.002}"
        traffic_data = requests.get(
            f"https://data.traffic.hereapi.com/v7/flow?in=bbox:{bbox}&apiKey={HERE_API_KEY}"
        ).json()
        segments = traffic_data.get("results", [])
        traffic_score = sum(seg.get("currentFlow", {}).get("jamFactor", 0) * 10 for seg in segments) / max(len(segments), 1)

        weather_data = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OWM_API_KEY}&units=metric"
        ).json()
        weather_score = 30 if "clear" in weather_data.get("weather", [{}])[0].get("description", "").lower() else 80
        priority_score = round(0.6 * traffic_score + 0.4 * weather_score, 2)
        priority_label = get_priority_label(priority_score)

        # Store result
        classification_collection.insert_one({
            "description": description,
            "image_url": image_url,
            "predicted_text_class": predicted_text_class,
            "predicted_image_class": predicted_image_class,
            "priority_score": priority_score,
            "priority_label": priority_label,
            "location": {"lat": lat, "lon": lon},
            "createdAt": datetime.utcnow()
        })

        return {
            "text_class": predicted_text_class,
            "image_class": predicted_image_class,
            "priority_score": priority_score,
            "priority_label": priority_label
        }

    except Exception as e:
        return {"error": f"Unified classification error: {str(e)}"}
