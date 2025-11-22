# Phase 2: Growth Features

**Duration:** Months 5-12 (8 months)  
**Goal:** Differentiation, engagement drivers, and community features  
**Team:** 6-8 engineers  

---

## Phase Overview

### Core Goals
1. **Differentiate** from competitors with skill tree visualization
2. **Engage** users beyond initial discovery (parenting module)
3. **Community** value through user-generated content
4. **Monetize** via premium tier

### Key Features
1. ✅ Interactive Skill Tree Visualization (Neo4j graph)
2. ✅ Parenting Module (child development tracking)
3. ✅ User-Generated Skills & Pathways
4. ✅ Learning Path Recommendations
5. ✅ Premium Tier (freemium conversion)

### Success Metrics
- **50,000** registered users
- **15%** parenting module adoption
- **500+** user-generated skills submitted
- **5%** premium conversion rate
- **40%** MAU rate

---

## Implementation Phases

### Phase 2A: Skill Tree Visualization (Months 5-6)
**Goal:** Launch interactive graph visualization

---

### Phase 2B: Parenting Module (Months 7-9)
**Goal:** Attract parent persona, new user segment

---

### Phase 2C: Community Features (Months 10-12)
**Goal:** User-generated content creates network effects

---

## Phase 2A: Skill Tree (Months 5-6)

### Feature Overview

**Value Proposition:**
> "See the path from your current skills to your dream career"

**User Stories:**
- As a user, I want to see which skills unlock other skills
- As a user, I can visualize paths from my skills to target careers
- As a user, I want to explore common skill combinations

---

### Technical Architecture

#### Neo4j Graph Database Setup

**Installation:**
```yaml
# docker-compose.yml (add to existing)
services:
  neo4j:
    image: neo4j:5-community
    ports:
      - "7474:7474" # HTTP
      - "7687:7687" # Bolt
    environment:
      NEO4J_AUTH: neo4j/devpassword
    volumes:
      - neo4j_data:/data
```

**Schema:**
```cypher
// Nodes
CREATE (s:Skill {
  id: 'uuid',
  name: 'Programming',
  category: 'Technical',
  difficulty: 'intermediate',
  timeToLearnHours: 200
});

CREATE (o:Occupation {
  id: 'uuid',
  title: 'Software Engineer',
  riasec: 'IRA',
  salaryMedian: 120000
});

// Relationships
CREATE (python:Skill {name: 'Python'})-[:PREREQUISITE_OF {strength: 0.8}]->(dataAnalysis:Skill {name: 'Data Analysis'});

CREATE (excel:Skill {name: 'Excel'})-[:SYNERGIZES_WITH {multiplier: 1.5}]->(sql:Skill {name: 'SQL'});

CREATE (react:Skill {name: 'React'})-[:ENABLES {importance: 90, requiredLevel: 7}]->(frontend:Occupation {title: 'Frontend Developer'});
```

---

### Implementation Tasks

#### Task 2A.1: Graph Database Integration
**Owner:** Backend Engineer  
**Effort:** 2 weeks

**Actions:**
- [ ] Setup Neo4j service
- [ ] Install Neo4j driver:
  ```bash
  npm install neo4j-driver
  ```
- [ ] Create connection utility:
  ```typescript
  // lib/neo4j.ts
  import neo4j from 'neo4j-driver';
  
  const driver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
  );
  
  export async function runQuery(query: string, params: any = {}) {
    const session = driver.session();
    try {
      const result = await session.run(query, params);
      return result.records;
    } finally {
      await session.close();
    }
  }
  ```
- [ ] Migrate existing skills to Neo4j:
  ```typescript
  // scripts/migrate-to-neo4j.ts
  import { PrismaClient } from '@prisma/client';
  import { runQuery } from '../lib/neo4j';
  
  const prisma = new PrismaClient();
  
  async function migrate() {
    const skills = await prisma.skill.findMany();
    
    for (const skill of skills) {
      await runQuery(
        `CREATE (s:Skill {
          id: $id,
          name: $name,
          category: $category,
          difficulty: $difficulty
        })`,
        {
          id: skill.id,
          name: skill.name,
          category: skill.category,
          difficulty: 'intermediate' // default
        }
      );
    }
  }
  ```

**Acceptance Criteria:**
- [ ] Neo4j running and accessible
- [ ] All skills migrated to graph
- [ ] Can query skills via Cypher

---

#### Task 2A.2: Define Skill Relationships
**Owner:** Product + Backend  
**Effort:** 2 weeks

**Relationship Types:**

**1. Prerequisites** (skill A → skill B)
- Python → Data Analysis
- HTML/CSS → React
- Basic Math → Statistics

