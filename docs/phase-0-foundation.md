# Phase 0: Foundation

**Duration:** Weeks 1-4 (1 month)  
**Goal:** Setup infrastructure, tooling, and team workflows  
**Team:** 4-5 engineers  

---

## Objectives

By end of Phase 0, the team should have:
- ✅ Development environment anyone can clone and run
- ✅ Core tech stack configured and tested
- ✅ CI/CD pipeline for automated deployments
- ✅ Database schema for MVP features
- ✅ Team workflows and communication established

---

## Week 1: Project Setup

### Task 1.1: Repository & Infrastructure
**Owner:** Tech Lead  
**Effort:** 1 day

**Actions:**
- [ ] Create GitHub organization: `skilltree-platform`
- [ ] Setup monorepo structure:
  ```
  skilltree/
  ├── apps/
  │   ├── web/          # Next.js frontend
  │   └── api/          # Node.js backend
  ├── packages/
  │   ├── database/     # Prisma schema & migrations
  │   ├── ui/           # Shared UI components
  │   └── types/        # TypeScript types
  ├── docs/             # Documentation
  └── scripts/          # Utility scripts
  ```
- [ ] Configure Turbo/Nx for monorepo management
- [ ] Setup `.env.example` files with required variables
- [ ] Create `CONTRIBUTING.md` with setup instructions

---

### Task 1.2: Frontend Scaffold
**Owner:** Frontend Lead  
**Effort:** 2 days

**Tech Stack:**
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (lightweight)
- **Forms:** React Hook Form + Zod validation
- **HTTP:** tRPC or React Query

**Actions:**
- [ ] Initialize Next.js 14 app with TypeScript
- [ ] Configure Tailwind CSS with custom theme:
  ```js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        colors: {
          primary: {...},   // From design system
          secondary: {...},
          accent: {...}
        }
      }
    }
  }
  ```
- [ ] Install shadcn/ui CLI and add base components:
  - Button, Input, Card, Badge, Tabs
- [ ] Setup layout components:
  - `app/layout.tsx` (root layout)
  - `app/(auth)/layout.tsx` (auth pages)
  - `app/(dashboard)/layout.tsx` (main app)
- [ ] Configure fonts (Inter or system fonts)
- [ ] Test responsive design on mobile/tablet/desktop

**Acceptance Criteria:**
- [ ] `npm run dev` starts app on localhost:3000
- [ ] Basic page navigation works
- [ ] Tailwind classes render correctly

---

### Task 1.3: Backend Scaffold
**Owner:** Backend Lead  
**Effort:** 2 days

**Tech Stack:**
- **Runtime:** Node.js 20+ (TypeScript)
- **Framework:** Express or Fastify
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Auth:** Clerk SDK (or Auth0)

**Actions:**
- [ ] Initialize Node.js project with TypeScript
- [ ] Setup Express/Fastify server:
  ```typescript
  // src/index.ts
  import express from 'express';
  const app = express();
  
  app.use(express.json());
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  
  app.listen(4000, () => console.log('API running on :4000'));
  ```
- [ ] Configure environment variables:
  ```
  DATABASE_URL=postgresql://...
  CLERK_SECRET_KEY=...
  NODE_ENV=development
  ```
- [ ] Setup error handling middleware
- [ ] Configure CORS for frontend origin
- [ ] Add request logging (Morgan or Pino)

**Acceptance Criteria:**
- [ ] `npm run dev` starts API on localhost:4000
- [ ] `/health` endpoint returns 200 OK
- [ ] Environment variables load correctly

---

### Task 1.4: Database Setup
**Owner:** Backend Engineer  
**Effort:** 2 days

**Actions:**
- [ ] Install PostgreSQL locally (or use Docker):
  ```yaml
  # docker-compose.yml
  version: '3.8'
  services:
    postgres:
      image: postgres:15
      ports:
        - "5432:5432"
      environment:
        POSTGRES_DB: skilltree_dev
        POSTGRES_USER: skilltree
        POSTGRES_PASSWORD: devpassword
      volumes:
        - pgdata:/var/lib/postgresql/data
  ```
- [ ] Initialize Prisma:
  ```bash
  npx prisma init
  ```
