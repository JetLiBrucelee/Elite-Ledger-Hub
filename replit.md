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

- **users** — id, firstName, lastName, email, passwordHash, phone, country, role (user/admin), status (pending/approved/rejected/blocked/suspended), balance (numeric 20,2 default 0), plan (varchar 50), trialStartedAt (timestamp, set on admin approval), presenceStatus, lastSeen, createdAt, updatedAt
- **sessions** — id, userId, token, expiresAt, createdAt
- **investment_plans** — id, name, tier (bronze/silver/gold/platinum/diamond), minInvestment, returnPercentage, durationMonths, description, features (json), schedule (json)
- **user_investments** — id, userId, planId, planName, planTier, investedAmount, currentValue, returnPercentage, status, startDate, endDate
- **transactions** — id, userId, type (deposit/withdrawal/profit/fee), amount, description, status, createdAt
- **withdrawal_requests** — id, userId, amount (numeric 20,2), method, walletAddress, bankDetails, status (pending/approved/rejected), adminNote, createdAt, updatedAt
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
- `GET /api/admin/users` — List all users (optional ?status= filter)
- `POST /api/admin/users` — Create a new user (with balance/plan)
- `PATCH /api/admin/users/:id` — Edit user details (name, email, role, status, balance, plan)
- `POST /api/admin/users/:id/approve` — Approve user
- `POST /api/admin/users/:id/reject` — Reject user
- `POST /api/admin/users/:id/block` — Block user (revokes sessions)
- `POST /api/admin/users/:id/unblock` — Unblock user (restores to approved)
- `POST /api/admin/users/:id/suspend` — Suspend user (sets status to pending)
- `POST /api/admin/users/:id/credit` — Credit user balance (body: `{amount: number}`)
- `POST /api/admin/users/:id/debit` — Debit user balance (body: `{amount: number}`, fails if insufficient)
- `GET /api/admin/applications` — List all job applications
- `PATCH /api/admin/applications/:id/status` — Update application status (reviewed/rejected)
- `GET /api/admin/chat/sessions` — List chat sessions
- `GET /api/admin/chat/sessions/:sessionId/messages` — Get session messages
- `POST /api/admin/chat/reply` — Reply to chat
- `GET /api/admin/stats` — Dashboard statistics
- `GET /api/admin/withdrawals` — List all withdrawal requests (with user info)
- `POST /api/admin/withdrawals/:id/approve` — Approve withdrawal (atomic: deducts balance + creates transaction in DB transaction)
- `POST /api/admin/withdrawals/:id/reject` — Reject withdrawal request

### Job Applications (public)
- `POST /api/applications` — Submit a job application (from Careers page)

### User Dashboard (requires auth)
- `GET /api/user/dashboard` — Dashboard overview (accountBalance = user.balance, investments, transactions)
- `GET /api/user/investments` — User's investments
- `GET /api/user/transactions` — User's transactions
- `PATCH /api/user/profile` — Update user's own name (firstName, lastName)
- `POST /api/user/withdrawal-request` — Submit a withdrawal request (amount, method, walletAddress, bankDetails)
- `GET /api/user/withdrawal-requests` — List user's withdrawal requests

## Frontend Pages

- `/` — Homepage with hero, stats, core services, empowering finance, benefits grid, careers, strategic partnership, copy trading, testimonials, CTA
- `/plans` — Investment plans with 5 tabbed tiers (Bronze/Silver/Gold/Platinum/Diamond)
- `/about` — About page with mission, stats, values
- `/careers` — Careers page with benefits, open positions, send CV CTA
- `/promotion` — Promotions overview page with giveaways, contests, referral program, deposit bonus
- `/giveaways` — Give Aways page with campaigns, eligibility rules, how it works
- `/trading-contests` — Trading Contests page with active contests, leaderboard, prize breakdown
- `/referral-program` — Referral Program page with tiered bonuses, how it works, referral link
- `/copytrading` — Join CopyTrading page explaining how copy trading works, top masters, benefits
- `/masters-rating` — Master's Rating page with ranked master trader table (ROI, win rate, drawdown, risk)
- `/markets/forex` — Forex market page with stats, features, instruments
- `/markets/commodities` — Commodities market page (Gold, Oil, Agriculture)
- `/markets/indices` — Indices market page (S&P 500, DAX, Nikkei)
- `/markets/stocks` — Stocks market page (500+ equities)
- `/markets/futures` — Futures market page (derivatives trading)
- `/markets/cryptocurrencies` — Crypto market page (BTC, ETH, 30+ pairs)
- `/contact` — Contact form + info
- `/login` — Sign in form
- `/register` — Registration form (admin approval required, supports `?plan=` URL param for pre-selection)
- `/dashboard` — User portfolio overview (protected)
- `/dashboard/investments` — User investments list (protected)
- `/dashboard/transactions` — Transaction history (protected)
- `/admin` — Admin system overview (admin only)
- `/admin/users` — User management with approve/reject/block/unblock/suspend/create/edit/view detail (admin only)
- `/admin/applications` — Job applications management with review/reject (admin only)
- `/admin/withdrawals` — Withdrawal requests management with approve/reject (admin only)
- `/admin/chat` — Live chat inbox (admin only)

## Key Accounts

- **Admin**: admin@eliteledgercapital.com / Adminelite2026

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
- Custom cursor (DOM-based dot + ring) on non-touch devices — uses rAF + event delegation, no framer-motion
- StockPro-style dropdown navbar (Company, Copytrading, TopMarkets, Account groups + Home, Promotion direct links + blue Login button)
- 5-column footer (logo+tagline+social, Company, Top Markets, CopyTrading, Promotion)
- Glass morphism panels
- Gold gradient text and buttons
- Framer Motion animations
- Floating live chat widget (bottom-right)
- ActivityPopup: slide-in notifications (bottom-left) showing fake crypto transactions on Home/Register pages
- Trial system: 3-day trial starts on admin approval; login/heartbeat auto-suspend expired trials
- Withdrawals processed manually via support email (eliteledgercapital@gmail.com)
- Plans page: logged-in users see "Go to Dashboard" instead of "Select Plan"

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` with `composite: true`. Typecheck from root: `pnpm run typecheck`.

## Development

- Frontend: `pnpm --filter @workspace/elite-ledger run dev` (reads PORT env var)
- Backend: `pnpm --filter @workspace/api-server run dev` (port 8080)
- Codegen: `pnpm --filter @workspace/api-spec run codegen`
- DB push: `pnpm --filter @workspace/db run push`
