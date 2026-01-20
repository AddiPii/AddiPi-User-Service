# AddiPi-User-Service

User management service for the AddiPi application. The application provides an API for managing users, tasks and statistics, with JWT token-based authentication and role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running](#running)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Types and Interfaces](#types-and-interfaces)
- [Middleware](#middleware)
- [Docker](#docker)
- [Environment Variables](#environment-variables)

## Overview

**AddiPi-User-Service** is a microservice responsible for:

- 👤 Managing user profiles
- 📊 Tracking tasks and their statuses
- 📈 Collecting user statistics
- 🔐 Authentication and authorization
- 📋 Role-based access control (Admin/User)

The service uses:
- **Express.js** - web framework
- **TypeScript** - static typing
- **Azure Cosmos DB** - database
- **CORS** - cross-origin request handling

## Requirements

- Node.js 20 or higher
- npm 10 or higher
- Access to Azure Cosmos DB (endpoint and access key)
- Access to authentication service (AUTH_SERVICE_URL)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/AddiPii/AddiPi-User-Service.git
cd AddiPi-User-Service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory:

```env
# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key

# Authentication Service
AUTH_SERVICE_URL=http://localhost:3001

# Service Port
USER_PORT=3002
```

## Configuration

Configuration is managed in [src/config/config.ts](src/config/config.ts).

### Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `COSMOS_ENDPOINT` | string | ✅ | Azure Cosmos DB endpoint |
| `COSMOS_KEY` | string | ✅ | Cosmos DB access key |
| `AUTH_SERVICE_URL` | string | ❌ | Authentication service URL (default: http://localhost:3001) |
| `USER_PORT` | number | ❌ | Service port (default: 3002) |

## Running

### Development Mode

```bash
npm start
```

This command compiles TypeScript and runs the server.

### Build Only

```bash
npm build
```

Compiled code goes to the `dist/` folder.

### Production Mode

```bash
node dist/index.js
```

## Project Structure

```
AddiPi-User-Service/
├── src/
│   ├── index.ts              # Application entry point
│   ├── type.ts               # Global types and interfaces
│   ├── config/
│   │   └── config.ts         # Application configuration
│   ├── controllers/
│   │   ├── usersControllers.ts       # User management logic
│   │   ├── jobControllers.ts         # Task management logic
│   │   └── meControllers.ts          # Logged-in user profile logic
│   ├── routes/
│   │   ├── users.ts          # User management endpoints (admin)
│   │   ├── jobs.ts           # Task endpoints
│   │   └── me.ts             # Profile endpoints
│   ├── middleware/
│   │   ├── requireAuth.ts    # Authentication middleware
│   │   ├── requireAdmin.ts   # Admin authorization middleware
│   │   ├── requireUser.ts    # User authorization middleware
│   │   └── mwTypes.ts        # Middleware types
│   ├── services/
│   │   └── containers.ts     # Cosmos DB container management
│   ├── db/
│   │   └── cosmosConnect.ts  # Cosmos DB connection
│   └── helpers/
│       └── getLocalISO.ts    # Helper functions
├── package.json
├── tsconfig.json
├── Dockerfile
├── postman/                  # Postman collections for testing API
└── README.md
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

**Response (200):**
```json
{
  "ok": true
}
```

---

### User Profile (Me)

Operations on the logged-in user's profile. Authentication required.

#### Get Profile

```
GET /users/me
```

Gets information about the logged-in user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "role": "user",
  "isVerified": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

#### Edit Profile

```
PATCH /users/me
```

Updates logged-in user information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "newemail@example.com"
}
```

**Response (200):** Updated user profile

#### Get User Tasks

```
GET /users/me/jobs
```

Gets a list of logged-in user's tasks.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "fileId": "file-123",
    "originalFileName": "document.pdf",
    "userId": "user-id",
    "userEmail": "user@example.com",
    "status": "completed",
    "scheduledAt": "2024-01-20T10:00:00Z",
    "createdAt": "2024-01-20T09:55:00Z"
  }
]
```

#### Get Statistics

```
GET /users/me/stats
```

Gets user statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalJobs": 15,
  "completedJobs": 12,
  "failedJobs": 1,
  "pendingJobs": 2
}
```

---

### Tasks (Jobs)

#### Get Scheduled Tasks

```
GET /users/jobs/upcomming
```

Gets a list of scheduled tasks.

**Response (200):**
```json
[
  {
    "id": 1,
    "fileId": "file-123",
    "originalFileName": "document.pdf",
    "userId": "user-id",
    "userEmail": "user@example.com",
    "status": "scheduled",
    "scheduledAt": "2024-01-21T15:00:00Z",
    "createdAt": "2024-01-20T10:00:00Z"
  }
]
```

#### Get Recently Completed Tasks

```
GET /users/jobs/recent-completed
```

Gets a list of recently completed tasks.

**Response (200):**
```json
[
  {
    "id": 1,
    "fileId": "file-123",
    "originalFileName": "document.pdf",
    "userId": "user-id",
    "userEmail": "user@example.com",
    "status": "completed",
    "scheduledAt": "2024-01-20T10:00:00Z",
    "createdAt": "2024-01-20T09:55:00Z"
  }
]
```

#### Delete Task

```
DELETE /users/jobs/:jobId
```

Deletes a task (requires admin permissions).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "Job deleted successfully"
}
```

---

### User Management (Admin)

All these endpoints require authentication and admin permissions.

#### Get All Users

```
GET /users
```

Gets a list of all users.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
[
  {
    "id": "user-1",
    "email": "user1@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "role": "user",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
]
```

#### Get User

```
GET /users/:userId
```

Gets information about a specific user.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):** User data

#### Get User Tasks

```
GET /users/:userId/jobs
```

Gets all tasks for a specific user.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):** User's task list

