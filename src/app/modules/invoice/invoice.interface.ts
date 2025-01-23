import mongoose from 'mongoose';

export interface Iinvoice {
  userId: Object;
  paymentId: Object;
  invoiceDate: Date;
  invoiceNumber: string;
  vatAmount: string;
  totalAmount: string;
  isDeleted: boolean;
  subscriptionId: Object;
}
