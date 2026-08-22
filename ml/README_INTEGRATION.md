ML API Integration Guide

1) Purpose

This file explains how to run the ML Flask API alongside the backend and how to configure the backend to use it for disease scans.

2) Ports & URLs

- Backend default: http://localhost:5000 (API base: /api)
- ML Flask API default port: 6000 (predict endpoint: http://localhost:6000/predict)

3) Backend env (.env)

Add the following to your backend `.env` file:

ML_DISEASE_API_URL=http://localhost:6000/predict

(Optional) override the Flask port used by the ML API:
ML_API_PORT=6000

4) Run the ML API

From the `ml/` folder create a venv and install requirements then run the Flask app:

```powershell
cd ml
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python flask_api.py
```

The ML API will listen on the port configured by `ML_API_PORT` (default 6000).

5) Run the backend

From `backend/`:

```powershell
cd backend
npm install
npm run dev
```

Ensure `.env` contains `ML_DISEASE_API_URL`, unless the Flask API is running on
the default URL above.

6) Run the frontend

From `frontend/`:

```powershell
cd frontend
npm install
npm run dev
```

7) Notes

- The backend sends the uploaded image under the `file` form field.
- The ML API returns JSON with `disease`, percentage `confidence`, `treatment`, `preventiveMeasures`, and `pesticides`.
- If the ML API or inference process fails, the backend returns a `502` response and does not save an incomplete scan.
- The frontend already displays `treatment`, `preventiveMeasures`, and `pesticideRecommendations` in `PredictionCard.jsx`.