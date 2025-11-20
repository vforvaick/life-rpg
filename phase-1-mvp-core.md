# Phase 1: MVP Core

**Duration:** Weeks 5-16 (3 months)  
**Goal:** Launch minimum viable product - core value delivery  
**Team:** 4-5 engineers  

---

## Phase Overview

### Core User Value
> "Help me discover my skills and find matching career paths"

### Key Features
1. ✅ RIASEC Assessment (simplified 24 questions)
2. ✅ Skills Inventory (50 core skills with anchors)
3. ✅ Career Matching (top 10 fits)
4. ✅ Dashboard & Visualizations
5. ✅ PDF Export (Skills Resume)

### Success Metrics
- **60%** onboarding completion rate
- Users add **10+** skills on average
- Users explore **5+** career matches
- **30%** 7-day retention rate

---

## Sprint Breakdown (6 sprints × 2 weeks)

### Sprint 1 (Weeks 5-6): Onboarding Flow
**Goal:** User can sign up and complete RIASEC assessment

**Stories:**
1. Welcome screen with value proposition
2. RIASEC assessment UI (24 questions)
3. Results calculation and storage
4. Base stats dashboard

---

### Sprint 2 (Weeks 7-8): Skills Discovery
**Goal:** User can discover and add skills to inventory

**Stories:**
1. Skills discovery wizard (guided questions)
2. Skills inventory page (list view)
3. Skill detail modal with anchors
4. Add/rate skill functionality

---

### Sprint 3 (Weeks 9-10): Skills Management
**Goal:** User can manage and search their skills

**Stories:**
1. Search and filter skills
2. Edit skill ratings
3. Add evidence/examples
4. Bulk actions (delete, export)

---

### Sprint 4 (Weeks 11-12): Career Matching
**Goal:** User sees career matches based on profile

**Stories:**
1. Career matching algorithm
2. Career matches list page
3. Career detail page (with skill gaps)
4. Save/favorite careers

---

### Sprint 5 (Weeks 13-14): Dashboard & Visualizations
**Goal:** User has visual overview of skills and matches

**Stories:**
1. Dashboard layout and navigation
2. RIASEC hexagon chart
3. Skills distribution charts
4. Recent activity timeline

---

### Sprint 6 (Weeks 15-16): Polish & Launch Prep
**Goal:** Production-ready MVP

**Stories:**
1. PDF export (skills resume)
2. Mobile optimization
3. Performance optimization
4. Beta testing and bug fixes

---

## Detailed Implementation

---

## Sprint 1: Onboarding Flow (Weeks 5-6)

### Story 1.1: Welcome Screen
**Owner:** Frontend Engineer  
**Effort:** 3 points

**UI Components:**
- Hero section with value proposition
- "Get Started" CTA button
- Feature highlights (3 cards)
- Social proof (if available)

**Wireframe:**
```
┌────────────────────────────────────────┐
│  SkillTree Logo                 Login  │
├────────────────────────────────────────┤
│                                        │
│     Discover Your Skills               │
│     Find Your Career Path              │
│                                        │
│     [Get Started Free]                 │
│                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ Disc │  │ Path │  │ Track│         │
│  │ over │  │ find │  │      │         │
│  └──────┘  └──────┘  └──────┘         │
└────────────────────────────────────────┘
```

**Code Structure:**
```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] "Get Started" redirects to sign-up
- [ ] <3s page load time

---

### Story 1.2: RIASEC Assessment UI
**Owner:** Frontend Engineer  
**Effort:** 8 points

**Requirements:**
- 24 questions (4 per RIASEC dimension)
- 5-point Likert scale (Strongly Dislike → Strongly Like)
- Progress indicator
- Save progress (can resume later)
- <15 minutes to complete

**Question Format:**
```typescript
interface Question {
  id: number;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  text: string;
  // Example: "Repair household appliances"
}

const questions: Question[] = [
  { id: 1, category: 'R', text: 'Repair household appliances' },
  { id: 2, category: 'I', text: 'Conduct scientific experiments' },
  { id: 3, category: 'A', text: 'Write stories or poetry' },
  // ... 21 more
];
```

**UI Flow:**
```
Question 1/24
──────────────────────────────
Repair household appliances

How much do you enjoy this activity?

[1] [2] [3] [4] [5]
Strongly Dislike ↔ Strongly Like

           [← Back] [Next →]