**2. Synergies** (skill A ↔ skill B)
- Design ↔ Writing (content creation)
- SQL ↔ Excel (data analysis)
- Communication ↔ Leadership

**3. Enables** (skill → occupation)
- React → Frontend Developer (90 importance, level 7)
- Python → Data Scientist (95 importance, level 8)

**Data Entry:**
```typescript
// scripts/add-relationships.ts
const relationships = [
  {
    from: 'Python',
    to: 'Data Analysis',
    type: 'PREREQUISITE_OF',
    strength: 0.8
  },
  {
    from: 'Design',
    to: 'Writing',
    type: 'SYNERGIZES_WITH',
    multiplier: 1.5
  },
  {
    from: 'React',
    to: 'Frontend Developer',
    type: 'ENABLES',
    importance: 90,
    requiredLevel: 7
  }
];

async function addRelationships() {
  for (const rel of relationships) {
    const fromSkill = await findSkillByName(rel.from);
    const toNode = rel.type === 'ENABLES' 
      ? await findOccupationByTitle(rel.to)
      : await findSkillByName(rel.to);
    
    await runQuery(
      `MATCH (a {id: $fromId}), (b {id: $toId})
       CREATE (a)-[r:${rel.type} $props]->(b)`,
      {
        fromId: fromSkill.id,
        toId: toNode.id,
        props: rel
      }
    );
  }
}
```

**Acceptance Criteria:**
- [ ] 50+ prerequisite relationships defined
- [ ] 30+ synergy relationships defined
- [ ] All occupations have ENABLES relationships

---

#### Task 2A.3: Path Finding Algorithm
**Owner:** Backend Engineer  
**Effort:** 1 week

**API Endpoint:**
```typescript
// GET /api/skill-tree/path?from=skillId&to=occupationId
app.get('/api/skill-tree/path', requireAuth, async (req, res) => {
  const { from, to } = req.query;
  
  const path = await runQuery(
    `MATCH path = shortestPath(
      (start:Skill {id: $from})-[:PREREQUISITE_OF|ENABLES*..5]->(end:Occupation {id: $to})
    )
    RETURN path`,
    { from, to }
  );
  
  res.json({ path });
});
```

**Acceptance Criteria:**
- [ ] Finds shortest path between skill and occupation
- [ ] Returns sequence of skills to learn
- [ ] <1s response time

---

#### Task 2A.4: Frontend Visualization
**Owner:** Frontend Engineer  
**Effort:** 3 weeks

**Library:** Cytoscape.js

**Installation:**
```bash
npm install cytoscape react-cytoscapejs
```

**Component:**
```tsx
// components/SkillTreeGraph.tsx
'use client';

import CytoscapeComponent from 'react-cytoscapejs';
import { useEffect, useState } from 'react';

interface Props {
  userId: string;
}

export function SkillTreeGraph({ userId }: Props) {
  const [elements, setElements] = useState([]);
  
  useEffect(() => {
    fetchGraphData(userId).then(data => {
      // Convert to Cytoscape format
      const nodes = data.nodes.map(n => ({
        data: {
          id: n.id,
          label: n.name,
          category: n.category,
          owned: n.owned // user has this skill
        }
      }));
      
      const edges = data.edges.map(e => ({
        data: {
          source: e.from,
          target: e.to,
          label: e.type
        }
      }));
      
      setElements([...nodes, ...edges]);
    });
  }, [userId]);
  
  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': (ele) => ele.data('owned') ? '#22c55e' : '#cbd5e1',
        'label': 'data(label)',
        'color': '#fff',
        'text-outline-color': '#000',
        'text-outline-width': 2
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#94a3b8',
        'target-arrow-color': '#94a3b8',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    },
    {
      selector: 'edge[label="PREREQUISITE_OF"]',
      style: {
        'line-style': 'solid',
        'line-color': '#3b82f6'
      }
    },
    {
      selector: 'edge[label="SYNERGIZES_WITH"]',
      style: {
        'line-style': 'dashed',
        'line-color': '#8b5cf6'
      }
    }
  ];
  
  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={stylesheet}
      layout={{ name: 'cose' }} // force-directed
      style={{ width: '100%', height: '600px' }}
    />
  );
}
```

**Acceptance Criteria:**
- [ ] Graph renders with skills as nodes
- [ ] User's owned skills highlighted green
- [ ] Can zoom and pan
- [ ] Click node shows details panel
- [ ] Mobile: switch to hierarchical list view

---

## Phase 2B: Parenting Module (Months 7-9)

### Feature Overview

**Value Proposition:**
> "Track your child's development and discover their emerging strengths"

**Target Persona:**
- Parents of children 0-18 years
- Want guidance on skill development
- Curious about child's natural inclinations

