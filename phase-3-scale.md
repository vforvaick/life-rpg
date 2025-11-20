# Phase 3: Scale & Monetization

**Duration:** Months 13-24 (12 months)  
**Goal:** Enterprise revenue, marketplace liquidity, platform scale  
**Team:** 10-12 engineers  

---

## Phase Overview

### Core Goals
1. **Marketplace** - Direct monetization via skill-based matching
2. **Enterprise** - B2B revenue from corporate talent development
3. **Scale** - Infrastructure for 200K+ users
4. **Ecosystem** - API partnerships and integrations

### Key Features
1. ✅ Marketplace (services listing, transactions)
2. ✅ Enterprise Features (SSO, admin dashboard, white-label)
3. ✅ API Platform (public API for partners)
4. ✅ Advanced Analytics (skill trends, insights)
5. ✅ Mobile App (React Native)

### Success Metrics
- **200,000** registered users
- **$500K** ARR (Annual Recurring Revenue)
- **1,000** marketplace transactions/month
- **5** enterprise pilots
- **10** API partners

---

## Implementation Phases

### Phase 3A: Marketplace (Months 13-16)
**Goal:** Enable users to monetize their skills

---

### Phase 3B: Enterprise (Months 17-20)
**Goal:** B2B revenue stream

---

### Phase 3C: Platform & Scale (Months 21-24)
**Goal:** API partnerships and mobile app

---

## Phase 3A: Marketplace (Months 13-16)

### Feature Overview

**Value Proposition:**
> "Turn your skills into income - connect with opportunities"

**Two-Sided Marketplace:**
- **Service Providers:** Users offering services based on skills
- **Clients:** Individuals/companies seeking skilled professionals

**Use Cases:**
- Freelancer finds gig matching skill profile
- Company posts project, gets AI-matched candidates
- User builds reputation through completed transactions

---

### Technical Architecture

#### Database Schema

```prisma
// Add to schema.prisma

model Service {
  id          String   @id @default(uuid())
  providerId  String
  title       String
  description String
  category    String
  skillIds    String[] // Required skills
  rate        Int      // Per hour in cents
  rateType    String   // 'hourly', 'fixed', 'negotiable'
  availability String  // 'available', 'busy', 'unavailable'
  createdAt   DateTime @default(now())
  
  provider     User          @relation(fields: [providerId], references: [id])
  transactions Transaction[]
}

model Project {
  id          String   @id @default(uuid())
  clientId    String
  title       String
  description String
  budget      Int      // In cents
  budgetType  String   // 'fixed', 'hourly'
  requiredSkills Json  // [{skillId, level}]
  status      String   @default('open') // 'open', 'in_progress', 'completed', 'cancelled'
  deadline    DateTime?
  createdAt   DateTime @default(now())
  
  client       User          @relation(fields: [clientId], references: [id])
  applications Application[]
  transaction  Transaction?
}

model Application {
  id         String   @id @default(uuid())
  projectId  String
  providerId String
  coverLetter String
  proposedRate Int
  status     String   @default('pending') // 'pending', 'accepted', 'rejected'
  createdAt  DateTime @default(now())
  
  project  Project @relation(fields: [projectId], references: [id])
  provider User    @relation(fields: [providerId], references: [id])
}

model Transaction {
  id          String   @id @default(uuid())
  projectId   String   @unique
  providerId  String
  clientId    String
  amount      Int      // In cents
  platformFee Int      // 15% of amount
  status      String   @default('pending') // 'pending', 'processing', 'completed', 'disputed', 'refunded'
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  project  Project @relation(fields: [projectId], references: [id])
  provider User    @relation("ProviderTransactions", fields: [providerId], references: [id])
  client   User    @relation("ClientTransactions", fields: [clientId], references: [id])
  reviews  Review[]
}

model Review {
  id            String   @id @default(uuid())
  transactionId String
  reviewerId    String   // Can be client or provider
  revieweeId    String
  rating        Int      // 1-5 stars
  comment       String?
  createdAt     DateTime @default(now())
  
  transaction Transaction @relation(fields: [transactionId], references: [id])
  reviewer    User        @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  reviewee    User        @relation("ReviewsReceived", fields: [revieweeId], references: [id])
}
```

---

### Implementation Tasks

