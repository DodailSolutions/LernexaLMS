# Deployment Guide: Lernexa LMS

Lernexa LMS supports Docker-based deployments, serverless configurations, or standard VPS setups.

## 1. Environment Configurations Checklist

Create a secure `.env` file in the root directory:
```ini
# General Environment
NODE_ENV=production
NEXTAUTH_SECRET=your_32_byte_secret_key_here
NEXTAUTH_URL=https://your-domain.com

# Database Connection
DATABASE_URL="mysql://username:password@localhost:3306/lernexa"

# Pluggable Storage Providers
STORAGE_PROVIDER=s3 # options: local, s3, r2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=lernexa-media

# Stripe Integrations
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Central Licensing Configuration
LICENSE_API_URL=https://licenses.lernexa.com/api/v1
LICENSE_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
```

---

## 2. Docker & Containerization

A `Dockerfile` and a `docker-compose.yml` are provided in the root directory to simplify self-hosted deployments.

### Running with Docker Compose
To boot the full stack (Next.js Node server + MySQL 8.0):
```bash
docker-compose up -d --build
```
This sets up:
- Next.js application running on port `3000`.
- MySQL database running on port `3306`, exposing persistent volumes to prevent data loss.

---

## 3. Production Optimizations

- **Nginx Reverse Proxy**: Always configure Nginx with SSL certificates (Let's Encrypt) to proxy requests to port `3000`. Enable Gzip compression and secure headers.
- **Next.js Caching**: Ensure the Next.js server utilizes Redis or filesystem caching for ISR (Incremental Static Regeneration) pages.
- **Database Migrations**: In production environments, run migrations before launching the application:
  ```bash
  npx prisma migrate deploy
  ```