---

### Implementation Tasks

#### Task 2B.1: Child Profile Management
**Owner:** Full-Stack Engineer  
**Effort:** 2 weeks

**Database Schema:**
```prisma
// Add to schema.prisma
model ChildProfile {
  id          String   @id @default(uuid())
  parentId    String   // User ID
  name        String
  dateOfBirth DateTime
  relationship String  // 'son', 'daughter', 'mentee'
  avatarUrl   String?
  createdAt   DateTime @default(now())
  
  parent      User            @relation(fields: [parentId], references: [id])
  assessments ChildAssessment[]
  skills      ChildSkill[]
}

model ChildAssessment {
  id          String   @id @default(uuid())
  childId     String
  type        String   // 'milestone', 'riasec'
  ageAtTime   Int      // months
  responses   Json
  results     Json
  completedAt DateTime @default(now())
  
  child ChildProfile @relation(fields: [childId], references: [id])
}

model ChildSkill {
  id         String   @id @default(uuid())
  childId    String
  skillId    String
  rating     Int      // 1-10
  observedAt DateTime @default(now())
  notes      String?
  
  child ChildProfile @relation(fields: [childId], references: [id])
  skill Skill        @relation(fields: [skillId], references: [id])
}
```

**UI:**
```tsx
// app/(dashboard)/parenting/page.tsx
export default function ParentingPage() {
  const { data: children } = useChildProfiles();
  
  return (
    <div>
      <h1>Parenting Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {children?.map(child => (
          <ChildCard key={child.id} child={child} />
        ))}
        
        <AddChildCard />
      </div>
    </div>
  );
}

function ChildCard({ child }: { child: ChildProfile }) {
  const age = calculateAge(child.dateOfBirth);
  
  return (
    <Card>
      <CardHeader>
        <Avatar src={child.avatarUrl} />
        <h3>{child.name}</h3>
        <p>{age} years old</p>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href={`/parenting/${child.id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Acceptance Criteria:**
- [ ] Parent can add multiple children
- [ ] Each child has separate profile
- [ ] Age calculated dynamically

---

#### Task 2B.2: Age-Appropriate Assessments
**Owner:** Full-Stack Engineer  
**Effort:** 3 weeks

**Assessment Types by Age:**

**0-2 years:** Developmental Milestones (WHO standards)
- Motor skills (sitting, walking, running)
- Language (babbling, first words)
- Social (smiling, responding to name)

**3-5 years:** Play-Based Observations
- "Does your child enjoy building with blocks?" → Spatial skills
- "Does your child make up stories?" → Creativity

**6-12 years:** Simplified RIASEC (visual cards)
- Show pictures of activities
- Child picks favorites

**13-18 years:** Full RIASEC + Skills Inventory

**Implementation:**
```typescript
// components/ChildAssessment.tsx
interface Props {
  child: ChildProfile;
}

export function ChildAssessment({ child }: Props) {
  const age = calculateAge(child.dateOfBirth);
  
  // Route to appropriate assessment
  if (age < 3) return <MilestoneTracker child={child} />;
  if (age < 6) return <PlayBasedAssessment child={child} />;
  if (age < 13) return <VisualRIASEC child={child} />;
  return <FullAssessment child={child} />;
}
```

**Acceptance Criteria:**
- [ ] Assessment adapts to child's age
- [ ] Parents can track milestones over time
- [ ] Results show developmental trajectory

---

#### Task 2B.3: Activity Recommendations
**Owner:** Backend Engineer  
**Effort:** 2 weeks

**Recommendation Engine:**
```typescript
// api/utils/activityRecommendations.ts
interface Activity {
  id: string;
  name: string;
  description: string;
  ageRange: [number, number]; // min, max in years
  targetSkills: string[]; // skill IDs
  riasecAlignment: string; // e.g., "IRA"
}

const activities: Activity[] = [
  {
    id: '1',
    name: 'Robotics Kit',
    description: 'Build and program simple robots',
    ageRange: [8, 14],
    targetSkills: ['programming', 'problem-solving'],
    riasecAlignment: 'IR'
  },
  {
    id: '2',
    name: 'Art Class',
    description: 'Painting, drawing, sculpture',
    ageRange: [5, 18],
    targetSkills: ['creativity', 'visual-design'],
    riasecAlignment: 'A'
  }
  // ... more activities
];

export function recommendActivities(child: ChildProfile): Activity[] {
  const age = calculateAge(child.dateOfBirth);
  const riasec = child.latestAssessment?.results.code || '';
  
  return activities.filter(activity => {
    // Age-appropriate
    if (age < activity.ageRange[0] || age > activity.ageRange[1]) return false;
    
    // RIASEC alignment
    const overlap = [...riasec].filter(char => activity.riasecAlignment.includes(char)).length;
    return overlap >= 1;
  });
}
```

**Acceptance Criteria:**
- [ ] Recommends 5-10 activities per child
- [ ] Activities match child's RIASEC profile
- [ ] Age-appropriate filtering

---

## Phase 2C: Community Features (Months 10-12)

### User-Generated Skills

#### Task 2C.1: Skill Proposal System
**Owner:** Full-Stack Engineer  
**Effort:** 2 weeks

**Flow:**
```
User → "Suggest Skill" Form → Admin Queue → Approved → Added to Taxonomy
```

**Database:**
```prisma
model ProposedSkill {
  id          String   @id @default(uuid())
  name        String
  category    String
  description String
  anchors     Json
  rationale   String   // Why needed
  proposedBy  String
  status      String   @default('pending') // 'pending', 'approved', 'rejected'
  votes       Int      @default(0)
  createdAt   DateTime @default(now())
  
  proposer User @relation(fields: [proposedBy], references: [id])
}
```

**Acceptance Criteria:**
- [ ] Users can submit new skills
- [ ] Voting system for proposals
- [ ] Admin can approve/reject

---

#### Task 2C.2: Career Pathways Sharing
**Owner:** Full-Stack Engineer  
**Effort:** 3 weeks

**Feature:**
Users share their career transition stories:
- From: "Teacher" (skills at start)
- To: "UX Designer" (skills now)
- Skills learned in between
- Time taken
- Resources used

**Schema:**
```prisma
model CareerPathway {
  id              String   @id @default(uuid())
  createdBy       String
  fromOccupation  String
  toOccupation    String
  skillsLearned   String[] // skill IDs in order
  durationMonths  Int
  resources       Json     // [{name, url, type}]
  description     String
  upvotes         Int      @default(0)
  createdAt       DateTime @default(now())
  
  creator User @relation(fields: [createdBy], references: [id])
}
```

**Acceptance Criteria:**
- [ ] Users can create pathway templates
- [ ] Browse pathways by origin/destination
- [ ] "120 users followed this path" metric

---

### Premium Tier Launch

#### Task 2C.3: Freemium Paywalls
**Owner:** Backend Engineer  
**Effort:** 1 week

**Free Tier Limits:**
- 50 skills max
- Top 5 career matches only
- 1 PDF export per month

**Premium Benefits:**
- Unlimited skills
- All career matches
- Skill tree visualization
- Unlimited exports
- Parenting module

**Implementation:**
```typescript
// middleware/checkPremium.ts
export async function requirePremium(req, res, next) {
  const user = await prisma.user.findUnique({
    where: { id: req.auth.userId }
  });
  
  if (user.subscriptionTier === 'premium') {
    return next();
  }
  
  res.status(403).json({
    error: 'Premium feature',
    upgradeUrl: '/pricing'
  });
}

// Apply to endpoints
app.get('/api/skill-tree', requirePremium, async (req, res) => {
  // ... skill tree logic
});
```

**Acceptance Criteria:**
- [ ] Free users see upgrade prompts
- [ ] Premium features gated correctly
- [ ] Upgrade flow tested

---

#### Task 2C.4: Stripe Integration
**Owner:** Backend Engineer  
**Effort:** 2 weeks

**Setup:**
```bash
npm install stripe
```

**Implementation:**
```typescript
// api/payments/checkout.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post('/api/payments/checkout', requireAuth, async (req, res) => {
  const { priceId } = req.body; // monthly or annual
  const userId = req.auth.userId;
  
  const session = await stripe.checkout.sessions.create({
    customer_email: req.auth.user.email,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.APP_URL}/pricing`,
    metadata: { userId }
  });
  
  res.json({ url: session.url });
});

// Webhook to update subscription status
app.post('/api/webhooks/stripe', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionTier: 'premium' }
    });
  }
  
  res.json({ received: true });
});
```

**Acceptance Criteria:**
- [ ] User can upgrade via Stripe Checkout
- [ ] Webhook updates subscription status
- [ ] Subscription cancellation handled

---

## Phase 2 Success Metrics

**Target by Month 12:**
- ✅ 50,000 registered users
- ✅ 40% MAU rate
- ✅ 15% parenting module adoption
- ✅ 500 user-generated skills
- ✅ 5% premium conversion
- ✅ NPS >45

**If targets not met:**
- Extend Phase 2 by 2 months
- Increase marketing spend
- Double down on engagement features

---

## Next Phase

After Phase 2 completion → **Phase 3: Scale & Monetization** (`phase-3-scale.md`)

---

**Questions?** Contact: product-manager@skilltree.io