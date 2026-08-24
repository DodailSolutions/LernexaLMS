# Licensing Client Architecture: Lernexa LMS

Lernexa LMS includes a secure licensing client module to manage commercial distribution.

## 1. Cryptographic Signature Verification

To prevent licensing bypasses, the LMS does not merely check for a `success: true` response (which can be easily intercepted or mocked by spoofing hosts). 

1. The license server generates a JSON response payload.
2. The license server signs this payload using its **Private RSA Key**.
3. The response contains the payload + a `signature` property.
4. The LMS client verifies the signature using the embedded **Public RSA Key** of the licensing platform.
5. If the signature does not match, the license is flagged as invalid.

---

## 2. Dynamic Domain and Environment Normalization

Licenses are bound to customer domains (e.g. `yourdomain.com`).
- Before sending verification requests, the client normalizes domains: removes subdomains (like `www.`), strips trailing slashes, and downcases strings.
- Local environments (`localhost`, `127.0.0.1`, or `*.local` domains) are detected and allowed for development activations if the license key configuration permits dev installations.

---

## 3. License Grace Period Caching

To ensure the LMS does not fail if the licensing server is temporarily offline:
- **Last Successful Validation**: Stored inside the local database with a timestamp.
- **Offline Grace Period**: 7 to 14 days (configurable).
- **Validation Retry**: The client automatically retries verification in the background via a cron schedule.
- **Safety Rule**: If the grace period expires, the admin dashboard is locked, but customer files and database records are **never deleted**.

---

## 4. API Verification Schema

### Request Payload (`POST LICENSE_API_URL/validate`)
```json
{
  "licenseKey": "LERNEXA-XXXX-XXXX-XXXX",
  "domain": "customerdomain.com",
  "installationId": "uuid-v4-generated-on-install",
  "productVersion": "1.0.0"
}
```

### Server Response Payload
```json
{
  "success": true,
  "status": "active",
  "supportUntil": "2027-08-24T00:00:00Z",
  "updatesUntil": "2027-08-24T00:00:00Z",
  "signature": "base64-cryptographic-signature"
}
```