```

**State Management:**
```typescript
// store/assessment.ts
interface AssessmentState {
  currentQuestion: number;
  responses: Record<number, number>; // questionId -> answer (1-5)
  startedAt: Date;
}

const useAssessment = create<AssessmentState>((set) => ({
  currentQuestion: 0,
  responses: {},
  
  answerQuestion: (questionId: number, answer: number) => {
    set((state) => ({
      responses: { ...state.responses, [questionId]: answer }
    }));
  },
  
  nextQuestion: () => {
    set((state) => ({ currentQuestion: state.currentQuestion + 1 }));
  },
  
  previousQuestion: () => {
    set((state) => ({ currentQuestion: state.currentQuestion - 1 }));
  }
}));
```

**Acceptance Criteria:**
- [ ] User can navigate between questions
- [ ] Responses saved to local storage
- [ ] Can't proceed without answering
- [ ] Progress bar shows completion percentage

---

### Story 1.3: Results Calculation
**Owner:** Backend Engineer  
**Effort:** 5 points

**Algorithm:**
```typescript
// api/utils/riasec.ts
interface RIASECResults {
  R: number; // Realistic (0-100)
  I: number; // Investigative
  A: number; // Artistic
  S: number; // Social
  E: number; // Enterprising
  C: number; // Conventional
  code: string; // Top 3 letters, e.g. "AIE"
}

export function calculateRIASEC(
  responses: Record<number, number>
): RIASECResults {
  // Group responses by category
  const categoryScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  questions.forEach((q) => {
    const answer = responses[q.id] || 0;
    categoryScores[q.category] += answer;
  });
  
  // Normalize to percentiles (0-100)
  // 4 questions × 5 max = 20 max per category
  const results: RIASECResults = {
    R: (categoryScores.R / 20) * 100,
    I: (categoryScores.I / 20) * 100,
    A: (categoryScores.A / 20) * 100,
    S: (categoryScores.S / 20) * 100,
    E: (categoryScores.E / 20) * 100,
    C: (categoryScores.C / 20) * 100,
    code: ''
  };
  
  // Generate 3-letter code (top 3 dimensions)
  const sorted = Object.entries(results)
    .filter(([key]) => key !== 'code')
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => key);
  
  results.code = sorted.join('');
  
  return results;
}
```

**API Endpoint:**
```typescript
// POST /api/assessments/riasec
app.post('/api/assessments/riasec', requireAuth, async (req, res) => {
  const { responses } = req.body;
  const userId = req.auth.userId;
  
  // Validate
  if (Object.keys(responses).length !== 24) {
    return res.status(400).json({ error: 'Incomplete assessment' });
  }
  
  // Calculate
  const results = calculateRIASEC(responses);
  
  // Store
  const assessment = await prisma.assessment.create({
    data: {
      userId,
      type: 'riasec',
      responses: responses as any,
      results: results as any
    }
  });
  
  res.json({ assessment });
});
```

**Acceptance Criteria:**
- [ ] Calculation matches expected values (unit tests)
- [ ] Results stored in database
- [ ] Returns 3-letter RIASEC code

---

### Story 1.4: Base Stats Dashboard
**Owner:** Frontend Engineer  
**Effort:** 5 points

**UI Layout:**
```
┌────────────────────────────────────────┐
│  Your Base Stats                       │
├────────────────────────────────────────┤
│                                        │
│   Your RIASEC Code: AIE                │
│   Artistic · Investigative · Enterprising │
│                                        │
│   ┌────────────────┐                   │
│   │   Hexagon      │                   │
│   │   Radar Chart  │                   │
│   │     (RIASEC)   │                   │
│   └────────────────┘                   │
│                                        │
│   What This Means:                     │
│   You thrive in creative problem-      │
│   solving roles that combine...        │
│                                        │
│   [Continue to Skills Discovery →]     │
└────────────────────────────────────────┘
```

**Chart Component:**
```tsx
// components/RIASECChart.tsx
'use client';

import { Radar } from 'react-chartjs-2';

interface Props {
  results: RIASECResults;
}

