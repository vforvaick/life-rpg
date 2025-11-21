# Phase 1B: Skills Inventory System

**REQUIRED SUB-SKILL:** Use superpowers:executing-plans

**Goal:** Enable users to discover, rate, and manage their skills using behavioral anchors for accurate self-assessment.

**Architecture:** Skills taxonomy with qualitative anchors stored in PostgreSQL, discovery wizard using inference rules, inventory UI with filter/search using Prisma queries, real-time updates via React Query.

**Key Technologies:** React Query, Prisma, PostgreSQL, TypeScript, Behavioral Anchoring methodology

---

## Task 1: Create Skills Discovery Inference Rules (4 minutes)

**Files:**
- `data/discovery-rules.ts` (create)
- `__tests__/discovery-rules.test.ts` (create)

**Steps:**

1. Write test for inference rules
```typescript
// __tests__/discovery-rules.test.ts
import { inferSkills, discoveryQuestions } from '@/data/discovery-rules'

describe('Skills Discovery', () => {
  test('has 10 discovery questions', () => {
    expect(discoveryQuestions).toHaveLength(10)
  })

  test('infers skills from answers', () => {
    const answers = {
      hasLedTeam: true,
      hasWrittenContent: true,
      hasSolvedTechProblems: false,
    }

    const inferred = inferSkills(answers)

    expect(inferred).toContain('leadership')
    expect(inferred).toContain('writing')
    expect(inferred).not.toContain('programming')
  })

  test('returns empty array if no matches', () => {
    const answers = {
      hasLedTeam: false,
      hasWrittenContent: false,
      hasSolvedTechProblems: false,
    }

    const inferred = inferSkills(answers)

    expect(inferred).toHaveLength(0)
  })
})
```

2. Run test (should fail)
```bash
npm test discovery-rules
```

3. Create inference rules
```typescript
// data/discovery-rules.ts
export interface DiscoveryQuestion {
  id: string
  question: string
  yesImplies: string[]  // Skill names
}

export const discoveryQuestions: DiscoveryQuestion[] = [
  {
    id: 'hasLedTeam',
    question: 'Have you led a team of people?',
    yesImplies: ['Leadership', 'Communication', 'Decision Making'],
  },
  {
    id: 'hasWrittenContent',
    question: 'Have you written 1000+ words (articles, reports, proposals)?',
    yesImplies: ['Writing', 'Communication', 'Critical Thinking'],
  },
  {
    id: 'hasSolvedTechProblems',
    question: 'Have you solved technical problems (debugging, troubleshooting)?',
    yesImplies: ['Programming', 'Problem Solving', 'Critical Thinking'],
  },
  {
    id: 'hasGivenPresentation',
    question: 'Have you given presentations to 10+ people?',
    yesImplies: ['Public Speaking', 'Communication', 'Confidence'],
  },
  {
    id: 'hasAnalyzedData',
    question: 'Have you analyzed data or created reports with insights?',
    yesImplies: ['Data Analysis', 'Critical Thinking', 'Attention to Detail'],
  },
  {
    id: 'hasDesignedVisuals',
    question: 'Have you designed graphics, websites, or visual content?',
    yesImplies: ['Graphic Design', 'Creativity', 'Visual Communication'],
  },
  {
    id: 'hasManagedProject',
    question: 'Have you managed a project from start to finish?',
    yesImplies: ['Project Management', 'Organization', 'Time Management'],
  },
  {
    id: 'hasNegotiated',
    question: 'Have you negotiated agreements or resolved conflicts?',
    yesImplies: ['Negotiation', 'Conflict Resolution', 'Persuasion'],
  },
  {
    id: 'hasTaughtOthers',
    question: 'Have you taught or trained others on a skill or topic?',
    yesImplies: ['Teaching', 'Communication', 'Patience'],
  },
  {
    id: 'hasSoldProduct',
    question: 'Have you sold a product, service, or idea?',
    yesImplies: ['Sales', 'Persuasion', 'Communication'],
  },
]

export function inferSkills(answers: Record<string, boolean>): string[] {
  const suggested = new Set<string>()

  discoveryQuestions.forEach((q) => {
    if (answers[q.id] === true) {
      q.yesImplies.forEach(skill => suggested.add(skill))
    }
  })

  return Array.from(suggested)
}
```

4. Run test again (should pass)
```bash
npm test discovery-rules
```

