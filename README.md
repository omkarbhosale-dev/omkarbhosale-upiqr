[Official Documentation](https://omkarbhosale-upiqr.vercel.app/)

Install the package using the following command

```bash
npm i @omkarbhosale/upiqr
```

Once the package is installed, you can import the library using import:

```javascript
import generateQR from "@omkarbhosale/upiqr";
```

## Example

```javascript
// Import the package
import generateQR from "@omkarbhosale/upiqr";

// Async funtion is required to generate the QR and retrun the promise as Base64 URL

const qrData = async () => {
  try {
    // Get the Base64 string by using generateQR() function.
    // UPI_ID accepts the UPI ID where to recive money in
    // AMOUNT must be an integer or float.

    let data = await generateQR({ UPI_ID: "omkar@upi", AMOUNT: 1234 });

    // The above code will generate and return the Base64 Code
    console.log(data);
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};

qrData();
```

## Authors

- [Omkar Bhosale](https://x.com/Omkar_Bhosale7)
