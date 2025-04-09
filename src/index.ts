import * as fs from "fs";
import * as Papa from "papaparse";
import * as path from "path";

export type DoctorRow = {
  "Doctor Name": string;
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
};

const daysISO = {
  monday: "1",
  tuesday: "2",
  wednesday: "3",
  thursday: "4",
  friday: "5",
  saturday: "6",
  sunday: "7",
} as const;

export function normalizeDay(input: string): keyof typeof daysISO | null {
  const lower = input.toLowerCase();
  return lower in daysISO
    ? (lower as keyof typeof daysISO)
    : ((Object.entries(daysISO).find(([, v]) => v === lower)?.[0] ?? null) as
        | keyof typeof daysISO
        | null);
}

export function findDoctors(
  day: keyof typeof daysISO,
  csvPath: string,
): string[] {
  const fileContent = fs.readFileSync(csvPath, { encoding: "utf8" });
  const parsed = Papa.parse<DoctorRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter((row) => row[capitalize(day) as keyof DoctorRow] === "ON")
    .map(({ "Doctor Name": name }) => name);
}

function capitalize(word: string): string {
  return word.length > 0 ? word[0].toUpperCase() + word.slice(1) : "";
}
