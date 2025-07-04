# Level_Up2 Chess Tournament Manager

This repository provides a simple full‑stack example for organising chess tournaments. A React front end interacts with two Spring Boot services. All services store data in an in‑memory H2 database so the application can run locally with almost no setup.

## Features

- Swiss tournament format
- Real‑time pairings and results
- Dashboards for players and arbiters
- Runs entirely on an H2 database for easy setup

## Project Structure

```
Level_Up2/
├── backend/
│ ├── Usermangment/ # Handles user authentication & roles (Spring Boot - port 8080)
│ │ ├── controllers/ # REST API endpoints
│ │ ├── service/ # Business logic
│ │ └── security/ # Spring Security configuration
│ │
│ └── chess-tournament/ # Tournament engine: pairings, results, standings (Spring Boot - port 8081)
│ ├── controller/ # REST API endpoints
│ ├── service/ # Tournament logic
│ ├── repository/ # Spring Data repositories
│ ├── model/ # JPA entities
│ ├── dto/ # DTO classes for API payloads
│ ├── config/ # CORS and other configuration
│ ├── utils/ # Helper classes (e.g., TRF export)
│ └── results/ # Tools for generating sample results
│
├── FinalUI/ # React frontend (Vite)
│ ├── App.jsx / main.jsx # React entry point
│ └── src/
│ ├── HomePage/ # Guest views: rounds, standings
│ ├── CreateTournamentPage/ # Tournament creation form
│ ├── MyTournamentsPage/ # User’s tournaments
│ ├── ArchivedTournamentsPage/ # Finished tournaments
│ ├── DashBoardPage/ # Dashboard with tabs (Players, Rounds, Standings, Settings)
│ ├── Arbiter/ # Arbiter-specific tools and results entry
│ ├── LoginPage/ # Login form
│ ├── Components/ # Shared components (modals, headers, containers)
│ └── assets/ # Icons and images used in the UI
│
└── README.md # Project documentation
```

Generated folders such as `target`, `.mvn`, `node_modules` and Maven wrapper scripts have been omitted for brevity.

## Front‑End (FinalUI)

The React front end lives inside `FinalUI` and is built with [Vite](https://vitejs.dev/).

### FinalUI source layout

Key folders and files under `FinalUI/src` are:

- `HomePage/` – landing pages for guests, rounds and standings views
- `CreateTournamentPage/` – form for creating a new tournament
- `MyTournamentsPage/` – shows tournaments owned by the logged in user
- `ArchivedTournamentsPage/` – list of past tournaments
- `DashBoardPage/` – tournament dashboards
- `Arbiter/` – tools for arbiters
- `LoginPage/` – login form
- `Components/` – shared React components (modals, drawers, etc.)
- `assets/` – icons and images used by the UI
- `App.jsx` / `main.jsx` – entry point for the React application

Run it in development mode:

```bash
cd FinalUI
npm install
npm run dev
```

This starts a hot‑reloading server on port `5173` by default. A separate README in that directory contains more Vite details.

## Back‑End Services

### Usermangment Service

Located in `backend/Usermangment`, this Spring Boot project provides user accounts
and basic tournament setup APIs. Start it with:

```bash
cd backend/Usermangment
./mvnw spring-boot:run
```

The service listens on port `8080`.

Important packages include:

- `controllers/` – REST API endpoints
- `service/` – business logic
- `security/` – configuration for Spring Security

### Chess Tournament

Handles pairings and standings. Start it with:

```bash
cd backend/chess-tournament
./mvnw spring-boot:run
```

This service uses port `8081`.

Important packages include:

- `controller/` – REST API endpoints
- `service/` – tournament logic
- `repository/` – Spring Data repositories
- `model/` – JPA entities
- `dto/` – DTO classes for API payloads
- `config/` – CORS and other configuration
- `utils/` – helper classes
- `results/` – tools for generating sample results

Both services expose an H2 console at `/h2-console` when running.

## Building and Testing

Use Maven to build or test either service:

```bash
./mvnw clean package
./mvnw test
```

## Production Build

Generate an optimized front‑end build with:

```bash
cd FinalUI
npm run build
```

The result appears in `FinalUI/dist`. To run the packaged back‑end services execute their jars from `target/`:

```bash
java -jar target/*.jar
```

## License

This project is provided for learning purposes and has no specific license.
