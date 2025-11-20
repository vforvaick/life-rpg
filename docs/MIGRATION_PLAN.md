# O*NET Data Migration Plan

**Status:** Planned for Phase 2D (Month 11-12)
**Last Updated:** November 20, 2025

---

## Executive Summary

**Why migrate?**
- MVP uses O*NET API (70 occupations) for speed
- Phase 2D migrates to full database (300-500 occupations) for comprehensiveness
- Enables automated quarterly updates from O*NET releases

**Timeline:** Month 11-12 (2 months)
**Effort:** 1 Backend Engineer (full-time), 1 Data Engineer (part-time)
**Risk:** Low (backward compatible, rollback plan available)

---

## Current State (MVP - Phase 1)

### Data Source
- **Method:** O*NET Web Services API
- **Coverage:** 70 curated occupations, 50 core skills
- **Update Frequency:** Manual on-demand
- **Performance:** Fast (<500ms per query)

### Limitations
1. Limited coverage (70 of 968 occupations)
2. Manual curation required for expansion
3. No automated updates when O*NET releases new data
4. API rate limits (10 req/min)

---

## Future State (Phase 2D - Month 11-12)

### Data Source
- **Method:** Full O*NET Database (CSV download)
- **Coverage:** 300-500 relevant occupations, 200+ skills
- **Update Frequency:** Quarterly automated sync
- **Performance:** <2s with caching layer

### Benefits
1. 3-5x more career options for users
2. Better matches for niche skills
3. Automated quarterly updates (no manual work)
4. No API rate limits
5. Full control over data quality filtering

---

## Migration Strategy

### Phase Approach: API → Full Database

**Why not start with full database in MVP?**
- Faster MVP delivery (no ETL pipeline needed)
- Validate core value before infrastructure investment
- 70 occupations sufficient to test matching algorithm
- Avoid premature optimization

**When to migrate?**
- **Trigger:** 10,000+ users (Phase 2 success milestone)
- **Timing:** Month 11-12 (after skill tree & parenting modules)
- **Reason:** User demand for more career options validated

---

## Migration Steps

### Month 11: ETL Pipeline Development (4 weeks)

**Week 1-2: Extract & Transform**

1. **Download O*NET Database**
   ```bash
   # Download from https://www.onetcenter.org/database.html
   wget https://www.onetcenter.org/dl_files/database/db_29_0_text/Occupation%20Data.zip
   unzip Occupation\ Data.zip -d data/onet-raw/
   ```

   Files needed:
   - `Occupation Data.txt` (968 occupations)
   - `Skills.txt` (35 O*NET skills)
   - `Knowledge.txt`
   - `Abilities.txt`
   - `Interests.txt` (RIASEC scores)

2. **Build ETL Script**
   ```typescript
   // scripts/onet-etl/index.ts
   import { extractOccupations, extractSkills } from './extract';
   import { transformOccupation, filterRelevant } from './transform';
   import { loadToDatabase } from './load';

   async function runETL() {
     console.log('Step 1: Extract...');
     const rawOccupations = await extractOccupations('data/onet-raw/Occupation Data.txt');
     const rawSkills = await extractSkills('data/onet-raw/Skills.txt');

     console.log('Step 2: Transform...');
     const transformed = rawOccupations.map(transformOccupation);
     const filtered = filterRelevant(transformed); // 968 → 300-500

     console.log('Step 3: Load...');
     await loadToDatabase(filtered);

     console.log(`✓ Migrated ${filtered.length} occupations`);
   }

   runETL();
   ```

3. **Data Quality Filters**
   ```typescript
   // scripts/onet-etl/transform.ts
   export function filterRelevant(occupations: Occupation[]): Occupation[] {
     return occupations.filter(occ => {
       // Rule 1: Employment size (>1,000 people)
       if (occ.employmentSize < 1000) return false;

       // Rule 2: Salary threshold (>$30k median)
       if (occ.salaryMedian < 30000) return false;

       // Rule 3: Exclude obsolete
       if (occ.title.includes('Obsolete')) return false;

       // Rule 4: Exclude very niche
       const niche = ['Helper', 'Assembler', 'Tender'];
       if (niche.some(word => occ.title.includes(word))) return false;

       // Rule 5: Require formal education
       if (occ.educationLevel === 'No formal education') return false;

       return true;
     });
   }
   ```

**Week 3: Skills Taxonomy Expansion**

1. **Expand from 50 → 200 skills**
   - Extract all O*NET skills (35 core skills)
   - Add 165 technical/modern skills (e.g., "Prompt Engineering", "Data Visualization")
   - Write qualitative anchors for new skills