- [ ] Create initial schema (MVP entities only):
  ```prisma
  // schema.prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  
  generator client {
    provider = "prisma-client-js"
  }
  
  model User {
    id        String   @id @default(uuid())
    email     String   @unique
    name      String?
    createdAt DateTime @default(now())
    
    assessments Assessment[]
    userSkills  UserSkill[]
  }
  
  model Assessment {
    id          String   @id @default(uuid())
    userId      String
    type        String   // 'riasec' | 'big5'
    responses   Json
    results     Json
    completedAt DateTime @default(now())
    
    user User @relation(fields: [userId], references: [id])
  }
  
  model Skill {
    id          String  @id @default(uuid())
    name        String  @unique
    category    String
    description String?
    anchors     Json
    
    userSkills UserSkill[]
  }
  
  model UserSkill {
    id         String   @id @default(uuid())
    userId     String
    skillId    String
    rating     Int      // 1-10
    confidence String   // 'low' | 'medium' | 'high'
    evidence   String?
    updatedAt  DateTime @updatedAt
    createdAt  DateTime @default(now())
    
    user  User  @relation(fields: [userId], references: [id])
    skill Skill @relation(fields: [skillId], references: [id])
    
    @@unique([userId, skillId])
  }
  ```
- [ ] Run first migration:
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Generate Prisma Client
- [ ] Test database connection from backend

**Acceptance Criteria:**
- [ ] Prisma schema compiles without errors
- [ ] Migrations apply successfully
- [ ] Can read/write to database from API

---

## Week 2: Authentication & Tooling

### Task 2.1: Authentication Integration
**Owner:** Full-Stack Engineer  
**Effort:** 3 days

**Provider:** Clerk (recommended for speed)

**Actions:**
- [ ] Create Clerk account and application
- [ ] Install Clerk SDK in frontend:
  ```bash
  npm install @clerk/nextjs
  ```
- [ ] Configure Clerk provider in `app/layout.tsx`:
  ```tsx
  import { ClerkProvider } from '@clerk/nextjs';
  
  export default function RootLayout({ children }) {
    return (
      <ClerkProvider>
        <html>
          <body>{children}</body>
        </html>
      </ClerkProvider>
    );
  }
  ```
- [ ] Create auth pages:
  - `/sign-up` - Registration
  - `/sign-in` - Login
  - `/sign-out` - Logout
- [ ] Protect routes with middleware:
  ```typescript
  // middleware.ts
  import { authMiddleware } from "@clerk/nextjs";
  
  export default authMiddleware({
    publicRoutes: ["/", "/sign-in", "/sign-up"]
  });
  ```
- [ ] Setup webhook to sync users to database:
  ```typescript
  // api/webhooks/clerk.ts
  app.post('/webhooks/clerk', async (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'user.created') {
      await prisma.user.create({
        data: {
          id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + ' ' + data.last_name
        }
      });
    }
    
    res.json({ received: true });
  });
  ```

**Acceptance Criteria:**
- [ ] Users can sign up with email
- [ ] Users can log in
- [ ] Protected routes redirect to sign-in
- [ ] User data syncs to PostgreSQL

---

### Task 2.2: CI/CD Pipeline
**Owner:** DevOps/Backend Lead  
**Effort:** 2 days

**Platform:** GitHub Actions + Vercel (frontend) + Railway/Render (backend)

**Actions:**
- [ ] Create GitHub Actions workflow:
  ```yaml
  # .github/workflows/ci.yml
  name: CI
  
  on: [push, pull_request]
  
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: 20
        - run: npm ci
        - run: npm run lint
        - run: npm run test
        - run: npm run build
  ```
- [ ] Setup Vercel project for frontend:
  - Connect GitHub repo
  - Configure environment variables
  - Enable automatic deployments
- [ ] Setup backend hosting (Railway):
  - Deploy API service
  - Provision PostgreSQL database
  - Configure secrets
- [ ] Add deployment status checks to PRs

**Acceptance Criteria:**
- [ ] Every commit triggers CI checks
- [ ] Merging to `main` deploys to production
- [ ] Failed tests block merges

---

### Task 2.3: Testing Setup
**Owner:** Frontend + Backend Engineers  
**Effort:** 2 days

**Actions:**
- [ ] Install testing libraries:
  ```bash
  # Frontend
  npm install -D vitest @testing-library/react @testing-library/jest-dom
  
  # Backend
  npm install -D vitest supertest
  ```
- [ ] Configure Vitest:
  ```typescript
  // vitest.config.ts
  import { defineConfig } from 'vitest/config';
  
  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
    },
  });
  ```
