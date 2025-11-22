import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.userSkill.deleteMany()
  await prisma.assessment.deleteMany()
  await prisma.user.deleteMany()
  await prisma.occupation.deleteMany()
  await prisma.skill.deleteMany()

  // Seed Skills
  console.log('Seeding skills...')

  const skills = [
    {
      name: 'Programming',
      category: 'Technical',
      description: 'Ability to write and understand code in various programming languages',
      anchors: {
        '2': 'Write simple scripts, understand basic syntax',
        '4': 'Build small applications, debug errors',
        '6': 'Develop full features, review others code',
        '8': 'Architect systems, mentor junior developers',
        '10': 'Industry expert, create frameworks/languages'
      }
    },
    {
      name: 'Writing',
      category: 'Content',
      description: 'Communicating effectively through written content',
      anchors: {
        '2': 'Write emails and short messages with basic grammar',
        '4': 'Write reports and proposals with clear structure',
        '6': 'Write long-form content (articles, whitepapers), persuasive',
        '8': 'Professional writer, published work, edit others writing',
        '10': 'Bestselling author or award-winning journalist'
      }
    },
    {
      name: 'Leadership',
      category: 'Social',
      description: 'Leading and motivating teams toward common goals',
      anchors: {
        '2': 'Occasionally lead small group tasks',
        '4': 'Lead team meetings, delegate tasks',
        '6': 'Manage direct reports, set team goals',
        '8': 'Lead department, hire/fire, strategic decisions',
        '10': 'C-level executive, company-wide leadership'
      }
    },
    {
      name: 'Data Analysis',
      category: 'Technical',
      description: 'Analyzing data to derive insights and make decisions',
      anchors: {
        '2': 'Read charts and basic statistics',
        '4': 'Use Excel for data analysis, create charts',
        '6': 'SQL queries, statistical analysis, data visualization',
        '8': 'Build data pipelines, advanced modeling',
        '10': 'Data science expert, ML models, research'
      }
    },
    {
      name: 'Public Speaking',
      category: 'Social',
      description: 'Speaking confidently and effectively to audiences',
      anchors: {
        '2': 'Nervous speaking to small groups (<10), prefer written',
        '4': 'Present to familiar audiences (team meetings), require prep',
        '6': 'Comfortable with 50+ people, handle Q&A, monthly presentations',
        '8': 'Regular presentations to 100+, adapt to diverse crowds',
        '10': 'National/international speaker, paid keynotes, train speakers'
      }
    }
  ]

  const createdSkills = []
  for (const skill of skills) {
    const created = await prisma.skill.create({ data: skill })
    createdSkills.push(created)
    console.log(`  ✓ Created skill: ${skill.name}`)
  }

  // Seed Occupations
  console.log('Seeding occupations...')

  const occupations = [
    {
      onetSocCode: '15-1252.00',
      title: 'Software Developers, Applications',
      description: 'Develop, create, and modify general computer applications software or specialized utility programs',
      riasecCode: 'IRC',
      requiredSkills: [
        { skillId: createdSkills[0].id, skillName: 'Programming', importance: 95, level: 8 },
        { skillId: createdSkills[3].id, skillName: 'Data Analysis', importance: 60, level: 6 }
      ],
      salaryRange: { min: 70000, max: 150000, median: 110140 },
      outlook: 'Much faster than average',
      educationLevel: 'Bachelor\'s degree'
    },
    {
      onetSocCode: '27-3031.00',
      title: 'Public Relations Specialists',
      description: 'Promote or create goodwill for individuals, groups, or organizations by writing or selecting favorable publicity material',
      riasecCode: 'AES',
      requiredSkills: [
        { skillId: createdSkills[1].id, skillName: 'Writing', importance: 90, level: 7 },
        { skillId: createdSkills[4].id, skillName: 'Public Speaking', importance: 80, level: 7 }
      ],
      salaryRange: { min: 40000, max: 100000, median: 62810 },
      outlook: 'As fast as average',
      educationLevel: 'Bachelor\'s degree'
    },
    {
      onetSocCode: '11-2021.00',
      title: 'Marketing Managers',
      description: 'Plan, direct, or coordinate marketing policies and programs to determine product demand and create competitive advantage',
      riasecCode: 'ECA',
      requiredSkills: [
        { skillId: createdSkills[2].id, skillName: 'Leadership', importance: 85, level: 7 },
        { skillId: createdSkills[3].id, skillName: 'Data Analysis', importance: 70, level: 6 },
        { skillId: createdSkills[1].id, skillName: 'Writing', importance: 65, level: 6 }
      ],
      salaryRange: { min: 80000, max: 200000, median: 142170 },
      outlook: 'Faster than average',
      educationLevel: 'Bachelor\'s degree'
    }
  ]

  for (const occupation of occupations) {
    await prisma.occupation.create({ data: occupation })
    console.log(`  ✓ Created occupation: ${occupation.title}`)
  }

  console.log('\n✅ Database seeding complete!')
  console.log(`   - ${skills.length} skills created`)
  console.log(`   - ${occupations.length} occupations created`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