2. **Map Skills to Occupations**
   ```typescript
   // Parse Skills.txt to get skill-occupation relationships
   // Each occupation has 5-15 required skills with importance weights
   ```

**Week 4: Testing & Validation**

1. **Data Quality Tests**
   ```typescript
   // tests/etl.test.ts
   test('all occupations have valid RIASEC codes', () => {
     occupations.forEach(occ => {
       expect(occ.riasecCode).toMatch(/^[RIASEC]{1,6}$/);
     });
   });

   test('salary data is reasonable', () => {
     occupations.forEach(occ => {
       expect(occ.salaryMedian).toBeGreaterThan(20000);
       expect(occ.salaryMedian).toBeLessThan(500000);
     });
   });
   ```

2. **Staging Database Testing**
   - Run ETL on staging
   - Validate 300-500 occupations loaded
   - Check data quality (no nulls, valid RIASEC codes)

---

### Month 12: Production Migration (4 weeks)

**Week 1: Pre-Migration Prep**

1. **Backup Existing Data**
   ```bash
   pg_dump skilltree_prod > backup_pre_migration_$(date +%F).sql
   ```

2. **Performance Baseline**
   - Measure current match calculation time (70 occupations)
   - Target: <2s with 300+ occupations

3. **User Communication**
   - Email notification: "More careers coming soon!"
   - In-app banner: "Expanding to 300+ careers this week"

**Week 2: Production Migration Execution**

1. **Database Migration**
   ```sql
   -- Add new occupations (preserve existing 70)
   INSERT INTO occupations (...)
   SELECT * FROM staging_occupations
   WHERE onet_soc_code NOT IN (
     SELECT onet_soc_code FROM occupations
   );

   -- Add new skills (preserve existing 50)
   INSERT INTO skills (...)
   SELECT * FROM staging_skills
   WHERE name NOT IN (SELECT name FROM skills);
   ```

2. **Deploy Updated Matching Algorithm**
   ```typescript
   // api/utils/careerMatching.ts (with caching)
   export async function calculateCareerMatches(userId: string) {
     const cacheKey = `matches:${userId}`;
     const cached = await redis.get(cacheKey);
     if (cached) return JSON.parse(cached);

     // Calculate matches for 300+ occupations
     const matches = await calculateAll(userId);

     // Cache for 1 hour
     await redis.setex(cacheKey, 3600, JSON.stringify(matches));
     return matches;
   }
   ```

3. **Deploy Redis Caching Layer**
   ```yaml
   # Add to docker-compose.yml
   redis:
     image: redis:7-alpine
     ports:
       - "6379:6379"
   ```

**Week 3: Performance Tuning**

1. **Monitor Performance**
   - Match calculation time (<2s target)
   - Cache hit rate (>80% target)
   - Database query times

2. **Optimize if Needed**
   - Add database indexes
   - Tune Redis cache TTL
   - Parallelize match calculations

**Week 4: Quarterly Update Automation**

1. **Cron Job Setup**
   ```typescript
   // scripts/quarterly-update.ts
   import cron from 'node-cron';

   // Run on 1st day of quarter (Jan, Apr, Jul, Oct) at 2am
   cron.schedule('0 2 1 1,4,7,10 *', async () => {
     console.log('Checking for new O*NET release...');

     const latestVersion = await checkONetVersion();
     const currentVersion = process.env.ONET_VERSION;

     if (latestVersion !== currentVersion) {
       await notifyTeam(`New O*NET version ${latestVersion} available!`);
       // Manual approval required before auto-update
     }
   });
   ```

2. **Notification System**
   - Slack webhook: Alert team of new O*NET release
   - Manual review: Product team approves update
   - Automated ETL: Runs after approval

---

## Data Preservation

### User Data (Zero Loss Requirement)

**Tables to Preserve:**
- `user_skills` (skill ratings)
- `assessments` (RIASEC results)
- `career_matches` (cached matches - can regenerate)

**Migration Safety:**
```sql
-- Before migration
BEGIN;

-- Backup user data
CREATE TABLE user_skills_backup AS SELECT * FROM user_skills;
CREATE TABLE assessments_backup AS SELECT * FROM assessments;

-- Run migration
[... insert new skills/occupations ...]

-- Verify no data loss
DO $$
DECLARE
  old_count INT;
  new_count INT;
BEGIN
  SELECT COUNT(*) INTO old_count FROM user_skills_backup;
  SELECT COUNT(*) INTO new_count FROM user_skills;

  IF old_count != new_count THEN
    RAISE EXCEPTION 'Data loss detected! Aborting migration.';
  END IF;
END $$;

COMMIT;
```

