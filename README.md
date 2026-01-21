# FútbolWeather - AI Sports Predictions

## Technologies

### Backend
- NestJS + TypeScript
- TypeORM + PostgreSQL
- Axios for external APIs
- OpenRouter API for predictions
- Swagger for documentation

### Frontend
- React + TypeScript
- Vite
- Shadcn UI
- Zustand for state management
- Tailwind CSS

### Infrastructure
- Docker + Docker Compose
- GitHub Actions CI/CD
- Render.com for deployment

## External APIs

- **TheSportsDB**: Soccer match data
- **OpenWeatherMap**: Weather information
- **OpenAI**: AI predictive analysis

## Local Setup

### Requirements
- Node.js 20+
- Docker Desktop
- API Keys

### Environment Variables

Create a `.env` file in the root:

```env
OPENWEATHER_API_KEY=your_openweather_key
OPENAI_API_KEY=your_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=google/gemini-2.0-flash-001
```

### Development with Docker

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL on port 5432
- Backend on port 3001

For frontend in development mode:
```bash
cd frontend
npm install
npm run dev
```

Frontend available at http://localhost:5173

### Development without Docker

1. Install PostgreSQL and create the `soccer_db` database

2. Backend:
```bash
cd backend
npm install
npm run start:dev
```

3. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Production with Docker

```bash
docker-compose up -d --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

## Features

- Match listing for La Liga and MLS
- Filter by league
- Search teams and stadiums
- Mark matches as favorites
- Detailed match view
- Weather forecast for match day
- AI predictive analysis
- Light/dark theme
- Responsive design
- Multi-language support (Spanish/English)

## API Endpoints

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/upcoming` - Upcoming matches
- `GET /api/matches/search?q=` - Search matches
- `GET /api/matches/:id` - Match details
- `POST /api/matches/sync` - Sync with TheSportsDB

### Weather
- `GET /api/weather/current?city=` - Current weather
- `GET /api/weather/forecast?city=&date=` - Forecast

### Predictions
- `POST /api/predictions/:matchId` - Generate prediction
- `GET /api/predictions/:matchId` - Get existing prediction

## Project Structure

```
soccer-app/
├── backend/
│   ├── src/
│   │   ├── matches/
│   │   ├── weather/
│   │   ├── prediction/
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── render.yaml
└── README.md
```
