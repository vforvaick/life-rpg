<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Product Requirements Document (PRD)

## SkillTree: Personal Development \& Career Navigation Platform

**Version:** 1.0
**Last Updated:** November 20, 2025
**Document Owner:** Product Team
**Status:** Draft for Review

***

## 1. Executive Summary

### 1.1 Product Vision

SkillTree is a self-awareness and career navigation platform that helps individuals discover, track, and develop their personal capabilities using an RPG-inspired mental model. By combining validated psychological frameworks (RIASEC, Big Five) with comprehensive skill taxonomies (O*NET), we provide users with clarity on "who they are" and "what they can become."

### 1.2 Core Value Propositions

1. **Self-Discovery Tool** - Answer "What are my skills?" through guided assessment and reflection
2. **Career Pathfinding** - Visualize possible career paths based on current skill combinations
3. **Development Roadmap** - Understand what skills to learn next for target opportunities
4. **Parenting Guidance** - Track child development and discover optimal growth directions
5. **Self-Actualization** - Recognize and monetize existing strengths

### 1.3 Target Users

- **Primary:** Working professionals (25-45) seeking career clarity or transitions
- **Secondary:** Parents wanting developmental guidance for children (0-18)
- **Tertiary:** Students/young adults (16-25) exploring career options

***

## 2. Problem Statement

### 2.1 User Problems

**Problem 1: Skills Blindness**
> "When asked 'what are your skills?', I'm confused. I don't know what's valuable about me."

- Users cannot articulate their capabilities
- Lack framework to identify transferable skills
- Undervalue implicit knowledge and experience

**Problem 2: Parenting Direction Uncertainty**
> "I have a baby. I'm confused about which direction to develop them, what to 'unlock'."

- Parents lack developmental roadmap
- Uncertain which activities match child's natural inclinations
- No community benchmarking for similar profiles

**Problem 3: Self-Worth \& Monetization Gap**
> "I want more self-actualization and to 'appreciate' myself by acknowledging what powers/strengths I have and where I can contribute/sell them."

- Difficulty connecting skills to market opportunities
- Lack of strength-based self-framing
- No visibility into skill combination value


### 2.2 Market Gap

Existing solutions are insufficient:

- **LinkedIn:** Networking-focused, static skill lists, no development guidance
- **Habitica:** Task gamification, not identity discovery
- **Career assessments:** One-time tests, no ongoing tracking or skill trees
- **Learning platforms:** Course-focused, not outcome-oriented

***

## 3. Product Goals \& Success Metrics

### 3.1 Goals (12 Months Post-Launch)

| Goal | Target | Rationale |
| :-- | :-- | :-- |
| User Acquisition | 50,000 registered users | Market validation |
| Skill Discovery | 80% complete initial assessment | Core value delivery |
| Engagement | 40% monthly active users | Ongoing utility |
| Career Actions | 25% take career action (apply, learn, transition) | Real-world impact |
| Parent Module Adoption | 15% of users activate parent mode | Secondary persona validation |

### 3.2 Key Metrics

**Acquisition Metrics:**

- Registration conversion rate
- Source attribution (organic, referral, paid)
- Time to first assessment completion

**Engagement Metrics:**

- Monthly Active Users (MAU)
- Skill updates per month (avg)
- Skill tree interactions
- Session duration

**Value Metrics:**

- Skills discovered (avg per user)
- Career matches explored
- Learning paths initiated
- Monetization opportunities clicked

**Retention Metrics:**

- 7-day retention
- 30-day retention
- 90-day retention
- Feature adoption curve

***

## 4. Core Features \& Requirements

### 4.1 Feature Overview

| Feature | Priority | Phase | User Value |
| :-- | :-- | :-- | :-- |
| RIASEC Assessment | P0 | MVP | Discover personality foundation |
| Skills Inventory | P0 | MVP | Track \& rate capabilities |
| Qualitative Anchors | P0 | MVP | Accurate self-assessment |
| Career Matching | P0 | MVP | Find fitting opportunities |
| Skill Tree Visualization | P1 | Phase 2 | Visualize growth paths |
| Parenting Module | P1 | Phase 2 | Child development tracking |
| User-Generated Skills | P1 | Phase 2 | Community-driven taxonomy |
| Marketplace Integration | P2 | Phase 3 | Direct monetization |


***

### 4.2 MVP Features (Phase 1: 3-6 Months)

#### Feature 1: Base Stats Assessment

**Description:**
Onboarding flow that establishes user's personality and physical baseline through validated assessments.

**User Stories:**

- As a new user, I want to complete a personality assessment so I understand my natural inclinations
- As a user, I can optionally input physical stats (height, speed, strength) to unlock physical activity matches

**Acceptance Criteria:**

- [ ] RIASEC assessment integrated (48 questions)
- [ ] Big Five personality test (short form, 44 questions)
- [ ] Physical stats input module (optional)
- [ ] Results displayed as "Base Stats" dashboard
- [ ] 3-letter RIASEC code generated (e.g., "AIR")
- [ ] Assessment takes <15 minutes to complete
- [ ] Progress saving (can resume later)
- [ ] Mobile-responsive design

**Technical Requirements:**

- Store assessment responses in structured format
- Calculate RIASEC percentile scores
- Map to O*NET occupation database
- Export capability (PDF report)

**Data Sources:**

- RIASEC: Public domain assessment (John Holland)
- Big Five: IPIP-NEO short form (public domain)
- Physical benchmarks: CDC/WHO standards

***

#### Feature 2: Skills Inventory System

**Description:**
Three-tier system for discovering, adding, rating, and tracking skills over time.

**User Stories:**

- As a user, I want to discover what skills I have through guided questions
- As a user, I can manually add skills not suggested by the system
- As a user, I want to rate my skill levels (1-10) with clear behavioral examples
- As a user, I can see my skill inventory organized by categories

**Acceptance Criteria:**

- [ ] Skills organized in 7 O*NET categories (Content, Process, Social, Technical, etc.)
- [ ] Initial 100 skills available (35 core O*NET + 65 common skills)
- [ ] Discovery wizard with experience-based questions
    - "Have you led a team?" → Leadership
    - "Have you written 1000+ words?" → Writing
    - "Have you troubleshot tech issues?" → Technical Support
- [ ] 1-10 rating scale with qualitative anchors for each skill
- [ ] Optional fields: Evidence/examples, Last updated, Confidence level
- [ ] Filter/search functionality
- [ ] Sort by: Category, Rating, Recently Updated
- [ ] Bulk import from resume/CV (LLM-assisted)

