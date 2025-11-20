# Build in Public Strategy

**Project:** SkillTree (Life RPG)
**Timeline:** 20-23 weeks (5-6 months)
**Goal:** Launch with 500-1000 waitlist signups, 50-100 early adopters
**Last Updated:** November 20, 2025

---

## Strategy Overview

**Approach:** Incremental shipping + transparent progress sharing

**Key Principles:**
1. **Ship small, ship often** - Release features as they're ready
2. **Share learnings, not just wins** - Document failures and pivots
3. **Engage, don't broadcast** - Reply to every comment/question
4. **Build in the open** - GitHub repo public, progress visible

---

## Content Pillars

**What to share:**
1. **Progress updates** (weekly) - What shipped, what's next
2. **Technical deep-dives** (bi-weekly) - How you built X feature
3. **Product decisions** (as they happen) - Why you chose Y approach
4. **User insights** (from beta testing) - What users actually need
5. **Metrics/learnings** (monthly) - What worked, what didn't

**Where to share:**
- **Primary:** Twitter/X (tech community, instant feedback)
- **Secondary:** LinkedIn (professional audience, potential enterprise)
- **Tertiary:** Dev.to / Hashnode (long-form technical content)
- **Community:** Reddit (r/SideProject, r/startups, r/careerguidance)

---

## Phase-by-Phase Content Calendar

### Phase 0: Foundation (Weeks 1-3)

**Week 1: The Announcement**

**Twitter Thread (Day 1):**
```
🧵 I'm building in public: SkillTree

A career navigation platform that helps you:
✅ Discover your skills (not just job titles)
✅ Find matching careers (RIASEC + O*NET data)
✅ See growth paths (what to learn next)

Solo dev. Part-time. Using AI to ship faster.

Let's go 🚀

1/7
```

**LinkedIn Post (Day 3):**
```
Launching a new side project: SkillTree 🌳

The problem: Most people can't answer "what are my skills?"
- We know our job titles, not our capabilities
- Career transitions feel impossible
- No clear "what should I learn next?"

I'm building an RPG-inspired tool to fix this.
Using O*NET data + personality science (RIASEC).

Solo dev journey starts now. Following along?

#BuildInPublic #CareerDevelopment
```

**Dev.to Article (Week 1 end):**
```
Title: "Why I'm Building a Career RPG (and How I'll Ship It Solo)"

Outline:
- The problem I'm solving (skills blindness)
- Tech stack decisions (Next.js + Supabase + Prisma)
- Why build in public?
- Timeline: 5-6 months to MVP
- Follow along: [Twitter] [GitHub]
```

**Milestones to share:**
- ✅ GitHub repo created (link it!)
- ✅ Tech stack finalized
- ✅ Landing page live (even if just "coming soon")

---

**Week 2: The Research Phase**

**Twitter Updates (3 tweets):**

Tweet 1 (Monday):
```
Day 5 of building SkillTree:

Just discovered O*NET has 968 occupations in their database.

That's... a lot.

MVP approach: Start with 70 curated careers.
Validate demand first, scale infrastructure later.

YAGNI in action. 💪
```

Tweet 2 (Wednesday):
```
Choosing between:
- Clerk ($25/mo after 10k users)
- Supabase Auth (free tier generous)
- NextAuth (free, more setup)

Going with Supabase.

Why? Solo dev + part-time = optimize for speed.
Can always migrate later if needed.

What would you choose? 🤔
```

Tweet 3 (Friday):
```
This week's progress on SkillTree:

✅ Supabase project setup
✅ Prisma schema designed
✅ 70 careers curated (hybrid: popular + RIASEC balanced)

Next week: RIASEC assessment implementation

GitHub: [link]
Feedback welcome! 🙏
```

**LinkedIn (Friday update):**
```
Week 1 recap - SkillTree build:

Decisions made:
• Tech stack: Next.js + Supabase + Prisma (solo-dev optimized)
• Data strategy: O*NET API for MVP, migrate to full DB in Phase 2
• 70 curated occupations (not 968) - quality over quantity

Key learning: Resist the urge to over-engineer early.

Following? Drop a comment 👇
```

---

**Week 3: Early Prototype**

**Goal:** Ship **something** people can see

**Demo Video (Twitter, 30 seconds):**
```
First look at SkillTree 👀

✅ RIASEC assessment flow (24 questions)
✅ Results visualization (hexagon chart)
❌ Career matching (next week)

Still rough, but it's alive!

Built with: Next.js + Supabase + Chart.js

Thoughts? 💭
```

