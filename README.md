# AgriWorld — AI-Powered Smart Agriculture Platform

A full MERN stack platform for farmers: equipment rental marketplace, AI plant
disease scanning with pesticide recommendations, government scheme discovery,
and a crop-works diary with reminders.

## Project Structure

```
AgriWorld/
├── backend/     Express + MongoDB API
└── frontend/    React (Vite) + Tailwind CSS
```

## Prerequisites

- Node.js 18+ (backend) — Node 20.19+/22.12+ recommended for frontend tooling
- MongoDB running locally (or an Atlas connection string)

## Backend Setup

```bash
cd backend
cp .env.example .env    # edit values as needed
npm install
npm run seed             # seeds central + state government schemes
npm run dev               # starts on http://localhost:5000
```

### ML / RAG Integration Point

The disease scanner currently returns **dummy predictions and pesticide
recommendations** so the full flow (upload → scan → save → history) works
end-to-end without your model.

- `backend/services/mlService.js` — swap in a real call to your plant-disease
  model. Set `ML_API_ENABLED=true` and `ML_DISEASE_API_URL` in `.env`.
- `backend/services/ragService.js` — swap in a real call to your RAG pipeline
  that returns the top-3 pesticide recommendations for a given disease name.
  Set `RAG_PESTICIDE_API_URL` in `.env`.

Both files have the expected request/response contracts documented inline —
`backend/controllers/diseaseScanController.js` calls them in sequence
(model prediction → RAG recommendation) and stores the combined result in
`DiseaseScan`.

## Frontend Setup

```bash
cd frontend
cp .env.example .env    # points VITE_API_URL at the backend
npm install
npm run dev               # starts on http://localhost:5173
```

## Core Features

- **Auth** — JWT-based register/login, protected routes, persistent session
- **Dashboard** — summary cards + "Today's Farm Tasks" widget
- **Resource Marketplace** (`/marketplace`) — list/search/filter rental equipment
- **AI Disease Scanner** (`/disease-scanner`) — upload leaf image, view prediction,
  treatment, preventive measures, top pesticide recommendations, and scan history
- **Government Schemes** (`/government-schemes`) — central schemes (always shown)
  + state schemes (based on selected state), each with an expandable eligibility
  accordion
- **Crop Works Diary** (`/crop-works`) — activity timeline + integrated Reminder
  Center (Today / Upcoming / Completed tabs) with toast notifications for tasks
  due today

## Notes

- Uploaded images are stored on disk under `backend/uploads/` and served
  statically at `/uploads/*`.
- `backend/services/reminderCron.js` runs a daily cron job as an extension
  point for future push/email reminder notifications.