**Technical Requirements:**

- Skills taxonomy database (initially O*NET-based)
- User-skill relationship table with ratings \& metadata
- LLM integration for CV parsing (OpenAI/Anthropic API)
- Search indexing (Elasticsearch or similar)

**Data Model:**

```json
{
  "user_skill": {
    "user_id": "uuid",
    "skill_id": "uuid",
    "rating": 1-10,
    "confidence": "low|medium|high",
    "evidence": "string (optional)",
    "last_updated": "timestamp",
    "created_at": "timestamp"
  }
}
```


***

#### Feature 3: Qualitative Anchors System

**Description:**
Behavioral descriptors for each skill level (1-10) to reduce self-assessment bias and improve accuracy.

**User Stories:**

- As a user, I want to see concrete examples of what each skill level means
- As a user, I can compare my behavior to the anchors to rate accurately
- As a parent, I want age-appropriate anchors for assessing my child's skills

**Acceptance Criteria:**

- [ ] Every skill has 5 anchor descriptions (Levels 2, 4, 6, 8, 10)
- [ ] Anchors describe observable behaviors, not feelings
- [ ] Age-variant anchors for parenting module
- [ ] Anchors visible during rating (tooltip or side panel)
- [ ] Examples span novice → professional → expert progression
- [ ] Culturally neutral language

**Example Anchors:**

**Skill: Public Speaking**

- **Level 2:** Nervous speaking to small groups (<10). Prefer written communication.
- **Level 4:** Present to familiar audiences (team meetings). Require preparation.
- **Level 6:** Comfortable with 50+ people. Handle Q\&A. Give presentations monthly.
- **Level 8:** Regular presentations to 100+. Adapt to diverse crowds. Professional speaker.
- **Level 10:** National/international speaker. Paid keynotes. Train other speakers.

**Skill: Reading Comprehension (Age 5)**

- **Level 2:** Recognizes letters. Identifies familiar words (name, "stop").
- **Level 4:** Reads simple sentences. Understands picture books.
- **Level 6:** Reads short chapter books independently. Comprehends basic plots.

**Technical Requirements:**

- Anchors stored as JSON in skills table
- Templating system for age-variant anchors
- Admin interface for anchor management
- Community feedback mechanism ("Are these anchors helpful?")

***

#### Feature 4: Career/Opportunity Matching Engine

**Description:**
AI-powered matching system that maps user's skill profile and RIASEC code to suitable occupations, showing fit percentages and skill gaps.

**User Stories:**

- As a user, I want to see which careers match my current skills
- As a user, I can explore what additional skills would improve my fit for target careers
- As a user, I want to understand salary ranges and job availability for matches

**Acceptance Criteria:**

- [ ] Display top 10 career matches with fit percentage (0-100%)
- [ ] Fit calculation considers:
    - RIASEC alignment (40% weight)
    - Skill ratings vs. O*NET requirements (50% weight)
    - Experience level (10% weight)
- [ ] Each match shows:
    - Job title \& description
    - Fit percentage
    - Required skills (highlight gaps in red, matches in green)
    - Typical salary range (from O*NET/Glassdoor API)
    - Job availability trend (↑ growing / → stable / ↓ declining)
- [ ] "Unlock this career" button → shows learning path
- [ ] Filter by: Industry, Salary range, Education requirement, RIASEC type
- [ ] Save favorite matches
- [ ] Export matches report (PDF)

**Technical Requirements:**

- O*NET database integration (968 occupations)
- Matching algorithm (weighted scoring)
- External API integration: Glassdoor/Indeed for salary data
- Caching layer for performance (Redis)
- Real-time updates when user changes skill ratings

**Matching Algorithm (Pseudo-code):**

```python
def calculate_fit(user_profile, occupation):
    # 1. RIASEC alignment (40%)
    riasec_score = cosine_similarity(user_profile.riasec, occupation.riasec)
    
    # 2. Skills match (50%)
    required_skills = occupation.skills  # list of (skill_id, importance, level)
    user_skills = user_profile.skills    # list of (skill_id, rating)
    
    skill_score = 0
    for req_skill in required_skills:
        user_rating = user_skills.get(req_skill.id, 0)
        gap = max(0, req_skill.level - user_rating)
        match = req_skill.importance * (1 - gap/10)
        skill_score += match
    skill_score = skill_score / len(required_skills)
    
    # 3. Experience (10%)
    exp_score = min(user_profile.years_experience / occupation.typical_experience, 1)
    
    # Weighted sum
    fit = (0.4 * riasec_score + 0.5 * skill_score + 0.1 * exp_score) * 100
    return fit
```


***

#### Feature 5: Basic Visualization \& Export

**Description:**
Dashboard with charts and skill profile export for sharing.

**User Stories:**

- As a user, I want to see my skills visualized in an intuitive way
- As a user, I can export my skill profile as a PDF to share with employers/coaches
- As a user, I want to track my skill progression over time

**Acceptance Criteria:**

- [ ] Dashboard with:
    - RIASEC hexagon chart (radar plot)
    - Top 10 skills bar chart
    - Skill distribution by category (donut chart)
    - Recent updates timeline
- [ ] "Skills Resume" PDF export with:
    - Base stats (RIASEC, Big Five)
    - All rated skills organized by category
    - Qualitative descriptions (anchors) for top skills
    - Career match summary
    - Generated timestamp \& unique ID
- [ ] Comparison view: "Skills 3 months ago vs. now"
- [ ] Mobile-optimized charts (responsive)

**Technical Requirements:**

- Chart library (Chart.js or D3.js)
- PDF generation (Puppeteer or similar)
- Historical snapshots (store monthly skill states)
- Shareable links (optional: privacy-controlled)

***

### 4.3 Phase 2 Features (6-12 Months)

#### Feature 6: Interactive Skill Tree Visualization

**Description:**
Graph-based visualization showing skill relationships, prerequisites, synergies, and career paths.

**User Stories:**

- As a user, I want to see which skills unlock other skills
- As a user, I can visualize paths from my current skills to target careers
- As a user, I want to explore common skill combinations in my field

**Acceptance Criteria:**

