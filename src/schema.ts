import { z } from "zod";

export const qrParamsSchema = z.object({
  UPI_ID: z
    .string()
    .min(5, "UPI ID is too short")
    .max(50, "UPI ID is too long")
    .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format"),
  AMOUNT: z
    .number()
    .positive("Amount must be greater than 0")
    .lt(100000, "Amount must be less than ₹1,00,000"),
});

export type QRParams = z.infer<typeof qrParamsSchema>;