### Backward Compatibility

**Existing User Matches:**
- Recalculate all career matches with new occupations
- Old matches (70 occupations) still valid
- New matches added on top

**API Compatibility:**
- No breaking changes to API endpoints
- Response format unchanged
- Only `matches` array grows (10 → 20+ results)

---

## Rollback Plan

### Rollback Triggers

**Rollback if:**
1. Data loss detected (user_skills count mismatch)
2. Performance degradation (>5s match calculation)
3. Critical bugs (matching algorithm errors)
4. Data quality issues (invalid RIASEC codes, null salaries)

### Rollback Procedure

**Step 1: Stop Traffic**
```bash
# Put app in maintenance mode
vercel env add MAINTENANCE_MODE=true
```

**Step 2: Restore Database**
```bash
# Restore from backup
psql skilltree_prod < backup_pre_migration_2025-11-20.sql
```

**Step 3: Revert Code**
```bash
# Revert to previous deployment
vercel rollback
```

**Step 4: Validate**
- Check user_skills count
- Test career matching (should return 70 occupations)
- Monitor error rates

**Step 5: Post-Mortem**
- Identify root cause
- Fix issues in staging
- Re-attempt migration when ready

**Estimated Rollback Time:** <1 hour

---

## Success Criteria

### Pre-Migration Checklist

- [ ] ETL pipeline tested on staging
- [ ] Data quality validated (300-500 occupations, 200+ skills)
- [ ] Performance benchmarks met (<2s match calculation)
- [ ] Backup created (database dump)
- [ ] Team notified (scheduled maintenance window)
- [ ] Rollback procedure documented & tested

### Post-Migration Validation

**Data Integrity:**
- [ ] Zero user data loss (user_skills count unchanged)
- [ ] All new occupations have valid RIASEC codes
- [ ] All new skills have 5 qualitative anchors
- [ ] Salary data within reasonable ranges ($20k-$500k)

**Performance:**
- [ ] Match calculation <2s (95th percentile)
- [ ] Redis cache hit rate >80%
- [ ] Database query times <500ms

**User Experience:**
- [ ] Users see 15-25 career matches (up from 5-10)
- [ ] No errors in Sentry (first 24 hours)
- [ ] User feedback positive (in-app survey)

### Week 1 Post-Migration Metrics

**Monitor:**
- Error rate (<0.1% target)
- Match calculation time (p50, p95, p99)
- Cache hit rate
- User engagement (career matches explored)

**Expected Outcomes:**
- 2-3x more career matches per user
- No increase in error rates
- Positive user feedback

---

## Communication Plan

### Internal Team

**Week Before Migration:**
- Tech team: Staging testing complete
- Product team: Review new occupations list
- Support team: Briefing on new features

**Migration Day:**
- Slack channel: #migration-onet-2025
- Real-time updates during maintenance window
- On-call engineer assigned

### Users

**1 Week Before:**
- Email: "Exciting update coming - 300+ careers!"
- In-app banner: "New careers arriving Nov 30"

**Migration Day:**
- Maintenance window: 2am-4am PST (low traffic)
- Status page: status.skilltree.io

**Post-Migration:**
- Email: "300+ careers now available!"
- Changelog: Feature announcement

---

## Future Iterations

### Phase 3 (Months 13-24): Further Expansion

- Expand to 500+ occupations (if user demand)
- Add international occupations (ESCO database for EU)
- Real-time salary data (Glassdoor API integration)

---

## Appendix

### Related Documentation

- `DATA_SOURCES.md` - O*NET API usage (current state)
- `ONET_ETL_GUIDE.md` - How to run ETL pipeline (created in Phase 2D)
- `DATA_QUALITY_RULES.md` - Occupation filtering criteria
- `phase-2-growth.md` - Full migration implementation plan

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Start with API | Faster MVP, validate demand first |
| Migrate at 10k users | Enough data to validate need for expansion |
| Filter to 300-500 (not 968) | Quality over quantity, better UX |
| Quarterly updates | Balance freshness vs. stability |
| Manual approval for updates | Prevent bad data from auto-deploying |

---

## Version History

- **v1.0** (2025-11-20): Initial migration plan (API → Full DB)
- **v2.0** (TBD): Post-migration retrospective

---

**Questions?** Contact: tech-lead@skilltree.io