#### Update User Role

```
PATCH /users/:userId/role
```

Updates user role.

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response (200):** Updated user

#### Update User Role (via Parameters)

```
PATCH /users/:userId/role/:role
```

Updates user role (role in URL).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):** Updated user

#### Delete User

```
DELETE /users/:userId
```

Deletes a user from the database.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Types and Interfaces

### User

```typescript
interface User {
  id: string;                    // Unique identifier
  email: string;                 // Email address
  firstName: string;             // First name
  lastName: string;              // Last name
  password?: string;             // Password hash
  role: "admin" | "user";        // User role
  isVerified: boolean;           // Verification status
  verificationToken?: string;    // Verification token
  verificationTokenExpiry?: string; // Token expiry
  createdAt: string;             // Creation date (ISO 8601)
  updatedAt: string;             // Last update date (ISO 8601)
  microsoftId?: string;          // Microsoft ID (for Microsoft login)
}
```

### Job

```typescript
type Job = {
  id: number;                    // Unique task identifier
  fileId: string;                // ID of file being processed
  originalFileName: string;      // Original file name
  userId: string;                // Task owner ID
  userEmail: string;             // Owner email
  status: "scheduled" | "pending" | "failed" | "completed"; // Task status
  scheduledAt: string;           // Scheduled date (ISO 8601)
  createdAt: string;             // Creation date (ISO 8601)
}
```

### Config

```typescript
interface configType {
  COSMOS_ENDPOINT: string;       // Cosmos DB endpoint
  COSMOS_KEY: string;            // Cosmos DB access key
  AUTH_SERVICE_URL: string;      // Authentication service URL
  PORT: number;                  // Application port
}
```

---

## Middleware

### requireAuth

Middleware that checks user authentication. Verifies JWT token via authentication service.

**Functionality:**
- Extracts token from `Authorization: Bearer <token>` header
- Sends token to authentication service for verification
- Adds user data to `req.user` object
- Returns 401 error if token is invalid

### requireAdmin

Middleware that checks if user has admin role.

**Requires:** `requireAuth` run beforehand

**Functionality:**
- Checks if `req.user.role === 'admin'`
- Returns 403 error if user is not admin

### requireUser

Middleware that checks if user has user role.

---

## Docker

The project has an optimized Dockerfile for production with multi-stage build.

### Building Image

```bash
docker build -t addipi-user-service:latest .
```

### Running Container

```bash
docker run -p 3002:3002 \
  -e COSMOS_ENDPOINT=your-endpoint \
  -e COSMOS_KEY=your-key \
  -e AUTH_SERVICE_URL=http://auth-service:3001 \
  addipi-user-service:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  user-service:
    build: .
    ports:
      - "3002:3002"
    environment:
      COSMOS_ENDPOINT: ${COSMOS_ENDPOINT}
      COSMOS_KEY: ${COSMOS_KEY}
      AUTH_SERVICE_URL: http://auth-service:3001
      USER_PORT: 3002
    depends_on:
      - auth-service
```

---

