# CareerPilot AI

AI-powered interview preparation web app built with a React frontend and an Express/MongoDB backend. The application lets a user:

- register and log in with cookie-based authentication
- upload a PDF resume or write a self-description
- paste a target job description
- generate an AI interview preparation report
- review technical questions, behavioral questions, skill gaps, and a day-wise preparation plan
- download an AI-tailored PDF resume based on the generated report
- revisit recent interview plans from the dashboard

## Overview

This project is split into two separate apps:

- `Frontend/`: React + Vite client
- `Backend/`: Express + MongoDB + Google GenAI server

The backend accepts user profile information and a target job description, sends a structured prompt to Google GenAI, stores the generated interview report in MongoDB, and returns it to the frontend. The frontend then presents the report in a dashboard-style UI with protected routes.

## Main Features

### Authentication

- User registration with username, email, and password
- Password strength validation
- Login with email and password
- Cookie-based JWT authentication
- Logout with token blacklisting
- Protected frontend routes

### Interview Report Generation

- Accepts a target job description
- Accepts either:
  - a PDF resume, or
  - a self-description
- Extracts text from uploaded PDF resumes
- Generates a structured interview report using Google GenAI
- Saves generated reports to MongoDB

### Interview Report View

- Match score
- Technical interview questions
- Behavioral interview questions
- Skill gaps with severity labels
- Day-wise preparation roadmap
- Dynamic score summary based on report strength

### Resume Generation

- Generates a polished, job-targeted resume in PDF format
- Uses AI-generated HTML converted to PDF through Puppeteer

### UX

- Custom auth pages
- Dashboard home layout with recent reports sidebar
- Uploaded resume visual state
- Custom 404 / route error page
- Download resume action from the interview detail page

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Sass

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT
- bcryptjs
- multer
- pdf-parse
- Puppeteer
- Zod
- Google GenAI SDK

## Project Structure

```text
interview-ai-yt-main/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── interview.controller.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   └── file.middleware.js
│       ├── models/
│       │   ├── blacklist.model.js
│       │   ├── interviewReport.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── interview.routes.js
│       └── services/
│           └── ai.service.js
├── Frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── app.routes.jsx
│       ├── main.jsx
│       ├── style.scss
│       └── features/
│           ├── auth/
│           │   ├── auth.context.jsx
│           │   ├── auth.form.scss
│           │   ├── components/
│           │   │   └── Protected.jsx
│           │   ├── hooks/
│           │   │   └── useAuth.js
│           │   ├── pages/
│           │   │   ├── Login.jsx
│           │   │   └── Register.jsx
│           │   └── services/
│           │       └── auth.api.js
│           ├── common/
│           │   ├── pages/
│           │   │   └── RouteErrorPage.jsx
│           │   └── style/
│           │       └── route-error.scss
│           └── interview/
│               ├── hooks/
│               │   └── useInterview.js
│               ├── interview.context.jsx
│               ├── pages/
│               │   ├── Home.jsx
│               │   └── Interview.jsx
│               ├── services/
│               │   └── interview.api.js
│               └── style/
│                   ├── home.scss
│                   └── interview.scss
└── README.md
```

## How the App Works

### 1. User signs up or logs in

The backend validates the request, hashes the password during registration, signs a JWT, and stores the token in an `httpOnly` cookie.

### 2. User opens the dashboard

The frontend checks the active session through `/api/auth/get-me`. If authenticated, the dashboard and report routes are accessible.

### 3. User submits interview inputs

The user provides:

- a job description
- and either:
  - a PDF resume, or
  - a self-description

### 4. Backend prepares the AI input

If a resume is uploaded:

- `multer` keeps the file in memory
- `pdf-parse` extracts resume text

The backend then combines:

- extracted resume text
- self-description
- job description

and sends the combined prompt to Google GenAI.

### 5. AI generates a structured report

The backend uses a Zod schema to force a structured JSON response containing:

- `title`
- `matchScore`
- `technicalQuestions`
- `behavioralQuestions`
- `skillGaps`
- `preparationPlan`

### 6. Report is stored in MongoDB

The full report is persisted so users can revisit it later.

### 7. Frontend displays the report

The interview detail page shows:

- question sections
- roadmap section
- score indicator
- skill gap tags
- resume download action

### 8. Resume PDF can be generated

The backend sends report inputs to Google GenAI again, requests resume HTML, and then converts the HTML to a downloadable PDF using Puppeteer.

## Generated Report Schema

Each stored interview report contains:

- `title`: job title inferred or generated by the AI
- `matchScore`: number from 0 to 100
- `technicalQuestions`: array of objects with:
  - `question`
  - `intention`
  - `answer`
- `behavioralQuestions`: array of objects with:
  - `question`
  - `intention`
  - `answer`
- `skillGaps`: array of objects with:
  - `skill`
  - `severity` (`low`, `medium`, `high`)
- `preparationPlan`: array of objects with:
  - `day`
  - `focus`
  - `tasks`
- `jobDescription`
- `resume`
- `selfDescription`
- `user`
- timestamps

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ recommended
- npm
- MongoDB database connection string
- Google GenAI API key

## Environment Variables

### Backend

Create `Backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
NODE_ENV=development
```

### Frontend

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Local Development Setup

### 1. Install backend dependencies

```bash
cd Backend
npm install
```

### 2. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

### 3. Start the backend

```bash
cd ../Backend
npm run dev
```

The backend currently starts on:

```text
http://localhost:3000
```

### 4. Start the frontend

```bash
cd ../Frontend
npm run dev
```

The frontend usually starts on:

```text
http://localhost:5173
```

## Available Scripts

### Backend

```bash
npm run dev
```

Starts the Express server with:

