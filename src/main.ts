/**
 * Adds two numbers together.
 * @param UPI_ID - It stores the user's unique payment identifier, which is a string in this case.
 * @param AMOUNT - It stores the amount to be transferred, which is a number in this case.
 * @returns - The function returns the base64 image of the QR code for the given UPI ID and AMOUNT.
 */

const QRCode = require("qrcode");

type FunctionParams = {
  UPI_ID: string;
  AMOUNT: number;
};

const generateQR = async ({
  UPI_ID,
  AMOUNT,
}: FunctionParams): Promise<string> => {
  const upiURL: string = `upi://pay?pa=${UPI_ID}&am=${AMOUNT}`;
  try {
    const qrCodeDataURL = await QRCode.toDataURL(upiURL);

    // const base64String = qrCodeDataURL.split(",")[1];

    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("QR code generation failed");
  }
};

export default generateQR;