- [ ] Interactive force-directed graph visualization
- [ ] Nodes: Skills (color by category), Careers (distinct icon)
- [ ] Edges: Prerequisites (solid), Synergies (dashed), Enables (thick arrow)
- [ ] Node states: Owned (green), Partially owned (yellow), Locked (gray)
- [ ] Click node → expand details panel (rating, anchors, related careers)
- [ ] "Show path to [Career X]" highlights required skill sequence
- [ ] Filter by: Category, Difficulty, Time to acquire
- [ ] Zoom/pan controls
- [ ] Mobile: Switch to hierarchical list view

**Technical Requirements:**

- Graph database (Neo4j) for relationship storage
- Frontend graph library (Cytoscape.js or vis.js)
- Pathfinding algorithm (Dijkstra for shortest skill path)
- Performance optimization (lazy loading for large graphs)

**Data Model (Neo4j):**

```cypher
// Nodes
(s:Skill {id, name, category, difficulty})
(o:Occupation {id, title, riasec, salary_range})
(u:User {id, name})

// Relationships
(s1:Skill)-[:PREREQUISITE_OF {strength: 0-1}]->(s2:Skill)
(s1:Skill)-[:SYNERGIZES_WITH {multiplier: 1.0-2.0}]->(s2:Skill)
(s:Skill)-[:ENABLES {importance: 0-100}]->(o:Occupation)
(u:User)-[:HAS_SKILL {rating: 1-10, updated: timestamp}]->(s:Skill)
```


***

#### Feature 7: Parenting Module

**Description:**
Dedicated interface for tracking child development with age-appropriate assessments and activity recommendations.

**User Stories:**

- As a parent, I want to track my child's developmental milestones
- As a parent, I can discover activities that match my child's emerging strengths
- As a parent, I want to see how other children with similar profiles are developing

**Acceptance Criteria:**

- [ ] Child profile creation (name, DOB, relationship)
- [ ] Age-segmented assessments:
    - 0-2 years: Developmental milestones (WHO standards)
    - 3-5 years: Play-based observation prompts
    - 6-12 years: Simplified RIASEC (visual cards)
    - 13-18 years: Full RIASEC + skills inventory
- [ ] Age-appropriate skill anchors
- [ ] Activity recommendations based on RIASEC pattern
    - Example: High R+I → "Try robotics kits, science experiments, building toys"
- [ ] Growth tracking: Timeline view of skill progression
- [ ] Parent community: "Parents with similar profiles recommend..."
- [ ] Multiple children support
- [ ] Privacy controls (profile visibility)

**Technical Requirements:**

- Child profiles linked to parent accounts
- Age-gating for appropriate content
- WHO developmental standards database
- Activity database (initially curated, later user-generated)
- Community features (forums, recommendations)

***

#### Feature 8: User-Generated Skills \& Pathways

**Description:**
Community-driven expansion of skill taxonomy and career pathways.

**User Stories:**

- As a user, I can propose new skills not in the taxonomy
- As a user, I can share my career transition story as a pathway template
- As a user, I can upvote useful skills and pathways submitted by others

**Acceptance Criteria:**

- [ ] "Suggest a skill" form with:
    - Skill name
    - Category selection
    - Example anchors (1-10 scale)
    - Related skills (optional)
    - Why it's needed (rationale)
- [ ] Community voting system (upvote/downvote)
- [ ] Admin review queue for skill approvals
- [ ] "My Career Journey" template:
    - Starting point (skills, role)
    - Destination (current skills, role)
    - Skills learned (sequence)
    - Time taken
    - Key resources used
- [ ] Pathway browsing: Filter by origin role, destination role
- [ ] Pathway success metrics: "120 users followed this path"
- [ ] Reputation system: Users gain points for helpful contributions

**Technical Requirements:**

- User-generated content database tables
- Moderation queue interface (admin panel)
- Voting system with spam prevention
- Search/filter for pathways
- Notification system (pathway approved, new relevant pathways)

***

### 4.4 Phase 3 Features (12-24 Months)

#### Feature 9: Marketplace Integration

**Description:**
Skill-based matching between service providers (users) and opportunity seekers (clients/companies).

**User Stories:**

- As a user, I can list my services based on my verified skill profile
- As a client, I can post projects and receive AI-matched candidates
- As a user, I can earn reputation through completed transactions

**Acceptance Criteria:**

- [ ] Service listing creation (description, rate, skills required)
- [ ] Project posting (description, budget, skills needed)
- [ ] AI matching algorithm (skill fit + availability + ratings)
- [ ] In-app messaging
- [ ] Payment processing (Stripe integration)
- [ ] Review \& rating system
- [ ] Reputation score affects skill credibility
- [ ] Dispute resolution process

**Technical Requirements:**

- Marketplace database schema
- Matching algorithm (similar to career matching)
- Payment gateway integration (Stripe/PayPal)
- Escrow system for transactions
- Messaging infrastructure (real-time preferred)
- Review moderation system

**Success Metrics:**

- Transactions per month
- Average transaction value
- Marketplace take rate (10-15%)
- Match acceptance rate
- Dispute rate (<5%)

***

## 5. User Experience \& Design

### 5.1 User Flows

#### Core Flow 1: New User Onboarding

```
Landing Page
    ↓
Sign Up (email/Google/LinkedIn)
    ↓
Welcome & Value Proposition
    ↓
RIASEC Assessment (48 questions, ~10 min)
    ↓
[Optional] Big Five Assessment (~8 min)
    ↓
[Optional] Physical Stats Input
    ↓
Base Stats Results Dashboard
    ↓
Skills Discovery Wizard (guided questions)
    ↓
Skill Rating with Anchors
    ↓
Career Matches Reveal
    ↓
Main Dashboard (first-time tour)
```

**Drop-off Prevention:**

- Progress saving at each step
- "Why we ask this" tooltips
- Estimated time remaining
- Skip buttons for optional sections
- Mobile-optimized (high mobile traffic expected)

***

#### Core Flow 2: Skill Discovery \& Rating

```
Dashboard
    ↓
"Discover Skills" button
    ↓
Discovery Method Selection:
    1. Guided Questions (recommended for new users)
    2. Search & Add Manually
    3. Upload Resume (AI extraction)
    ↓
[Method 1] Answer experience questions → Suggested skills
[Method 2] Search taxonomy → Select → Rate
[Method 3] Upload file → Review extracted skills → Confirm/edit
    ↓
Skill Rating Interface
    ├─ Skill name & description
    ├─ 1-10 scale with anchors (expandable)
    ├─ Confidence selector (Low/Med/High)
    └─ Evidence field (optional)
    ↓
Save to Inventory
    ↓
Related Skills Suggestion ("Users with X also have Y")
    ↓
Updated Dashboard (new skills highlighted)
```


