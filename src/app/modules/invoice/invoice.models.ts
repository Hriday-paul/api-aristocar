import mongoose, { Schema } from 'mongoose';
import { Iinvoice } from './invoice.interface';

const InvoiceSchema: Schema<Iinvoice> = new Schema(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
    invoiceDate: { type: Date, required: true },
    invoiceNumber: { type: String, required: true },
    totalAmount: { type: String, required: true },
  },
  { timestamps: true },
);

const invoice = mongoose.model<Iinvoice>('invoice', InvoiceSchema);
export default invoice;
