# SkillTree 🌳

**Discover Your Skills. Find Your Career Path.**

A career navigation platform that helps you identify your skills through RIASEC personality assessment and behavioral anchors, then matches you with careers based on validated frameworks and government data (O*NET).

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 7
- **Authentication:** Supabase Auth (Magic Link)
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## 📦 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account ([create one here](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vforvaick/life-rpg.git
   cd life-rpg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Database
   DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations** (when Supabase is configured)
   ```bash
   npx prisma db push
   ```

6. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses 5 core models:

- **User** - User accounts and profiles
- **Assessment** - RIASEC personality assessment results
- **Skill** - Skills taxonomy with behavioral anchors
- **UserSkill** - User's rated skills with evidence
- **Occupation** - Career data from O*NET

See [`prisma/schema.prisma`](./prisma/schema.prisma) for the complete schema.

## 🔐 Authentication

SkillTree uses Supabase Auth with magic link (passwordless) authentication:

1. User enters email on `/login`
2. Receives magic link via email
3. Clicks link → authenticated
4. Protected routes: `/dashboard`, `/assessment`, `/skills`

## 🏗️ Project Structure

```
life-rpg/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login)
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── lib/                   # Utilities
│   ├── prisma.ts          # Prisma client
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Helper functions
├── prisma/                # Database
│   └── schema.prisma      # Prisma schema
├── docs/                  # Documentation
│   ├── plans/             # Implementation plans
│   └── progress.md        # Development progress
└── middleware.ts          # Route protection
```

## 📝 Development Workflow

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Building for Production
```bash
npm run build
```

## 🚢 Deployment

### Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import the Git repository
   - Vercel auto-detects Next.js

2. **Configure Environment Variables**

   Add these in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`

3. **Deploy**
   - Vercel automatically deploys on push to `main` branch
   - Preview deployments for pull requests

### CI/CD Pipeline

GitHub Actions runs on every push:
- ✅ Install dependencies
- ✅ Generate Prisma Client
- ✅ Lint code
- ✅ Type check
- ✅ Build application

See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

## 📚 Documentation

- [Product Requirements Document](./docs/PRD%20Life%20RPG.md)
- [Implementation Plans](./docs/plans/)
- [Development Progress](./docs/progress.md)
- [Build in Public Strategy](./docs/BUILD_IN_PUBLIC_STRATEGY.md)

## 🗺️ Roadmap

### Phase 0: Foundation ✨ (Current)
- [x] Next.js 14 + TypeScript setup
- [x] Supabase + Prisma integration
- [x] Authentication (Magic Link)
- [x] Landing page
- [x] CI/CD pipeline
- [ ] Database seeding

### Phase 1A: RIASEC Assessment (Next)
- [ ] 24-question RIASEC assessment
- [ ] Results visualization (radar chart)
- [ ] Profile persistence

### Phase 1B: Skills System
- [ ] Skills discovery wizard
- [ ] Behavioral anchors
- [ ] Skills inventory

### Phase 1C: Career Matching
- [ ] Matching algorithm (40% RIASEC, 50% skills, 10% experience)
- [ ] Dashboard with matches
- [ ] Skill gap analysis
- [ ] PDF export

See full roadmap in [`docs/roadmap-skilltree.md`](./docs/roadmap-skilltree.md)

## 🤝 Contributing

This project is being built in public! Follow the journey:

- **Twitter/X:** Coming soon
- **GitHub Discussions:** [Share feedback](https://github.com/vforvaick/life-rpg/discussions)
- **Issues:** [Report bugs](https://github.com/vforvaick/life-rpg/issues)

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- **O*NET Database** - U.S. Department of Labor
- **RIASEC Framework** - John L. Holland
- **Behavioral Anchors** - Smith & Kendall (1963)

---

**Built with ❤️ by a solo developer, shipping in public.**

*Phase 0: Foundation - 75% Complete* 🚀
