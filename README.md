# AI Quizzer

AI Quizzer is a Node.js + Express backend application for adaptive, AI-powered quizzes. It features user authentication, quiz creation with Groq AI-generated questions, submission tracking, hints, leaderboards, Redis caching, email notifications, and interactive Swagger API docs.

---

## Table of Contents

- [User Endpoints](#user-endpoints)
- [Quiz Endpoints](#quiz-endpoints)
- [Submission Endpoints](#submission-endpoints)
- [Hint Endpoints](#hint-endpoints)
- [Leaderboard Endpoints](#leaderboard-endpoints)
- [Schemas](#schemas)
- [Services](#services)
  - [Redis](#redis)
  - [Email](#email)
  - [Swagger Docs](#swagger-docs)
  - [Groq AI Integration](#groq-ai-integration)
- [Libraries Used](#libraries-used)
- [Environment Variables](#environment-variables)
- [Sample Postman Requests](#sample-postman-requests)
- [Getting Started](#getting-started)

---

## User Endpoints

| Method | Endpoint           | Description                          | Auth Required |
|--------|--------------------|--------------------------------------|--------------|
| POST   | `/api/v1/users/register` | Register a new user                  | No           |
| POST   | `/api/v1/users/login`    | Login user                           | No           |
| POST   | `/api/v1/users/logout`   | Logout user                          | Yes          |
| GET    | `/api/v1/users/profile`  | Get logged-in user profile           | Yes          |

---

## Quiz Endpoints

| Method | Endpoint                  | Description                                 | Auth Required |
|--------|---------------------------|---------------------------------------------|--------------|
| POST   | `/api/v1/quiz`            | Create a quiz (AI-generated questions)      | Yes          |
| GET    | `/api/v1/quiz/:quizId`    | Get quiz by ID                              | Yes          |
| GET    | `/api/v1/quiz`            | Get all quizzes created by the user         | Yes          |
| DELETE | `/api/v1/quiz/:quizId`    | Delete quiz                                 | Yes          |
| POST   | `/api/v1/quiz/:quizId/hint` | Get AI-generated hint for a question        | Yes          |

---

## Submission Endpoints

| Method | Endpoint                        | Description                                 | Auth Required |
|--------|---------------------------------|---------------------------------------------|--------------|
| POST   | `/api/v1/submission/:quizId/submit` | Submit answers to a quiz                    | Yes          |
| POST   | `/api/v1/submission/:quizId/retry`  | Retry quiz submission                       | Yes          |
| GET    | `/api/v1/submission/history`        | Get quiz submission history with filters    | Yes          |

---

## Hint Endpoints

| Method | Endpoint                        | Description                                 | Auth Required |
|--------|---------------------------------|---------------------------------------------|--------------|
| POST   | `/api/v1/quiz/:quizId/hint`     | Get AI-generated hint for a question        | Yes          |

---

## Leaderboard Endpoints

| Method | Endpoint                        | Description                                 | Auth Required |
|--------|---------------------------------|---------------------------------------------|--------------|
| GET    | `/api/v1/leaderboard`           | Get top students leaderboard                | Yes          |

---

## Schemas

### User

```json
{
  "username": "string (3-30 chars, required)",
  "email": "string (email, required)",
  "password": "string (min 6 chars, required)",
  "role": "student | admin (default: student)"
}
```

### Quiz

```json
{
  "subject": "string (required)",
  "grade": "integer (1-12, required)",
  "questions": [
    {
      "text": "string (required)",
      "options": ["string", "string", "string", "string"],
      "answerKey": "string (must be one of the options)",
      "difficulty": "easy | medium | hard",
      "hint": "string"
    }
  ],
  "createdBy": "User reference",
  "adaptiveDifficultyUsed": "boolean"
}
```

### Submission

```json
{
  "userId": "User reference",
  "quizId": "Quiz reference",
  "answers": [
    {
      "questionId": "string",
      "selectedOption": "string",
      "isCorrect": "boolean"
    }
  ],
  "score": "integer",
  "mistakes": [
    {
      "questionId": "string",
      "expected": "string",
      "got": "string"
    }
  ],
  "suggestions": ["string"],
  "attemptNo": "integer",
  "completedAt": "date",
  "grade": "integer",
  "subject": "string"
}
```

### Leaderboard

```json
{
  "userId": "User reference",
  "username": "string",
  "avgScore": "number",
  "maxScore": "number",
  "attempts": "integer"
}
```

---

## Services

### Redis

- Used for caching quizzes and leaderboard data for fast access.
- Configured via `.env`:
  - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- See [`db/redis.js`](db/redis.js).

### Email

- Sends quiz result notifications to users.
- Uses Gmail SMTP via `nodemailer`.
- Configured via `.env`:
  - `EMAIL_USER`, `EMAIL_PASS`
- See [`utilities/email.js`](utilities/email.js).

### Swagger Docs

- Interactive API documentation at [`/api-docs`](http://localhost:5000/api-docs).
- Powered by `swagger-jsdoc` and `swagger-ui-express`.
- All endpoints are documented with request/response schemas and examples.

### Groq AI Integration

- Quiz questions and hints are generated using Groq's LLM API.
- API Key: `GROQ_API_KEY` in `.env`.
- Used in quiz and hint controllers:
  - POST requests to `https://api.groq.com/openai/v1/chat/completions`
  - Models: `llama-3.1-8b-instant`
- Example prompt for quiz generation:
  ```
  Generate 5 medium level Mathematics quiz questions for grade 8.
  Return a valid JSON array. Each object must follow this schema exactly:
  {
    "text": "string",
    "options": ["string","string","string","string"],
    "answerKey": "string (must be one of the options)",
    "difficulty": "medium"
  }
  ```

---

## Libraries Used

- express
- mongoose
- joi
- bcrypt
- jsonwebtoken
- cookie-parser
- dotenv
- axios
- ioredis
- nodemailer
- swagger-jsdoc
- swagger-ui-express
- morgan

---

## Environment Variables

Set these in your `.env` file:

```properties
PORT=5000
DB_URL=mongodb://localhost:27017/aiQuizzer
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

---

## Sample Postman Requests

### Register User

```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "kahanhirani",
  "email": "kahanhirani073@gmail.com",
  "password": "kahanhirani123"
}
```

### Login User

```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "kahanhirani073@gmail.com",
  "password": "kahanhirani123"
}
```

### Create Quiz

```http
POST /api/v1/quiz
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "subject": "Science",
  "grade": 8,
  "numQuestions": 5
}
```

### Submit Quiz

```http
POST /api/v1/submission/<quizId>/submit
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "answers": [
    { "questionId": "123", "selectedOption": "A" },
    { "questionId": "124", "selectedOption": "B" }
  ]
}
```

### Get Hint

```http
POST /api/v1/quiz/<quizId>/hint
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "questionId": "123"
}
```

### Get Leaderboard

```http
GET /api/v1/leaderboard?subject=Science&grade=8&limit=10
Authorization: Bearer <JWT_TOKEN>
```

---

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your `.env` file with all required variables.
4. Start MongoDB and Redis locally.
5. Run the server:
   ```
   npm start
   ```
6. Access Swagger docs at [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

---

## Notes

- All protected endpoints require JWT authentication (`Authorization: Bearer <token>`).
- Quiz creation and hints use Groq AI for dynamic content.
- Redis improves performance for quizzes and leaderboards.
- Email notifications are sent after quiz submission.
- All endpoints are fully documented and testable via Swagger UI.

---

**Enjoy building with AI Quizzer!**