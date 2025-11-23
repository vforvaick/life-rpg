# Phase 0: Foundation Setup

**REQUIRED SUB-SKILL:** Use superpowers:executing-plans

**Goal:** Setup production-ready development environment with Next.js, Supabase, and Prisma.

**Architecture:** Monorepo with Next.js 14 frontend using App Router, Supabase for authentication and database, Prisma for type-safe database access, deployed on Vercel with CI/CD.

**Key Technologies:** Next.js 14, Supabase, Prisma, TypeScript, Tailwind CSS, shadcn/ui

---

## Task 1: Initialize Next.js Project (5 minutes)

**Files:**
- `package.json` (create)
- `tsconfig.json` (create)
- `next.config.js` (create)

**Steps:**

1. Create Next.js project with TypeScript
```bash
npx create-next-app@latest life-rpg --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd life-rpg
```

2. Install core dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @prisma/client
npm install -D prisma
```

3. Verify installation
```bash
npm run dev
```

**Expected Output:**
```
> life-rpg@0.1.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Ready in 1.2s
```

**Verification:**
- [ ] Navigate to http://localhost:3000
- [ ] See default Next.js welcome page
- [ ] No errors in terminal

**Commit:**
```bash
git add .
git commit -m "chore: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

## Task 2: Setup Supabase Project (3 minutes)

**Files:**
- `.env.local` (create)
- `lib/supabase.ts` (create)

**Steps:**

1. Create `.env.local` file
```bash
touch .env.local
```

2. Add Supabase credentials
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

3. Create Supabase client utility
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Verification:**
- [ ] File `.env.local` exists
- [ ] File `lib/supabase.ts` exists
- [ ] No TypeScript errors

**Commit:**
```bash
git add lib/supabase.ts
git commit -m "feat: add Supabase client configuration"
```

---

## Task 3: Initialize Prisma (4 minutes)

**Files:**
- `prisma/schema.prisma` (create)
- `.env` (create)

**Steps:**

1. Initialize Prisma
```bash
npx prisma init
```

2. Update `prisma/schema.prisma`
```prisma
// prisma/schema.prisma
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

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Skill {
  id          String  @id @default(uuid())
  name        String  @unique
  category    String
  description String?
  anchors     Json
  onetId      String?

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

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill Skill @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@unique([userId, skillId])
}

model Occupation {
  id             String   @id @default(uuid())
  onetSocCode    String   @unique
  title          String
  description    String?
  riasecCode     String?
  requiredSkills Json
  salaryRange    Json?
  outlook        String?
  educationLevel String?
  updatedAt      DateTime @updatedAt
}
```

3. Run first migration
```bash
npx prisma migrate dev --name init
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

✔ Generated Prisma Client
```

**Verification:**
- [ ] Migration file created in `prisma/migrations/`
- [ ] Prisma Client generated
- [ ] No errors

**Commit:**
```bash
git add prisma/
git commit -m "feat: initialize Prisma schema with core models"
```

---

## Task 4: Install shadcn/ui Components (3 minutes)

**Files:**
- `components.json` (create)
- `components/ui/button.tsx` (create)
- `components/ui/card.tsx` (create)

**Steps:**

1. Initialize shadcn/ui
```bash
npx shadcn-ui@latest init
```

2. Select options:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: Yes
- Components location: components
- Utils location: lib/utils

3. Install base components
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
```

**Verification:**
- [ ] Files created in `components/ui/`
- [ ] `components.json` exists
- [ ] Can import components without errors

**Commit:**
```bash
git add components/ components.json tailwind.config.ts
git commit -m "feat: setup shadcn/ui with base components"
```

---

## Task 5: Create Landing Page (5 minutes)

**Files:**
- `app/page.tsx` (modify)
- `app/globals.css` (modify)

**Steps:**

1. Update `app/page.tsx`
```typescript
// app/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-slate-900">
            SkillTree 🌳
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Discover Your Skills. Find Your Career Path.
          </p>
          <Button size="lg" asChild>
            <Link href="/assessment">Get Started Free</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Discover Skills</CardTitle>
              <CardDescription>
                Identify your capabilities through guided assessment and behavioral anchors
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🗺️ Find Careers</CardTitle>
              <CardDescription>
                Match with 70+ careers based on your personality and skills
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📈 Track Growth</CardTitle>
              <CardDescription>
                See what skills to learn next for your dream career
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Build in Public */}
        <div className="text-center mt-16 text-slate-600">
          <p>Built in public. Follow the journey on Twitter.</p>
        </div>
      </div>
    </main>
  )
}
```

2. Test in browser
```bash
npm run dev
```

**Verification:**
- [ ] Landing page displays correctly
- [ ] Button works (links to /assessment)
- [ ] Responsive on mobile

**Commit:**
```bash
git add app/
git commit -m "feat: create landing page with hero and features"
```

---

## Task 6: Setup Authentication (5 minutes)

**Files:**
- `app/api/auth/callback/route.ts` (create)
- `middleware.ts` (create)
- `app/(auth)/login/page.tsx` (create)

**Steps:**

1. Create auth callback route
```typescript
// app/api/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
```

2. Create login page
```typescript
// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for the login link!')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In to SkillTree</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

3. Create middleware for protected routes
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/assessment/:path*'],
}
```

**Verification:**
- [ ] Can access /login page
- [ ] Email input works
- [ ] Magic link sent (check email)

**Commit:**
```bash
git add app/ middleware.ts
git commit -m "feat: implement Supabase magic link authentication"
```

---

## Task 7: Setup CI/CD (3 minutes)

**Files:**
- `.github/workflows/ci.yml` (create)
- `vercel.json` (create)

**Steps:**

1. Create GitHub Actions workflow
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

2. Create Vercel configuration
```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