**Dev.to Article:**
```
Title: "Building a RIASEC Personality Assessment in Next.js"

- What is RIASEC (Holland Codes)?
- Implementation (React Hook Form + Zustand)
- Visualization (Chart.js radar chart)
- Challenges & learnings

Code snippets + demo GIF
```

**Milestone:**
- 🎯 First feature shipped (RIASEC assessment)
- 🎯 Demo-able prototype

---

### Phase 1A: First Feature Launch (Weeks 4-8)

**Week 4: Skills Inventory**

**Twitter Thread (Mid-week):**
```
Building the Skills Inventory for SkillTree:

Challenge: How do you help people *discover* skills they didn't know they had?

My approach:
1. Guided questions ("Have you led a team?")
2. AI suggests relevant skills
3. User rates with behavioral anchors (1-10)

Example anchor for "Writing - Level 6":
"Write long-form content. Persuasive. Published articles."

Not feelings. Observable behaviors.

This is key to reducing Dunning-Kruger effect.

Thoughts? 🤔
```

**LinkedIn Post:**
```
The hardest part of career navigation?

It's not finding jobs.
It's knowing what you're capable of.

SkillTree's solution: Qualitative anchors.

Instead of "Rate your writing 1-10", we ask:
"Which level describes you?"
- Level 6: "Write articles, persuasive, published work"
- Level 8: "Professional writer, edit others' writing"

Behavioral, not emotional.

Inspired by Smith & Kendall (1963) research on rating scales.

Who knew career tools needed psychology? 🧠
```

**Milestone:**
- 🎯 Skills inventory shipped
- 🎯 Anchors methodology documented

---

**Week 6: Beta Testers Wanted**

**Twitter (Call for beta testers):**
```
🚨 SkillTree early access 🚨

Looking for 20 beta testers to try:
✅ RIASEC personality assessment
✅ Skills inventory (50+ skills)
✅ Career matching (coming next week)

Who's interested?

Requirements:
- Career-curious (changing jobs or exploring)
- Give honest feedback
- 15 mins to complete assessment

Comment "IN" and I'll DM you the link 👇
```

**LinkedIn:**
```
Seeking beta testers for SkillTree 🌳

Ideal tester:
• Exploring career transitions
• Age 25-45 (knowledge worker)
• Willing to spend 15 mins + share feedback

What you get:
• Free lifetime access (when we monetize)
• Early influence on product direction
• Career insights based on validated frameworks

DM me if interested!

(Only 20 spots available)
```

**Subreddit Posts:**

r/careerguidance:
```
Title: "I built a tool to help you discover your skills (free beta)"

Body:
Hey r/careerguidance,

I'm a solo dev building SkillTree - a career navigation tool based on psychological frameworks (RIASEC) + government data (O*NET).

Looking for 20 beta testers to try it and give feedback.

What it does:
- Personality assessment (find your RIASEC type)
- Skills inventory (rate your capabilities with behavioral anchors)
- Career matching (see which jobs fit your profile)

Free to use. Just need honest feedback.

Interested? Comment below and I'll DM the link.

(Mods: Hope this is allowed - genuinely seeking feedback, not marketing)
```

**Goal:** 20 beta signups by end of week

---

**Week 8: First User Stories**

**Twitter (User testimonial thread):**
```
First user feedback from SkillTree beta 🎉

"I never realized I had leadership skills. I just thought I was 'bossy' at work."

This. This is why I'm building this.

People undervalue their own capabilities because they lack a framework to identify them.

RIASEC + behavioral anchors = self-awareness tool

More testimonials incoming 👇
```

**LinkedIn (Case study post):**
```
SkillTree beta tester spotlight:

Sarah, 32, Marketing Manager
- Took RIASEC: "AES" (Artistic, Enterprising, Social)
- Discovered 12 transferable skills she didn't know she had
- Matched to "UX Researcher" (87% fit)
- Now exploring transition from marketing → UX

This is the power of data-driven self-discovery.

Want to try? Link in comments.
```

**Dev.to Article:**
```
Title: "What I Learned from My First 20 Users"

Sections:
1. Onboarding is HARD (60% drop-off at question 12)
2. Anchors work! (Users love behavioral examples)
3. Career matches surprised people (in a good way)
4. What I'm changing next

Raw data + learnings
```

