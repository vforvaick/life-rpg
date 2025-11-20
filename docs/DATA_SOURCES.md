# Data Sources Documentation

**Last Updated:** November 20, 2025
**Status:** MVP (Phase 1)

---

## Overview

SkillTree uses validated frameworks and government databases to ensure scientifically-backed career guidance.

---

## Primary Data Sources

### 1. O*NET Database (Occupational Information Network)

**Provider:** U.S. Department of Labor, Employment and Training Administration
**Website:** https://www.onetcenter.org/
**Version:** 28.0 (2024)
**License:** Public domain

**What we use:**
- **Occupations:** Job titles, descriptions, RIASEC codes
- **Skills:** Taxonomy of workplace skills (200+ skills)
- **Knowledge:** Required knowledge areas
- **Abilities:** Physical and cognitive abilities
- **Interests:** RIASEC personality alignment scores

**Access Method:**
- **MVP (Phase 1):** O*NET Web Services API
  - Endpoint: `https://services.onetcenter.org/ws/online/`
  - Authentication: Basic auth with API key
  - Rate limit: 10 requests per minute
  - Coverage: 70 curated occupations, 50 core skills

- **Phase 2D (Month 11-12):** Full database download
  - Format: CSV files
  - Coverage: 300-500 relevant occupations, 200+ skills
  - Update frequency: Quarterly

**API Key Storage:**
```bash
# .env
ONET_API_KEY=your_username:your_password
ONET_API_VERSION=28.0
```

**Example API Request:**
```bash
curl -X GET "https://services.onetcenter.org/ws/online/occupations/15-1252.00" \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)"
```

**Data Attribution:**
All occupation and skill data sourced from O*NET must include:
> "Occupation data from O*NET 28.0. O*NET® is a trademark of the U.S. Department of Labor, Employment and Training Administration."

---

### 2. RIASEC Framework (Holland Codes)

**Author:** John L. Holland (1997)
**Framework:** Hexagonal Model of Vocational Interests
**Reference:** Holland, J. L. (1997). *Making vocational choices: A theory of vocational personalities and work environments* (3rd ed.). Psychological Assessment Resources.

**What we use:**
- 6 personality types: Realistic, Investigative, Artistic, Social, Enterprising, Conventional
- 3-letter codes combining primary types (e.g., "AIE")
- Compatibility matrices for career matching

**Assessment:**
- **MVP:** Simplified 24-question RIASEC assessment
  - 4 questions per dimension
  - 5-point Likert scale (Strongly Dislike → Strongly Like)
  - ~10 minutes to complete

**Public Domain:** RIASEC framework is in public domain; specific questions adapted from public assessments.

---

### 3. Big Five Personality Traits (Future - Phase 2)

**Framework:** Five-Factor Model (FFM)
**Dimensions:** Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
**Source:** IPIP-NEO short form (public domain)
**Reference:** Costa, P. T., & McCrae, R. R. (1992). *Revised NEO Personality Inventory*.

**Status:** Planned for Phase 2 (not in MVP)

---

### 4. Salary Data

**MVP (Phase 1):**
- **Source:** O*NET built-in salary data
- **Accuracy:** National median salaries (USD)
- **Granularity:** Annual median only

**Phase 2 (Future):**
- **Integration:** Glassdoor API or Indeed API
- **Features:**
  - Location-based salary ranges
  - Company-specific data
  - Real-time job market trends

---

## Data Quality \& Validation

### Occupation Curation (MVP: 70 occupations)

**Selection Criteria:**

**1. Hybrid Approach:**
- 50-60 most popular/high-demand careers
- 10-20 for RIASEC balance (min 5 per type)

**2. Relevance Filters:**
- Target audience: Knowledge workers, age 25-45
- Exclude: Very niche roles (<1,000 employed)
- Exclude: Obsolete occupations

**3. Validation:**
- Each occupation manually reviewed
- Verified RIASEC codes match O*NET data
- Salary data spot-checked against BLS

