import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatRelative,
  generateSlug,
  mapDatabaseError,
} from "./utils-enhanced";

describe("utils-enhanced", () => {
  describe("formatDate", () => {
    it("formats a date correctly", () => {
      const date = new Date(2023, 9, 24); // Oct 24, 2023
      expect(formatDate(date)).toBe("Oct 24, 2023");
    });
  });

  describe("formatDateTime", () => {
    it("formats a date and time correctly", () => {
      const date = new Date(2023, 9, 24, 10, 30);
      // Depending on locale/timezone, but let's assume standard formatting for now
      // Or we can just check if it contains the date parts
      const result = formatDateTime(date);
      expect(result).toContain("October 24, 2023");
      expect(result).toContain("10:30 AM");
    });
  });

  describe("formatRelative", () => {
    it("formats a relative date correctly", () => {
      // Just check if it returns a string for now as "now" is dynamic
      expect(typeof formatRelative(new Date())).toBe("string");
      expect(formatRelative(new Date())).toContain("ago");
    });
  });

  describe("generateSlug", () => {
    it("generates a slug from a string", () => {
      expect(generateSlug("Hello World!")).toBe("hello-world");
      expect(generateSlug("  Space Trim  ")).toBe("space-trim");
      expect(generateSlug("Special @# Characters")).toBe("special-characters");
    });
  });

  describe("mapDatabaseError", () => {
    it("maps unique constraint violation", () => {
      const error = { code: "P2002" };
      expect(mapDatabaseError(error).message).toBe("This record already exists.");
    });

    it("maps foreign key violation", () => {
      const error = { code: "P2003" };
      expect(mapDatabaseError(error).message).toBe(
        "This operation could not be completed because of a related record.",
      );
    });

    it("returns a generic message for unknown errors", () => {
      const error = { code: "UNKNOWN" };
      expect(mapDatabaseError(error).message).toBe("An unexpected database error occurred.");
    });
  });
});
