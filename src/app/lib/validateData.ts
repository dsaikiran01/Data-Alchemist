import { z } from "zod";

// Helper: comma-separated string → array
const commaSeparated = z.string().refine(
    (val) => val.trim().length > 0,
    "Must not be empty"
);

// Helper: phase list like [1,3] or "1-3"
const phaseArray = z.union([
    z.string().regex(/^(\d+(-\d+)?|\[(\d+,?)+\])$/, "Invalid phase format"),
    z.array(z.number()),
]);

export const clientSchema = z.object({
    ClientID: z.string().min(1),
    ClientName: z.string().min(1),
    PriorityLevel: z
        .string()
        .regex(/^[1-5]$/, "Must be 1 to 5")
        .transform(Number),
    RequestedTaskIDs: commaSeparated,
    GroupTag: z.string().min(1),
    AttributesJSON: z
        .string()
        .refine((val) => {
            try {
                JSON.parse(val);
                return true;
            } catch {
                return false;
            }
        }, "Must be valid JSON"),
});

export const workerSchema = z.object({
    WorkerID: z.string().min(1),
    WorkerName: z.string().min(1),
    Skills: commaSeparated,
    AvailableSlots: z
        .string()
        .refine((val) => {
            try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) && parsed.every((n) => typeof n === "number");
            } catch {
                return false;
            }
        }, "Must be an array of numbers like [1,2,3]"),
    MaxLoadPerPhase: z
        .string()
        .regex(/^\d+$/, "Must be an integer")
        .transform(Number),
    WorkerGroup: z.string().min(1),
    QualificationLevel: z.string().min(1),
});

export const taskSchema = z.object({
    TaskID: z.string().min(1),
    TaskName: z.string().min(1),
    Category: z.string().min(1),
    Duration: z
        .string()
        .regex(/^\d+$/, "Must be a number ≥1")
        .refine((v) => parseInt(v) >= 1, "Must be ≥1")
        .transform(Number),
    RequiredSkills: commaSeparated,
    PreferredPhases: phaseArray,
    MaxConcurrent: z
        .string()
        .regex(/^\d+$/, "Must be an integer")
        .transform(Number),
});