## Environment Variables

### Required

- **COSMOS_ENDPOINT** - Azure Cosmos DB endpoint
- **COSMOS_KEY** - Cosmos DB access key

### Optional

- **AUTH_SERVICE_URL** - Authentication service URL (default: `http://localhost:3001`)
- **USER_PORT** - Port on which the service listens (default: `3002`)

---

## Testing

### Postman

The `postman/` folder contains collections for testing the API:

- **collections/** - Collection with all endpoints
- **environments/** - Postman environments (localhost, production, etc.)

### Import Instructions

1. Open Postman
2. Click "Import"
3. Select file from `postman/collections/` folder
4. Import environment from `postman/environments/`
5. Set environment variables (token, userID, etc.)

---

## Communication with Other Services

### Authentication Service

The User Service communicates with the authentication service to verify JWT tokens.

**Verification Endpoint:**
```
POST {AUTH_SERVICE_URL}/auth/verify
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
```

---

## Errors and Response Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Error in request |
| 401 | Unauthorized - Missing authentication |
| 403 | Forbidden - Missing permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Troubleshooting

### Error: Missing env var

**Cause:** Missing required environment variables
**Solution:** Make sure `.env` file contains all required variables

### Error: Failed to create Cosmos DB client

**Cause:** Problem connecting to Azure Cosmos DB
**Solution:** Check correctness of `COSMOS_ENDPOINT` and `COSMOS_KEY`

### Error 401 Unauthorized

**Cause:** Token is invalid or expired
**Solution:** Log in again and use a new token

### Error 403 Forbidden

**Cause:** User does not have required permissions
**Solution:** Make sure user has `admin` role for admin operations

---

## Used Technologies

- **Node.js 20** - JavaScript runtime
- **TypeScript 5.9** - Programming language
- **Express.js 5.2** - Web framework
- **Azure Cosmos DB 4.9** - NoSQL database
- **CORS 2.8** - Cross-Origin Resource Sharing

---

## License

ISC

---

## Contact and Support

- **Repository:** https://github.com/AddiPii/AddiPi-User-Service
- **Issues:** https://github.com/AddiPii/AddiPi-User-Service/issues

---

## Roadmap

- [ ] Add unit tests
- [ ] Add logging
- [ ] Implement rate limiting
- [ ] Add OpenAPI/Swagger documentation
- [ ] Implement caching
- [ ] Monitoring and alerting



# AddiPi-User-Service - Polish

Serwis zarządzania użytkownikami dla aplikacji AddiPi. Aplikacja zapewnia API do zarządzania użytkownikami, zadaniami i statystykami, z uwierzytelnianiem oparte na tokenach JWT i kontrolą dostępu opartą na rolach.

## 📋 Spis Treści

- [Przegląd](#przegląd)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Uruchamianie](#uruchamianie)
- [Struktura Projektu](#struktura-projektu)
- [API Endpointy](#api-endpointy)
- [Typy i Interfejsy](#typy-i-interfejsy)
- [Middleware](#middleware)
- [Docker](#docker)
- [Zmienne Środowiskowe](#zmienne-środowiskowe)

## Przegląd

**AddiPi-User-Service** jest mikroserwisem odpowiedzialnym za:

- 👤 Zarządzanie profilami użytkowników
- 📊 Śledzenie zadań i ich statusów
- 📈 Zbieranie statystyk użytkownika
- 🔐 Uwierzytelnianie i autoryzacja
- 📋 Kontrolę dostępu opartą na rolach (Admin/User)

Serwis wykorzystuje:
- **Express.js** - framework webowy
- **TypeScript** - typowanie statyczne
- **Azure Cosmos DB** - baza danych
- **CORS** - obsługa cross-origin requests

## Wymagania

- Node.js 20 lub wyższa
- npm 10 lub wyższa
- Dostęp do Azure Cosmos DB (punkt końcowy i klucz dostępu)
- Dostęp do serwisu autentykacyjnego (AUTH_SERVICE_URL)

## Instalacja

### 1. Klonowanie Repozytorium

```bash
git clone https://github.com/AddiPii/AddiPi-User-Service.git
cd AddiPi-User-Service
```

### 2. Instalacja Zależności

```bash
npm install
```

### 3. Konfiguracja Zmiennych Środowiskowych

Utwórz plik `.env` w głównym katalogu projektu:

```env
# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key

# Serwis Autentykacji
AUTH_SERVICE_URL=http://localhost:3001

# Port Serwisu
USER_PORT=3002
```

## Konfiguracja

Konfiguracja jest zarządzana w pliku [src/config/config.ts](src/config/config.ts).

### Zmienne Środowiskowe

| Zmienna | Typ | Wymagana | Opis |
|---------|-----|----------|------|
| `COSMOS_ENDPOINT` | string | ✅ | Punkt końcowy Azure Cosmos DB |
| `COSMOS_KEY` | string | ✅ | Klucz dostępu do Cosmos DB |
| `AUTH_SERVICE_URL` | string | ❌ | URL serwisu autentykacji (domyślnie: http://localhost:3001) |
| `USER_PORT` | number | ❌ | Port serwisu (domyślnie: 3002) |

## Uruchamianie

### Tryb Programistyczny

```bash
npm start
```

Ta komenda kompiluje TypeScript i uruchamia serwer.

### Tylko Kompilacja

```bash
npm build
```

Skompilowany kod trafia do folderu `dist/`.

### Tryb Produkcyjny

```bash
node dist/index.js
```

## Struktura Projektu

```
AddiPi-User-Service/
├── src/
│   ├── index.ts              # Punkt wejścia aplikacji
│   ├── type.ts               # Globalne typy i interfejsy
│   ├── config/
│   │   └── config.ts         # Konfiguracja aplikacji
│   ├── controllers/
│   │   ├── usersControllers.ts       # Logika zarządzania użytkownikami
│   │   ├── jobControllers.ts         # Logika zarządzania zadaniami
│   │   └── meControllers.ts          # Logika profilu zalogowanego użytkownika
│   ├── routes/
│   │   ├── users.ts          # Endpointy zarządzania użytkownikami (admin)
│   │   ├── jobs.ts           # Endpointy zadań
│   │   └── me.ts             # Endpointy profilu
│   ├── middleware/
│   │   ├── requireAuth.ts    # Middleware uwierzytelniania
│   │   ├── requireAdmin.ts   # Middleware autoryzacji admin
│   │   ├── requireUser.ts    # Middleware autoryzacji user
│   │   └── mwTypes.ts        # Typy dla middleware
│   ├── services/
│   │   └── containers.ts     # Zarządzanie kontenerami Cosmos DB
│   ├── db/
│   │   └── cosmosConnect.ts  # Połączenie z Cosmos DB
│   └── helpers/
│       └── getLocalISO.ts    # Funkcje pomocnicze
├── package.json
├── tsconfig.json
├── Dockerfile
├── postman/                  # Kolekcje Postman do testowania API
└── README.md
```

## API Endpointy

### Health Check

```
GET /health
```

Zwraca status zdrowotności serwera.

**Response (200):**
```json
{
  "ok": true
}
```

---

### Profil Użytkownika (Me)

Operacje na profilu zalogowanego użytkownika. Wymagana autentykacja.

#### Pobierz Profil

```
GET /users/me
```

Pobiera informacje o zalogowanym użytkowniku.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "user",
  "isVerified": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

#### Edytuj Profil

```
PATCH /users/me
```

Aktualizuje informacje o zalogowanym użytkowniku.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Jan",
  "lastName": "Nowak",
  "email": "newemail@example.com"
}
```

**Response (200):** Zaktualizowany profil użytkownika

#### Pobierz Zadania Użytkownika

```
GET /users/me/jobs
```

Pobiera listę zadań zalogowanego użytkownika.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "fileId": "file-123",
    "originalFileName": "document.pdf",
    "userId": "user-id",
    "userEmail": "user@example.com",
    "status": "completed",
    "scheduledAt": "2024-01-20T10:00:00Z",
    "createdAt": "2024-01-20T09:55:00Z"
  }
]
```

#### Pobierz Statystyki

```
GET /users/me/stats
```

Pobiera statystyki użytkownika.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalJobs": 15,
  "completedJobs": 12,
  "failedJobs": 1,
  "pendingJobs": 2
}
```

---

### Zadania (Jobs)

#### Pobierz Zaplanowane Zadania

```
GET /users/jobs/upcomming
```

Pobiera listę zaplanowanych zadań.

**Response (200):**
```json
[
  {
    "id": 1,
    "fileId": "file-123",
    "originalFileName": "document.pdf",
    "userId": "user-id",
    "userEmail": "user@example.com",
    "status": "scheduled",
    "scheduledAt": "2024-01-21T15:00:00Z",
    "createdAt": "2024-01-20T10:00:00Z"
  }
]
```

#### Pobierz Ostatnio Ukończone Zadania

```
GET /users/jobs/recent-completed
```

Pobiera listę niedawno ukończonych zadań.

**Response (200):**
```json
[
  {
    "id": 1,
    "fileId": "file-123",
    "originalFileName": "document.pdf",
    "userId": "user-id",
    "userEmail": "user@example.com",
    "status": "completed",
    "scheduledAt": "2024-01-20T10:00:00Z",
    "createdAt": "2024-01-20T09:55:00Z"
  }
]
```

#### Usuń Zadanie

```
DELETE /users/jobs/:jobId
```

Usuwa zadanie (wymaga uprawnień administratora).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "Job deleted successfully"
}
```

---

### Zarządzanie Użytkownikami (Admin)

Wszystkie te endpointy wymagają uwierzytelniania i uprawnień administratora.

#### Pobierz Wszystkich Użytkowników

```
GET /users
```

Pobiera listę wszystkich użytkowników.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
[
  {
    "id": "user-1",
    "email": "user1@example.com",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "role": "user",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
]
```

#### Pobierz Użytkownika

```
GET /users/:userId
```

Pobiera informacje o konkretnym użytkowniku.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):** Dane użytkownika

#### Pobierz Zadania Użytkownika

```
GET /users/:userId/jobs
```

Pobiera wszystkie zadania konkretnego użytkownika.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):** Lista zadań użytkownika

#### Zaktualizuj Rolę Użytkownika

```
PATCH /users/:userId/role
```

Aktualizuje rolę użytkownika.

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response (200):** Zaktualizowany użytkownik

#### Zaktualizuj Rolę Użytkownika (via Parametry)

```
PATCH /users/:userId/role/:role
```

Aktualizuje rolę użytkownika (rola w URL).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):** Zaktualizowany użytkownik

#### Usuń Użytkownika

```
DELETE /users/:userId
```

Usuwa użytkownika z bazy danych.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Typy i Interfejsy

### User

```typescript
interface User {
  id: string;                    // Unikalny identyfikator
  email: string;                 // Adres email
  firstName: string;             // Imię
  lastName: string;              // Nazwisko
  password?: string;             // Hash hasła
  role: "admin" | "user";        // Rola użytkownika
  isVerified: boolean;           // Status weryfikacji
  verificationToken?: string;    // Token weryfikacyjny
  verificationTokenExpiry?: string; // Expiracja tokenu
  createdAt: string;             // Data utworzenia (ISO 8601)
  updatedAt: string;             // Data ostatniej aktualizacji (ISO 8601)
  microsoftId?: string;          // ID Microsoft (dla logowania przez Microsoft)
}
```

### Job

```typescript
type Job = {
  id: number;                    // Unikalny identyfikator zadania
  fileId: string;                // ID pliku przetwarzanego
  originalFileName: string;      // Oryginalna nazwa pliku
  userId: string;                // ID właściciela zadania
  userEmail: string;             // Email właściciela
  status: "scheduled" | "pending" | "failed" | "completed"; // Status zadania
  scheduledAt: string;           // Data zaplanowania (ISO 8601)
  createdAt: string;             // Data utworzenia (ISO 8601)
}
```

### Config

```typescript
interface configType {
  COSMOS_ENDPOINT: string;       // Punkt końcowy Cosmos DB
  COSMOS_KEY: string;            // Klucz dostępu Cosmos DB
  AUTH_SERVICE_URL: string;      // URL serwisu autentykacji
  PORT: number;                  // Port aplikacji
}
```

---

## Middleware

### requireAuth

Middleware sprawdzający autentyczność użytkownika. Weryfikuje token JWT poprzez serwis autentykacji.

**Funkcjonalność:**
- Extrahuje token z nagłówka `Authorization: Bearer <token>`
- Wysyła token do serwisu autentykacji do weryfikacji
- Dodaje dane użytkownika do obiektu `req.user`
- Zwraca błąd 401, jeśli token jest nieważny

### requireAdmin

Middleware sprawdzający, czy użytkownik ma rolę administratora.

**Wymaga:** `requireAuth` uruchomiony wcześniej

**Funkcjonalność:**
- Sprawdza, czy `req.user.role === 'admin'`
- Zwraca błąd 403, jeśli użytkownik nie jest administratorem

### requireUser

Middleware sprawdzający, czy użytkownik ma rolę użytkownika.

---

## Docker

Projekt posiada optimizowany Dockerfile dla produkcji z multi-stage buildiem.

### Budowanie Obrazu

```bash
docker build -t addipi-user-service:latest .
```

### Uruchamianie Kontenera

```bash
docker run -p 3002:3002 \
  -e COSMOS_ENDPOINT=your-endpoint \
  -e COSMOS_KEY=your-key \
  -e AUTH_SERVICE_URL=http://auth-service:3001 \
  addipi-user-service:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  user-service:
    build: .
    ports:
      - "3002:3002"
    environment:
      COSMOS_ENDPOINT: ${COSMOS_ENDPOINT}
      COSMOS_KEY: ${COSMOS_KEY}
      AUTH_SERVICE_URL: http://auth-service:3001
      USER_PORT: 3002
    depends_on:
      - auth-service
```

---

## Zmienne Środowiskowe

### Wymagane

- **COSMOS_ENDPOINT** - Punkt końcowy Azure Cosmos DB
- **COSMOS_KEY** - Klucz dostępu do Cosmos DB

### Opcjonalne

- **AUTH_SERVICE_URL** - URL serwisu autentykacji (domyślnie: `http://localhost:3001`)
- **USER_PORT** - Port, na którym słucha serwis (domyślnie: `3002`)

---

## Testowanie

### Postman

W folderze `postman/` znajdują się kolekcje do testowania API:

- **collections/** - Kolekcja z wszystkimi endpointami
- **environments/** - Środowiska Postman (localhost, production, etc.)

### Instrukcja Importu

1. Otwórz Postman
2. Kliknij "Import"
3. Wybierz plik z folderu `postman/collections/`
4. Zaimportuj środowisko z `postman/environments/`
5. Ustaw zmienne środowiskowe (token, userID, etc.)

---

## Komunikacja z Innymi Serwisami

### Serwis Autentykacji

Serwis User Service komunikuje się z serwisem autentykacji w celu weryfikacji tokenów JWT.

**Endpoint Weryfikacji:**
```
POST {AUTH_SERVICE_URL}/auth/verify
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
```

---

## Błędy i Kody Odpowiedzi

| Kod | Opis |
|-----|------|
| 200 | OK - Żądanie powiodło się |
| 201 | Created - Zasób utworzony |
| 400 | Bad Request - Błąd w żądaniu |
| 401 | Unauthorized - Brakuje uwierzytelniania |
| 403 | Forbidden - Brakuje uprawnień |
| 404 | Not Found - Zasób nie znaleziony |
| 500 | Internal Server Error - Błąd serwera |

---

## Troubleshooting

### Błąd: Missing env var

**Przyczyna:** Brakuje wymaganych zmiennych środowiskowych
**Rozwiązanie:** Upewnij się, że plik `.env` zawiera wszystkie wymagane zmienne

### Błąd: Failed to create Cosmos DB client

**Przyczyna:** Problem z połączeniem do Azure Cosmos DB
**Rozwiązanie:** Sprawdź poprawność `COSMOS_ENDPOINT` i `COSMOS_KEY`

### Błąd 401 Unauthorized

**Przyczyna:** Token jest nieważny lub wygasł
**Rozwiązanie:** Zaloguj się ponownie i użyj nowego tokenu

### Błąd 403 Forbidden

**Przyczyna:** Użytkownik nie ma wymaganych uprawnień
**Rozwiązanie:** Upewnij się, że użytkownik ma rolę `admin` dla operacji administratora

---

## Użyte Technologie

- **Node.js 20** - Runtime JavaScript
- **TypeScript 5.9** - Język programowania
- **Express.js 5.2** - Framework webowy
- **Azure Cosmos DB 4.9** - Baza danych NoSQL
- **CORS 2.8** - Cross-Origin Resource Sharing

---

## Licencja

ISC

---

## Kontakt i Wsparcie

- **Repozytorium:** https://github.com/AddiPii/AddiPi-User-Service
- **Issues:** https://github.com/AddiPii/AddiPi-User-Service/issues

---

## Roadmap

- [ ] Dodać testy jednostkowe
- [ ] Dodać logowanie (logging)
- [ ] Implementacja rate limitingu
- [ ] Dodać dokumentację OpenAPI/Swagger
- [ ] Implementacja caching'u
- [ ] Monitoring i alerting
