# Elite Ledger Capital

## Overview

Full-stack professional investment/copy trading platform built as a pnpm workspace monorepo using TypeScript. Features a premium dark-themed public website with gold accents, admin-approval user registration, user/admin dashboards, and real-time SSE-based chat.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4 + Framer Motion + Recharts + Wouter
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Auth**: Cookie-based sessions (httpOnly `session_token` cookie, bcryptjs)
- **Real-time**: Server-Sent Events (SSE) for live chat

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080)
│   ├── elite-ledger/       # React + Vite frontend (proxies /api to api-server)
│   └── mockup-sandbox/     # Component preview server
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- **users** — id, firstName, lastName, email, passwordHash, phone, country, role (user/admin), status (pending/approved/rejected), createdAt
- **sessions** — id, userId, token, expiresAt, createdAt
- **investment_plans** — id, name, tier (bronze/silver/gold/platinum/diamond), minInvestment, returnPercentage, durationMonths, description, features (json), schedule (json)
- **user_investments** — id, userId, planId, planName, planTier, investedAmount, currentValue, returnPercentage, status, startDate, endDate
- **transactions** — id, userId, type (deposit/withdrawal/profit/fee), amount, description, status, createdAt
- **chat_sessions** — id, sessionId, visitorName, status, lastMessage, unreadCount, createdAt, updatedAt
- **chat_messages** — id, sessionId, message, senderName, senderType (visitor/user/admin), createdAt

## API Routes (all under /api prefix)

### Auth
- `POST /api/auth/register` — Register new user (pending approval)
- `POST /api/auth/login` — Login (returns user + sets session cookie)
- `GET /api/auth/me` — Get current user (requires auth)
- `POST /api/auth/logout` — Logout

### Plans
- `GET /api/plans` — List all investment plans
- `GET /api/plans/:id` — Get single plan

### Chat (SSE)
- `GET /api/chat/messages?sessionId=X` — Get messages for session
- `POST /api/chat/messages` — Send a message
- `GET /api/chat/events?sessionId=X` — SSE stream for real-time messages

### Admin (requires admin role)
- `GET /api/admin/users` — List all users
- `POST /api/admin/users/:id/approve` — Approve user
- `POST /api/admin/users/:id/reject` — Reject user
- `GET /api/admin/chat/sessions` — List chat sessions
- `GET /api/admin/chat/sessions/:sessionId/messages` — Get session messages
- `POST /api/admin/chat/reply` — Reply to chat
- `GET /api/admin/stats` — Dashboard statistics

### User Dashboard (requires auth)
- `GET /api/user/dashboard` — Dashboard overview (balance, investments, transactions)
- `GET /api/user/investments` — User's investments
- `GET /api/user/transactions` — User's transactions

## Frontend Pages

- `/` — Homepage with hero, stats, features, CTA
- `/plans` — Investment plans with 5 tabbed tiers (Bronze/Silver/Gold/Platinum/Diamond)
- `/about` — About page with mission, stats, values
- `/contact` — Contact form + info
- `/login` — Sign in form
- `/register` — Registration form (admin approval required)
- `/dashboard` — User portfolio overview (protected)
- `/dashboard/investments` — User investments list (protected)
- `/dashboard/transactions` — Transaction history (protected)
- `/admin` — Admin system overview (admin only)
- `/admin/users` — User management with approve/reject (admin only)
- `/admin/chat` — Live chat inbox (admin only)

## Key Accounts

- **Admin**: admin@eliteledger.com / admin123

## Investment Tiers

| Tier | Min Investment | ROI/Month | Final Payout (3mo) |
|------|---------------|-----------|-------------------|
| Bronze | $40,000 | 102% | $330,000 |
| Silver | $75,000 | 182% | $1,680,000 |
| Gold | $150,000 | 220.08% | $4,930,000 |
| Platinum | $300,000 | 250.41% | $12,900,000 |
| Diamond | $500,000 | 300% | $32,000,000 |

## Design

- Dark theme with gold/amber primary color (HSL 43, 96%, 56%)
- Custom cursor (dot + ring) on non-touch devices
- Glass morphism panels
- Gold gradient text and buttons
- Framer Motion animations
- Floating live chat widget (bottom-right)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` with `composite: true`. Typecheck from root: `pnpm run typecheck`.

## Development

- Frontend: `pnpm --filter @workspace/elite-ledger run dev` (reads PORT env var)
- Backend: `pnpm --filter @workspace/api-server run dev` (port 8080)
- Codegen: `pnpm --filter @workspace/api-spec run codegen`
- DB push: `pnpm --filter @workspace/db run push`
