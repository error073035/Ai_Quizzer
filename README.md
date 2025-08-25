# AI Quizzer  

AI Quizzer is a **Node.js + Express backend application** for adaptive, AI-powered quizzes. It provides **user authentication, AI-generated quiz creation (Groq), submission tracking, hints, leaderboards, Redis caching, email notifications**, and interactive **Swagger API docs**.  

**Hosted URL**: [https://ai-quizzer-kahanhirani.vercel.app](https://ai-quizzer-kahanhirani.vercel.app)  

**Important**: All requests must be sent under `/api/v1/`  
Example: `https://ai-quizzer-kahanhirani.vercel.app/api/v1/users/register`  

---

## Table of Contents
- [Base URL](#base-url)  
- [User Endpoints](#user-endpoints)  
- [Quiz Endpoints](#quiz-endpoints)  
- [Submission Endpoints](#submission-endpoints)  
- [Hint Endpoints](#hint-endpoints)  
- [Leaderboard Endpoints](#leaderboard-endpoints)  
- [Schemas](#schemas)  
- [Services](#services)  
- [Libraries Used](#libraries-used)  
- [Environment Variables](#environment-variables)  
- [Sample Postman Requests](#sample-postman-requests)  
- [Quick Usage Guide](#quick-usage-guide)  
- [Getting Started (Local Development)](#getting-started-local-development)  
- [Notes](#notes)  

---

## Base URL  
All API endpoints are prefixed with:  

```
https://ai-quizzer-kahanhirani.vercel.app/api/v1/
```

**Examples:**  
- Correct: `https://ai-quizzer-kahanhirani.vercel.app/api/v1/users/register`  

---

## User Endpoints  

| Method | Endpoint                  | Description                | Auth Required |
|--------|---------------------------|----------------------------|--------------|
| POST   | `/users/register`         | Register a new user        | No           |
| POST   | `/users/login`            | Login user                 | No           |
| POST   | `/users/logout`           | Logout user                | Yes          |
| GET    | `/users/profile`          | Get logged-in user profile | Yes          |

---

## Quiz Endpoints  

| Method | Endpoint                  | Description                          | Auth Required |
|--------|---------------------------|--------------------------------------|--------------|
| POST   | `/quiz`                   | Create a quiz (AI-generated)         | Yes          |
| GET    | `/quiz/:quizId`           | Get quiz by ID                       | Yes          |
| GET    | `/quiz`                   | Get all quizzes by logged-in user    | Yes          |
| DELETE | `/quiz/:quizId`           | Delete quiz                          | Yes          |
| POST   | `/quiz/:quizId/hint`      | Get AI-generated hint for a question | Yes          |

---

## Submission Endpoints  

| Method | Endpoint                        | Description                 | Auth Required |
|--------|---------------------------------|-----------------------------|--------------|
| POST   | `/submission/:quizId/submit`    | Submit answers              | Yes          |
| POST   | `/submission/:quizId/retry`     | Retry quiz submission       | Yes          |
| GET    | `/submission/history`           | Get submission history      | Yes          |

---

## Leaderboard Endpoints  

| Method | Endpoint              | Description            | Auth Required |
|--------|-----------------------|------------------------|--------------|
| GET    | `/leaderboard`        | Get top leaderboard    | Yes          |

---

## Swagger Docs  

- Interactive API Docs available at:  
[`/api-docs`](https://ai-quizzer-kahanhirani.vercel.app/api-docs)  

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
      "text": "string",
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
    { "questionId": "string", "selectedOption": "string", "isCorrect": "boolean" }
  ],
  "score": "integer",
  "mistakes": [
    { "questionId": "string", "expected": "string", "got": "string" }
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
  - `REDIS_URL` (recommended single URL config).  

### Email  
- Sends quiz result notifications to users.  
- Uses Gmail SMTP via `nodemailer`.  
- Configured via `.env`:  
  - `EMAIL_USER`, `EMAIL_PASS`  

### Swagger Docs  
- Interactive API documentation at `/api-docs`.  
- Powered by `swagger-jsdoc` and `swagger-ui-express`.  

### Groq AI Integration  
- Quiz questions and hints are generated using Groq’s LLM API.  
- API Key: `GROQ_API_KEY` in `.env`.  

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
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
REDIS_URL=your_redis_url
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

---

## Sample Postman Requests  

### Register User  
```http
POST https://ai-quizzer-kahanhirani.vercel.app/api/v1/users/register
Content-Type: application/json

{
  "username": "kahanhirani",
  "email": "kahanhirani073@gmail.com",
  "password": "kahanhirani123"
}
```

### Login User  
```http
POST https://ai-quizzer-kahanhirani.vercel.app/api/v1/users/login
Content-Type: application/json

{
  "email": "kahanhirani073@gmail.com",
  "password": "kahanhirani123"
}
```

### Create Quiz  
```http
POST https://ai-quizzer-kahanhirani.vercel.app/api/v1/quiz
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
POST https://ai-quizzer-kahanhirani.vercel.app/api/v1/submission/<quizId>/submit
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "answers": [
    { "questionId": "123", "selectedOption": "A" },
    { "questionId": "124", "selectedOption": "B" }
  ]
}
```

---

## Quick Usage Guide  

1. **Register** → `POST /users/register`  
2. **Login** → `POST /users/login` (get JWT token)  
3. **Create a Quiz** → `POST /quiz` (requires token)  
4. **Attempt Quiz** → `POST /submission/:quizId/submit`  
5. **Check Leaderboard** → `GET /leaderboard`  

---

## Getting Started (Local Development)  

1. Clone repository and install dependencies:  
   ```sh
   npm install
   ```  
2. Create `.env` file with all required variables.  
3. Start MongoDB and Redis locally.  
4. Run server:  
   ```sh
   npm run dev
   ```  
5. Access Swagger docs at:  
   [http://localhost:5000/api-docs](http://localhost:5000/api-docs)  

---

## Notes  

- All protected endpoints require JWT authentication (`Authorization: Bearer <token>`).  
- Quizzes and hints are dynamically generated using **Groq AI**.  
- Redis improves performance with caching.  
- Email notifications are triggered after submissions.  
- All endpoints are fully documented in **Swagger UI**.  

---

 **Enjoy using AI Quizzer!**
