# KickPass API

KickPass API is an ASP.NET Core 8 RESTful backend service that powers the KickPass football scouting platform. It handles user authentication, player profile management, match data, and player statistics tracking with role-based access control for Players, Coaches, and Scouts.

## Tech Stack

- **ASP.NET Core 8** - Web API framework
- **Entity Framework Core** - ORM for database access
- **SQL Server** - Relational database
- **JWT Authentication** - Stateless authentication with JSON Web Tokens
- **BCrypt** - Secure password hashing

## Prerequisites

Before running the API, ensure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) - Download and install the .NET 8 SDK
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) - Download the free Express edition
- A database management tool:
  - [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
  - [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio)

## Getting Started

Follow these steps to set up and run the API locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd KickPass/kick-pass
```

### 2. Navigate to the API Project

```bash
cd KickPass.Api/KickPass.Api
```

### 3. Configure Application Settings

Copy the example configuration file and update it with your values:

```bash
copy appsettings.example.json appsettings.json
```

> **Note:** The `appsettings.example.json` file contains placeholder values. Create your own `appsettings.json` with actual configuration values (see below for details).

### 4. Update Configuration

Edit `appsettings.json` with your settings:

- **Connection String**: Update the `DefaultConnection` with your SQL Server instance name
- **JWT Key**: Replace with a long random string (minimum 32 characters) for token signing

### 5. Run Database Migrations

Create the database and apply migrations:

```bash
dotnet ef database update
```

### 6. Run the API

```bash
dotnet run
```

The API will start on `http://localhost:5000` (or the configured port).

### 7. Access Swagger UI

Once running, explore the API documentation at:

```
http://localhost:5000/swagger
```

## Environment Variables / appsettings.json

| Key | Description | Example Value |
|-----|-------------|---------------|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string | `Server=(localdb)\MSSQLLocalDB;Database=KickPassDb;Trusted_Connection=True;TrustServerCertificate=True` |
| `Jwt:Key` | Secret key for signing JWT tokens (min 32 chars) | `your-super-secret-key-change-this-in-production` |
| `Jwt:Issuer` | JWT token issuer identifier | `KickPassAPI` |
| `Jwt:Audience` | JWT token audience identifier | `KickPassClient` |
| `Jwt:ExpiresInDays` | Number of days until JWT token expires | `7` |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user (Player, Coach, or Scout) |
| POST | `/api/auth/login` | Authenticate and receive JWT token |
| GET | `/api/auth/me` | Get current authenticated user's details |

### Players

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/players/profile` | Create a new player profile |
| PUT | `/api/players/profile` | Update existing player profile |
| GET | `/api/players/profile/me` | Get current user's player profile |
| GET | `/api/players/search` | Search players with filters (position, foot, city, country, age) |
| GET | `/api/players/{id}` | Get public player profile by ID |

### Matches

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/matches` | Create a new match (Coach only) |
| POST | `/api/matches/{id}/players` | Add a player with stats to a match (Coach only) |
| GET | `/api/matches/{id}` | Get match details by ID |
| GET | `/api/matches/my` | Get all matches created by the current coach |
| DELETE | `/api/matches/{id}` | Delete a match and all associated player stats (Coach only) |

## Roles

The API supports three user roles with different access levels:

### Player
- Create and manage their own player profile
- Upload avatar and highlight video URL
- View their match history and statistics
- Cannot access match management features

### Coach
- Create, view, and delete matches
- Add players to matches with statistics (goals, assists, minutes played, rating)
- View all player profiles
- Cannot modify other users' profiles

### Scout
- Search and filter player profiles
- View detailed player profiles including match history and statistics
- Read-only access to all player data
- Cannot create matches or modify any data

## Running Migrations

Entity Framework Core migrations manage database schema changes.

### Add a New Migration

```bash
dotnet ef migrations add MigrationName
```

### Apply Migrations to Database

```bash
dotnet ef database update
```

### Reset Database (Drop and Recreate)

```bash
dotnet ef database drop
# Then recreate:
dotnet ef database update
```

### View Pending Migrations

```bash
dotnet ef migrations list
```

## Additional Notes

- The API uses BCrypt for password hashing with a work factor of 12
- JWT tokens expire after the configured number of days (default: 7)
- All endpoints except `/api/auth/register` and `/api/auth/login` require authentication
- Role-based authorization is enforced via `[Authorize(Roles = "RoleName")]` attributes
