# Lernexa LMS: Master Implementation Plan

This is the central implementation guide for Lernexa LMS, directing project setup and phase-by-phase development.

## 1. Directory Structure

```text
src/
├── app/                        # Pages & Routes
│   ├── (public)/               # Landing, course catalogs, blog
│   ├── (auth)/                 # Registration, login, password resets
│   ├── install/                # Step-by-step setup wizard
│   ├── dashboard/              # Student dashboard
│   ├── instructor/             # Instructor course editing
│   ├── admin/                  # Administrative tools & licensing
│   └── api/                    # REST routes
│
├── features/                   # Feature-based modular directories
│   ├── auth/                   # RBAC & sessions
│   ├── licensing/              # Activation & signatures validation
│   ├── courses/                # Players & progress tracking
│   └── commerce/               # Pluggable payments
```

---

## 2. Core Relational Schema Design (Prisma)

The database schema utilizes MySQL 8.0 with Prisma ORM. Key entities include:
- `User` & `Role` & `Permission` & `RolePermission` for granular RBAC.
- `Course`, `Section`, `Lesson`, and `LessonProgress` for core learning modules.
- `Quiz`, `Question`, `QuestionOption`, `QuizAttempt` for assessments.
- `Order`, `OrderItem`, `Payment`, `Coupon` for transactional commerce.
- `Organization`, `Department`, `OrganizationMember` for corporate portals.
- `LicenseStatus` for managing customer activations, signatures, and grace periods.

---

## 3. Sequential Execution Phases

### Phase 1: Foundation (Current)
- Initialize project with Next.js 15, TypeScript, Tailwind, and Prisma/MySQL.
- Setup authentication database schemas and RBAC permissions matrices.
- Verification of dev build, lints, and initial prisma migrations.

### Phase 2: Core LMS & Curriculum Builder
- Drag-and-drop Curriculum Builder.
- Lesson types: Video (support Cloudflare R2 / S3), Audio, PDF, Text.
- Progress tracking (lesson completed / video percentage watch).

### Phase 3: Assessment & Certificates
- Quiz and Exam system (questions bank, timers, scoring).
- PDF certificate generator with QR verification routing `/verify/[id]`.

### Phase 4: Course Marketplace
- Search and multi-criteria filters.
- Shopping cart, checkout page, orders, coupons.
- Stripe payment integration.

### Phase 5: Monetization & Commissions
- Subscription plans and membership access controls.
- Course bundles.
- Instructor revenue splitting rules and payout pipelines.

### Phase 6: Mentorship & Live Classes
- Mentor profiles, schedules, timezone calendar booking.
- Live class scheduling (Jitsi / Zoom / Google Meet integrations).

### Phase 7: Corporate LMS
- Organization accounts with manager portals.
- Departments, teams, and course assignments.
- Progress tracking across teams.

### Phase 8: CMS & Platform Analytics
- Blog management, dynamic homepage editor, customizable FAQs.
- Event-based tracking (clicks, plays, completions) and interactive Admin dashboards.

### Phase 9: Commercialization
- 10-step installation wizard (db check, license validation, admin setup).
- Cryptographic licensing client check.
- Seeding script (`prisma/seed.ts`) and Docker configurations.