***

#### Core Flow 3: Career Exploration

```
Dashboard → "Explore Careers" button
    ↓
Career Matches List (sorted by fit %)
    ├─ Filters: Industry, Salary, Education, RIASEC
    └─ Each card shows: Title, Fit %, Key skills, Salary range
    ↓
Click Career Card
    ↓
Career Detail Page
    ├─ Full description
    ├─ Required skills (color-coded: owned/gap)
    ├─ RIASEC fit breakdown
    ├─ Salary data & trends
    ├─ Related job postings (if API available)
    └─ "Unlock this career" button
    ↓
Click "Unlock"
    ↓
Learning Path Page
    ├─ Skills to acquire (prioritized)
    ├─ Estimated time to proficiency
    ├─ Recommended resources (courses, books)
    ├─ Community pathways ("Others went from X → Y like this")
    └─ "Start Learning" CTA
```


***

### 5.2 Information Architecture

```
SkillTree Platform
│
├── Dashboard (Home)
│   ├── Base Stats Summary (RIASEC, Big Five)
│   ├── Skill Highlights (Top 10)
│   ├── Recent Updates
│   ├── Quick Actions (Add skill, Take assessment, Explore careers)
│   └── Insights ("Your profile is rare: top 3%")
│
├── My Skills
│   ├── Skills Inventory (list/grid view)
│   ├── By Category (tabs for each O*NET category)
│   ├── Skill Detail Modal (rating, anchors, evidence, history)
│   ├── Discover Skills (wizard)
│   └── Manage (edit, delete, bulk actions)
│
├── Career Explorer
│   ├── Matches (AI-recommended)
│   ├── Search (by keyword, industry, RIASEC)
│   ├── Career Detail Pages
│   ├── Learning Paths
│   └── Saved Careers (favorites)
│
├── Skill Tree [Phase 2]
│   ├── Personal Tree (my skills + paths)
│   ├── Community Tree (aggregated insights)
│   ├── Path Finder (A → B routing)
│   └── Filters & Controls
│
├── Parenting [Phase 2]
│   ├── Child Profiles
│   ├── Assessments (age-gated)
│   ├── Growth Tracking
│   ├── Activity Recommendations
│   └── Parent Community
│
├── Marketplace [Phase 3]
│   ├── Browse Opportunities
│   ├── My Services
│   ├── Messages
│   ├── Transactions
│   └── Reviews
│
├── Profile & Settings
│   ├── Account Settings
│   ├── Privacy Controls
│   ├── Export Data
│   ├── Assessment History
│   └── Integrations (LinkedIn, resume import)
│
└── Resources & Help
    ├── How It Works
    ├── Skill Guides
    ├── Blog (career advice, skill development)
    ├── FAQs
    └── Support
```


***

### 5.3 Design Principles

1. **Clarity Over Cleverness**
    - Simple, jargon-free language
    - Progressive disclosure (don't overwhelm)
    - Clear CTAs ("Discover skills" not "Initialize profile")
2. **Data Transparency**
    - Show how fit percentages are calculated
    - Explain where anchors come from
    - Cite sources (O*NET, research papers)
3. **Positive Framing**
    - Focus on strengths, not gaps
    - "Skills to unlock" not "Skills you lack"
    - Celebrate progress (badges, milestones)
4. **Mobile-First**
    - 60%+ traffic expected from mobile
    - Touch-friendly controls (large tap targets)
    - Simplified navigation (bottom nav bar)
5. **Accessible**
    - WCAG 2.1 AA compliance
    - Keyboard navigation
    - Screen reader support
    - High contrast mode

***

## 6. Technical Architecture

### 6.1 System Overview

**Architecture Pattern:** Microservices with API Gateway

```
┌─────────────────────────────────────────────────┐
│             Frontend (Next.js/React)             │
│  - Web App (responsive)                         │
│  - Mobile App (React Native) [Phase 3]          │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────┐
│           API Gateway (Node.js/Express)         │
│  - Authentication                               │
│  - Rate limiting                                │
│  - Request routing                              │
└────────┬───────────────────────────────────────┘
         │
    ┌────┴────┬──────────┬──────────┬────────────┐
    ↓         ↓          ↓          ↓            ↓
┌─────────┐ ┌────────┐ ┌──────┐ ┌──────────┐ ┌──────┐
│ User    │ │ Skills │ │Career│ │ Matching │ │ LLM  │
│ Service │ │Service │ │Svc   │ │ Engine   │ │Svc   │
└─────────┘ └────────┘ └──────┘ └──────────┘ └──────┘
    │           │          │          │            │
    └───────────┴──────────┴──────────┴────────────┘
                         │
                         ↓
            ┌────────────────────────┐
            │   Data Layer           │
            │ - PostgreSQL (users,   │
            │   skills, ratings)     │
            │ - Neo4j (skill graph)  │
            │ - Redis (cache)        │
            │ - S3 (file storage)    │
            └────────────────────────┘
```


***

### 6.2 Technology Stack

**Frontend:**

- Framework: Next.js 14+ (React 18+, App Router)
- UI Library: Tailwind CSS + shadcn/ui components
- Charts: Chart.js / D3.js
- Graph Visualization: Cytoscape.js
- State Management: Zustand
- API Client: tRPC or REST with React Query

**Backend:**

- API Gateway: Node.js + Express (or Fastify)
- Services: Node.js (TypeScript)
- Authentication: Clerk or Auth0
- Background Jobs: BullMQ (Redis-backed)

**Databases:**

- Primary DB: PostgreSQL 15+ (users, skills, ratings, assessments)
- Graph DB: Neo4j 5+ (skill relationships, pathways)
- Cache: Redis 7+
- Search: Elasticsearch or Typesense (for skill search)

**External Services:**

- LLM: OpenAI GPT-4 or Anthropic Claude (resume parsing, skill extraction)
- Email: SendGrid or AWS SES
- Analytics: PostHog or Mixpanel
- Error Tracking: Sentry
- CDN: Cloudflare

**Infrastructure:**

- Hosting: Vercel (frontend) + AWS/GCP (backend)
- CI/CD: GitHub Actions
- Monitoring: Datadog or New Relic
- Feature Flags: LaunchDarkly

***

### 6.3 Data Models

#### Core Entities (PostgreSQL)

**users**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50) DEFAULT 'free'
);
```

**assessments**

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- 'riasec', 'big5'
  responses JSONB NOT NULL,
  results JSONB NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Example results JSONB for RIASEC:
{
  "R": 75,  -- Realistic percentile
  "I": 82,  -- Investigative
  "A": 90,  -- Artistic
  "S": 45,  -- Social
  "E": 60,  -- Enterprising
  "C": 30,  -- Conventional
  "code": "AIE"  -- Top 3 letters
}
```