export function RIASECChart({ results }: Props) {
  const data = {
    labels: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
    datasets: [{
      label: 'Your Profile',
      data: [results.R, results.I, results.A, results.S, results.E, results.C],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    }]
  };
  
  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 }
      }
    }
  };
  
  return <Radar data={data} options={options} />;
}
```

**Acceptance Criteria:**
- [ ] Chart displays correctly
- [ ] Code interpretation text shown
- [ ] CTA button proceeds to next step

---

## Sprint 2: Skills Discovery (Weeks 7-8)

### Story 2.1: Discovery Wizard
**Owner:** Full-Stack Engineer  
**Effort:** 8 points

**Approach:** Guided questions that infer skills

**Question Flow:**
```
Step 1: Experience Questions (10 questions)
───────────────────────────────────────
Q: Have you ever led a team of people?
   [ ] Yes [ ] No

Q: Have you written 1000+ words (articles, reports)?
   [ ] Yes [ ] No

Q: Have you solved technical problems (debugging, troubleshooting)?
   [ ] Yes [ ] No
   
→ Infers: Leadership, Writing, Technical Support
```

**Backend Logic:**
```typescript
// api/utils/skillInference.ts
interface InferenceRule {
  question: string;
  yesImplies: string[]; // skill IDs
  noImplies: string[];
}

const inferenceRules: InferenceRule[] = [
  {
    question: 'Have you led a team?',
    yesImplies: ['leadership-skill-id', 'coordination-skill-id'],
    noImplies: []
  },
  {
    question: 'Have you written 1000+ words?',
    yesImplies: ['writing-skill-id', 'communication-skill-id'],
    noImplies: []
  }
  // ... more rules
];

export function inferSkills(answers: Record<string, boolean>): string[] {
  const suggestedSkillIds = new Set<string>();
  
  inferenceRules.forEach((rule, index) => {
    const answer = answers[`q${index}`];
    const implies = answer ? rule.yesImplies : rule.noImplies;
    implies.forEach(skillId => suggestedSkillIds.add(skillId));
  });
  
  return Array.from(suggestedSkillIds);
}
```

**Acceptance Criteria:**
- [ ] 10 experience questions shown
- [ ] Suggests 5-15 relevant skills
- [ ] User can accept or skip suggestions

---

### Story 2.2: Skills Inventory Page
**Owner:** Frontend Engineer  
**Effort:** 5 points

**Layout:**
```
┌────────────────────────────────────────┐
│  My Skills (12)       [+ Add Skill]    │
├────────────────────────────────────────┤
│  Category: [All ▾]  Search: [____]     │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Writing                 ⭐ 7/10   │ │
│  │ Content Skills                    │ │
│  │ Updated 2 days ago     [Edit]     │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Programming             ⭐ 6/10   │ │
│  │ Technical Skills                  │ │
│  │ Updated 1 week ago     [Edit]     │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

**Component:**
```tsx
// app/(dashboard)/skills/page.tsx
export default function SkillsPage() {
  const { data: skills, isLoading } = useUserSkills();
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const filtered = skills?.filter(s => {
    if (category && s.skill.category !== category) return false;
    if (search && !s.skill.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  
  return (
    <div>
      <header>
        <h1>My Skills ({skills?.length || 0})</h1>
        <Button onClick={() => router.push('/skills/add')}>+ Add Skill</Button>
      </header>
      
      <Filters category={category} onCategoryChange={setCategory} search={search} onSearchChange={setSearch} />
      
      <div className="grid gap-4">
        {filtered?.map(us => (
          <SkillCard key={us.id} userSkill={us} />
        ))}
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Shows all user skills
- [ ] Filter by category works
- [ ] Search by name works
- [ ] Sorted by rating (highest first)

---

### Story 2.3: Skill Detail Modal
**Owner:** Frontend Engineer  
**Effort:** 5 points

**Modal Content:**
```
┌─────────────────────────────────────────┐
│  Writing                          [×]    │
├─────────────────────────────────────────┤
│                                         │
│  Communicating effectively in writing   │
│  Category: Content Skills               │
│                                         │
│  Your Rating: ⭐⭐⭐⭐⭐⭐⭐☆☆☆ (7/10)     │
│                                         │
│  Qualitative Anchors:                   │
│  ├ Level 2: Write emails, basic grammar │
│  ├ Level 4: Write reports, clear structure│
│  ├ Level 6: Write articles, persuasive  │
│  ├ Level 8: Professional writer, published│
│  └ Level 10: Bestselling author         │
│                                         │
│  Confidence: [Low] [Med] [High]         │
│                                         │
│  Evidence/Examples:                     │
│  ┌───────────────────────────────────┐ │
│  │ Led content team, published 50+   │ │
│  │ articles on TechBlog...           │ │
│  └───────────────────────────────────┘ │
│                                         │
│           [Cancel] [Save Changes]       │
└─────────────────────────────────────────┘
```

**Component:**
```tsx
// components/SkillModal.tsx
interface Props {
  skill: Skill;
  userSkill?: UserSkill;
  isOpen: boolean;
  onClose: () => void;
}

