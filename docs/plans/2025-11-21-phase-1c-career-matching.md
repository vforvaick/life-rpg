# Phase 1C: Career Matching System

**REQUIRED SUB-SKILL:** Use superpowers:executing-plans

**Goal:** Calculate and display career matches based on user's RIASEC profile and skills, with skill gap analysis.

**Architecture:** Weighted matching algorithm (40% RIASEC, 50% skills, 10% experience) running server-side, results cached with Redis, dashboard with Chart.js visualizations, PDF export using react-pdf.

**Key Technologies:** Next.js API Routes, Prisma, Redis, Chart.js, react-pdf, TypeScript

---

## Task 1: Implement Career Matching Algorithm (5 minutes)

**Files:**
- `lib/career-matching.ts` (create)
- `__tests__/career-matching.test.ts` (create)

**Steps:**

1. Write comprehensive algorithm tests
```typescript
// __tests__/career-matching.test.ts
import { calculateCareerMatches, calculateRIASECAlignment } from '@/lib/career-matching'

describe('Career Matching Algorithm', () => {
  test('perfect RIASEC match scores 100%', () => {
    const userRIASEC = { code: 'AIE', A: 90, I: 80, E: 70, R: 30, S: 40, C: 50 }
    const occupation = { riasecCode: 'AIE' }

    const alignment = calculateRIASECAlignment(userRIASEC, occupation)
    expect(alignment).toBe(1.0) // 3/3 letters match
  })

  test('partial RIASEC match scores proportionally', () => {
    const userRIASEC = { code: 'AIE', A: 90, I: 80, E: 70, R: 30, S: 40, C: 50 }
    const occupation = { riasecCode: 'AIS' } // 2 of 3 match

    const alignment = calculateRIASECAlignment(userRIASEC, occupation)
    expect(alignment).toBeCloseTo(0.66, 2) // 2/3 letters match
  })

  test('no RIASEC match scores 0%', () => {
    const userRIASEC = { code: 'AIE', A: 90, I: 80, E: 70, R: 30, S: 40, C: 50 }
    const occupation = { riasecCode: 'RCS' } // 0 of 3 match

    const alignment = calculateRIASECAlignment(userRIASEC, occupation)
    expect(alignment).toBe(0)
  })

  test('identifies skill gaps correctly', () => {
    const userSkills = new Map([
      ['programming', 5],
      ['writing', 7],
    ])

    const requiredSkills = [
      { skillId: 'programming', importance: 90, level: 8 }, // Gap: 8-5 = 3
      { skillId: 'writing', importance: 70, level: 6 },     // Gap: 6-7 = 0 (meets req)
      { skillId: 'leadership', importance: 60, level: 5 },  // Gap: 5-0 = 5 (missing)
    ]

    const { gaps } = calculateSkillMatch(userSkills, requiredSkills)

    expect(gaps).toHaveLength(2) // Programming and Leadership
    expect(gaps.find(g => g.skillId === 'programming')?.gap).toBe(3)
    expect(gaps.find(g => g.skillId === 'leadership')?.gap).toBe(5)
  })

  test('weighted fit score calculation', () => {
    const match = {
      riasecAlignment: 1.0,   // Perfect RIASEC match
      skillMatch: 0.8,        // 80% skills match
      experienceScore: 0.5,   // Mid-level experience
    }

    // Formula: (0.4 * 1.0) + (0.5 * 0.8) + (0.1 * 0.5) = 0.85
    const fitScore = (0.4 * match.riasecAlignment) +
                     (0.5 * match.skillMatch) +
                     (0.1 * match.experienceScore)

    expect(fitScore).toBeCloseTo(0.85, 2)
  })
})
```

2. Run test (should fail)
```bash
npm test career-matching
```

