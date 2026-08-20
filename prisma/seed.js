const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.task.deleteMany({});
  await prisma.issue.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.application.deleteMany({});
  
  console.log("Seeding database with test data to visualize all colors and UI states...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@poaf.org' },
    update: {},
    create: {
      email: 'admin@poaf.org',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  });

  const dept = await prisma.department.upsert({
    where: { name: 'Technology & Innovation' },
    update: {},
    create: {
      name: 'Technology & Innovation',
      description: 'Driving digital transformation across POAF.',
    }
  });

  let country = await prisma.country.findFirst();
  if (!country) {
    country = await prisma.country.create({ data: { name: 'Rwanda' } });
  }

  const leader = await prisma.member.upsert({
    where: { poafId: 'POAF-MEM-0001' },
    update: {},
    create: {
      poafId: 'POAF-MEM-0001',
      firstName: 'Ezra',
      lastName: 'Tech',
      email: 'ezra@poaf.org',
      role: 'DEPT_LEADER',
      isLeader: true,
      leaderPosition: 'Department Head',
      status: 'ACTIVE',
      countryId: country.id,
      departmentId: dept.id
    }
  });

  await prisma.department.update({
    where: { id: dept.id },
    data: { leaderId: leader.id }
  });

  const apps = [
    { poafId: 'POAF-APP-0001', type: 'MEMBERSHIP', status: 'SUBMITTED', payload: '{"firstName":"John","lastName":"Doe"}' },
    { poafId: 'POAF-APP-0002', type: 'LEADERSHIP', status: 'UNDER_REVIEW', payload: '{"firstName":"Jane","lastName":"Smith"}' },
    { poafId: 'POAF-APP-0003', type: 'CHAPTER', status: 'REVISION_REQUIRED', payload: '{"chapterName":"Kenya Hub"}', notes: 'Please provide a registration document.' },
    { poafId: 'POAF-APP-0004', type: 'PARTNERSHIP', status: 'REJECTED', payload: '{"orgName":"SpamCorp"}', notes: 'Does not align with POAF vision.' },
    { poafId: 'POAF-APP-0005', type: 'MEMBERSHIP', status: 'ACCEPTED', payload: '{"firstName":"Alice"}' }
  ];
  for (const app of apps) {
    await prisma.application.create({ data: app });
  }

  const project1 = await prisma.project.create({
    data: {
      poafId: 'POAF-PRJ-0001',
      title: 'POAF Digital Platform',
      description: 'Building the core infrastructure for member management.',
      status: 'ONGOING',
      progressPct: 65,
      departmentId: dept.id,
      teamMembers: {
        create: [{ memberId: leader.id, role: 'LEADER' }]
      }
    }
  });

  const project2 = await prisma.project.create({
    data: {
      poafId: 'POAF-PRJ-0002',
      title: 'Youth Coding Bootcamp 2025',
      description: 'Successfully trained 500 youth in web development.',
      status: 'COMPLETED',
      progressPct: 100,
      departmentId: dept.id,
      teamMembers: {
        create: [{ memberId: leader.id, role: 'LEADER' }]
      }
    }
  });

  const tasks = [
    { title: 'Design Database Schema', status: 'COMPLETED', priority: 'HIGH', projectId: project1.id, assigneeId: leader.id },
    { title: 'Implement Auth.js', status: 'IN_PROGRESS', priority: 'URGENT', projectId: project1.id, assigneeId: leader.id },
    { title: 'Write Documentation', status: 'NOT_STARTED', priority: 'LOW', projectId: project1.id, assigneeId: leader.id }
  ];
  for (const t of tasks) {
    await prisma.task.create({ data: t });
  }

  await prisma.issue.create({
    data: {
      title: 'NextAuth Middleware bug',
      description: 'Redirect loop on /dashboard',
      status: 'OPEN',
      projectId: project1.id,
      reporterId: leader.id
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
