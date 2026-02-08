import CryptoJS from 'crypto-js';

// Encrypt data using the Master Password
export const encryptData = (text: string, masterPassword: string) => {
  return CryptoJS.AES.encrypt(text, masterPassword).toString();
};

// Decrypt data when viewing the vault
export const decryptData = (ciphertext: string, masterPassword: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, masterPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
};