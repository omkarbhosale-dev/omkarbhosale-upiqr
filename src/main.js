"use strict";
/**
 * Adds two numbers together.
 * @param UPI_ID - It stores the user's unique payment identifier, which is a string in this case.
 * @param AMOUNT - It stores the amount to be transferred, which is a number in this case.
 * @returns - The function returns the base64 image of the QR code for the given UPI ID and AMOUNT.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const QRCode = require("qrcode");
const generateQR = (_a) => __awaiter(void 0, [_a], void 0, function* ({ UPI_ID, AMOUNT, }) {
    const upiURL = `upi://pay?pa=${UPI_ID}&am=${AMOUNT}`;
    try {
        const qrCodeDataURL = yield QRCode.toDataURL(upiURL);
        // const base64String = qrCodeDataURL.split(",")[1];
        return qrCodeDataURL;
    }
    catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("QR code generation failed");
    }
});
exports.default = generateQR;
