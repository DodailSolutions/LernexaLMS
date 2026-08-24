const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing records to prevent unique constraints issues
  await prisma.licenseStatus.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.lessonProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // 1. Create Roles
  const roles = [
    { name: "Super Admin", description: "Full system administration rights" },
    { name: "Admin", description: "General system manager" },
    { name: "Instructor", description: "Course creator and teacher" },
    { name: "Assistant Instructor", description: "Teaching assistant and grader" },
    { name: "Mentor", description: "1-on-1 advisor" },
    { name: "Student", description: "General course learner" },
    { name: "Organization Admin", description: "Corporate site manager" },
    { name: "Organization Manager", description: "Corporate team manager" },
    { name: "Support Staff", description: "Customer ticket staff" },
    { name: "Content Manager", description: "CMS and blog manager" },
    { name: "Finance Manager", description: "Financial and payouts manager" },
  ];

  const dbRoles = {};
  for (const role of roles) {
    dbRoles[role.name] = await prisma.role.create({ data: role });
  }
  console.log("Roles seeded successfully.");

  // 2. Create Permissions
  const permissions = [
    { name: "*", description: "Wildcard permission" },
    { name: "users:view", description: "View user accounts" },
    { name: "users:manage", description: "Edit/delete user accounts" },
    { name: "course:view", description: "View courses" },
    { name: "course:create", description: "Create course drafts" },
    { name: "course:update", description: "Update course details" },
    { name: "course:delete", description: "Delete course outlines" },
    { name: "course:publish", description: "Toggle course publish state" },
    { name: "course:approve", description: "Approve pending review courses" },
    { name: "billing:view", description: "View transaction details" },
    { name: "billing:refund", description: "Issue refunds" },
    { name: "billing:payout", description: "Process payouts" },
    { name: "cms:manage", description: "Manage FAQs and blogs" },
    { name: "support:manage", description: "Review help tickets" },
    { name: "licensing:manage", description: "View license client keys" },
  ];

  const dbPermissions = {};
  for (const perm of permissions) {
    dbPermissions[perm.name] = await prisma.permission.create({ data: perm });
  }
  console.log("Permissions seeded successfully.");

  // Map role permissions
  // Admin Permissions
  const adminPermissions = [
    "users:view", "users:manage",
    "course:view", "course:create", "course:update", "course:delete", "course:publish", "course:approve",
    "billing:view", "billing:refund", "cms:manage", "support:manage", "licensing:manage"
  ];
  for (const perm of adminPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: dbRoles["Admin"].id,
        permissionId: dbPermissions[perm].id,
      },
    });
  }

  // Instructor Permissions
  const instructorPermissions = [
    "course:view", "course:create", "course:update", "course:publish", "billing:view"
  ];
  for (const perm of instructorPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: dbRoles["Instructor"].id,
        permissionId: dbPermissions[perm].id,
      },
    });
  }

  // Student Permissions
  const studentPermissions = ["course:view"];
  for (const perm of studentPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: dbRoles["Student"].id,
        permissionId: dbPermissions[perm].id,
      },
    });
  }
  console.log("Role-Permissions mappings completed.");

  // 3. Create Users
  const passwordHash = await bcrypt.hash("password123", 12);

  const adminUser = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@lernexa.com",
      passwordHash,
      roleId: dbRoles["Admin"].id,
      isVerified: true,
    },
  });

  const instructorUser = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "instructor@lernexa.com",
      passwordHash,
      roleId: dbRoles["Instructor"].id,
      isVerified: true,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: "John Smith",
      email: "student@lernexa.com",
      passwordHash,
      roleId: dbRoles["Student"].id,
      isVerified: true,
    },
  });
  console.log("Demo users seeded successfully.");

  // 4. Create Categories
  const categories = [
    { name: "Web Development", slug: "web-development" },
    { name: "Design & UX", slug: "design-ux" },
    { name: "Databases & SQL", slug: "databases-sql" },
    { name: "Cybersecurity", slug: "cybersecurity" },
    { name: "Business Management", slug: "business-management" },
  ];

  const dbCategories = {};
  for (const cat of categories) {
    dbCategories[cat.name] = await prisma.category.create({ data: cat });
  }
  console.log("Categories seeded successfully.");

  // 5. Create Demo Course
  const course = await prisma.course.create({
    data: {
      title: "Next.js 15 Complete Course",
      slug: "nextjs-15-complete-course",
      subtitle: "Build production-ready web apps using App Router, RSCs, and Prisma connections.",
      description: "Next.js is the leading React framework for building fast web applications. In this course, you will learn how to build server-side rendered projects, organize API routes, structure database models, and write transaction scripts with Prisma and MySQL.",
      level: "All Levels",
      language: "English",
      duration: 15.5,
      price: 4999.00,
      instructorId: instructorUser.id,
      categoryId: dbCategories["Web Development"].id,
      status: "PUBLISHED",
      publishingDate: new Date(),
    },
  });

  // Create Section
  const section1 = await prisma.section.create({
    data: {
      title: "Module 1: Introduction & Environment",
      courseId: course.id,
      sortOrder: 0,
      isPublished: true,
    },
  });

  const section2 = await prisma.section.create({
    data: {
      title: "Module 2: Relational Databases & Prisma",
      courseId: course.id,
      sortOrder: 1,
      isPublished: true,
    },
  });

  // Create Lessons
  await prisma.lesson.create({
    data: {
      title: "01. Introduction to Next.js 15",
      type: "VIDEO",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: 5.2,
      sectionId: section1.id,
      sortOrder: 0,
      isFreePreview: true,
      isPublished: true,
    },
  });

  await prisma.lesson.create({
    data: {
      title: "02. Reading: Understanding Server Components",
      type: "TEXT",
      content: "React Server Components (RSC) represent a paradigm shift in how we build React applications. By default, components in the Next.js App Router are Server Components. They render entirely on the server, which leads to smaller bundle sizes and faster load times since JavaScript dependencies are not shipped to the client.",
      duration: 10.0,
      sectionId: section1.id,
      sortOrder: 1,
      isPublished: true,
    },
  });

  await prisma.lesson.create({
    data: {
      title: "03. Setting up your MySQL Database Schema",
      type: "VIDEO",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: 12.4,
      sectionId: section2.id,
      sortOrder: 0,
      isPublished: true,
    },
  });
  console.log("Courses and Curriculum seeded successfully.");

  // 6. Create FAQs
  const faqs = [
    { question: "What stack is used in Lernexa?", answer: "Next.js 15, TypeScript, Prisma, MySQL, and Tailwind CSS.", category: "general", sortOrder: 0 },
    { question: "How does licensing verification work?", answer: "Verification is conducted dynamically over secure HTTPS using signed cryptographic public key verification.", category: "licensing", sortOrder: 1 },
  ];
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

  // 7. Initialize default settings
  await prisma.setting.create({
    data: { key: "site_name", value: "Lernexa Academy", group: "general" },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
