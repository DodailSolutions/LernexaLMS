# API Reference Guide: Lernexa LMS

All public and authenticated routes are structured inside the App Router path: `src/app/api/...`.

## 1. REST Conventions & Standards

- **Headers**: `Content-Type: application/json` is required for all state-modifying requests.
- **Request Body Validation**: Every route endpoint MUST validate the incoming payload using a Zod schema before processing logic.
- **Status Codes**:
  - `200 OK` for successful retrievals.
  - `201 Created` for successfully completed creations.
  - `400 Bad Request` for failed input validation.
  - `401 Unauthorized` for missing/expired session tokens.
  - `403 Forbidden` for authenticated users lacking matching RBAC permissions.
  - `404 Not Found` for resource lookups that do not match existing keys.
  - `429 Too Many Requests` for rate-limit breaches.
  - `500 Internal Server Error` for unhandled exceptions.

---

## 2. Standard Error Response Body

All API routes return error responses matching the JSON format:
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "issue": "Invalid email format"
      }
    ]
  }
}
```

---

## 3. Core API Endpoint Definitions

### 3.1 Course Management
- `GET /api/courses` - Search and fetch courses (supports query filters for page, limit, level, category).
- `POST /api/courses` (Instructor/Admin) - Create course draft.
- `GET /api/courses/[id]` - Retrieve full course details (with sections and lessons).
- `PATCH /api/courses/[id]` (Instructor/Admin) - Update course metadata.

### 3.2 Curriculum & Lessons
- `POST /api/courses/[id]/sections` - Create section.
- `PATCH /api/sections/[sectionId]/reorder` - Reorder section curriculum indexes.
- `PATCH /api/lessons/[lessonId]/progress` (Student) - Save lesson completed status and watch time.

### 3.3 Payments & Checkout
- `POST /api/checkout/stripe` (Student) - Create checkout session.
- `POST /api/checkout/coupon` - Validate coupon validity.
- `POST /api/webhooks/stripe` - Payment verification endpoint.

### 3.4 Licensing Client
- `POST /api/licensing/activate` - Register active license keys.
- `POST /api/licensing/validate` - Cron/validate check.
