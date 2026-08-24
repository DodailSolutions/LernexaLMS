# Product Requirements Document: Lernexa LMS

Lernexa is a scalable, modern, commercial-grade Learning Management System (LMS) and course marketplace.

## 1. System Goals and Target Markets
Lernexa is designed as a premium, self-hosted, or SaaS-ready software package targetable to:
- Individual educators seeking a single-instructor learning portal.
- Multi-instructor marketplaces (similar to Udemy/Coursera).
- Organizations requiring a corporate training portal (Corporate LMS).

---

## 2. User Roles & Permission Matrix

The system supports the following default roles:

| Role Name | Description | Key Permissions |
| :--- | :--- | :--- |
| **Super Admin** | Full system control | All permissions, system settings, database management |
| **Admin** | General system manager | Manage users, approve courses, view transactions, manage CMS |
| **Instructor** | Course creator | Create courses, manage curricula, view personal sales, grade assignments |
| **Assistant Instructor**| Course teaching assistant | Manage curriculum (no publish), grade assignments, view student progress |
| **Mentor** | 1-on-1 advisor | Set availability, accept bookings, conduct meetings |
| **Student** | Learner | Purchase courses, view lessons, take quizzes/exams, submit assignments |
| **Organization Admin** | Corporate site manager | Purchase corporate seats, manage organization users and departments |
| **Organization Manager** | Department manager | Track progress of assigned department/team, generate reports |
| **Support Staff** | Customer support | View tickets, view user profiles, refund orders (if authorized) |
| **Content Manager** | CMS & Blog administrator | Write blog posts, manage FAQs, configure landing pages |
| **Finance Manager** | Financial controller | Manage payouts, review commissions, process refunds, generate financial tax reports |

---

## 3. Core Modules Specification

### 3.1 Course & Curriculum Management
- **Course Metadata**: Title, Subtitle, Description, Prerequisites, Objectives, Video Previews, Price, Discount.
- **Curriculum Hierarchy**: Course ➔ Section ➔ Lesson ➔ Activity.
- **Lesson Types**: Video (Stream/S3/External), Audio, PDF, Slide Presentations, Live Class, Quiz, Assignment.
- **Drip Content**: Release lessons on a schedule (e.g. X days after enrollment or on a specific date).

### 3.2 Assessment Engine (Quizzes & Exams)
- **Quiz**: Integrated within a course section. Supports time limits, multiple attempts, passing scores, immediate feedback, and negative marking.
- **Exam**: Independent examination module mapped to a Question Bank. Supports strict timers, auto-submit, difficulty levels, and random question pulling.
- **Question Types**: Multiple choice, Multiple select, True/False, Fill-in-the-blank, Short/Long answer, Drag-and-drop ordering, Matching, and Multimedia (image/video/audio).

### 3.3 Pluggable Commerce & Subscriptions
- **Cart & Checkout**: Multi-item shopping cart supporting guest checkout or account creation.
- **Coupons & Taxes**: Percentage/flat discount codes, tax calculation by country.
- **Subscriptions**: Tiered access memberships (Monthly, Quarterly, Annual, Lifetime) with trial periods.
- **Instructor Revenue Splitting**: Automated commission calculations per course/instructor with payout request pipelines.

### 3.4 Mentorship & Live Classes
- **Mentor Bookings**: Availability calendars, timezone matching, booking payments, and automated video meeting links.
- **Live Webinars**: Scheduler with support for Zoom, Google Meet, MS Teams, and Jitsi.

### 3.5 Enterprise (Corporate LMS)
- **Organization Management**: Organization Admins can invite students to join their organization seat pool.
- **Department/Team Hierarchy**: Organize learners and assign paths/courses to specific teams.

---

## 4. Localization and Internationalization (i18n)
- **Dictionaries**: UI text must load from JSON translation files (`/locales/en.json`, `/locales/hi.json`, etc.).
- **Multi-Currency Support**: Format all prices using dynamic currency codes (`USD`, `INR`, `EUR`) and display corresponding symbols dynamically based on user locale or selection.