**Milestone:**
- 🎯 20 beta testers completed
- 🎯 User testimonials collected
- 🎯 Feedback incorporated

---

### Phase 1B: Career Matching Launch (Weeks 9-12)

**Week 10: The Main Feature**

**Twitter Announcement:**
```
🚀 Career matching is LIVE in SkillTree!

Now you can:
✅ Take RIASEC assessment
✅ Rate your skills
✅ See top 10 matching careers
✅ Identify skill gaps
✅ Download PDF resume

Example: "AIE" type + skills in writing/data
→ Top match: "Content Strategist" (89% fit)
→ Gap: Need "SEO" skill (currently 0/10, need 6/10)

Try it: [link]

Built in 12 weeks. Solo. Part-time. 💪
```

**LinkedIn (Algorithm deep-dive):**
```
How SkillTree's career matching algorithm works:

40% RIASEC alignment (personality fit)
50% Skills match (capability fit)
10% Experience level

Why these weights?

Based on Holland (1997) research: person-environment fit predicts job satisfaction.

Skills matter more than personality for *capability*.
Personality matters more for *fulfillment*.

Full methodology: [link to docs/MATCHING_ALGORITHM.md]

Thoughts from HR/career pros? 💭
```

**Product Hunt (Soft launch):**
```
Title: SkillTree - Discover your skills, find your career path

Tagline: RPG-inspired career navigation using psychology + government data

Description:
SkillTree helps you answer "what are my skills?" through:
• RIASEC personality assessment (10 mins)
• Skills inventory with behavioral anchors (not vague 1-10 ratings)
• AI-powered career matching (70 careers, growing to 300+)
• Skill gap analysis (what to learn next)

Built for career changers, parents tracking child development, and anyone seeking self-awareness.

Free to use. No login required for assessment.

Solo dev project. Built in public over 12 weeks.

Your feedback shapes the roadmap! 🙏
```

**Milestone:**
- 🎯 Career matching shipped
- 🎯 Product Hunt soft launch
- 🎯 100+ users (from beta + PH)

---

**Week 12: Metrics & Learnings**

**Twitter Thread (transparent metrics):**
```
12 weeks of building SkillTree in public.

Here's what happened (raw numbers):

Users:
- 147 total signups
- 89 completed RIASEC (60% completion 😬)
- 52 completed full flow (35%)
- 8 exported PDF resume

Traffic sources:
- Twitter: 68 users
- Product Hunt: 41 users
- Reddit: 23 users
- LinkedIn: 15 users

Time spent:
- ~15 hrs/week average
- 180 hours total
- $0 marketing spend

What I learned:
1. Onboarding is THE bottleneck (addressing in next sprint)
2. Career matches are the "wow" moment
3. People love the anchors approach

Next 12 weeks: Focus on retention 📈

1/5
```

**Dev.to Article:**
```
Title: "12 Weeks, 180 Hours, $0 Spend: SkillTree Retrospective"

Sections:
- What shipped vs. what didn't
- Metrics breakdown (with charts)
- Technical decisions (what I'd change)
- Build in public learnings (what worked)
- Next 12 weeks roadmap

Honest, raw, transparent
```

**Milestone:**
- 🎯 3-month retrospective published
- 🎯 150+ total users
- 🎯 Clear roadmap for Phase 2

---

### Phase 1C: Polish & Growth (Weeks 13-16)

**Focus:** Retention + virality features

**Week 14: Share Feature**

**Twitter:**
```
New in SkillTree:

📤 Share your skills profile

Now you can:
- Generate shareable link
- Control what's visible (public/private skills)
- Download beautiful PDF resume

Use case: Share with recruiters, mentors, coaches

Example: skilltree.io/@username

Built with: Next.js dynamic routes + Prisma

Shipping small features > waiting for perfection 🚀
```

---

**Week 16: Soft Monetization Announcement**

**Twitter Thread:**
```
SkillTree is introducing a premium tier 💰

Why?
- Server costs growing (yay, traction!)
- Want to add 300+ more careers (requires full O*NET database)
- Solo dev needs coffee money ☕

Free tier stays generous:
✅ RIASEC assessment
✅ Skills inventory (up to 30 skills)
✅ Career matches (top 5)

Premium ($5/mo):
✅ Unlimited skills
✅ Full career matches (all 70, soon 300+)
✅ PDF exports (unlimited)
✅ Skill tree visualization (coming soon)
✅ Priority support

Early supporters: 50% off lifetime ($2.50/mo)
Use code: BUILDER50

Not asking everyone to pay.
Just those who find value. 🙏

Link: [billing page]

1/3
```