**skills**

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'Content', 'Process', etc.
  description TEXT,
  anchors JSONB NOT NULL, -- {level_2: "...", level_4: "...", ...}
  onet_id VARCHAR(50), -- Link to O*NET if applicable
  is_user_generated BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_name_search ON skills USING gin(to_tsvector('english', name));
```

**user_skills**

```sql
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  rating INT CHECK (rating >= 1 AND rating <= 10),
  confidence VARCHAR(20) CHECK (confidence IN ('low', 'medium', 'high')),
  evidence TEXT,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);
```

**occupations** (from O*NET)

```sql
CREATE TABLE occupations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onet_soc_code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  riasec_code VARCHAR(10), -- e.g., "IAS"
  required_skills JSONB, -- [{skill_id, importance, level}, ...]
  salary_range JSONB, -- {min, max, median, currency}
  outlook VARCHAR(50), -- 'growing', 'stable', 'declining'
  education_level VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_occupations_riasec ON occupations(riasec_code);
```

**career_matches** (cached)

```sql
CREATE TABLE career_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  occupation_id UUID REFERENCES occupations(id),
  fit_score DECIMAL(5,2) CHECK (fit_score >= 0 AND fit_score <= 100),
  skill_gaps JSONB, -- [{skill_id, gap_size}, ...]
  calculated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, occupation_id)
);

CREATE INDEX idx_career_matches_user_score ON career_matches(user_id, fit_score DESC);
```


***

#### Graph Database (Neo4j)

**Nodes:**

```cypher
// Skill node
(:Skill {
  id: UUID,
  name: String,
  category: String,
  difficulty: String,  // 'beginner', 'intermediate', 'advanced'
  time_to_learn_hours: Int
})

// Occupation node
(:Occupation {
  id: UUID,
  title: String,
  riasec: String,
  salary_median: Int
})

// User node (lightweight, full data in PostgreSQL)
(:User {
  id: UUID,
  riasec: String
})
```

**Relationships:**

```cypher
// Skill prerequisites
(:Skill)-[:PREREQUISITE_OF {strength: Float}]->(:Skill)
// Example: Python is 0.8 strength prerequisite for Data Analysis

// Skill synergies (combining skills is powerful)
(:Skill)-[:SYNERGIZES_WITH {multiplier: Float}]->(:Skill)
// Example: Design synergizes with Writing (multiplier 1.5)

// Skill enables occupation
(:Skill)-[:ENABLES {importance: Int, required_level: Int}]->(:Occupation)
// Example: Python enables Data Scientist (importance 95, level 7)

// User has skill
(:User)-[:HAS_SKILL {rating: Int, updated_at: Timestamp}]->(:Skill)

// Career pathways (user-generated)
(:Occupation)-[:PATHWAY_TO {common_skills: [UUID], avg_time_months: Int}]->(:Occupation)
// Example: Teacher → UX Designer pathway
```

**Sample Queries:**

```cypher
// Find shortest learning path from user's skills to target occupation
MATCH (u:User {id: $userId})-[:HAS_SKILL]->(owned:Skill),
      path = shortestPath((owned)-[:PREREQUISITE_OF*..5]->(needed:Skill)-[:ENABLES]->(o:Occupation {id: $targetOccupationId}))
WHERE NOT (u)-[:HAS_SKILL]->(needed)
RETURN path

// Find common skill combinations for successful career transitions
MATCH (u:User)-[:HAS_SKILL]->(s:Skill)-[:ENABLES]->(o1:Occupation),
      (s)-[:SYNERGIZES_WITH]->(s2:Skill)-[:ENABLES]->(o2:Occupation)
WHERE o1.title = "Teacher" AND o2.title = "UX Designer"
RETURN s.name, s2.name, COUNT(*) as frequency
ORDER BY frequency DESC
LIMIT 10
```


***

### 6.4 API Specifications

**Base URL:** `https://api.skilltree.io/v1`

**Authentication:** JWT tokens (Bearer auth)

***

#### Endpoints (MVP)

**POST /auth/signup**

```json
Request:
{
  "email": "user@example.com",
  "password": "********",
  "name": "Jane Doe"
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "created_at": "2025-11-20T01:00:00Z"
  },
  "token": "jwt_token_here"
}
```


***

**POST /assessments/riasec**

```json
Request:
{
  "responses": [
    {"question_id": 1, "answer": 4},  // 1-5 scale
    {"question_id": 2, "answer": 2},
    // ... 48 total
  ]
}

Response: 200 OK
{
  "assessment_id": "uuid",
  "results": {
    "R": 75,
    "I": 82,
    "A": 90,
    "S": 45,
    "E": 60,
    "C": 30,
    "code": "AIE",
    "description": "You have strong artistic, investigative, and enterprising interests..."
  }
}
```


***

**GET /skills?category=Content\&search=writing**

```json
Response: 200 OK
{
  "skills": [
    {
      "id": "uuid",
      "name": "Writing",
      "category": "Content",
      "description": "Communicating effectively in writing...",
      "anchors": {
        "2": "Write emails and short messages. Basic grammar.",
        "4": "Write reports and proposals. Clear structure.",
        "6": "Write long-form content (articles, whitepapers). Persuasive.",
        "8": "Professional writer. Published work. Edit others' writing.",
        "10": "Bestselling author or award-winning journalist."
      },
      "onet_id": "2.A.1.a"
    }
    // ...
  ],
  "total": 15,
  "page": 1,
  "per_page": 20
}
```


***

**POST /user-skills**

```json
Request:
{
  "skill_id": "uuid",
  "rating": 7,
  "confidence": "high",
  "evidence": "Led content team at Company X, published 50+ articles"
}

Response: 201 Created
{
  "user_skill": {
    "id": "uuid",
    "skill_id": "uuid",
    "rating": 7,
    "confidence": "high",
    "evidence": "...",
    "created_at": "2025-11-20T01:30:00Z"
  }
}
```


***

**GET /career-matches?limit=10**