#### Task 3A.1: Service Listing Creation
**Owner:** Full-Stack Engineer  
**Effort:** 2 weeks

**UI:**
```tsx
// app/(marketplace)/services/new/page.tsx
export default function NewServicePage() {
  const { data: userSkills } = useUserSkills();
  const createService = useCreateService();
  
  return (
    <form onSubmit={handleSubmit}>
      <Input name="title" label="Service Title" placeholder="E.g., Website Design & Development" />
      
      <Textarea name="description" label="Description" rows={5} placeholder="Describe what you offer..." />
      
      <Select name="category" label="Category">
        <option value="design">Design</option>
        <option value="development">Development</option>
        <option value="writing">Writing</option>
        <option value="consulting">Consulting</option>
      </Select>
      
      <MultiSelect name="skillIds" label="Required Skills" options={userSkills} />
      
      <div className="flex gap-4">
        <Input type="number" name="rate" label="Rate" />
        <Select name="rateType">
          <option value="hourly">Per Hour</option>
          <option value="fixed">Fixed Price</option>
          <option value="negotiable">Negotiable</option>
        </Select>
      </div>
      
      <Button type="submit">Create Service</Button>
    </form>
  );
}
```

**API:**
```typescript
// POST /api/marketplace/services
app.post('/api/marketplace/services', requireAuth, async (req, res) => {
  const { title, description, category, skillIds, rate, rateType } = req.body;
  const providerId = req.auth.userId;
  
  // Validation
  if (!skillIds || skillIds.length === 0) {
    return res.status(400).json({ error: 'At least one skill required' });
  }
  
  const service = await prisma.service.create({
    data: {
      providerId,
      title,
      description,
      category,
      skillIds,
      rate,
      rateType,
      availability: 'available'
    }
  });
  
  res.json({ service });
});
```

**Acceptance Criteria:**
- [ ] User can create service listing
- [ ] Skills validated against user's profile
- [ ] Listing appears in marketplace

---

#### Task 3A.2: Project Posting & Matching
**Owner:** Backend Engineer  
**Effort:** 3 weeks

**Matching Algorithm:**
```typescript
// api/utils/marketplaceMatching.ts
interface ProjectMatch {
  provider: User;
  service: Service;
  fitScore: number; // 0-100
  skillMatch: number;
  reputationScore: number;
  availability: boolean;
}

export async function matchProvidersToProject(projectId: string): Promise<ProjectMatch[]> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { requiredSkills: true }
  });
  
  if (!project) throw new Error('Project not found');
  
  // Get all services that match category
  const services = await prisma.service.findMany({
    where: {
      category: project.category,
      availability: 'available'
    },
    include: {
      provider: {
        include: {
          userSkills: { include: { skill: true } },
          reviewsReceived: true
        }
      }
    }
  });
  
  // Score each provider
  const matches = services.map(service => {
    const provider = service.provider;
    
    // Skill match (70% weight)
    const skillScore = calculateSkillMatch(
      provider.userSkills,
      project.requiredSkills
    );
    
    // Reputation (20% weight)
    const avgRating = calculateAverageRating(provider.reviewsReceived);
    const reputationScore = avgRating / 5;
    
    // Availability (10% weight)
    const availScore = service.availability === 'available' ? 1 : 0;
    
    // Weighted fit score
    const fitScore = (0.7 * skillScore + 0.2 * reputationScore + 0.1 * availScore) * 100;
    
    return {
      provider,
      service,
      fitScore: Math.round(fitScore),
      skillMatch: skillScore,
      reputationScore,
      availability: service.availability === 'available'
    };
  });
  
  // Sort by fit score
  return matches.sort((a, b) => b.fitScore - a.fitScore);
}
```

**API:**
```typescript
// POST /api/marketplace/projects
app.post('/api/marketplace/projects', requireAuth, async (req, res) => {
  const { title, description, budget, budgetType, requiredSkills, deadline } = req.body;
  const clientId = req.auth.userId;
  
  const project = await prisma.project.create({
    data: {
      clientId,
      title,
      description,
      budget,
      budgetType,
      requiredSkills,
      deadline: deadline ? new Date(deadline) : null
    }
  });
  
  // Find matches
  const matches = await matchProvidersToProject(project.id);
  
  res.json({ project, matches: matches.slice(0, 10) });
});
```

