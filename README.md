# @omkarbhosale/upiqr

A dynamic UPI QR code generator for Node.js and TypeScript, supporting single transaction QR generation and automatic split transactions for amounts exceeding ₹2,000.

[Official Documentation](https://omkarbhosale-upiqr.vercel.app/)

## Installation

```bash
npm i @omkarbhosale/upiqr
```

## Features

- ⚡ **Dynamic UPI QR Generation**: Generates clean base64 Data URLs for UPI payment links.
- ✂️ **Automatic Split Transactions (`splitTransactionQR`)**: Splits transactions above ₹2,000 into ₹1,999 chunks (e.g. ₹5,000 ➔ ₹1,999 + ₹1,999 + ₹1,002) with unique IDs and base64 QR codes.
- 🛡️ **Zod Validation**: Fully validated inputs for UPI ID format and limits.
- 📦 **Full TypeScript Support**: Generates declaration types with ESM and named export support.

## Usage

### 1. Standard QR Code (`generateQR`)

```javascript
import { generateQR } from "@omkarbhosale/upiqr";

const run = async () => {
  try {
    const qrDataUrl = await generateQR({
      UPI_ID: "omkar@upi",
      AMOUNT: 1500,
      name: "Omkar Bhosale",     // optional payee name
      note: "Payment for order",  // optional note
    });

    console.log(qrDataUrl); // data:image/png;base64,...
  } catch (error) {
    console.error("Error generating QR:", error.message);
  }
};

run();
```

### 2. Split Transaction QR Codes (`splitTransactionQR`)

For transactions exceeding ₹2,000 (e.g. ₹5,000), `splitTransactionQR` splits the payment into intervals of ₹1,999 and returns an array of JSON objects containing the unique ID, splitted amount, and base64 image:

```javascript
import { splitTransactionQR } from "@omkarbhosale/upiqr";

const run = async () => {
  try {
    const qrList = await splitTransactionQR({
      UPI_ID: "omkar@upi",
      AMOUNT: 5000,
    });

    console.log(qrList);
    /*
    [
      {
        id: "a1b2c3d4-e5f6-...",
        amount: 1999,
        image: "data:image/png;base64,..."
      },
      {
        id: "b2c3d4e5-f6a7-...",
        amount: 1999,
        image: "data:image/png;base64,..."
      },
      {
        id: "c3d4e5f6-a7b8-...",
        amount: 1002,
        image: "data:image/png;base64,..."
      }
    ]
    */
  } catch (error) {
    console.error("Validation or generation error:", error.message);
  }
};

run();
```

### Custom Split Interval & Threshold

You can also customize the split interval or threshold if needed:

```javascript
const qrList = await splitTransactionQR({
  UPI_ID: "omkar@upi",
  AMOUNT: 10000,
  splitInterval: 1999, // default: 1999
  threshold: 2000,     // default: 2000
});
```

## Authors

- [Omkar Bhosale](https://x.com/Omkar_Bhosale7)