**Verification:**
- [ ] All tests pass
- [ ] Inference logic works correctly
- [ ] No duplicate skills returned

**Commit:**
```bash
git add data/ __tests__/
git commit -m "feat: add skills discovery inference rules with tests"
```

---

## Task 2: Create Discovery Wizard Component (5 minutes)

**Files:**
- `components/skills/DiscoveryWizard.tsx` (create)
- `app/skills/discover/page.tsx` (create)

**Steps:**

1. Create wizard component
```typescript
// components/skills/DiscoveryWizard.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { discoveryQuestions, inferSkills } from '@/data/discovery-rules'

interface DiscoveryWizardProps {
  onComplete: (suggestedSkills: string[]) => void
}

export function DiscoveryWizard({ onComplete }: DiscoveryWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const question = discoveryQuestions[currentStep]
  const isLastQuestion = currentStep === discoveryQuestions.length - 1

  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [question.id]: answer }
    setAnswers(newAnswers)

    if (isLastQuestion) {
      const suggested = inferSkills(newAnswers)
      onComplete(suggested)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Question {currentStep + 1} of {discoveryQuestions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6">{question.question}</p>

        <div className="flex gap-4">
          <Button
            size="lg"
            variant="default"
            onClick={() => handleAnswer(true)}
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleAnswer(false)}
            className="flex-1"
          >
            No
          </Button>
        </div>

        {currentStep > 0 && (
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-4"
          >
            ← Back
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

2. Create discovery page
```typescript
// app/skills/discover/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DiscoveryWizard } from '@/components/skills/DiscoveryWizard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DiscoverSkillsPage() {
  const router = useRouter()
  const [suggestedSkills, setSuggestedSkills] = useState<string[] | null>(null)

  if (suggestedSkills) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-8">
            Suggested Skills
          </h1>

          <Card>
            <CardHeader>
              <CardTitle>
                We found {suggestedSkills.length} skills for you!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 mb-6">
                {suggestedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="p-4 border rounded-lg bg-white"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => router.push('/skills')}
                className="w-full"
              >
                Rate These Skills →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Discover Your Skills
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Answer a few quick questions to find your skills
        </p>

        <DiscoveryWizard onComplete={setSuggestedSkills} />
      </div>
    </div>
  )
}
```

3. Test in browser
```bash
npm run dev
# Navigate to http://localhost:3000/skills/discover
```

**Verification:**
- [ ] Discovery wizard works
- [ ] Can answer all 10 questions
- [ ] Skills suggested at end
- [ ] Back button works

**Commit:**
```bash
git add components/ app/
git commit -m "feat: create skills discovery wizard with inference"
```

---

## Task 3: Create Skill Rating Modal with Anchors (5 minutes)

**Files:**
- `components/skills/SkillRatingModal.tsx` (create)
- `components/ui/dialog.tsx` (add via shadcn/ui)

**Steps:**

1. Install dialog component
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add radio-group
```

