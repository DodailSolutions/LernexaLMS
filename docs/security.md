# Security Architecture: Lernexa LMS

Lernexa incorporates defense-in-depth principles to satisfy strict commercial compliance requirements.

## 1. Authentication and Passwords

- **Password Hashing**: Plaintext passwords are never stored. Passwords must be hashed using bcrypt (with a minimum cost factor of 12) before database insertion.
- **Session Management**: Session tokens are signed using a secure secret key, stored in `httpOnly`, `secure`, and `sameSite: strict` cookies to mitigate Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).
- **Session Expiry**: Inactive sessions automatically expire after 30 days.

---

## 2. Relational and Server-Side RBAC Enforcement

- **No Client-Only Hiding**: Simply hiding buttons in React UI is insufficient. Every Next.js API Route and Server Action MUST verify the user's role and specific permissions before executing database operations:
  ```typescript
  const session = await getSession();
  if (!session || !hasPermission(session.user.role, "course:publish")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  ```

---

## 3. OWASP Defenses

### 3.1 SQL Injection Prevention
By utilizing **Prisma ORM**, all query inputs are automatically parameterized, neutralizing SQL injection vectors. If raw queries are necessary, they must utilize Prisma's native `sql` tag templates to prevent concatenation vulnerabilities.

### 3.2 XSS (Cross-Site Scripting)
- Next.js automatically escapes values rendered in JSX.
- For rendering HTML content (like blog posts or lesson text descriptions), rich-text input must be sanitized on the server before database storage and prior to rendering using `isomorphic-dompurify`.

### 3.3 File Upload Security
- **MIME Validation**: Validate file extensions and verify actual magic numbers (file headers) to prevent execution of malicious scripts.
- **Randomized File Names**: File names must be generated using UUIDs upon upload to prevent local path traversal (`../`) vulnerabilities.
- **Storage Isolation**: Uploaded files should be saved in private buckets (e.g. AWS S3 or Cloudflare R2) rather than local public folders.

### 3.4 Rate Limiting
Crucial API endpoints (`/api/auth/login`, `/api/auth/register`, `/api/licensing/activate`) utilize rate-limiting filters (via Upstash or memory cache) to prevent brute-force attacks.