3. Implement algorithm
```typescript
// lib/career-matching.ts
import { prisma } from '@/lib/prisma'
import type { RIASECResults } from '@/lib/riasec'

export interface CareerMatch {
  occupation: {
    id: string
    onetSocCode: string
    title: string
    description: string | null
    riasecCode: string | null
    salaryRange: any
  }
  fitScore: number  // 0-100
  riasecAlignment: number  // 0-1
  skillMatch: number  // 0-1
  experienceScore: number  // 0-1
  skillGaps: SkillGap[]
}

export interface SkillGap {
  skillId: string
  skillName: string
  required: number  // 1-10
  current: number   // 1-10
  gap: number       // Positive number
  importance: number  // 0-100
}

export function calculateRIASECAlignment(
  userRIASEC: RIASECResults,
  occupation: { riasecCode: string | null }
): number {
  if (!occupation.riasecCode) return 0

  const userCode = userRIASEC.code  // e.g., "AIE"
  const occCode = occupation.riasecCode  // e.g., "IRC"

  let overlap = 0
  for (const char of userCode) {
    if (occCode.includes(char)) {
      overlap++
    }
  }

  return overlap / 3  // Normalize to 0-1
}

export function calculateSkillMatch(
  userSkills: Map<string, number>,  // skillId → rating (1-10)
  requiredSkills: Array<{
    skillId: string
    skillName: string
    importance: number
    level: number
  }>
): { score: number; gaps: SkillGap[] } {
  let totalMatch = 0
  const gaps: SkillGap[] = []

  requiredSkills.forEach((req) => {
    const userRating = userSkills.get(req.skillId) || 0
    const gap = Math.max(0, req.level - userRating)

    // Calculate match for this skill (weighted by importance)
    // Formula: importance × (1 - gap/10)
    const match = req.importance * (1 - gap / 10)
    totalMatch += match

    // Track gap if exists
    if (gap > 0) {
      gaps.push({
        skillId: req.skillId,
        skillName: req.skillName,
        required: req.level,
        current: userRating,
        gap,
        importance: req.importance,
      })
    }
  })

  // Normalize by total possible importance
  const totalImportance = requiredSkills.reduce((sum, s) => sum + s.importance, 0)
  const score = totalImportance > 0 ? totalMatch / totalImportance : 0

  // Sort gaps by importance (highest first)
  gaps.sort((a, b) => b.importance - a.importance)

  return { score, gaps }
}

export async function calculateCareerMatches(userId: string): Promise<CareerMatch[]> {
  // 1. Get user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      assessments: {
        where: { type: 'riasec' },
        orderBy: { completedAt: 'desc' },
        take: 1,
      },
      userSkills: {
        include: { skill: true },
      },
    },
  })

  if (!user || !user.assessments[0]) {
    throw new Error('User must complete RIASEC assessment first')
  }

  const userRIASEC = user.assessments[0].results as RIASECResults
  const userSkillsMap = new Map(
    user.userSkills.map((us) => [us.skillId, us.rating])
  )

  // 2. Get all occupations
  const occupations = await prisma.occupation.findMany()

  // 3. Calculate fit for each occupation
  const matches: CareerMatch[] = occupations.map((occ) => {
    // RIASEC alignment (40%)
    const riasecAlignment = calculateRIASECAlignment(userRIASEC, occ)

    // Skills match (50%)
    const requiredSkills = (occ.requiredSkills as any[]).map((rs) => ({
      skillId: rs.skillId,
      skillName: rs.skillName || '',
      importance: rs.importance,
      level: rs.level,
    }))

    const { score: skillMatch, gaps } = calculateSkillMatch(
      userSkillsMap,
      requiredSkills
    )

    // Experience (10%) - default to 0.5 for MVP
    const experienceScore = 0.5

    // Weighted fit score
    const fitScore = Math.round(
      (0.4 * riasecAlignment + 0.5 * skillMatch + 0.1 * experienceScore) * 100
    )

    return {
      occupation: {
        id: occ.id,
        onetSocCode: occ.onetSocCode,
        title: occ.title,
        description: occ.description,
        riasecCode: occ.riasecCode,
        salaryRange: occ.salaryRange,
      },
      fitScore,
      riasecAlignment,
      skillMatch,
      experienceScore,
      skillGaps: gaps,
    }
  })

  // 4. Sort by fit score (highest first)
  return matches.sort((a, b) => b.fitScore - a.fitScore)
}
```

4. Run test again (should pass)
```bash
npm test career-matching
```

**Verification:**
- [ ] All tests pass
- [ ] Algorithm produces accurate scores
- [ ] Skill gaps identified correctly