**Milestone:**
- 🎯 MVP feature-complete
- 🎯 Monetization path tested
- 🎯 10-20 paying users (target)

---

### Phase 2 Kickoff (Weeks 17-20)

**Week 18: Phase 2 Vision**

**Twitter Thread:**
```
Phase 2 of SkillTree roadmap 🗺️

Based on your feedback, next 3 months:

🎯 Skill Tree Visualization
- See how skills connect
- Visualize path from current → target career
- Graph database (Neo4j)

🎯 Full O*NET Database
- 70 careers → 300+ careers
- Better matches for niche skills
- Quarterly automated updates

🎯 Parenting Module
- Track child development (ages 0-18)
- Age-appropriate assessments
- Activity recommendations

Which are you most excited for?

Vote below 👇
```

**Dev.to:**
```
Title: "Scaling SkillTree: From 70 to 300+ Careers (O*NET Migration Plan)"

- Current architecture (API-based, 70 careers)
- Bottlenecks identified (matching speed, coverage)
- Migration plan (API → Full database ETL)
- Technical challenges (caching, performance)
- Timeline: Month 5-6

Full plan: [link to MIGRATION_PLAN.md]
```

**Milestone:**
- 🎯 Phase 2 roadmap public
- 🎯 Community input gathered
- 🎯 200+ users (cumulative)

---

## Content Templates

### Weekly Update Template (Twitter)

```
Week [X] of SkillTree:

✅ Shipped: [Feature name]
🔧 Working on: [Current task]
💭 Learning: [Insight/challenge]

Metrics:
- [X] users (+[Y] this week)
- [Z]% completion rate
- Top feedback: [Quote]

Next week: [Goal]

Link: [demo/repo]
```

### Technical Deep-Dive Template (Dev.to)

```
Title: "How I Built [Feature] for SkillTree"

1. The Problem
   - User need
   - Why it matters

2. The Solution
   - Technical approach
   - Stack/tools used
   - Code snippets

3. Challenges
   - What went wrong
   - How I debugged

4. Results
   - Metrics
   - User feedback

5. What's Next
   - Future improvements

[Demo GIF]
[GitHub link]
```

### User Story Template (LinkedIn)

```
SkillTree user spotlight:

[Name], [Age], [Current Role]

The journey:
📍 Starting point: [situation]
🎯 RIASEC result: [code]
💡 Skills discovered: [count]
✨ Top career match: [job title] ([X]% fit)
🚀 Outcome: [what they did next]

"[Quote from user]"

This is why I build.

Want your own career insights? [Link]
```

---

## Engagement Tactics

### Reply to EVERY comment (first 6 months)

**Why:** Build community, not just audience

**How:**
- Set Twitter notifications for mentions
- Respond within 24 hours
- Ask follow-up questions
- Turn conversations into content

**Example:**
```
User: "How did you decide on 70 careers vs more?"

You: "Great question! Started with 968 from O*NET database.

But for solo dev MVP:
- 70 = faster to validate
- Still covers all RIASEC types
- Can expand based on demand

You thinking about a career not in the 70? 👀"
```

---

### Cross-pollination

**Strategy:** Reuse content across platforms

**Example flow:**
1. Ship feature → Tweet (short)
2. Thread explaining why → Twitter
3. Expand thread → Dev.to article
4. Professional angle → LinkedIn post
5. Visual demo → YouTube short (optional)

**Effort:** 1 piece of content → 4-5 posts

---

### Community Building

**Tactics:**

**1. Beta Tester Discord/Slack (Optional)**
- Invite engaged users
- Share early previews
- Get instant feedback
- Foster champions

**2. GitHub Discussions**
- Feature requests
- Bug reports
- Open roadmap voting

**3. Email List (Critical!)**
- Capture waitlist signups
- Weekly updates (not spam!)
- Launch announcements
- Premium early access

**Tool:** Convertkit (free up to 1000 subscribers)

---

## Metrics to Track

### Vanity Metrics (for morale)
- Twitter followers
- GitHub stars
- Dev.to post views

