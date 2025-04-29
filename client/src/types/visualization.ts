import { z } from 'zod';

// Capacity data model schema
export const capacityDataSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Parking lot name is required" }),
  capacity: z.number().min(0, { message: "Capacity must be a positive number" }),
  available: z.number().min(0, { message: "Available spaces must be a positive number" })
});

// Usage by type data model schema
export const usageDataSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "User type is required" }),
  value: z.number().min(0, { message: "Percentage must be a positive number" }).max(100, { message: "Percentage cannot exceed 100%" })
});

// Availability trend data model schema
export const trendDataSchema = z.object({
  id: z.number().optional(),
  time: z.string().min(1, { message: "Time is required" }),
  available: z.number().min(0, { message: "Available spaces must be a positive number" })
});

// Types based on schemas
export type CapacityData = z.infer<typeof capacityDataSchema>;
export type UsageData = z.infer<typeof usageDataSchema>;
export type TrendData = z.infer<typeof trendDataSchema>;

// Create a model with ID field
export const insertCapacityDataSchema = capacityDataSchema.omit({ id: true });
export const insertUsageDataSchema = usageDataSchema.omit({ id: true });
export const insertTrendDataSchema = trendDataSchema.omit({ id: true });

export type InsertCapacityData = z.infer<typeof insertCapacityDataSchema>;
export type InsertUsageData = z.infer<typeof insertUsageDataSchema>;
export type InsertTrendData = z.infer<typeof insertTrendDataSchema>;