**Acceptance Criteria:**
- [ ] Project posting creates entry
- [ ] Returns top 10 matched providers
- [ ] Matching considers skills + reputation

---

#### Task 3A.3: Application & Messaging
**Owner:** Full-Stack Engineer  
**Effort:** 2 weeks

**Application Flow:**
```
Provider sees project → Apply with cover letter → Client reviews → Accept/Reject
```

**Messaging System:**
```typescript
// Real-time messaging (WebSocket or Pusher)
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!
});

// POST /api/marketplace/messages
app.post('/api/marketplace/messages', requireAuth, async (req, res) => {
  const { recipientId, content, projectId } = req.body;
  const senderId = req.auth.userId;
  
  const message = await prisma.message.create({
    data: {
      senderId,
      recipientId,
      content,
      projectId
    }
  });
  
  // Trigger real-time event
  pusher.trigger(`user-${recipientId}`, 'new-message', {
    message
  });
  
  res.json({ message });
});
```

**Acceptance Criteria:**
- [ ] Provider can apply to projects
- [ ] Client can accept/reject applications
- [ ] Real-time messaging works

---

#### Task 3A.4: Payment Processing
**Owner:** Backend Engineer  
**Effort:** 3 weeks

**Escrow System:**
1. Client pays upfront → Stripe holds funds
2. Work completed → Client approves
3. Funds released to provider (minus 15% platform fee)

**Implementation:**
```typescript
// POST /api/marketplace/transactions
app.post('/api/marketplace/transactions', requireAuth, async (req, res) => {
  const { projectId, providerId, amount } = req.body;
  const clientId = req.auth.userId;
  
  // Create Stripe PaymentIntent (escrow)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // in cents
    currency: 'usd',
    metadata: {
      projectId,
      providerId,
      clientId
    },
    transfer_data: {
      destination: providerStripeAccountId // Connected account
    },
    application_fee_amount: Math.round(amount * 0.15) // 15% platform fee
  });
  
  // Create transaction record
  const transaction = await prisma.transaction.create({
    data: {
      projectId,
      providerId,
      clientId,
      amount,
      platformFee: Math.round(amount * 0.15),
      status: 'pending'
    }
  });
  
  res.json({ transaction, clientSecret: paymentIntent.client_secret });
});

// POST /api/marketplace/transactions/:id/complete
app.post('/api/marketplace/transactions/:id/complete', requireAuth, async (req, res) => {
  const { id } = req.params;
  const clientId = req.auth.userId;
  
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  
  if (transaction.clientId !== clientId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Confirm payment (release funds)
  await stripe.paymentIntents.confirm(transaction.stripePaymentIntentId);
  
  // Update transaction
  await prisma.transaction.update({
    where: { id },
    data: {
      status: 'completed',
      completedAt: new Date()
    }
  });
  
  res.json({ success: true });
});
```

**Acceptance Criteria:**
- [ ] Client pays into escrow
- [ ] Funds held until work approved
- [ ] Platform fee (15%) deducted
- [ ] Dispute resolution flow

---

#### Task 3A.5: Review & Reputation System
**Owner:** Full-Stack Engineer  
**Effort:** 1 week

**Review Flow:**
After transaction completes → Both parties can leave reviews

**Implementation:**
```typescript
// POST /api/marketplace/reviews
app.post('/api/marketplace/reviews', requireAuth, async (req, res) => {
  const { transactionId, revieweeId, rating, comment } = req.body;
  const reviewerId = req.auth.userId;
  
  // Validate: user was part of transaction
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId }
  });
  
  if (![transaction.clientId, transaction.providerId].includes(reviewerId)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const review = await prisma.review.create({
    data: {
      transactionId,
      reviewerId,
      revieweeId,
      rating,
      comment
    }
  });
  
  res.json({ review });
});

// Calculate reputation score
function calculateReputationScore(userId: string): number {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId }
  });
  
  if (reviews.length === 0) return 0;
  
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalTransactions = reviews.length;
  
  // Weighted score (more transactions = more trust)
  const score = avgRating * Math.min(totalTransactions / 10, 1);
  
  return Math.round(score * 100) / 100;
}
```

**Acceptance Criteria:**
- [ ] Both parties can review after completion
- [ ] Reputation score calculated
- [ ] Reviews display on profiles

