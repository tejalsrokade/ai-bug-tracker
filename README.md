# AI Bug Tracker & Log Analyzer

A full-stack bug tracking application that helps developers manage software bugs and understand error logs faster using AI. Paste an error message or stack trace, get a plain-English explanation, possible causes, and suggested debugging steps, then save that analysis directly with the bug.

 **Status:** In active development.

---

## Features

- **Bug management (CRUD):** create, view, edit, and delete bugs with title, description, severity, status, and error log.
- **Dashboard:** summary cards for total, open, in-progress, and resolved bugs, plus a bug table with status and severity labels.
- **Search and filters:** search by title, filter by status (Open, In Progress, Resolved) and severity (Low, Medium, High, Critical).
- **AI log analysis:** paste an error or stack trace and click **Analyze with AI** to get:
  - a simple explanation of the error
  - possible causes
  - suggested debugging steps
- **Save AI analysis with a bug:** store the analysis against a bug record and view it again later.
- **Validation and error handling:** request validation and consistent JSON error responses from the API.

AI suggestions are possible explanations, not guaranteed fixes. Always verify before applying them.

---

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React, Vite, Axios, Tailwind CSS            |
| Backend    | Java, Spring Boot, Spring Data JPA, Validation |
| Database   | MySQL                                       |
| AI         | Google Gemini API (called from the backend) |
| Build tool | Maven                                       |

---

## Architecture

```
React frontend
  Dashboard · Bug forms · Log analyzer
        │  REST (JSON)
        ▼
Spring Boot API
  Controllers · Services · DTOs · Validation · Exception handling
        │                         │
        ▼                         ▼
      MySQL                   Gemini API
  Bugs and analyses     Error explanation and suggestions
```

The Gemini API key lives only on the backend and is never exposed to the browser.

---

## Project Structure

```
AIBugTracker/
├── ai-bug-tracker/        # Spring Boot application
│   └── src/main/java/com/bugtracker/ai_bug_tracker/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       └── exception/
├── frontend/       # React application
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
└── README.md
```

---

## Getting Started

### Prerequisites

- Java 17 or later
- Maven
- Node.js 18 or later
- MySQL 8 or later
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/<tejalsrokade>/ai-bug-tracker.git
cd ai-bug-tracker
```

### 2. Set up the database

```sql
CREATE DATABASE ai_bug_tracker;
```

### 3. Configure the backend

Create `ai-bug-tracker/src/main/resources/application.properties` (or copy `application.properties.example`):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_bug_tracker
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

gemini.api.key=${GEMINI_API_KEY}
```

Set the API key as an environment variable instead of hard-coding it:

```bash
# macOS / Linux
export GEMINI_API_KEY=your_key_here

# Windows (PowerShell)
$env:GEMINI_API_KEY="your_key_here"
```

### 4. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| POST   | `/api/bugs`       | Create a bug                      |
| GET    | `/api/bugs`       | Get all bugs                      |
| GET    | `/api/bugs/{id}`  | Get a bug by id                   |
| PUT    | `/api/bugs/{id}`  | Update a bug                      |
| DELETE | `/api/bugs/{id}`  | Delete a bug                      |

More endpoints (search, filters, dashboard stats, AI analysis) will be added as development progresses.

**Error response example**

```json
{ "message": "Bug not found with id: 77" }
```

## Author

**TEJAL ROKADE**
