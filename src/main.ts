/**
 * Adds two numbers together.
 * @param UPI_ID - It stores the user's unique payment identifier, which is a string in this case.
 * @param AMOUNT - It stores the amount to be transferred, which is a number in this case.
 * @returns - The function returns the base64 image of the QR code for the given UPI ID and AMOUNT.
 */
import QRCode from "qrcode";

interface FunctionParams {
  UPI_ID: string;
  AMOUNT: number;
}

const generateQR = async ({
  UPI_ID,
  AMOUNT,
}: FunctionParams): Promise<string> => {
  if (typeof AMOUNT !== "number")
    throw new Error("Invalid amount type, expected number");
  if (AMOUNT <= 0)
    throw new Error("Invalid amount, expected amount more than 0");
  if (AMOUNT >= 100000)
    throw new Error("Inavlied amount, UPI Amount Limit is under 1L");
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
