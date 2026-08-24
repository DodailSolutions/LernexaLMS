# System Architecture: Lernexa LMS

Lernexa LMS utilizes a modern, modular, feature-based architecture built on top of Next.js (App Router).

## 1. Directory Structure Blueprint

```text
src/
├── app/                        # Next.js App Router (Routing and Pages)
│   ├── (public)/               # Static/dynamic public pages (Marketplace, Landing)
│   ├── (auth)/                 # Authentication page routes
│   ├── install/                # Step-by-step setup installer wizard
│   ├── dashboard/              # Student dashboard
│   ├── instructor/             # Instructor workspace (Curriculum Builder)
│   ├── admin/                  # Central Admin portal (Licensing, Settings)
│   └── api/                    # Public and private REST endpoints
│
├── features/                   # Encapsulated feature domains
│   ├── auth/                   # Credentials, session middleware, RBAC checks
│   ├── licensing/              # License checks, local cache, crypto signatures
│   ├── courses/                # Video learning, course state machine
│   ├── commerce/               # Stripe checkout, shopping cart, discounts
│   └── mentorship/             # Meeting calendars, booking state machine
│
├── components/                 # Shared UI and layout systems
│   ├── ui/                     # shadcn/ui components (Buttons, Cards, Dialogs)
│   ├── layout/                 # Global headers, footers, and sidebar components
│   └── shared/                 # Generic reusable components
│
├── lib/                        # Singletons and SDK configurations
│   ├── db.ts                   # Prisma client instantiation
│   ├── stripe.ts               # Stripe payment client wrapper
│   └── crypto.ts               # Cryptographic utilities (public key signature verification)
```

---

## 2. Dynamic Data Flow

### 2.1 Course Purchase Flow
```mermaid
sequenceDiagram
    participant Student as Student Browser
    participant API as Next.js API Route
    participant Stripe as Stripe Gateway
    participant DB as Prisma/MySQL DB
    
    Student->>API: POST /api/checkout (Course ID, Coupon)
    API->>DB: Check price & coupon validity
    DB-->>API: Validated price data
    API->>Stripe: Create checkout session
    Stripe-->>API: Session ID + URL
    API-->>Student: Redirect to Stripe Checkout
    Student->>Stripe: Enter Card details & Authorize
    Stripe->>API: Webhook payment_intent.succeeded
    API->>DB: Create Order, Mark paid, Create Enrollment
    API-->>Student: Redirect to success page (Success Toast)
```

### 2.2 Client-Side License Verification
```mermaid
graph TD
    A[LMS Startup] --> B{Local Cache Valid?}
    B -- Yes --> C[Run Normal Operations]
    B -- No --> D[Request LICENSE_API_URL]
    D -- Success --> E[Verify Cryptographic Signature using Public Key]
    E -- Match --> F[Update Cache & Continue]
    E -- Mismatch/Hack --> G[Enter Grace Period / Show Setup Wizard]
    D -- Server Offline --> H[Enter 7-14 Days Grace Period]
    H --> C
```

---

## 3. Technology Stack Decisions

- **Framework**: Next.js 15 (App Router, Server Actions for lightweight updates, Server Components for SEO and speed).
- **Styling**: Tailwind CSS (clean utility utility-first layout styling).
- **ORM**: Prisma ORM mapping directly to a MySQL instance.
- **State Management**: React Context / Zustand for lightweight client state (Cart, active filters).
