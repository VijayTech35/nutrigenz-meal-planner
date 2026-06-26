# NutriGenZ - AI-Powered Meal Planner

A premium AI-powered nutrition platform that generates personalized recipes, meal plans, and tracks nutrition goals. Built with React 19, Tailwind CSS v4, Framer Motion, and a Node.js/Express backend with PostgreSQL.

## Features

- **AI Recipe Generation** - Generate recipes from your available ingredients using Google Gemini AI
- **Meal Planner** - Weekly meal planning with drag-and-drop support
- **Smart Pantry** - Track ingredients with barcode scanning via Open Food Facts
- **Nutrition Tracking** - Track daily macros, calories, and view weekly trends
- **Shopping Lists** - Auto-generated shopping lists from meal plans
- **Health Goals** - TDEE calculator and macro goal setting
- **Achievements & Gamification** - XP, levels, and 8 achievements to unlock
- **AI Assistant** - Chat with an AI nutritionist powered by Gemini
- **Notifications** - Expiring item alerts and achievement notifications
- **Dark Mode** - System preference detection with manual toggle
- **Responsive Design** - Fully responsive on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- Framer Motion (animations)
- React Router v7
- Lucide React (icons)
- Axios (HTTP client)

### Backend
- Node.js + Express 5
- PostgreSQL (Neon)
- Google Gemini AI
- JWT authentication
- bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon, Supabase, or local)
- Google Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/VijayTech35/nutrigenz-meal-planner.git
   cd nutrigenz-meal-planner
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. Set up environment variables

   Copy `.env.example` to `.env` for the frontend:
   ```bash
   cp .env.example .env
   ```

   Copy `backend/.env.example` to `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` with your values:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   JWT_SECRET=your-jwt-secret-key
   GEMINI_API_KEY=your-google-gemini-api-key
   ```

5. Run database migrations
   ```bash
   cd backend
   node migrate_new.js
   cd ..
   ```

6. Start development servers

   Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

   Start the frontend (in a separate terminal):
   ```bash
   npm run dev
   ```

7. Open http://localhost:5173 in your browser

## Deployment

### Deploy to Render

1. Fork or push this repository to GitHub

2. Create a new **Web Service** on Render
   - Connect your GitHub repository
   - Set **Root Directory** to `.`
   - Set **Build Command** to `npm run render-build`
   - Set **Start Command** to `npm start`

3. Add environment variables in Render dashboard:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `FRONTEND_URL`: `https://your-app.onrender.com`

4. Deploy! Render will build the frontend and start the backend.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Login |
| `POST /api/auth/request-password` | Forgot password |
| `GET /api/recipes` | Get user's recipes |
| `POST /api/recipes/generate` | Generate AI recipe |
| `POST /api/recipes` | Save a recipe |
| `GET /api/pantry` | Get pantry items |
| `POST /api/pantry` | Add pantry item |
| `GET /api/meal-plans` | Get meal plans |
| `GET /api/shopping-list` | Get shopping list |
| `GET /api/nutrition-log` | Get nutrition logs |
| `POST /api/ai/chat` | Chat with AI assistant |
| `GET /api/achievements` | Get user achievements |
| `GET /api/health-goals` | Get health goals |
| `POST /api/health-goals/calculate-tdee` | Calculate TDEE |

## Project Structure

```
nutrigenz-meal-planner/
├── api/                    # Vercel serverless entry
├── backend/
│   ├── config/             # Database config & schema
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/            # Database models
│   ├── routes/            # Express routes
│   ├── utils/             # Gemini AI integration
│   └── server.js          # Backend entry
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   │   └── ui/           # Reusable UI components
│   ├── context/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app with routes
│   └── index.css         # Global styles
├── .env.example          # Environment template
├── render.yaml           # Render deployment config
├── package.json          # Frontend dependencies & scripts
└── vite.config.js        # Vite configuration
```

## License

MIT