- environment variables from `.env`
- MongoDB connection
- `nodemon` via `npx`

There is currently no production script or automated test script configured beyond the default placeholder.

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Frontend Routes

| Route | Access | Description |
| --- | --- | --- |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/` | Protected | Main dashboard / report generation page |
| `/interview/:interviewId` | Protected | Interview report detail page |
| `*` | Public | Custom route error / 404 page |

## Backend API Reference

### Auth Endpoints

#### `POST /api/auth/register`

Register a new user.

Request body:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "StrongPass1!"
}
```

Validation rules:

- `username`: 3 to 30 characters, letters/numbers/underscore/hyphen
- `email`: valid email format
- `password`:
  - minimum 8 characters
  - must include uppercase
  - must include lowercase
  - must include a number
  - must include a special character from `!@#$%^&*`

Rate limit:

- 3 registration attempts per hour

Response:

- success message
- basic user object
- auth cookie

#### `POST /api/auth/login`

Authenticate a user.

Request body:

```json
{
  "email": "john@example.com",
  "password": "StrongPass1!"
}
```

Rate limit:

- 5 login attempts per 15 minutes

Response:

- success message
- basic user object
- auth cookie

#### `GET /api/auth/logout`

Logs the user out by:

- reading the token from cookies
- saving it into the blacklist collection
- clearing the cookie

#### `GET /api/auth/get-me`

Protected endpoint that returns the currently authenticated user.

### Interview Endpoints

#### `POST /api/interview/`

Protected endpoint that generates a new interview report.

Form fields:

- `jobDescription` (required)
- `selfDescription` (optional if resume is uploaded)
- `resume` (optional if self-description is provided)

Rules:

- job description is required
- at least one of `resume` or `selfDescription` is required
- only PDF resume uploads are currently supported
- max file size: 3 MB

Response:

- generated report object

#### `GET /api/interview/`

Protected endpoint that returns all reports for the logged-in user.

Optimized for listing: the response excludes large report fields like full resume and detailed question arrays.

#### `GET /api/interview/report/:interviewId`

Protected endpoint that returns the full report for a specific report ID owned by the current user.

#### `POST /api/interview/resume/pdf/:interviewReportId`

Protected endpoint that generates and returns a downloadable PDF resume for an existing report.

Response:

- PDF binary stream

## Data Models

### User

Stored in the `users` collection.

Fields:

- `username`
- `email`
- `password`

### InterviewReport

Stored in the `InterviewReport` collection.

Fields:

- `jobDescription`
- `resume`
- `selfDescription`
- `matchScore`
- `technicalQuestions`
- `behavioralQuestions`
- `skillGaps`
- `preparationPlan`
- `user`
- `title`
- timestamps

### Blacklisted Token

Stored in the `blacklistTokens` collection.

Fields:

- `token`
- timestamps

## Authentication Flow

This project uses cookie-based authentication instead of storing JWTs in local storage.

How it works:

1. User logs in or registers.
2. Backend signs a JWT.
3. JWT is stored in an `httpOnly` cookie named `token`.
4. Frontend sends requests with `withCredentials: true`.
5. Backend validates the cookie on protected routes.
6. Logout adds the token to the blacklist collection and clears the cookie.

## Security Notes

This project already includes some useful baseline protections:

- `httpOnly` auth cookies
- `sameSite: strict` cookies
- conditional `secure` cookie flag in production
- CORS allowlist via `ALLOWED_ORIGINS`
- JWT verification middleware
- blacklisted token check on protected routes
- rate limiting on login and registration
- upload size limit for resume files
- request validation for auth and report generation

## UI Summary

### Home Dashboard

- Recent interview plans sidebar
- Logout button in the sidebar
- Structured two-panel interview generation form
- Uploaded resume success state
- Inline form validation errors

### Interview Detail Page

- Left navigation for sections
- Dynamic score summary
- Technical questions accordion
- Behavioral questions accordion
- Preparation roadmap view
- Skill gap summary
- Resume download button

### Error Handling

- Custom route-level 404 page
- Inline generation validation on the dashboard
- Backend validation for missing job descriptions or missing profile data

## Current Limitations

These are worth knowing before extending or deploying the app:

- Backend port is currently hardcoded to `3000` in `Backend/server.js`
- Resume upload currently supports PDF only
- DOCX parsing is not implemented
- No automated tests are set up yet
- No root-level monorepo scripts to start frontend and backend together
- Some frontend lint issues still exist in auth/interview hooks and context files
- The backend uses `GET /logout` instead of `POST /logout`
- Ownership is checked for fetching report details, but you should review all private endpoints carefully before production hardening



## Troubleshooting

### MongoDB does not connect

Check:

- `MONGO_URI` in `Backend/.env`
- network access to your MongoDB instance
- whether your database user has correct permissions

### Authentication requests fail from frontend

Check:

- `VITE_API_URL`
- `ALLOWED_ORIGINS`
- frontend is sending credentials
- backend is running on port `3000`

### Resume upload fails

Check:

- file is a PDF
- file size is under 3 MB
- job description is filled
- either resume or self-description is provided

### AI generation fails

Check:

- `GOOGLE_GENAI_API_KEY`
- API quota / billing / permissions
- outbound internet access from the backend runtime

### Resume PDF generation fails

Check:

- Puppeteer can launch in your environment
- the backend machine allows Chromium execution

## Development Notes

- The frontend uses `react-router`, not `react-router-dom`
- The backend uses `multer.memoryStorage()`, so uploaded files are kept in memory during processing
- Google GenAI responses are constrained with Zod-derived JSON schema for more predictable output
- Resume PDF output is generated from AI-produced HTML using Puppeteer

## License

This project currently uses the default `ISC` license declared in the package files.