export function SkillModal({ skill, userSkill, isOpen, onClose }: Props) {
  const [rating, setRating] = useState(userSkill?.rating || 5);
  const [confidence, setConfidence] = useState(userSkill?.confidence || 'medium');
  const [evidence, setEvidence] = useState(userSkill?.evidence || '');
  
  const mutation = useSaveUserSkill();
  
  const handleSave = () => {
    mutation.mutate({
      skillId: skill.id,
      rating,
      confidence,
      evidence
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill.name}</DialogTitle>
        </DialogHeader>
        
        <p className="text-sm text-muted-foreground">{skill.description}</p>
        
        {/* Rating slider */}
        <div>
          <label>Your Rating:</label>
          <Slider value={[rating]} onValueChange={([v]) => setRating(v)} min={1} max={10} />
        </div>
        
        {/* Anchors */}
        <Anchors skill={skill} currentRating={rating} />
        
        {/* Confidence */}
        <RadioGroup value={confidence} onValueChange={setConfidence}>
          <RadioGroupItem value="low">Low</RadioGroupItem>
          <RadioGroupItem value="medium">Medium</RadioGroupItem>
          <RadioGroupItem value="high">High</RadioGroupItem>
        </RadioGroup>
        
        {/* Evidence */}
        <Textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="Examples..." />
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Acceptance Criteria:**
- [ ] Modal opens on skill click
- [ ] Rating slider shows anchors dynamically
- [ ] Save updates database
- [ ] Close button works

---

## Sprint 3: Skills Management (Weeks 9-10)

### Story 3.1: Search & Filter
**Owner:** Backend Engineer  
**Effort:** 3 points

**API Enhancement:**
```typescript
// GET /api/skills?category=Content&search=writing&sort=name
app.get('/api/skills', async (req, res) => {
  const { category, search, sort = 'name' } = req.query;
  
  const where = {
    ...(category && { category: category as string }),
    ...(search && {
      name: { contains: search as string, mode: 'insensitive' as const }
    })
  };
  
  const skills = await prisma.skill.findMany({
    where,
    orderBy: { [sort as string]: 'asc' }
  });
  
  res.json({ skills });
});
```

**Frontend:**
```tsx
// components/SkillsFilters.tsx
export function SkillsFilters({ onFilter }: Props) {
  return (
    <div className="flex gap-4">
      <Select onValueChange={(cat) => onFilter({ category: cat })}>
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Content">Content</SelectItem>
          <SelectItem value="Process">Process</SelectItem>
          <SelectItem value="Social">Social</SelectItem>
          <SelectItem value="Technical">Technical</SelectItem>
        </SelectContent>
      </Select>
      
      <Input placeholder="Search skills..." onChange={(e) => onFilter({ search: e.target.value })} />
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Search returns relevant results (<500ms)
- [ ] Filter by category works
- [ ] Combination of filters works

---

### Story 3.2-3.4: [Continue with remaining stories...]

---

## Sprint 4: Career Matching (Weeks 11-12)

### Key Implementation: Matching Algorithm

**Algorithm:**
```typescript
// api/utils/careerMatching.ts
interface CareerMatch {
  occupation: Occupation;
  fitScore: number; // 0-100
  riasecAlignment: number;
  skillMatch: number;
  skillGaps: SkillGap[];
}

interface SkillGap {
  skill: Skill;
  required: number;
  current: number;
  importance: number;
}

export async function calculateCareerMatches(userId: string): Promise<CareerMatch[]> {
  // 1. Get user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      assessments: { where: { type: 'riasec' }, orderBy: { completedAt: 'desc' }, take: 1 },
      userSkills: { include: { skill: true } }
    }
  });
  
  if (!user) throw new Error('User not found');
  
  const userRIASEC = user.assessments[0]?.results as RIASECResults;
  const userSkills = new Map(user.userSkills.map(us => [us.skillId, us.rating]));
  
  // 2. Get all occupations
  const occupations = await prisma.occupation.findMany();
  
  // 3. Calculate fit for each occupation
  const matches = occupations.map(occ => {
    // RIASEC alignment (40% weight)
    const riasecScore = calculateRIASECAlignment(userRIASEC, occ.riasecCode);
    
    // Skill match (50% weight)
    const { skillScore, gaps } = calculateSkillMatch(userSkills, occ.requiredSkills);
    
    // Experience (10% weight) - simplified for MVP
    const expScore = 0.5; // Assume mid-level
    
    // Weighted fit score
    const fitScore = (0.4 * riasecScore + 0.5 * skillScore + 0.1 * expScore) * 100;
    
    return {
      occupation: occ,
      fitScore: Math.round(fitScore),
      riasecAlignment: riasecScore,
      skillMatch: skillScore,
      skillGaps: gaps
    };
  });
  
  // 4. Sort by fit score
  return matches.sort((a, b) => b.fitScore - a.fitScore);
}

