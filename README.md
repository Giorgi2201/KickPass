# KickPass

KickPass is a digital career profile and scouting platform for amateur football (soccer) players.

## What This App Includes

- Role-based authentication (Player, Coach, Scout) with JWT
- Player profile creation and update
- Public player search with filters
- Public player profile pages with stats and match history
- Coach match management (create, list, add players, delete)
- React frontend with protected role-based routes

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Axios + React Router
- Backend: ASP.NET Core Web API + Entity Framework Core + SQL Server
- Auth: JWT Bearer tokens + BCrypt password hashing

## Project Structure

- `KickPass.Api/KickPass.Api` - ASP.NET Core backend API
- `src` - React frontend application

## Run Locally

### 1) Start the backend

```powershell
cd "KickPass.Api/KickPass.Api"
dotnet run
```

API runs on `http://localhost:5000`.

### 2) Start the frontend

```powershell
cd "."
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Core API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Players

- `POST /api/players/profile`
- `PUT /api/players/profile`
- `GET /api/players/profile/me`
- `GET /api/players/search`
- `GET /api/players/{id}`

### Matches

- `POST /api/matches`
- `POST /api/matches/{matchId}/players`
- `GET /api/matches/{matchId}`
- `GET /api/matches/my`
- `DELETE /api/matches/{matchId}`
