# LearnCraft

LearnCraft is a production-ready educational platform built with a modern React frontend and a secure Express backend. It supports multilingual content (English, Hindi, Odia), Firebase Analytics, a functional contact system with email + Firestore persistence, and a clean architecture ready for growth.

## Features
- Modern Vite + React frontend
- Secure Express backend with rate limiting, CORS restrictions, and centralized errors
- Firebase Analytics initialization with safe env-based configuration
- Contact form with validation, email delivery, and Firestore storage
- Toast notifications and accessible UI patterns
- Vitest + React Testing Library and Jest + Supertest coverage
- Vercel + Render deployment ready

## Tech Stack
**Frontend**
- Vite
- React 18
- React Router
- Tailwind + Bootstrap
- Firebase Analytics

**Backend**
- Express
- Zod validation
- Nodemailer
- Firestore (firebase-admin)
- Helmet + Morgan + Rate Limiting

## Project Structure
```
LearnCraft/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── common/
│   │   ├── context/
│   │   ├── locales/
│   │   ├── services/
│   │   ├── utils/
│   │   └── __tests__/
│   ├── .env
│   ├── .env.example
│   ├── .env.production.example
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── __tests__/
│   ├── .env
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
├── render.yaml
├── package.json
└── README.md
```

## Installation
```bash
# Root (tooling)
npm install

# Frontend
npm --prefix frontend install

# Backend
npm --prefix backend install
```

## Environment Variables
### Frontend (`frontend/.env`)
```env
VITE_BASE_PATH=/
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=8000
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

## Local Development
### Frontend
```bash
npm --prefix frontend run dev
```

### Backend
```bash
npm --prefix backend run dev
```

## Build
### Frontend
```bash
npm --prefix frontend run build
```

### Backend
```bash
npm --prefix backend run start
```

## Testing
### Frontend
```bash
npm --prefix frontend run test
```

### Backend
```bash
npm --prefix backend run test
```

## API Documentation
### POST `/contact`
**Description:** Submit a contact form message.

**Request Body**
```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "phone": "1234567890",
  "message": "Hello LearnCraft team."
}
```

**Responses**
- `200 OK`
```json
{ "success": true, "message": "Message sent successfully." }
```
- `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      { "field": "email", "message": "Invalid email" }
    ]
  }
}
```

## Deployment
### Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output: `dist`
- Environment Variables: copy from `frontend/.env.production.example`
- SPA routing handled by `frontend/vercel.json`

### Backend (Render)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Set all env vars from `backend/.env.example`

## Troubleshooting
- **npm.ps1 blocked on Windows:**
  - `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force`
- **Firestore private key errors:**
  - Ensure newlines are escaped as `\n` in env vars.
- **CORS errors in production:**
  - Add all frontend domains to `CORS_ORIGIN` as comma-separated values.

## Contribution Guide
1. Create a feature branch
2. Run lint and tests
3. Submit a PR with a clear description

## License
MIT
