import { describe, it, expect, afterEach } from "vitest";
import { findDoctors, normalizeDay } from "./index";
import * as fs from "fs";

describe("normalizeDay", () => {
  it("converts full name to lowercase day", () => {
    expect(normalizeDay("Monday")).toBe("monday");
    expect(normalizeDay("3")).toBe("wednesday");
    expect(normalizeDay("8")).toBe(null);
  });
});

describe("findDoctors", () => {
  const testFile = "test.csv";

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });

  it("returns correct doctors for Monday", () => {
    const doctors = findDoctors("monday", "src/doctors.csv");
    expect(doctors).toContain("Dr. Lynch");
    expect(doctors).toContain("Dr. Jefferson");
    expect(doctors).not.toContain("Dr. Moreau");
  });

  it("returns empty array for no ON doctors", () => {
    const csv = `Doctor Name,Monday\nDr. Who,OFF`;
    fs.writeFileSync(testFile, csv);
    const results = findDoctors("monday", testFile);
    expect(results).toEqual([]);
  });
});
