import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, signToken, verifyToken } from "./jwt";

describe("JWT auth helpers", () => {
  it("should hash and verify passwords correctly", async () => {
    const password = "securePassword123";
    const hash = await hashPassword(password);
    
    expect(hash).not.toBe(password);
    expect(await comparePassword(password, hash)).toBe(true);
    expect(await comparePassword("wrongPassword", hash)).toBe(false);
  });

  it("should sign and verify tokens correctly", () => {
    const payload = { userId: "test-user-id", role: "Student" };
    const token = signToken(payload);
    
    expect(token).toBeDefined();
    
    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.role).toBe(payload.role);
  });

  it("should return null for invalid tokens", () => {
    expect(verifyToken("invalidToken")).toBeNull();
  });
});
