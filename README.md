

# 🎬 MovieMatrix

> A full-stack movie discovery platform where you can search, explore, review, and organize the films you love.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://movie-matrix-gamma.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge&logo=render)](https://render.com)
[![Database](https://img.shields.io/badge/Database-Railway-blue?style=for-the-badge&logo=railway)](https://railway.app)

---

## 📌 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Microservices](#microservices)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Developer](#developer)

---

## 🎯 About

MovieMatrix is a full-stack movie discovery web application that solves the problem of scattered movie information by centralizing discovery, tracking, and social features in one platform. Users can browse trending movies, search by title, filter by genre, read and write reviews, and build personal watchlists and favorites collections — all secured by JWT authentication.

---

## ✨ Features

### 🔍 Movie Discovery
- **Real-time search** — search across 500,000+ movies powered by the TMDB API
- **Genre filtering** — browse by Action, Comedy, Sci-Fi, Romance, Thriller, Kids, Family, Documentary
- **Trending movies** — auto-updated trending section on the homepage
- **Hero section** — auto-rotating showcase of top 5 movies with slide indicators

### 🎬 Movie Details
- Full movie info — title, overview, rating, runtime, release date, revenue
- **Top cast** — actor photos, names and character names
- **Movie Facts carousel** — swipeable cards showing director, writer, genre, duration and net worth
- **Direct watchlist/favorites** toggle from the detail page

### ⭐ Reviews & Ratings
- Write and submit reviews for any movie
- View all reviews left by other users
- Rating system tied to your account

### 📋 Watchlist & Favorites
- One-click add/remove from any movie page or hero section
- Dedicated Watchlist and Favorites pages
- Preview of saved movies on your Profile page

### 🔐 Authentication
- Secure **JWT-based** register and login
- Protected routes — watchlist, favorites, reviews require login
- User profile with personal details, avatar upload (stored locally)
- Persistent sessions via localStorage token

### 📱 Responsive Design
- Fully responsive across **mobile, tablet and desktop**
- Hamburger menu on mobile with smooth slide animation
- Movie grid: 3 columns on mobile → 6 on desktop
- Pagination dots on movie rows

### 🧭 Navigation
- Sticky navbar with active user display
- About page with developer details and tech stack
- Footer with quick links and social connections

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling and responsive design |
| React Router DOM | Client-side routing |
| Axios | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3 | Microservice framework |
| Spring Security | Authentication and authorization |
| JWT (jjwt 0.11.5) | Stateless token-based auth |
| Spring Data JPA | Database ORM |
| Hibernate | Schema management |
| MySQL Connector | Database driver |
| Lombok | Boilerplate reduction |

### Database
| Technology | Purpose |
|---|---|
| MySQL 8 | Relational database |
| Railway | Cloud database hosting |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| Docker | Containerization (two-stage builds) |
| Vercel | Frontend hosting and CDN |
| Render | Backend service hosting |
| Railway | Managed MySQL hosting |
| GitHub | Version control and CI/CD trigger |

### External API
| API | Purpose |
|---|---|
| TMDB (The Movie Database) | Movie data, posters, cast, crew |

---

## 🏗️ Architecture

MovieMatrix uses a **microservice architecture** with 3 independent Spring Boot services:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vercel)                    │
│              https://movie-matrix-gamma.vercel.app            │
└──────────┬──────────────────┬────────────────────┬──────────┘
           │                  │                    │
           ▼                  ▼                    ▼
┌──────────────────┐ ┌────────────────┐ ┌──────────────────────┐
│   auth-service   │ │  movie-service │ │   review-service     │
│   (Render :8080) │ │ (Render :8082) │ │   (Render :8081)     │
└────────┬─────────┘ └───────┬────────┘ └──────────┬───────────┘
         │                   │                      │
         ▼                   ▼                      ▼
┌─────────────────┐ ┌────────────────┐  ┌──────────────────────┐
│  auth_db MySQL  │ │   TMDB API     │  │  review_db MySQL     │
│  (Railway)      │ │ (External)     │  │  (Railway)           │
└─────────────────┘ └────────────────┘  └──────────────────────┘
```

---

## 🔧 Microservices

### 1. auth-service (port 8080)
Handles all user authentication and profile management.

**Endpoints:**
```
POST /auth/register   → Register new user
POST /auth/login      → Login and receive JWT token
GET  /auth/profile    → Get logged-in user profile (protected)
```

**Database:** `auth_db` — stores user accounts with bcrypt-hashed passwords

---

### 2. movie-service (port 8082)
Fetches and serves movie data from the TMDB API. No database — purely a proxy/aggregator.

**Endpoints:**
```
GET /movies/trending         → Get trending movies
GET /movies/trending/top5    → Get top 5 for hero section
GET /movies/genre/:id        → Get movies by genre ID
GET /movies/search?query=    → Search movies by title
GET /movies/:id              → Get full movie details with cast and crew
```

---

### 3. review-service (port 8081)
Handles all user-generated content — reviews, watchlist and favorites.

**Endpoints:**
```
POST   /review/watchlist         → Add movie to watchlist
DELETE /review/watchlist/:id     → Remove from watchlist
GET    /review/watchlist         → Get user's watchlist

POST   /review/favorites         → Add movie to favorites
DELETE /review/favorites/:id     → Remove from favorites
GET    /review/favorites         → Get user's favorites

GET    /review/status/:movieId   → Check watchlist/favorites status
POST   /review                   → Submit a review
GET    /review/:movieId          → Get all reviews for a movie
```

**Database:** `review_db` — stores reviews, watchlist entries and favorites

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+ (review-service) / Java 21 (auth-service, movie-service)
- Maven
- MySQL 8
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org))

### 1. Clone the repository
```bash
git clone https://github.com/Soumi12-codeX/MovieMatrix.git
cd MovieMatrix
```

### 2. Set up databases
Create two MySQL databases locally:
```sql
CREATE DATABASE auth_db;
CREATE DATABASE reviewdb;
```

### 3. Start auth-service
```bash
cd backend/auth-service
mvn spring-boot:run
```

### 4. Start movie-service
```bash
cd backend/movie-service
mvn spring-boot:run
```

### 5. Start review-service
```bash
cd backend/review-service
mvn spring-boot:run
```

### 6. Start frontend
```bash
# from project root
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🔑 Environment Variables

### Frontend — create `.env.development` in project root:
```
VITE_AUTH_URL=http://localhost:8080
VITE_REVIEW_URL=http://localhost:8081
VITE_MOVIE_URL=http://localhost:8082
```

### auth-service — `application.properties`:
```
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/auth_db}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:yourpassword}
```

### review-service — `application.properties`:
```
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/reviewdb}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:yourpassword}
jwt.secret=yourjwtsecretkey
```

### movie-service — `application.properties`:
```
tmdb.api.key=${TMDB_API_KEY:your_tmdb_key}
```

---

## ☁️ Deployment

| Layer | Platform | Details |
|---|---|---|
| Frontend | Vercel | Auto-deploy from GitHub main branch |
| auth-service | Render | Dockerized, free tier |
| movie-service | Render | Dockerized, free tier |
| review-service | Render | Dockerized, free tier |
| auth_db | Railway | Managed MySQL 8 |
| review_db | Railway | Managed MySQL 8 |

> **Note:** Render free tier services spin down after 15 minutes of inactivity. First request may take 30-50 seconds to wake up.

### Docker (each service has a two-stage Dockerfile):
```dockerfile
# Stage 1 — Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2 — Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 👩‍💻 Developer

**Soumi Das**
Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-Soumi12--codeX-black?style=flat&logo=github)](https://github.com/Soumi12-codeX)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://linkedin.com/in/your-profile)

---