2. Create rating modal component
```typescript
// components/skills/SkillRatingModal.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface Skill {
  id: string
  name: string
  category: string
  description: string
  anchors: {
    '2': string
    '4': string
    '6': string
    '8': string
    '10': string
  }
}

interface UserSkill {
  rating: number
  confidence: 'low' | 'medium' | 'high'
  evidence: string
}

interface SkillRatingModalProps {
  skill: Skill
  currentRating?: UserSkill
  isOpen: boolean
  onClose: () => void
  onSave: (rating: UserSkill) => Promise<void>
}

export function SkillRatingModal({
  skill,
  currentRating,
  isOpen,
  onClose,
  onSave,
}: SkillRatingModalProps) {
  const [rating, setRating] = useState(currentRating?.rating || 5)
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>(
    currentRating?.confidence || 'medium'
  )
  const [evidence, setEvidence] = useState(currentRating?.evidence || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({ rating, confidence, evidence })
      onClose()
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save skill rating')
    } finally {
      setSaving(false)
    }
  }

  // Get relevant anchor for current rating
  const getRelevantAnchor = () => {
    if (rating <= 2) return skill.anchors['2']
    if (rating <= 4) return skill.anchors['4']
    if (rating <= 6) return skill.anchors['6']
    if (rating <= 8) return skill.anchors['8']
    return skill.anchors['10']
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{skill.name}</DialogTitle>
          <p className="text-sm text-slate-600">{skill.description}</p>
          <span className="text-xs text-slate-500">{skill.category}</span>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <Label>Your Rating</Label>
              <span className="text-lg font-bold text-primary">
                {rating}/10
              </span>
            </div>
            <Slider
              value={[rating]}
              onValueChange={([v]) => setRating(v)}
              min={1}
              max={10}
              step={1}
              className="mb-4"
            />

            {/* Behavioral Anchor */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <p className="text-sm font-medium mb-2">
                Level {rating} Description:
              </p>
              <p className="text-sm text-slate-700">
                {getRelevantAnchor()}
              </p>
            </div>
          </div>

          {/* All Anchors Reference */}
          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-sm">
              View all level descriptions
            </summary>
            <div className="mt-4 space-y-2 text-sm">
              {Object.entries(skill.anchors).map(([level, description]) => (
                <div key={level} className="flex gap-2">
                  <span className="font-bold w-12">L{level}:</span>
                  <span className="text-slate-700">{description}</span>
                </div>
              ))}
            </div>
          </details>

          {/* Confidence Level */}
          <div>
            <Label className="mb-3 block">Confidence in this rating</Label>
            <RadioGroup value={confidence} onValueChange={(v) => setConfidence(v as any)}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Evidence */}
          <div>
            <Label htmlFor="evidence" className="mb-2 block">
              Evidence / Examples (optional)
            </Label>
            <Textarea
              id="evidence"
              placeholder="E.g., Led content team at Company X, published 50+ articles..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-slate-500 mt-1">
              Specific examples help you remember your rating later
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Rating'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

3. Test component manually
```bash
npm run dev
# Create test page to preview modal
```

**Verification:**
- [ ] Modal opens and closes
- [ ] Slider updates rating
- [ ] Anchor description changes with rating
- [ ] Can expand all anchors
- [ ] Save button works

**Commit:**
```bash
git add components/
git commit -m "feat: create skill rating modal with behavioral anchors"
```

---

## Task 4: Create API Endpoints for Skills (4 minutes)

**Files:**
- `app/api/skills/route.ts` (create)
- `app/api/user-skills/route.ts` (create)

**Steps:**

1. Create skills API (read-only)
```typescript
// app/api/skills/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where = {
      ...(category && { category }),
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ skills })
  } catch (error) {
    console.error('Skills fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}
```

2. Create user skills API
```typescript
// app/api/user-skills/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userSkills = await prisma.userSkill.findMany({
      where: { userId: session.user.id },
      include: { skill: true },
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ userSkills })
  } catch (error) {
    console.error('User skills fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user skills' },
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

    const { skillId, rating, confidence, evidence } = await request.json()

    // Validate rating
    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 10' },
        { status: 400 }
      )
    }

    const userSkill = await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: session.user.id,
          skillId,
        },
      },
      update: {
        rating,
        confidence,
        evidence,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        skillId,
        rating,
        confidence,
        evidence,
      },
      include: { skill: true },
    })

    return NextResponse.json({ userSkill })
  } catch (error) {
    console.error('User skill save error:', error)
    return NextResponse.json(
      { error: 'Failed to save user skill' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get('skillId')

    if (!skillId) {
      return NextResponse.json(
        { error: 'skillId required' },
        { status: 400 }
      )
    }

    await prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId: session.user.id,
          skillId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User skill delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user skill' },
      { status: 500 }
    )
  }
}
```

3. Test API endpoints
```bash
# GET skills
curl http://localhost:3000/api/skills

# POST user skill (requires auth)
curl -X POST http://localhost:3000/api/user-skills \
  -H "Content-Type: application/json" \
  -d '{"skillId":"uuid","rating":7,"confidence":"high"}'
```

**Verification:**
- [ ] Can fetch all skills
- [ ] Can filter by category
- [ ] Can search by name
- [ ] Can save user skill
- [ ] Can delete user skill

**Commit:**
```bash
git add app/api/
git commit -m "feat: create API endpoints for skills and user skills"
```

---

## Task 5: Create Skills Inventory Page (5 minutes)

**Files:**
- `app/skills/page.tsx` (create)
- `components/skills/SkillCard.tsx` (create)
- `hooks/useUserSkills.ts` (create)

**Steps:**

1. Create React Query hook
```typescript
// hooks/useUserSkills.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface UserSkill {
  id: string
  skillId: string
  rating: number
  confidence: string
  evidence: string | null
  skill: {
    id: string
    name: string
    category: string
    description: string
    anchors: any
  }
}