```json
Response: 200 OK
{
  "matches": [
    {
      "occupation": {
        "id": "uuid",
        "title": "Content Marketing Manager",
        "description": "Plans and executes content strategy...",
        "riasec_code": "AES",
        "salary_range": {
          "min": 60000,
          "max": 120000,
          "median": 85000,
          "currency": "USD"
        },
        "outlook": "growing"
      },
      "fit_score": 87.5,
      "riasec_alignment": 0.92,
      "skill_match": 0.84,
      "skill_gaps": [
        {
          "skill_id": "uuid",
          "name": "SEO",
          "current_rating": 0,
          "required_level": 6,
          "importance": 75
        },
        {
          "skill_id": "uuid",
          "name": "Data Analysis",
          "current_rating": 4,
          "required_level": 6,
          "importance": 60
        }
      ]
    }
    // ... 9 more
  ]
}
```


***

**POST /skills/extract-from-resume**

```json
Request (multipart/form-data):
{
  "file": <uploaded_file.pdf>
}

Response: 200 OK
{
  "extracted_skills": [
    {
      "skill_id": "uuid",
      "name": "Project Management",
      "suggested_rating": 7,
      "evidence": "Managed team of 5 developers on Project X",
      "confidence": "high"
    },
    {
      "skill_id": null,  // Not in taxonomy yet
      "name": "Prompt Engineering",
      "suggested_rating": 6,
      "evidence": "Built 20+ GPT applications",
      "confidence": "medium"
    }
    // ...
  ]
}
```


***

### 6.5 Security \& Privacy

**Data Protection:**

- GDPR \& CCPA compliant
- Data encryption at rest (AES-256) and in transit (TLS 1.3)
- Right to be forgotten (full data deletion)
- Export data feature (JSON format)

**Authentication:**

- OAuth 2.0 with JWT tokens
- Password hashing: bcrypt (cost factor 12)
- Multi-factor authentication (Phase 2)
- Session management: 30-day token expiration, refresh tokens

**API Security:**

- Rate limiting: 100 req/min per user, 1000 req/min per IP
- Input validation \& sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (Content Security Policy headers)
- CORS policy (whitelist approved domains)

**Privacy Controls:**

- Profile visibility: Public, Private, or Custom (Phase 2)
- Skill sharing: Opt-in for community features
- Assessment data: Never shared without explicit consent
- Child data: Strict COPPA compliance (parental verification required)

***

## 7. Growth \& Monetization

### 7.1 Go-to-Market Strategy

**Phase 1: Early Adopters (Months 1-6)**

- Target: Career changers, freelancers, upskilling professionals
- Channels:
    - Product Hunt launch
    - Reddit (r/careerguidance, r/selfimprovement)
    - LinkedIn thought leadership (founder-led)
    - Content marketing (SEO-optimized blog)
- Tactics:
    - Free forever core features
    - Referral program (invite 3 friends → unlock premium feature)
    - Ambassador program (career coaches, HR professionals)

**Phase 2: Scale (Months 7-12)**

- Target: Expand to parents, students
- Channels:
    - Paid ads (Facebook, Instagram, TikTok)
    - Partnerships (universities, bootcamps, career services)
    - Webinars \& workshops
- Tactics:
    - Case studies \& testimonials
    - Affiliate program (20% recurring commission)
    - API partnerships (integrate with learning platforms)

**Phase 3: Enterprise (Months 13+)**

- Target: Companies for internal talent development
- Channels:
    - Direct sales (B2B)
    - HR tech conferences
    - Pilot programs
- Tactics:
    - White-label solution
    - Bulk licenses (per employee pricing)
    - Integration with HR systems (Workday, BambooHR)

***

### 7.2 Monetization Model

**Free Tier:**

- RIASEC + Big Five assessment
- Skills inventory (up to 50 skills)
- Basic career matches (top 5)
- PDF export (1 per month)
- Community features (read-only)

**Premium Tier (\$9.99/month or \$99/year):**

- Unlimited skills
- Full career matches (all results + detailed gaps)
- Skill tree visualization
- Learning path recommendations
- Priority support
- Advanced analytics (skill progression charts)
- Export unlimited
- Community features (full access)

**Premium Plus (\$19.99/month or \$199/year):**

- All Premium features
- Parenting module (unlimited children)
- AI-powered resume parsing (unlimited)
- 1-on-1 skill coaching session (quarterly)
- Marketplace access (0% platform fee for 1 year)
- Early access to new features

**Enterprise (Custom Pricing):**

- White-label deployment
- SSO integration
- Admin dashboard \& analytics
- API access (rate limits based on tier)
- Dedicated account manager
- Custom skill taxonomies

**Additional Revenue Streams:**

- Marketplace transaction fees (15% after free period)
- Affiliate commissions (learning platforms, courses)
- Sponsored career matches (companies pay for visibility)
- Data insights (anonymized, aggregated trends sold to EdTech/HR companies)

***

### 7.3 Key Partnerships

**Strategic Partners:**

1. **O*NET / US Dept of Labor** - Data licensing \& collaboration
2. **LinkedIn** - OAuth integration, skill validation
3. **Coursera / Udemy / Pluralsight** - Learning path recommendations → affiliate revenue
4. **Career coaches** - Ambassador program, consultation marketplace
5. **Universities** - Student career services integration
6. **Bootcamps** - Pre/post skill assessment for graduates

**Technology Partners:**

- **Neo4j** - Graph database partner spotlight
- **OpenAI / Anthropic** - LLM integration case study
- **Auth0 / Clerk** - Authentication infrastructure

***

## 8. Success Criteria \& KPIs

### 8.1 Product-Market Fit Indicators

**Qualitative:**

- [ ] Users report "aha moments" during skill discovery
- [ ] NPS score >40 within first 6 months
- [ ] Testimonials highlight self-awareness gains
- [ ] Organic social sharing (not incentivized)

**Quantitative:**

- [ ] 40% of users complete full onboarding
- [ ] 50% of users return within 7 days
- [ ] Average session duration >8 minutes
- [ ] 25% upgrade to paid within 90 days (freemium model)

***

### 8.2 Phase-Specific KPIs

**MVP (Months 1-6):**


| Metric | Target | Rationale |
| :-- | :-- | :-- |
| Registered Users | 10,000 | Validate concept |
| Activation Rate (completed assessment) | 60% | Core value experienced |
| Skills Added per User (avg) | 15 | Inventory utility |
| Career Matches Explored (avg) | 8 | Engagement with matching |
| 30-Day Retention | 35% | Product stickiness |
| Weekly Active Users / MAU | 40% | Engagement depth |