3. Connect to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel

# Follow prompts to connect GitHub repo
```

**Verification:**
- [ ] Push to GitHub triggers CI
- [ ] Vercel deployment succeeds
- [ ] Production URL accessible

**Commit:**
```bash
git add .github/ vercel.json
git commit -m "ci: setup GitHub Actions and Vercel deployment"
```

---

## Task 8: Seed Initial Data (5 minutes)

**Files:**
- `prisma/seed.ts` (create)
- `package.json` (modify)

**Steps:**

1. Create seed script
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed 5 sample skills
  const skills = [
    {
      name: 'Programming',
      category: 'Technical',
      description: 'Ability to write and understand code',
      anchors: {
        '2': 'Write simple scripts, understand basic syntax',
        '4': 'Build small applications, debug errors',
        '6': 'Develop full features, review others code',
        '8': 'Architect systems, mentor junior developers',
        '10': 'Industry expert, create frameworks/languages'
      }
    },
    {
      name: 'Writing',
      category: 'Content',
      description: 'Communicating effectively in writing',
      anchors: {
        '2': 'Write emails and short messages with basic grammar',
        '4': 'Write reports and proposals with clear structure',
        '6': 'Write long-form content (articles, whitepapers), persuasive',
        '8': 'Professional writer, published work, edit others writing',
        '10': 'Bestselling author or award-winning journalist'
      }
    },
    {
      name: 'Leadership',
      category: 'Social',
      description: 'Leading and motivating teams',
      anchors: {
        '2': 'Occasionally lead small group tasks',
        '4': 'Lead team meetings, delegate tasks',
        '6': 'Manage direct reports, set team goals',
        '8': 'Lead department, hire/fire, strategic decisions',
        '10': 'C-level executive, company-wide leadership'
      }
    },
    {
      name: 'Data Analysis',
      category: 'Technical',
      description: 'Analyzing data to derive insights',
      anchors: {
        '2': 'Read charts and basic statistics',
        '4': 'Use Excel for data analysis, create charts',
        '6': 'SQL queries, statistical analysis, data visualization',
        '8': 'Build data pipelines, advanced modeling',
        '10': 'Data science expert, ML models, research'
      }
    },
    {
      name: 'Public Speaking',
      category: 'Social',
      description: 'Speaking confidently to audiences',
      anchors: {
        '2': 'Nervous speaking to small groups (<10), prefer written',
        '4': 'Present to familiar audiences (team meetings), require prep',
        '6': 'Comfortable with 50+ people, handle Q&A, monthly presentations',
        '8': 'Regular presentations to 100+, adapt to diverse crowds',
        '10': 'National/international speaker, paid keynotes, train speakers'
      }
    }
  ]

  for (const skill of skills) {
    await prisma.skill.create({ data: skill })
  }

  // Seed 3 sample occupations
  const occupations = [
    {
      onetSocCode: '15-1252.00',
      title: 'Software Developers, Applications',
      description: 'Develop, create, and modify general computer applications software',
      riasecCode: 'IRC',
      requiredSkills: [
        { skillId: 'programming', importance: 95, level: 8 },
        { skillId: 'data-analysis', importance: 60, level: 6 }
      ],
      salaryRange: { min: 70000, max: 150000, median: 110140 }
    },
    {
      onetSocCode: '27-3031.00',
      title: 'Public Relations Specialists',
      description: 'Promote or create goodwill for individuals or organizations',
      riasecCode: 'AES',
      requiredSkills: [
        { skillId: 'writing', importance: 90, level: 7 },
        { skillId: 'public-speaking', importance: 80, level: 7 }
      ],
      salaryRange: { min: 40000, max: 100000, median: 62810 }
    },
    {
      onetSocCode: '11-2021.00',
      title: 'Marketing Managers',
      description: 'Plan, direct, or coordinate marketing policies and programs',
      riasecCode: 'ECA',
      requiredSkills: [
        { skillId: 'leadership', importance: 85, level: 7 },
        { skillId: 'data-analysis', importance: 70, level: 6 },
        { skillId: 'writing', importance: 65, level: 6 }
      ],
      salaryRange: { min: 80000, max: 200000, median: 142170 }
    }
  ]

  for (const occ of occupations) {
    await prisma.occupation.create({ data: occ })
  }

  console.log('✓ Seeded 5 skills and 3 occupations')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

2. Add seed command to package.json
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

3. Install ts-node
```bash
npm install -D ts-node
```

4. Run seed
```bash
npx prisma db seed
```

**Expected Output:**
```
Seeding database...
✓ Seeded 5 skills and 3 occupations
```

**Verification:**
- [ ] Run `npx prisma studio`
- [ ] See 5 skills in database
- [ ] See 3 occupations in database

**Commit:**
```bash
git add prisma/seed.ts package.json
git commit -m "feat: add database seed script with sample data"
```

---

## Phase 0 Complete! 🎉

**Total Time:** ~35 minutes
**Files Created:** 15+
**Lines of Code:** ~500

**Deliverables:**
- ✅ Next.js 14 project with TypeScript
- ✅ Supabase authentication (magic link)
- ✅ Prisma schema with 5 models
- ✅ shadcn/ui component library
- ✅ Landing page
- ✅ CI/CD pipeline (GitHub Actions + Vercel)
- ✅ Database seeded with sample data

**Next Steps:**
Execute Phase 1A: RIASEC Assessment (see `2025-11-21-phase-1a-riasec-assessment.md`)

**Update Progress:**
```bash
# Mark Phase 0 complete in progress.md
```
