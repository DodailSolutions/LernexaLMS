# Testing Strategy: Lernexa LMS

Lernexa maintains a rigorous testing architecture to guarantee stability across releases.

## 1. Test Categories

### 1.1 Unit Testing
- **Target**: Pure helper functions, Zod schema validations, utility classes, and isolated business logic.
- **Framework**: Vitest + Happy DOM (for lightweight UI tests).
- **Execution Speed**: Extremely fast, runs locally on save.

### 1.2 Integration Testing
- **Target**: API routes, database queries, and middleware behaviors.
- **Tools**: Prisma transactional tests (wrapping runs in rollback transactions to avoid database pollution).
- **Key Coverage**: Verification of authentication tokens, coupon application math, and commission distribution.

### 1.3 End-to-End (E2E) Testing
- **Target**: Complete user workflows.
- **Tools**: Playwright.
- **Key Flows**:
  - **Student**: Registration ➔ Cart Checkout ➔ Lesson View ➔ Complete Quiz ➔ Verify Certificate.
  - **Instructor**: Create course ➔ Populate section ➔ Submit for review ➔ Sales reports.
  - **Admin**: User lookup ➔ Approve course ➔ Activate license.

---

## 2. Test Commands Reference

Run tests inside the project workspace using:
```bash
# Run unit and integration tests
npm run test

# Run tests with coverage reporting
npm run test:coverage

# Run E2E Playwright tests
npm run test:e2e
```