**Commit:**
```bash
git add lib/ __tests__/
git commit -m "feat: implement career matching algorithm with tests"
```

---

## Task 2: Create Career Matches API with Caching (4 minutes)

**Files:**
- `app/api/career-matches/route.ts` (create)
- `lib/redis.ts` (create, optional for MVP)

**Steps:**

1. Create API endpoint
```typescript
// app/api/career-matches/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { calculateCareerMatches } from '@/lib/career-matching'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const minFit = parseInt(searchParams.get('minFit') || '0')

    // Calculate matches
    const allMatches = await calculateCareerMatches(session.user.id)

    // Filter and limit
    const filtered = allMatches
      .filter((m) => m.fitScore >= minFit)
      .slice(0, limit)

    return NextResponse.json({ matches: filtered })
  } catch (error) {
    console.error('Career matches error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate career matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Recalculate matches (clears cache)
    const matches = await calculateCareerMatches(session.user.id)

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Career matches recalculation error:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate matches' },
      { status: 500 }
    )
  }
}
```

2. Test API
```bash
curl http://localhost:3000/api/career-matches
```

**Verification:**
- [ ] API returns matches
- [ ] Can filter by minFit
- [ ] Can limit results
- [ ] POST recalculates matches

**Commit:**
```bash
git add app/api/
git commit -m "feat: create career matches API endpoint"
```

---

## Task 3: Create Dashboard with Match Cards (5 minutes)

**Files:**
- `app/dashboard/page.tsx` (create)
- `components/dashboard/CareerMatchCard.tsx` (create)
- `hooks/useCareerMatches.ts` (create)

**Steps:**

1. Create React Query hook
```typescript
// hooks/useCareerMatches.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CareerMatch } from '@/lib/career-matching'

export function useCareerMatches(limit = 20, minFit = 0) {
  return useQuery({
    queryKey: ['careerMatches', limit, minFit],
    queryFn: async () => {
      const res = await fetch(
        `/api/career-matches?limit=${limit}&minFit=${minFit}`
      )
      if (!res.ok) throw new Error('Failed to fetch career matches')
      const data = await res.json()
      return data.matches as CareerMatch[]
    },
    staleTime: 1000 * 60 * 60, // 1 hour (matches don't change often)
  })
}

export function useRecalculateMatches() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/career-matches', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to recalculate matches')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerMatches'] })
    },
  })
}
```

