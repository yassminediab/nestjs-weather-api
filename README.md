
# NestJS Weather API

## Overview
This project is a NestJS-based API that integrates with a weather service to provide current weather and forecasts for cities. It includes REST and GraphQL APIs, authentication, caching with Redis, rate limiting, and logging.

### Key Features:
- **REST Endpoints** for weather and user management.
- **GraphQL Endpoints** for managing user locations.
- **Authentication** via `register` and `login`.
- **Caching** using Redis and NestJS Cache Manager.
- **Rate Limiting** using `@nestjs/throttler`.
- **Logging** using NestJS Logger.
- **Unit Testing** integrated with Jest, runnable in the Docker container.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yassminediab/nestjs-weather-api.git
   cd nestjs-weather-api
   ```

2. **Run the application using Docker**:
   ```bash
   docker-compose up --build
   ```

3. **Run migrations from the Docker container**:
   ```bash
   docker exec -it <container_name> npm run migrate:run
   ```

---

## Documentation

- **Swagger Documentation**: [http://localhost:3000/api#/](http://localhost:3000/api#/)
- **GraphQL Playground**: [http://localhost:3000/graphql](http://localhost:3000/graphql)

---

## REST Endpoints

1. **Weather**:
    - `GET /api/weather/{city}`: Get current weather for a city.
    - `GET /api/weather/forecast/{city}`: Get 5-day forecast for a city.

2. **Authentication**:
    - `POST /api/register`: Register a new user.
    - `POST /api/login`: Authenticate and retrieve a token.

---

## GraphQL Endpoints

1. **Queries**:
    - `getLocations`: Retrieve the user's favorite locations.

2. **Mutations**:
    - `addLocation`: Add a location to the user's favorites.
    - `removeLocation`: Remove a location from the user's favorites.

---

## Things to Consider (if time permits)

1. **Running Migrations**:
   Ensure migrations are run during the Docker build process or explicitly after starting the container.

2. **Database Seeding**:
   Seed initial location data into the database for testing or default setup.

3. **Dependency Injection**:
   Use interfaces for better type safety and abstraction in services.

4. **Unit Testing**:
   Run unit tests using Jest inside the Docker container:
   ```bash
   docker exec -it <container_name> npm run test
   ```

---

This simplified README provides all the essentials to get started and highlights important endpoints and considerations.
