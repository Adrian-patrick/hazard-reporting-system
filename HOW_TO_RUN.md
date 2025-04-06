# 🧪 How to Run the HARP Project

## 1. Clone the repository

```bash
git clone https://github.com/Adrian-patrick/hazard-reporting-system.git
cd hazard-reporting-system
```

---

## 2. Update the `.env` File

Create or update the `.env` file in the root directory with your API keys and required environment variables:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
HERE_API_KEY=your_here_traffic_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 3. Run the ML API Server

Use the terminal to run the FastAPI server:

```bash
cd /d "path\to\your\FASTAPI"
uvicorn main:app --reload
```

You will get a local address like `http://127.0.0.1:8000` — **copy this**.

---

## 4. Update API Endpoint in Frontend

Open the file:

```bash
/src/controllers/hazardController.js
```

And update the API base URL to match the FastAPI server address you copied (e.g., `http://127.0.0.1:8000/predict`).

---

## 5. Run the Frontend

Open the root folder in VS Code and run the following commands:

```bash
npm install
npm run dev
```

This will start the React frontend at `http://localhost:5173` (or another port if specified).

---

✅ You’re all set!
