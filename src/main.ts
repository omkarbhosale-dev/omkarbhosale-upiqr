import { randomUUID } from "node:crypto";
import QRCode from "qrcode";
import {
  qrParamsSchema,
  QRParams,
  splitQRParamsSchema,
  SplitQRParams,
  splitQRItemSchema,
  SplitQRItem,
} from "./schema.js";

export * from "./schema.js";

/**
 * Generates a base64 Data URL QR code for a single UPI transaction.
 *
 * @param params - Configuration object containing UPI_ID, AMOUNT, and optional metadata (name, note, currency).
 * @returns Promise resolving to the base64 Data URL string of the generated QR code.
 *
 * @example
 * ```ts
 * const qr = await generateQR({ UPI_ID: "merchant@upi", AMOUNT: 500 });
 * console.log(qr); // data:image/png;base64,...
 * ```
 */
export const generateQR = async (params: QRParams): Promise<string> => {
  const parsed = qrParamsSchema.safeParse(params);

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "params"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Validation error: ${errorMessages}`);
  }

  const { UPI_ID, AMOUNT, name, note, currency = "INR" } = parsed.data;

  // Format amount: integer if whole number, or formatted up to 2 decimals
  const formattedAmount = Number.isInteger(AMOUNT)
    ? AMOUNT.toString()
    : AMOUNT.toFixed(2);

  const queryParams = new URLSearchParams({
    pa: UPI_ID,
    am: formattedAmount,
    cu: currency,
  });

  if (name) {
    queryParams.set("pn", name);
  }
  if (note) {
    queryParams.set("tn", note);
  }

  const upiURL = `upi://pay?${queryParams.toString()}`;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(upiURL);
    return qrCodeDataURL;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`QR code generation failed: ${message}`);
  }
};

/**
 * Splits a UPI transaction exceeding the threshold (default: ₹2,000)
 * into intervals (default: ₹1,999 chunks) and generates a QR code for each split amount.
 *
 * For example, an amount of ₹5,000 will be split into: ₹1,999 + ₹1,999 + ₹1,002.
 * If the amount is less than or equal to the threshold (e.g. ₹2,000), a single QR code is generated.
 *
 * @param params - Configuration object containing UPI_ID, AMOUNT, and optional splitInterval, threshold, name, note.
 * @returns Promise resolving to an array of objects containing the unique ID, chunk amount, and base64 QR code image.
 *
 * @example
 * ```ts
 * const splitQRs = await splitTransactionQR({
 *   UPI_ID: "merchant@upi",
 *   AMOUNT: 5000,
 * });
 * // Returns [
 * //   { id: "...", amount: 1999, image: "data:image/png;base64,..." },
 * //   { id: "...", amount: 1999, image: "data:image/png;base64,..." },
 * //   { id: "...", amount: 1002, image: "data:image/png;base64,..." },
 * // ]
 * ```
 */
export const splitTransactionQR = async (
  params: SplitQRParams
): Promise<SplitQRItem[]> => {
  const parsed = splitQRParamsSchema.safeParse(params);

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "params"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Validation error: ${errorMessages}`);
  }

  const {
    UPI_ID,
    AMOUNT,
    splitInterval = 1999,
    threshold = 2000,
    name,
    note,
    currency,
  } = parsed.data;

  // Work with integer paise to avoid IEEE-754 floating-point inaccuracies
  let remainingPaise = Math.round(AMOUNT * 100);
  const thresholdPaise = Math.round(threshold * 100);
  const intervalPaise = Math.round(splitInterval * 100);

  const chunkAmounts: number[] = [];

  if (remainingPaise <= thresholdPaise) {
    chunkAmounts.push(AMOUNT);
  } else {
    while (remainingPaise > intervalPaise) {
      chunkAmounts.push(intervalPaise / 100);
      remainingPaise -= intervalPaise;
    }
    if (remainingPaise > 0) {
      chunkAmounts.push(remainingPaise / 100);
    }
  }

  // Generate QR codes concurrently for optimal performance
  const results = await Promise.all(
    chunkAmounts.map(async (splitAmount, index) => {
      const chunkNote = note ? `${note} (Part ${index + 1}/${chunkAmounts.length})` : undefined;
      const image = await generateQR({
        UPI_ID,
        AMOUNT: splitAmount,
        name,
        note: chunkNote,
        currency,
      });

      const item: SplitQRItem = {
        id: randomUUID(),
        amount: splitAmount,
        image,
      };

      return item;
    })
  );

  // Validate the generated results before returning
  const validatedResults = results.map((item) => {
    const itemParsed = splitQRItemSchema.safeParse(item);
    if (!itemParsed.success) {
      throw new Error(
        `Failed to validate split QR output: ${itemParsed.error.issues.map((i) => i.message).join(", ")}`
      );
    }
    return itemParsed.data;
  });

  return validatedResults;
};

// Default export with attached helper for maximum backwards compatibility
const defaultExport = Object.assign(generateQR, {
  generateQR,
  splitTransactionQR,
});

export default defaultExport;
