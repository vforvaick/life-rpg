# Career Matching Algorithm Methodology

**Version:** 1.0 (MVP)
**Last Updated:** November 20, 2025
**Status:** Production (Phase 1)

---

## Executive Summary

**What it does:**
Calculates how well a user's personality (RIASEC) and skills match each of 70 occupations, producing a fit score (0-100%).

**How it works:**
Weighted combination of:
1. **RIASEC alignment** (40% weight) - Personality fit
2. **Skills match** (50% weight) - Capability fit
3. **Experience level** (10% weight) - Seniority fit

**Output:**
Top 10 career matches, sorted by fit score, with skill gaps identified.

---

## Theoretical Foundation

### 1. Holland's RIASEC Theory (1997)

**Reference:** Holland, J. L. (1997). *Making vocational choices: A theory of vocational personalities and work environments*.

**Core Premise:**
- People have personality types (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
- Occupations have environments with same types
- **Person-Environment Fit:** Best matches occur when personality aligns with environment

**Hexagonal Model:**
```
         R (Realistic)
        / \
       /   \
      C     I (Investigative)
      |     |
      |     |
      E     A (Artistic)
       \   /
        \ /
         S (Social)
```

**Compatibility:**
- Adjacent types (e.g., R-I): High compatibility (0.66)
- Opposite types (e.g., R-S): Low compatibility (0.33)
- Same type: Perfect fit (1.0)

---

### 2. Skills-Based Matching

**Framework:** O*NET Content Model (U.S. Dept of Labor)

**Approach:** Behavioral Anchoring (Smith & Kendall, 1963)
- Skills rated 1-10 with observable behaviors
- Each occupation requires specific skills at specific levels
- Gap analysis: |Required Level - User Level|

**Example:**
- **Occupation:** Software Engineer
- **Required Skill:** Programming (Level 8/10)
- **User Rating:** Programming (Level 6/10)
- **Gap:** 2 levels (needs improvement)

---

## Algorithm Specification

### Input Data

**User Profile:**
```typescript
interface UserProfile {
  userId: string;
  riasec: {
    R: number;  // 0-100 percentile
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
    code: string;  // Top 3 letters, e.g., "AIE"
  };
  skills: Array<{
    skillId: string;
    rating: number;  // 1-10
  }>;
  yearsExperience?: number;  // Optional
}
```

**Occupation Data:**
```typescript
interface Occupation {
  id: string;
  onetSocCode: string;
  title: string;
  riasecCode: string;  // e.g., "IRC"
  requiredSkills: Array<{
    skillId: string;
    importance: number;  // 0-100
    level: number;  // 1-10
  }>;
  typicalExperience: number;  // Years
}
```

---

### Algorithm Steps

**Step 1: RIASEC Alignment (40% weight)**

```typescript
function calculateRIASECAlignment(user: RIASECProfile, occupation: Occupation): number {
  const userCode = user.code;  // e.g., "AIE"
  const occCode = occupation.riasecCode;  // e.g., "IRC"

  // Count overlapping letters
  let overlap = 0;
  for (const char of userCode) {
    if (occCode.includes(char)) {
      overlap++;
    }
  }

  // Normalize to 0-1
  return overlap / 3;  // Max overlap = 3
}
```

**Scoring:**
- 3 matches (e.g., "AIE" vs "AIE"): 1.0 (perfect fit)
- 2 matches (e.g., "AIE" vs "AIS"): 0.66 (good fit)
- 1 match (e.g., "AIE" vs "IRC"): 0.33 (partial fit)
- 0 matches (e.g., "AIE" vs "RCS"): 0.0 (poor fit)

---

**Step 2: Skills Match (50% weight)**

```typescript
interface SkillGap {
  skill: Skill;
  required: number;
  current: number;
  importance: number;
}

function calculateSkillMatch(
  userSkills: Map<string, number>,  // skillId → rating
  requiredSkills: RequiredSkill[]
): { score: number, gaps: SkillGap[] } {

  let totalMatch = 0;
  const gaps: SkillGap[] = [];

  requiredSkills.forEach(req => {
    const userRating = userSkills.get(req.skillId) || 0;

    // Calculate gap
    const gap = Math.max(0, req.level - userRating);

    // Calculate match for this skill (weighted by importance)
    // Formula: importance × (1 - gap/10)
    // Example: importance=80, gap=2 → 80 × (1 - 0.2) = 64
    const match = req.importance * (1 - gap / 10);
    totalMatch += match;

    // Track gap if exists
    if (gap > 0) {
      gaps.push({
        skill: req.skill,
        required: req.level,
        current: userRating,
        importance: req.importance
      });
    }
  });

  // Normalize by total possible importance
  const totalImportance = requiredSkills.reduce((sum, s) => sum + s.importance, 0);
  const score = totalMatch / totalImportance;  // 0-1

  return { score, gaps };
}
```

**Example Calculation:**

Occupation requires:
- Programming (importance=90, level=8)
- Data Analysis (importance=70, level=6)
- Communication (importance=40, level=5)

User has:
- Programming: 7/10 (gap=1)
- Data Analysis: 6/10 (gap=0)
- Communication: 3/10 (gap=2)

**Calculation:**
```
Programming match   = 90 × (1 - 1/10) = 90 × 0.9 = 81
Data Analysis match = 70 × (1 - 0/10) = 70 × 1.0 = 70
Communication match = 40 × (1 - 2/10) = 40 × 0.8 = 32

Total match = 81 + 70 + 32 = 183
Total possible = 90 + 70 + 40 = 200

Skill match score = 183 / 200 = 0.915 (91.5%)
```

---

**Step 3: Experience Level (10% weight)**

```typescript
function calculateExperienceScore(user: UserProfile, occupation: Occupation): number {
  const userYears = user.yearsExperience || 0;
  const typicalYears = occupation.typicalExperience || 5;

  // Cap at 1.0 if user meets or exceeds typical experience
  return Math.min(userYears / typicalYears, 1.0);
}
```

**Examples:**
- User: 5 years, Typical: 5 years → 1.0 (perfect)
- User: 3 years, Typical: 5 years → 0.6 (60%)
- User: 10 years, Typical: 5 years → 1.0 (capped)
- User: no data, Typical: 5 years → 0.0 (or default to 0.5 in MVP)

**MVP Simplification:**
For Phase 1, assume all users are mid-level (experience score = 0.5) to avoid requiring experience input during onboarding.

---

**Step 4: Weighted Combination**

```typescript
function calculateFitScore(user: UserProfile, occupation: Occupation): number {
  const riasecScore = calculateRIASECAlignment(user.riasec, occupation);
  const { score: skillScore } = calculateSkillMatch(user.skills, occupation.requiredSkills);
  const expScore = calculateExperienceScore(user, occupation);  // 0.5 default in MVP

  // Weighted sum
  const fit = (0.4 * riasecScore) + (0.5 * skillScore) + (0.1 * expScore);

  // Convert to percentage (0-100)
  return Math.round(fit * 100);
}
```

**Example:**
- RIASEC alignment: 0.66 (2 matches)
- Skill match: 0.85 (85%)
- Experience: 0.5 (default)

**Calculation:**
```
Fit = (0.4 × 0.66) + (0.5 × 0.85) + (0.1 × 0.5)
    = 0.264 + 0.425 + 0.05
    = 0.739
    = 74% (rounded)
```

---

## Complete Algorithm (Production Code)

```typescript
// api/utils/careerMatching.ts

export interface CareerMatch {
  occupation: Occupation;
  fitScore: number;  // 0-100
  riasecAlignment: number;  // 0-1
  skillMatch: number;  // 0-1
  experienceScore: number;  // 0-1
  skillGaps: SkillGap[];
}

export async function calculateCareerMatches(userId: string): Promise<CareerMatch[]> {
  // 1. Get user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      assessments: {
        where: { type: 'riasec' },
        orderBy: { completedAt: 'desc' },
        take: 1
      },
      userSkills: {
        include: { skill: true }
      }
    }
  });

  if (!user || !user.assessments[0]) {
    throw new Error('User must complete RIASEC assessment first');
  }

  const userRIASEC = user.assessments[0].results as RIASECProfile;
  const userSkillsMap = new Map(
    user.userSkills.map(us => [us.skillId, us.rating])
  );

  // 2. Get all occupations
  const occupations = await prisma.occupation.findMany();

  // 3. Calculate fit for each occupation
  const matches: CareerMatch[] = occupations.map(occ => {
    // RIASEC alignment (40%)
    const riasecScore = calculateRIASECAlignment(userRIASEC, occ);

    // Skills match (50%)
    const { score: skillScore, gaps } = calculateSkillMatch(
      userSkillsMap,
      occ.requiredSkills as RequiredSkill[]
    );

    // Experience (10%) - default to 0.5 for MVP
    const expScore = 0.5;

    // Weighted fit score
    const fitScore = Math.round(
      (0.4 * riasecScore + 0.5 * skillScore + 0.1 * expScore) * 100
    );

    return {
      occupation: occ,
      fitScore,
      riasecAlignment: riasecScore,
      skillMatch: skillScore,
      experienceScore: expScore,
      skillGaps: gaps
    };
  });

  // 4. Sort by fit score (highest first)
  return matches.sort((a, b) => b.fitScore - a.fitScore);
}
```

---

## Validation \& Testing

### Test Cases

**Test 1: Perfect Match**
```typescript
test('user with exact occupation skills gets 100% fit', () => {
  const user = {
    riasec: { code: 'IRC', I: 90, R: 80, C: 70, ... },
    skills: new Map([
      ['programming', 8],
      ['data-analysis', 8],
      ['problem-solving', 8]
    ])
  };

  const occupation = {
    riasecCode: 'IRC',
    requiredSkills: [
      { skillId: 'programming', importance: 90, level: 8 },
      { skillId: 'data-analysis', importance: 80, level: 8 },
      { skillId: 'problem-solving', importance: 70, level: 8 }
    ]
  };

  const fit = calculateFitScore(user, occupation);
  expect(fit).toBe(100);  // Perfect alignment
});
```

**Test 2: RIASEC Mismatch**
```typescript
test('opposite RIASEC codes result in low fit', () => {
  const artistic = { code: 'AIE', A: 90, I: 80, E: 70, ... };
  const realistic = { riasecCode: 'RCS' };  // Opposite of AIE

  const alignment = calculateRIASECAlignment(artistic, realistic);
  expect(alignment).toBeLessThan(0.4);  // <40% alignment
});
```

**Test 3: Skill Gap Identification**
```typescript
test('identifies missing skills correctly', () => {
  const user = {
    skills: new Map([
      ['programming', 5]
      // Missing 'leadership' skill
    ])
  };

  const occupation = {
    requiredSkills: [
      { skillId: 'programming', importance: 80, level: 7 },
      { skillId: 'leadership', importance: 60, level: 6 }
    ]
  };

  const { gaps } = calculateSkillMatch(user.skills, occupation.requiredSkills);

  expect(gaps).toHaveLength(2);
  expect(gaps[0].gap).toBe(2);  // Programming gap: 7 - 5
  expect(gaps[1].gap).toBe(6);  // Leadership gap: 6 - 0
});
```

---

## Performance Optimization

### MVP (70 occupations)
- **No optimization needed**
- Calculate all 70 matches per request (~100ms)
- Return top 10 to user

### Phase 2D (300+ occupations)
- **Add caching layer (Redis)**
- Cache matches for 1 hour
- Invalidate cache when user updates skills
- Parallel processing with `Promise.all()`

**Optimized Code (Phase 2D):**
```typescript
export async function calculateCareerMatches(userId: string): Promise<CareerMatch[]> {
  // Check cache
  const cacheKey = `matches:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Calculate (same as before)
  const matches = await computeMatches(userId);

  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(matches));

  return matches;
}
```

**Expected Performance:**
- Cold (no cache): ~1.5s for 300 occupations
- Warm (cached): ~50ms
- Cache hit rate: >80%

---

## Accuracy \& Validation

### User Feedback Loop

**In-App Survey (after viewing matches):**
```
How relevant is this match to your career goals?
[Not Relevant] [Somewhat] [Very Relevant] [Perfect Match]
```

**Continuous Improvement:**
- Track user ratings of match quality
- If match rated "Not Relevant" → analyze why
- Adjust weights (40/50/10) based on data
- A/B test different matching formulas

**Target Accuracy:**
- >70% of top 10 matches rated "Relevant" or better
- <10% of matches rated "Not Relevant"

---

## Known Limitations (MVP)

### 1. Experience Level Simplified
**Limitation:** Default to 0.5 for all users
**Impact:** Some senior-level roles may rank too high for juniors
**Mitigation (Phase 2):** Add experience input to onboarding

### 2. RIASEC Codes Only (No Percentiles)
**Limitation:** Uses 3-letter code, not full 6-dimension scores
**Impact:** Miss nuances (e.g., high I + low R vs medium both)
**Mitigation (Phase 2):** Use cosine similarity on full RIASEC vector

### 3. Missing Skills = 0 Rating
**Limitation:** Assumes user has 0/10 in unrated skills
**Impact:** May penalize users who haven't added all skills yet
**Mitigation:** Prompt users to complete skill discovery wizard

### 4. Static Importance Weights
**Limitation:** All users weigh RIASEC (40%) and skills (50%) equally
**Impact:** Some users may care more about personality fit than skills
**Mitigation (Future):** Let users adjust weight preferences

---

## Future Enhancements

### Phase 2 Improvements

1. **Cosine Similarity for RIASEC**
   ```typescript
   function cosineSimilarity(user: number[], occ: number[]): number {
     const dotProduct = user.reduce((sum, val, i) => sum + val * occ[i], 0);
     const magnitudeUser = Math.sqrt(user.reduce((sum, val) => sum + val ** 2, 0));
     const magnitudeOcc = Math.sqrt(occ.reduce((sum, val) => sum + val ** 2, 0));
     return dotProduct / (magnitudeUser * magnitudeOcc);
   }
   ```

2. **Machine Learning Model**
   - Train on user feedback (match ratings)
   - Learn personalized weights (RIASEC vs skills)
   - Collaborative filtering ("users like you matched with...")

3. **Temporal Factors**
   - Career growth pathways (Junior → Mid → Senior)
   - Skills trending up/down in demand
   - Industry growth outlook

---

## References

1. Holland, J. L. (1997). *Making vocational choices: A theory of vocational personalities and work environments* (3rd ed.). Psychological Assessment Resources.

2. U.S. Department of Labor, Employment and Training Administration. (2023). *O*NET Content Model*. Retrieved from https://www.onetcenter.org/content.html

3. Smith, P. C., & Kendall, L. M. (1963). Retranslation of expectations: An approach to the construction of unambiguous anchors for rating scales. *Journal of Applied Psychology*, 47(2), 149-155.

4. Rounds, J., & Tracey, T. J. (1996). Cross-cultural structural equivalence of RIASEC models and measures. *Journal of Counseling Psychology*, 43(3), 310-329.

---

## Version History

- **v1.0** (2025-11-20): Initial MVP algorithm (70 occupations)
- **v2.0** (TBD): Phase 2D optimizations (300+ occupations, caching)
- **v3.0** (TBD): ML-based personalized matching

---

**Questions?** Contact: data-team@skilltree.io