export function useUserSkills() {
  return useQuery({
    queryKey: ['userSkills'],
    queryFn: async () => {
      const res = await fetch('/api/user-skills')
      if (!res.ok) throw new Error('Failed to fetch user skills')
      const data = await res.json()
      return data.userSkills as UserSkill[]
    },
  })
}

export function useSaveUserSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      skillId: string
      rating: number
      confidence: string
      evidence: string
    }) => {
      const res = await fetch('/api/user-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to save skill')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] })
    },
  })
}

export function useDeleteUserSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (skillId: string) => {
      const res = await fetch(`/api/user-skills?skillId=${skillId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete skill')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] })
    },
  })
}
```

2. Install React Query
```bash
npm install @tanstack/react-query
```

3. Create skill card component
```typescript
// components/skills/SkillCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SkillCardProps {
  userSkill: {
    id: string
    rating: number
    confidence: string
    evidence: string | null
    skill: {
      name: string
      category: string
    }
  }
  onEdit: () => void
  onDelete: () => void
}

export function SkillCard({ userSkill, onEdit, onDelete }: SkillCardProps) {
  const stars = '⭐'.repeat(userSkill.rating)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{userSkill.skill.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {userSkill.skill.category}
            </Badge>
          </div>
          <span className="text-2xl">{stars}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-600">
              Rating: {userSkill.rating}/10
            </p>
            <p className="text-xs text-slate-500">
              Confidence: {userSkill.confidence}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
        {userSkill.evidence && (
          <p className="text-sm text-slate-600 mt-2 italic">
            "{userSkill.evidence.slice(0, 100)}..."
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

4. Install badge component
```bash
npx shadcn-ui@latest add badge
```

5. Create skills inventory page
```typescript
// app/skills/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserSkills, useDeleteUserSkill } from '@/hooks/useUserSkills'
import { SkillCard } from '@/components/skills/SkillCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SkillsPage() {
  const router = useRouter()
  const { data: userSkills, isLoading } = useUserSkills()
  const deleteSkill = useDeleteUserSkill()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const filtered = userSkills?.filter((us) => {
    if (search && !us.skill.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (category && us.skill.category !== category) {
      return false
    }
    return true
  })

  const categories = Array.from(
    new Set(userSkills?.map((us) => us.skill.category) || [])
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading skills...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            My Skills ({userSkills?.length || 0})
          </h1>
          <Button onClick={() => router.push('/skills/discover')}>
            + Discover More Skills
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          <select
            className="border rounded-lg px-4"
            value={category || ''}
            onChange={(e) => setCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Grid */}
        {filtered && filtered.length > 0 ? (
          <div className="grid gap-4">
            {filtered.map((us) => (
              <SkillCard
                key={us.id}
                userSkill={us}
                onEdit={() => {/* Open modal */}}
                onDelete={() => {
                  if (confirm(`Delete ${us.skill.name}?`)) {
                    deleteSkill.mutate(us.skillId)
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              No skills found. Discover your skills to get started!
            </p>
            <Button onClick={() => router.push('/skills/discover')}>
              Discover Skills →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
```

6. Setup React Query provider
```typescript
// app/layout.tsx (modify)
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

7. Test in browser
```bash
npm run dev
# Navigate to /skills
```

**Verification:**
- [ ] Skills inventory loads
- [ ] Can filter by category
- [ ] Can search by name
- [ ] Can delete skills
- [ ] Empty state shows when no skills

**Commit:**
```bash
git add app/ components/ hooks/
git commit -m "feat: create skills inventory page with filter/search"
```

---

## Phase 1B Complete! 🎉

**Total Time:** ~30 minutes
**Files Created:** 12+
**Lines of Code:** ~900

**Deliverables:**
- ✅ Skills discovery wizard (10 questions)
- ✅ Inference engine for skill suggestions
- ✅ Skill rating modal with behavioral anchors
- ✅ Skills API endpoints (CRUD)
- ✅ Skills inventory page with filter/search
- ✅ React Query for data management

**Next Steps:**
Execute Phase 1C: Career Matching Algorithm (see `2025-11-21-phase-1c-career-matching.md`)

**Update Progress:**
```bash
# Mark Phase 1B complete in progress.md
```