function calculateRIASECAlignment(user: RIASECResults, occCode: string): number {
  // Simple: overlap of top 3 letters
  const userTop3 = user.code; // e.g., "AIE"
  const overlap = [...userTop3].filter(char => occCode.includes(char)).length;
  return overlap / 3; // 0-1
}

function calculateSkillMatch(
  userSkills: Map<string, number>,
  requiredSkills: { skillId: string, importance: number, level: number }[]
): { skillScore: number, gaps: SkillGap[] } {
  let totalMatch = 0;
  const gaps: SkillGap[] = [];
  
  requiredSkills.forEach(req => {
    const userLevel = userSkills.get(req.skillId) || 0;
    const gap = Math.max(0, req.level - userLevel);
    const match = req.importance * (1 - gap / 10);
    totalMatch += match;
    
    if (gap > 0) {
      gaps.push({
        skill: req.skill,
        required: req.level,
        current: userLevel,
        importance: req.importance
      });
    }
  });
  
  const skillScore = totalMatch / requiredSkills.length;
  return { skillScore, gaps };
}
```

**API Endpoint:**
```typescript
// GET /api/career-matches
app.get('/api/career-matches', requireAuth, async (req, res) => {
  const userId = req.auth.userId;
  const { limit = 10 } = req.query;
  
  const matches = await calculateCareerMatches(userId);
  
  res.json({
    matches: matches.slice(0, Number(limit))
  });
});
```

**Acceptance Criteria:**
- [ ] Returns top 10 matches
- [ ] Fit scores range 0-100
- [ ] Skill gaps identified
- [ ] Response time <2s

---

## Sprint 5-6: [Continue with Dashboard, Visualizations, PDF Export...]

---

## Launch Checklist (Week 16)

### Pre-Launch (Week 15)
- [ ] All MVP features complete and tested
- [ ] Performance audit (Lighthouse score >90)
- [ ] Security audit (no critical vulnerabilities)
- [ ] Legal pages (Privacy Policy, Terms of Service)
- [ ] Analytics tracking (PostHog/Mixpanel events)

### Launch Day
- [ ] Deploy to production
- [ ] Submit to Product Hunt
- [ ] Announce on social media
- [ ] Email waitlist (if any)
- [ ] Monitor errors (Sentry)

### Post-Launch (Week 16+)
- [ ] Daily: Check metrics dashboard
- [ ] Weekly: User interviews (5-10 users)
- [ ] Bi-weekly: Prioritize bug fixes and quick wins
- [ ] Monthly: Retrospective and Phase 2 planning

---

## Success Criteria

**MVP Launch is successful if:**
- ✅ 60% onboarding completion rate
- ✅ Users add 10+ skills on average
- ✅ 30% 7-day retention
- ✅ NPS >30 from beta users
- ✅ <5 critical bugs in production

**If criteria not met:**
- Extend Phase 1 by 4 weeks
- Conduct more user interviews
- Identify and fix top pain points

---

## Next Phase

After successful MVP launch → **Phase 2: Growth Features** (`phase-2-growth.md`)

---

**Questions?** Contact: product-manager@skilltree.io