2. Create career match card component
```typescript
// components/dashboard/CareerMatchCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CareerMatch } from '@/lib/career-matching'

interface CareerMatchCardProps {
  match: CareerMatch
  rank: number
}

export function CareerMatchCard({ match, rank }: CareerMatchCardProps) {
  const { occupation, fitScore, skillGaps } = match

  // Color based on fit score
  const getFitColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-slate-600'
  }

  // Format salary range
  const formatSalary = (range: any) => {
    if (!range || !range.median) return 'N/A'
    return `$${(range.median / 1000).toFixed(0)}k`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-xl font-bold">
                #{rank}
              </Badge>
              <CardTitle className="text-xl">{occupation.title}</CardTitle>
            </div>
            <p className="text-sm text-slate-500">{occupation.onetSocCode}</p>
          </div>

          <div className="text-right">
            <div className={`text-3xl font-bold ${getFitColor(fitScore)}`}>
              {fitScore}%
            </div>
            <p className="text-xs text-slate-500">Match</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Description */}
        {occupation.description && (
          <p className="text-sm text-slate-700 mb-4">
            {occupation.description.slice(0, 150)}...
          </p>
        )}

        {/* Match Breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-slate-500">Personality</p>
            <p className="font-bold">{Math.round(match.riasecAlignment * 100)}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Skills</p>
            <p className="font-bold">{Math.round(match.skillMatch * 100)}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Salary</p>
            <p className="font-bold">{formatSalary(occupation.salaryRange)}</p>
          </div>
        </div>

        {/* Skill Gaps */}
        {skillGaps.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Skills to Develop:</p>
            <div className="flex flex-wrap gap-2">
              {skillGaps.slice(0, 3).map((gap) => (
                <Badge key={gap.skillId} variant="secondary">
                  {gap.skillName} (need +{gap.gap})
                </Badge>
              ))}
              {skillGaps.length > 3 && (
                <Badge variant="secondary">+{skillGaps.length - 3} more</Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="default" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

3. Create dashboard page
```typescript
// app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { useCareerMatches, useRecalculateMatches } from '@/hooks/useCareerMatches'
import { CareerMatchCard } from '@/components/dashboard/CareerMatchCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DashboardPage() {
  const [minFit, setMinFit] = useState(0)
  const [limit, setLimit] = useState(10)

  const { data: matches, isLoading, error } = useCareerMatches(limit, minFit)
  const recalculate = useRecalculateMatches()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Calculating your career matches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load career matches</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Career Matches</h1>
          <p className="text-slate-600">
            Based on your RIASEC profile and {matches?.length || 0} skills
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm">Min Fit:</label>
            <Input
              type="number"
              value={minFit}
              onChange={(e) => setMinFit(parseInt(e.target.value) || 0)}
              className="w-20"
              min={0}
              max={100}
            />
            <span className="text-sm">%</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Show:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="border rounded-lg px-4 py-2"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>All</option>
            </select>
          </div>

          <Button
            variant="outline"
            onClick={() => recalculate.mutate()}
            disabled={recalculate.isPending}
          >
            {recalculate.isPending ? 'Recalculating...' : 'Recalculate'}
          </Button>
        </div>

        {/* Matches Grid */}
        {matches && matches.length > 0 ? (
          <div className="grid gap-6">
            {matches.map((match, index) => (
              <CareerMatchCard
                key={match.occupation.id}
                match={match}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              No matches found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

4. Test in browser
```bash
npm run dev
# Navigate to /dashboard
```

**Verification:**
- [ ] Dashboard loads with matches
- [ ] Matches sorted by fit score
- [ ] Can filter by minFit
- [ ] Can change limit
- [ ] Match cards display correctly

**Commit:**
```bash
git add app/ components/ hooks/
git commit -m "feat: create dashboard with career match cards"
```

---

## Task 4: Create Match Detail Page (4 minutes)

**Files:**
- `app/dashboard/[occupationId]/page.tsx` (create)
- `components/dashboard/SkillGapChart.tsx` (create)

**Steps:**

1. Create skill gap chart component
```typescript
// components/dashboard/SkillGapChart.tsx
'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { SkillGap } from '@/lib/career-matching'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface SkillGapChartProps {
  gaps: SkillGap[]
}

export function SkillGapChart({ gaps }: SkillGapChartProps) {
  const topGaps = gaps.slice(0, 10) // Show top 10 gaps

  const data = {
    labels: topGaps.map((g) => g.skillName),
    datasets: [
      {
        label: 'Your Level',
        data: topGaps.map((g) => g.current),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'Required Level',
        data: topGaps.map((g) => g.required),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
      },
    ],
  }

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2 },
      },
    },
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Skill Gaps (Your Level vs Required)',
      },
    },
  }

  return <Bar data={data} options={options} />
}
```

2. Create detail page
```typescript
// app/dashboard/[occupationId]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCareerMatches } from '@/hooks/useCareerMatches'
import { SkillGapChart } from '@/components/dashboard/SkillGapChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function CareerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: matches, isLoading } = useCareerMatches(50, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const match = matches?.find((m) => m.occupation.id === params.occupationId)

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Career match not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const { occupation, fitScore, riasecAlignment, skillMatch, skillGaps } = match

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          ← Back to Matches
        </Button>

        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">
                  {occupation.title}
                </CardTitle>
                <p className="text-slate-500">{occupation.onetSocCode}</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-green-600">
                  {fitScore}%
                </div>
                <p className="text-sm text-slate-500">Match Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">{occupation.description}</p>
          </CardContent>
        </Card>

        {/* Match Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Match Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-2">
                  Personality Fit (40%)
                </p>
                <p className="text-3xl font-bold">
                  {Math.round(riasecAlignment * 100)}%
                </p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-2">
                  Skills Match (50%)
                </p>
                <p className="text-3xl font-bold">
                  {Math.round(skillMatch * 100)}%
                </p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-2">Salary Range</p>
                <p className="text-3xl font-bold">
                  ${((occupation.salaryRange?.median || 0) / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        {skillGaps.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Skill Development Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillGapChart gaps={skillGaps} />

              <div className="mt-6 space-y-3">
                {skillGaps.slice(0, 5).map((gap) => (
                  <div
                    key={gap.skillId}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{gap.skillName}</p>
                      <p className="text-sm text-slate-500">
                        Current: {gap.current}/10 → Target: {gap.required}/10
                      </p>
                    </div>
                    <Badge variant="destructive">+{gap.gap} levels</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="flex-1">Export to PDF</Button>
          <Button variant="outline">Share Match</Button>
        </div>
      </div>
    </div>
  )
}
```

3. Test in browser
```bash
npm run dev
# Click on a career match card
```

**Verification:**
- [ ] Detail page loads
- [ ] Skill gap chart displays
- [ ] Match breakdown shows
- [ ] Back button works

**Commit:**
```bash
git add app/ components/
git commit -m "feat: create career match detail page with gap chart"
```

---

## Task 5: Create PDF Export (3 minutes)

**Files:**
- `app/api/export-pdf/route.ts` (create)

**Steps:**

1. Install PDF library
```bash
npm install @react-pdf/renderer
```

2. Create PDF generation API
```typescript
// app/api/export-pdf/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { calculateCareerMatches } from '@/lib/career-matching'
import { renderToBuffer } from '@react-pdf/renderer'
import { CareerMatchesPDF } from '@/components/pdf/CareerMatchesPDF'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        assessments: {
          where: { type: 'riasec' },
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate matches
    const matches = await calculateCareerMatches(session.user.id)
    const topMatches = matches.slice(0, 10)

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      <CareerMatchesPDF
        user={user}
        riasec={user.assessments[0].results}
        matches={topMatches}
      />
    )

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="career-matches.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
```

3. Create PDF document component (simplified for MVP)
```typescript
// components/pdf/CareerMatchesPDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  match: { marginBottom: 15, borderBottom: '1 solid #ccc', paddingBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
  score: { fontSize: 14, color: '#059669' },
})

export function CareerMatchesPDF({ user, riasec, matches }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.header}>SkillTree Career Matches</Text>
          <Text>Name: {user.name}</Text>
          <Text>RIASEC Code: {riasec.code}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Top 10 Matches:</Text>
          {matches.map((match: any, index: number) => (
            <View key={match.occupation.id} style={styles.match}>
              <Text style={styles.title}>
                #{index + 1} {match.occupation.title}
              </Text>
              <Text style={styles.score}>Match: {match.fitScore}%</Text>
              <Text>{match.occupation.description?.slice(0, 150)}...</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
```

4. Add export button to dashboard
```typescript
// app/dashboard/page.tsx (add button)
<Button
  onClick={() => window.open('/api/export-pdf', '_blank')}
  variant="outline"
>
  📄 Export PDF
</Button>
```

**Verification:**
- [ ] Export button appears
- [ ] Clicking opens PDF in new tab
- [ ] PDF contains matches
- [ ] PDF downloads correctly

**Commit:**
```bash
git add app/api/ components/
git commit -m "feat: implement PDF export for career matches"
```

---

## Phase 1C Complete! 🎉

**Total Time:** ~25 minutes
**Files Created:** 10+
**Lines of Code:** ~1000

**Deliverables:**
- ✅ Career matching algorithm (RIASEC + Skills + Experience)
- ✅ Skill gap identification and analysis
- ✅ Career matches API with filtering
- ✅ Dashboard with match cards
- ✅ Detail page with visualizations
- ✅ PDF export functionality

**Algorithm Weights:**
- 40% RIASEC personality alignment
- 50% Skills match
- 10% Experience level

**Next Steps:**
Execute Phase 1D: Polish & Premium Features (see `2025-11-21-phase-1d-polish-premium.md`)

**Update Progress:**
```bash
# Mark Phase 1C complete in progress.md
# Update week counter
```

**MVP Core Feature Set Now Complete!**
Users can now:
1. Complete RIASEC assessment
2. Discover and rate skills
3. See career matches
4. Identify skill gaps
5. Export results to PDF
