# KickPass

KickPass is a digital career profile and scouting platform for amateur football (soccer) players. It connects amateur players with coaches and scouts, allowing players to showcase their skills through detailed profiles and match statistics, while giving coaches and scouts tools to discover and evaluate talent.

## What This App Includes

- **Role-based authentication** (Player, Coach, Scout) with JWT
- **Player profile creation and management** with photos and highlight videos
- **Public player search** with filters (position, dominant foot, city, country, age)
- **Public player profile pages** with stats and match history
- **Coach match management** - create matches, add player statistics, delete matches
- **Player statistics tracking** - goals, assists, minutes played, ratings per match
- **Responsive React frontend** with protected role-based routes

## Project Structure

This repository contains both the backend API and frontend application:

```
kick-pass/
├── KickPass.Api/              # ASP.NET Core Web API
│   ├── KickPass.Api/          # API project source
│   └── README.md              # API documentation
├── src/                       # React frontend application
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   └── ...
└── README.md                  # This file
```

## Quick Start

To run the full application locally, you need to start both the backend API and the frontend.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or SQL Server Express
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### 1. Start the Backend API

```powershell
cd KickPass.Api/KickPass.Api

# Copy and configure settings
copy appsettings.example.json appsettings.json
# Edit appsettings.json with your SQL connection string and JWT key

# Run migrations and start the API
dotnet ef database update
dotnet run
```

The API will be available at `http://localhost:5000` with Swagger UI at `http://localhost:5000/swagger`.

📖 **See [KickPass.Api/README.md](KickPass.Api/README.md) for detailed API setup instructions.**

### 2. Start the Frontend

In a new terminal:

```powershell
cd kick-pass  # Root of this repository

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

📖 **Frontend documentation is in this README below.**

## Frontend Development

### Tech Stack

- **React 19** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API calls

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run lint:fix  # Fix ESLint issues
```

### Frontend Environment Variables

Create a `.env` file in the frontend root:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Layout)
│   ├── ui/             # UI primitives (Button, Input, Card, Modal)
│   └── ...
├── pages/              # Route pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── PlayerProfile.jsx
│   ├── CoachDashboard.jsx
│   ├── ScoutSearch.jsx
│   └── ...
├── context/            # React context providers
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
├── services/           # API service layer
│   └── api.js
├── utils/              # Utility functions
│   ├── errors.js
│   └── dates.js
└── main.jsx            # Application entry point
```

## Core API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user |

### Players

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/players/profile` | Create player profile |
| PUT | `/api/players/profile` | Update player profile |
| GET | `/api/players/profile/me` | Get my profile |
| GET | `/api/players/search` | Search players |
| GET | `/api/players/{id}` | Get player by ID |

### Matches

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/matches` | Create match (Coach) |
| POST | `/api/matches/{id}/players` | Add player to match |
| GET | `/api/matches/{id}` | Get match details |
| GET | `/api/matches/my` | Get my matches |
| DELETE | `/api/matches/{id}` | Delete match (Coach) |

## User Roles

- **Player** - Creates and manages their own profile, views match history
- **Coach** - Manages matches, adds player statistics, views all profiles
- **Scout** - Searches and views player profiles with full statistics (read-only)

## Documentation

- **[KickPass.Api/README.md](KickPass.Api/README.md)** - Backend API documentation including:
  - Detailed setup instructions
  - Database configuration
  - Environment variables
  - Migration commands
  - API endpoint details

## License

[MIT](LICENSE)
