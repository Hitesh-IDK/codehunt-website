import crypto from "crypto";
import config from "./config";

const { secret_key, secret_iv, ecnryption_method } = config;

if (!secret_key || !secret_iv || !ecnryption_method) {
  //   throw new Error("secretKey, secretIV, and ecnryptionMethod are required");
  console.log(config);
}

// Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash("sha512")
  .update(secret_key)
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update(secret_iv)
  .digest("hex")
  .substring(0, 16);

// Encrypt data
export function encryptData(data: string): string | null {
  try {
    const cipher = crypto.createCipheriv(ecnryption_method, key, encryptionIV);
    return Buffer.from(
      cipher.update(data, "utf8", "hex") + cipher.final("hex")
    ).toString("base64");
    // Encrypts data and converts to hex and base64
  } catch (e: any) {
    return null;
  }
}

// Decrypt data
export function decryptData(encryptedData: string): string | null {
  try {
    const buff = Buffer.from(encryptedData, "base64");
    const decipher = crypto.createDecipheriv(
      ecnryption_method,
      key,
      encryptionIV
    );
    return (
      decipher.update(buff.toString("utf8"), "hex", "utf8") +
      decipher.final("utf8")
    ); // Decrypts data and converts to utf8
  } catch (e: any) {
    return null;
  }
}

export function generateRandomNumber(length: number): string {
  let randomNumber = "";

  while (length > 0) {
    randomNumber = randomNumber.concat(
      Math.floor(Math.random() * 10).toString()
    );
    length--;
  }

  return randomNumber;
}