- [ ] Write sample tests:
  ```typescript
  // apps/web/__tests__/Button.test.tsx
  import { render, screen } from '@testing-library/react';
  import { Button } from '@/components/ui/button';
  
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  ```
  
  ```typescript
  // apps/api/__tests__/health.test.ts
  import request from 'supertest';
  import app from '../src/app';
  
  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
  ```
- [ ] Add test scripts to `package.json`:
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:coverage": "vitest --coverage"
    }
  }
  ```

**Acceptance Criteria:**
- [ ] `npm test` runs all tests
- [ ] Tests pass in CI
- [ ] Coverage report generated

---

## Week 3: Data Seeding & API Foundation

### Task 3.1: Seed O*NET Data
**Owner:** Backend Engineer  
**Effort:** 3 days

**Data Source:** O*NET Online Database (https://www.onetcenter.org/database.html)

**Actions:**
- [ ] Download O*NET database files:
  - Occupation Data
  - Skills Data
  - Knowledge Data
  - Abilities Data
- [ ] Create seed script:
  ```typescript
  // prisma/seed.ts
  import { PrismaClient } from '@prisma/client';
  import fs from 'fs';
  import csv from 'csv-parser';
  
  const prisma = new PrismaClient();
  
  async function seedSkills() {
    const skills = [];
    
    fs.createReadStream('data/skills.csv')
      .pipe(csv())
      .on('data', (row) => {
        skills.push({
          name: row['Element Name'],
          category: row['Category'],
          description: row['Description'],
          anchors: {} // Add later
        });
      })
      .on('end', async () => {
        await prisma.skill.createMany({ data: skills });
        console.log(`Seeded ${skills.length} skills`);
      });
  }
  
  seedSkills();
  ```
- [ ] Filter to initial 50 core skills:
  - Reading Comprehension
  - Writing
  - Speaking
  - Active Listening
  - Critical Thinking
  - Programming
  - Data Analysis
  - Project Management
  - ... (see Appendix B in PRD)
- [ ] Add qualitative anchors manually (JSON):
  ```json
  {
    "2": "Beginner description",
    "4": "Intermediate description",
    "6": "Proficient description",
    "8": "Advanced description",
    "10": "Expert description"
  }
  ```
- [ ] Run seed script:
  ```bash
  npx prisma db seed
  ```

**Acceptance Criteria:**
- [ ] 50 skills exist in database
- [ ] Each skill has 5 anchors
- [ ] Skills categorized correctly

---

### Task 3.2: Core API Endpoints (MVP)
**Owner:** Backend Engineer  
**Effort:** 3 days

**Actions:**
- [ ] Create CRUD endpoints for skills:
  ```typescript
  // GET /api/skills?category=Content&search=writing
  app.get('/api/skills', async (req, res) => {
    const { category, search } = req.query;
    
    const skills = await prisma.skill.findMany({
      where: {
        category: category as string,
        name: { contains: search as string, mode: 'insensitive' }
      }
    });
    
    res.json({ skills });
  });
  ```
- [ ] Create user skills endpoints:
  ```typescript
  // POST /api/user-skills
  app.post('/api/user-skills', requireAuth, async (req, res) => {
    const { skillId, rating, confidence, evidence } = req.body;
    const userId = req.auth.userId;
    
    const userSkill = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: { rating, confidence, evidence, updatedAt: new Date() },
      create: { userId, skillId, rating, confidence, evidence }
    });
    
    res.json({ userSkill });
  });
  
  // GET /api/user-skills
  app.get('/api/user-skills', requireAuth, async (req, res) => {
    const userId = req.auth.userId;
    
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true }
    });
    
    res.json({ userSkills });
  });
  ```
- [ ] Create assessment endpoints:
  ```typescript
  // POST /api/assessments/riasec
  app.post('/api/assessments/riasec', requireAuth, async (req, res) => {
    const { responses } = req.body;
    const userId = req.auth.userId;
    
    // Calculate RIASEC scores (see scoring algorithm)
    const results = calculateRIASEC(responses);
    
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        type: 'riasec',
        responses,
        results
      }
    });
    
    res.json({ assessment });
  });
  ```

**Acceptance Criteria:**
- [ ] All endpoints return correct status codes
- [ ] Authentication required for protected routes
- [ ] Input validation with Zod
- [ ] Error handling returns clear messages

---

### Task 3.3: API Documentation
**Owner:** Backend Engineer  
**Effort:** 1 day

**Actions:**
- [ ] Setup OpenAPI/Swagger:
  ```bash
  npm install swagger-jsdoc swagger-ui-express
  ```
- [ ] Document all endpoints:
  ```typescript
  /**
   * @swagger
   * /api/skills:
   *   get:
   *     summary: Get list of skills
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Success
   */
  ```
- [ ] Generate API docs at `/api-docs`

**Acceptance Criteria:**
- [ ] Swagger UI accessible at `/api-docs`
- [ ] All endpoints documented with examples

---

## Week 4: Integration & Testing

### Task 4.1: Frontend-Backend Integration
**Owner:** Full-Stack Engineer  
**Effort:** 3 days

**Actions:**
- [ ] Setup API client in frontend:
  ```typescript
  // lib/api.ts
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  export async function getSkills(params?: { category?: string, search?: string }) {
    const query = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/api/skills?${query}`, {
      headers: {
        'Authorization': `Bearer ${await getToken()}`
      }
    });
    return response.json();
  }
  ```
- [ ] Create React Query hooks:
  ```typescript
  // hooks/useSkills.ts
  import { useQuery } from '@tanstack/react-query';
  import { getSkills } from '@/lib/api';
  
  export function useSkills(category?: string) {
    return useQuery({
      queryKey: ['skills', category],
      queryFn: () => getSkills({ category })
    });
  }
  ```
- [ ] Test all API calls from frontend
- [ ] Handle loading/error states
- [ ] Add retry logic for failed requests

**Acceptance Criteria:**
- [ ] Frontend successfully fetches from backend
- [ ] Authentication tokens passed correctly
- [ ] Error messages display in UI

---

### Task 4.2: End-to-End Testing
**Owner:** QA/Full-Stack Engineer  
**Effort:** 2 days

**Tool:** Playwright

**Actions:**
- [ ] Install Playwright:
  ```bash
  npm install -D @playwright/test
  ```
- [ ] Write E2E test for core flow:
  ```typescript
  // e2e/onboarding.spec.ts
  import { test, expect } from '@playwright/test';
  
  test('user can sign up and complete profile', async ({ page }) => {
    // Go to sign up
    await page.goto('/sign-up');
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
  ```
- [ ] Run tests in CI

**Acceptance Criteria:**
- [ ] E2E tests pass locally
- [ ] E2E tests pass in CI

---

### Task 4.3: Developer Documentation
**Owner:** Tech Lead  
**Effort:** 2 days

**Actions:**
- [ ] Create `docs/` folder with:
  - `SETUP.md` - How to run locally
  - `ARCHITECTURE.md` - System overview
  - `API.md` - API reference (link to Swagger)
  - `DATABASE.md` - Schema documentation
  - `DEPLOYMENT.md` - How to deploy
- [ ] Add inline code comments for complex logic
- [ ] Record Loom video: "Setting up SkillTree locally" (15 min)

**Acceptance Criteria:**
- [ ] New engineer can setup project in <1 hour using docs
- [ ] All docs reviewed by at least 1 other engineer

---

## Phase 0 Deliverables Checklist

### Infrastructure
- [ ] Monorepo structure with frontend + backend
- [ ] PostgreSQL database with Prisma ORM
- [ ] Clerk authentication integrated
- [ ] CI/CD pipeline (GitHub Actions + Vercel/Railway)

### Codebase
- [ ] Next.js 14 frontend with Tailwind + shadcn/ui
- [ ] Node.js/Express backend with TypeScript
- [ ] Core API endpoints (skills, user-skills, assessments)
- [ ] Initial database seeded with 50 skills

### Testing
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] >80% test coverage goal

### Documentation
- [ ] Setup guide
- [ ] Architecture docs
- [ ] API documentation (Swagger)
- [ ] Onboarding video

---

## Success Metrics

**By end of Week 4:**
- [ ] All 4-5 engineers can run project locally
- [ ] CI passes on all commits
- [ ] Can create user, add skill, fetch skills via API
- [ ] <5 open blockers for Phase 1 work

---

## Risks & Mitigations

**Risk:** Setup takes longer than 4 weeks
- **Mitigation:** Cut scope - defer E2E tests and docs to Phase 1 if needed
- **Escalation:** Tech lead assesses blockers daily

**Risk:** Team unfamiliar with tech stack
- **Mitigation:** Pair programming sessions, share resources
- **Contingency:** Bring in contractor for 1 week to accelerate

---

## Next Phase

After Phase 0 completion, proceed to **Phase 1: MVP Core** (`phase-1-mvp-core.md`).

---

**Questions?** Contact: tech-lead@skilltree.io