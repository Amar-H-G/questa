# SurCodex

SurCodex is a modern technical assessment platform for quiz assessments, coding challenges, analytics, recruiter insights, performance tracking, leaderboards, and role-based access control.

## Architecture Decisions

- The previous implementation was replaced rather than patched because business logic lived directly in controllers, auth used only long-lived access tokens, security middleware was missing, and the frontend was page-oriented instead of feature-oriented.
- Backend modules now follow `validation -> route -> controller -> service -> repository -> model` boundaries. This keeps HTTP details out of business rules and makes future modules easier to test.
- Auth uses short-lived access tokens plus persisted refresh tokens so sessions can be revoked. RBAC is centralized in middleware and supports `admin`, `teacher`, `student`, and `recruiter`.
- Mongoose schemas include indexes for common access paths: ownership, status, ranking, user history, analytics dimensions, and submission lookup.
- The coding module stores submissions separately from execution. The Judge0 provider can be attached behind the service layer without changing routes or controllers.
- The frontend uses a feature-based React/Vite structure with React Query for server state, Zustand for auth state, Axios for API access, GSAP for reveal animation, Tailwind CSS for styling, and Lucide icons for controls.

## Folder Structure

```text
backend/
  server.js
  src/
    app.js
    config/
    constants/
    database/
    middlewares/
    models/
    modules/
      admin/
      analytics/
      auth/
      coding/
      leaderboard/
      quiz/
    routes/
    utils/

frontend/
  src/
    app/
      layouts/
      routes/
    components/
      forms/
      ui/
    hooks/
    modules/
      analytics/
      auth/
      coding/
      dashboard/
      leaderboard/
      profile/
      quiz/
    services/
    store/
    styles/
```

## Environment Variables

Copy the examples and fill in local values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend variables:

- `MONGO_URI`: MongoDB Atlas connection string.
- `JWT_ACCESS_SECRET`: long random secret for access tokens.
- `JWT_REFRESH_SECRET`: long random secret for refresh tokens.
- `CORS_ORIGIN`: frontend origin allowed by the API.
- `RATE_LIMIT_*`: global API rate limit controls.

Frontend variables:

- `VITE_API_URL`: API base URL, usually `http://localhost:5000/api/v1`.

## Development

Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Run the API:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Quality checks:

```bash
cd backend && npm run lint
cd ../frontend && npm run lint
cd frontend && npm run build
```

## API Surface

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/password-reset`
- `POST /api/v1/auth/verify-email`
- `GET /api/v1/quizzes`
- `POST /api/v1/quizzes`
- `PATCH /api/v1/quizzes/:id`
- `POST /api/v1/quizzes/:id/publish`
- `POST /api/v1/quizzes/:id/attempts`
- `GET /api/v1/coding/problems`
- `POST /api/v1/coding/problems`
- `POST /api/v1/coding/problems/:id/submissions`
- `GET /api/v1/analytics/overview`
- `GET /api/v1/leaderboard`
- `GET /api/v1/admin/users`

## Deployment Guide

Backend:

1. Create a MongoDB Atlas cluster and database user.
2. Set production env vars in the hosting platform.
3. Use `npm ci --omit=dev` for production install.
4. Start with `npm start`.
5. Put the API behind HTTPS and configure `CORS_ORIGIN` to the deployed frontend origin.

Frontend:

1. Set `VITE_API_URL` to the deployed API URL.
2. Run `npm run build`.
3. Deploy `frontend/dist` to a static host or CDN.
4. Configure SPA fallback to `index.html`.

## Security Notes

- Secrets are not committed; `.env.example` contains placeholders only.
- Helmet, CORS, rate limiting, HPP protection, Mongo sanitization, payload limits, and JWT validation are configured globally.
- Refresh tokens are stored hashed and can be revoked.
- Sensitive answer correctness is excluded from normal question reads.