**Phase 2 (Months 7-12):**


| Metric | Target | Rationale |
| :-- | :-- | :-- |
| Registered Users | 50,000 | Growth trajectory |
| Premium Conversion | 5% | Monetization validation |
| Parenting Module Adoption | 15% | Secondary persona fit |
| User-Generated Skills Submitted | 500 | Community engagement |
| Skill Tree Interactions per User | 12/month | Feature adoption |
| NPS Score | 45+ | Product satisfaction |

**Phase 3 (Months 13-24):**


| Metric | Target | Rationale |
| :-- | :-- | :-- |
| Registered Users | 200,000 | Scale |
| Annual Recurring Revenue (ARR) | \$500K | Business viability |
| Marketplace Transactions | 1,000/month | Ecosystem liquidity |
| Enterprise Pilots | 5 | B2B validation |
| API Partners | 10 | Platform expansion |
| Churn Rate | <5% | Retention excellence |


***

## 9. Risks \& Mitigations

### 9.1 Critical Risks

**Risk 1: Low Onboarding Completion**

- **Probability:** High
- **Impact:** Critical (users don't experience core value)
- **Mitigation:**
    - Progressive profiling (don't ask everything upfront)
    - Save progress automatically
    - Reduce RIASEC to 24 questions (short form)
    - Gamify assessment ("You're 60% through, almost there!")
    - Mobile optimization (most drop-offs on mobile)

**Risk 2: Self-Assessment Inaccuracy (Dunning-Kruger)**

- **Probability:** Medium
- **Impact:** High (undermines trust in system)
- **Mitigation:**
    - Mandatory qualitative anchors (already planned)
    - Confidence intervals force metacognition
    - Periodic recalibration prompts
    - Peer validation option (Phase 2)
    - Objective evidence links (certifications, portfolio)

**Risk 3: Skill Taxonomy Incompleteness**

- **Probability:** Medium
- **Impact:** Medium (users can't find their skills)
- **Mitigation:**
    - Start with 100+ most common skills
    - User-generated skill proposals (Phase 2)
    - LLM-assisted skill mapping to existing taxonomy
    - Regular O*NET sync (annual)
    - Crowdsourced validation before approval

**Risk 4: Career Matching Inaccuracy**

- **Probability:** Medium
- **Impact:** High (core value proposition fails)
- **Mitigation:**
    - Transparent algorithm ("Here's how we calculate fit")
    - User feedback loop ("Is this match relevant?" Yes/No)
    - A/B test matching formulas
    - Human-in-the-loop for edge cases
    - Continuous retraining with user outcome data

**Risk 5: Low Engagement After Initial Use**

- **Probability:** High (common in career tools)
- **Impact:** Critical (affects retention \& monetization)
- **Mitigation:**
    - Notification triggers (new job matches, skill reminders)
    - Gamification (streaks, badges, leaderboards)
    - Content emails (skill development tips)
    - Community features (forums, mentorship)
    - Regular feature releases (reasons to return)

**Risk 6: Competition from Incumbents**

- **Probability:** Medium (LinkedIn, Coursera could build similar)
- **Impact:** High (market share erosion)
- **Mitigation:**
    - Network effects (unique skill pathways from community)
    - Niche focus (depth over breadth)
    - RPG framing as differentiator
    - Speed to market (first-mover advantage)
    - Patent skill tree visualization approach

***

## 10. Open Questions \& Assumptions

### 10.1 Open Questions

1. **What's the optimal RIASEC assessment length?**
    - 48 questions (standard) vs. 24 (short) vs. adaptive (start with 12, add if ambiguous)
    - Need to A/B test completion rates vs. accuracy
2. **How do we validate user-generated skills?**
    - Community voting threshold? (e.g., 50 upvotes)
    - Admin review required?
    - LLM pre-screening for quality?
3. **What's the right pricing?**
    - \$9.99/mo competitive but sustainable?
    - Should we have tiered storage (skills limit) or feature gates?
    - Annual discount percentage? (currently 17%)
4. **How to handle international users?**
    - O*NET is US-centric. Need European/Asian occupation databases?
    - Salary data in local currencies?
    - Cultural adaptation of anchors?
5. **What's the marketplace safety strategy?**
    - Escrow system cost?
    - Dispute resolution staffing needs?
    - Insurance for high-value transactions?

***

### 10.2 Key Assumptions (To Validate)

**User Behavior:**

- [ ] Users will self-assess skills honestly with anchors
- [ ] Career changers check career tools monthly (not daily)
- [ ] Parents will invest time in tracking child development
- [ ] Community-driven pathways add unique value (not just noise)

**Market:**

- [ ] Market size: 50M+ knowledge workers in US alone seeking career clarity
- [ ] Willingness to pay \$10/mo for self-awareness tools
- [ ] O*NET data sufficient starting point (can expand later)
- [ ] Skill-based hiring trend continues to grow

**Technical:**

- [ ] Graph database can scale to millions of skill relationships
- [ ] LLM resume parsing accuracy >80%
- [ ] Career matching algorithm achieves 70%+ user satisfaction
- [ ] Mobile web experience sufficient for MVP (don't need native app yet)

**Business:**

- [ ] 5% freemium conversion achievable (industry benchmark: 2-5%)
- [ ] Marketplace takes 12+ months to build liquidity
- [ ] Enterprise sales cycle <6 months
- [ ] Content marketing can drive 40% of acquisition (vs. paid ads)

***

## 11. Appendices

### Appendix A: RIASEC Assessment Questions (Sample)

**Instructions:** Rate each activity 1-5 (1=Strongly Dislike, 5=Strongly Like)

**Realistic (R):**

1. Repair household appliances
2. Work outdoors
3. Operate machinery or tools
4. Build things with wood or metal

**Investigative (I):**
5. Conduct scientific experiments
6. Analyze data or statistics
7. Read scientific or technical journals
8. Solve abstract problems

**Artistic (A):**
9. Write stories, poetry, or music
10. Design artwork or graphics
11. Perform in plays or concerts
12. Create new ideas or concepts

**Social (S):**
13. Teach people new skills
14. Help others solve problems
15. Work in a team setting
16. Counsel individuals on personal issues

**Enterprising (E):**
17. Lead a group toward a goal
18. Persuade others to buy a product
19. Organize events or projects
20. Debate or argue a position

**Conventional (C):**
21. Organize files and records
22. Work with numbers and data
23. Follow clear procedures
24. Maintain detailed records

[...24 more questions for 48-question version]

***

### Appendix B: Skills Taxonomy (Initial 100)

**Content Skills (O*NET):**

1. Reading Comprehension
2. Active Listening
3. Writing
4. Speaking
5. Mathematics
6. Science

**Process Skills:**
7. Critical Thinking
8. Active Learning
9. Learning Strategies
10. Monitoring

**Social Skills:**
11. Social Perceptiveness
12. Coordination
13. Persuasion
14. Negotiation
15. Instructing
16. Service Orientation

**Technical Skills:**
17. Programming (general)
18. Data Analysis
19. Web Development
20. Database Management
21. Cloud Computing
22. Cybersecurity
23. UI/UX Design
24. Digital Marketing
25. SEO/SEM
26. Graphic Design
27. Video Editing
28. 3D Modeling
29. CAD Software
30. Statistical Analysis

**Problem-Solving:**
31. Complex Problem Solving
32. Troubleshooting
33. Systems Analysis
34. Systems Evaluation
35. Judgment and Decision Making

**Resource Management:**
36. Time Management
37. Management of Financial Resources
38. Management of Material Resources
39. Management of Personnel Resources

**Popular/Emerging (User-Requested):**
40. Prompt Engineering
41. Project Management (Agile/Scrum)
42. Content Creation
43. Social Media Management
44. Copywriting
45. Public Speaking
46. Emotional Intelligence
47. Leadership
48. Team Building
49. Conflict Resolution
50. Strategic Planning

[...50 more skills covering diverse domains]

***

### Appendix C: Competitive Analysis

| Feature | SkillTree | LinkedIn | PathSource | Pymetrics | Habitica |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **Personality Assessment** | RIASEC + Big Five | No | Yes (interests) | Yes (games) | No |
| **Skills Inventory** | Yes (rated 1-10) | Yes (binary) | No | No | No |
| **Career Matching** | AI-powered | Job search | Limited | Job matching | No |
| **Skill Tree Visualization** | Yes (Phase 2) | No | No | No | No |
| **Parenting Module** | Yes (Phase 2) | No | No | No | No |
| **Gamification** | RPG framework | Badges | Minimal | Game-based | Full RPG |
| **Learning Paths** | Yes | LinkedIn Learning | No | No | No |
| **Community Pathways** | Yes (Phase 2) | Limited | No | No | Guilds |
| **Marketplace** | Yes (Phase 3) | Jobs board | No | No | No |
| **Pricing** | Free + Premium | Free + Premium | Free | B2B only | Free + Premium |

**Competitive Advantages:**

1. Only tool combining personality + skills + career + parenting in one platform
2. Visual skill tree (proprietary, patent-pending)
3. Community-driven career pathways (network effects)
4. RPG mental model (unique positioning)
5. Qualitative anchors (scientifically validated approach)

***

### Appendix D: Research Citations

1. Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments (3rd ed.). Psychological Assessment Resources.
2. U.S. Department of Labor, Employment and Training Administration. (2023). O*NET Online. Retrieved from https://www.onetonline.org/
3. Costa, P. T., \& McCrae, R. R. (1992). Revised NEO Personality Inventory (NEO-PI-R) and NEO Five-Factor Inventory (NEO-FFI) professional manual. Psychological Assessment Resources.
4. Dunning, D., \& Kruger, J. (1999). Unskilled and unaware of it: How difficulties in recognizing one's own incompetence lead to inflated self-assessments. Journal of Personality and Social Psychology, 77(6), 1121–1134.
5. Baddeley, A. (2000). The episodic buffer: A new component of working memory? Trends in Cognitive Sciences, 4(11), 417-423.
6. Duckworth, A. L., Peterson, C., Matthews, M. D., \& Kelly, D. R. (2007). Grit: Perseverance and passion for long-term goals. Journal of Personality and Social Psychology, 92(6), 1087–1101.
7. Dweck, C. S. (2006). Mindset: The new psychology of success. Random House.
8. Goleman, D. (1995). Emotional intelligence. Bantam Books.
9. Ryan, R. M., \& Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist, 55(1), 68-78.

***

## 12. Next Steps \& Action Items

### Immediate (Next 2 Weeks):

- [ ] **Secure domain \& social handles** (skilltree.io, @skilltree)
- [ ] **Set up project infrastructure** (GitHub org, Vercel, AWS accounts)
- [ ] **Design mockups** (Figma): Onboarding flow, Dashboard, Skills Inventory
- [ ] **O*NET data import** (download latest database, transform to PostgreSQL schema)
- [ ] **RIASEC assessment content** (finalize 48 questions, scoring algorithm)


### Short-Term (Weeks 3-8):

- [ ] **Frontend scaffold** (Next.js app, UI component library)
- [ ] **Authentication** (Clerk integration, user registration flow)
- [ ] **Assessment engine** (RIASEC + Big Five implementation)
- [ ] **Skills database** (seed initial 100 skills with anchors)
- [ ] **Basic skill inventory** (add, rate, view features)


### Pre-Launch (Weeks 9-12):

- [ ] **Career matching algorithm** (implement + test on sample profiles)
- [ ] **Dashboard \& visualizations** (charts for skills \& RIASEC)
- [ ] **PDF export** (skills resume generation)
- [ ] **Beta testing** (recruit 50 users, gather feedback)
- [ ] **Landing page** (marketing copy, waitlist, Product Hunt prep)


### Launch \& Iterate (Months 4-6):

- [ ] **Product Hunt launch** (coordinate with beta users for upvotes)
- [ ] **Content marketing** (publish 10+ SEO-optimized blog posts)
- [ ] **User interviews** (qualitative feedback on value prop)
- [ ] **Analytics implementation** (PostHog events, funnels)
- [ ] **Premium tier** (payment infrastructure, feature gates)
- [ ] **Iterate based on data** (improve low-performing funnels)

***

**Document End**

***

## Sign-Off

**Prepared By:** Product Team
**Reviewed By:** [Stakeholder names]
**Approved By:** [Decision maker]
**Date:** November 20, 2025

**Version History:**

- v1.0 (2025-11-20): Initial PRD draft
- v1.1 (TBD): Post-stakeholder review updates

***

**Questions or feedback?** Contact: product@skilltree.io