---

## Phase 3B: Enterprise (Months 17-20)

### Feature Overview

**Target Customers:**
- Mid-large companies (500+ employees)
- HR departments wanting talent development
- Internal skill mapping and career pathing

**Value Proposition:**
> "Map your workforce skills, identify gaps, and develop talent"

---

### Implementation Tasks

#### Task 3B.1: SSO Integration
**Owner:** Backend Engineer  
**Effort:** 2 weeks

**SAML 2.0 Support:**
```bash
npm install passport-saml
```

**Implementation:**
```typescript
// api/auth/saml.ts
import { Strategy as SamlStrategy } from 'passport-saml';

passport.use(new SamlStrategy(
  {
    entryPoint: process.env.SAML_ENTRY_POINT,
    issuer: process.env.SAML_ISSUER,
    cert: process.env.SAML_CERT
  },
  async (profile, done) => {
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: profile.email }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.displayName,
          organizationId: profile.organizationId
        }
      });
    }
    
    done(null, user);
  }
));
```

**Acceptance Criteria:**
- [ ] SAML authentication works
- [ ] Auto-provisions users from SSO
- [ ] Org-level user management

---

#### Task 3B.2: Admin Dashboard
**Owner:** Frontend Engineer  
**Effort:** 3 weeks

**Features:**
- View all employees' skill profiles
- Identify skill gaps at org level
- Generate reports
- Manage licenses

**UI:**
```tsx
// app/(enterprise)/admin/page.tsx
export default function AdminDashboard() {
  const { data: org } = useOrganization();
  const { data: employees } = useEmployees();
  
  return (
    <div>
      <h1>{org.name} - Admin Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Employees" value={employees.length} />
        <StatCard title="Avg Skills per Employee" value={calculateAvgSkills(employees)} />
        <StatCard title="Skill Coverage" value={`${calculateCoverage(employees)}%`} />
      </div>
      
      <Tabs>
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="skills">Skills Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <EmployeesList employees={employees} />
        </TabsContent>
        
        <TabsContent value="skills">
          <SkillsHeatmap employees={employees} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Admin can view all employees
- [ ] Skill gap analysis visible
- [ ] Export reports (CSV, PDF)

---

## Phase 3C: Platform & Scale (Months 21-24)

#### Task 3C.1: Public API
**Owner:** Backend Engineer  
**Effort:** 4 weeks

**API Endpoints:**
```typescript
// GET /api/v1/skills
// GET /api/v1/occupations
// POST /api/v1/assessments
// GET /api/v1/career-matches
```

**Rate Limiting:**
```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/v1/', apiLimiter);
```

**Acceptance Criteria:**
- [ ] API docs (OpenAPI spec)
- [ ] API keys for partners
- [ ] Rate limiting per tier

---

#### Task 3C.2: Mobile App
**Owner:** Mobile Engineers (2)  
**Effort:** 3 months

**Tech Stack:** React Native + Expo

**Features (v1):**
- Authentication
- RIASEC assessment (mobile-optimized)
- Skills inventory (add/edit)
- Career matches (browsing)
- Notifications

**Acceptance Criteria:**
- [ ] iOS and Android apps
- [ ] Published to App Store / Play Store
- [ ] Feature parity with web (core features)

---

## Phase 3 Success Metrics

**Target by Month 24:**
- ✅ 200,000 registered users
- ✅ $500K ARR
  - Premium: $300K (3,000 subscribers × $100/year)
  - Marketplace fees: $150K (10,000 transactions × $50 avg × 15%)
  - Enterprise: $50K (2-3 contracts)
- ✅ 1,000 marketplace transactions/month
- ✅ 5 enterprise pilots
- ✅ 10 API partners
- ✅ <2% churn rate

**If targets not met:**
- Revisit pricing strategy
- Increase sales team
- Adjust marketplace incentives

---

## Post-Phase 3: What's Next?

**Phase 4 Candidates (Months 25+):**
1. **International Expansion** - Localize to 5 languages
2. **AI Coaching** - LLM-powered career advisor
3. **Certifications** - Skill verification system
4. **Team Features** - Organizational skill mapping
5. **Integrations** - LinkedIn, Coursera, Udemy APIs

---

**End of Implementation Plans**

---

**Questions?** Contact: cto@skilltree.io