### Skills Taxonomy (MVP: 50 skills)

**Selection Criteria:**
- Most transferable across careers
- Mix of soft skills (30%) and technical skills (70%)
- Categories: Content, Process, Social, Technical, Problem-Solving

**Qualitative Anchors:**
- Manually written behavioral descriptors
- 5 levels: 2, 4, 6, 8, 10 (1-10 scale)
- Observable behaviors, not feelings
- Culturally neutral language

**Source:** O*NET Skills taxonomy + internal research

---

## Update Frequency

### MVP (Phase 1)
- **Occupations:** Static (70 occupations, manually curated)
- **Skills:** Static (50 skills)
- **Updates:** Manual on-demand (if O*NET releases major update)

### Phase 2D (Month 11-12)
- **Occupations:** Quarterly sync with O*NET database
- **Skills:** Quarterly sync
- **Automation:** Cron job + notification for manual review

**Quarterly Update Process:**
1. Check O*NET for new version
2. Run ETL pipeline (extract, transform, load)
3. Validate data quality (automated tests)
4. Manual review of new occupations/skills
5. Deploy to production

---

## Data Storage

### Database Schema

**PostgreSQL Tables:**
```sql
-- Occupations (from O*NET)
CREATE TABLE occupations (
  id UUID PRIMARY KEY,
  onet_soc_code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  riasec_code VARCHAR(10),
  required_skills JSONB,
  salary_range JSONB,
  source VARCHAR(100) DEFAULT 'O*NET API v28.0',
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Skills (from O*NET + custom anchors)
CREATE TABLE skills (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  anchors JSONB NOT NULL,  -- {2: "...", 4: "...", 6: "...", 8: "...", 10: "..."}
  onet_id VARCHAR(50),
  source VARCHAR(100) DEFAULT 'O*NET API v28.0',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Data Attribution Fields:**
- `source`: Data provider (e.g., "O*NET API v28.0")
- `last_updated`: When data was fetched/updated
- `onet_id`: Original O*NET identifier (for migration tracking)

---

## Compliance \& Licensing

### O*NET Usage Terms
- **Attribution Required:** Yes (see above)
- **Commercial Use:** Allowed
- **Modification:** Allowed (we filter/curate data)
- **Redistribution:** Not applicable (we don't redistribute raw data)

**Source:** https://www.onetcenter.org/legal.html

### RIASEC Framework
- **License:** Public domain (framework concepts)
- **Assessment Questions:** Adapted from public sources, custom wording

### User Data
- **Ownership:** Users own their assessment results and skill data
- **Privacy:** GDPR/CCPA compliant (see Privacy Policy)
- **Export:** Users can export all their data (JSON format)

---

## Rate Limits \& Costs

### O*NET API (Phase 1)
- **Rate Limit:** 10 requests/minute
- **Cost:** Free (with registration)
- **Restrictions:** Non-commercial research/public service use allowed

### Future Integrations (Phase 2+)
- **Glassdoor API:** $500-2000/month (depending on tier)
- **LinkedIn API:** OAuth only (no salary data access)

---

## Data Accuracy \& Disclaimers

**Career Matching Algorithm:**
> "Career matches are recommendations based on skills and personality alignment. Individual results may vary. Consult with career counselors for personalized guidance."

**Salary Data:**
> "Salary data is based on national medians from O*NET (2024). Actual salaries vary by location, experience, company, and market conditions."

**RIASEC Assessment:**
> "Personality assessments are self-reported and intended for self-discovery purposes. Not a clinical or diagnostic tool."

---

## Contact \& Questions

For data-related questions:
- **Technical Issues:** tech-lead@skilltree.io
- **Data Quality:** data-team@skilltree.io
- **Licensing:** legal@skilltree.io

---

## Version History

- **v1.0** (2025-11-20): Initial documentation for MVP (API-based)
- **v2.0** (TBD): Full database migration (Phase 2D)

