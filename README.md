# Level_Up2 Chess Tournament Manager

This repository provides a simple full‑stack example for organising chess tournaments.  
A React front end interacts with two Spring Boot services.  
All services store data in an in‑memory H2 database so the application can run locally with almost no setup.

> **Note:**  
> This project is currently under development. No production deployment or hosting configuration has been completed yet. All instructions in this README are intended for local development and testing only.
---

## Features

- Swiss tournament format
- Real‑time pairings and results
- Dashboards for players and arbiters
- Runs entirely on an H2 database for easy setup

---

## Project Structure

```

Level_Up2/
├── backend
│ ├── tournament_system # Handles user authentication & roles (Spring Boot - port 8080)
│ │ ├── controllers # REST API endpoints
│ │ ├── models # JPA entities
│ | ├── repositories # Spring Data repositories
│ │ ├── service # Business logic
│ │ └── security # Spring Security configuration
│ │
│ └── chess-tournament # Tournament engine pairings, results, standings (Spring Boot - port 8081)
│  ├── controller # REST API endpoints
│  ├── service # Tournament logic
│  ├── repository # Spring Data repositories
│  ├── model # JPA entities
│  ├── dto # DTO classes for API payloads
│  ├── config # CORS and other configuration
│  └── utils # Helper classes 
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

> Generated folders such as `target`, `.mvn`, `node_modules` have been omitted for brevity.

---

## Prerequisites

- Java 17+ (for Spring Boot services)
- Maven 3.x
- Node.js 18+ and npm (for the React frontend)

---

## Front‑End (FinalUI)

The React front end lives inside the `FinalUI` folder and is built with [Vite](https://vitejs.dev/).

### Key folders and files under `FinalUI/src`:

- `HomePage/` – Landing pages for guests, rounds and standings views  
- `CreateTournamentPage/` – Form for creating a new tournament  
- `MyTournamentsPage/` – Shows tournaments owned by the logged-in user  
- `ArchivedTournamentsPage/` – List of past tournaments  
- `DashBoardPage/` – Tournament dashboard tabs  
- `Arbiter/` – Tools for arbiters  
- `LoginPage/` – Login form  
- `Components/` – Shared React components (modals, drawers, etc.)  
- `assets/` – Icons and images used by the UI  
- `App.jsx` / `main.jsx` – Entry point for the React application  

### Run in development mode:

```bash
cd FinalUI
npm install
npm run dev
```
The server starts on `http://localhost:5173` with hot-reloading.
A separate README in that directory contains more Vite details.

---

## Back‑End Services
### tournament_system Service
Located in `backend/tournament_system`, this Spring Boot project provides user accounts and basic tournament setup APIs.

```bash
cd backend/tournament_system
./mvn spring-boot:run
```
Runs on port `8080`.

#### Important packages:

- `controllers`/ – REST API endpoints

- `service`/ – Business logic

- `security`/ – Spring Security configuration

- `models` / – JPA entities

- `repositories` / –  Spring Data repositories
 
### Chess Tournament Service
Handles creating tournaments, pairings, results and standings.

```bash
cd backend/chess-tournament
./mvn spring-boot:run
```
Runs on port `8081`.

#### Important packages:

- `controller`/ – REST API endpoints

- `service` / – Tournament logic

- `repository`/ – Spring Data repositories

-  `model`/ – JPA entities

- `dto` / – DTO classes for API payloads

- `config` / – CORS and other configuration

- `utils` / – Helper classes

Both services expose an H2 console at `/h2-console` when running.

## Building and Testing
Use Maven to build or test either Spring Boot service:

```bash
./mvn clean package
./mvn test
```

## Production Build
Generate an optimized front‑end build:

```bash
cd FinalUI
npm run build
```
The result appears in `FinalUI/dist`.

To build the back-end services as executable JARs:

```bash
cd backend/tournament_system
./mvn clean package

cd ../chess-tournament
./mvn clean package
```

The generated JAR files will be in `/target`. You can run them manually:

```bash
java -jar target/tournament_system-0.0.1-SNAPSHOT.jar
java -jar target/chess-tournament-0.0.1-SNAPSHOT.jar
```

## License
This project is provided for educational purposes and does not have a specific open-source license.
