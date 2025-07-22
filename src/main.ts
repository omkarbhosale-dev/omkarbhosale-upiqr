/**
 * Adds two numbers together.
 * @param UPI_ID - It stores the user's unique payment identifier, which is a string in this case.
 * @param AMOUNT - It stores the amount to be transferred, which is a number in this case.
 * @returns - The function returns the base64 image of the QR code for the given UPI ID and AMOUNT.
 */
// main.ts or wherever you use generateQR
import QRCode from "qrcode";
import { qrParamsSchema, QRParams } from "./schema"; // adjust path as needed

const generateQR = async (params: QRParams): Promise<string> => {
  const parsed = qrParamsSchema.safeParse(params);

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map((e) => e.message).join(", ");
    throw new Error(`Validation error: ${errorMessages}`);
  }

  const { UPI_ID, AMOUNT } = parsed.data;
  const upiURL = `upi://pay?pa=${UPI_ID}&am=${AMOUNT}`;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(upiURL);
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("QR code generation failed");
  }
};


export default generateQR;
