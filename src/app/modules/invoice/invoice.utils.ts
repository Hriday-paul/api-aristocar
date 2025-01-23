import crypto from 'crypto';

export const generateUniqueInvoiceNumber = (): string => {
  const timestamp = Date.now().toString(); // Get current timestamp
  const randomString = crypto.randomBytes(3).toString('hex'); // Generate random 6-character string
  return `INV-${timestamp}-${randomString}`; // Combine to create unique invoice number
};
