# Database Architecture: Lernexa LMS

Lernexa uses MySQL 8.0+ as its primary data store, managed through Prisma ORM.

## 1. Relational Database Guidelines

- **Primary Keys**: Always use UUIDs (`char(36)`) or auto-incrementing big integers (`bigint`) for primary keys. We prefer standard strings with `uuid()` generators for high scalability and secure REST paths.
- **Indexes**: Explicit composite indexes must be declared on search fields, foreign keys, and status columns to prevent table scans on tables like `Enrollments`, `Courses`, `Lessons`, and `QuizAttempts`.
- **Relational Integrity**: Use `ON DELETE CASCADE` only where child entities are tightly coupled to their parent (e.g., `Course` ➔ `Section` ➔ `Lesson` ➔ `Question`). For financial records like `Orders` or `Payments`, use `ON DELETE RESTRICT` to ensure data safety.

---

## 2. Table Schemas & Relational Mappings

### 2.1 Core Tables

#### User and Role (RBAC)
- **User**: Stores credentials (bcrypt hash), verification, and references a role.
- **Role**: Contains role name (e.g. `Super Admin`, `Student`).
- **Permission**: Maps permission values (e.g. `course:create`, `billing:refund`).
- **RolePermission**: Junction table to support custom administrative roles.

#### Course and Curriculum
- **Course**: General metadata, category, levels, publication status (`DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`, `ARCHIVED`).
- **Section**: Curriculum sections inside a course.
- **Lesson**: Maps sections to content materials (Video, PDF, Quiz, Assignment).

#### Enrollment & Progress
- **Enrollment**: Links a student to a course, tracks progress percentage.
- **LessonProgress**: Tracks lesson completion status and watch time for video analytics.

#### Commerce
- **Order**: General metadata (subtotal, taxes, net total, coupon, state).
- **OrderItem**: Specific course item line.
- **Payment**: Payment intent logs, transactions, and status (Succeeded, Failed, Refunded).

---

## 3. Database Performance Optimizations

1. **Composite Indexes**:
   ```prisma
   @@index([courseId, studentId]) // Fast lookup of a specific student's enrollment
   @@index([slug]) // Fast routing for course landing pages
   ```
2. **Soft Deletes**:
   To prevent customer data loss, models like `Course` or `User` should support an `isArchived` or `deletedAt` field instead of permanent deletion where appropriate.
3. **Optimistic Locking**:
   For coupon applications, the database tracks `usesCount` and matches it against `maxUses` inside a single write transaction to prevent race conditions.