### Real Metrics (for decisions)
- Email signups (waitlist)
- Beta tester signups
- Completed assessments
- Retention (7-day, 30-day)
- Premium conversions (when launched)

**Dashboard:** Plausible Analytics (privacy-friendly, cheap)

---

## Content Calendar (First 12 Weeks)

| Week | Twitter | LinkedIn | Dev.to | Milestone |
|------|---------|----------|--------|-----------|
| 1 | Announcement thread | Project intro | Why I'm building | Repo live |
| 2 | Tech stack decisions | Research findings | - | DB seeded |
| 3 | Demo video | - | RIASEC implementation | First feature |
| 4 | Skills inventory progress | Anchors methodology | - | - |
| 5 | Weekly updates (2-3) | - | - | - |
| 6 | Beta tester call | Beta tester call | - | 20 signups |
| 7 | User feedback thread | - | - | - |
| 8 | Testimonials | Case study | First 20 users learnings | 20 complete |
| 9 | Weekly updates | - | - | - |
| 10 | Matching launch | Algorithm deep-dive | - | Full MVP |
| 11 | Product Hunt soft launch | - | - | 100+ users |
| 12 | Metrics thread | - | 12-week retrospective | Retrospective |

---

## Do's and Don'ts

### ✅ DO:

- Share failures, not just wins
- Respond to every comment (first 6 months)
- Be specific with numbers ("89 users" not "lots of users")
- Give credit (to AI tools, libraries, inspirations)
- Ship incomplete features with "v1" label
- Ask for feedback often
- Celebrate small wins

### ❌ DON'T:

- Spam the same content everywhere
- Only share when you launch something
- Ignore negative feedback
- Over-promise timelines
- Compare to well-funded competitors
- Apologize for being solo/small
- Wait for perfection

---

## Emergency Playbook

### If engagement drops:

1. **Poll your audience** - "What should I build next?"
2. **Share a failure** - "This feature flopped, here's why"
3. **Go deeper** - Technical deep-dive
4. **Ask for help** - "Stuck on X, any ideas?"

### If you get criticized:

1. **Thank them** - "Appreciate the feedback"
2. **Dig deeper** - "Can you elaborate?"
3. **Fix if valid** - "You're right, shipping fix tonight"
4. **Explain if not** - "Here's why I chose Y approach"

### If you burn out:

1. **Ship what's done** - Don't abandon halfway
2. **Be transparent** - "Taking 2 weeks off, back [date]"
3. **Return with learnings** - "Here's what I learned about burnout"

---

## Success Metrics (6 Months)

**By Week 23 (end of Phase 1):**

**Audience:**
- 500-1000 Twitter followers
- 200-500 LinkedIn connections
- 500-1000 email waitlist

**Users:**
- 500-1000 total users
- 200-300 completed full flow
- 50-100 active (monthly)

**Revenue (if monetized):**
- 10-20 paying users
- $50-200 MRR

**Credibility:**
- 3-5 testimonials
- 1-2 media mentions (indie hackers, etc)
- 50+ GitHub stars

---

## Tools & Resources

**Content Creation:**
- **Writing:** Notion (organize ideas)
- **Screenshots:** CleanShot X / ShareX
- **GIFs:** Screen Studio / Licecap
- **Scheduling:** Typefully (Twitter), Buffer (multi-platform)

**Analytics:**
- **Website:** Plausible ($9/mo, privacy-friendly)
- **Social:** Native analytics (free)
- **Email:** Convertkit (free <1000)

**Community:**
- **Email:** Convertkit
- **Discussions:** GitHub Discussions (free)
- **Chat:** Discord (optional, if audience demands)

---

## Next Steps

1. ✅ Create Twitter account (if not exist)
2. ✅ Write announcement thread (Week 1, Day 1)
3. ✅ Setup landing page with email capture
4. ✅ Create content calendar (use template above)
5. ✅ Schedule first 4 weeks of posts
6. ✅ Ship first feature, share demo

**Start date:** [Your choice]

**First tweet draft:** [See Week 1 template above]

---

## Questions?

Building in public is a muscle. You'll get better with practice.

Start small:
- Week 1: Just announce
- Week 2: Share 2-3 updates
- Week 3: First demo

Momentum builds over time.

**You got this!** 🚀

---

**Version History:**
- v1.0 (2025-11-20): Initial build-in-public strategy

**Contact:** [Your Twitter/email]
