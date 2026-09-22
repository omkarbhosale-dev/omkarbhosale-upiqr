import { z } from "zod";

/**
 * Zod schema for validating a standard UPI ID.
 * Matches standard formats like username@bank, mobile@upi, etc.
 */
export const upiIdSchema = z
  .string({ message: "UPI ID must be a string" })
  .trim()
  .min(3, "UPI ID is too short")
  .max(50, "UPI ID is too long")
  .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format. Expected format: username@bank");

/**
 * Zod schema for standard single QR code generation.
 */
export const qrParamsSchema = z.object({
  UPI_ID: upiIdSchema,
  AMOUNT: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number")
    .lte(100000, "Amount must be less than or equal to ₹1,00,000"),
  name: z.string().trim().max(100).optional(),
  note: z.string().trim().max(100).optional(),
  currency: z.string().trim().default("INR").optional(),
});

export type QRParams = z.infer<typeof qrParamsSchema>;

/**
 * Zod schema for split transaction parameters.
 */
export const splitQRParamsSchema = z.object({
  UPI_ID: upiIdSchema,
  AMOUNT: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number")
    .lte(1000000, "Amount must be less than or equal to ₹10,00,000"),
  splitInterval: z
    .number({ message: "splitInterval must be a number" })
    .positive("splitInterval must be greater than 0")
    .finite("splitInterval must be a finite number")
    .lte(100000, "splitInterval cannot exceed ₹1,00,000")
    .default(1999)
    .optional(),
  threshold: z
    .number({ message: "threshold must be a number" })
    .positive("threshold must be greater than 0")
    .finite("threshold must be a finite number")
    .default(2000)
    .optional(),
  name: z.string().trim().max(100).optional(),
  note: z.string().trim().max(100).optional(),
  currency: z.string().trim().default("INR").optional(),
});

export type SplitQRParams = z.infer<typeof splitQRParamsSchema>;

/**
 * Zod schema for individual split QR item in the returned array.
 */
export const splitQRItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  image: z.string().startsWith("data:image/", "Image must be a valid base64 Data URL"),
});

export type SplitQRItem = z.infer<typeof splitQRItemSchema>;
